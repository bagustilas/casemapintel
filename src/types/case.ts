export type LegalRegime = 'KUHP_2023' | 'KUHP_OLD';

export type CrimeCategory =
  | 'Pencurian'
  | 'Penipuan'
  | 'Penggelapan'
  | 'Penganiayaan'
  | 'Pembunuhan'
  | 'Pemerkosaan'
  | 'Korupsi'
  | 'Pencucian Uang (TPPU)'
  | 'Narkotika'
  | 'Kejahatan Siber'
  | 'Pemalsuan Dokumen'
  | 'Pemerasan & Pengancaman'
  | 'Pengrusakan Barang'
  | 'Kekerasan Dalam Rumah Tangga (KDRT)'
  | 'Tindak Pidana Lingkungan'
  | 'Tindak Pidana Khusus Lainnya'
  | 'Lainnya';

export type InvestigationStage =
  | 'Pra-Laporan / Konsultasi'
  | 'Penyelidikan'
  | 'Penyidikan'
  | 'Pra-Penuntutan (Tahap I)'
  | 'Penuntutan (Tahap II)'
  | 'Persidangan'
  | 'Praperadilan';

export type PartyRole = 'Tersangka' | 'Korban / Pelapor' | 'Saksi Fakta' | 'Saksi Ahli';

export interface Party {
  id: string;
  name: string;
  role: PartyRole;
  notes: string;
  contact?: string;
  isPrimary?: boolean;
}

export type ModusIndicator =
  | 'Direncanakan / Terpremeditasi'
  | 'Penyalahgunaan Kepercayaan / Jabatan'
  | 'Menggunakan Sarana Elektronik / Siber'
  | 'Pemalsuan Dokumen / Identitas'
  | 'Pola Berulang / Pelaku Residivis'
  | 'Menggunakan Kekerasan / Ancaman Fisik'
  | 'Terorganisir / Sindikat Terstruktur'
  | 'Lintas Wilayah Hukum / Antar-Kota'
  | 'Kerugian Skala Luas / Korban Massal';

export interface DamageItem {
  id: string;
  type: 'Materiil' | 'Imateriil' | 'Fisik' | 'Lainnya';
  nominal: number;
  description: string;
}

export interface ChronologyEvent {
  id: string;
  datetime: string;
  location: string;
  narrative: string;
  linkedPartyIds?: string[];
  linkedEvidenceTypes?: string[];
}

export type EvidenceType =
  | 'Keterangan saksi'
  | 'Keterangan ahli'
  | 'Surat'
  | 'Petunjuk'
  | 'Keterangan terdakwa'
  | 'Bukti elektronik';

export interface ArticleElement {
  id: string;
  articleCode: string;
  elementText: string;
  isFulfilled: boolean;
  supportingFacts: string;
}

export interface MeetingParticipant {
  id: string;
  name: string;
  position: string;
  institution: string;
  opinion: string;
}

export type AuditStatus = 'sah' | 'cacat';

export interface CaseData {
  id: string;
  userId?: string;
  licenseKey?: string;
  createdAt: string;
  updatedAt: string;

  // Tab 1 - Data Dasar
  title: string;
  lpNumber: string;
  legalRegime: LegalRegime;
  crimeCategory: CrimeCategory;
  investigationStage: InvestigationStage;
  incidentDateStart: string;
  incidentDateEnd: string;
  mainArticle: string;
  locationDistrict: string;
  locationPolda: string;
  briefSummary: string;
  internalRef?: string;

  // Tab 2 - Para Pihak
  parties: Party[];

  // Tab 3 - Modus & Kerugian
  modusIndicators: ModusIndicator[];
  damages: DamageItem[];

  // Tab 4 - Kronologi
  chronology: ChronologyEvent[];

  // Tab 5 - Bukti & Pasal
  availableEvidence: EvidenceType[];
  digitalEvidenceHash?: string;
  chainOfCustodySummary?: string;
  articleElements: ArticleElement[];

  // Tab 6 - Investigasi Lanjutan
  statuteDate?: string;
  statuteMaxPenaltyYears?: string; // '6' | '12' | '12b' | '18' | '99'

  alibiClaimDate?: string;
  alibiActualDate?: string;
  alibiClaimLocation?: string;
  alibiActualLocation?: string;
  alibiClaimTime?: string;
  alibiActualTime?: string;

  auditSuspectStatus: AuditStatus;
  auditSearchSeizureStatus: AuditStatus;
  auditArrestDetentionStatus: AuditStatus;
  investigationGaps?: string;

  // Tab 7 - Peserta Gelar
  participants: MeetingParticipant[];
  meetingDate?: string;
  meetingPlace?: string;
  meetingConclusion?: string;

  // Tab 8 - Versi Keterangan
  suspectVersion?: string;
  victimVersion?: string;
  witnessVersion?: string;
  investigatorNotes?: string;

  // Cached Calculated Score
  calculatedScore?: number;
}

export interface ScoreBreakdown {
  totalScore: number;
  elementScorePct: number;
  evidenceScorePct: number;
  witnessScorePct: number;
  chronologyScorePct: number;
  alibiScore: number;
  alibiInconsistent: boolean;
  zone: 'hijau' | 'kuning' | 'merah';
  zoneLabel: string;
  zoneDescription: string;
}

// -------------------------------------------------------------
// AUTH & LICENSE TYPES
// -------------------------------------------------------------

export type UserRole =
  | 'Advokat / Penasihat Hukum'
  | 'Penyidik Kepolisian'
  | 'Jaksa Penuntut Umum'
  | 'Hakim / Panitera'
  | 'Konsultan Hukum / Paralegal'
  | 'Pengguna Umum / Peneliti';

export type LicenseTier = 'TRIAL' | 'PRO' | 'FIRM_ENTERPRISE' | 'LIFETIME';

export interface LicenseInfo {
  key: string;
  tier: LicenseTier;
  label: string;
  maxDevices: number;
  issuedTo: string;
  issuedAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'suspended';
  features: string[];
}

export interface UserSession {
  whatsappNumber: string;
  licenseKey: string;
  fullName: string;
  role: UserRole;
  organization?: string;
  licenseTier: LicenseTier;
  licenseExpiry: string;
  maxDevices: number;
  deviceId: string;
  deviceName: string;
  isCloudSyncActive: boolean;
  loginAt: string;
}

export interface UserDevice {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'other';
  ipAddress?: string;
  browser?: string;
  os?: string;
  lastActive: string;
  isCurrent: boolean;
}
