import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Increase payload limit for PDF/File base64 uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Lazy initializer for Gemini client to safely handle environment variable
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing in server environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ==========================================
// API ENDPOINTS
// ==========================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'EduAI School Backend', timestamp: new Date().toISOString() });
});

// Single Prompt Generation Endpoint
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const { prompt, systemInstruction, responseMimeType, pdfBase64, mimeType } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getGeminiClient();

    let contents: any = prompt;

    // If PDF base64 file is attached
    if (pdfBase64) {
      const filePart = {
        inlineData: {
          mimeType: mimeType || 'application/pdf',
          data: pdfBase64,
        },
      };
      const textPart = { text: prompt };
      contents = { parts: [filePart, textPart] };
    }

    const config: any = {};
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }
    if (responseMimeType) {
      config.responseMimeType = responseMimeType;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config,
    });

    const text = response.text || '';
    let parsedJson = null;

    if (responseMimeType === 'application/json') {
      try {
        // Strip markdown codeblock backticks if present
        const cleanJsonStr = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
        parsedJson = JSON.parse(cleanJsonStr);
      } catch (err) {
        console.warn('JSON parsing failed for AI output:', err);
      }
    }

    res.json({ text, json: parsedJson });
  } catch (error: any) {
    console.error('Error in /api/gemini/generate:', error);
    res.status(500).json({
      error: error.message || 'Gagal menghasilkan konten dari Gemini AI',
    });
  }
});

// AI Chat Guru Endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { messages, systemInstruction } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const ai = getGeminiClient();

    // Convert messages format for Gemini model
    const contents = messages.map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction: systemInstruction || 'Anda adalah Konsultan Pembelajaran Kurikulum Merdeka di EduAI School.',
      },
    });

    res.json({ reply: response.text || '' });
  } catch (error: any) {
    console.error('Error in /api/gemini/chat:', error);
    res.status(500).json({
      error: error.message || 'Gagal memproses percakapan AI Chat Guru',
    });
  }
});

// Batch Super Workflow Endpoint
app.post('/api/gemini/workflow', async (req, res) => {
  try {
    const { prompt, pdfBase64, mimeType } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt or material content is required' });
    }

    const ai = getGeminiClient();

    let contents: any = prompt;

    if (pdfBase64) {
      const filePart = {
        inlineData: {
          mimeType: mimeType || 'application/pdf',
          data: pdfBase64,
        },
      };
      const textPart = { text: prompt };
      contents = { parts: [filePart, textPart] };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
        systemInstruction: 'Anda adalah Senior Expert EduAI School Kurikulum Merdeka. Hasilkan paket perencanaan pembelajaran 10-in-1 dalam format JSON murni.',
      },
    });

    const text = response.text || '';
    let resultJson = null;

    try {
      const cleanJsonStr = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
      resultJson = JSON.parse(cleanJsonStr);
    } catch (parseErr) {
      console.error('Failed parsing workflow JSON:', parseErr);
      return res.status(500).json({
        error: 'Gagal memformat hasil Super Workflow menjadi JSON valid. Silakan coba lagi.',
        rawText: text,
      });
    }

    res.json({ result: resultJson });
  } catch (error: any) {
    console.error('Error in /api/gemini/workflow:', error);
    res.status(500).json({
      error: error.message || 'Gagal menjalankan AI Super Workflow',
    });
  }
});

// ==========================================
// VITE MIDDLEWARE / STATIC SERVING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[EduAI School] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
