import { LicenseInfo, LicenseTier, UserRole, UserSession } from '@/types/case';

export const SUPERADMIN_MASTER_KEYS = [
  'CASEINTEL-SUPERADMIN-ROOT',
  'CASEINTEL-SUPERADMIN-2026',
  'SUPERADMIN-MASTER',
];

export const SUPERADMIN_SECRET_PIN = '35766121';

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
  'CASEINTEL-PRO': {
    key: 'CASEINTEL-PRO',
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
  'CASEINTEL-FIRM': {
    key: 'CASEINTEL-FIRM',
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

export function normalizePhoneNumber(raw: string): string {
  const digits = (raw || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('62')) {
    return '0' + digits.substring(2);
  }
  return digits;
}

function generateRandomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const p1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const p2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${p1}-${p2}`;
}

export function validateLicenseKey(rawKey: string, rawPhone?: string): {
  valid: boolean;
  license: LicenseInfo | null;
  message: string;
  isSuperAdmin?: boolean;
} {
  const cleanKey = (rawKey || '').trim().toUpperCase();
  const cleanPhone = normalizePhoneNumber(rawPhone || '');

  if (!cleanKey && !cleanPhone) {
    return { valid: false, license: null, message: 'Kunci lisensi atau Nomor WhatsApp wajib diisi.' };
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

  // Check Preset Licenses by Key
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

  // Check Issued Licenses by Key
  const issuedList = getIssuedLicensesList();
  const foundIssuedByKey = issuedList.find((l) => l.key.toUpperCase() === cleanKey);

  if (foundIssuedByKey) {
    const isExpired = new Date(foundIssuedByKey.expiresAt).getTime() < Date.now();
    if (isExpired) {
      return {
        valid: false,
        license: { ...foundIssuedByKey, status: 'expired' },
        message: 'Lisensi telah kedaluwarsa. Silakan hubungi Super Admin.',
      };
    }

    // CHECK PHONE BINDING:
    if (foundIssuedByKey.phoneNumber) {
      const boundPhone = normalizePhoneNumber(foundIssuedByKey.phoneNumber);
      if (!cleanPhone) {
        return {
          valid: false,
          license: null,
          message: 'Nomor WhatsApp wajib diisi untuk memverifikasi kepemilikan lisensi ini.',
        };
      }
      if (boundPhone !== cleanPhone) {
        return {
          valid: false,
          license: null,
          message: `Kunci lisensi (${cleanKey}) terikat khusus dengan nomor HP ${foundIssuedByKey.phoneNumber}. Nomor WhatsApp yang Anda masukkan (${cleanPhone}) tidak sesuai.`,
        };
      }
    } else if (cleanPhone) {
      // First time login -> lock/bind this license key to this phone number
      foundIssuedByKey.phoneNumber = cleanPhone;
      saveIssuedLicense(foundIssuedByKey);
    }

    return {
      valid: true,
      license: foundIssuedByKey,
      message: `Lisensi aktif (${foundIssuedByKey.label}) terverifikasi!`,
    };
  }

  // Check Issued Licenses by Phone Number (if user typed phone number in license field)
  if (cleanPhone) {
    const foundIssuedByPhone = issuedList.find(
      (l) => l.phoneNumber && normalizePhoneNumber(l.phoneNumber) === cleanPhone
    );
    if (foundIssuedByPhone && (cleanKey === cleanPhone || cleanKey === '')) {
      const isExpired = new Date(foundIssuedByPhone.expiresAt).getTime() < Date.now();
      if (isExpired) {
        return {
          valid: false,
          license: { ...foundIssuedByPhone, status: 'expired' },
          message: 'Lisensi telah kedaluwarsa. Silakan hubungi Super Admin.',
        };
      }
      return {
        valid: true,
        license: foundIssuedByPhone,
        message: `Lisensi aktif (${foundIssuedByPhone.label}) terverifikasi via Nomor WhatsApp!`,
      };
    }
  }

  // Support custom generated keys format: CASEINTEL-[TIER]-[RANDOM]
  if (cleanKey.startsWith('CASEINTEL-') || cleanKey.startsWith('CI-')) {
    const isFirm = cleanKey.includes('FIRM') || cleanKey.includes('ENTERPRISE');
    const isLifetime = cleanKey.includes('LIFETIME') || cleanKey.includes('VIP');
    const isTrial = cleanKey.includes('DEMO') || cleanKey.includes('TRIAL');
    const tier: LicenseTier = isTrial ? 'TRIAL' : isFirm ? 'FIRM_ENTERPRISE' : isLifetime ? 'LIFETIME' : 'PRO';

    const customLic: LicenseInfo = {
      key: cleanKey,
      tier,
      label:
        tier === 'FIRM_ENTERPRISE'
          ? 'Lisensi Law Firm Enterprise'
          : tier === 'LIFETIME'
          ? 'Lisensi Seumur Hidup VIP'
          : tier === 'TRIAL'
          ? 'Akun Demo Terbatas'
          : 'Lisensi Advokat Pro Lengkap',
      maxDevices: tier === 'FIRM_ENTERPRISE' ? 15 : tier === 'LIFETIME' ? 50 : tier === 'TRIAL' ? 1 : 5,
      issuedTo: cleanPhone ? `Pengguna (${cleanPhone})` : 'Pengguna Terverifikasi',
      phoneNumber: cleanPhone || undefined,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (isLifetime ? 36500 : 730) * 24 * 3600 * 1000).toISOString(),
      status: 'active',
      features: [
        tier !== 'TRIAL' ? 'Buat Analisis Perkara Baru Tanpa Batas' : 'Akses Eksplorasi Berkas Contoh Saja',
        'Papan Intelijen (Graph Relasi Interaktif)',
        'Simulasi Alur Peristiwa (Step-by-step)',
        'Ekspor Laporan PDF & Risalah Gelar Otomatis',
        'Audit Formil & Cacat Yuridis Praperadilan',
        'Kalkulator Daluwarsa & Uji Alibi',
        'Multi-Device Sync & Supabase Cloud',
      ],
    };

    saveIssuedLicense(customLic);
    return { valid: true, license: customLic, message: 'Kunci lisensi berhasil diaktifkan dan ditautkan ke nomor Anda!' };
  }

  return {
    valid: false,
    license: null,
    message: 'Kunci lisensi tidak valid atau tidak terdaftar. Hubungi Super Admin.',
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

export function deleteIssuedLicense(key: string) {
  if (typeof window === 'undefined') return;
  try {
    const current = getIssuedLicensesList();
    const updated = current.filter((l) => l.key.toUpperCase() !== key.toUpperCase());
    localStorage.setItem(GENERATED_LICENSES_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete issued license:', e);
  }
}

export function clearAllIssuedLicenses() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(GENERATED_LICENSES_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear issued licenses:', e);
  }
}

export function generateNewLicenseKey(
  tier: LicenseTier = 'PRO',
  durationDays: number = 365,
  issuedTo: string = 'Pengguna Baru',
  phoneNumber?: string
): LicenseInfo {
  const cleanPhone = phoneNumber ? normalizePhoneNumber(phoneNumber) : '';
  const randPart = generateRandomCode();

  const prefix =
    tier === 'FIRM_ENTERPRISE'
      ? 'CASEINTEL-FIRM'
      : tier === 'LIFETIME'
      ? 'CASEINTEL-LIFETIME'
      : tier === 'TRIAL'
      ? 'CASEINTEL-DEMO'
      : 'CASEINTEL-PRO';

  // Key is ALWAYS random format e.g. CASEINTEL-PRO-WXX5-IX9D
  const key = `${prefix}-${randPart}`;

  const maxDevices =
    tier === 'FIRM_ENTERPRISE' ? 15 : tier === 'LIFETIME' ? 50 : tier === 'TRIAL' ? 1 : 5;

  const newLic: LicenseInfo = {
    key,
    tier: tier === 'TRIAL' ? 'TRIAL' : tier,
    label:
      tier === 'FIRM_ENTERPRISE'
        ? 'Lisensi Law Firm Enterprise (Multi-User)'
        : tier === 'LIFETIME'
        ? 'Lisensi Seumur Hidup VIP (Lifetime)'
        : tier === 'TRIAL'
        ? 'Akun Demo Terbatas'
        : 'Lisensi Advokat Pro Lengkap',
    maxDevices,
    issuedTo: issuedTo.trim() || (cleanPhone ? `Klien (${cleanPhone})` : 'Pengguna Baru'),
    phoneNumber: cleanPhone || undefined,
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + durationDays * 24 * 3600 * 1000).toISOString(),
    status: 'active',
    features: [
      tier !== 'TRIAL' ? 'Buat Analisis Perkara Baru Tanpa Batas' : 'Akses Eksplorasi Berkas Contoh Saja',
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
