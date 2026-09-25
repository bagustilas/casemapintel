'use client';

import React from 'react';
import { useCase } from '@/context/CaseContext';
import { DamageItem, ModusIndicator } from '@/types/case';
import { AlertTriangle, Plus, Trash2, DollarSign, CheckSquare } from 'lucide-react';
import { formatRupiah } from '@/lib/scoring';

const ALL_MODUS_INDICATORS: ModusIndicator[] = [
  'Direncanakan / Terpremeditasi',
  'Penyalahgunaan Kepercayaan / Jabatan',
  'Menggunakan Sarana Elektronik / Siber',
  'Pemalsuan Dokumen / Identitas',
  'Pola Berulang / Pelaku Residivis',
  'Menggunakan Kekerasan / Ancaman Fisik',
  'Terorganisir / Sindikat Terstruktur',
  'Lintas Wilayah Hukum / Antar-Kota',
  'Kerugian Skala Luas / Korban Massal',
];

export function Tab3ModusKerugian() {
  const { currentCase, updateField } = useCase();

  const modusIndicators = currentCase.modusIndicators || [];
  const damages = currentCase.damages || [];

  const toggleModus = (ind: ModusIndicator) => {
    if (modusIndicators.includes(ind)) {
      updateField(
        'modusIndicators',
        modusIndicators.filter((m) => m !== ind)
      );
    } else {
      updateField('modusIndicators', [...modusIndicators, ind]);
    }
  };

  const addDamage = () => {
    const newD: DamageItem = {
      id: 'd_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 5),
      type: 'Materiil',
      nominal: 0,
      description: '',
    };
    updateField('damages', [...damages, newD]);
  };

  const updateDamage = (id: string, partial: Partial<DamageItem>) => {
    const updated = damages.map((d) => (d.id === id ? { ...d, ...partial } : d));
    updateField('damages', updated);
  };

  const removeDamage = (id: string) => {
    updateField(
      'damages',
      damages.filter((d) => d.id !== id)
    );
  };

  const totalMateriil = damages
    .filter((d) => d.type === 'Materiil')
    .reduce((sum, d) => sum + (Number(d.nominal) || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
          <AlertTriangle className="h-4 w-4" />
          <span>Tab 03 · Modus Operandi &amp; Kerugian</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
          Indikator Modus &amp; Rincian Kerugian
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Pilih karakteristik perbuatan pidana dan susun kalkulasi kerugian korban untuk pertimbangan tuntutan pidana &amp; restitusi.
        </p>
      </div>

      {/* 1. Indikator Modus */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm">
          <CheckSquare className="h-4 w-4 text-amber-700 dark:text-amber-400" />
          <span>Indikator Modus Operandi Kejahatan</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {ALL_MODUS_INDICATORS.map((indicator) => {
            const isChecked = modusIndicators.includes(indicator);
            return (
              <label
                key={indicator}
                className={`flex items-start gap-2.5 rounded-xl border p-3 cursor-pointer text-xs font-medium transition ${
                  isChecked
                    ? 'border-amber-600 bg-amber-50/80 text-amber-950 dark:border-amber-500 dark:bg-amber-950/40 dark:text-amber-200'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100/80 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleModus(indicator)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-700 focus:ring-amber-500"
                />
                <span>{indicator}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Rincian Kerugian */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 dark:border-slate-800 gap-2">
          <div>
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              <span>Rincian Kerugian Korban / Perusahaan</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Total Kerugian Materiil: <strong className="text-emerald-700 dark:text-emerald-400 font-mono text-sm">{formatRupiah(totalMateriil)}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={addDamage}
            className="inline-flex items-center gap-1 self-start sm:self-auto rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Item Kerugian</span>
          </button>
        </div>

        {damages.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 italic">
            Belum ada rincian kerugian ditambahkan.
          </p>
        ) : (
          <div className="space-y-3">
            {damages.map((d, idx) => (
              <div
                key={d.id}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40 relative space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                    Item Kerugian #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeDamage(d.id)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Kategori Kerugian
                    </label>
                    <select
                      value={d.type}
                      onChange={(e) => updateDamage(d.id, { type: e.target.value as any })}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="Materiil">Materiil (Finansial / Uang / Aset)</option>
                      <option value="Imateriil">Imateriil (Reputasi / Kepercayaan)</option>
                      <option value="Fisik">Fisik (Luka / Kerusakan Fasilitas)</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Nominal Kerugian (Rp) — Kosongkan jika Imateriil
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={d.nominal || ''}
                      onChange={(e) => updateDamage(d.id, { nominal: Number(e.target.value) || 0 })}
                      placeholder="mis. 150000000"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-bold text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Uraian / Penjelasan Kerugian
                  </label>
                  <input
                    type="text"
                    value={d.description}
                    onChange={(e) => updateDamage(d.id, { description: e.target.value })}
                    placeholder="mis. Selisih kas fisik penjualan tunai yang tidak disetor ke rekening kas perusahaan"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
