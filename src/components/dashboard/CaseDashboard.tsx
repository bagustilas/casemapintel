'use client';

import React, { useState, useRef } from 'react';
import { useCase } from '@/context/CaseContext';
import { useAuth } from '@/context/AuthContext';
import {
  FolderPlus,
  FileJson,
  Upload,
  Search,
  Scale,
  Calendar,
  MapPin,
  Trash2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Lock,
  Key,
  ShieldAlert,
  ArrowRight,
  X,
  Zap,
} from 'lucide-react';
import { AccountModal } from '../account/AccountModal';

export function CaseDashboard() {
  const {
    caseList,
    newCase,
    openCase,
    openCaseResults,
    deleteCase,
    loadSampleCase,
    exportAllCasesJson,
    importCasesJson,
    isDemoMode,
    isUpgradeModalOpen,
    setIsUpgradeModalOpen,
  } = useCase();

  const { session } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState('ALL');
  const [importStatus, setImportStatus] = useState<{ success: boolean; msg: string } | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredCases = caseList.filter((c) => {
    const matchQuery =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lpNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.crimeCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.mainArticle && c.mainArticle.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchStage = filterStage === 'ALL' || c.investigationStage === filterStage;
    return matchQuery && matchStage;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importCasesJson(content);
      if (res.success) {
        setImportStatus({ success: true, msg: `Berhasil mengimpor ${res.count} berkas perkara!` });
      } else {
        setImportStatus({ success: false, msg: res.error || 'Gagal mengimpor file JSON.' });
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleNewCaseClick = () => {
    if (isDemoMode) {
      setIsUpgradeModalOpen(true);
      return;
    }
    newCase();
  };

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Demo Mode Restricted Notice Banner */}
      {isDemoMode && (
        <div className="rounded-3xl border border-amber-300 bg-gradient-to-r from-amber-50 via-amber-100/70 to-amber-50 p-5 shadow-sm dark:border-amber-900/60 dark:from-amber-950/40 dark:via-amber-900/20 dark:to-amber-950/40 text-amber-950 dark:text-amber-200 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-200/80 text-amber-900 dark:bg-amber-900 dark:text-amber-200 flex-shrink-0 mt-0.5 shadow-sm">
                <Lock className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold font-serif">Akun Demo (Kemampuan Terbatas)</h3>
                  <span className="rounded-full bg-amber-200 px-2 py-0.2 text-[10px] font-bold text-amber-900 dark:bg-amber-900 dark:text-amber-200 font-mono">
                    DEMO TRIAL
                  </span>
                </div>
                <p className="text-xs text-amber-900/90 dark:text-amber-200/90 max-w-2xl leading-relaxed">
                  Fitur pembuatan analisa perkara baru <strong>dinonaktifkan (terkunci)</strong> pada akun demo. Anda dapat mengeksplorasi, mengedit narasi &amp; barang bukti, serta menjalankan simulasi graf pada perkara contoh. Untuk membuat perkara baru, silakan gunakan Lisensi Pro.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAccountModalOpen(true)}
              className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl bg-amber-800 px-4 py-2 text-xs font-bold text-white shadow hover:bg-amber-900 dark:bg-amber-600 dark:hover:bg-amber-700 transition flex-shrink-0"
            >
              <Key className="h-3.5 w-3.5" />
              <span>Aktifkan Lisensi Pro</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Banner / Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Scale className="h-4 w-4" />
            <span>Pusat Manajemen Berkas Perkara</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-serif">
            Daftar Perkara Tersimpan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Analisis konstruksi hukum, pemetaan barang bukti, dan audit prosedural praperadilan.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* New Case Button with Disabled State in Demo Mode */}
          {isDemoMode ? (
            <button
              type="button"
              onClick={() => setIsUpgradeModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-500 shadow-sm hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Pembuatan perkara baru dinonaktifkan pada Akun Demo. Klik untuk mengaktifkan Lisensi PRO."
            >
              <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span>+ Buat Analisis Perkara Baru</span>
              <span className="rounded bg-amber-200/80 px-1.5 py-0.2 text-[9px] font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-mono">
                TERKUNCI
              </span>
            </button>
          ) : (
            <button
              onClick={handleNewCaseClick}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-700 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 transition"
            >
              <FolderPlus className="h-4 w-4" />
              <span>+ Buat Analisis Perkara Baru</span>
            </button>
          )}

          <button
            onClick={loadSampleCase}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-xs font-semibold text-amber-900 shadow-sm hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-200 transition"
            title="Muat data contoh tindak pidana penggelapan CV Mitra Jaya"
          >
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span>Muat Data Contoh</span>
          </button>

          <button
            onClick={exportAllCasesJson}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
            title="Ekspor seluruh perkara ke file JSON"
          >
            <FileJson className="h-4 w-4 text-slate-500" />
            <span>Ekspor JSON</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
            title="Impor perkara dari file JSON"
          >
            <Upload className="h-4 w-4 text-slate-500" />
            <span>Impor JSON</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="application/json"
            className="hidden"
          />
        </div>
      </div>

      {/* Import Status Alert */}
      {importStatus && (
        <div
          className={`flex items-center gap-2 rounded-xl p-3.5 text-xs font-semibold ${
            importStatus.success
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200'
          }`}
        >
          {importStatus.success ? <CheckCircle2 className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
          <span>{importStatus.msg}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan judul perkara, no. LP, pasal, atau jenis delik..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm font-medium text-slate-800 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          />
        </div>

        <select
          value={filterStage}
          onChange={(e) => setFilterStage(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-800 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        >
          <option value="ALL">Semua Tahap Penanganan</option>
          <option value="Pra-Laporan / Konsultasi">Pra-Laporan</option>
          <option value="Penyelidikan">Penyelidikan</option>
          <option value="Penyidikan">Penyidikan</option>
          <option value="Pra-Penuntutan (Tahap I)">Pra-Penuntutan</option>
          <option value="Penuntutan (Tahap II)">Penuntutan</option>
          <option value="Persidangan">Persidangan</option>
          <option value="Praperadilan">Praperadilan</option>
        </select>
      </div>

      {/* Case Grid */}
      {filteredCases.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-800 bg-white/50 dark:bg-slate-900/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 mb-3">
            <Scale className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            {searchQuery ? 'Tidak ada perkara yang cocok' : 'Belum ada perkara tersimpan'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            {searchQuery
              ? 'Coba gunakan kata kunci pencarian lain atau setel ulang filter.'
              : 'Mulai dengan membuka data contoh perkara penggelapan atau aktifkan lisensi Pro.'}
          </p>
          <div className="flex gap-2 mt-4">
            {isDemoMode ? (
              <button
                type="button"
                onClick={() => setIsUpgradeModalOpen(true)}
                className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 flex items-center gap-1.5"
              >
                <Lock className="h-3.5 w-3.5 text-amber-600" />
                <span>+ Perkara Baru (Terkunci)</span>
              </button>
            ) : (
              <button
                onClick={handleNewCaseClick}
                className="rounded-xl bg-amber-700 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-800 transition"
              >
                + Perkara Baru
              </button>
            )}
            <button
              onClick={loadSampleCase}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-100 transition"
            >
              Muat Contoh Data
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCases.map((item) => {
            const score = item.calculatedScore ?? 0;
            const scoreColor =
              score >= 70
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                : score >= 40
                ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
                : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800';

            const suspectsCount = (item.parties || []).filter((p) => p.role === 'Tersangka').length;
            const evidenceCount = (item.availableEvidence || []).length;
            const eventsCount = (item.chronology || []).length;

            return (
              <div
                key={item.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-amber-500/50 dark:border-slate-800 dark:bg-slate-900 transition"
              >
                <div>
                  {/* Top Tags & Score */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300 uppercase">
                        {item.crimeCategory}
                      </span>
                      <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                        {item.investigationStage}
                      </span>
                    </div>

                    <div
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${scoreColor}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                      />
                      <span>Skor {score}%</span>
                    </div>
                  </div>

                  {/* Title & LP */}
                  <h3
                    onClick={() => openCase(item.id)}
                    className="text-base font-bold text-slate-900 dark:text-white font-serif hover:text-amber-700 dark:hover:text-amber-400 cursor-pointer line-clamp-2 transition mb-1.5"
                  >
                    {item.title || '(Perkara Belum Diberi Judul)'}
                  </h3>

                  {item.lpNumber && (
                    <p className="font-mono text-xs text-slate-500 dark:text-slate-400 mb-2">
                      LP: {item.lpNumber}
                    </p>
                  )}

                  {item.mainArticle && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 line-clamp-1">
                      ⚖ <span className="font-semibold">{item.mainArticle}</span>
                    </p>
                  )}

                  {/* Metrics Snapshot */}
                  <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-2.5 text-center text-xs dark:bg-slate-800/60 mb-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Tersangka</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{suspectsCount}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Alat Bukti</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{evidenceCount}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Peristiwa</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{eventsCount}</p>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {new Date(item.updatedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => deleteCase(item.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition"
                      title="Hapus perkara"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => openCaseResults(item.id)}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
                    >
                      Hasil Gelar
                    </button>

                    <button
                      onClick={() => openCase(item.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-amber-700 px-3 py-1.5 font-semibold text-white shadow-sm hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 transition"
                    >
                      <span>Buka Form</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upgrade / Demo Restriction Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-5 animate-in zoom-in-95">
            <div className="flex justify-between items-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold shadow-sm">
                <Lock className="h-6 w-6" />
              </div>
              <button
                onClick={() => setIsUpgradeModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                Akun Demo: Buat Perkara Baru Terkunci
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Anda saat ini menggunakan <strong>Akun Demo Terbatas</strong>. Pembuatan berkas perkara baru dinonaktifkan untuk akun demo. Anda tetap dapat meninjau, mengedit narasi &amp; barang bukti, serta memutar simulasi graf relasi pada perkara contoh.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 dark:bg-slate-800/50 dark:border-slate-800 text-xs space-y-2">
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block text-[10px]">
                Fitur Lengkap Lisensi Pro / Law Firm:
              </span>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Buat &amp; kelola analisis perkara baru tanpa batas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Sinkronisasi otomatis multi-perangkat via Supabase</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Ekspor PDF Laporan Gelar Perkara Resmi</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsUpgradeModalOpen(false)}
                className="flex-1 rounded-xl border border-slate-300 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsUpgradeModalOpen(false);
                  setIsAccountModalOpen(true);
                }}
                className="flex-1 rounded-xl bg-amber-700 py-2.5 text-xs font-bold text-white shadow hover:bg-amber-800 transition flex items-center justify-center gap-1.5"
              >
                <Key className="h-3.5 w-3.5" />
                <span>Masukkan Lisensi Pro</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Modal */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        defaultTab="license"
      />
    </div>
  );
}
