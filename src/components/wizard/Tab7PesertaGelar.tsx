'use client';

import React from 'react';
import { useCase } from '@/context/CaseContext';
import { MeetingParticipant } from '@/types/case';
import { UserCheck, Plus, Trash2, Calendar, MapPin, CheckCircle } from 'lucide-react';

export function Tab7PesertaGelar() {
  const { currentCase, updateField } = useCase();

  const participants = currentCase.participants || [];

  const addParticipant = () => {
    const newPt: MeetingParticipant = {
      id: 'pt_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 5),
      name: '',
      position: '',
      institution: '',
      opinion: '',
    };
    updateField('participants', [...participants, newPt]);
  };

  const updateParticipant = (id: string, partial: Partial<MeetingParticipant>) => {
    const updated = participants.map((pt) => (pt.id === id ? { ...pt, ...partial } : pt));
    updateField('participants', updated);
  };

  const removeParticipant = (id: string) => {
    updateField(
      'participants',
      participants.filter((pt) => pt.id !== id)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
          <UserCheck className="h-4 w-4" />
          <span>Tab 07 · Risalah &amp; Peserta Gelar</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
          Peserta Gelar Perkara &amp; Catatan Pendapat Hukum
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Dokumentasikan pimpinan sidang gelar perkara, penyidik, penasihat hukum, pengawas internal (Propam/Wasidik), dan notulensi kesimpulan gelar.
        </p>
      </div>

      {/* Metadata Gelar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm">
          <Calendar className="h-4 w-4 text-amber-700 dark:text-amber-400" />
          <span>Pelaksanaan Sidang Gelar Perkara</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
              Tanggal Pelaksanaan Gelar
            </label>
            <input
              type="date"
              value={currentCase.meetingDate || ''}
              onChange={(e) => updateField('meetingDate', e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>Tempat / Ruang Sidang Gelar</span>
            </label>
            <input
              type="text"
              value={currentCase.meetingPlace || ''}
              onChange={(e) => updateField('meetingPlace', e.target.value)}
              placeholder="mis. Ruang Rapat Gelar Perkara Satreskrim Polres Kupang Kota"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
            Kesimpulan &amp; Rekomendasi Akhir Gelar Perkara
          </label>
          <textarea
            rows={3}
            value={currentCase.meetingConclusion || ''}
            onChange={(e) => updateField('meetingConclusion', e.target.value)}
            placeholder="mis. Gelar perkara secara bulat menyimpulkan alat bukti telah cukup dan merekomendasikan pelimpahan Berkas Perkara Tahap I ke Kejaksaan Negeri..."
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white resize-y"
          />
        </div>
      </div>

      {/* Dynamic Participant List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
            <UserCheck className="h-4 w-4 text-emerald-600" />
            <span>Daftar Peserta Sidang Gelar ({participants.length})</span>
          </div>

          <button
            type="button"
            onClick={addParticipant}
            className="inline-flex items-center gap-1 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Tambah Peserta</span>
          </button>
        </div>

        {participants.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 italic">
            Belum ada peserta gelar perkara ditambahkan.
          </p>
        ) : (
          <div className="space-y-3">
            {participants.map((pt, idx) => (
              <div
                key={pt.id}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40 relative space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                    Peserta #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeParticipant(pt.id)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Nama Lengkap &amp; Gelar
                    </label>
                    <input
                      type="text"
                      value={pt.name}
                      onChange={(e) => updateParticipant(pt.id, { name: e.target.value })}
                      placeholder="mis. AKP Ridwan Hakim, S.H., M.H."
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Jabatan dalam Sidang
                    </label>
                    <input
                      type="text"
                      value={pt.position}
                      onChange={(e) => updateParticipant(pt.id, { position: e.target.value })}
                      placeholder="mis. Pimpinan Gelar / Kasat Reskrim"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Instansi / Kesatuan
                    </label>
                    <input
                      type="text"
                      value={pt.institution}
                      onChange={(e) => updateParticipant(pt.id, { institution: e.target.value })}
                      placeholder="mis. Satreskrim Polres Kupang Kota"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Catatan Pendapat Hukum (Legal Opinion) Peserta
                  </label>
                  <textarea
                    rows={2}
                    value={pt.opinion}
                    onChange={(e) => updateParticipant(pt.id, { opinion: e.target.value })}
                    placeholder="mis. Unsur pasal 486 KUHP telah didukung 3 alat bukti sah. Berkas layak dilanjutkan ke JPU..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white resize-y"
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
