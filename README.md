# CaseIntel — Analisis & Pemetaan Perkara Pidana (Gelar Perkara)

Aplikasi web modern berbasis **Next.js 16 (App Router, TypeScript, Tailwind CSS)** dengan backend **Supabase** untuk praktisi hukum (Advokat, Penyidik Kepolisian, Jaksa Penuntut Umum) dalam melakukan analisis, pemetaan relasi, audit praperadilan, dan penyusunan risalah gelar perkara pidana secara terstruktur.

---

## 🚀 Fitur Utama

### 1. Form Input Terstruktur (8 Tab)
- **Tab 1 — Data Dasar**: Identitas perkara, Nomor LP, Rezim hukum materiil (KUHP Baru UU No. 1/2023 vs KUHP Lama WvS berdasarkan asas *Lex Mitior*), 16 kategori tindak pidana, tahapan penanganan, dan yurisdiksi administratif.
- **Tab 2 — Para Pihak & Tersangka**: Manajemen dinamis subjek hukum (Tersangka dengan toggle Target Utama, Korban/Pelapor, Saksi Fakta, Saksi Ahli).
- **Tab 3 — Modus & Kerugian**: Checklist 8 indikator modus operandi (terpremeditasi, siber, jabatan, dll) & kalkulator rincian kerugian materiil/imateriil.
- **Tab 4 — Kronologi (Peristiwa)**: Timeline builder waktu, lokasi, dan narasi faktual sebagai tulang punggung graph relasi intelijen.
- **Tab 5 — Bukti & Pasal**: 6 kategori alat bukti sah (Pasal 235 KUHAP Baru / 184 KUHAP Lama), audit jejak digital (SHA-256/MD5 + Chain of Custody), dan checklist pemenuhan unsur delik pasal sangkaan.
- **Tab 6 — Investigasi Lanjutan**: 
  - **Kalkulator Daluwarsa**: 5 tingkat klasifikasi ancaman pidana.
  - **Uji Alibi**: Perbandingan 3 dimensi (tanggal, lokasi, waktu) klaim tersangka vs fakta objektif kronologi menghasilkan skor deviasi.
  - **Audit Cacat Formil**: 3 poin pemeriksaan mitigasi praperadilan (penetapan tersangka minimal 2 bukti sah, penggeledahan/sita, penangkapan/tahanan).
  - Celah penyelidikan (*investigation gaps*).
- **Tab 7 — Peserta Gelar**: Sidang gelar perkara (tanggal, tempat, kesimpulan) & daftar peserta beserta *legal opinion*.
- **Tab 8 — Versi Keterangan**: Komparasi narasi tersangka, korban, saksi dengan deteksi kontradiksi heuristik kata kunci.

### 2. Output & Laporan Gelar Perkara (14 Seksi)
1. **Header Ringkasan**: Metric counter (Pelaku, Korban, Saksi/Ahli, Alat Bukti, Total Kerugian/Kronologi).
2. **Ringkasan Eksekutif**: Auto-generated narasi duduk perkara komprehensif.
3. **Matriks Pertanggungjawaban Pidana**: Kartu visual per tersangka (pasal sangkaan, bukti kunci, status pembuktian).
4. **Papan Intelijen (Graph Relasi)**: Visualisasi graf interaktif berbasis Cytoscape.js dengan fitur **Putar Simulasi Alur Peristiwa Step-by-Step**.
5. **Alur Modus & Peristiwa Kronologis**: Timeline visual urutan kejadian.
6. **Rekomendasi Wilayah Hukum**: Analisis *locus delicti* kepolisian dan kejaksaan negeri yang berwenang.
7. **Kalkulator Syarat Alat Bukti**: Validasi minimal 2 alat bukti sah (Putusan MK No. 21/PUU-XII/2014).
8. **Audit Jejak Digital**: Verifikasi hash integritas barang bukti elektronik dan *chain of custody*.
9. **Analisis Celah Penyelidikan**: Catatan kebutuhan bukti lanjutan.
10. **Pengujian Unsur Delik**: Tabel kepatuhan pemenuhan elemen pasal pidana.
11. **Deteksi Kontradiksi Keterangan**: Matriks persentase kesamaan kata kunci antar pihak.
12. **Risalah Gelar Perkara & Legal Opinion Formal**: Dokumen yuridis siap cetak/ekspor.
13. **Evaluasi Kekuatan Pembuktian (Scoring Band)**: Skor 0–100% dengan pembobotan (Unsur 40%, Bukti 30%, Saksi 15%, Kronologi 15% + bonus deviasi alibi) dan klasifikasi Zona Hijau / Kuning / Merah.
14. **Ekspor & Cetak PDF / Ekspor JSON**: Backup offline & cetak dokumen formal.

---

## 🗄️ Konfigurasi Backend Supabase

### 1. Eksekusi SQL Schema di Supabase
Buka dashboard project Supabase Anda, masuk ke **SQL Editor**, dan jalankan seluruh query yang terdapat di file [`src/lib/supabase/schema.sql`](./src/lib/supabase/schema.sql).

Skrip SQL tersebut membuat:
- Tabel `user_profiles` (identitas akun berbasis nomor WhatsApp & Lisensi)
- Tabel `user_devices` (manajemen multi-perangkat dan sesi aktif)
- Tabel `cases` (penyimpanan data perkara terstruktur dengan kolom JSONB dan full-text search)
- Triggers otomatis `updated_at` & Row Level Security (RLS) policies.

### 2. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env.local`:

```bash
cp .env.example .env.local
```

Isi dengan kredensial Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here
```

> **Catatan**: Jika environment variable belum diisi, CaseIntel tetap berfungsi 100% menggunakan **Penyimpanan Lokal (Offline Cache & LocalStorage)**. Saat Supabase terhubung, data akan otomatis tersinkronisasi antar-perangkat.

---

## 💻 Menjalankan Aplikasi di Lokal

1. **Jalankan Development Server**:
```bash
npm run dev
```

2. Buka browser di [http://localhost:3000](http://localhost:3000).

3. Untuk memuat contoh perkara tindak pidana, klik tombol **"📂 Muat Data Contoh"** di Dashboard atau mulai analisis baru dengan **"+ Buat Analisis Perkara Baru"**.
