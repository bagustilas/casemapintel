'use client';

import React from 'react';
import { useCase } from '@/context/CaseContext';
import {
  FileText,
  Users,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Search,
  UserCheck,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';

const STEPS = [
  { id: 0, title: 'Data Dasar', icon: FileText, desc: 'Identitas, yurisdiksi, pasal' },
  { id: 1, title: 'Para Pihak', icon: Users, desc: 'Tersangka, korban, saksi' },
  { id: 2, title: 'Modus & Kerugian', icon: AlertTriangle, desc: 'Indikator & nominal kerugian' },
  { id: 3, title: 'Kronologi', icon: Clock, desc: 'Garis waktu peristiwa' },
  { id: 4, title: 'Bukti & Pasal', icon: ShieldCheck, desc: 'Alat bukti & unsur pasal' },
  { id: 5, title: 'Investigasi', icon: Search, desc: 'Daluwarsa, alibi, praperadilan' },
  { id: 6, title: 'Peserta Gelar', icon: UserCheck, desc: 'Daftar peserta & pendapat' },
  { id: 7, title: 'Versi Keterangan', icon: MessageSquare, desc: 'Deteksi kontradiksi saksi' },
];

export function Sidebar() {
  const { currentStep, goToStep, currentCase } = useCase();

  // Helper to check if step has any content
  const isStepDone = (stepIdx: number): boolean => {
    switch (stepIdx) {
      case 0:
        return Boolean(currentCase.title && currentCase.crimeCategory);
      case 1:
        return (currentCase.parties || []).length > 0;
      case 2:
        return (currentCase.modusIndicators || []).length > 0 || (currentCase.damages || []).length > 0;
      case 3:
        return (currentCase.chronology || []).length > 0;
      case 4:
        return (currentCase.availableEvidence || []).length > 0 || (currentCase.articleElements || []).length > 0;
      case 5:
        return Boolean(currentCase.statuteDate || currentCase.alibiClaimLocation || currentCase.investigationGaps);
      case 6:
        return (currentCase.participants || []).length > 0;
      case 7:
        return Boolean(currentCase.suspectVersion || currentCase.victimVersion || currentCase.witnessVersion);
      default:
        return false;
    }
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/50 p-3 lg:p-4 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mb-2 hidden lg:block px-3 py-1">
        <span className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase font-mono">
          Alur Input Berkas (8 Tab)
        </span>
      </div>

      <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const active = currentStep === step.id;
          const done = isStepDone(step.id);

          return (
            <button
              key={step.id}
              onClick={() => goToStep(step.id)}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-xs font-medium transition whitespace-nowrap lg:whitespace-normal flex-shrink-0 ${
                active
                  ? 'bg-amber-700 text-white shadow-sm dark:bg-amber-600'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
              }`}
            >
              <div
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${
                  active
                    ? 'bg-white/20 text-white'
                    : done
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {done && !active ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Icon className="h-3.5 w-3.5" />
                )}
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`font-mono text-[10px] ${active ? 'text-amber-200' : 'text-slate-400'}`}>
                    0{step.id + 1}
                  </span>
                  <span className="font-semibold">{step.title}</span>
                </div>
                <span
                  className={`hidden lg:block text-[10.5px] truncate ${
                    active ? 'text-amber-100/80' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {step.desc}
                </span>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
