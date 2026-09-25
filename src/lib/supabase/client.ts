import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CaseData, UserDevice, UserSession } from '@/types/case';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === 'undefined') {
    if (supabaseUrl && supabaseAnonKey) {
      return createClient(supabaseUrl, supabaseAnonKey);
    }
    return null;
  }

  if (!supabaseInstance && supabaseUrl && supabaseAnonKey) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    } catch (e) {
      console.warn('Supabase client failed to initialize:', e);
      return null;
    }
  }

  return supabaseInstance;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Map CaseData to database row
export function mapCaseToDb(caseData: CaseData) {
  return {
    id: caseData.id,
    license_key: caseData.licenseKey || 'DEMO-LICENSE',
    title: caseData.title || '(Tanpa Judul)',
    lp_number: caseData.lpNumber || null,
    legal_regime: caseData.legalRegime,
    crime_category: caseData.crimeCategory,
    investigation_stage: caseData.investigationStage,
    incident_date_start: caseData.incidentDateStart || null,
    incident_date_end: caseData.incidentDateEnd || null,
    main_article: caseData.mainArticle || null,
    location_district: caseData.locationDistrict || null,
    location_polda: caseData.locationPolda || null,
    brief_summary: caseData.briefSummary || null,
    internal_ref: caseData.internalRef || null,
    parties: caseData.parties || [],
    modus_indicators: caseData.modusIndicators || [],
    damages: caseData.damages || [],
    chronology: caseData.chronology || [],
    available_evidence: caseData.availableEvidence || [],
    digital_evidence_hash: caseData.digitalEvidenceHash || null,
    chain_of_custody_summary: caseData.chainOfCustodySummary || null,
    article_elements: caseData.articleElements || [],
    statute_date: caseData.statuteDate || null,
    statute_max_penalty_years: caseData.statuteMaxPenaltyYears || '6',
    alibi_claim_date: caseData.alibiClaimDate || null,
    alibi_actual_date: caseData.alibiActualDate || null,
    alibi_claim_location: caseData.alibiClaimLocation || null,
    alibi_actual_location: caseData.alibiActualLocation || null,
    alibi_claim_time: caseData.alibiClaimTime || null,
    alibi_actual_time: caseData.alibiActualTime || null,
    audit_suspect_status: caseData.auditSuspectStatus || 'sah',
    audit_search_seizure_status: caseData.auditSearchSeizureStatus || 'sah',
    audit_arrest_detention_status: caseData.auditArrestDetentionStatus || 'sah',
    investigation_gaps: caseData.investigationGaps || null,
    participants: caseData.participants || [],
    meeting_date: caseData.meetingDate || null,
    meeting_place: caseData.meetingPlace || null,
    meeting_conclusion: caseData.meetingConclusion || null,
    suspect_version: caseData.suspectVersion || null,
    victim_version: caseData.victimVersion || null,
    witness_version: caseData.witnessVersion || null,
    investigator_notes: caseData.investigatorNotes || null,
    calculated_score: caseData.calculatedScore || 0,
    updated_at: new Date().toISOString(),
  };
}

// Map database row to CaseData
export function mapDbToCase(row: any): CaseData {
  return {
    id: row.id,
    userId: row.user_id,
    licenseKey: row.license_key,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    title: row.title || '',
    lpNumber: row.lp_number || '',
    legalRegime: row.legal_regime || 'KUHP_2023',
    crimeCategory: row.crime_category || 'Penggelapan',
    investigationStage: row.investigation_stage || 'Penyidikan',
    incidentDateStart: row.incident_date_start || '',
    incidentDateEnd: row.incident_date_end || '',
    mainArticle: row.main_article || '',
    locationDistrict: row.location_district || '',
    locationPolda: row.location_polda || '',
    briefSummary: row.brief_summary || '',
    internalRef: row.internal_ref || '',
    parties: Array.isArray(row.parties) ? row.parties : [],
    modusIndicators: Array.isArray(row.modus_indicators) ? row.modus_indicators : [],
    damages: Array.isArray(row.damages) ? row.damages : [],
    chronology: Array.isArray(row.chronology) ? row.chronology : [],
    availableEvidence: Array.isArray(row.available_evidence) ? row.available_evidence : [],
    digitalEvidenceHash: row.digital_evidence_hash || '',
    chainOfCustodySummary: row.chain_of_custody_summary || '',
    articleElements: Array.isArray(row.article_elements) ? row.article_elements : [],
    statuteDate: row.statute_date || '',
    statuteMaxPenaltyYears: row.statute_max_penalty_years || '6',
    alibiClaimDate: row.alibi_claim_date || '',
    alibiActualDate: row.alibi_actual_date || '',
    alibiClaimLocation: row.alibi_claim_location || '',
    alibiActualLocation: row.alibi_actual_location || '',
    alibiClaimTime: row.alibi_claim_time || '',
    alibiActualTime: row.alibi_actual_time || '',
    auditSuspectStatus: row.audit_suspect_status || 'sah',
    auditSearchSeizureStatus: row.audit_search_seizure_status || 'sah',
    auditArrestDetentionStatus: row.audit_arrest_detention_status || 'sah',
    investigationGaps: row.investigation_gaps || '',
    participants: Array.isArray(row.participants) ? row.participants : [],
    meetingDate: row.meeting_date || '',
    meetingPlace: row.meeting_place || '',
    meetingConclusion: row.meeting_conclusion || '',
    suspectVersion: row.suspect_version || '',
    victimVersion: row.victim_version || '',
    witnessVersion: row.witness_version || '',
    investigatorNotes: row.investigator_notes || '',
    calculatedScore: Number(row.calculated_score) || 0,
  };
}
