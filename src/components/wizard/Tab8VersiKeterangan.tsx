'use client';

import React from 'react';
import { useCase } from '@/context/CaseContext';
import { analyzeContradictions } from '@/lib/scoring';
import { MessageSquare, AlertCircle, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

export function Tab8VersiKeterangan() {
  const { currentCase, updateField } = useCase();

  const contradictions = analyzeContradictions(
    currentCase.suspectVersion,
    currentCase.victimVersion,
    currentCase.witnessVersion
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
          <MessageSquare className="h-4 w-4" />
          <span>Tab 08 · Komparasi Narasi &amp; Kontradiksi</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
          Versi Keterangan Para Pihak
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Masukkan kutipan inti keterangan dari berita acara pemeriksaan (BAP) tersangka, korban, dan saksi kunci untuk deteksi pertentangan narasi secara otomatis.
        </p>
      </div>

      {/* Live Contradiction Insight Banner */}
      {(currentCase.suspectVersion || currentCase.victimVersion || currentCase.witnessVersion) && (
        <div
          className={`rounded-2xl p-4 sm:p-5 border shadow-sm ${
            contradictions.hasStrongContradiction
              ? 'bg-rose-50 border-rose-200 text-rose-950 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-200'
              : 'bg-emerald-50 border-emerald-200 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {contradictions.hasStrongContradiction ? (
              <ShieldAlert className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-2 flex-1">
              <div>
                <h4 className="font-bold text-sm">
                  {contradictions.hasStrongContradiction
                    ? '⚡ Indikasi Kontradiksi Narasi Terdeteksi'
                    : '✅ Narasi Relatif Konsisten / Searah'}
                </h4>
                <p className="text-xs opacity-90 mt-0.5">{contradictions.notes}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px] font-mono">
                <div className="rounded-lg bg-white/70 dark:bg-black/30 p-2 border border-black/5 dark:border-white/5">
                  <span className="opacity-70 block">Pelaku ↔ Korban</span>
                  <span className="font-bold">{contradictions.suspectVictimOverlapPct}% Kata Kunci Sama</span>
                </div>
                <div className="rounded-lg bg-white/70 dark:bg-black/30 p-2 border border-black/5 dark:border-white/5">
                  <span className="opacity-70 block">Korban ↔ Saksi</span>
                  <span className="font-bold">{contradictions.victimWitnessOverlapPct}% Kata Kunci Sama</span>
                </div>
                <div className="rounded-lg bg-white/70 dark:bg-black/30 p-2 border border-black/5 dark:border-white/5">
                  <span className="opacity-70 block">Pelaku ↔ Saksi</span>
                  <span className="font-bold">{contradictions.suspectWitnessOverlapPct}% Kata Kunci Sama</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3 Textareas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pelaku */}
        <div className="rounded-2xl border border-rose-200 bg-white p-4 sm:p-5 shadow-sm dark:border-rose-950 dark:bg-slate-900 space-y-2">
          <label className="block text-xs font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider">
            1. Versi Pelaku / Tersangka
          </label>
          <p className="text-[11px] text-slate-400">Pengakuan atau bantahan tersangka dalam BAP</p>
          <textarea
            rows={8}
            value={currentCase.suspectVersion || ''}
            onChange={(e) => updateField('suspectVersion', e.target.value)}
            placeholder="Ketik keterangan tersangka. Contoh: 'Saya berada di rumah sepanjang malam tanggal 14 Mei dan tidak pernah ke kantor...'"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-rose-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white resize-y"
          />
        </div>

        {/* Korban */}
        <div className="rounded-2xl border border-amber-200 bg-white p-4 sm:p-5 shadow-sm dark:border-amber-950 dark:bg-slate-900 space-y-2">
          <label className="block text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
            2. Versi Korban / Pelapor
          </label>
          <p className="text-[11px] text-slate-400">Keterangan fakta kerugian dari pelapor</p>
          <textarea
            rows={8}
            value={currentCase.victimVersion || ''}
            onChange={(e) => updateField('victimVersion', e.target.value)}
            placeholder="Ketik keterangan korban. Contoh: 'Tersangka terlihat masuk ruang kasir di malam hari dan brankas ditemukan kosong di pagi hari...'"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white resize-y"
          />
        </div>

        {/* Saksi Kunci */}
        <div className="rounded-2xl border border-emerald-200 bg-white p-4 sm:p-5 shadow-sm dark:border-emerald-950 dark:bg-slate-900 space-y-2">
          <label className="block text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
            3. Versi Saksi Kunci
          </label>
          <p className="text-[11px] text-slate-400">Kesaksian langsung orang yang melihat kejadian</p>
          <textarea
            rows={8}
            value={currentCase.witnessVersion || ''}
            onChange={(e) => updateField('witnessVersion', e.target.value)}
            placeholder="Ketik kesaksian saksi. Contoh: 'Saya melihat tersangka keluar kantor membawa tas ransel besar sekitar pukul 20:45 secara terburu-buru...'"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-emerald-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white resize-y"
          />
        </div>
      </div>

      {/* Catatan Tambahan Penyidik */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-2">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Catatan Tambahan &amp; Kejanggalan Penyelidik (Investigative Notes)
        </label>
        <textarea
          rows={3}
          value={currentCase.investigatorNotes || ''}
          onChange={(e) => updateField('investigatorNotes', e.target.value)}
          placeholder="Catat temuan psikologis, inkonsistensi waktu, atau bukti petunjuk tambahan yang ditemukan selama penyidikan..."
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white resize-y"
        />
      </div>
    </div>
  );
}
