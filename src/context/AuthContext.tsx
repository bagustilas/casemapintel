'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserDevice, UserSession } from '@/types/case';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';

interface AuthContextType {
  session: UserSession | null;
  isLoading: boolean;
  isCloudConnected: boolean;
  devices: UserDevice[];
  login: (waNumber: string, licenseKey: string, fullName?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (fullName: string, organization?: string) => void;
  toggleCloudSync: (enable: boolean) => void;
  removeDevice: (deviceId: string) => Promise<void>;
  refreshDevices: () => Promise<void>;
}

const AUTH_STORAGE_KEY = 'caseintel_auth_session';
const DEVICES_STORAGE_KEY = 'caseintel_auth_devices';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return 'dev-server';
  let devId = localStorage.getItem('caseintel_device_id');
  if (!devId) {
    devId = 'dev_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
    localStorage.setItem('caseintel_device_id', devId);
  }
  return devId;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [devices, setDevices] = useState<UserDevice[]>([]);

  // Initialize session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSession(parsed);
      } else {
        // Default guest / demo session if not logged in
        const defaultSession: UserSession = {
          whatsappNumber: '0812-3456-7890',
          licenseKey: 'CASEINTEL-PRO-2026',
          fullName: 'Advokat / Penyidik Tamu',
          organization: 'Kantor Advokat & Konsultan Hukum',
          licenseExpiry: '2026-12-31T23:59:59.000Z',
          deviceId: getOrCreateDeviceId(),
          deviceName: navigator.userAgent.includes('Windows') ? 'Windows PC' : 'Web Client',
          isCloudSyncActive: true,
        };
        setSession(defaultSession);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultSession));
      }
      setIsCloudConnected(isSupabaseConfigured());
    } catch (e) {
      console.error('Failed to restore auth session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync devices when session changes
  useEffect(() => {
    if (session) {
      refreshDevices();
    }
  }, [session?.licenseKey]);

  const refreshDevices = async () => {
    if (!session) return;
    const currentDevId = getOrCreateDeviceId();
    const currentDeviceName = navigator.userAgent.includes('Windows')
      ? 'Windows PC (Perangkat Ini)'
      : 'Web Client (Perangkat Ini)';

    const supabase = getSupabaseClient();
    if (supabase && session.isCloudSyncActive) {
      try {
        // Register current device
        await supabase.from('user_devices').upsert(
          {
            license_key: session.licenseKey,
            device_id: currentDevId,
            device_name: currentDeviceName,
            device_type: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
            user_agent: navigator.userAgent,
            is_active: true,
            last_active: new Date().toISOString(),
          },
          { onConflict: 'license_key,device_id' }
        );

        // Fetch all active devices for this license
        const { data } = await supabase
          .from('user_devices')
          .select('*')
          .eq('license_key', session.licenseKey)
          .eq('is_active', true);

        if (data && data.length > 0) {
          setDevices(
            data.map((d: any) => ({
              id: d.id,
              deviceId: d.device_id,
              deviceName: d.device_name,
              deviceType: d.device_type,
              lastActive: d.last_active,
              isCurrent: d.device_id === currentDevId,
            }))
          );
          return;
        }
      } catch (e) {
        console.warn('Supabase device sync failed, falling back to local devices:', e);
      }
    }

    // Local fallback devices
    const localDevs: UserDevice[] = [
      {
        id: '1',
        deviceId: currentDevId,
        deviceName: currentDeviceName,
        deviceType: 'desktop',
        lastActive: new Date().toISOString(),
        isCurrent: true,
      },
    ];
    setDevices(localDevs);
  };

  const login = async (waNumber: string, licenseKey: string, fullName?: string): Promise<boolean> => {
    const deviceId = getOrCreateDeviceId();
    const newSession: UserSession = {
      whatsappNumber: waNumber,
      licenseKey: licenseKey.trim().toUpperCase(),
      fullName: fullName || 'Pengguna CaseIntel',
      organization: 'Kantor Hukum & Penegak Hukum',
      licenseExpiry: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
      deviceId,
      deviceName: navigator.userAgent.includes('Windows') ? 'Windows PC' : 'Web Client',
      isCloudSyncActive: true,
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('user_profiles').upsert(
          {
            whatsapp_number: waNumber,
            license_key: licenseKey.trim().toUpperCase(),
            full_name: newSession.fullName,
            organization: newSession.organization,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'whatsapp_number' }
        );
      } catch (e) {
        console.warn('Could not sync profile to Supabase on login:', e);
      }
    }

    setSession(newSession);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newSession));
    await refreshDevices();
    return true;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setSession(null);
  };

  const updateProfile = (fullName: string, organization?: string) => {
    if (!session) return;
    const updated = { ...session, fullName, organization: organization || session.organization };
    setSession(updated);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));

    const supabase = getSupabaseClient();
    if (supabase && session.isCloudSyncActive) {
      supabase.from('user_profiles').upsert({
        whatsapp_number: session.whatsappNumber,
        license_key: session.licenseKey,
        full_name: fullName,
        organization: organization || session.organization,
      });
    }
  };

  const toggleCloudSync = (enable: boolean) => {
    if (!session) return;
    const updated = { ...session, isCloudSyncActive: enable };
    setSession(updated);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
  };

  const removeDevice = async (deviceId: string) => {
    const supabase = getSupabaseClient();
    if (supabase && session?.isCloudSyncActive) {
      await supabase
        .from('user_devices')
        .update({ is_active: false })
        .eq('license_key', session.licenseKey)
        .eq('device_id', deviceId);
    }
    setDevices((prev) => prev.filter((d) => d.deviceId !== deviceId));
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        isCloudConnected,
        devices,
        login,
        logout,
        updateProfile,
        toggleCloudSync,
        removeDevice,
        refreshDevices,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
