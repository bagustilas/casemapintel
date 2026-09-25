import { CaseData } from '@/types/case';

export const SAMPLE_CASE_EMBEZZLEMENT: CaseData = {
  id: 'sample-case-001',
  licenseKey: 'DEMO-CASEINTEL-2026',
  createdAt: '2026-06-01T08:00:00.000Z',
  updatedAt: '2026-06-15T14:30:00.000Z',

  // Tab 1 - Data Dasar
  title: 'Dugaan Tindak Pidana Penggelapan Dana Kas Operasional CV Mitra Jaya',
  lpNumber: 'LP/B/0142/VI/2026/SPKT/POLRES KUPANG KOTA',
  legalRegime: 'KUHP_2023',
  crimeCategory: 'Penggelapan',
  investigationStage: 'Penyidikan',
  incidentDateStart: '2026-03-01',
  incidentDateEnd: '2026-05-15',
  mainArticle: 'Pasal 486 jo. Pasal 488 KUHP Nasional (UU No. 1 Tahun 2023)',
  locationDistrict: 'Kecamatan Oebobo, Kota Kupang',
  locationPolda: 'Polda Nusa Tenggara Timur / Polres Kupang Kota',
  briefSummary:
    'Bendahara perusahaan diduga secara berulang tidak menyetorkan uang penerimaan kas hasil penjualan toko periode Maret–Mei 2026 dan memanipulasi buku kas kasir, dengan total kerugian audit internal mencapai Rp 150.000.000.',
  internalRef: 'REF/CI-NTT/2026/088',

  // Tab 2 - Para Pihak
  parties: [
    {
      id: 'p-1',
      name: 'Budi Santoso, S.E.',
      role: 'Tersangka',
      notes: 'Mantan Kepala Kasir & Bendahara CV Mitra Jaya',
      contact: '0812-3456-7890',
      isPrimary: true,
    },
    {
      id: 'p-2',
      name: 'CV Mitra Jaya (Direktur: Dedi Hartono, S.T.)',
      role: 'Korban / Pelapor',
      notes: 'Perusahaan distributor retail & pelapor resmi',
      contact: '0813-9876-5432',
      isPrimary: false,
    },
    {
      id: 'p-3',
      name: 'Siti Rahayu',
      role: 'Saksi Fakta',
      notes: 'Staf Administrasi Keuangan (rekan kerja tersangka)',
      contact: '0821-1122-3344',
      isPrimary: false,
    },
    {
      id: 'p-4',
      name: 'Agus Prasetyo',
      role: 'Saksi Fakta',
      notes: 'Satpam kantor yang bertugas pada malam kejadian',
      contact: '0821-5566-7788',
      isPrimary: false,
    },
    {
      id: 'p-5',
      name: 'Dr. Hendra Wijaya, M.Kom., CEH',
      role: 'Saksi Ahli',
      notes: 'Ahli Forensik Digital Universitas Nusa Cendana',
      contact: '0811-9988-7766',
      isPrimary: false,
    },
  ],

  // Tab 3 - Modus & Kerugian
  modusIndicators: [
    'Direncanakan / Terpremeditasi',
    'Penyalahgunaan Kepercayaan / Jabatan',
    'Menggunakan Sarana Elektronik / Siber',
    'Pemalsuan Dokumen / Identitas',
    'Pola Berulang / Pelaku Residivis',
  ],
  damages: [
    {
      id: 'd-1',
      type: 'Materiil',
      nominal: 150000000,
      description: 'Selisih kas fisik penjualan tunai yang tidak disetor ke rekening giro perusahaan',
    },
    {
      id: 'd-2',
      type: 'Materiil',
      nominal: 12500000,
      description: 'Biaya audit independen kantor akuntan publik untuk pemeriksaan investigatif',
    },
    {
      id: 'd-3',
      type: 'Imateriil',
      nominal: 0,
      description: 'Gangguan operasional pasokan barang distributor dan rusaknya tata kelola internal',
    },
  ],

  // Tab 4 - Kronologi
  chronology: [
    {
      id: 'c-1',
      datetime: '2026-05-14T20:15',
      location: 'Ruang Keuangan CV Mitra Jaya, Kec. Oebobo',
      narrative:
        'Tersangka Budi Santoso terekam kamera CCTV masuk ke ruang kasir di luar jam kerja resmi tanpa izin manajemen untuk mengakses sistem kasir digital dan brankas fisik.',
      linkedPartyIds: ['p-1'],
      linkedEvidenceTypes: ['Bukti elektronik', 'Surat'],
    },
    {
      id: 'c-2',
      datetime: '2026-05-14T20:45',
      location: 'Pintu Gerbang Kantor CV Mitra Jaya',
      narrative:
        'Saksi Agus Prasetyo (satpam) melihat Budi Santoso keluar kantor secara terburu-buru membawa tas ransel berukuran besar.',
      linkedPartyIds: ['p-1', 'p-4'],
      linkedEvidenceTypes: ['Keterangan saksi'],
    },
    {
      id: 'c-3',
      datetime: '2026-05-15T08:00',
      location: 'Ruang Kasir CV Mitra Jaya',
      narrative:
        'Saksi Siti Rahayu menemukan brankas kas terbuka dengan saldo fisik nihil dan log software akuntansi telah diubah secara manual.',
      linkedPartyIds: ['p-3', 'p-2'],
      linkedEvidenceTypes: ['Keterangan saksi', 'Bukti elektronik'],
    },
    {
      id: 'c-4',
      datetime: '2026-05-16T10:00',
      location: 'SPKT Polres Kupang Kota',
      narrative:
        'Direktur Dedi Hartono mewakili CV Mitra Jaya secara resmi membuat Laporan Polisi terkait dugaan penggelapan dalam jabatan.',
      linkedPartyIds: ['p-2'],
      linkedEvidenceTypes: ['Surat'],
    },
    {
      id: 'c-5',
      datetime: '2026-05-20T13:30',
      location: 'Kantor CV Mitra Jaya & Kediaman Tersangka',
      narrative:
        'Penyidik melakukan penggeledahan sah dengan izin ketua PN dan menyita laptop kerja tersangka, DVR CCTV, serta dokumen mutasi bank.',
      linkedPartyIds: ['p-1', 'p-5'],
      linkedEvidenceTypes: ['Bukti elektronik', 'Surat', 'Keterangan ahli'],
    },
  ],

  // Tab 5 - Bukti & Pasal
  availableEvidence: [
    'Keterangan saksi',
    'Keterangan ahli',
    'Surat',
    'Petunjuk',
    'Bukti elektronik',
  ],
  digitalEvidenceHash:
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 (SHA-256 DVR CCTV) & 9f83c605... (MD5 Database Dump)',
  chainOfCustodySummary:
    'Penyitaan dilakukan oleh Tim Labfor & Penyidik Satreskrim pada 20 Mei 2026, dimasukkan kantong anti-statis tersegel dengan Berita Acara Penyitaan disaksikan 2 saksi lingkungan.',
  articleElements: [
    {
      id: 'u-1',
      articleCode: 'Pasal 486 KUHP (Penggelapan)',
      elementText: 'Barangsiapa dengan sengaja dan melawan hukum memiliki barang sesuatu',
      isFulfilled: true,
      supportingFacts:
        'Tersangka mengambil uang tunai brankas dan tidak menyetorkan ke rekening perusahaan dengan kesengajaan penuh tanpa hak.',
    },
    {
      id: 'u-2',
      articleCode: 'Pasal 486 KUHP (Objek Hak Orang Lain)',
      elementText: 'Yang seluruhnya atau sebagian adalah kepunyaan orang lain',
      isFulfilled: true,
      supportingFacts:
        'Uang senilai Rp 150.000.000 adalah milik CV Mitra Jaya yang bersumber dari omzet penjualan toko.',
    },
    {
      id: 'u-3',
      articleCode: 'Pasal 486 KUHP (Dikuasai Bukan Karena Kejahatan)',
      elementText: 'Tetapi yang ada dalam kekuasaannya bukan karena kejahatan',
      isFulfilled: true,
      supportingFacts:
        'Uang berada dalam penguasaan tersangka secara sah selaku bendahara/kasir berdasarkan Surat Keputusan Direksi.',
    },
    {
      id: 'u-4',
      articleCode: 'Pasal 488 KUHP (Pemberatan Jabatan)',
      elementText: 'Dilakukan oleh orang yang penguasaannya terhadap barang disebabkan karena hubungan kerja / mata pencahariannya',
      isFulfilled: true,
      supportingFacts:
        'Tersangka bertindak dalam kapasitas resmi sebagai karyawan tetap yang digaji untuk mengelola kasir.',
    },
  ],

  // Tab 6 - Investigasi Lanjutan
  statuteDate: '2026-05-15',
  statuteMaxPenaltyYears: '12',
  alibiClaimDate: '2026-05-14',
  alibiActualDate: '2026-05-14',
  alibiClaimLocation: 'Rumah pribadi tersangka di Oesapa',
  alibiActualLocation: 'Kantor CV Mitra Jaya di Oebobo',
  alibiClaimTime: '20:00 WITA (Mengklaim sedang tidur di rumah)',
  alibiActualTime: '20:15 WITA (Terekam jelas di CCTV kantor)',
  auditSuspectStatus: 'sah',
  auditSearchSeizureStatus: 'sah',
  auditArrestDetentionStatus: 'sah',
  investigationGaps:
    '1. Belum ada penetapan izin sita khusus rekening bank pribadi tersangka dari Pengadilan Negeri untuk penelusuran aliran dana (TPPU).\n2. Diperlukan konfirmasi transaksi merchant penukaran uang tunai ke e-wallet.',

  // Tab 7 - Peserta Gelar
  participants: [
    {
      id: 'pt-1',
      name: 'AKP Ridwan Hakim, S.H., M.H.',
      position: 'Kasat Reskrim Polres Kupang Kota (Pimpinan Gelar)',
      institution: 'Polres Kupang Kota',
      opinion:
        'Konstruksi pasal 486 jo 488 KUHP telah memenuhi syarat minimal 2 alat bukti sah. Berkas layak dinaikkan ke Tahap I ke Kejaksaan.',
    },
    {
      id: 'pt-2',
      name: 'Iptu Maria Fernandez, S.H.',
      position: 'Kanit Tipidter / Penyidik Utama',
      institution: 'Satreskrim Polres Kupang Kota',
      opinion:
        'Hasil uji forensik digital DVR CCTV dan logbook membuktikan runtuhnya alibi tersangka. Berkas penyidikan dinyatakan lengkap secara materiil.',
    },
    {
      id: 'pt-3',
      name: 'Ratna Dewi, S.H., M.Kn.',
      position: 'Kuasa Hukum Korban / Pelapor',
      institution: 'Kantor Hukum Ratna & Rekan',
      opinion:
        'Memohon agar segera dilakukan pelimpahan berkas perkara demi kepastian hukum dan perlindungan hak korban atas pemulihan kerugian.',
    },
  ],
  meetingDate: '2026-06-15',
  meetingPlace: 'Ruang Rapat Gelar Perkara Satreskrim Polres Kupang Kota',
  meetingConclusion:
    'Peserta gelar perkara secara bulat merekomendasikan penerbitan Berkas Perkara Tahap I dan pelimpahan tersangka beserta barang bukti ke Kejaksaan Negeri Kupang.',

  // Tab 8 - Versi Keterangan
  suspectVersion:
    'Saya berada di rumah saya di Oesapa sepanjang malam tanggal 14 Mei 2026 beristirahat bersama keluarga. Saya tidak pernah datang ke kantor pada malam hari apalagi mengambil uang kas kasir.',
  victimVersion:
    'Berdasarkan audit harian dan rekaman kamera CCTV, tersangka terlihat masuk kantor pukul 20:15 WITA, membuka brankas dan mengambil bundel uang tunai hasil setoran penjualan kasir sebelum melarikan diri.',
  witnessVersion:
    'Saksi satpam Agus melihat tersangka Budi Santoso datang menggunakan motor dan keluar terburu-buru membawa tas ransel berat sekitar pukul 20:45 WITA, sedangkan saksi Siti menemukan brankas sudah kosong di pagi hari.',
  investigatorNotes:
    'Terdapat kontradiksi mutlak antara alibi tersangka dengan rekaman CCTV dan keterangan satpam. Skor deviasi alibi tinggi (90/100) menegaskan kebohongan tersangka.',
  calculatedScore: 92,
};
