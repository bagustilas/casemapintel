'use client';

import React from 'react';
import { useCase } from '@/context/CaseContext';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/layout/Header';
import { CaseDashboard } from '@/components/dashboard/CaseDashboard';
import { WizardContainer } from '@/components/wizard/WizardContainer';
import { ResultsView } from '@/components/results/ResultsView';
import { LoginView } from '@/components/auth/LoginView';
import { Scale } from 'lucide-react';

export default function HomePage() {
  const { viewMode } = useCase();
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 space-y-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse">
          <Scale className="h-6 w-6" />
        </div>
        <p className="font-mono text-xs font-semibold uppercase tracking-wider">
          Memuat Sesi CaseIntel...
        </p>
      </div>
    );
  }

  // If not logged in, render the dedicated Login & License Screen
  if (!session) {
    return <LoginView />;
  }

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
