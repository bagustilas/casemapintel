'use client';

import React from 'react';
import { useCase } from '@/context/CaseContext';
import { ChronologyEvent } from '@/types/case';
import { Clock, Plus, Trash2, MapPin, Sparkles } from 'lucide-react';

export function Tab4Kronologi() {
  const { currentCase, updateField } = useCase();

  const chronology = currentCase.chronology || [];
  const parties = currentCase.parties || [];

  const addEvent = () => {
    const newEv: ChronologyEvent = {
      id: 'c_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 5),
      datetime: '',
      location: '',
      narrative: '',
      linkedPartyIds: [],
      linkedEvidenceTypes: [],
    };
    updateField('chronology', [...chronology, newEv]);
  };

  const updateEvent = (id: string, partial: Partial<ChronologyEvent>) => {
    const updated = chronology.map((e) => (e.id === id ? { ...e, ...partial } : e));
    updateField('chronology', updated);
  };

  const removeEvent = (id: string) => {
    updateField(
      'chronology',
      chronology.filter((e) => e.id !== id)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
          <Clock className="h-4 w-4" />
          <span>Tab 04 · Rekonstruksi Garis Waktu</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
          Kronologi &amp; Rangkaian Peristiwa
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Susun urutan kejadian secara faktual. Data ini menjadi tulang punggung visualisasi <strong>Papan Intelijen (Graph Relasi)</strong>, deteksi kontradiksi, dan pembuktian alibi.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
            <Clock className="h-4 w-4 text-amber-700 dark:text-amber-400" />
            <span>Peristiwa Kronologis ({chronology.length})</span>
          </div>

          <button
            type="button"
            onClick={addEvent}
            className="inline-flex items-center gap-1 rounded-xl bg-amber-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Tambah Peristiwa</span>
          </button>
        </div>

        {chronology.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 italic">
            Belum ada rangkaian peristiwa ditambahkan. Tambahkan minimal 2–3 peristiwa penting untuk menghasilkan alur graph Papan Intelijen.
          </p>
        ) : (
          <div className="space-y-4">
            {chronology.map((ev, idx) => (
              <div
                key={ev.id}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40 relative space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-mono">
                    Peristiwa #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeEvent(ev.id)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Waktu &amp; Tanggal Kejadian
                    </label>
                    <input
                      type="datetime-local"
                      value={ev.datetime}
                      onChange={(e) => updateEvent(ev.id, { datetime: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Lokasi Spesifik Kejadian
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={ev.location}
                        onChange={(e) => updateEvent(ev.id, { location: e.target.value })}
                        placeholder="mis. Ruang Kasir CV Mitra Jaya / Halaman Parkir"
                        className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-8 pr-3 text-xs font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Narasi Peristiwa (Sebutkan nama pihak &amp; kata kunci bukti)
                  </label>
                  <textarea
                    rows={2}
                    value={ev.narrative}
                    onChange={(e) => updateEvent(ev.id, { narrative: e.target.value })}
                    placeholder="mis. Tersangka Budi Santoso masuk ke ruang kasir di luar jam kerja terekam CCTV, membawa tas ransel besar disaksikan saksi satpam Agus..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white resize-y"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    <span>Tip: Sistem secara otomatis menghubungkan nama pihak dan barang bukti yang Anda sebutkan ke dalam Papan Intelijen.</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
