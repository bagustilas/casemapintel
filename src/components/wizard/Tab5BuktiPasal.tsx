'use client';

import React from 'react';
import { useCase } from '@/context/CaseContext';
import { ArticleElement, EvidenceType } from '@/types/case';
import { ShieldCheck, Plus, Trash2, Key, CheckCircle2, ShieldAlert } from 'lucide-react';

const ALL_EVIDENCE_TYPES: EvidenceType[] = [
  'Keterangan saksi',
  'Keterangan ahli',
  'Surat',
  'Petunjuk',
  'Keterangan terdakwa',
  'Bukti elektronik',
];

export function Tab5BuktiPasal() {
  const { currentCase, updateField } = useCase();

  const availableEvidence = currentCase.availableEvidence || [];
  const articleElements = currentCase.articleElements || [];

  const toggleEvidence = (ev: EvidenceType) => {
    if (availableEvidence.includes(ev)) {
      updateField(
        'availableEvidence',
        availableEvidence.filter((e) => e !== ev)
      );
    } else {
      updateField('availableEvidence', [...availableEvidence, ev]);
    }
  };

  const addElement = () => {
    const newEl: ArticleElement = {
      id: 'el_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 5),
      articleCode: currentCase.mainArticle || 'Pasal Sangkaan',
      elementText: '',
      isFulfilled: true,
      supportingFacts: '',
    };
    updateField('articleElements', [...articleElements, newEl]);
  };

  const updateElement = (id: string, partial: Partial<ArticleElement>) => {
    const updated = articleElements.map((el) => (el.id === id ? { ...el, ...partial } : el));
    updateField('articleElements', updated);
  };

  const removeElement = (id: string) => {
    updateField(
      'articleElements',
      articleElements.filter((el) => el.id !== id)
    );
  };

  const isMin2Fulfilled = availableEvidence.length >= 2;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
          <ShieldCheck className="h-4 w-4" />
          <span>Tab 05 · Alat Bukti &amp; Unsur Delik</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
          Alat Bukti Sah &amp; Pengujian Unsur Pasal
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Uji pemenuhan syarat minimal 2 alat bukti sah (Putusan MK No. 21/PUU-XII/2014 &amp; Pasal 235 KUHAP Baru) serta bedah unsur delik pasal sangkaan.
        </p>
      </div>

      {/* 1. Checklist Alat Bukti Sah */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 dark:border-slate-800 gap-2">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
            <ShieldCheck className="h-4 w-4 text-amber-700 dark:text-amber-400" />
            <span>Alat Bukti Sah yang Tersedia (Pasal 235 KUHAP Baru / 184 KUHAP Lama)</span>
          </div>

          <span
            className={`inline-flex items-center gap-1 self-start sm:self-auto rounded-full px-2.5 py-0.5 text-xs font-bold ${
              isMin2Fulfilled
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}
          >
            {isMin2Fulfilled ? (
              <>
                <CheckCircle2 className="h-3 w-3" />
                <span>Terpenuhi ({availableEvidence.length} Jenis)</span>
              </>
            ) : (
              <>
                <ShieldAlert className="h-3 w-3" />
                <span>Belum Cukup ({availableEvidence.length}/2 Jenis)</span>
              </>
            )}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ALL_EVIDENCE_TYPES.map((ev) => {
            const isChecked = availableEvidence.includes(ev);
            return (
              <label
                key={ev}
                className={`flex items-center gap-2.5 rounded-xl border p-3 cursor-pointer text-xs font-semibold transition ${
                  isChecked
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleEvidence(ev)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
                />
                <span>{ev}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Bukti Elektronik & Chain of Custody */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm">
          <Key className="h-4 w-4 text-blue-600" />
          <span>Audit Jejak Digital &amp; Chain of Custody (Bukti Elektronik)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
              Hash Bukti Elektronik (SHA-256 / MD5)
            </label>
            <input
              type="text"
              value={currentCase.digitalEvidenceHash || ''}
              onChange={(e) => updateField('digitalEvidenceHash', e.target.value)}
              placeholder="mis. e3b0c44298fc1c149afbf4c8996fb92427ae41e4..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
              Ringkasan Riwayat Perolehan (Chain of Custody)
            </label>
            <input
              type="text"
              value={currentCase.chainOfCustodySummary || ''}
              onChange={(e) => updateField('chainOfCustodySummary', e.target.value)}
              placeholder="mis. Disita pada 20 Mei 2026 oleh Tim Forensik, segel anti-statis disaksikan 2 saksi"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* 3. Pengujian Unsur Pasal */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
              <ShieldCheck className="h-4 w-4 text-amber-700" />
              <span>Bedah Unsur Delik &amp; Pembuktian ({articleElements.length})</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelengkapan unsur pasal memiliki bobot pembuktian 40% pada skor kekuatan berkas.
            </p>
          </div>

          <button
            type="button"
            onClick={addElement}
            className="inline-flex items-center gap-1 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Tambah Unsur</span>
          </button>
        </div>

        {articleElements.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 italic">
            Belum ada unsur pasal ditambahkan. Tambahkan uraian unsur delik untuk mengukur kelengkapan berkas.
          </p>
        ) : (
          <div className="space-y-3">
            {articleElements.map((el, idx) => (
              <div
                key={el.id}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40 relative space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                    Unsur Delik #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeElement(el.id)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Pasal Rujukan
                    </label>
                    <input
                      type="text"
                      value={el.articleCode}
                      onChange={(e) => updateElement(el.id, { articleCode: e.target.value })}
                      placeholder="mis. Pasal 486 KUHP"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Bunyi / Deskripsi Unsur
                    </label>
                    <input
                      type="text"
                      value={el.elementText}
                      onChange={(e) => updateElement(el.id, { elementText: e.target.value })}
                      placeholder="mis. Dengan sengaja dan melawan hukum memiliki barang milik orang lain"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Fakta &amp; Alat Bukti Pendukung yang Memenuhi Unsur
                  </label>
                  <input
                    type="text"
                    value={el.supportingFacts}
                    onChange={(e) => updateElement(el.id, { supportingFacts: e.target.value })}
                    placeholder="mis. Tersangka mengambil uang fisik kasir tanpa izin dibuktikan rekaman CCTV & pengakuan saksi satpam"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={el.isFulfilled}
                    onChange={(e) => updateElement(el.id, { isFulfilled: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Unsur ini telah terpenuhi secara sah dan meyakinkan oleh fakta &amp; bukti
                  </span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
