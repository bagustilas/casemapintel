'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  User,
  Key,
  Phone,
  Smartphone,
  Laptop,
  Trash2,
  Cloud,
  CheckCircle2,
  Shield,
  Building,
} from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const {
    session,
    devices,
    login,
    logout,
    updateProfile,
    toggleCloudSync,
    removeDevice,
    isCloudConnected,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'devices' | 'login'>('profile');
  const [waInput, setWaInput] = useState(session?.whatsappNumber || '');
  const [licenseInput, setLicenseInput] = useState(session?.licenseKey || '');
  const [nameInput, setNameInput] = useState(session?.fullName || '');
  const [orgInput, setOrgInput] = useState(session?.organization || '');
  const [savedMessage, setSavedMessage] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waInput || !licenseInput) return;
    await login(waInput, licenseInput, nameInput);
    setActiveTab('profile');
    setSavedMessage('Berhasil masuk dengan lisensi akun!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(nameInput, orgInput);
    setSavedMessage('Profil berhasil diperbarui.');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Pengaturan Akun & Lisensi</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Sinkronisasi cloud & multi-perangkat</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-6 dark:border-slate-800 dark:bg-slate-900/50">
          <button
            onClick={() => setActiveTab('profile')}
            className={`border-b-2 py-3 px-4 text-xs font-semibold transition ${
              activeTab === 'profile'
                ? 'border-amber-700 text-amber-700 dark:border-amber-400 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            Akun Saya
          </button>
          <button
            onClick={() => setActiveTab('devices')}
            className={`border-b-2 py-3 px-4 text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'devices'
                ? 'border-amber-700 text-amber-700 dark:border-amber-400 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <span>Perangkat Saya</span>
            <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {devices.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`border-b-2 py-3 px-4 text-xs font-semibold transition ${
              activeTab === 'login'
                ? 'border-amber-700 text-amber-700 dark:border-amber-400 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            Ganti / Hubungkan Lisensi
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {savedMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs font-medium text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="h-4 w-4" />
              <span>{savedMessage}</span>
            </div>
          )}

          {/* TAB 1: Profile */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status Lisensi
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <CheckCircle2 className="h-3 w-3" />
                    Aktif
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Kunci Lisensi:</span>
                    <p className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {session?.licenseKey || 'DEMO-PRO-2026'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Nomor WhatsApp:</span>
                    <p className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {session?.whatsappNumber || '0812-xxxx-xxxx'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Masa Berlaku:</span>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {session?.licenseExpiry
                        ? new Date(session.licenseExpiry).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : '31 Desember 2026'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Backend Supabase:</span>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {isCloudConnected ? '🟢 Terhubung' : '🟡 Standalone / Lokal'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap / Tampilan
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs font-medium text-slate-800 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    placeholder="mis. Advokat Rizki M. Ramdani, S.H."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Kantor Hukum / Instansi
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={orgInput}
                    onChange={(e) => setOrgInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs font-medium text-slate-800 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    placeholder="mis. Kantor Hukum Rizki M. Ramdani & Partners"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Cloud Sync Otomatis
                    </span>
                    <p className="text-[11px] text-slate-500">Sinkronisasi berkas otomatis antar-perangkat</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={session?.isCloudSyncActive ?? true}
                  onChange={(e) => toggleCloudSync(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-amber-700 focus:ring-amber-500 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-700 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-800 transition"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Devices */}
          {activeTab === 'devices' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daftar perangkat yang terhubung dengan kunci lisensi ini. Anda dapat memutuskan akses sesi perangkat lain.
              </p>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {devices.map((dev) => (
                  <div
                    key={dev.deviceId}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-800/60 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                        {dev.deviceType === 'mobile' ? (
                          <Smartphone className="h-4 w-4" />
                        ) : (
                          <Laptop className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {dev.deviceName}
                          </span>
                          {dev.isCurrent && (
                            <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              Perangkat Ini
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          ID: {dev.deviceId.substring(0, 14)}... · Aktif:{' '}
                          {new Date(dev.lastActive).toLocaleTimeString('id-ID')}
                        </span>
                      </div>
                    </div>

                    {!dev.isCurrent && (
                      <button
                        onClick={() => removeDevice(dev.deviceId)}
                        className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        title="Putus Sesi Perangkat"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Login / Connect License */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Masukkan nomor WhatsApp dan Kunci Lisensi resmi Anda untuk menghubungkan data perkara antar-perangkat.
              </p>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nomor WhatsApp Terdaftar
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={waInput}
                    onChange={(e) => setWaInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs font-medium text-slate-800 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    placeholder="mis. 081234567890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Kunci Lisensi CASEINTEL
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={licenseInput}
                    onChange={(e) => setLicenseInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs font-mono font-bold text-slate-800 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 uppercase"
                    placeholder="mis. CI-2026-XXXX-XXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nama Pengguna (Opsional)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs font-medium text-slate-800 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    placeholder="mis. Advokat / Penyidik"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-700 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-800 transition"
                >
                  Hubungkan Akun
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
