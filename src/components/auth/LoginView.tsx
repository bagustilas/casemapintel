'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole, LicenseTier } from '@/types/case';
import { PRESET_LICENSES, generateNewLicenseKey } from '@/lib/license';
import {
  Scale,
  Key,
  Phone,
  User,
  Building,
  ShieldCheck,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Lock,
  ArrowRight,
  ShieldAlert,
  Copy,
  Check,
} from 'lucide-react';

const USER_ROLES: UserRole[] = [
  'Advokat / Penasihat Hukum',
  'Penyidik Kepolisian',
  'Jaksa Penuntut Umum',
  'Konsultan Hukum / Paralegal',
  'Hakim / Panitera',
  'Pengguna Umum / Peneliti',
];

export function LoginView() {
  const { login, quickLoginAs, isCloudConnected } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'quick' | 'generator'>('login');
  const [waNumber, setWaNumber] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('Advokat / Penasihat Hukum');
  const [organization, setOrganization] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Generator State
  const [genTier, setGenTier] = useState<LicenseTier>('TRIAL');
  const [genDays, setGenDays] = useState(30);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const res = await login(waNumber, licenseKey, fullName, role, organization);
    setIsSubmitting(false);

    if (!res.success) {
      setFeedback(res);
    }
  };

  const handleQuickLogin = async (key: string, chosenRole: UserRole) => {
    setIsSubmitting(true);
    await quickLoginAs(key, chosenRole);
    setIsSubmitting(false);
  };

  const handleGenerateKey = () => {
    const lic = generateNewLicenseKey(genTier, genDays);
    setGeneratedKey(lic.key);
    setIsCopied(false);
  };

  const handleCopyKey = () => {
    if (!generatedKey) return;
    navigator.clipboard.writeText(generatedKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleUseGeneratedKey = () => {
    if (!generatedKey) return;
    setLicenseKey(generatedKey);
    setActiveTab('login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full space-y-8 my-auto">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 px-4 py-2 text-amber-800 dark:text-amber-300 font-mono text-xs font-bold uppercase tracking-wider shadow-sm">
            <Scale className="h-4 w-4" />
            <span>Sistem Pemetaan &amp; Gelar Perkara Pidana</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white font-serif tracking-tight">
            CASEINTEL
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Platform intelijen perkara pidana untuk Advokat, Penyidik, dan Jaksa. Masukkan nomor WhatsApp &amp; Kunci Lisensi Anda untuk mengakses berkas perkara.
          </p>
        </div>

        {/* Main Card Container */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden dark:border-slate-800 dark:bg-slate-900 grid grid-cols-1 lg:grid-cols-12">
          {/* Left / Top Tabs Area (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Tab Selector */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setFeedback(null);
                  }}
                  className={`pb-3 px-3 text-xs font-bold transition border-b-2 ${
                    activeTab === 'login'
                      ? 'border-amber-700 text-amber-800 dark:border-amber-400 dark:text-amber-400'
                      : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400'
                  }`}
                >
                  Masuk Lisensi
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('quick');
                    setFeedback(null);
                  }}
                  className={`pb-3 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'quick'
                      ? 'border-amber-700 text-amber-800 dark:border-amber-400 dark:text-amber-400'
                      : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                  <span>Coba Demo 1-Klik</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('generator');
                    setFeedback(null);
                  }}
                  className={`pb-3 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'generator'
                      ? 'border-amber-700 text-amber-800 dark:border-amber-400 dark:text-amber-400'
                      : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400'
                  }`}
                >
                  <Key className="h-3.5 w-3.5 text-amber-600" />
                  <span>Kunci Lisensi &amp; Uji Coba</span>
                </button>
              </div>

              {/* Feedback Error Message */}
              {feedback && !feedback.success && (
                <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-300 flex items-start gap-2 animate-in fade-in">
                  <ShieldAlert className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span>{feedback.message}</span>
                </div>
              )}

              {/* 1. FORM LOGIN */}
              {activeTab === 'login' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Nomor WhatsApp Terdaftar <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={waNumber}
                        onChange={(e) => setWaNumber(e.target.value)}
                        placeholder="mis. 0812-3456-7890"
                        className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-xs sm:text-sm font-semibold text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Kunci Lisensi CASEINTEL <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setLicenseKey('CASEINTEL-TRIAL-30D')}
                          className="text-[11px] font-mono text-slate-500 hover:underline dark:text-slate-400"
                        >
                          Isi Kunci Demo
                        </button>
                        <span className="text-slate-300">·</span>
                        <button
                          type="button"
                          onClick={() => setLicenseKey('CASEINTEL-PRO-2026')}
                          className="text-[11px] font-mono text-amber-700 font-bold hover:underline dark:text-amber-400"
                        >
                          Isi Kunci PRO
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <Key className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={licenseKey}
                        onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                        placeholder="mis. CASEINTEL-PRO-2026 atau CASEINTEL-TRIAL-30D"
                        className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-xs sm:text-sm font-mono font-bold uppercase text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                        Nama Lengkap (Opsional)
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="mis. Rizki M. Ramdani, S.H."
                          className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-8 pr-3 text-xs font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                        Peran / Profesi Hukum
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      >
                        {USER_ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Kantor Hukum / Instansi (Opsional)
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="mis. Kantor Hukum Rizki M. Ramdani & Partners"
                        className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-8 pr-3 text-xs font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-2xl bg-amber-700 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 transition flex items-center justify-center gap-2 mt-4"
                  >
                    <span>{isSubmitting ? 'Memverifikasi...' : 'Masuk ke Sistem Gelar Perkara'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}

              {/* 2. QUICK 1-CLICK DEMO LOGIN */}
              {activeTab === 'quick' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pilih salah satu mode masuk instan untuk menguji coba fitur CaseIntel:
                  </p>

                  <div className="space-y-2.5">
                    {/* Mode Demo / Trial */}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleQuickLogin('CASEINTEL-TRIAL-30D', 'Pengguna Umum / Peneliti')}
                      className="w-full rounded-2xl border-2 border-amber-300 bg-amber-50/70 p-4 text-left hover:border-amber-500 hover:bg-amber-100/50 dark:border-amber-800 dark:bg-amber-950/40 dark:hover:border-amber-500/50 transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-200 text-amber-900 font-bold text-base dark:bg-amber-900 dark:text-amber-200">
                          <Lock className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                              Masuk Mode Demo / Uji Coba
                            </h4>
                            <span className="rounded bg-amber-200 px-1.5 py-0.2 text-[9px] font-bold text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                              TRIAL DEMO
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400">
                            Fitur buat perkara baru dikunci (hanya eksplorasi berkas contoh &amp; graf)
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-amber-700 dark:text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Advokat Pro */}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleQuickLogin('CASEINTEL-PRO-2026', 'Advokat / Penasihat Hukum')}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-left hover:border-amber-500 hover:bg-amber-50/40 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-amber-500/50 transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 font-serif font-bold text-base dark:bg-amber-950 dark:text-amber-300">
                          ⚖
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                              Advokat / Penasihat Hukum
                            </h4>
                            <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              PRO LENGKAP
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Akses Penuh · Buat Analisis Perkara Baru &amp; Praperadilan
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition" />
                    </button>

                    {/* Law Firm Enterprise */}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleQuickLogin('CASEINTEL-FIRM-2026', 'Advokat / Penasihat Hukum')}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-left hover:border-purple-500 hover:bg-purple-50/40 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-purple-500/50 transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-800 font-serif font-bold text-base dark:bg-purple-950 dark:text-purple-300">
                          🏢
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                              Law Firm Enterprise &amp; Institusi
                            </h4>
                            <span className="rounded bg-purple-100 px-1.5 py-0.2 text-[9px] font-bold text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                              ENTERPRISE
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Akses Penuh Multi-Perangkat (10 Device) + Cloud Sync
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition" />
                    </button>
                  </div>
                </div>
              )}

              {/* 3. GENERATOR KUNCI LISENSI */}
              {activeTab === 'generator' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Gunakan generator ini untuk membuat kunci lisensi kustom dengan durasi masa aktif dan kuota perangkat tertentu:
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                        Tipe Lisensi
                      </label>
                      <select
                        value={genTier}
                        onChange={(e) => setGenTier(e.target.value as LicenseTier)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      >
                        <option value="TRIAL">Uji Coba Demo (Buat Perkara Dikunci)</option>
                        <option value="PRO">Pro Individu (3 Perangkat)</option>
                        <option value="FIRM_ENTERPRISE">Law Firm Enterprise (10 Perangkat)</option>
                        <option value="LIFETIME">Lifetime VIP (25 Perangkat)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                        Durasi Masa Aktif
                      </label>
                      <select
                        value={genDays}
                        onChange={(e) => setGenDays(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      >
                        <option value={30}>30 Hari (Trial)</option>
                        <option value={180}>6 Bulan</option>
                        <option value={365}>1 Tahun Penuh</option>
                        <option value={730}>2 Tahun</option>
                        <option value={36500}>Seumur Hidup (Lifetime)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateKey}
                    className="w-full rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 transition flex items-center justify-center gap-1.5"
                  >
                    <Zap className="h-3.5 w-3.5 text-amber-400" />
                    <span>Generate Kunci Lisensi Baru</span>
                  </button>

                  {generatedKey && (
                    <div className="rounded-2xl border border-amber-300 bg-amber-50/70 p-4 dark:border-amber-900 dark:bg-amber-950/40 space-y-3 animate-in fade-in">
                      <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                        Kunci Lisensi Berhasil Dibuat ({genTier === 'TRIAL' ? 'Mode Demo' : 'Akses Penuh'}):
                      </span>
                      <div className="flex items-center justify-between gap-2 rounded-xl bg-white dark:bg-slate-900 p-2.5 border border-amber-200 dark:border-amber-800">
                        <code className="font-mono text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-300">
                          {generatedKey}
                        </code>
                        <button
                          type="button"
                          onClick={handleCopyKey}
                          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                          title="Salin Kunci"
                        >
                          {isCopied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleUseGeneratedKey}
                          className="rounded-xl bg-amber-700 px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-amber-800 transition"
                        >
                          Gunakan Kunci Ini untuk Masuk →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Status Note */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${isCloudConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span>{isCloudConnected ? 'Backend Supabase Terhubung' : 'Mode Offline / Standalone'}</span>
              </div>
              <span>CaseIntel v2.0</span>
            </div>
          </div>

          {/* Right Area (5 Cols): Product Value Info */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold tracking-wider uppercase font-mono">
                <ShieldCheck className="h-4 w-4" />
                <span>Standar Gelar Perkara Pidana</span>
              </div>

              <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug text-white">
                Pemetaan Yuridis Akurat &amp; Audit Praperadilan Otomatis
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p>
                    <strong>Papan Intelijen (Graph Relasi)</strong>: Menghubungkan tersangka, saksi, bukti, dan kronologi dalam satu kanvas interaktif.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p>
                    <strong>Validasi Putusan MK No. 21/2014</strong>: Memastikan syarat minimal 2 alat bukti sah terpenuhi sebelum penetapan tersangka.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p>
                    <strong>Sinkronisasi Cloud Supabase</strong>: Akses berkas perkara Anda dari multi-perangkat kantor hukum secara aman.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p>
                    <strong>Kalkulator Daluwarsa &amp; Uji Alibi</strong>: Menganalisis tempus delicti dan menguji deviasi klaim alibi tersangka.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-slate-300 uppercase tracking-wider block font-mono">
                Kepatuhan Regulasi
              </span>
              <p>UU No. 1/2023 (KUHP Nasional), WvS, Pasal 77 &amp; 235 KUHAP, dan Putusan Mahkamah Konstitusi.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
