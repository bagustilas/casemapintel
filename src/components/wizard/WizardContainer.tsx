'use client';

import React from 'react';
import { useCase } from '@/context/CaseContext';
import { Sidebar } from '../layout/Sidebar';
import { Tab1DataDasar } from './Tab1DataDasar';
import { Tab2ParaPihak } from './Tab2ParaPihak';
import { Tab3ModusKerugian } from './Tab3ModusKerugian';
import { Tab4Kronologi } from './Tab4Kronologi';
import { Tab5BuktiPasal } from './Tab5BuktiPasal';
import { Tab6Investigasi } from './Tab6Investigasi';
import { Tab7PesertaGelar } from './Tab7PesertaGelar';
import { Tab8VersiKeterangan } from './Tab8VersiKeterangan';
import { ChevronLeft, ChevronRight, Play, Save, CheckCircle2 } from 'lucide-react';

export function WizardContainer() {
  const { currentStep, nextStep, prevStep, saveCurrentCase, isSaving, setViewMode } = useCase();

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-3.5rem)] bg-slate-100/60 dark:bg-slate-950">
      {/* 8-Step Navigation Sidebar */}
      <Sidebar />

      {/* Main Form Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full flex flex-col justify-between">
        <div className="pb-8">
          {currentStep === 0 && <Tab1DataDasar />}
          {currentStep === 1 && <Tab2ParaPihak />}
          {currentStep === 2 && <Tab3ModusKerugian />}
          {currentStep === 3 && <Tab4Kronologi />}
          {currentStep === 4 && <Tab5BuktiPasal />}
          {currentStep === 5 && <Tab6Investigasi />}
          {currentStep === 6 && <Tab7PesertaGelar />}
          {currentStep === 7 && <Tab8VersiKeterangan />}
        </div>

        {/* Wizard Footer Navigation */}
        <div className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white/90 p-4 rounded-2xl shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 mt-6">
          <button
            type="button"
            onClick={prevStep}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>{currentStep === 0 ? '← Dashboard Perkara' : 'Kembali'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => saveCurrentCase(true)}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
            >
              <Save className="h-4 w-4 text-slate-500" />
              <span>Simpan Draft</span>
            </button>

            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-700 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 transition"
            >
              <span>{currentStep === 7 ? 'Proses Hasil Gelar' : 'Lanjut'}</span>
              {currentStep === 7 ? (
                <Play className="h-3.5 w-3.5 fill-current" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
