'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { AccountModal } from '../account/AccountModal';

export function Header() {
  const { currentCase, viewMode, setViewMode, saveCurrentCase, isSaving, lastSavedAt, isCloudSyncing } =
    useCase();
  const { session, isCloudConnected } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

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

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
        {/* Left: Brand & Case Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setViewMode('dashboard')}
            className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-amber-700 dark:text-amber-400 hover:opacity-80 transition"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              <Scale className="h-4 w-4" />
            </div>
            <span className="hidden sm:inline font-bold">CASEINTEL</span>
          </button>

          <span className="text-slate-300 dark:text-slate-700">/</span>

          <div className="flex items-center gap-2 min-w-0">
            <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-200 max-w-[200px] sm:max-w-[340px] md:max-w-[480px]">
              {viewMode === 'dashboard'
                ? 'Daftar Perkara Tersimpan'
                : currentCase.title || 'Perkara Baru (Belum Diberi Judul)'}
            </span>

            {viewMode !== 'dashboard' && (
              <span className="hidden sm:inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                {currentCase.investigationStage}
              </span>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Cloud Sync Status Indicator */}
          <div
            className={`hidden md:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition ${
              isCloudConnected && session?.isCloudSyncActive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
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
          </div>

          {/* Save Status & Button in Wizard */}
          {viewMode === 'wizard' && (
            <button
              onClick={handleManualSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
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

          {/* Quick Switch to Dashboard or Results */}
          {viewMode === 'wizard' && (
            <button
              onClick={() => {
                saveCurrentCase();
                setViewMode('results');
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-700 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 transition"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>Hasil Gelar</span>
            </button>
          )}

          {viewMode === 'results' && (
            <button
              onClick={() => setViewMode('wizard')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
            >
              <span>← Edit Form</span>
            </button>
          )}

          {viewMode !== 'dashboard' && (
            <button
              onClick={() => setViewMode('dashboard')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
            >
              <FolderOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Daftar</span>
            </button>
          )}

          {/* Account / License Button */}
          <button
            onClick={() => setIsAccountModalOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
            title="Akun & Perangkat Saya"
          >
            <User className="h-4 w-4" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
            title="Ganti Tema Gelap/Terang"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Account Modal */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
    </>
  );
}
