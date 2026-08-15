import { SavedDocument } from '../types';

export const INDONESIAN_SUBJECTS = [
  'Matematika',
  'Bahasa Indonesia',
  'Bahasa Inggris',
  'Pendidikan Pancasila / PPKn',
  'IPA (Ilmu Pengetahuan Alam)',
  'IPS (Ilmu Pengetahuan Sosial)',
  'Informatika / Keterampilan Digital',
  'Seni Budaya & Prakarya',
  'PJOK (Pendidikan Jasmani, Olahraga & Kesehatan)',
  'Fisika',
  'Kimia',
  'Biologi',
  'Ekonomi',
  'Geografi',
  'Sosiologi',
  'Sejarah',
  'Bimbingan Konseling (BK)',
  'Pendidikan Agama & Budi Pekerti',
];

export const SCHOOL_FASES = [
  { code: 'Fase A', description: 'Fase A (Kelas 1 - 2 SD)' },
  { code: 'Fase B', description: 'Fase B (Kelas 3 - 4 SD)' },
  { code: 'Fase C', description: 'Fase C (Kelas 5 - 6 SD)' },
  { code: 'Fase D', description: 'Fase D (Kelas 7 - 9 SMP)' },
  { code: 'Fase E', description: 'Fase E (Kelas 10 SMA/SMK)' },
  { code: 'Fase F', description: 'Fase F (Kelas 11 - 12 SMA/SMK)' },
  // Sekolah Luar Biasa (Pendidikan Khusus)
  { code: 'Fase A (SDLB)', description: 'Fase A - SDLB (Kelas 1 - 2 SD Luar Biasa)' },
  { code: 'Fase B (SDLB)', description: 'Fase B - SDLB (Kelas 3 - 4 SD Luar Biasa)' },
  { code: 'Fase C (SDLB)', description: 'Fase C - SDLB (Kelas 5 - 6 SD Luar Biasa)' },
  { code: 'Fase D (SMPLB)', description: 'Fase D - SMPLB (Kelas 7 - 9 SMP Luar Biasa)' },
  { code: 'Fase E & F (SMALB)', description: 'Fase E & F - SMALB (Kelas 10 - 12 SMA Luar Biasa)' },
];

export const JENJANG_OPTIONS = [
  'PAUD / TK',
  'SD / MI',
  'SMP / MTs',
  'SMA / MA / SMK',
  'SDLB (SD Luar Biasa)',
  'SMPLB (SMP Luar Biasa)',
  'SMALB (SMA Luar Biasa)',
];

export const SAMPLE_STUDENT_SCORES = [
  { id: '1', name: 'Ahmad Rizky Pratama', nisn: '0081234561', formatifScore: 88, sumatifScore: 92, finalScore: 90, topicStrengths: 'Sangat baik dalam pemecahan masalah soal cerita dan analisis data', topicWeaknesses: 'Perlu peningkatan pada ketelitian hitungan aljabar dasar' },
  { id: '2', name: 'Bunga Cantika Putri', nisn: '0081234562', formatifScore: 95, sumatifScore: 98, finalScore: 97, topicStrengths: 'Menguasai seluruh kompetensi dasar dan tingkat lanjut HOTS dengan sangat presisi', topicWeaknesses: 'Tidak ada' },
  { id: '3', name: 'Citra Dewi Lestari', nisn: '0081234563', formatifScore: 78, sumatifScore: 82, finalScore: 80, topicStrengths: 'Bagus dalam diskusi kelompok dan presentasi konsep', topicWeaknesses: 'Memerlukan latihan soal mandiri secara bertahap' },
  { id: '4', name: 'Doni Firmansyah', nisn: '0081234564', formatifScore: 65, sumatifScore: 70, finalScore: 68, topicStrengths: 'Antusias saat pembelajaran berbasis praktik/eksperimen', topicWeaknesses: 'Sangat memerlukan bimbingan remedial pada pemahaman rumus dan konsep teoritis' },
  { id: '5', name: 'Eka Nurjanah', nisn: '0081234565', formatifScore: 82, sumatifScore: 86, finalScore: 84, topicStrengths: 'Cermat dalam membaca petunjuk soal dan pengerjaan LKPD', topicWeaknesses: 'Perlu dorongan untuk lebih aktif mengekspresikan pendapat saat diskusi' },
  { id: '6', name: 'Fajar Hidayat', nisn: '0081234566', formatifScore: 60, sumatifScore: 64, finalScore: 62, topicStrengths: 'Mampu bekerja sama dalam tim', topicWeaknesses: 'Belum mencapai KKTP, perlu intervensi khusus remedial materi dasar' },
  { id: '7', name: 'Gita Gutawa', nisn: '0081234567', formatifScore: 90, sumatifScore: 94, finalScore: 92, topicStrengths: 'Analisis logis sangat matang, mampu membimbing teman sebaya', topicWeaknesses: 'Tidak ada' },
];

export const INITIAL_SAVED_DOCUMENTS: SavedDocument[] = [
  {
    id: 'doc-001',
    title: 'Modul Ajar - Matematika Fase D: Persamaan & Pertidaksamaan Linear',
    docType: 'Modul Ajar',
    createdAt: '2026-07-28 09:30',
    metadata: {
      subject: 'Matematika',
      grade: 'Fase D (Kelas 7)',
      semester: 'Ganjil',
      topic: 'Persamaan Linear Satu Variabel',
      authorRole: 'Guru Mata Pelajaran',
      tags: ['Kurikulum Merdeka', 'PBL', 'HOTS', 'Profil Pancasila'],
      docType: 'Modul Ajar',
    },
    content: `# MODUL AJAR KURIKULUM MERDEKA

## I. INFORMASI UMUM
- **Nama Penyusun**: Dra. Sri Wahyuni, M.Pd.
- **Satuan Pendidikan**: SMP Negeri 1 EduAI
- **Fase / Kelas**: Fase D / Kelas VII
- **Mata Pelajaran**: Matematika
- **Materi Utama**: Persamaan Linear Satu Variabel (PLSV)
- **Alokasi Waktu**: 2 x 45 Menit (1 Pertemuan)
- **Moda Pembelajaran**: Tatap Muka (Luring) / Problem Based Learning

### Profil Pelajar Pancasila
1. **Bernalar Kritis**: Mengidentifikasi konteks nyata masalah matematis.
2. **Gotong Royong**: Berdiskusi menyelesaikan persoalan kontekstual dalam kelompok.

---

## II. KOMPONEN INTI
### A. Tujuan Pembelajaran (TP)
- Peserta didik mampu memodelkan masalah kontekstual ke dalam bentuk persamaan linear satu variabel secara tepat.
- Peserta didik mampu menentukan nilai variabel yang memenuhi persamaan linear satu variabel dengan percaya diri.

### B. Pemahaman Bermakna
Persamaan linear membantu kita menentukan harga barang yang belum diketahui, menghitung alokasi anggaran harian, dan merencanakan jarak perjalanan.

### C. Pertanyaan Pemantik
> "Jika harga 3 buah buku tulis dan 1 buah pulpen seharga Rp 15.000, bagaimana cara kita mengetahui harga 1 buah buku jika harga pulpen adalah Rp 3.000?"

### D. Kegiatan Pembelajaran Berdiferensiasi
1. **Pendahuluan (15 Menit)**:
   - Salam, doa, presensi, dan apersepsi melalui kuis tebak harga barang harian.
   - Menyampaikan tujuan pembelajaran dan alur kegiatan.
2. **Kegiatan Inti (60 Menit)**:
   - *Orientasi Masalah*: Guru menayangkan studi kasus pedagang buah di pasar lokal.
   - *Mengorganisasi Siswa*: Siswa dibagi menjadi kelompok heterogen berdasarkan tingkat kesiapan belajar (Kelompok Terbimbing, Kelompok Mandiri, Kelompok Pengayaan).
   - *Membimbing Penyelidikan*: Kelompok mengerjakan LKPD terstruktur. Guru memberikan scaffolding pada kelompok terbimbing.
   - *Mengembangkan & Menyajikan Hasil*: Perwakilan kelompok mempresentasikan penyelesaian model PLSV di depan kelas.
3. **Penutup (15 Menit)**:
   - Guru dan siswa menyimpulkan langkah penyelesaian PLSV.
   - Refleksi pembelajaran dan asesmen formatif singkat (2 soal).

---

## III. ASESMEN & EVALUASI
- **Asesmen Diagnostik**: Kuis singkat kesiapan operasi hitung dasar aljabar.
- **Asesmen Formatif**: Lembar Observasi Diskusi Kelompok & Hasil pengerjaan LKPD.
- **Asesmen Sumatif**: Tes Tertulis di akhir bab.
`,
  },
  {
    id: 'doc-002',
    title: 'Bank Soal AKM & HOTS - IPA Fase D: Sistem Pencernaan Manusia',
    docType: 'Bank Soal',
    createdAt: '2026-07-27 14:15',
    metadata: {
      subject: 'IPA',
      grade: 'Fase D (Kelas 8)',
      semester: 'Ganjil',
      topic: 'Nutrisi dan Sistem Pencernaan',
      authorRole: 'Guru Mata Pelajaran',
      tags: ['AKM', 'HOTS', 'Kunci Jawaban', 'C4-C5'],
      docType: 'Bank Soal',
    },
    content: `# BANK SOAL EVALUASI PEMBELAJARAN (HOTS & AKM)
**Mata Pelajaran**: IPA (Ilmu Pengetahuan Alam)  
**Kelas / Fase**: VIII / Fase D  
**Materi**: Nutrisi dan Sistem Pencernaan Manusia  

---

### Soal Nomor 1 (Pilihan Ganda - AKM Literasi Sains)
**Stimulus Teks:**
*Seorang siswa melakukan uji nutrisi pada tiga sampel makanan (A, B, C). Ketika diberikan larutan Lugol (Iodin), Sampel A berubah warna menjadi biru kehitaman. Ketika Sampel B ditetasi Reagen Biuret, warnanya berubah menjadi ungu. Sampel C memberikan noda transparan pada kertas saring.*

**Pertanyaan:**
Berdasarkan hasil uji laboratorium di atas, kombinasi sampel makanan yang paling cepat diubah menjadi energi utama oleh tubuh adalah...
- A. Sampel A, karena mengandung karbohidrat amilum tinggi
- B. Sampel B, karena mengandung protein untuk pembangun jaringan
- C. Sampel C, karena mengandung lemak berenergi paling tinggi
- D. Sampel A dan C secara bersamaan

**Kunci Jawaban**: A  
**Level Kognitif**: C4 (Analisis)  
**Pembahasan**: Uji Lugol positif warna biru kehitaman menunjukkan keberadaan amilum (karbohidrat). Karbohidrat adalah sumber energi utama tubuh yang paling cepat dipecah menjadi glukosa melalui bantuan enzim ptialin dan amilase.
`,
  },
  {
    id: 'doc-003',
    title: 'Surat Tugas & Notulen Rapat Koordinasi Wali Kelas',
    docType: 'Surat & Administrasi',
    createdAt: '2026-07-25 11:00',
    metadata: {
      subject: 'Umum',
      grade: 'Semua Kelas',
      semester: 'Ganjil',
      topic: 'Rapat Koordinasi Evaluasi Pembelajaran & Kurikulum',
      authorRole: 'Kepala Sekolah',
      tags: ['Surat Tugas', 'Notulen', 'Administrasi Sekolah'],
      docType: 'Surat & Administrasi',
    },
    content: `# SURAT TUGAS KEPALA SEKOLAH
**Nomor**: 005/ST-EDU/VII/2026

Yang bertanda tangan di bawah ini Kepala SMP Negeri 1 EduAI memberikan tugas kepada:
- **Nama**: Bpk. Hendra Wijaya, S.Pd.
- **Jabatan**: Wali Kelas VIII-A / Guru Informatika
- **Tugas**: Menyelenggarakan Rapat Koordinasi Wali Kelas dan Orang Tua / Wali Murid Persiapan Pembelajaran Berdiferensiasi Semester Ganjil.

Dibuat di: Jakarta  
Tanggal: 25 Juli 2026  
*Kepala Sekolah SMP Negeri 1 EduAI*
`,
  },
];
