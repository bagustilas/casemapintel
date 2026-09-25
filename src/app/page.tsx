'use client';

import React from 'react';
import { useCase } from '@/context/CaseContext';
import { Header } from '@/components/layout/Header';
import { CaseDashboard } from '@/components/dashboard/CaseDashboard';
import { WizardContainer } from '@/components/wizard/WizardContainer';
import { ResultsView } from '@/components/results/ResultsView';

export default function HomePage() {
  const { viewMode } = useCase();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="flex-1">
        {viewMode === 'dashboard' && <CaseDashboard />}
        {viewMode === 'wizard' && <WizardContainer />}
        {viewMode === 'results' && <ResultsView />}
      </main>
    </div>
  );
}
