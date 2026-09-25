import { CaseData, ScoreBreakdown } from '@/types/case';

export function calculateCaseScore(caseData: Partial<CaseData>): ScoreBreakdown {
  const elements = caseData.articleElements || [];
  const totalElements = elements.length;
  const fulfilledElements = elements.filter((e) => e.isFulfilled).length;
  const elementPct = totalElements > 0 ? (fulfilledElements / totalElements) * 100 : 0;

  const evidence = caseData.availableEvidence || [];
  // 4+ types of evidence gives 100% of the 30% weight
  const evidencePct = Math.min((evidence.length / 4) * 100, 100);

  const witnesses = (caseData.parties || []).filter(
    (p) => p.role === 'Saksi Fakta' || p.role === 'Saksi Ahli'
  );
  // 3+ witnesses gives 100% of the 15% weight
  const witnessPct = Math.min((witnesses.length / 3) * 100, 100);

  const events = caseData.chronology || [];
  // 4+ chronology entries gives 100% of the 15% weight
  const chronologyPct = Math.min((events.length / 4) * 100, 100);

  // Alibi deviation check
  const claimDate = caseData.alibiClaimDate?.trim();
  const actualDate = caseData.alibiActualDate?.trim();
  const claimLoc = caseData.alibiClaimLocation?.trim().toLowerCase();
  const actualLoc = caseData.alibiActualLocation?.trim().toLowerCase();
  const claimTime = caseData.alibiClaimTime?.trim();
  const actualTime = caseData.alibiActualTime?.trim();

  let alibiScore = 0;
  let alibiInconsistent = false;

  if (claimDate && actualDate && claimDate !== actualDate) {
    alibiScore += 35;
    alibiInconsistent = true;
  }
  if (claimLoc && actualLoc && claimLoc !== actualLoc) {
    alibiScore += 35;
    alibiInconsistent = true;
  }
  if (claimTime && actualTime && claimTime !== actualTime) {
    alibiScore += 30;
    alibiInconsistent = true;
  }

  // Base weighted score (40% elements, 30% evidence, 15% witnesses, 15% chronology)
  let rawScore =
    (elementPct / 100) * 40 +
    (evidencePct / 100) * 30 +
    (witnessPct / 100) * 15 +
    (chronologyPct / 100) * 15;

  // Bonus for broken suspect alibi (+5 points up to 100)
  if (alibiInconsistent) {
    rawScore = Math.min(100, rawScore + 5);
  }

  const totalScore = Math.round(rawScore);

  let zone: 'hijau' | 'kuning' | 'merah' = 'merah';
  let zoneLabel = 'RENDAH';
  let zoneDescription =
    'Berkas perkara belum cukup kuat. Lengkapi pemenuhan unsur pasal dan minimal 2 alat bukti sah sebelum dilanjutkan ke tahap berikutnya.';

  if (totalScore >= 70) {
    zone = 'hijau';
    zoneLabel = 'TINGGI';
    zoneDescription =
      'Berkas perkara memiliki konstruksi pembuktian yang solid dan memenuhi standar formil & materiil untuk dilanjutkan.';
  } else if (totalScore >= 40) {
    zone = 'kuning';
    zoneLabel = 'MENENGAH';
    zoneDescription =
      'Berkas perkara memiliki dasar cukup namun terdapat beberapa celah pembuktian yang perlu diperkuat untuk menghindari praperadilan.';
  }

  return {
    totalScore,
    elementScorePct: Math.round(elementPct),
    evidenceScorePct: Math.round(evidencePct),
    witnessScorePct: Math.round(witnessPct),
    chronologyScorePct: Math.round(chronologyPct),
    alibiScore,
    alibiInconsistent,
    zone,
    zoneLabel,
    zoneDescription,
  };
}

export function calculateDaluwarsa(
  incidentDate?: string,
  maxPenaltyTier: string = '6'
): {
  years: number;
  expiryDateStr: string;
  isExpired: boolean;
  statusText: string;
} {
  if (!incidentDate) {
    return {
      years: 0,
      expiryDateStr: '-',
      isExpired: false,
      statusText: 'Tanggal perbuatan belum diisi',
    };
  }

  const tierMap: Record<string, number> = {
    '6': 6,
    '12': 12,
    '12b': 12,
    '18': 18,
    '99': 999, // Unexpiring (seumur hidup / mati)
  };

  const years = tierMap[maxPenaltyTier] || 6;

  if (years === 999) {
    return {
      years: 999,
      expiryDateStr: 'Tidak Daluwarsa',
      isExpired: false,
      statusText: 'Tindak pidana dengan ancaman mati / seumur hidup tidak mengenal daluwarsa penuntutan.',
    };
  }

  const dateObj = new Date(incidentDate);
  if (isNaN(dateObj.getTime())) {
    return {
      years,
      expiryDateStr: '-',
      isExpired: false,
      statusText: 'Format tanggal tidak valid',
    };
  }

  const expiryObj = new Date(dateObj);
  expiryObj.setFullYear(expiryObj.getFullYear() + years);

  const now = new Date();
  const isExpired = expiryObj.getTime() < now.getTime();

  const expiryDateStr = expiryObj.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return {
    years,
    expiryDateStr,
    isExpired,
    statusText: isExpired
      ? `Sudah daluwarsa sejak ${expiryDateStr}. Penuntutan gugur demi hukum (Pasal 78 KUHP).`
      : `Belum daluwarsa. Masa daluwarsa berlaku ${years} tahun s.d. ${expiryDateStr}.`,
  };
}

export function analyzeContradictions(
  suspectText?: string,
  victimText?: string,
  witnessText?: string
): {
  suspectVictimOverlapPct: number;
  victimWitnessOverlapPct: number;
  suspectWitnessOverlapPct: number;
  hasStrongContradiction: boolean;
  notes: string;
} {
  const extractWords = (text?: string) => {
    if (!text) return new Set<string>();
    const words = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 4); // filter common stop words by length
    return new Set(words);
  };

  const setS = extractWords(suspectText);
  const setV = extractWords(victimText);
  const setW = extractWords(witnessText);

  const calcOverlap = (setA: Set<string>, setB: Set<string>) => {
    if (setA.size === 0 || setB.size === 0) return 0;
    let matchCount = 0;
    setA.forEach((w) => {
      if (setB.has(w)) matchCount++;
    });
    return Math.round((matchCount / Math.min(setA.size, setB.size)) * 100);
  };

  const svPct = calcOverlap(setS, setV);
  const vwPct = calcOverlap(setV, setW);
  const swPct = calcOverlap(setS, setW);

  const hasStrongContradiction = Boolean(
    (suspectText && victimText && svPct < 15) ||
    (suspectText && witnessText && swPct < 15)
  );

  let notes = 'Keterangan para pihak menunjukkan konsistensi umum kata kunci peristiwa.';
  if (hasStrongContradiction) {
    notes =
      'Indikasi kontradiksi kuat terdeteksi antara narasi tersangka dan saksi/korban. Sangat potensial digunakan dalam rekonstruksi pembuktian.';
  } else if (svPct < 30 || vwPct < 30) {
    notes =
      'Terdapat perbedaan sudut pandang keterangan yang wajar namun perlu pengujian detail fakta material.';
  }

  return {
    suspectVictimOverlapPct: svPct,
    victimWitnessOverlapPct: vwPct,
    suspectWitnessOverlapPct: swPct,
    hasStrongContradiction,
    notes,
  };
}

export function formatRupiah(num: number): string {
  if (!num || isNaN(num)) return 'Rp 0';
  return 'Rp ' + Math.round(num).toLocaleString('id-ID');
}
