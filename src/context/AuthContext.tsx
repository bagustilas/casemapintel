'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserDevice, UserRole, UserSession, LicenseTier, LicenseInfo } from '@/types/case';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  validateLicenseKey,
  generateNewLicenseKey,
  PRESET_LICENSES,
  isSuperAdminUser,
  SUPERADMIN_SECRET_PIN,
  getIssuedLicensesList,
} from '@/lib/license';

interface AuthContextType {
  session: UserSession | null;
  isLoading: boolean;
  isCloudConnected: boolean;
  isSuperAdmin: boolean;
  devices: UserDevice[];
  issuedLicenses: LicenseInfo[];
  login: (
    waNumber: string,
    licenseKey: string,
    fullName?: string,
    role?: UserRole,
    organization?: string
  ) => Promise<{ success: boolean; message: string }>;
  loginAsSuperAdmin: (
    pinOrKey: string,
    waNumber?: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (
    fullName: string,
    role?: UserRole,
    organization?: string,
    waNumber?: string
  ) => void;
  updateLicense: (licenseKey: string) => { success: boolean; message: string };
  generateLicenseAsAdmin: (
    tier: LicenseTier,
    durationDays: number,
    issuedTo: string
  ) => { success: boolean; license?: LicenseInfo; message: string };
  toggleCloudSync: (enable: boolean) => void;
  removeDevice: (deviceId: string) => Promise<void>;
  logoutOtherDevices: () => Promise<void>;
  refreshDevices: () => Promise<void>;
  quickLoginAs: (presetKey: string, role?: UserRole) => Promise<void>;
}

const AUTH_STORAGE_KEY = 'caseintel_auth_session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function detectClientEnvironment(): { deviceName: string; browser: string; os: string; deviceType: 'desktop' | 'mobile' | 'tablet' } {
  if (typeof window === 'undefined') {
    return { deviceName: 'Server Session', browser: 'Node', os: 'Server', deviceType: 'desktop' };
  }

  const ua = navigator.userAgent;
  let browser = 'Browser Web';
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Google Chrome';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Apple Safari';
  else if (ua.includes('Firefox')) browser = 'Mozilla Firefox';
  else if (ua.includes('Edg')) browser = 'Microsoft Edge';

  let os = 'Sistem Operasi';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Macintosh') || ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  const isMobile = /Android|iPhone/i.test(ua);
  const isTablet = /iPad|Tablet/i.test(ua);
  const deviceType: 'desktop' | 'mobile' | 'tablet' = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
  const deviceName = `${os} (${browser})`;

  return { deviceName, browser, os, deviceType };
}

function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return 'dev-server';
  let devId = localStorage.getItem('caseintel_device_id');
  if (!devId) {
    devId = 'dev_' + Math.random().toString(36).substring(2, 8) + '_' + Date.now().toString(36);
    localStorage.setItem('caseintel_device_id', devId);
  }
  return devId;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [devices, setDevices] = useState<UserDevice[]>([]);
  const [issuedLicenses, setIssuedLicenses] = useState<LicenseInfo[]>([]);

  // Initialize session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed: UserSession = JSON.parse(stored);
        setSession(parsed);
      }
      setIsCloudConnected(isSupabaseConfigured());
      setIssuedLicenses(getIssuedLicensesList());
    } catch (e) {
      console.error('Failed to restore auth session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync devices whenever session or license changes
  useEffect(() => {
    if (session) {
      refreshDevices();
      setIssuedLicenses(getIssuedLicensesList());
    }
  }, [session?.licenseKey, session?.whatsappNumber]);

  const isSuperAdmin = isSuperAdminUser(session);

  const refreshDevices = async () => {
    if (!session) return;
    const currentDevId = getOrCreateDeviceId();
    const { deviceName, browser, os, deviceType } = detectClientEnvironment();

    const supabase = getSupabaseClient();
    if (supabase && session.isCloudSyncActive) {
      try {
        await supabase.from('user_devices').upsert(
          {
            license_key: session.licenseKey,
            device_id: currentDevId,
            device_name: `${deviceName} (Perangkat Ini)`,
            device_type: deviceType,
            user_agent: navigator.userAgent,
            is_active: true,
            last_active: new Date().toISOString(),
          },
          { onConflict: 'license_key,device_id' }
        );

        const { data, error } = await supabase
          .from('user_devices')
          .select('*')
          .eq('license_key', session.licenseKey)
          .eq('is_active', true)
          .order('last_active', { ascending: false });

        if (!error && data && data.length > 0) {
          setDevices(
            data.map((d: any) => ({
              id: d.id,
              deviceId: d.device_id,
              deviceName: d.device_name,
              deviceType: d.device_type || 'desktop',
              lastActive: d.last_active,
              isCurrent: d.device_id === currentDevId,
            }))
          );
          return;
        }
      } catch (e) {
        console.warn('Supabase device sync failed, using local device list:', e);
      }
    }

    // Local fallback devices list
    const localDevs: UserDevice[] = [
      {
        id: 'dev_1',
        deviceId: currentDevId,
        deviceName: `${deviceName} (Perangkat Ini)`,
        deviceType: deviceType,
        browser,
        os,
        lastActive: new Date().toISOString(),
        isCurrent: true,
      },
    ];
    setDevices(localDevs);
  };

  const login = async (
    waNumber: string,
    licenseKey: string,
    fullName?: string,
    role?: UserRole,
    organization?: string
  ): Promise<{ success: boolean; message: string }> => {
    const cleanWA = (waNumber || '').trim();
    const cleanKey = (licenseKey || '').trim().toUpperCase();

    if (!cleanWA) {
      return { success: false, message: 'Nomor WhatsApp wajib diisi.' };
    }

    const validation = validateLicenseKey(cleanKey);
    if (!validation.valid || !validation.license) {
      return { success: false, message: validation.message };
    }

    const lic = validation.license;
    const deviceId = getOrCreateDeviceId();
    const { deviceName } = detectClientEnvironment();

    const isSuper = validation.isSuperAdmin || role === 'Super Admin / Pengelola Sistem';

    const newSession: UserSession = {
      whatsappNumber: cleanWA,
      licenseKey: lic.key,
      fullName: isSuper ? 'Super Administrator CaseIntel' : fullName?.trim() || 'Advokat / Penyidik Terdaftar',
      role: isSuper ? 'Super Admin / Pengelola Sistem' : role || 'Advokat / Penasihat Hukum',
      organization: organization?.trim() || lic.issuedTo || 'Kantor Hukum & Penegak Hukum',
      licenseTier: lic.tier,
      licenseExpiry: lic.expiresAt,
      maxDevices: lic.maxDevices,
      deviceId,
      deviceName,
      isCloudSyncActive: true,
      isSuperAdmin: isSuper,
      loginAt: new Date().toISOString(),
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('user_profiles').upsert(
          {
            whatsapp_number: cleanWA,
            license_key: lic.key,
            full_name: newSession.fullName,
            organization: newSession.organization,
            license_expiry: lic.expiresAt,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'whatsapp_number' }
        );
      } catch (e) {
        console.warn('Supabase profile sync error during login:', e);
      }
    }

    setSession(newSession);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newSession));
    await refreshDevices();
    return { success: true, message: `Berhasil masuk dengan ${lic.label}!` };
  };

  const loginAsSuperAdmin = async (
    pinOrKey: string,
    waNumber: string = '0800-SUPER-ADMIN'
  ): Promise<{ success: boolean; message: string }> => {
    const cleanInput = (pinOrKey || '').trim();
    if (cleanInput === SUPERADMIN_SECRET_PIN || cleanInput.toUpperCase() === 'CASEINTEL-SUPERADMIN-ROOT') {
      return await login(
        waNumber,
        'CASEINTEL-SUPERADMIN-ROOT',
        'Super Administrator Sistem',
        'Super Admin / Pengelola Sistem',
        'Pusat Kontrol Lisensi CaseIntel'
      );
    }
    return { success: false, message: 'PIN / Kunci Super Admin tidak valid.' };
  };

  const generateLicenseAsAdmin = (
    tier: LicenseTier,
    durationDays: number,
    issuedTo: string
  ): { success: boolean; license?: LicenseInfo; message: string } => {
    if (!isSuperAdmin) {
      return {
        success: false,
        message: 'Akses Ditolak: Hanya Super Admin yang memiliki wewenang membuat kunci lisensi dan uji coba.',
      };
    }

    const newLic = generateNewLicenseKey(tier, durationDays, issuedTo);
    setIssuedLicenses(getIssuedLicensesList());
    return {
      success: true,
      license: newLic,
      message: `Kunci lisensi ${newLic.label} berhasil dibuat oleh Super Admin!`,
    };
  };

  const quickLoginAs = async (presetKey: string, role: UserRole = 'Advokat / Penasihat Hukum') => {
    const lic = PRESET_LICENSES[presetKey] || PRESET_LICENSES['CASEINTEL-PRO-2026'];
    const wa = presetKey.includes('FIRM')
      ? '0812-9988-7766'
      : presetKey.includes('TRIAL')
      ? '0812-1111-2222'
      : '0812-3456-7890';

    const name =
      presetKey.includes('TRIAL')
        ? 'Pengguna Uji Coba (Demo)'
        : role === 'Penyidik Kepolisian'
        ? 'AKP Ridwan Hakim, S.H., M.H.'
        : role === 'Jaksa Penuntut Umum'
        ? 'Jaksa Pratama Maria Fernandez, S.H.'
        : 'Advokat Rizki M. Ramdani, S.H., M.H.';

    const org =
      presetKey.includes('TRIAL')
        ? 'Kantor Uji Coba Demo'
        : role === 'Penyidik Kepolisian'
        ? 'Satreskrim Kepolisian'
        : role === 'Jaksa Penuntut Umum'
        ? 'Kejaksaan Negeri'
        : 'Kantor Advokat & Konsultan Hukum';

    await login(wa, lic.key, name, role, org);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setSession(null);
    setDevices([]);
  };

  const updateProfile = (
    fullName: string,
    role?: UserRole,
    organization?: string,
    waNumber?: string
  ) => {
    if (!session) return;
    const updated: UserSession = {
      ...session,
      fullName: fullName.trim() || session.fullName,
      role: role || session.role,
      organization: organization !== undefined ? organization.trim() : session.organization,
      whatsappNumber: waNumber ? waNumber.trim() : session.whatsappNumber,
    };
    setSession(updated);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));

    const supabase = getSupabaseClient();
    if (supabase && session.isCloudSyncActive) {
      supabase.from('user_profiles').upsert({
        whatsapp_number: updated.whatsappNumber,
        license_key: updated.licenseKey,
        full_name: updated.fullName,
        organization: updated.organization,
        updated_at: new Date().toISOString(),
      });
    }
  };

  const updateLicense = (rawLicenseKey: string): { success: boolean; message: string } => {
    if (!session) return { success: false, message: 'Tidak ada sesi aktif.' };
    const validation = validateLicenseKey(rawLicenseKey);
    if (!validation.valid || !validation.license) {
      return { success: false, message: validation.message };
    }

    const lic = validation.license;
    const isSuper = validation.isSuperAdmin || lic.tier === 'SUPERADMIN';

    const updated: UserSession = {
      ...session,
      licenseKey: lic.key,
      licenseTier: lic.tier,
      licenseExpiry: lic.expiresAt,
      maxDevices: lic.maxDevices,
      isSuperAdmin: isSuper || session.isSuperAdmin,
    };

    setSession(updated);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));

    const supabase = getSupabaseClient();
    if (supabase && session.isCloudSyncActive) {
      supabase.from('user_profiles').upsert({
        whatsapp_number: updated.whatsappNumber,
        license_key: lic.key,
        license_expiry: lic.expiresAt,
        updated_at: new Date().toISOString(),
      });
    }

    refreshDevices();
    return { success: true, message: `Kunci lisensi berhasil diperbarui ke ${lic.label}!` };
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

  const logoutOtherDevices = async () => {
    if (!session) return;
    const currentDevId = getOrCreateDeviceId();
    const supabase = getSupabaseClient();
    if (supabase && session.isCloudSyncActive) {
      await supabase
        .from('user_devices')
        .update({ is_active: false })
        .eq('license_key', session.licenseKey)
        .neq('device_id', currentDevId);
    }
    setDevices((prev) => prev.filter((d) => d.deviceId === currentDevId));
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        isCloudConnected,
        isSuperAdmin,
        devices,
        issuedLicenses,
        login,
        loginAsSuperAdmin,
        logout,
        updateProfile,
        updateLicense,
        generateLicenseAsAdmin,
        toggleCloudSync,
        removeDevice,
        logoutOtherDevices,
        refreshDevices,
        quickLoginAs,
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
