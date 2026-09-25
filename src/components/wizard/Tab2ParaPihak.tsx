'use client';

import React from 'react';
import { useCase } from '@/context/CaseContext';
import { Party, PartyRole } from '@/types/case';
import { Users, Plus, Trash2, UserCheck, ShieldAlert, Star } from 'lucide-react';

export function Tab2ParaPihak() {
  const { currentCase, updateField } = useCase();

  const parties = currentCase.parties || [];

  const addParty = (role: PartyRole) => {
    const newP: Party = {
      id: 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 5),
      name: '',
      role,
      notes: '',
      contact: '',
      isPrimary: role === 'Tersangka' && parties.filter((p) => p.role === 'Tersangka').length === 0,
    };
    updateField('parties', [...parties, newP]);
  };

  const updateParty = (id: string, partial: Partial<Party>) => {
    const updated = parties.map((p) => (p.id === id ? { ...p, ...partial } : p));
    updateField('parties', updated);
  };

  const removeParty = (id: string) => {
    updateField(
      'parties',
      parties.filter((p) => p.id !== id)
    );
  };

  const setPrimarySuspect = (id: string) => {
    const updated = parties.map((p) => ({
      ...p,
      isPrimary: p.id === id,
    }));
    updateField('parties', updated);
  };

  const suspects = parties.filter((p) => p.role === 'Tersangka');
  const victims = parties.filter((p) => p.role === 'Korban / Pelapor');
  const witnesses = parties.filter((p) => p.role === 'Saksi Fakta' || p.role === 'Saksi Ahli');

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
          <Users className="h-4 w-4" />
          <span>Tab 02 · Subjek Hukum &amp; Saksi</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
          Para Pihak &amp; Tersangka
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Daftarkan subjek hukum yang terlibat: tersangka/pelaku tindak pidana, korban/pelapor, dan saksi fakta maupun ahli.
        </p>
      </div>

      {/* 1. SEKSI TERSANGKA */}
      <div className="rounded-2xl border border-rose-200 bg-white p-5 sm:p-6 shadow-sm dark:border-rose-950 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between border-b border-rose-100 pb-3 dark:border-rose-950">
          <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 font-bold text-sm">
            <ShieldAlert className="h-4 w-4" />
            <span>Tersangka / Terduga Pelaku ({suspects.length})</span>
          </div>
          <button
            type="button"
            onClick={() => addParty('Tersangka')}
            className="inline-flex items-center gap-1 rounded-xl bg-rose-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-800 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Tersangka</span>
          </button>
        </div>

        {suspects.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 italic">
            Belum ada data tersangka. Tambahkan minimal 1 tersangka untuk membentuk Matriks Pertanggungjawaban Pidana.
          </p>
        ) : (
          <div className="space-y-3">
            {suspects.map((p, idx) => (
              <div
                key={p.id}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40 relative space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                      Tersangka #{idx + 1}
                    </span>
                    {p.isPrimary && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        <Star className="h-3 w-3 fill-current" />
                        Target Utama
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {!p.isPrimary && (
                      <button
                        type="button"
                        onClick={() => setPrimarySuspect(p.id)}
                        className="text-[11px] font-medium text-amber-700 hover:underline mr-2"
                      >
                        Set Target Utama
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeParty(p.id)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Nama Lengkap Tersangka
                    </label>
                    <input
                      type="text"
                      value={p.name}
                      onChange={(e) => updateParty(p.id, { name: e.target.value })}
                      placeholder="mis. Budi Santoso, S.E."
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm focus:border-rose-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Kontak / NIK / Identitas
                    </label>
                    <input
                      type="text"
                      value={p.contact || ''}
                      onChange={(e) => updateParty(p.id, { contact: e.target.value })}
                      placeholder="mis. 0812-xxxx-xxxx / 5371xxxx..."
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-rose-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Posisi / Hubungan / Peran dalam Perkara
                  </label>
                  <input
                    type="text"
                    value={p.notes}
                    onChange={(e) => updateParty(p.id, { notes: e.target.value })}
                    placeholder="mis. Mantan Bendahara & Kepala Kasir, pemegang kunci brankas"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-rose-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. SEKSI KORBAN / PELAPOR */}
      <div className="rounded-2xl border border-amber-200 bg-white p-5 sm:p-6 shadow-sm dark:border-amber-950 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between border-b border-amber-100 pb-3 dark:border-amber-950">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-400 font-bold text-sm">
            <UserCheck className="h-4 w-4" />
            <span>Korban / Pelapor ({victims.length})</span>
          </div>
          <button
            type="button"
            onClick={() => addParty('Korban / Pelapor')}
            className="inline-flex items-center gap-1 rounded-xl bg-amber-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-800 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Korban/Pelapor</span>
          </button>
        </div>

        {victims.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 italic">
            Belum ada data korban/pelapor.
          </p>
        ) : (
          <div className="space-y-3">
            {victims.map((p, idx) => (
              <div
                key={p.id}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40 relative space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    Korban / Pelapor #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeParty(p.id)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Nama Korban / Nama Perusahaan
                    </label>
                    <input
                      type="text"
                      value={p.name}
                      onChange={(e) => updateParty(p.id, { name: e.target.value })}
                      placeholder="mis. CV Mitra Jaya (Direktur: Dedi Hartono)"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Kontak / Kuasa Hukum
                    </label>
                    <input
                      type="text"
                      value={p.contact || ''}
                      onChange={(e) => updateParty(p.id, { contact: e.target.value })}
                      placeholder="mis. 0813-xxxx-xxxx"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Keterangan Kedudukan Hukum
                  </label>
                  <input
                    type="text"
                    value={p.notes}
                    onChange={(e) => updateParty(p.id, { notes: e.target.value })}
                    placeholder="mis. Korban materiil penggelapan dana kas operasional toko"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. SEKSI SAKSI & AHLI */}
      <div className="rounded-2xl border border-emerald-200 bg-white p-5 sm:p-6 shadow-sm dark:border-emerald-950 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-100 pb-3 dark:border-emerald-950">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-sm">
            <Users className="h-4 w-4" />
            <span>Saksi Fakta &amp; Saksi Ahli ({witnesses.length})</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => addParty('Saksi Fakta')}
              className="inline-flex items-center gap-1 rounded-xl bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Saksi Fakta</span>
            </button>
            <button
              type="button"
              onClick={() => addParty('Saksi Ahli')}
              className="inline-flex items-center gap-1 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Saksi Ahli</span>
            </button>
          </div>
        </div>

        {witnesses.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 italic">
            Belum ada data saksi/ahli. Tambahkan saksi untuk memperkuat bobot pembuktian berkas.
          </p>
        ) : (
          <div className="space-y-3">
            {witnesses.map((p, idx) => (
              <div
                key={p.id}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40 relative space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {p.role} #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeParty(p.id)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Nama Saksi / Ahli
                    </label>
                    <input
                      type="text"
                      value={p.name}
                      onChange={(e) => updateParty(p.id, { name: e.target.value })}
                      placeholder="mis. Siti Rahayu / Dr. Hendra Wijaya"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm focus:border-emerald-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Kontak / Afiliasi Lembaga
                    </label>
                    <input
                      type="text"
                      value={p.contact || ''}
                      onChange={(e) => updateParty(p.id, { contact: e.target.value })}
                      placeholder="mis. 0821-xxxx-xxxx / Universitas Nusa Cendana"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-emerald-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Keterangan Pokok / Hubungan Fakta
                  </label>
                  <input
                    type="text"
                    value={p.notes}
                    onChange={(e) => updateParty(p.id, { notes: e.target.value })}
                    placeholder="mis. Saksi yang melihat tersangka keluar kantor membawa ransel besar malam kejadian"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-emerald-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
