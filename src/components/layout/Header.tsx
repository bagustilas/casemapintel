'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCase } from '@/context/CaseContext';
import { useAuth } from '@/context/AuthContext';
import {
  Scale,
  FolderOpen,
  Play,
  Moon,
  Sun,
  Cloud,
  CloudOff,
  User,
  Smartphone,
  Save,
  CheckCircle2,
  Key,
  LogOut,
  ChevronDown,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { AccountModal } from '../account/AccountModal';

export function Header() {
  const { currentCase, viewMode, setViewMode, saveCurrentCase, isSaving, lastSavedAt, isCloudSyncing } =
    useCase();
  const { session, logout, isCloudConnected } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'profile' | 'license' | 'devices' | 'sync'>('profile');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleManualSave = async () => {
    await saveCurrentCase(true);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  const openModalAtTab = (tab: 'profile' | 'license' | 'devices' | 'sync') => {
    setModalTab(tab);
    setIsAccountModalOpen(true);
    setIsUserMenuOpen(false);
  };

  const initials = (session?.fullName || 'AD')
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
        {/* Left: Brand & Case Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setViewMode('dashboard')}
            className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-amber-700 dark:text-amber-400 hover:opacity-80 transition"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 shadow-sm">
              <Scale className="h-4 w-4" />
            </div>
            <span className="hidden sm:inline font-bold">CASEINTEL</span>
          </button>

          <span className="text-slate-300 dark:text-slate-700">/</span>

          <div className="flex items-center gap-2 min-w-0">
            <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-200 max-w-[160px] sm:max-w-[280px] md:max-w-[420px]">
              {viewMode === 'dashboard'
                ? 'Daftar Perkara Tersimpan'
                : currentCase.title || 'Perkara Baru (Belum Diberi Judul)'}
            </span>

            {viewMode !== 'dashboard' && (
              <span className="hidden md:inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                {currentCase.investigationStage}
              </span>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Cloud Sync Status Indicator */}
          <button
            type="button"
            onClick={() => openModalAtTab('sync')}
            className={`hidden md:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition ${
              isCloudConnected && session?.isCloudSyncActive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 hover:bg-amber-100'
            }`}
            title={
              isCloudConnected && session?.isCloudSyncActive
                ? 'Cloud Sync Aktif (Tersinkron dengan Supabase)'
                : 'Penyimpanan Lokal Aktif (Offline Mode)'
            }
          >
            {isCloudConnected && session?.isCloudSyncActive ? (
              <>
                <Cloud className={`h-3.5 w-3.5 ${isCloudSyncing ? 'animate-pulse text-emerald-500' : ''}`} />
                <span>{isCloudSyncing ? 'Sinkronisasi...' : 'Cloud Online'}</span>
              </>
            ) : (
              <>
                <CloudOff className="h-3.5 w-3.5" />
                <span>Lokal Cache</span>
              </>
            )}
          </button>

          {/* Save Status & Button in Wizard */}
          {viewMode === 'wizard' && (
            <button
              onClick={handleManualSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
              title="Simpan draft perkara"
            >
              {showSavedToast ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">{showSavedToast ? 'Tersimpan' : 'Simpan'}</span>
            </button>
          )}

          {/* Quick Switch to Results */}
          {viewMode === 'wizard' && (
            <button
              onClick={() => {
                saveCurrentCase();
                setViewMode('results');
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-700 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 transition"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>Hasil Gelar</span>
            </button>
          )}

          {viewMode === 'results' && (
            <button
              onClick={() => setViewMode('wizard')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
            >
              <span>← Edit Form</span>
            </button>
          )}

          {viewMode !== 'dashboard' && (
            <button
              onClick={() => setViewMode('dashboard')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
            >
              <FolderOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Daftar</span>
            </button>
          )}

          {/* User Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 sm:px-2.5 sm:py-1.5 text-xs font-semibold text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-700 text-[11px] font-bold text-white">
                {initials}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-none text-left">
                <span className="font-bold text-[11px] truncate max-w-[100px]">
                  {session?.fullName?.split(' ')[0] || 'Akun'}
                </span>
                <span className="text-[9px] text-amber-700 dark:text-amber-400 font-mono">
                  {session?.licenseTier || 'PRO'}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 z-50">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {session?.fullName || 'Pengguna CaseIntel'}
                  </p>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate">
                    {session?.role || 'Advokat'}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-mono">
                      {session?.licenseKey}
                    </span>
                  </div>
                </div>

                <div className="py-1 space-y-0.5 text-xs font-medium">
                  <button
                    onClick={() => openModalAtTab('profile')}
                    className="w-full flex items-center gap-2 rounded-xl px-2.5 py-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition text-left"
                  >
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span>Profil &amp; Kantor Hukum</span>
                  </button>

                  <button
                    onClick={() => openModalAtTab('license')}
                    className="w-full flex items-center gap-2 rounded-xl px-2.5 py-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition text-left"
                  >
                    <Key className="h-3.5 w-3.5 text-amber-600" />
                    <span>Kelola Lisensi &amp; Kuota</span>
                  </button>

                  <button
                    onClick={() => openModalAtTab('devices')}
                    className="w-full flex items-center gap-2 rounded-xl px-2.5 py-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition text-left"
                  >
                    <Smartphone className="h-3.5 w-3.5 text-slate-400" />
                    <span>Perangkat Saya</span>
                  </button>

                  <button
                    onClick={() => openModalAtTab('sync')}
                    className="w-full flex items-center gap-2 rounded-xl px-2.5 py-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition text-left"
                  >
                    <Cloud className="h-3.5 w-3.5 text-blue-600" />
                    <span>Sinkronisasi Cloud</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      if (confirm('Keluar dari sesi akun saat ini?')) {
                        logout();
                      }
                    }}
                    className="w-full flex items-center gap-2 rounded-xl px-2.5 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition text-left text-xs font-bold"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Keluar / Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
            title="Ganti Tema Gelap/Terang"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Account & License Modal */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        defaultTab={modalTab}
      />
    </>
  );
}
