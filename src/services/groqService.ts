export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type MenuType = 'modul' | 'rpp' | 'soal' | 'workflow' | 'lkpd' | 'ppt';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

// MODEL RESMI GROQ YANG AKTIF & STABIL
const GROQ_MODEL = "llama-3.1-8b-instant"; 

const DEFAULT_SYSTEM_INSTRUCTION = 
  "Anda adalah Pakar Konsultan Pendidikan dan Penyusun Dokumen Kurikulum Merdeka Terbaik di Indonesia. " +
  "Hasil dokumen yang Anda buat SANGAT DETAIL, MENDALAM, SANGAT LENGKAP, PROFESIONAL, dan siap cetak/pakai oleh guru. " +
  "Gunakan format Markdown yang rapi dengan heading, bullet points, dan penjelasan yang berbobot.";

// SYSTEM PROMPT MENDALAM UNTUK TIAP MENU
const SYSTEM_PROMPTS: Record<MenuType, string> = {
  modul: ` Anda adalah Pakar Kurikulum Merdeka & Pengawas Sekolah Inklusif/SLB.
Tugas Anda adalah membuat MODUL AJAR LENGKAP & MENDALAM dengan standar Akreditasi A.

WAJIB MEMENUHI STRUKTUR:
1. IDENTITAS MODUL (Pelajaran, Fase/Kelas, Target Inklusi/SLB/Reguler, Alokasi Waktu).
2. TUJUAN PEMBELAJARAN (TP) & PROFIL PELAJAR PANCASILA (P3).
3. RANCANGAN DIFERENSIASI (Penanganan Kelompok Belum Mahir & Kelompok Mahir).
4. SKENARIO PEMBELAJARAN OPERASIONAL:
   - Pendahuluan: Apersepsi Konkret & Pemantik Visual/Pertanyaan.
   - Inti: Langkah eksplorasi nyata. Sebutkan media visual/alat peraga konkret (misal: Kartu Gambar, Bahasa Isyarat, Papan Flannel jika SLB).
   - Penutup: Refleksi & Penguatan.
5. ASESMEN & TABEL RUBRIK ANALITIK (Disertai Kriteria & Skor 1-3/4).
Dilarang menggunakan kalimat umum seperti "Guru menjelaskan materi". Gunakan aksi nyata!`,

  rpp: ` Anda adalah Spesialis Perencanaan Pembelajaran (RPP/ATP) Kurikulum Merdeka.
Tugas Anda menyusun RPP Sederhana tapi SANGAT KONKRET & TERSTRUKTUR.

WAJIB MEMENUHI STRUKTUR:
1. IDENTITAS & ALOKASI WAKTU LENGKAP.
2. TP & ATP DENGAN KATA KERJA OPERASIONAL (KKO).
3. SKENARIO PEMBELAJARAN OPERASIONAL (Pendahuluan, Inti, Penutup).
4. ADAPTASI STRATEGI SLB/INKLUSI (Alat bantu visual, kinestetik, atau isyarat spesifik materi).
5. ASESMEN & RUBRIK PENILAIAN UNJUK KERJA (Tabel Skor).`,

  soal: ` Anda adalah Pakar Asesmen Nasional & Pembuat Soal HOTS.
Tugas Anda membuat Bank Soal beserta Kunci Jawaban & Rubrik Penilaian Mendalam.

ATURAN BAHASA SOAL (SANGAT IMPORTANT & WAJIB PATUH):
1. Jika Mata Pelajaran adalah "Bahasa Inggris" (English) atau bahasa asing lain, SELURUH Teks Stimulus, Pertanyaan, dan Pilihan Jawaban (A, B, C, D) HARUS DITULIS DALAM BAHASA INGGRIS SECARA FULL (100%).
2. Bagian Pembahasan dan Rubrik Penilaian tetap diperbolehkan menggunakan Bahasa Indonesia agar mempermudah guru.

ATURAN UTAMA LAINNYA:
1. Setiap soal WAJIB memiliki STIMULUS (cerita/kasus nyata/tabel data) sebelum pertanyaan.
2. Sertakan Level Kognitif (C2/C3/C4/C5/C6 HOTS).
3. Soal Esai WAJIB disertai TABEL RUBRIK PENILAIAN ANALITIK beserta bobot skor.
4. Kunci Jawaban WAJIB dilengkapi PEMBAHASAN LOGIS & MENDALAM.
Format: Bagian A (Pilihan Ganda + Kunci/Pembahasan), Bagian B (Esai HOTS), Bagian C (Tabel Rubrik).`,

  workflow: ` Anda adalah Master AI Guru "AKSIKU EduAI".
Tugas Anda menghasilkan BUNDLE PERANGKAT AJAR LENGKAP 10-IN-1 dalam satu kali proses secara MENDALAM & OPERASIONAL.

WAJIB MENGHASILKAN 10 DOKUMEN UTUH (DILARANG MEMOTONG JAWABAN):
1. Analisis CP & TP/ATP
2. Modul Ajar / RPP Utama (Lengkap Langkah Diferensiasi)
3. Lembar Kerja Peserta Didik (LKPD Aktivitas Siswa)
4. Bahan Ajar Ringkasan Materi Visual
5. Outline PPT Slide per Slide
6. Bank Soal Diagnostik & Formatif (HOTS + Kunci Jawaban)
7. Tabel Rubrik Asesmen Analitik
8. Lembar Refleksi Guru & Siswa
9. Draft Pesan WA Laporan untuk Orang Tua
10. Surat / Dokumen Administrasi Pendukung`,

  lkpd: ` Anda adalah Spesialis Lembar Kerja Peserta Didik (LKPD).
Tugas Anda membuat LKPD Berbasis Aktivitas Praktis (PBL/PjBL) yang menarik, ramah anak, dan terstruktur.
Sertakan: Judul Aktivitas, Petunjuk Kerja Visual, Langkah Eksplorasi Siswa, dan Lembar Refleksi Mandiri.`,

  ppt: ` Anda adalah Instructional Designer Presentasi Pembelajaran.
Tugas Anda membuat OUTLINE SLIDE PRESENTASI POWERPOINT yang komunikatif dan kaya visual.
Sertakan per slide: [Nomor Slide], [Judul Slide], [Poin Utama Materi], dan [Panduan Visual/Instruksi Gambar untuk Guru].`
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Panggilan Utama ke Groq REST API
 */
async function callGroqApi(promptText: string, systemInstruction?: string, retryCount = 0): Promise<string> {
  const cleanKey = GROQ_API_KEY.trim();

  if (!cleanKey) {
    throw new Error('API Key Groq belum dipasang di file .env (VITE_GROQ_API_KEY)');
  }

  const url = "https://api.groq.com/openai/v1/chat/completions";

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cleanKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: "system",
            content: systemInstruction || DEFAULT_SYSTEM_INSTRUCTION
          },
          {
            role: "user",
            content: promptText || "Halo, bantu saya menyusun modul pembelajaran."
          }
        ],
        temperature: 0.7,
        max_tokens: 4096
      })
    });

    if (response.ok) {
      const data = await response.json();
      const textResult = data.choices?.[0]?.message?.content;
      if (textResult) return textResult;
    }

    if (response.status === 429 && retryCount < 2) {
      console.warn(`[Groq Rate Limit] Menunggu 3 detik... (Percobaan ${retryCount + 1})`);
      await delay(3000);
      return await callGroqApi(promptText, systemInstruction, retryCount + 1);
    }

    const errData = await response.json().catch(() => ({}));
    const errorMessage = errData?.error?.message || `HTTP Status ${response.status}`;
    throw new Error(errorMessage);

  } catch (err: any) {
    console.error('Groq API Error:', err);
    throw new Error(err.message || String(err));
  }
}

// --------------------------------------------------------------------------
// EXPORT FUNGSI UTAMA
// --------------------------------------------------------------------------

export async function generateWithGroq(menu: MenuType, userPrompt: string): Promise<string> {
  const systemPrompt = SYSTEM_PROMPTS[menu] || DEFAULT_SYSTEM_INSTRUCTION;
  return await callGroqApi(userPrompt, systemPrompt);
}

export async function generateText(prompt: any, systemInstruction?: string): Promise<string> {
  const promptStr = typeof prompt === 'string' ? prompt : JSON.stringify(prompt);
  return await callGroqApi(promptStr, systemInstruction);
}

export async function sendAiChatMessage(
  message: string,
  history: ChatMessage[] = []
): Promise<string> {
  const formattedHistory = history
    .map((h) => `${h.role === 'user' ? 'Guru' : 'AKSIKU'}: ${h.text}`)
    .join('\n');

  const fullPrompt = history.length > 0
    ? `Riwayat Percakapan:\n${formattedHistory}\n\nPesan Baru Guru: ${message}`
    : message;

  return await callGroqApi(
    fullPrompt,
    "Anda adalah Asisten AI Pakar Guru Kurikulum Merdeka & Sekolah Inklusif/SLB yang ramah, kreatif, dan memberikan jawaban yang sangat mendalam dan edukatif."
  );
}

export async function runBatchSuperWorkflow(promptsInput: any): Promise<string[]> {
  let promptsArray: string[] = [];

  if (Array.isArray(promptsInput)) {
    promptsArray = promptsInput;
  } else if (typeof promptsInput === 'string') {
    promptsArray = [promptsInput];
  } else if (promptsInput && typeof promptsInput === 'object') {
    promptsArray = Object.values(promptsInput).map((val) =>
      typeof val === 'string' ? val : JSON.stringify(val)
    );
  } else {
    promptsArray = ['Buatkan modul ajar Kurikulum Merdeka lengkap'];
  }

  const results: string[] = [];

  for (let i = 0; i < promptsArray.length; i++) {
    const res = await callGroqApi(promptsArray[i]);
    results.push(res);
    if (i < promptsArray.length - 1) {
      await delay(1000);
    }
  }

  return results;
}

export const generateAiContent = generateText;