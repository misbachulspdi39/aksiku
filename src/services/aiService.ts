export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// Mengambil API Key Groq dari .env
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

// MODEL RESMI GROQ YANG AKTIF & STABIL
const GROQ_MODEL = "llama-3.1-8b-instant"; 

const DEFAULT_SYSTEM_INSTRUCTION = 
  "Anda adalah Pakar Konsultan Pendidikan dan Penyusun Dokumen Kurikulum Merdeka Terbaik di Indonesia. " +
  "Hasil dokumen yang Anda buat SANGAT DETAIL, MENDALAM, SANGAT LENGKAP, PROFESIONAL, dan siap cetak/pakai oleh guru. " +
  "Gunakan format Markdown yang rapi dengan heading, bullet points, dan penjelasan yang berbobot.";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Panggilan Utama ke Groq REST API
 */
async function callGroqApi(promptText: string, systemInstruction?: string, retryCount = 0): Promise<string> {
  const cleanKey = GROQ_API_KEY.trim();

  if (!cleanKey) {
    return `⚠️ API Key Groq belum terpasang di file .env (VITE_GROQ_API_KEY).`;
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
            content: promptText
          }
        ],
        temperature: 0.7,
        max_tokens: 3500
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
    return `⚠️ Gagal memproses data dari Groq AI: ${err.message || String(err)}`;
  }
}

// --------------------------------------------------------------------------
// EXPORT FUNGSI UTAMA
// --------------------------------------------------------------------------

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
    "Anda adalah Asisten AI Pakar Guru Kurikulum Merdeka yang ramah, kreatif, dan memberikan jawaban yang sangat mendalam dan edukatif."
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