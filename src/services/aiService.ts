import { ChatMessage, WorkflowResult } from '../types';
import { EDU_SYSTEM_PROMPT } from '../prompts';
const API_BASE =
  import.meta.env.VITE_API_URL || 'https://aksiku-production.up.railway.app';

export async function generateAiContent(params: {
  prompt: string;
  systemInstruction?: string;
  responseMimeType?: string;
  pdfBase64?: string;
  mimeType?: string;
}): Promise<{ text: string; json?: any }> {
  try {
    const res = await fetch(`${API_BASE}/api/gemini/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: params.prompt,
        systemInstruction: params.systemInstruction || EDU_SYSTEM_PROMPT,
        responseMimeType: params.responseMimeType,
        pdfBase64: params.pdfBase64,
        mimeType: params.mimeType,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server HTTP Error: ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.error('Error in aiService generateAiContent:', err);
    throw err;
  }
}

export async function sendAiChatMessage(
  messages: ChatMessage[],
  systemInstruction?: string
): Promise<string> {
  try {
   const res = await fetch(`${API_BASE}/api/gemini/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        systemInstruction: systemInstruction || EDU_SYSTEM_PROMPT,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server HTTP Error: ${res.status}`);
    }

    const data = await res.json();
    return data.reply;
  } catch (err: any) {
    console.error('Error in aiService sendAiChatMessage:', err);
    throw err;
  }
}

export async function runBatchSuperWorkflow(params: {
  prompt: string;
  pdfBase64?: string;
  mimeType?: string;
}): Promise<WorkflowResult> {
  try {
    const res = await fetch(`${API_BASE}/api/gemini/workflow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: params.prompt,
        pdfBase64: params.pdfBase64,
        mimeType: params.mimeType,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server HTTP Error: ${res.status}`);
    }

    const data = await res.json();
    return data.result;
  } catch (err: any) {
    console.error('Error in aiService runBatchSuperWorkflow:', err);
    throw err;
  }
}
