'use client';

import React, { useRef } from 'react';
import { useCase } from '@/context/CaseContext';
import { calculateDaluwarsa, formatRupiah } from '@/lib/scoring';
import { IntelBoardGraph } from './IntelBoardGraph';
import { CriminalLiabilityMatrix } from './CriminalLiabilityMatrix';
import { RisalahGelarOpinion } from './RisalahGelarOpinion';
import {
  Scale,
  Users,
  ShieldCheck,
  Clock,
  MapPin,
  FileText,
  AlertTriangle,
  Compass,
  Key,
  Calendar,
  Printer,
  ChevronLeft,
  Save,
  CheckCircle2,
  ShieldAlert,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

export function ResultsView() {
  const { currentCase, scoreBreakdown, setViewMode, saveCurrentCase, isSaving } = useCase();
  const printRef = useRef<HTMLDivElement>(null);

  const suspects = (currentCase.parties || []).filter((p) => p.role === 'Tersangka');
  const victims = (currentCase.parties || []).filter((p) => p.role === 'Korban / Pelapor');
  const witnesses = (currentCase.parties || []).filter(
    (p) => p.role === 'Saksi Fakta' || p.role === 'Saksi Ahli'
  );
  const evidence = currentCase.availableEvidence || [];
  const events = currentCase.chronology || [];
  const totalDamages = (currentCase.damages || [])
    .filter((d) => d.type === 'Materiil')
    .reduce((sum, d) => sum + (Number(d.nominal) || 0), 0);

  const daluwarsa = calculateDaluwarsa(
    currentCase.statuteDate || currentCase.incidentDateStart,
    currentCase.statuteMaxPenaltyYears || '6'
  );

  const handlePrint = () => {
    window.print();
  };

  const zoneColorClass =
    scoreBreakdown.zone === 'hijau'
      ? 'bg-emerald-50 text-emerald-950 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800'
      : scoreBreakdown.zone === 'kuning'
      ? 'bg-amber-50 text-amber-950 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800'
      : 'bg-rose-50 text-rose-950 border-rose-300 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800';

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8 space-y-8 print:p-0 print:max-w-none">
      {/* 1. TOP HEADER & COUNTERS */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-full bg-amber-500/20 px-3 py-1 font-mono text-[11px] font-bold text-amber-300 uppercase tracking-wider border border-amber-500/30">
              Laporan Gelar Perkara Pidana
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-300">
              {currentCase.investigationStage}
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif leading-tight">
              {currentCase.title || '(Perkara Belum Diberi Judul)'}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 mt-2 font-mono">
              {currentCase.lpNumber && <span>LP: {currentCase.lpNumber}</span>}
              {currentCase.mainArticle && <span>⚖ {currentCase.mainArticle}</span>}
              <span>📍 {currentCase.locationDistrict || currentCase.locationPolda || 'Yurisdiksi Umum'}</span>
            </div>
          </div>

          {/* 5-Item Stat Counter Row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
            <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-3 text-center">
              <span className="font-serif text-2xl font-bold text-rose-400">{suspects.length}</span>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">Pelaku</p>
            </div>
            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3 text-center">
              <span className="font-serif text-2xl font-bold text-amber-400">{victims.length}</span>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">Korban</p>
            </div>
            <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-center">
              <span className="font-serif text-2xl font-bold text-emerald-400">{witnesses.length}</span>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">Saksi/Ahli</p>
            </div>
            <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-3 text-center">
              <span className="font-serif text-2xl font-bold text-blue-400">{evidence.length}</span>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">Alat Bukti</p>
            </div>
            <div className="col-span-2 sm:col-span-1 rounded-2xl bg-purple-500/10 border border-purple-500/20 p-3 text-center">
              <span className="font-serif text-lg font-bold text-purple-300 line-clamp-1">
                {totalDamages > 0 ? formatRupiah(totalDamages) : `${events.length} Peristiwa`}
              </span>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">
                {totalDamages > 0 ? 'Kerugian' : 'Kronologi'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RINGKASAN EKSEKUTIF */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-2">
        <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="h-4 w-4 text-amber-700 dark:text-amber-400" />
          <span>Ringkasan Eksekutif Perkara</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
          Perkara dugaan tindak pidana <strong>{currentCase.crimeCategory}</strong> dengan judul{' '}
          <strong>&ldquo;{currentCase.title}&rdquo;</strong> saat ini berada pada tahap penanganan{' '}
          <strong>{currentCase.investigationStage}</strong>. Rezim hukum materiil yang dijadikan rujukan adalah{' '}
          <strong>{currentCase.legalRegime === 'KUHP_2023' ? 'KUHP Nasional (UU No. 1 Tahun 2023)' : 'KUHP Lama (WvS)'}</strong>{' '}
          dengan sangkaan utama <strong>{currentCase.mainArticle || 'Pasal belum ditentukan'}</strong>. Berdasarkan
          analisis konstruksi hukum, berkas perkara mencatat <strong>{suspects.length} tersangka</strong>,{' '}
          <strong>{victims.length} korban/pelapor</strong>, <strong>{witnesses.length} saksi/ahli</strong>, dan{' '}
          <strong>{evidence.length} alat bukti sah</strong> dengan skor pembuktian{' '}
          <strong className="font-mono text-amber-700 dark:text-amber-400">{scoreBreakdown.totalScore}% ({scoreBreakdown.zoneLabel})</strong>.
          {currentCase.briefSummary && ` Catatan penyidik: "${currentCase.briefSummary}"`}
        </p>
      </div>

      {/* 3. MATRIKS PERTANGGUNGJAWABAN PIDANA */}
      <div className="space-y-3">
        <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Scale className="h-4 w-4 text-rose-600" />
          <span>⚖ Matriks Pertanggungjawaban Pidana Tersangka</span>
        </h3>
        <CriminalLiabilityMatrix caseData={currentCase} score={scoreBreakdown.totalScore} />
      </div>

      {/* 4. PAPAN INTELIJEN GRAPH */}
      <div className="space-y-3">
        <IntelBoardGraph caseData={currentCase} />
      </div>

      {/* 5 & 6. TIMELINE + YURISDIKSI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timeline Kronologis */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-700 dark:text-amber-400" />
            <span>Alur Modus &amp; Peristiwa Kronologis</span>
          </h3>

          {events.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Belum ada peristiwa pada kronologi.</p>
          ) : (
            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 pl-6">
              {events.map((ev, idx) => (
                <div key={ev.id} className="relative space-y-1">
                  <div className="absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-amber-600 dark:border-slate-900 shadow-sm" />
                  <span className="font-mono text-[11px] font-bold text-slate-400">
                    {ev.datetime ? new Date(ev.datetime).toLocaleString('id-ID') : `Peristiwa #${idx + 1}`}
                  </span>
                  {ev.location && (
                    <span className="text-[11px] text-amber-700 dark:text-amber-400 block font-medium">
                      📍 {ev.location}
                    </span>
                  )}
                  <p className="text-xs text-slate-700 dark:text-slate-300">{ev.narrative}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rekomendasi Wilayah Hukum */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <span>Rekomendasi Wilayah Hukum Pelaporan</span>
          </h3>

          <div className="rounded-xl bg-emerald-50/70 p-4 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 space-y-2 text-xs">
            <p className="font-semibold text-emerald-900 dark:text-emerald-200">
              Berdasarkan asas <em>locus delicti</em> (tempat terjadinya tindak pidana):
            </p>
            <div className="space-y-1 text-slate-700 dark:text-slate-300">
              <p>
                • <strong>Lokasi Peristiwa:</strong> {currentCase.locationDistrict || 'Belum diisi'}
              </p>
              <p>
                • <strong>Satuan Kepolisian Berwenang:</strong>{' '}
                {currentCase.locationPolda || 'Polres setempat sesuai locus'}
              </p>
              <p>
                • <strong>Kejaksaan Negeri:</strong> Kejaksaan Negeri di wilayah yurisdiksi Pengadilan Negeri setempat.
              </p>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Ref: Pasal 84 KUHAP — Pengadilan Negeri berwenang mengadili perkara pidana yang dilakukan dalam daerah hukumnya.
            </p>
          </div>

          {/* Daluwarsa Card */}
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 dark:bg-slate-800/40 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span>Kalkulasi Daluwarsa Penuntutan</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300">{daluwarsa.statusText}</p>
          </div>
        </div>
      </div>

      {/* 7, 8, 9. BUKTI, JEJAK DIGITAL & CELAH */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Kalkulator Syarat Bukti */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Syarat Alat Bukti</span>
            </h4>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                evidence.length >= 2
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}
            >
              {evidence.length >= 2 ? '✅ Terpenuhi' : '⚠️ Belum'}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            Tersedia <strong>{evidence.length} jenis alat bukti sah</strong>. Sesuai Putusan MK No. 21/PUU-XII/2014,
            penetapan tersangka sah secara hukum jika didahului minimal 2 alat bukti.
          </p>

          <div className="flex flex-wrap gap-1">
            {evidence.map((ev) => (
              <span key={ev} className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {ev}
              </span>
            ))}
          </div>
        </div>

        {/* Forensik Digital */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Key className="h-4 w-4 text-blue-600" />
            <span>Audit Jejak Digital</span>
          </h4>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Hash Verification</span>
              <p className="font-mono text-[11px] text-slate-800 dark:text-slate-200 truncate">
                {currentCase.digitalEvidenceHash || 'Belum diisi hash SHA-256'}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Chain of Custody</span>
              <p className="text-slate-700 dark:text-slate-300 text-[11px] line-clamp-2">
                {currentCase.chainOfCustodySummary || 'Belum ada ringkasan chain of custody'}
              </p>
            </div>
          </div>
        </div>

        {/* Celah Penyelidikan */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span>Celah Penyelidikan</span>
          </h4>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-4">
            {currentCase.investigationGaps || 'Tidak ada catatan celah penyelidikan tercatat.'}
          </p>
        </div>
      </div>

      {/* 10. PENGUJIAN UNSUR DELIK TABLE */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-amber-700 dark:text-amber-400" />
            <span>Pengujian Unsur Delik &amp; Bunyi Pasal Sangkaan</span>
          </h3>
          <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
            Bobot Pembuktian: 40%
          </span>
        </div>

        {(currentCase.articleElements || []).length === 0 ? (
          <p className="text-xs text-slate-400 italic">Belum ada unsur pasal ditambahkan.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 pr-4">Pasal</th>
                  <th className="py-2.5 px-4">Bunyi / Unsur Delik</th>
                  <th className="py-2.5 px-4">Fakta &amp; Bukti Pendukung</th>
                  <th className="py-2.5 pl-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {currentCase.articleElements.map((el) => (
                  <tr key={el.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 pr-4 font-bold text-slate-800 dark:text-slate-200 font-mono">
                      {el.articleCode}
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 max-w-xs">{el.elementText}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-xs">
                      {el.supportingFacts || '-'}
                    </td>
                    <td className="py-3 pl-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          el.isFulfilled
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {el.isFulfilled ? '✅ Terpenuhi' : '⚠️ Belum'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 11 & 12. AUDIT FORMIL + UJI ALIBI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Audit Praperadilan */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-rose-600" />
            <span>Audit Cacat Formil Praperadilan</span>
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
              <span className="text-slate-600 dark:text-slate-400">Penetapan Tersangka:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {currentCase.auditSuspectStatus === 'sah' ? '✅ Sah (Min 2 Bukti)' : '⚠️ Cacat Formil'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
              <span className="text-slate-600 dark:text-slate-400">Penggeledahan / Sita:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {currentCase.auditSearchSeizureStatus === 'sah' ? '✅ Sah Prosedur' : '⚠️ Cacat Formil'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
              <span className="text-slate-600 dark:text-slate-400">Penangkapan / Penahanan:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {currentCase.auditArrestDetentionStatus === 'sah' ? '✅ Sah Prosedur' : '⚠️ Cacat Formil'}
              </span>
            </div>
          </div>
        </div>

        {/* Uji Alibi Deviasi */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Compass className="h-4 w-4 text-purple-600" />
            <span>Uji Deviasi Alibi Tersangka</span>
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
              <span className="text-slate-600 dark:text-slate-400">Skor Deviasi Alibi:</span>
              <span className="font-mono font-bold text-purple-700 dark:text-purple-400">
                {scoreBreakdown.alibiScore} / 100
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              {scoreBreakdown.alibiInconsistent
                ? '⚡ Terdapat ketidakcocokan antara alibi tersangka dengan fakta CCTV & kronologi. (+5 Poin Penguatan Berkas)'
                : 'Alibi tersangka belum menunjukkan deviasi mencolok atau data belum lengkap.'}
            </p>
          </div>
        </div>
      </div>

      {/* 13. EVALUASI KEKUATAN PEMBUKTIAN (SCORING BAND) */}
      <div className={`rounded-3xl border p-6 sm:p-8 shadow-md ${zoneColorClass} space-y-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-baseline gap-4">
            <span className="font-serif text-5xl sm:text-6xl font-bold tracking-tight">
              {scoreBreakdown.totalScore}%
            </span>
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider opacity-80 block">
                Skor Kekuatan Berkas Perkara
              </span>
              <h3 className="text-xl font-bold font-serif">ZONA {scoreBreakdown.zoneLabel}</h3>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/60 dark:bg-black/40 px-4 py-1.5 text-xs font-semibold backdrop-blur border border-black/5">
            <TrendingUp className="h-4 w-4" />
            <span>Standar Pembuktian KUHAP</span>
          </span>
        </div>

        <p className="text-xs sm:text-sm leading-relaxed max-w-3xl">
          {scoreBreakdown.zoneDescription}
        </p>

        {/* Breakdown Progress Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
          <div>
            <div className="flex justify-between mb-1">
              <span>Pemenuhan Unsur Pasal (Bobot 40%)</span>
              <span className="font-mono font-bold">{scoreBreakdown.elementScorePct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-current transition-all duration-500"
                style={{ width: `${scoreBreakdown.elementScorePct}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Kelengkapan Alat Bukti Sah (Bobot 30%)</span>
              <span className="font-mono font-bold">{scoreBreakdown.evidenceScorePct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-current transition-all duration-500"
                style={{ width: `${scoreBreakdown.evidenceScorePct}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Keterangan Saksi &amp; Ahli (Bobot 15%)</span>
              <span className="font-mono font-bold">{scoreBreakdown.witnessScorePct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-current transition-all duration-500"
                style={{ width: `${scoreBreakdown.witnessScorePct}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Kelengkapan Kronologi Peristiwa (Bobot 15%)</span>
              <span className="font-mono font-bold">{scoreBreakdown.chronologyScorePct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-current transition-all duration-500"
                style={{ width: `${scoreBreakdown.chronologyScorePct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 14. RISALAH GELAR PERKARA & LEGAL OPINION FORMAL */}
      <RisalahGelarOpinion caseData={currentCase} scoreBreakdown={scoreBreakdown} />

      {/* FOOTER ACTIONS */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 print:hidden">
        <button
          type="button"
          onClick={() => setViewMode('wizard')}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>← Kembali Edit Form</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => saveCurrentCase(true)}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
          >
            <Save className="h-4 w-4" />
            <span>Simpan Perkara</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-700 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 transition"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak / Ekspor PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
