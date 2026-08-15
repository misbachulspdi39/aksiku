import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Inisialisasi Google GenAI SDK
const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ GEMINI_API_KEY tidak ditemukan di environment variable!');
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// Endpoint Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', server: 'EduAI School Server Active' });
});

// Endpoint Chat AI Gemini
app.post('/api/gemini/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, history } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Prompt tidak boleh kosong.' });
      return;
    }

    // Menggunakan model gemini-2.5-flash (standar performa & kecepatan tinggi)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'Anda adalah EduAI Konsultan, asisten ahli pendidikan Kurikulum Merdeka Indonesia yang ramah, solutif, dan profesional.',
      },
    });

    const responseText = response.text || 'Maaf, tidak ada respons yang dihasilkan.';
    res.json({ text: responseText });
  } catch (error: any) {
    console.error('❌ Error pada Server Gemini Chat:', error);
    res.status(500).json({
      error: 'Terjadi kesalahan saat memproses permintaan AI.',
      details: error.message,
    });
  }
});

// Jalankan Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 [EduAI School] Server running on http://localhost:${PORT}`);
});