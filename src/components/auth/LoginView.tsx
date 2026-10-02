'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/case';
import {
  Scale,
  Key,
  Phone,
  User,
  Building,
  ShieldCheck,
  Sparkles,
  Lock,
  ArrowRight,
  ShieldAlert,
  Shield,
  CheckCircle2,
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
  const { login, loginAsSuperAdmin, quickLoginAs, isCloudConnected } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'quick' | 'admin'>('login');
  const [waNumber, setWaNumber] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('Advokat / Penasihat Hukum');
  const [organization, setOrganization] = useState('');

  // Super Admin PIN State
  const [adminPin, setAdminPin] = useState('');
  const [adminWa, setAdminWa] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

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

  const handleSuperAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const res = await loginAsSuperAdmin(adminPin, adminWa || '0800-SUPER-ADMIN');
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
            CASEMAPINTEL
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Platform intelijen perkara pidana untuk Advokat, Penyidik, dan Jaksa. Masukkan nomor WhatsApp &amp; Kunci Lisensi resmi Anda untuk mengakses berkas perkara.
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
                  <span>Mode Demo</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('admin');
                    setFeedback(null);
                  }}
                  className={`pb-3 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'admin'
                      ? 'border-rose-700 text-rose-800 dark:border-rose-400 dark:text-rose-400'
                      : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400'
                  }`}
                >
                  <Shield className="h-3.5 w-3.5 text-rose-600" />
                  <span>Super Admin</span>
                </button>
              </div>

              {/* Feedback Error Message */}
              {feedback && !feedback.success && (
                <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-300 flex items-start gap-2 animate-in fade-in">
                  <ShieldAlert className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span>{feedback.message}</span>
                </div>
              )}

              {/* 1. FORM LOGIN PENGGUNA */}
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
                        Kunci Lisensi Resmi <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10.5px] text-slate-400">Diberikan oleh Super Admin / Kantor</span>
                    </div>
                    <div className="relative">
                      <Key className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={licenseKey}
                        onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                        placeholder="mis. CASEINTEL-PRO-2026 atau lisensi Anda"
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
                          placeholder="mis. Ilvana Oktaviani S.H."
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
                        placeholder="mis. Kantor Hukum Ilvana Oktaviani, S.H & Partners"
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

              {/* 2. SINGLE DEMO MODE ACCESS */}
              {activeTab === 'quick' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Masuk instan ke sistem untuk mengevaluasi data perkara contoh &amp; simulasi graf:
                  </p>

                  <div className="space-y-2.5">
                    {/* Satu-satunya Akun Demo Terbatas */}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleQuickLogin('CASEINTEL-DEMO-TRIAL', 'Pengguna Umum / Peneliti')}
                      className="w-full rounded-2xl border-2 border-amber-300 bg-amber-50/70 p-4 text-left hover:border-amber-500 hover:bg-amber-100/50 dark:border-amber-800 dark:bg-amber-950/40 dark:hover:border-amber-500/50 transition flex items-center justify-between group shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-200 text-amber-900 font-bold text-base dark:bg-amber-900 dark:text-amber-200 shadow-sm">
                          <Lock className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                              Masuk Mode Demo
                            </h4>
                            <span className="rounded bg-amber-200 px-1.5 py-0.2 text-[9px] font-bold text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                              DEMO
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                            Hanya untuk evaluasi berkas contoh · 🔒 Fitur buat perkara baru dikunci
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-amber-700 dark:text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )}

              {/* 3. PORTAL SUPER ADMIN */}
              {activeTab === 'admin' && (
                <form onSubmit={handleSuperAdminSubmit} className="space-y-4">
                  <div className="rounded-2xl bg-rose-50 p-4 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900 space-y-1">
                    <div className="flex items-center gap-2 text-rose-900 dark:text-rose-300 font-bold text-xs">
                      <Shield className="h-4 w-4" />
                      <span>Portal Khusus Super Admin / Pengelola</span>
                    </div>
                    <p className="text-[11px] text-rose-800/90 dark:text-rose-300/90 leading-relaxed">
                      Hanya Super Admin yang berwenang membuat, menerbitkan, dan mengelola kunci lisensi PRO, Law Firm, dan Uji Coba. Masukkan PIN Super Admin resmi.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      PIN Rahasia / Kunci Master Super Admin <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={adminPin}
                        onChange={(e) => setAdminPin(e.target.value)}
                        placeholder="Masukkan PIN Super Admin (mis. admin2026)"
                        className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-xs sm:text-sm font-mono font-bold text-slate-900 shadow-sm focus:border-rose-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Nomor WhatsApp Admin (Opsional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={adminWa}
                        onChange={(e) => setAdminWa(e.target.value)}
                        placeholder="mis. 0800-SUPER-ADMIN"
                        className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-8 pr-3 text-xs font-medium text-slate-900 shadow-sm focus:border-rose-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-2xl bg-rose-700 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-rose-800 dark:bg-rose-600 dark:hover:bg-rose-700 transition flex items-center justify-center gap-2 mt-4"
                  >
                    <span>{isSubmitting ? 'Memverifikasi...' : 'Masuk sebagai Super Admin'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
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
