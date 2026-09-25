'use client';

import React from 'react';
import { useCase } from '@/context/CaseContext';
import { CrimeCategory, InvestigationStage, LegalRegime } from '@/types/case';
import { FileText, MapPin, Scale, HelpCircle } from 'lucide-react';

const CRIME_CATEGORIES: CrimeCategory[] = [
  'Pencurian',
  'Penipuan',
  'Penggelapan',
  'Penganiayaan',
  'Pembunuhan',
  'Pemerkosaan',
  'Korupsi',
  'Pencucian Uang (TPPU)',
  'Narkotika',
  'Kejahatan Siber',
  'Pemalsuan Dokumen',
  'Pemerasan & Pengancaman',
  'Pengrusakan Barang',
  'Kekerasan Dalam Rumah Tangga (KDRT)',
  'Tindak Pidana Lingkungan',
  'Tindak Pidana Khusus Lainnya',
  'Lainnya',
];

const INVESTIGATION_STAGES: InvestigationStage[] = [
  'Pra-Laporan / Konsultasi',
  'Penyelidikan',
  'Penyidikan',
  'Pra-Penuntutan (Tahap I)',
  'Penuntutan (Tahap II)',
  'Persidangan',
  'Praperadilan',
];

export function Tab1DataDasar() {
  const { currentCase, updateField } = useCase();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
          <FileText className="h-4 w-4" />
          <span>Tab 01 · Identitas &amp; Yurisdiksi</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
          Data Dasar Perkara Pidana
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Tentukan identitas perkara, rezim hukum yang berlaku (asas <em>lex mitior</em>), dan wilayah hukum pelaporan.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Nama / Judul Perkara <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={currentCase.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="mis. Dugaan Tindak Pidana Penggelapan Dana Kas Operasional CV Mitra Jaya"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* LP & Legal Regime */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Nomor Laporan Polisi (LP) / Pengaduan
            </label>
            <input
              type="text"
              value={currentCase.lpNumber}
              onChange={(e) => updateField('lpNumber', e.target.value)}
              placeholder="mis. LP/B/0142/VI/2026/SPKT/POLDA NTT"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-mono font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <span>Rezim Hukum Materiil</span>
              <span title="Berdasarkan tanggal tempus delicti & asas lex mitior (Pasal 3 UU No. 1/2023)">
                <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
              </span>
            </label>
            <select
              value={currentCase.legalRegime}
              onChange={(e) => updateField('legalRegime', e.target.value as LegalRegime)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="KUHP_2023">KUHP Nasional Baru (UU No. 1 Tahun 2023)</option>
              <option value="KUHP_OLD">KUHP Lama (WvS / UU No. 1 Tahun 1946)</option>
            </select>
          </div>
        </div>

        {/* Crime Category & Investigation Stage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Klasifikasi Tindak Pidana <span className="text-rose-500">*</span>
            </label>
            <select
              value={currentCase.crimeCategory}
              onChange={(e) => updateField('crimeCategory', e.target.value as CrimeCategory)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {CRIME_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Tahapan Penanganan Berkas <span className="text-rose-500">*</span>
            </label>
            <select
              value={currentCase.investigationStage}
              onChange={(e) => updateField('investigationStage', e.target.value as InvestigationStage)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {INVESTIGATION_STAGES.map((stg) => (
                <option key={stg} value={stg}>
                  {stg}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Incident Dates (Tempus Delicti) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Tanggal Kejadian / Awal (Tempus Delicti)
            </label>
            <input
              type="date"
              value={currentCase.incidentDateStart}
              onChange={(e) => updateField('incidentDateStart', e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Tanggal Kejadian Akhir (Jika Rentang Waktu)
            </label>
            <input
              type="date"
              value={currentCase.incidentDateEnd}
              onChange={(e) => updateField('incidentDateEnd', e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Main Article */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Pasal Utama yang Disangkakan / Didakwakan
          </label>
          <input
            type="text"
            value={currentCase.mainArticle}
            onChange={(e) => updateField('mainArticle', e.target.value)}
            placeholder="mis. Pasal 486 jo. Pasal 488 KUHP (Penggelapan dalam Jabatan)"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Location & Jurisdiction (Locus Delicti) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>Lokasi Tempat Kejadian (Kecamatan / Kab-Kota)</span>
            </label>
            <input
              type="text"
              value={currentCase.locationDistrict}
              onChange={(e) => updateField('locationDistrict', e.target.value)}
              placeholder="mis. Kecamatan Oebobo, Kota Kupang"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Scale className="h-3.5 w-3.5 text-slate-400" />
              <span>Wilayah Hukum Administratif / Polda / Polres</span>
            </label>
            <input
              type="text"
              value={currentCase.locationPolda}
              onChange={(e) => updateField('locationPolda', e.target.value)}
              placeholder="mis. Polda Nusa Tenggara Timur / Polres Kupang Kota"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Summary */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Ringkasan Singkat Duduk Perkara (Posita Fakta)
          </label>
          <textarea
            rows={4}
            value={currentCase.briefSummary}
            onChange={(e) => updateField('briefSummary', e.target.value)}
            placeholder="Jelaskan secara ringkas latar belakang peristiwa, hubungan hukum antar pihak, dan dugaan perbuatan pidana yang terjadi..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white resize-y"
          />
        </div>
      </div>
    </div>
  );
}
