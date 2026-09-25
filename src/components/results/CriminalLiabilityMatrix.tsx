'use client';

import React from 'react';
import { CaseData } from '@/types/case';
import { ShieldAlert, Scale, CheckCircle2, User, FileText } from 'lucide-react';

interface CriminalLiabilityMatrixProps {
  caseData: CaseData;
  score: number;
}

export function CriminalLiabilityMatrix({ caseData, score }: CriminalLiabilityMatrixProps) {
  const suspects = (caseData.parties || []).filter((p) => p.role === 'Tersangka');
  const evidence = caseData.availableEvidence || [];

  if (suspects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500 dark:border-slate-800">
        Tambahkan data tersangka pada Tab 2 untuk merender Matriks Pertanggungjawaban Pidana.
      </div>
    );
  }

  const avatarColors = [
    'bg-rose-700 text-white',
    'bg-amber-700 text-white',
    'bg-emerald-700 text-white',
    'bg-blue-700 text-white',
    'bg-purple-700 text-white',
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {suspects.map((suspect, idx) => {
        const initials = suspect.name
          .split(/\s+/)
          .map((w) => w[0])
          .slice(0, 2)
          .join('')
          .toUpperCase() || 'TS';

        return (
          <div
            key={suspect.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Suspect Head */}
            <div className="p-5 text-center border-b border-slate-100 dark:border-slate-800 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/40 dark:to-slate-900">
              <div
                className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl font-serif text-lg font-bold shadow-sm ${
                  avatarColors[idx % avatarColors.length]
                }`}
              >
                {initials}
              </div>

              <div className="inline-block rounded-full bg-rose-100 px-3 py-0.5 text-[10px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300 uppercase tracking-wider mb-2">
                {suspect.isPrimary ? 'Target Utama / Tersangka Primer' : 'Tersangka / Pelaku'}
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                {suspect.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{suspect.notes || 'Tersangka'}</p>
            </div>

            {/* Suspect Body Details */}
            <div className="p-5 space-y-3.5 flex-1 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Pasal yang Disangkakan
                </span>
                <span className="inline-block rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200/50 dark:border-rose-900/50">
                  {caseData.mainArticle || 'Pasal belum ditentukan'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Alat Bukti Kunci yang Menjerat
                </span>
                <ul className="space-y-1 pl-1">
                  {evidence.length > 0 ? (
                    evidence.map((ev) => (
                      <li key={ev} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{ev}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-400 italic">Belum ada alat bukti terdata</li>
                  )}
                </ul>
              </div>

              {suspect.contact && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Kontak / Identitas
                  </span>
                  <span className="font-mono text-slate-600 dark:text-slate-300">{suspect.contact}</span>
                </div>
              )}
            </div>

            {/* Bottom Status */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-2.5 text-[11px] font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300">
              <span className="uppercase text-[10px] tracking-wider text-slate-500">Status Pembuktian</span>
              <span className="text-amber-700 dark:text-amber-400 font-mono">Skor {score}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
