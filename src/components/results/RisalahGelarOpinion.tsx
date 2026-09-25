'use client';

import React from 'react';
import { CaseData, ScoreBreakdown } from '@/types/case';
import { formatRupiah } from '@/lib/scoring';
import { FileText, Award, CheckCircle2, ShieldAlert } from 'lucide-react';

interface RisalahGelarOpinionProps {
  caseData: CaseData;
  scoreBreakdown: ScoreBreakdown;
}

export function RisalahGelarOpinion({ caseData, scoreBreakdown }: RisalahGelarOpinionProps) {
  const dateStr = caseData.meetingDate
    ? new Date(caseData.meetingDate).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

  const totalDamages = (caseData.damages || [])
    .filter((d) => d.type === 'Materiil')
    .reduce((sum, d) => sum + (Number(d.nominal) || 0), 0);

  const suspects = (caseData.parties || []).filter((p) => p.role === 'Tersangka');
  const victims = (caseData.parties || []).filter((p) => p.role === 'Korban / Pelapor');

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6 print:border-none print:shadow-none print:p-0">
      {/* Document Header */}
      <div className="border-b-2 border-slate-900 pb-4 dark:border-slate-100 text-center space-y-1">
        <span className="font-mono text-xs font-bold tracking-widest text-slate-500 uppercase">
          RAHASIA / PRO JUSTITIA
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white font-serif uppercase tracking-wide">
          Risalah Gelar Perkara &amp; Pendapat Hukum (Legal Opinion)
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Nomor Registrasi Analisis: <span className="font-mono font-semibold">{caseData.internalRef || 'CI-LEG-2026/001'}</span>
        </p>
      </div>

      {/* 1. Identitas Perkara */}
      <div className="space-y-2 text-xs sm:text-sm">
        <h4 className="font-bold font-serif text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs border-b border-slate-200 pb-1 dark:border-slate-800">
          I. Identitas &amp; Pokok Perkara
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pt-1 text-xs">
          <div>
            <span className="text-slate-500">Judul Perkara:</span>
            <p className="font-bold text-slate-900 dark:text-slate-100">{caseData.title || '-'}</p>
          </div>
          <div>
            <span className="text-slate-500">Nomor Laporan Polisi:</span>
            <p className="font-mono font-bold text-slate-900 dark:text-slate-100">{caseData.lpNumber || '-'}</p>
          </div>
          <div>
            <span className="text-slate-500">Klasifikasi Tindak Pidana:</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{caseData.crimeCategory}</p>
          </div>
          <div>
            <span className="text-slate-500">Pasal Sangkaan:</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{caseData.mainArticle || '-'}</p>
          </div>
          <div>
            <span className="text-slate-500">Locus &amp; Tempus Delicti:</span>
            <p className="font-medium text-slate-900 dark:text-slate-100">
              {caseData.locationDistrict || '-'} / {caseData.incidentDateStart || '-'} {caseData.incidentDateEnd ? `s.d. ${caseData.incidentDateEnd}` : ''}
            </p>
          </div>
          <div>
            <span className="text-slate-500">Estimasi Kerugian Materiil:</span>
            <p className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
              {totalDamages > 0 ? formatRupiah(totalDamages) : 'Non-Materiil / Fisik'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Ringkasan Fakta Hukum */}
      <div className="space-y-2 text-xs sm:text-sm">
        <h4 className="font-bold font-serif text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs border-b border-slate-200 pb-1 dark:border-slate-800">
          II. Ringkasan Duduk Perkara (Posita Fakta)
        </h4>
        <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 text-justify">
          {caseData.briefSummary ||
            'Telah terjadi dugaan peristiwa pidana yang dilaporkan oleh pihak korban/pelapor terhadap tersangka, di mana berdasarkan hasil penyelidikan/penyidikan awal ditemukan rangkaian perbuatan yang terstruktur dan memenuhi kualifikasi delik yang disangkakan.'}
        </p>
      </div>

      {/* 3. Pembuktian & Pemenuhan Unsur */}
      <div className="space-y-2 text-xs sm:text-sm">
        <h4 className="font-bold font-serif text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs border-b border-slate-200 pb-1 dark:border-slate-800">
          III. Analisis Pembuktian &amp; Unsur Delik (Rechtsoverwegingen)
        </h4>

        <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
          <p>
            1. <strong>Kecukupan Alat Bukti Sah:</strong> Berdasarkan Pasal 235 KUHAP Baru jo. Putusan Mahkamah Konstitusi No. 21/PUU-XII/2014, perkara ini telah didukung oleh{' '}
            <strong>{(caseData.availableEvidence || []).length} jenis alat bukti sah</strong>, yaitu:{' '}
            <em>{(caseData.availableEvidence || []).join(', ') || 'Belum terdata'}</em>. Syarat minimal 2 alat bukti sah dinyatakan{' '}
            <strong>{(caseData.availableEvidence || []).length >= 2 ? 'TERPENUHI' : 'BELUM TERPENUHI'}</strong>.
          </p>

          <p>
            2. <strong>Pemenuhan Unsur Delik:</strong> Dari total {(caseData.articleElements || []).length} unsur pasal yang dianalisis, sebanyak{' '}
            <strong>{(caseData.articleElements || []).filter((e) => e.isFulfilled).length} unsur dinyatakan telah terpenuhi</strong> secara materiil oleh fakta dan barang bukti yang disita.
          </p>

          <p>
            3. <strong>Evaluasi Alibi &amp; Konsistensi:</strong>{' '}
            {scoreBreakdown.alibiInconsistent
              ? 'Terbukti terdapat deviasi dan inkonsistensi signifikan antara pengakuan alibi tersangka dengan rekaman bukti objektif kronologi.'
              : 'Pemeriksaan alibi tersangka memerlukan pendalaman saksi pembanding tambahan.'}
          </p>
        </div>
      </div>

      {/* 4. Audit Formil Praperadilan */}
      <div className="space-y-2 text-xs sm:text-sm">
        <h4 className="font-bold font-serif text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs border-b border-slate-200 pb-1 dark:border-slate-800">
          IV. Audit Prosedural &amp; Mitigasi Risiko Praperadilan
        </h4>

        <div className="grid grid-cols-3 gap-2 text-[11px] text-center">
          <div className="rounded-xl border p-2 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-slate-500 block">Penetapan Tersangka</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400">
              {caseData.auditSuspectStatus === 'sah' ? '✅ Sah (Min 2 Bukti)' : '⚠️ Potensi Cacat'}
            </span>
          </div>
          <div className="rounded-xl border p-2 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-slate-500 block">Penggeledahan / Sita</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400">
              {caseData.auditSearchSeizureStatus === 'sah' ? '✅ Sesuai Prosedur' : '⚠️ Potensi Cacat'}
            </span>
          </div>
          <div className="rounded-xl border p-2 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-slate-500 block">Penangkapan / Tahanan</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400">
              {caseData.auditArrestDetentionStatus === 'sah' ? '✅ Sah Demi Hukum' : '⚠️ Potensi Cacat'}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Kesimpulan & Rekomendasi Gelar */}
      <div className="space-y-2 text-xs sm:text-sm">
        <h4 className="font-bold font-serif text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs border-b border-slate-200 pb-1 dark:border-slate-800">
          V. Kesimpulan &amp; Rekomendasi Gelar Perkara
        </h4>

        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 space-y-2">
          <p className="font-medium text-justify">
            {caseData.meetingConclusion ||
              `Berdasarkan evaluasi kekuatan berkas dengan skor kalkulasi ${scoreBreakdown.totalScore}% (${scoreBreakdown.zoneLabel}), peserta gelar perkara menyimpulkan bahwa berkas telah memenuhi syarat formil dan materiil untuk dilanjutkan ke proses ${caseData.investigationStage}.`}
          </p>
        </div>
      </div>

      {/* Tanda Tangan Notulen / Pimpinan Gelar */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-8 text-center text-xs">
        <div>
          <p className="text-slate-500">Notulis / Penyidik Pemeriksa,</p>
          <div className="h-16" />
          <p className="font-bold text-slate-900 dark:text-white underline">
            {(caseData.participants || [])[1]?.name || 'Penyidik Pembantu'}
          </p>
          <p className="text-[11px] text-slate-500">
            {(caseData.participants || [])[1]?.position || 'Satreskrim'}
          </p>
        </div>

        <div>
          <p className="text-slate-500">
            {caseData.locationDistrict || 'Kupang'}, {dateStr}
          </p>
          <p className="text-slate-500 font-semibold">Pimpinan Sidang Gelar Perkara,</p>
          <div className="h-14" />
          <p className="font-bold text-slate-900 dark:text-white underline">
            {(caseData.participants || [])[0]?.name || 'Kasat Reskrim / Pimpinan Gelar'}
          </p>
          <p className="text-[11px] text-slate-500">
            {(caseData.participants || [])[0]?.position || 'Pimpinan Sidang Gelar'}
          </p>
        </div>
      </div>
    </div>
  );
}
