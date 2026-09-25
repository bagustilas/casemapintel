'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CaseData, ScoreBreakdown } from '@/types/case';
import { calculateCaseScore } from '@/lib/scoring';
import { SAMPLE_CASE_EMBEZZLEMENT } from '@/lib/dummy-data';
import { getSupabaseClient, isSupabaseConfigured, mapCaseToDb, mapDbToCase } from '@/lib/supabase/client';
import { useAuth } from './AuthContext';

type ViewMode = 'dashboard' | 'wizard' | 'results';

interface CaseContextType {
  currentCase: CaseData;
  caseList: CaseData[];
  viewMode: ViewMode;
  currentStep: number;
  scoreBreakdown: ScoreBreakdown;
  isSaving: boolean;
  lastSavedAt: Date | null;
  isCloudSyncing: boolean;

  // Navigation
  setViewMode: (mode: ViewMode) => void;
  setCurrentStep: (step: number) => void;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Case Actions
  newCase: () => void;
  openCase: (id: string) => void;
  openCaseResults: (id: string) => void;
  saveCurrentCase: (manualToast?: boolean) => Promise<void>;
  deleteCase: (id: string) => Promise<void>;
  loadSampleCase: () => void;

  // Field Updates
  updateField: <K extends keyof CaseData>(field: K, value: CaseData[K]) => void;
  updateCase: (updater: Partial<CaseData> | ((prev: CaseData) => CaseData)) => void;

  // Import / Export
  exportAllCasesJson: () => void;
  importCasesJson: (jsonString: string) => { success: boolean; count: number; error?: string };
}

const LOCAL_STORAGE_KEY = 'caseintel_cases_store';
const CURRENT_CASE_ID_KEY = 'caseintel_current_case_id';

const createEmptyCase = (licenseKey?: string): CaseData => ({
  id: 'case_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
  licenseKey: licenseKey || 'DEMO-CASEINTEL',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),

  // Tab 1
  title: '',
  lpNumber: '',
  legalRegime: 'KUHP_2023',
  crimeCategory: 'Penggelapan',
  investigationStage: 'Penyidikan',
  incidentDateStart: '',
  incidentDateEnd: '',
  mainArticle: '',
  locationDistrict: '',
  locationPolda: '',
  briefSummary: '',
  internalRef: '',

  // Tab 2
  parties: [],

  // Tab 3
  modusIndicators: [],
  damages: [],

  // Tab 4
  chronology: [],

  // Tab 5
  availableEvidence: [],
  digitalEvidenceHash: '',
  chainOfCustodySummary: '',
  articleElements: [],

  // Tab 6
  statuteDate: '',
  statuteMaxPenaltyYears: '6',
  alibiClaimDate: '',
  alibiActualDate: '',
  alibiClaimLocation: '',
  alibiActualLocation: '',
  alibiClaimTime: '',
  alibiActualTime: '',
  auditSuspectStatus: 'sah',
  auditSearchSeizureStatus: 'sah',
  auditArrestDetentionStatus: 'sah',
  investigationGaps: '',

  // Tab 7
  participants: [],
  meetingDate: '',
  meetingPlace: '',
  meetingConclusion: '',

  // Tab 8
  suspectVersion: '',
  victimVersion: '',
  witnessVersion: '',
  investigatorNotes: '',

  calculatedScore: 0,
});

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export function CaseProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [caseList, setCaseList] = useState<CaseData[]>([]);
  const [currentCase, setCurrentCase] = useState<CaseData>(() => createEmptyCase(session?.licenseKey));
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);

  // Load cases from local storage or cloud on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      let cases: CaseData[] = [];
      if (stored) {
        cases = JSON.parse(stored);
      }

      if (cases.length === 0) {
        // Pre-populate with sample case for great out-of-the-box experience
        cases = [SAMPLE_CASE_EMBEZZLEMENT];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cases));
      }

      setCaseList(cases);

      // Check for last active case ID
      const activeId = localStorage.getItem(CURRENT_CASE_ID_KEY);
      if (activeId) {
        const found = cases.find((c) => c.id === activeId);
        if (found) {
          setCurrentCase(found);
        }
      }
    } catch (e) {
      console.error('Error loading cases from storage:', e);
    }
  }, []);

  // Fetch and sync from Supabase if connected
  useEffect(() => {
    if (!session || !session.licenseKey || !session.isCloudSyncActive) return;

    const syncWithSupabase = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      try {
        setIsCloudSyncing(true);
        const { data, error } = await supabase
          .from('cases')
          .select('*')
          .eq('license_key', session.licenseKey)
          .order('updated_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const cloudCases = data.map(mapDbToCase);
          setCaseList((prev) => {
            // Merge cloud and local cases
            const map = new Map<string, CaseData>();
            prev.forEach((c) => map.set(c.id, c));
            cloudCases.forEach((c) => map.set(c.id, c));
            const merged = Array.from(map.values());
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
            return merged;
          });
        }
      } catch (err) {
        console.warn('Supabase case sync error:', err);
      } finally {
        setIsCloudSyncing(false);
      }
    };

    syncWithSupabase();
  }, [session?.licenseKey, session?.isCloudSyncActive]);

  // Derived score breakdown
  const scoreBreakdown = calculateCaseScore(currentCase);

  const updateField = <K extends keyof CaseData>(field: K, value: CaseData[K]) => {
    setCurrentCase((prev) => {
      const updated = {
        ...prev,
        [field]: value,
        updatedAt: new Date().toISOString(),
      };
      // Keep score updated
      const sc = calculateCaseScore(updated);
      updated.calculatedScore = sc.totalScore;
      return updated;
    });
  };

  const updateCase = (updater: Partial<CaseData> | ((prev: CaseData) => CaseData)) => {
    setCurrentCase((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      next.updatedAt = new Date().toISOString();
      const sc = calculateCaseScore(next);
      next.calculatedScore = sc.totalScore;
      return next;
    });
  };

  const saveCurrentCase = async (manualToast = false): Promise<void> => {
    setIsSaving(true);
    try {
      const sc = calculateCaseScore(currentCase);
      const caseToSave = {
        ...currentCase,
        licenseKey: session?.licenseKey || currentCase.licenseKey || 'DEMO-CASEINTEL',
        calculatedScore: sc.totalScore,
        updatedAt: new Date().toISOString(),
      };

      // Save locally
      const updatedList = caseList.filter((c) => c.id !== caseToSave.id);
      updatedList.unshift(caseToSave);
      setCaseList(updatedList);
      setCurrentCase(caseToSave);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
      localStorage.setItem(CURRENT_CASE_ID_KEY, caseToSave.id);
      setLastSavedAt(new Date());

      // Save to Supabase if connected
      const supabase = getSupabaseClient();
      if (supabase && session?.isCloudSyncActive) {
        const payload = mapCaseToDb(caseToSave);
        await supabase.from('cases').upsert(payload);
      }
    } catch (e) {
      console.error('Failed to save case:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const newCase = () => {
    const fresh = createEmptyCase(session?.licenseKey);
    setCurrentCase(fresh);
    setCurrentStep(0);
    setViewMode('wizard');
    localStorage.setItem(CURRENT_CASE_ID_KEY, fresh.id);
  };

  const openCase = (id: string) => {
    const found = caseList.find((c) => c.id === id);
    if (found) {
      setCurrentCase(found);
      setCurrentStep(0);
      setViewMode('wizard');
      localStorage.setItem(CURRENT_CASE_ID_KEY, id);
    }
  };

  const openCaseResults = (id: string) => {
    const found = caseList.find((c) => c.id === id);
    if (found) {
      setCurrentCase(found);
      setViewMode('results');
      localStorage.setItem(CURRENT_CASE_ID_KEY, id);
    }
  };

  const deleteCase = async (id: string): Promise<void> => {
    const nextList = caseList.filter((c) => c.id !== id);
    setCaseList(nextList);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextList));

    const supabase = getSupabaseClient();
    if (supabase && session?.isCloudSyncActive) {
      try {
        await supabase.from('cases').delete().eq('id', id);
      } catch (e) {
        console.warn('Failed to delete case from Supabase:', e);
      }
    }

    if (currentCase.id === id) {
      if (nextList.length > 0) {
        setCurrentCase(nextList[0]);
      } else {
        setCurrentCase(createEmptyCase(session?.licenseKey));
      }
      setViewMode('dashboard');
    }
  };

  const loadSampleCase = () => {
    const sample = {
      ...SAMPLE_CASE_EMBEZZLEMENT,
      id: 'case_sample_' + Date.now().toString(36),
      updatedAt: new Date().toISOString(),
    };
    setCurrentCase(sample);
    const nextList = [sample, ...caseList.filter((c) => c.id !== sample.id)];
    setCaseList(nextList);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextList));
    localStorage.setItem(CURRENT_CASE_ID_KEY, sample.id);
    setCurrentStep(0);
    setViewMode('wizard');
  };

  const goToStep = (step: number) => {
    setCurrentStep(Math.max(0, Math.min(7, step)));
    setViewMode('wizard');
  };

  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep((prev) => prev + 1);
    } else {
      saveCurrentCase();
      setViewMode('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      setViewMode('dashboard');
    }
  };

  const exportAllCasesJson = () => {
    const exportData = {
      version: 'caseintel-v2.0',
      exportedAt: new Date().toISOString(),
      licenseKey: session?.licenseKey || 'DEMO-EXPORT',
      cases: caseList,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `caseintel-export-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importCasesJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      const incomingCases: CaseData[] = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed.cases)
        ? parsed.cases
        : null;

      if (!incomingCases || incomingCases.length === 0) {
        return { success: false, count: 0, error: 'Format file JSON tidak sesuai atau tidak berisi berkas perkara.' };
      }

      const map = new Map<string, CaseData>();
      caseList.forEach((c) => map.set(c.id, c));
      incomingCases.forEach((c) => {
        if (c && c.id && c.title) {
          map.set(c.id, c);
        }
      });

      const merged = Array.from(map.values());
      setCaseList(merged);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));

      // Also sync to Supabase if connected
      const supabase = getSupabaseClient();
      if (supabase && session?.isCloudSyncActive) {
        incomingCases.forEach((c) => {
          supabase.from('cases').upsert(mapCaseToDb(c));
        });
      }

      return { success: true, count: incomingCases.length };
    } catch (e: any) {
      return { success: false, count: 0, error: e?.message || 'Gagal memproses file JSON.' };
    }
  };

  return (
    <CaseContext.Provider
      value={{
        currentCase,
        caseList,
        viewMode,
        currentStep,
        scoreBreakdown,
        isSaving,
        lastSavedAt,
        isCloudSyncing,
        setViewMode,
        setCurrentStep,
        goToStep,
        nextStep,
        prevStep,
        newCase,
        openCase,
        openCaseResults,
        saveCurrentCase,
        deleteCase,
        loadSampleCase,
        updateField,
        updateCase,
        exportAllCasesJson,
        importCasesJson,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
}

export function useCase() {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCase must be used within a CaseProvider');
  }
  return context;
}
