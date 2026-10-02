import { LicenseInfo, LicenseTier, UserRole, UserSession } from '@/types/case';

export const SUPERADMIN_MASTER_KEYS = [
  'CASEINTEL-SUPERADMIN-ROOT',
  'CASEINTEL-SUPERADMIN-2026',
  'SUPERADMIN-MASTER',
];

export const SUPERADMIN_SECRET_PIN = 'admin2026';

export const PRESET_LICENSES: Record<string, LicenseInfo> = {
  'CASEINTEL-SUPERADMIN-ROOT': {
    key: 'CASEINTEL-SUPERADMIN-ROOT',
    tier: 'SUPERADMIN',
    label: 'Kunci Akses Super Admin Pengelola',
    maxDevices: 99,
    issuedTo: 'Super Admin Sistem CaseIntel',
    issuedAt: '2026-01-01T00:00:00.000Z',
    expiresAt: '2099-12-31T23:59:59.000Z',
    status: 'active',
    features: [
      'Hak Akses Penuh Super Admin',
      'Generator Kunci Lisensi & Akun Pro',
      'Manajemen Pengguna & Sesi Perangkat',
      'Akses Analisis Perkara Lengkap Tanpa Batas',
    ],
  },
  'CASEINTEL-PRO-2026': {
    key: 'CASEINTEL-PRO-2026',
    tier: 'PRO',
    label: 'Lisensi Profesional Advokat (Pro Lengkap)',
    maxDevices: 5,
    issuedTo: 'Kantor Advokat & Penasihat Hukum',
    issuedAt: '2026-01-01T00:00:00.000Z',
    expiresAt: '2028-12-31T23:59:59.000Z',
    status: 'active',
    features: [
      'Buat Analisis Perkara Baru Tanpa Batas',
      'Papan Intelijen (Graph Relasi Interaktif)',
      'Simulasi Alur Peristiwa (Step-by-step)',
      'Ekspor Laporan PDF & Risalah Gelar Otomatis',
      'Audit Formil & Cacat Yuridis Praperadilan',
      'Multi-Device Sync (Max 5 Perangkat)',
      'Cloud Backup & Sinkronisasi Supabase',
    ],
  },
  'CASEINTEL-FIRM-2026': {
    key: 'CASEINTEL-FIRM-2026',
    tier: 'FIRM_ENTERPRISE',
    label: 'Lisensi Law Firm & Institusi (Enterprise)',
    maxDevices: 15,
    issuedTo: 'Rizki M. Ramdani & Partners',
    issuedAt: '2026-01-01T00:00:00.000Z',
    expiresAt: '2029-12-31T23:59:59.000Z',
    status: 'active',
    features: [
      'Buat Analisis Perkara Baru Tanpa Batas',
      'Semua Fitur Profesional Lengkap',
      'Multi-User & Multi-Device (Max 15 Perangkat)',
      'Manajemen Sesi Perangkat Terpusat',
      'Analisis Kontradiksi Saksi Lanjutan',
      'Prioritas Sinkronisasi Cloud Supabase',
    ],
  },
  'CASEINTEL-DEMO-TRIAL': {
    key: 'CASEINTEL-DEMO-TRIAL',
    tier: 'TRIAL',
    label: 'Akun Demo Terbatas (Simulasi Saja)',
    maxDevices: 1,
    issuedTo: 'Pengguna Demo CaseIntel',
    issuedAt: '2026-01-01T00:00:00.000Z',
    expiresAt: '2028-12-31T23:59:59.000Z',
    status: 'active',
    features: [
      'Akses Terbatas: Peninjauan Perkara Contoh',
      'Papan Intelijen (Graph Relasi Interaktif)',
      'Simulasi Alur Peristiwa (Step-by-step)',
      'Kalkulator Daluwarsa & Audit Praperadilan',
      '🔒 Buat Perkara Baru Dikunci (Khusus Lisensi Pro)',
    ],
  },
  'CASEINTEL-LIFETIME-VIP': {
    key: 'CASEINTEL-LIFETIME-VIP',
    tier: 'LIFETIME',
    label: 'Lisensi Lifetime VIP Eksklusif',
    maxDevices: 50,
    issuedTo: 'Mitra Utama CaseIntel',
    issuedAt: '2026-01-01T00:00:00.000Z',
    expiresAt: '2099-12-31T23:59:59.000Z',
    status: 'active',
    features: [
      'Buat Analisis Perkara Baru Tanpa Batas',
      'Akses Tanpa Batas Seumur Hidup (Lifetime)',
      'Semua Fitur Pro & Update Sistem Mendatang',
      'Kapasitas Hingga 50 Perangkat Terhubung',
      'Dukungan Teknis Prioritas 24/7',
    ],
  },
};

export function isSuperAdminUser(session?: UserSession | null): boolean {
  if (!session) return false;
  if (session.isSuperAdmin) return true;
  if (session.role === 'Super Admin / Pengelola Sistem') return true;
  const key = (session.licenseKey || '').toUpperCase();
  return SUPERADMIN_MASTER_KEYS.includes(key);
}

export function isDemoTrialMode(session?: UserSession | null): boolean {
  if (!session) return false;
  if (isSuperAdminUser(session)) return false;
  const key = (session.licenseKey || '').toUpperCase();
  return (
    session.licenseTier === 'TRIAL' ||
    key === 'CASEINTEL-DEMO-TRIAL' ||
    key.includes('DEMO') ||
    key.includes('TRIAL')
  );
}

export function validateLicenseKey(rawKey: string): {
  valid: boolean;
  license: LicenseInfo | null;
  message: string;
  isSuperAdmin?: boolean;
} {
  const cleanKey = (rawKey || '').trim().toUpperCase();

  if (!cleanKey) {
    return { valid: false, license: null, message: 'Kunci lisensi wajib diisi.' };
  }

  // Check Super Admin Keys
  if (SUPERADMIN_MASTER_KEYS.includes(cleanKey)) {
    const lic: LicenseInfo = {
      key: cleanKey,
      tier: 'SUPERADMIN',
      label: 'Kunci Akses Super Admin Pengelola',
      maxDevices: 99,
      issuedTo: 'Super Admin Sistem',
      issuedAt: new Date().toISOString(),
      expiresAt: '2099-12-31T23:59:59.000Z',
      status: 'active',
      features: ['Hak Akses Penuh Super Admin', 'Generator Lisensi Resmi'],
    };
    return { valid: true, license: lic, message: 'Autentikasi Super Admin Berhasil!', isSuperAdmin: true };
  }

  // Check Preset Licenses
  if (PRESET_LICENSES[cleanKey]) {
    const lic = PRESET_LICENSES[cleanKey];
    const isExpired = new Date(lic.expiresAt).getTime() < Date.now();
    if (isExpired) {
      return {
        valid: false,
        license: { ...lic, status: 'expired' },
        message: 'Kunci lisensi telah kedaluwarsa. Silakan hubungi Super Admin.',
      };
    }
    return { valid: true, license: lic, message: 'Kunci lisensi valid dan aktif.' };
  }

  // Support custom generated keys format: CASEINTEL-[TIER]-[RANDOM]
  if (cleanKey.startsWith('CASEINTEL-') || cleanKey.startsWith('CI-')) {
    const isFirm = cleanKey.includes('FIRM') || cleanKey.includes('ENTERPRISE');
    const isLifetime = cleanKey.includes('LIFETIME') || cleanKey.includes('VIP');
    const tier: LicenseTier = isFirm ? 'FIRM_ENTERPRISE' : isLifetime ? 'LIFETIME' : 'PRO';

    const customLic: LicenseInfo = {
      key: cleanKey,
      tier,
      label: isFirm ? 'Lisensi Law Firm Enterprise' : isLifetime ? 'Lisensi Seumur Hidup VIP' : 'Lisensi Advokat Pro Lengkap',
      maxDevices: isFirm ? 15 : isLifetime ? 50 : 5,
      issuedTo: 'Pengguna Terverifikasi',
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (isLifetime ? 36500 : 730) * 24 * 3600 * 1000).toISOString(),
      status: 'active',
      features: [
        'Buat Analisis Perkara Baru Tanpa Batas',
        'Papan Intelijen (Graph Relasi Interaktif)',
        'Simulasi Alur Peristiwa (Step-by-step)',
        'Ekspor Laporan PDF & Risalah Gelar Otomatis',
        'Audit Formil & Cacat Yuridis Praperadilan',
        'Kalkulator Daluwarsa & Uji Alibi',
        'Multi-Device Sync & Supabase Cloud',
      ],
    };

    return { valid: true, license: customLic, message: 'Kunci lisensi Pro Lengkap berhasil diaktifkan!' };
  }

  // Generic fallback for custom keys
  if (cleanKey.length >= 6) {
    const genericLic: LicenseInfo = {
      key: cleanKey,
      tier: 'PRO',
      label: 'Lisensi Advokat Pro Lengkap',
      maxDevices: 5,
      issuedTo: 'Pengguna CaseIntel',
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 730 * 24 * 3600 * 1000).toISOString(),
      status: 'active',
      features: [
        'Buat Analisis Perkara Baru Tanpa Batas',
        'Papan Intelijen (Graph Relasi Interaktif)',
        'Simulasi Alur Peristiwa (Step-by-step)',
        'Ekspor Laporan PDF & Risalah Gelar Otomatis',
        'Audit Formil & Cacat Yuridis Praperadilan',
        'Multi-device Sync & Supabase Cloud',
      ],
    };
    return { valid: true, license: genericLic, message: 'Kunci lisensi Pro valid dan aktif.' };
  }

  return {
    valid: false,
    license: null,
    message: 'Format kunci lisensi tidak valid (minimal 6 karakter alfanumerik).',
  };
}

// Storage for licenses generated by Super Admin
const GENERATED_LICENSES_STORAGE_KEY = 'caseintel_admin_generated_licenses';

export function getIssuedLicensesList(): LicenseInfo[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(GENERATED_LICENSES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveIssuedLicense(lic: LicenseInfo) {
  if (typeof window === 'undefined') return;
  try {
    const current = getIssuedLicensesList();
    const updated = [lic, ...current.filter((l) => l.key !== lic.key)];
    localStorage.setItem(GENERATED_LICENSES_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save issued license:', e);
  }
}

export function generateNewLicenseKey(
  tier: LicenseTier = 'PRO',
  durationDays: number = 365,
  issuedTo: string = 'Pengguna Baru'
): LicenseInfo {
  const randPart =
    Math.random().toString(36).substring(2, 6).toUpperCase() +
    '-' +
    Math.random().toString(36).substring(2, 6).toUpperCase();

  const prefix =
    tier === 'FIRM_ENTERPRISE'
      ? 'CASEINTEL-FIRM'
      : tier === 'LIFETIME'
      ? 'CASEINTEL-LIFETIME'
      : 'CASEINTEL-PRO';

  const key = `${prefix}-${randPart}`;

  const maxDevices =
    tier === 'FIRM_ENTERPRISE' ? 15 : tier === 'LIFETIME' ? 50 : 5;

  const newLic: LicenseInfo = {
    key,
    tier: tier === 'TRIAL' ? 'PRO' : tier,
    label:
      tier === 'FIRM_ENTERPRISE'
        ? 'Lisensi Law Firm Enterprise (Multi-User)'
        : tier === 'LIFETIME'
        ? 'Lisensi Seumur Hidup VIP (Lifetime)'
        : 'Lisensi Advokat Pro Lengkap',
    maxDevices,
    issuedTo: issuedTo.trim() || 'Pengguna Baru',
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + durationDays * 24 * 3600 * 1000).toISOString(),
    status: 'active',
    features: [
      'Buat Analisis Perkara Baru Tanpa Batas',
      'Papan Intelijen (Graph Relasi Interaktif)',
      'Simulasi Alur Peristiwa (Step-by-step)',
      'Ekspor Laporan PDF & Risalah Gelar Otomatis',
      'Audit Formil & Cacat Yuridis Praperadilan',
      `Multi-Device Sync (Max ${maxDevices} Perangkat)`,
      'Cloud Backup & Sinkronisasi Supabase',
    ],
  };

  saveIssuedLicense(newLic);
  return newLic;
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
