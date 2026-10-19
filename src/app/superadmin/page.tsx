'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LicenseTier, LicenseInfo } from '@/types/case';
import { formatDaysRemaining } from '@/lib/license';
import {
  Shield,
  Key,
  Lock,
  Phone,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  Trash2,
  Laptop,
  Smartphone,
  Calendar,
  Layers,
  ArrowLeft,
  Sun,
  Moon,
  Cloud,
  LogOut,
  ExternalLink,
  Users,
} from 'lucide-react';

export default function SuperAdminPage() {
  const {
    session,
    loginAsSuperAdmin,
    generateLicenseAsAdmin,
    deleteLicenseAsAdmin,
    clearAllLicensesAsAdmin,
    logout,
    issuedLicenses,
    devices,
    isCloudConnected,
    isSuperAdmin,
  } = useAuth();

  // Login form state
  const [adminPin, setAdminPin] = useState('');
  const [adminWa, setAdminWa] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Generator form state
  const [genTier, setGenTier] = useState<LicenseTier>('PRO');
  const [genDays, setGenDays] = useState(365);
  const [genIssuedTo, setGenIssuedTo] = useState('');
  const [genPhone, setGenPhone] = useState('');
  const [generatedLic, setGeneratedLic] = useState<LicenseInfo | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('caseintel_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('caseintel_theme', 'light');
    }
  };

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError(null);

    const res = await loginAsSuperAdmin(adminPin, adminWa || '0800-SUPER-ADMIN');
    setIsSubmitting(false);

    if (!res.success) {
      setLoginError(res.message);
    }
  };

  const handleGenerateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await generateLicenseAsAdmin(genTier, genDays, genIssuedTo, genPhone);
    if (res.success && res.license) {
      setGeneratedLic(res.license);
      showToast('success', res.message);
      setGenIssuedTo('');
      setGenPhone('');
    } else {
      showToast('error', res.message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // 1. IF NOT LOGGED IN AS SUPER ADMIN -> SHOW DEDICATED LOGIN GATE
  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Halaman Utama</span>
          </a>

          <button
            type="button"
            onClick={toggleDarkMode}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white transition shadow-sm"
            title="Ganti Tema Gelap / Terang"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

        {/* Login Box */}
        <div className="max-w-md mx-auto w-full my-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shadow-lg shadow-rose-950/50 mb-2">
              <Shield className="h-7 w-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white">
              Portal Super Admin
            </h1>
            <p className="text-xs text-slate-400">
              Otoritas Pengelolaan Kunci Lisensi &amp; Pengaturan Sistem CaseIntel
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-5">
            {loginError && (
              <div className="rounded-2xl bg-rose-950/70 border border-rose-800 p-3.5 text-xs text-rose-200 flex items-start gap-2 animate-in fade-in">
                <ShieldAlert className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  PIN Rahasia / Kunci Master <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    placeholder="Masukkan PIN Master"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/90 py-2.5 pl-10 pr-3 text-xs sm:text-sm font-mono font-bold text-white shadow-inner focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Nomor WhatsApp Admin (Opsional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={adminWa}
                    onChange={(e) => setAdminWa(e.target.value)}
                    placeholder="mis. 0800-SUPER-ADMIN"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/90 py-2.5 pl-10 pr-3 text-xs font-medium text-white shadow-inner focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-rose-600 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-rose-900/40 hover:bg-rose-700 transition flex items-center justify-center gap-2 mt-2"
              >
                <span>{isSubmitting ? 'Memverifikasi...' : 'Otorisasi Super Admin'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-600 max-w-md mx-auto">
          CaseIntel System Engine &copy; 2026 · Akses Terbatas &amp; Terenkripsi
        </div>
      </div>
    );
  }

  // 2. SUPER ADMIN AUTHENTICATED DASHBOARD
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 flex flex-col justify-between">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 py-3.5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Portal Super Admin
                </h1>
                <span className="rounded bg-rose-100 px-1.5 py-0.2 text-[9px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-mono">
                  ROOT
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pusat Manajemen Lisensi &amp; Otoritas Sistem CaseIntel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
            >
              <span>Buka Aplikasi CaseIntel</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <button
              type="button"
              onClick={toggleDarkMode}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
              title="Ganti Tema"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-rose-900/60 transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
        {/* Toast Notification */}
        {toastMessage && (
          <div
            className={`rounded-2xl p-4 text-xs font-semibold flex items-center gap-2 border animate-in fade-in ${
              toastMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <ShieldAlert className="h-4 w-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              <Key className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Lisensi Diterbitkan
              </p>
              <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
                {issuedLicenses.length + 3} Lisensi
              </h3>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              <Laptop className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Sesi Perangkat Aktif
              </p>
              <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
                {devices.length || 1} Perangkat
              </h3>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <Cloud className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Status Supabase Cloud
              </p>
              <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {isCloudConnected ? 'Terhubung & Aktif' : 'Mode Offline / Siap Sync'}
              </h3>
            </div>
          </div>
        </div>

        {/* Generator Form Section */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Zap className="h-4 w-4" />
            <span>Penerbitan Kunci Lisensi Baru</span>
          </div>

          <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
            Generator Lisensi Mandiri Super Admin
          </h2>

          <form onSubmit={handleGenerateLicense} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Paket Lisensi <span className="text-rose-500">*</span>
                </label>
                <select
                  value={genTier}
                  onChange={(e) => setGenTier(e.target.value as LicenseTier)}
                  className="w-full rounded-2xl border border-slate-300 bg-white py-2.5 px-3 text-xs font-bold text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="PRO">Advokat Pro (Single User / 5 Device)</option>
                  <option value="FIRM_ENTERPRISE">Law Firm Enterprise (15 Device)</option>
                  <option value="LIFETIME">Lifetime VIP Seumur Hidup (50 Device)</option>
                  <option value="TRIAL">Akun Demo / Uji Coba Terbatas (1 Device)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Durasi Masa Berlaku <span className="text-rose-500">*</span>
                </label>
                <select
                  value={genDays}
                  onChange={(e) => setGenDays(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-300 bg-white py-2.5 px-3 text-xs font-bold text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value={7}>7 Hari</option>
                  <option value={30}>30 Hari (1 Bulan)</option>
                  <option value={90}>90 Hari (3 Bulan)</option>
                  <option value={180}>180 Hari (6 Bulan)</option>
                  <option value={365}>1 Tahun Penuh (365 Hari)</option>
                  <option value={730}>2 Tahun Penuh (730 Hari)</option>
                  <option value={36500}>Seumur Hidup (Lifetime VIP)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Diterbitkan Untuk
                </label>
                <input
                  type="text"
                  value={genIssuedTo}
                  onChange={(e) => setGenIssuedTo(e.target.value)}
                  placeholder="mis. Advokat Budi Santoso"
                  className="w-full rounded-2xl border border-slate-300 bg-white py-2.5 px-3 text-xs font-medium text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  No. HP / Kunci WA (Kunci Akses)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={genPhone}
                    onChange={(e) => setGenPhone(e.target.value)}
                    placeholder="mis. 081234567890"
                    className="w-full rounded-2xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-xs font-medium text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-rose-700 transition cursor-pointer"
            >
              <Zap className="h-4 w-4" />
              <span>Terbitkan Kunci Lisensi Resmi Sekarang</span>
            </button>
          </form>

          {/* Generated License Result Card */}
          {generatedLic && (
            <div className="mt-4 rounded-3xl border-2 border-rose-300 bg-gradient-to-r from-rose-50 via-rose-100/60 to-rose-50 p-5 dark:border-rose-900 dark:from-rose-950/60 dark:via-rose-900/30 dark:to-rose-950/60 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-900 dark:text-rose-300 uppercase tracking-wider">
                  Kunci Lisensi Baru Berhasil Dibuat:
                </span>
                <span className="rounded-full bg-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-900 dark:bg-rose-900 dark:text-rose-200 font-mono">
                  {generatedLic.tier}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900 border border-rose-200 dark:border-rose-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-base sm:text-lg font-bold text-rose-700 dark:text-rose-400">
                      {generatedLic.key}
                    </code>
                    {generatedLic.phoneNumber && (
                      <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>Kunci NoHP: {generatedLic.phoneNumber}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {generatedLic.label} · Diterbitkan untuk: <strong>{generatedLic.issuedTo}</strong> · Maksimal {generatedLic.maxDevices} Perangkat
                  </p>
                  {generatedLic.phoneNumber && (
                    <p className="text-[10.5px] text-emerald-700 dark:text-emerald-400 font-medium">
                      💡 Kunci Lisensi acak ini terikat khusus dengan No. WhatsApp: <strong>{generatedLic.phoneNumber}</strong>. Pengguna wajib memasukkan nomor WhatsApp tersebut saat login.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(generatedLic.key)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-rose-700 transition"
                  >
                    {copiedKey === generatedLic.key ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Salin Kunci</span>
                      </>
                    )}
                  </button>

                  {generatedLic.phoneNumber && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(generatedLic.phoneNumber!)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 transition"
                    >
                      {copiedKey === generatedLic.phoneNumber ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>NoHP Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Phone className="h-3.5 w-3.5" />
                          <span>Salin No.HP</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Issued Licenses History */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
                <Key className="h-4 w-4 text-amber-600" />
                <span>Daftar Kunci Lisensi Terdaftar &amp; Diterbitkan</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {issuedLicenses.length} Lisensi Mandiri Diterbitkan Super Admin
              </p>
            </div>

            {issuedLicenses.length > 0 && (
              <button
                type="button"
                onClick={async () => {
                  if (confirm('Apakah Anda yakin ingin MENGHAPUS SEMUA daftar lisensi yang telah diterbitkan?')) {
                    const res = await clearAllLicensesAsAdmin();
                    showToast(res.success ? 'success' : 'error', res.message);
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300 transition self-start sm:self-auto cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Hapus Semua Lisensi Terbitan</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-3">Kunci Lisensi</th>
                  <th className="py-3 px-3">No. HP / Kunci WA</th>
                  <th className="py-3 px-3">Paket</th>
                  <th className="py-3 px-3">Penerima</th>
                  <th className="py-3 px-3">Masa Berlaku</th>
                  <th className="py-3 px-3">Kuota</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {/* Built-in Root & Pro Presets */}
                <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-mono font-bold text-rose-700 dark:text-rose-400">
                    CASEINTEL-SUPERADMIN-ROOT
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400">admin2026 (PIN)</td>
                  <td className="py-3 px-3">
                    <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold text-rose-900 dark:bg-rose-950 dark:text-rose-300 font-mono">
                      SUPERADMIN
                    </span>
                  </td>
                  <td className="py-3 px-3">Super Admin Sistem</td>
                  <td className="py-3 px-3 text-emerald-600">Permanen (2099)</td>
                  <td className="py-3 px-3">99 Dev</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => copyToClipboard('CASEINTEL-SUPERADMIN-ROOT')}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Salin Kunci"
                    >
                      {copiedKey === 'CASEINTEL-SUPERADMIN-ROOT' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-mono font-bold text-amber-700 dark:text-amber-400">
                    CASEINTEL-PRO-2026
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">081234567890</td>
                  <td className="py-3 px-3">
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-mono">
                      PRO LENGKAP
                    </span>
                  </td>
                  <td className="py-3 px-3">Advokat &amp; Penasihat Hukum</td>
                  <td className="py-3 px-3 text-emerald-600">Aktif (2028)</td>
                  <td className="py-3 px-3">5 Dev</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => copyToClipboard('CASEINTEL-PRO-2026')}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Salin Kunci"
                    >
                      {copiedKey === 'CASEINTEL-PRO-2026' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                    CASEINTEL-FIRM-2026
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">081299887766</td>
                  <td className="py-3 px-3">
                    <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-mono">
                      ENTERPRISE
                    </span>
                  </td>
                  <td className="py-3 px-3">Law Firm &amp; Institusi</td>
                  <td className="py-3 px-3 text-emerald-600">Aktif (2029)</td>
                  <td className="py-3 px-3">15 Dev</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => copyToClipboard('CASEINTEL-FIRM-2026')}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Salin Kunci"
                    >
                      {copiedKey === 'CASEINTEL-FIRM-2026' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </td>
                </tr>

                {/* Generated License Rows */}
                {issuedLicenses.map((lic) => {
                  const daysInfo = formatDaysRemaining(lic.expiresAt);
                  return (
                    <tr key={lic.key} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                        {lic.key}
                      </td>
                      <td className="py-3 px-3 font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                        {lic.phoneNumber || '-'}
                      </td>
                      <td className="py-3 px-3">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-mono">
                          {lic.tier}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{lic.issuedTo}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold border ${daysInfo.colorClass}`}>
                          {daysInfo.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500">{lic.maxDevices} Dev</td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => copyToClipboard(lic.key)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="Salin Kunci Lisensi"
                          >
                            {copiedKey === lic.key ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                          </button>
                          {lic.phoneNumber && (
                            <button
                              onClick={() => copyToClipboard(lic.phoneNumber!)}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition cursor-pointer"
                              title="Salin No. HP Kunci"
                            >
                              {copiedKey === lic.phoneNumber ? <Check className="h-4 w-4 text-emerald-600" /> : <Phone className="h-3.5 w-3.5" />}
                            </button>
                          )}
                          <button
                            onClick={async () => {
                              if (confirm(`Hapus lisensi ${lic.key} (${lic.issuedTo})?`)) {
                                const res = await deleteLicenseAsAdmin(lic.key);
                                showToast(res.success ? 'success' : 'error', res.message);
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                            title="Hapus Lisensi Ini"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
