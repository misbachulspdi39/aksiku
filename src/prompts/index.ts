/**
 * EduAI School - Prompt Engineering System
 * Professional Educational Prompts aligned with Kurikulum Merdeka & Indonesian Education Standards.
 */

export const EDU_SYSTEM_PROMPT = `Anda adalah Senior Expert Educational Consultant & Master Teacher Specialist untuk Kurikulum Merdeka di Indonesia ("EduAI School Master").
Tugas Anda adalah membantu guru mata pelajaran, wali kelas, dan kepala sekolah di Indonesia menghasilkan dokumen administrasi dan media pembelajaran berkualitas tinggi, ilmiah, relevan, dan siap pakai.

Prinsip Utama:
1. Sesuai Regulasi Kemendikbudristek RI (Kurikulum Merdeka, Capaian Pembelajaran, Profil Pelajar Pancasila).
2. Bahasa Indonesia yang baku, pedagogis, komunikatif, dan profesional.
3. Struktur rapi dengan penomoran, tabel/poin-poin markdown, serta kejelasan indikator.
4. Memperhatikan Prinsip Pembelajaran Berdiferensiasi (Kesiapan, Minat, Profil Belajar Siswa) dan Asesmen Otentik (Formatif & Sumatif).
5. Bebas dari jawaban mengambang. Berikan konten nyata yang lengkap dan aplikatif di kelas.`;

export function buildModulAjarPrompt(params: {
  subject: string;
  phaseGrade: string;
  semester: string;
  topic: string;
  learningObjectives: string;
  duration?: string;
  model?: string;
}): string {
  return `Buatkan MODUL AJAR KURIKULUM MERDEKA yang lengkap, rinci, dan siap guna dengan data berikut:
- Mata Pelajaran: ${params.subject}
- Fase / Kelas: ${params.phaseGrade}
- Semester: ${params.semester}
- Materi / Topik Utama: ${params.topic}
- Tujuan Pembelajaran (TP): ${params.learningObjectives}
- Alokasi Waktu: ${params.duration || '2 x 45 menit'}
- Model Pembelajaran: ${params.model || 'Problem Based Learning (PBL) / Project Based Learning (PjBL)'}

Format Struktur Modul Ajar:
I. INFORMASI UMUM
- Nama Penyusun, Sekolah, Tahun Pelajaran
- Jenjang / Kelas / Fase
- Alokasi Waktu & Moda Pembelajaran
- Profil Pelajar Pancasila yang Berkaitan (Pilih 2-3 dimensi yang paling sesuai beserta penjelasannya)
- Sarana dan Prasarana
- Target Peserta Didik (Reguler/Tipikal, Kesulitan Belajar, Pencapaian Tinggi)

II. KOMPONEN INTI
A. Tujuan Pembelajaran
B. Pemahaman Bermakna (Pertanyaan/Manfaat nyata dalam kehidupan)
C. Pertanyaan Pemantik (3-4 pertanyaan pemicu diskusi)
D. Kegiatan Pembelajaran Rinci (Pendahuluan, Kegiatan Inti berdiferensiasi, Penutup)
E. Asesmen Pembelajaran (Asesmen Diagnostik, Formatif, Sumatif)
F. Pengayaan dan Remedial
G. Refleksi Guru dan Peserta Didik

III. LAMPIRAN
- Lembar Kerja Peserta Didik (LKPD) Singkat
- Bahan Bacaan Guru & Peserta Didik
- Glosarium
- Daftar Pustaka`;
}

export function buildRppPrompt(params: {
  subject: string;
  grade: string;
  topic: string;
  timeAllocation: string;
}): string {
  return `Buatkan RENCANA PELAKSANAAN PEMBELAJARAN (RPP) / MODUL AJAR Sederhana Presisi untuk:
- Mata Pelajaran: ${params.subject}
- Kelas / Semester: ${params.grade}
- Topik / Materi: ${params.topic}
- Alokasi Waktu: ${params.timeAllocation}

Sajikan dengan struktur:
1. Identitas Pembelajaran
2. Indikator Pencapaian Kompetensi
3. Tujuan Pembelajaran
4. Langkah-Langkah Pembelajaran (Pendahuluan, Inti dengan sintaks aktif, Penutup)
5. Penilaian / Asesmen (Sikap, Pengetahuan, Keterampilan)
6. Media & Sumber Belajar.`;
}

export function buildAtpTpPrompt(params: {
  subject: string;
  phase: string;
  materiData: string;
}): string {
  return `Buatkan ALUR TUJUAN PEMBELAJARAN (ATP) DAN TUJUAN PEMBELAJARAN (TP) Kurikulum Merdeka untuk:
- Mata Pelajaran: ${params.subject}
- Fase / Kelas: ${params.phase}
- Elemen / Cakupan Materi: ${params.materiData}

Sajikan dalam bentuk Tabel Rapi yang memuat:
1. Elemen Capaian Pembelajaran
2. Capaian Pembelajaran (CP) Elemen
3. Tujuan Pembelajaran (TP) yang diturunkan dari CP
4. Alur Tujuan Pembelajaran (ATP) berurutan dari yang paling mendasar ke kompleks
5. Alokasi Jam Pelajaran (JP)
6. Dimensi Profil Pelajar Pancasila
7. Kata Kunci / Glosarium Utama.`;
}

export function buildLkpdPrompt(params: {
  subject: string;
  grade: string;
  topic: string;
  objective: string;
}): string {
  return `Buatkan LEMBAR KERJA PESERTA DIDIK (LKPD) yang menarik, interaktif, dan mendorong berfikir kritis untuk:
- Mata Pelajaran: ${params.subject}
- Kelas: ${params.grade}
- Judul Kegiatan: ${params.topic}
- Tujuan Kegiatan: ${params.objective}

Struktur LKPD:
1. Judul LKPD & Identitas Kelompok/Siswa
2. Petunjuk Penggunaan / Pengerjaan
3. Pemantik Masalah / Konteks Nyata (Studi Kasus / Gambar / Teks Pendek)
4. Alat dan Bahan (jika ada)
5. Langkah-Langkah Kerja / Eksplorasi
6. Pertanyaan Diskusi Analitis (HOTS)
7. Kesimpulan & Ruang Presentasi
8. Lembar Refleksi Diri Siswa.`;
}

export function buildMateriPrompt(params: {
  subject: string;
  grade: string;
  topic: string;
  depth: string;
}): string {
  return `Buatkan BAHAN AJAR / MATERI PEMBELAJARAN LENGKAP untuk:
- Mata Pelajaran: ${params.subject}
- Kelas: ${params.grade}
- Topik: ${params.topic}
- Tingkat Kedalaman: ${params.depth}

Hasilkan 4 Bagian Terpisah:
Bagian 1: Ringkasan Eksekutif Materi (Aplikasi nyata & Poin Kunci)
Bagian 2: Materi Lengkap & Konseptual (Lengkap dengan definisi, ilustrasi tekstual, contoh soal/studi kasus)
Bagian 3: Catatan Khusus Guru (Pedoman Miskonsepsi Siswa, Tips Mengajar, & Pertanyaan Kunci)
Bagian 4: Handout Siswa Siap Cetak (Bahan bacaan ringkas & glosarium istilah).`;
}

export function buildPptPrompt(params: {
  subject: string;
  topic: string;
  targetAudience: string;
  slideCount: number;
}): string {
  return `Buatkan Struktur Slide PowerPoint (PPT) Pembelajaran Modern & Interaktif untuk:
- Mata Pelajaran: ${params.subject}
- Topik: ${params.topic}
- Target Siswa: ${params.targetAudience}
- Jumlah Slide: ${params.slideCount} slide

Sajikan balasan Anda sebagai JSON Array objek dengan format:
\`\`\`json
[
  {
    "slideNumber": 1,
    "title": "Judul Slide",
    "subtitle": "Subjudul / Pengantar",
    "bulletPoints": ["Poin 1", "Poin 2", "Poin 3"],
    "visualSuggestion": "Saran elemen visual / gambar / diagram yang cocok",
    "speakerNotes": "Catatan guru saat menyampaikan slide ini"
  }
]
\`\`\`
Pastikan slide ke-1 adalah Judul, slide berikutnya memuat pemantik, materi utama, aktivitas kelompok, kuiz cepat, dan slide terakhir berisi kuis/refleksi/penutup.`;
}

export function buildSoalPrompt(params: {
  subject: string;
  grade: string;
  topic: string;
  questionTypes: string[];
  count: number;
  bloomTaxonomy: string;
  difficulty: string;
}): string {
  return `Buatkan BANK SOAL EVALUASI PEMBELAJARAN untuk:
- Mata Pelajaran: ${params.subject}
- Kelas: ${params.grade}
- Topik / Materi: ${params.topic}
- Tipe Soal: ${params.questionTypes.join(', ')}
- Jumlah Soal: ${params.count} nomor
- Taksonomi Bloom Fokus: ${params.bloomTaxonomy}
- Tingkat Kesulitan: ${params.difficulty}

Persyaratan Khusus:
1. Sertakan variasi soal HOTS (Higher Order Thinking Skills) dan gaya AKM (Asesmen Kompetensi Minimum) dengan konteks stimulus (cerita, grafik, data, atau kasus nyata).
2. Sajikan balasan dalam format JSON Array objek agar mudah dirender secara profesional:
\`\`\`json
[
  {
    "id": "1",
    "number": 1,
    "type": "Pilihan Ganda",
    "bloomTaxonomy": "C4",
    "question": "Teks stimulus atau pertanyaan...",
    "options": ["A. opsi 1", "B. opsi 2", "C. opsi 3", "D. opsi 4"],
    "correctAnswer": "A. opsi 1",
    "explanation": "Pembahasan lengkap mengenai alasan jawaban benar...",
    "points": 10
  }
]
\`\`\``;
}

export function buildRubrikPrompt(params: {
  title: string;
  subject: string;
  taskDescription: string;
}): string {
  return `Buatkan RUBRIK PENILAIAN AUTENTIK (Analitik & Holistik) untuk:
- Nama Tugas / Asesmen: ${params.title}
- Mata Pelajaran: ${params.subject}
- Deskripsi Tugas Siswa: ${params.taskDescription}

Sajikan sebagai JSON Array untuk kriteria:
\`\`\`json
[
  {
    "aspect": "Aspek Penilaian (misal: Kemampuan Analisis, Kreativitas, Komunikasi)",
    "weight": "25%",
    "score4": "Sangat Baik: Kriteria rinci...",
    "score3": "Baik: Kriteria rinci...",
    "score2": "Cukup: Kriteria rinci...",
    "score1": "Perlu Bimbingan: Kriteria rinci..."
  }
]
\`\`\``;
}

export function buildDeskripsiNilaiPrompt(scores: { name: string; score: number; topicStrengths?: string; topicWeaknesses?: string }[], subject: string): string {
  return `Buatkan DESKRIPSI RAPOR OTOMATIS KURIKULUM MERDEKA untuk mata pelajaran ${subject}.

Data Nilai Siswa:
${JSON.stringify(scores, null, 2)}

Petunjuk Pembuatan Deskripsi Rapor:
1. Gunakan kalimat narasi positif dan konstruktif sesuai panduan Kurikulum Merdeka.
2. Kalimat diawali dengan apreasiasi atas capaian tertinggi (misal: "Menunjukkan penguasaan yang sangat baik dalam..."), dilanjutkan dengan rekomendasi bagian yang perlu ditingkatkan (misal: "perlu bimbingan lebih lanjut dalam...").
3. Sajikan output dalam format JSON Array:
\`\`\`json
[
  {
    "id": "1",
    "name": "Nama Siswa",
    "finalScore": 85,
    "raporDescription": "Deskripsi narasi capaian rapor..."
  }
]
\`\`\``;
}

export function buildAnalisisNilaiPrompt(data: { subject: string; className: string; rawScores: string }): string {
  return `Lakukan ANALISIS KELAS DAN HASIL EVALUASI PEMBELAJARAN lengkap untuk:
- Mata Pelajaran: ${data.subject}
- Kelas: ${data.className}
- Data Nilai Seluruh Siswa: ${data.rawScores}

Berikan analisis statistik dan pedagogis mendalam:
1. Statistik Kelas (Rata-rata, Nilai Tertinggi, Nilai Terendah, Persentase Ketuntasan KKM/KKTP).
2. Analisis Penguasaan Kompetensi (Materi yang sudah dikuasai mayoritas vs materi yang masih lemah).
3. Daftar Siswa Perlu Remedial & Saran Strategi Remedial Terfokus.
4. Daftar Siswa Perlu Pengayaan & Saran Program Pengayaan Menantang.
5. Rekomendasi Perbaikan Metode Mengajar Guru untuk Pertemuan Berikutnya.`;
}

export function buildAnalisisSiswaPrompt(studentData: { name: string; grade: string; notes: string }): string {
  return `Buatkan ANALISIS PROFIL DAN REKOMENDASI PERKEMBANGAN SISWA untuk Wali Kelas:
- Nama Siswa: ${studentData.name}
- Kelas: ${studentData.grade}
- Catatan / Hasil Pengamatan / Nilai: ${studentData.notes}

Output:
1. Kelebihan Utama & Potensi Siswa (Akademik & Non-akademik)
2. Area Kebiasaan Belajar & Tantangan yang Dihadapi
3. Rekomendasi Gaya Belajar & Pendampingan Spesifik
4. Draf Catatan Wali Kelas untuk Rapor
5. Rekomendasi Pesan Konsultasi dengan Orang Tua.`;
}

export function buildSuratAdminPrompt(type: string, details: string): string {
  return `Buatkan DOKUMEN ADMINISTRASI SEKOLAH / SURAT RESMI yaitu: **${type}**.

Detail / Informasi Input:
${details}

Format Dokumen:
- KOP Surat / Judul Resmi Sekolah
- Nomor Surat & Tanggal Dokumen
- Isu / Pembuka / Isi Utama Lengkap & Legal Pedagogis
- Bagian Penutup & Tempat Tanda Tangan (Kepala Sekolah / Guru / Panitia).`;
}

export function buildKomunikasiPrompt(type: string, context: string): string {
  return `Buatkan DRAF KOMUNIKASI PROFESIONAL PENDIDIK yaitu: **${type}**.

Konteks / Pesan yang Ingin Disampaikan:
${context}

Hasilkan variasi draf yang santun, jelas, tepat sasaran, dan efektif:
- Jika WhatsApp: Ramah, terstruktur dengan emoji relevan, poin ringkas, sopan.
- Jika Surat Resmi / Email: Formal, elegan, lugas.`;
}

export function buildSuperWorkflowPrompt(inputSource: string): string {
  return `Anda adalah Asisten Super AI Kurikulum Merdeka. Pengguna memberikan materi/dokumen/topik berikut:
"""
${inputSource}
"""

Tugas Anda adalah melakukan 10 ALUR PERENCANAAN PEMBELAJARAN SEKALIGUS (SUPER WORKFLOW WORKSPACE) dalam 1 paket respon JSON yang sangat kaya dan komprehensif.

Harap kembalikan JSON persis sesuai struktur berikut:
\`\`\`json
{
  "fileOrTopicTitle": "Judul Materi Pembelajaran",
  "summary": "Ringkasan materi utama secara pedagogis (3-4 paragraf)...",
  "modulAjar": "Dokumen Modul Ajar Kurikulum Merdeka lengkap dengan Informasi Umum, Komponen Inti (TP, Pemahaman Bermakna, Pertanyaan Pemantik, Kegiatan Pembelajaran Berdiferensiasi Pendahuluan/Inti/Penutup), dan Asesmen...",
  "lkpd": "Lembar Kerja Peserta Didik (LKPD) lengkap dengan judul, petunjuk, masalah pemantik, langkah kerja, dan pertanyaan refleksi...",
  "pptSlides": [
    {
      "slideNumber": 1,
      "title": "Judul Slide Utama",
      "subtitle": "Subjudul Pengantar",
      "bulletPoints": ["Poin 1", "Poin 2", "Poin 3"],
      "visualSuggestion": "Saran gambar/diagram",
      "speakerNotes": "Catatan pembicara/guru"
    }
  ],
  "questions": [
    {
      "id": "1",
      "number": 1,
      "type": "Pilihan Ganda",
      "bloomTaxonomy": "C4",
      "question": "Pertanyaan stimulus HOTS/AKM...",
      "options": ["A. pilihan 1", "B. pilihan 2", "C. pilihan 3", "D. pilihan 4"],
      "correctAnswer": "A. pilihan 1",
      "explanation": "Pembahasan lengkap...",
      "points": 10
    }
  ],
  "rubric": [
    {
      "aspect": "Aspek Penilaian 1",
      "weight": "30%",
      "score4": "Sangat Baik: ...",
      "score3": "Baik: ...",
      "score2": "Cukup: ...",
      "score1": "Perlu Bimbingan: ..."
    }
  ],
  "gradeAnalysisExample": "Contoh analisis kompetensi dan saran remedial/pengayaan berbasis materi ini...",
  "raporDescriptionExample": "Contoh kalimat narasi capaian rapor Kurikulum Merdeka untuk siswa yang menguasai vs perlu bimbingan materi ini...",
  "classroomActivities": [
    "Ide Aktivitas 1: Debat Aktif...",
    "Ide Aktivitas 2: Simulasi/PjBL...",
    "Ide Aktivitas 3: Galeri Karya..."
  ]
}
\`\`\`
Pastikan semua isi dokumen di atas berkualitas tinggi, lengkap, dan tidak terpotong!`;
}
