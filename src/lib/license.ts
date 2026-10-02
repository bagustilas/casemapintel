import { LicenseInfo, LicenseTier, UserRole, UserSession } from '@/types/case';

export const PRESET_LICENSES: Record<string, LicenseInfo> = {
  'CASEINTEL-PRO-2026': {
    key: 'CASEINTEL-PRO-2026',
    tier: 'PRO',
    label: 'Lisensi Profesional Advokat',
    maxDevices: 3,
    issuedTo: 'Kantor Advokat & Konsultan Hukum',
    issuedAt: '2026-01-01T00:00:00.000Z',
    expiresAt: '2026-12-31T23:59:59.000Z',
    status: 'active',
    features: [
      'Buat Analisis Perkara Baru Tanpa Batas',
      'Papan Intelijen (Graph Relasi)',
      'Simulasi Alur Peristiwa (Step-by-step)',
      'Ekspor Laporan PDF & Risalah Gelar',
      'Audit Formil Praperadilan',
      'Multi-Device Sync (Max 3 Perangkat)',
      'Cloud Backup Supabase',
    ],
  },
  'CASEINTEL-FIRM-2026': {
    key: 'CASEINTEL-FIRM-2026',
    tier: 'FIRM_ENTERPRISE',
    label: 'Lisensi Law Firm & Institusi',
    maxDevices: 10,
    issuedTo: 'Rizki M. Ramdani & Partners',
    issuedAt: '2026-01-01T00:00:00.000Z',
    expiresAt: '2027-12-31T23:59:59.000Z',
    status: 'active',
    features: [
      'Buat Analisis Perkara Baru Tanpa Batas',
      'Semua Fitur Profesional',
      'Multi-User & Multi-Device (Max 10 Perangkat)',
      'Manajemen Sesi Perangkat Terpusat',
      'Analisis Kontradiksi Saksi Lanjutan',
      'Prioritas Sinkronisasi Cloud',
    ],
  },
  'CASEINTEL-TRIAL-30D': {
    key: 'CASEINTEL-TRIAL-30D',
    tier: 'TRIAL',
    label: 'Lisensi Uji Coba (Demo Trial)',
    maxDevices: 2,
    issuedTo: 'Pengguna Uji Coba Demo',
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
    status: 'active',
    features: [
      'Peninjauan & Evaluasi Berkas Contoh',
      'Simulasi Graph Relasi Papan Intelijen',
      'Kalkulator Daluwarsa & Audit Formil',
      'Penyimpanan Lokal & Cloud Sync',
      'Maksimal 2 Perangkat Terhubung',
    ],
  },
  'CASEINTEL-LIFETIME-VIP': {
    key: 'CASEINTEL-LIFETIME-VIP',
    tier: 'LIFETIME',
    label: 'Lisensi Lifetime VIP Eksklusif',
    maxDevices: 25,
    issuedTo: 'Mitra Utama CaseIntel',
    issuedAt: '2026-01-01T00:00:00.000Z',
    expiresAt: '2099-12-31T23:59:59.000Z',
    status: 'active',
    features: [
      'Buat Analisis Perkara Baru Tanpa Batas',
      'Akses Tanpa Batas Seumur Hidup',
      'Semua Fitur & Update Mendatang',
      'Kapasitas Hingga 25 Perangkat',
      'Dukungan Teknis Prioritas 24/7',
    ],
  },
};

export function isDemoTrialMode(session?: UserSession | null): boolean {
  if (!session) return true;
  const key = (session.licenseKey || '').toUpperCase();
  const tier = session.licenseTier;
  return tier === 'TRIAL' || key.includes('TRIAL') || key.includes('DEMO');
}

export function validateLicenseKey(rawKey: string): {
  valid: boolean;
  license: LicenseInfo | null;
  message: string;
} {
  const cleanKey = (rawKey || '').trim().toUpperCase();

  if (!cleanKey) {
    return { valid: false, license: null, message: 'Kunci lisensi wajib diisi.' };
  }

  // Check in preset licenses first
  if (PRESET_LICENSES[cleanKey]) {
    const lic = PRESET_LICENSES[cleanKey];
    const isExpired = new Date(lic.expiresAt).getTime() < Date.now();
    if (isExpired) {
      return {
        valid: false,
        license: { ...lic, status: 'expired' },
        message: 'Kunci lisensi telah kedaluwarsa. Silakan perbarui lisensi Anda.',
      };
    }
    return { valid: true, license: lic, message: 'Kunci lisensi valid dan aktif.' };
  }

  // Support custom generated keys format: CASEINTEL-[TIER]-[RANDOM]
  if (cleanKey.startsWith('CASEINTEL-') || cleanKey.startsWith('CI-')) {
    const isFirm = cleanKey.includes('FIRM') || cleanKey.includes('ENTERPRISE');
    const isTrial = cleanKey.includes('TRIAL') || cleanKey.includes('DEMO');
    const tier: LicenseTier = isFirm ? 'FIRM_ENTERPRISE' : isTrial ? 'TRIAL' : 'PRO';

    const customLic: LicenseInfo = {
      key: cleanKey,
      tier,
      label: isFirm ? 'Lisensi Law Firm Terdaftar' : isTrial ? 'Lisensi Uji Coba (Demo)' : 'Lisensi Pro Terverifikasi',
      maxDevices: isFirm ? 10 : isTrial ? 2 : 5,
      issuedTo: 'Pengguna Terdaftar',
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (isTrial ? 30 : 365) * 24 * 3600 * 1000).toISOString(),
      status: 'active',
      features: [
        tier !== 'TRIAL' ? 'Buat Analisis Perkara Baru Tanpa Batas' : 'Peninjauan & Evaluasi Berkas Contoh',
        'Papan Intelijen & Simulasi Graf',
        'Kalkulator Daluwarsa & Uji Alibi',
        'Audit Cacat Formil Praperadilan',
        'Ekspor Dokumen PDF Risalah Gelar',
      ],
    };

    return { valid: true, license: customLic, message: 'Kunci lisensi valid.' };
  }

  // Generic fallback if user enters any custom key (e.g. customized firm license)
  if (cleanKey.length >= 6) {
    const genericLic: LicenseInfo = {
      key: cleanKey,
      tier: 'PRO',
      label: 'Lisensi Khusus Pengguna',
      maxDevices: 3,
      issuedTo: 'Pengguna CaseIntel',
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
      status: 'active',
      features: ['Buat Analisis Perkara Baru', 'Fitur Analisis Lengkap', 'Multi-device Sync'],
    };
    return { valid: true, license: genericLic, message: 'Kunci lisensi diterima.' };
  }

  return {
    valid: false,
    license: null,
    message: 'Format kunci lisensi tidak valid (minimal 6 karakter alfanumerik).',
  };
}

export function generateNewLicenseKey(tier: LicenseTier = 'PRO', durationDays: number = 365): LicenseInfo {
  const randPart = Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
  const prefix = tier === 'FIRM_ENTERPRISE' ? 'CASEINTEL-FIRM' : tier === 'TRIAL' ? 'CASEINTEL-TRIAL' : tier === 'LIFETIME' ? 'CASEINTEL-LIFETIME' : 'CASEINTEL-PRO';
  const key = `${prefix}-${randPart}`;

  const maxDevices = tier === 'FIRM_ENTERPRISE' ? 10 : tier === 'TRIAL' ? 2 : tier === 'LIFETIME' ? 25 : 5;

  return {
    key,
    tier,
    label: tier === 'FIRM_ENTERPRISE' ? 'Lisensi Law Firm Enterprise' : tier === 'TRIAL' ? 'Lisensi Uji Coba (Demo)' : tier === 'LIFETIME' ? 'Lisensi Seumur Hidup VIP' : 'Lisensi Pro Individu',
    maxDevices,
    issuedTo: 'Penerima Baru',
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + durationDays * 24 * 3600 * 1000).toISOString(),
    status: 'active',
    features: [
      tier !== 'TRIAL' ? 'Buat Analisis Perkara Baru Tanpa Batas' : 'Peninjauan & Evaluasi Berkas Contoh',
      'Papan Intelijen (Graph Relasi)',
      'Simulasi Alur Peristiwa (Step-by-step)',
      'Ekspor Laporan PDF & Risalah Gelar',
      'Audit Formil Praperadilan',
      `Multi-Device Sync (Max ${maxDevices} Perangkat)`,
      'Cloud Backup Supabase',
    ],
  };
}

export function formatDaysRemaining(expiresAtStr: string): {
  days: number;
  label: string;
  isExpired: boolean;
  colorClass: string;
} {
  const expiry = new Date(expiresAtStr).getTime();
  const now = Date.now();
  const diffMs = expiry - now;
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (days <= 0) {
    return {
      days: 0,
      label: 'Kedaluwarsa',
      isExpired: true,
      colorClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300',
    };
  }

  if (days <= 7) {
    return {
      days,
      label: `Sisa ${days} Hari (Segera Berakhir)`,
      isExpired: false,
      colorClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300',
    };
  }

  return {
    days,
    label: `Aktif (Sisa ${days} Hari)`,
    isExpired: false,
    colorClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
  };
}
