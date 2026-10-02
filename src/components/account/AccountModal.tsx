'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCase } from '@/context/CaseContext';
import { UserRole, LicenseTier, LicenseInfo } from '@/types/case';
import { formatDaysRemaining } from '@/lib/license';
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
  LogOut,
  RefreshCw,
  Zap,
  Copy,
  Check,
  ShieldAlert,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  Lock,
  FileCheck,
} from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'profile' | 'license' | 'devices' | 'sync' | 'admin';
}

const USER_ROLES: UserRole[] = [
  'Super Admin / Pengelola Sistem',
  'Advokat / Penasihat Hukum',
  'Penyidik Kepolisian',
  'Jaksa Penuntut Umum',
  'Konsultan Hukum / Paralegal',
  'Hakim / Panitera',
  'Pengguna Umum / Peneliti',
];

export function AccountModal({ isOpen, onClose, defaultTab = 'profile' }: AccountModalProps) {
  const {
    session,
    devices,
    issuedLicenses,
    isSuperAdmin,
    logout,
    updateProfile,
    updateLicense,
    generateLicenseAsAdmin,
    toggleCloudSync,
    removeDevice,
    logoutOtherDevices,
    refreshDevices,
    isCloudConnected,
  } = useAuth();

  const { isCloudSyncing, caseList, saveCurrentCase } = useCase();

  const [activeTab, setActiveTab] = useState<'profile' | 'license' | 'devices' | 'sync' | 'admin'>(
    isSuperAdmin && defaultTab === 'license' ? 'admin' : defaultTab === 'admin' && !isSuperAdmin ? 'profile' : defaultTab
  );

  // Profile Form
  const [fullName, setFullName] = useState(session?.fullName || '');
  const [role, setRole] = useState<UserRole>(session?.role || 'Advokat / Penasihat Hukum');
  const [organization, setOrganization] = useState(session?.organization || '');
  const [waNumber, setWaNumber] = useState(session?.whatsappNumber || '');

  // User Apply License Form
  const [newLicenseKey, setNewLicenseKey] = useState('');

  // Super Admin Generator Form
  const [genTier, setGenTier] = useState<LicenseTier>('PRO');
  const [genDays, setGenDays] = useState(365);
  const [genIssuedTo, setGenIssuedTo] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [copiedKeyIndex, setCopiedKeyIndex] = useState<string | null>(null);

  // Feedback Toast
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(fullName, role, organization, waNumber);
    showToast('success', 'Profil dan data kantor berhasil diperbarui.');
  };

  const handleApplyLicense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLicenseKey.trim()) return;
    const res = updateLicense(newLicenseKey);
    if (res.success) {
      showToast('success', res.message);
      setNewLicenseKey('');
    } else {
      showToast('error', res.message);
    }
  };

  const handleSuperAdminGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = generateLicenseAsAdmin(genTier, genDays, genIssuedTo);
    if (res.success && res.license) {
      setGeneratedKey(res.license.key);
      showToast('success', res.message);
      setGenIssuedTo('');
    } else {
      showToast('error', res.message);
    }
  };

  const handleCopyKey = (keyText: string) => {
    navigator.clipboard.writeText(keyText);
    setCopiedKeyIndex(keyText);
    setTimeout(() => setCopiedKeyIndex(null), 2500);
  };

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar dari akun ini?')) {
      logout();
      onClose();
    }
  };

  const daysRemaining = formatDaysRemaining(session?.licenseExpiry || new Date().toISOString());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold ${
                isSuperAdmin
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              {isSuperAdmin ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white font-serif text-base">
                  {isSuperAdmin ? 'Panel Super Admin CaseIntel' : 'Pusat Pengaturan Akun & Lisensi'}
                </h3>
                {isSuperAdmin && (
                  <span className="rounded-full bg-rose-100 px-2 py-0.2 text-[9px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-mono">
                    SUPER ADMIN
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isSuperAdmin
                  ? 'Pusat kontrol penerbitan lisensi & manajemen pengguna sistem'
                  : 'Kelola identitas, lisensi aktif, sesi perangkat, dan sinkronisasi cloud'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-6 dark:border-slate-800 dark:bg-slate-900/50 overflow-x-auto flex-shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('profile')}
            className={`border-b-2 py-3 px-3 text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-amber-700 text-amber-800 dark:border-amber-400 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            Akun &amp; Profil
          </button>

          <button
            onClick={() => setActiveTab('license')}
            className={`border-b-2 py-3 px-3 text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'license'
                ? 'border-amber-700 text-amber-800 dark:border-amber-400 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <span>Lisensi Saya</span>
            <span className="rounded-full bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              {session?.licenseTier || 'PRO'}
            </span>
          </button>

          {/* Super Admin Exclusive Tab */}
          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`border-b-2 py-3 px-3 text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'border-rose-700 text-rose-800 dark:border-rose-400 dark:text-rose-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-rose-600" />
              <span>Generator Lisensi (Super Admin)</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('devices')}
            className={`border-b-2 py-3 px-3 text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'devices'
                ? 'border-amber-700 text-amber-800 dark:border-amber-400 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <span>Perangkat Saya</span>
            <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[9px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {devices.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('sync')}
            className={`border-b-2 py-3 px-3 text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'sync'
                ? 'border-amber-700 text-amber-800 dark:border-amber-400 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Cloud className="h-3 w-3" />
            <span>Cloud &amp; Database</span>
          </button>
        </div>

        {/* Modal Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Alert Toast */}
          {toastMsg && (
            <div
              className={`rounded-2xl p-3.5 text-xs font-semibold flex items-center gap-2 border animate-in fade-in ${
                toastMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
              }`}
            >
              {toastMsg.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <ShieldAlert className="h-4 w-4 text-rose-600 flex-shrink-0" />
              )}
              <span>{toastMsg.text}</span>
            </div>
          )}

          {/* TAB 1: PROFIL SAYA */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-200 dark:bg-slate-800/40 dark:border-slate-800">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white font-serif text-xl font-bold shadow-md ${
                    isSuperAdmin ? 'bg-rose-700' : 'bg-amber-700'
                  }`}
                >
                  {(fullName || session?.fullName || 'AD')
                    .split(/\s+/)
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white font-serif">
                    {session?.fullName || 'Advokat / Penyidik'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{session?.role}</p>
                  <p className="text-[11px] font-mono text-amber-700 dark:text-amber-400 mt-0.5">
                    WA: {session?.whatsappNumber}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Nama Lengkap &amp; Gelar
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="mis. Rizki M. Ramdani, S.H., M.H."
                      className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs font-semibold text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Nomor WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={waNumber}
                      onChange={(e) => setWaNumber(e.target.value)}
                      placeholder="mis. 0812-3456-7890"
                      className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs font-semibold text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Profesi / Jabatan Hukum
                  </label>
                  <select
                    value={role}
                    disabled={isSuperAdmin}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs font-semibold text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    {USER_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Kantor Hukum / Instansi
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="mis. Kantor Hukum Rizki M. Ramdani & Partners"
                      className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300 transition"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Keluar dari Akun</span>
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-amber-700 px-5 py-2 text-xs font-bold text-white shadow hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 transition"
                >
                  Simpan Perubahan Profil
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: LISENSI SAYA (REGULAR USER VIEW) */}
          {activeTab === 'license' && (
            <div className="space-y-5">
              {/* Digital License Hologram Card */}
              <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-5 sm:p-6 shadow-xl border border-slate-800 relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-400 block">
                        KARTU LISENSI DIGITAL RESMI
                      </span>
                      <h4 className="text-lg font-bold font-serif text-white mt-0.5">
                        {session?.organization || 'Kantor Hukum Terdaftar'}
                      </h4>
                    </div>
                    <span
                      className={`rounded-full px-3 py-0.5 text-xs font-bold border ${daysRemaining.colorClass}`}
                    >
                      {daysRemaining.label}
                    </span>
                  </div>

                  <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 font-mono">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
                      Kunci Lisensi Terdaftar:
                    </span>
                    <span className="text-sm sm:text-base font-bold text-amber-300 tracking-wider">
                      {session?.licenseKey}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Paket</span>
                      <span className="font-bold text-slate-200">{session?.licenseTier}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Batas Device</span>
                      <span className="font-bold text-slate-200">
                        {devices.length} / {session?.maxDevices || 3} Perangkat
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Kedaluwarsa</span>
                      <span className="font-bold text-slate-200">
                        {session?.licenseExpiry
                          ? new Date(session.licenseExpiry).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Seumur Hidup'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Masukkan Kunci Baru / Perpanjangan */}
              <form onSubmit={handleApplyLicense} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                  Perbarui Lisensi / Masukkan Kunci dari Super Admin
                </span>
                <p className="text-[11px] text-slate-500">
                  Masukkan kunci lisensi PRO, Law Firm, atau Uji Coba yang diberikan oleh Super Admin pengelola.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newLicenseKey}
                    onChange={(e) => setNewLicenseKey(e.target.value.toUpperCase())}
                    placeholder="mis. CASEINTEL-PRO-2026-XXXX"
                    className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-bold text-slate-900 shadow-sm uppercase focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-amber-700 px-4 py-2 text-xs font-bold text-white shadow hover:bg-amber-800 transition"
                  >
                    Terapkan
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: SUPER ADMIN EXCLUSIVE LICENSE GENERATOR */}
          {isSuperAdmin && activeTab === 'admin' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="rounded-2xl bg-rose-50 p-4 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900 space-y-1">
                <div className="flex items-center gap-2 text-rose-900 dark:text-rose-300 font-bold text-xs">
                  <Shield className="h-4 w-4" />
                  <span>Pusat Kontrol &amp; Penerbitan Lisensi Super Admin</span>
                </div>
                <p className="text-[11px] text-rose-800/90 dark:text-rose-300/90">
                  Anda memiliki otoritas eksklusif untuk menerbitkan Kunci Lisensi Baru (Trial Uji Coba, Pro, Law Firm, Lifetime) bagi advokat, instansi, atau penyidik.
                </p>
              </div>

              {/* Form Generator Super Admin */}
              <form onSubmit={handleSuperAdminGenerate} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-800/30">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                  Formulir Pembuatan Kunci Lisensi Baru
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Paket Lisensi
                    </label>
                    <select
                      value={genTier}
                      onChange={(e) => setGenTier(e.target.value as LicenseTier)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="PRO">Advokat Pro (5 Device)</option>
                      <option value="FIRM_ENTERPRISE">Law Firm Enterprise (15 Device)</option>
                      <option value="LIFETIME">Lifetime VIP (50 Device)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Durasi Masa Aktif
                    </label>
                    <select
                      value={genDays}
                      onChange={(e) => setGenDays(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value={30}>30 Hari (1 Bulan)</option>
                      <option value={90}>3 Bulan</option>
                      <option value={180}>6 Bulan</option>
                      <option value={365}>1 Tahun Penuh (365 Hari)</option>
                      <option value={730}>2 Tahun Penuh</option>
                      <option value={36500}>Seumur Hidup (Lifetime VIP)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Diterbitkan Untuk (Nama/Kantor)
                    </label>
                    <input
                      type="text"
                      value={genIssuedTo}
                      onChange={(e) => setGenIssuedTo(e.target.value)}
                      placeholder="mis. Kantor Hukum X"
                      className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-rose-700 py-2.5 text-xs font-bold text-white shadow hover:bg-rose-800 transition flex items-center justify-center gap-1.5 mt-2"
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>Terbitkan Kunci Lisensi Resmi</span>
                </button>
              </form>

              {/* Generated Result Banner */}
              {generatedKey && (
                <div className="rounded-2xl border border-rose-300 bg-rose-50/80 p-4 dark:border-rose-900 dark:bg-rose-950/40 space-y-2 animate-in fade-in">
                  <span className="text-[10px] font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider block">
                    Kunci Lisensi Berhasil Diterbitkan:
                  </span>
                  <div className="flex items-center justify-between gap-2 rounded-xl bg-white dark:bg-slate-900 p-2.5 border border-rose-200 dark:border-rose-800">
                    <code className="font-mono text-xs sm:text-sm font-bold text-rose-900 dark:text-rose-300">
                      {generatedKey}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopyKey(generatedKey)}
                      className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                      title="Salin Kunci"
                    >
                      {copiedKeyIndex === generatedKey ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* List of Issued Licenses */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                  Daftar Lisensi yang Diterbitkan ({issuedLicenses.length})
                </span>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {issuedLicenses.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Belum ada lisensi yang diterbitkan.</p>
                  ) : (
                    issuedLicenses.map((lic) => (
                      <div
                        key={lic.key}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-800 dark:bg-slate-800/40"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <code className="font-mono font-bold text-slate-900 dark:text-white">
                              {lic.key}
                            </code>
                            <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                              {lic.tier}
                            </span>
                          </div>
                          <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Untuk: <strong>{lic.issuedTo}</strong> · Exp:{' '}
                            {new Date(lic.expiresAt).toLocaleDateString('id-ID')}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyKey(lic.key)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                          title="Salin Kunci"
                        >
                          {copiedKeyIndex === lic.key ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PERANGKAT SAYA */}
          {activeTab === 'devices' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Sesi Perangkat Aktif ({devices.length} / {session?.maxDevices || 3})
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Sesi aktif yang saat ini terhubung dan menyinkronkan berkas perkara dengan lisensi ini.
                  </p>
                </div>

                {devices.filter((d) => !d.isCurrent).length > 0 && (
                  <button
                    type="button"
                    onClick={logoutOtherDevices}
                    className="inline-flex items-center gap-1 rounded-xl bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-300 transition self-start sm:self-auto"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Putus Sesi Semua Device Lain</span>
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {devices.map((dev) => (
                  <div
                    key={dev.deviceId}
                    className={`flex items-center justify-between rounded-2xl border p-3.5 transition ${
                      dev.isCurrent
                        ? 'border-amber-400 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/30'
                        : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold ${
                          dev.isCurrent
                            ? 'bg-amber-700 text-white dark:bg-amber-600'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {dev.deviceType === 'mobile' ? (
                          <Smartphone className="h-5 w-5" />
                        ) : (
                          <Laptop className="h-5 w-5" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {dev.deviceName}
                          </span>
                          {dev.isCurrent && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              Perangkat Ini
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-500 font-mono">
                          ID: {dev.deviceId.substring(0, 14)}... · Aktif:{' '}
                          {new Date(dev.lastActive).toLocaleTimeString('id-ID')}
                        </p>
                      </div>
                    </div>

                    {!dev.isCurrent && (
                      <button
                        type="button"
                        onClick={() => removeDevice(dev.deviceId)}
                        className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:hover:bg-rose-950/40 transition"
                        title="Putus Sesi / Force Logout"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CLOUD & DATABASE */}
          {activeTab === 'sync' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Status Koneksi Supabase Database
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      isCloudConnected
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {isCloudConnected ? '🟢 Terhubung Online' : '🟡 Standalone / Cache Lokal'}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      Sinkronisasi Cloud Otomatis
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Otomatis simpan dan ambil berkas perkara antar-perangkat terhubung
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={session?.isCloudSyncActive ?? true}
                    onChange={(e) => toggleCloudSync(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-amber-700 focus:ring-amber-500 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase block">Total Perkara Lokal</span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {caseList.length} Perkara
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase block">Status Sinkronisasi</span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {isCloudSyncing ? 'Sedang Sinkron...' : 'Up-to-date'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    disabled={isCloudSyncing}
                    onClick={async () => {
                      await saveCurrentCase(true);
                      await refreshDevices();
                      showToast('success', 'Sinkronisasi berhasil diselesaikan.');
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-700 px-4 py-2 text-xs font-bold text-white shadow hover:bg-amber-800 transition"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isCloudSyncing ? 'animate-spin' : ''}`} />
                    <span>Sinkronkan Sekarang</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
