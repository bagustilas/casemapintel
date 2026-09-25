'use client';

import React from 'react';
import { useCase } from '@/context/CaseContext';
import { calculateDaluwarsa } from '@/lib/scoring';
import { Search, Calendar, ShieldAlert, AlertCircle, Compass, CheckCircle2 } from 'lucide-react';

export function Tab6Investigasi() {
  const { currentCase, updateField } = useCase();

  const daluwarsa = calculateDaluwarsa(
    currentCase.statuteDate || currentCase.incidentDateStart,
    currentCase.statuteMaxPenaltyYears || '6'
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
          <Search className="h-4 w-4" />
          <span>Tab 06 · Investigasi Lanjutan &amp; Audit Formil</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
          Investigasi Lanjutan, Alibi &amp; Audit Praperadilan
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Lakukan kalkulasi masa daluwarsa penuntutan, uji keabsahan alibi tersangka, dan periksa potensi cacat formil guna memitigasi gugatan praperadilan.
        </p>
      </div>

      {/* 1. Kalkulator Daluwarsa */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm">
          <Calendar className="h-4 w-4 text-amber-700 dark:text-amber-400" />
          <span>Kalkulator Daluwarsa Penuntutan (Pasal 78 KUHP &amp; UU 1/2023)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
              Tanggal Terjadinya Perbuatan (Tempus Delicti)
            </label>
            <input
              type="date"
              value={currentCase.statuteDate || currentCase.incidentDateStart || ''}
              onChange={(e) => updateField('statuteDate', e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
              Klasifikasi Ancaman Pidana Maksimum
            </label>
            <select
              value={currentCase.statuteMaxPenaltyYears || '6'}
              onChange={(e) => updateField('statuteMaxPenaltyYears', e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="6">Di bawah 3 tahun → Masa daluwarsa 6 tahun</option>
              <option value="12">3 – 7 tahun → Masa daluwarsa 12 tahun</option>
              <option value="12b">7 – 12 tahun → Masa daluwarsa 12 tahun</option>
              <option value="18">Di atas 12 tahun → Masa daluwarsa 18 tahun</option>
              <option value="99">Pidana mati / seumur hidup → Tidak daluwarsa</option>
            </select>
          </div>
        </div>

        <div
          className={`rounded-xl p-3.5 text-xs font-medium border flex items-center gap-3 ${
            daluwarsa.isExpired
              ? 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900'
          }`}
        >
          {daluwarsa.isExpired ? (
            <ShieldAlert className="h-5 w-5 text-rose-600 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          )}
          <div>
            <p className="font-bold">
              {daluwarsa.isExpired ? '⚠ PERINGATAN DALUWARSA' : '✅ STATUS PENUNTUTAN SAH'}
            </p>
            <p className="text-[11px] mt-0.5">{daluwarsa.statusText}</p>
          </div>
        </div>
      </div>

      {/* 2. Uji Alibi Tersangka */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm">
          <Compass className="h-4 w-4 text-purple-600" />
          <span>Pengujian Alibi Tersangka (Uji Deviasi Fakta vs Pengakuan)</span>
        </div>

        <p className="text-xs text-slate-500">
          Bandingkan pengakuan alibi tersangka dengan fakta objektif yang terungkap dari kronologi, saksi, dan CCTV.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3 rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              1. Klaim / Keterangan Tersangka
            </span>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Klaim Tanggal</label>
              <input
                type="date"
                value={currentCase.alibiClaimDate || ''}
                onChange={(e) => updateField('alibiClaimDate', e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Klaim Lokasi Keberadaan</label>
              <input
                type="text"
                value={currentCase.alibiClaimLocation || ''}
                onChange={(e) => updateField('alibiClaimLocation', e.target.value)}
                placeholder="mis. Di rumah pribadi di Oesapa"
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Klaim Waktu / Aktivitas</label>
              <input
                type="text"
                value={currentCase.alibiClaimTime || ''}
                onChange={(e) => updateField('alibiClaimTime', e.target.value)}
                placeholder="mis. 20:00 WITA (sedang tidur)"
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-3 rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
              2. Fakta Objektif Kronologi &amp; Bukti
            </span>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Fakta Tanggal Kejadian</label>
              <input
                type="date"
                value={currentCase.alibiActualDate || ''}
                onChange={(e) => updateField('alibiActualDate', e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Fakta Lokasi Berdasarkan Bukti</label>
              <input
                type="text"
                value={currentCase.alibiActualLocation || ''}
                onChange={(e) => updateField('alibiActualLocation', e.target.value)}
                placeholder="mis. Di kantor CV Mitra Jaya (terekam CCTV)"
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Fakta Waktu Berdasarkan Bukti</label>
              <input
                type="text"
                value={currentCase.alibiActualTime || ''}
                onChange={(e) => updateField('alibiActualTime', e.target.value)}
                placeholder="mis. 20:15 WITA (log CCTV & saksi satpam)"
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Audit Cacat Formil Praperadilan */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm">
          <ShieldAlert className="h-4 w-4 text-rose-600" />
          <span>Audit Cacat Formil Prosedural (Mitigasi Risiko Praperadilan)</span>
        </div>

        <div className="space-y-3">
          {/* Poin 1 */}
          <div className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  1. Keabsahan Penetapan Tersangka
                </span>
                <p className="text-[11px] text-slate-500">
                  Ref: Putusan MK No. 21/PUU-XII/2014 — Wajib didahului pemeriksaan calon tersangka dan minimal 2 alat bukti sah.
                </p>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => updateField('auditSuspectStatus', 'sah')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    currentCase.auditSuspectStatus === 'sah'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  ✅ Sah
                </button>
                <button
                  type="button"
                  onClick={() => updateField('auditSuspectStatus', 'cacat')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    currentCase.auditSuspectStatus === 'cacat'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  ⚠️ Cacat Formil
                </button>
              </div>
            </div>
          </div>

          {/* Poin 2 */}
          <div className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  2. Keabsahan Penggeledahan &amp; Penyitaan
                </span>
                <p className="text-[11px] text-slate-500">
                  Ref: Pasal 33 &amp; 38 KUHAP — Dilengkapi surat izin Ketua Pengadilan Negeri atau keadaan mendesak sesuai prosedur.
                </p>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => updateField('auditSearchSeizureStatus', 'sah')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    currentCase.auditSearchSeizureStatus === 'sah'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  ✅ Sah
                </button>
                <button
                  type="button"
                  onClick={() => updateField('auditSearchSeizureStatus', 'cacat')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    currentCase.auditSearchSeizureStatus === 'cacat'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  ⚠️ Cacat Formil
                </button>
              </div>
            </div>
          </div>

          {/* Poin 3 */}
          <div className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  3. Keabsahan Penangkapan &amp; Penahanan
                </span>
                <p className="text-[11px] text-slate-500">
                  Ref: Pasal 77 huruf a KUHAP — Dilengkapi Surat Perintah Penangkapan/Penahanan yang sah dan tidak melampaui batas waktu 1x24 jam tanpa perpanjangan.
                </p>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => updateField('auditArrestDetentionStatus', 'sah')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    currentCase.auditArrestDetentionStatus === 'sah'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  ✅ Sah
                </button>
                <button
                  type="button"
                  onClick={() => updateField('auditArrestDetentionStatus', 'cacat')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    currentCase.auditArrestDetentionStatus === 'cacat'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  ⚠️ Cacat Formil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Celah Penyelidikan */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Analisis Fakta &amp; Celah Penyelidikan (Investigation Gaps)
        </label>
        <textarea
          rows={3}
          value={currentCase.investigationGaps || ''}
          onChange={(e) => updateField('investigationGaps', e.target.value)}
          placeholder="Catat fakta-fakta yang belum lengkap, saksi yang belum diperiksa, atau surat penetapan izin sita yang masih perlu diajukan..."
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white resize-y"
        />
      </div>
    </div>
  );
}
