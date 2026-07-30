import React, { useState } from 'react';
import { ChatMessage, SavedDocument } from '../types';
import { sendAiChatMessage } from '../services/aiService';
import { MessageSquare, Send, Sparkles, User, Bot, Loader2, BookmarkCheck, Trash2, Lightbulb } from 'lucide-react';

interface AiChatPageProps {
  onSaveDocument: (doc: SavedDocument) => void;
}

export const AiChatPage: React.FC<AiChatPageProps> = ({ onSaveDocument }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: 'Halo Bapak/Ibu Guru! Saya konsultan AI Kurikulum Merdeka di EduAI School. Ada yang bisa saya bantu hari ini? Anda bisa meminta penjelasan materi, ide ice breaking, desain PjBL, hingga strategi pembelajaran berdiferensiasi.',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedDocId, setSavedDocId] = useState<string | null>(null);

  const promptSuggestions = [
    { label: 'Jelaskan Materi', text: 'Jelaskan konsep dasar materi ini secara sederhana dengan analogi kehidupan nyata sehingga mudah dipahami siswa:' },
    { label: 'Adaptasi SLB / ABK', text: 'Berikan strategi adaptasi Kurikulum Merdeka dan PPI/PjBL untuk siswa berkebutuhan khusus (SDLB/SMPLB/SMALB) pada materi:' },
    { label: 'Ice Breaking', text: 'Buatkan 3 ide ice breaking 5 menit yang seru, interaktif, tanpa alat khusus, dan relevan untuk meningkatkan fokus siswa di kelas:' },
    { label: 'Ide PjBL', text: 'Rancang 2 ide Project Based Learning (PjBL) kelompok untuk Kurikulum Merdeka lengkap dengan produk akhir yang dihasilkan siswa:' },
    { label: 'Pembelajaran Berdiferensiasi', text: 'Berikan strategi pembelajaran berdiferensiasi (proses & produk) untuk siswa dengan 3 tingkat kesiapan belajar berbeda:' },
    { label: 'Asesmen Formatif', text: 'Buatkan 3 teknik asesmen formatif interaktif singkat (5-10 menit) yang bisa digunakan di tengah pembelajaran:' },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMsg;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMsg('');
    setIsLoading(true);

    try {
      const replyText = await sendAiChatMessage(newMessages);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'Maaf, terjadi kendala saat memproses pertanyaan Anda. Silakan periksa koneksi internet atau coba lagi.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToRepo = (msg: ChatMessage) => {
    const newDoc: SavedDocument = {
      id: `doc-chat-${Date.now()}`,
      title: `Catatan AI Chat Guru: ${msg.text.slice(0, 45)}...`,
      docType: 'Materi Ajar',
      createdAt: new Date().toLocaleString('id-ID'),
      metadata: {
        tags: ['AI Chat Guru', 'Saran Pembelajaran'],
        docType: 'Materi Ajar',
      },
      content: msg.text,
    };
    onSaveDocument(newDoc);
    setSavedDocId(msg.id);
    setTimeout(() => setSavedDocId(null), 3000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-init-reset',
        sender: 'ai',
        text: 'Percakapan telah dibersihkan. Silakan ajukan pertanyaan baru mengenai pembelajaran Anda!',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/10">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">AI Chat Guru</h1>
            <p className="text-xs text-slate-500">Konsultan pedagogi & perencanaan kelas Kurikulum Merdeka 24/7</p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          id="chat-clear-btn"
          className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Bersihkan Chat</span>
        </button>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-3 space-y-1.5">
        <div className="flex items-center gap-1.5 text-slate-600 font-bold text-[11px] uppercase tracking-wider px-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Rekomendasi Pertanyaan Cepat:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {promptSuggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(s.text)}
              id={`chat-suggestion-${idx}`}
              className="text-xs bg-white hover:bg-blue-600 hover:text-white text-slate-700 font-medium px-3 py-1.5 rounded-xl border border-slate-200 transition-all shadow-2xs"
            >
              + {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message Feed Area */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm min-h-[420px] max-h-[550px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xs ${
                  isUser ? 'bg-blue-600' : 'bg-gradient-to-tr from-indigo-600 to-blue-600'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`space-y-1 max-w-[85%] sm:max-w-[75%]`}>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium px-1">
                  <span>{isUser ? 'Bapak/Ibu Guru' : 'EduAI Konsultan'}</span>
                  <span>• {msg.timestamp}</span>
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/80'
                  }`}
                >
                  {msg.text}
                </div>

                {!isUser && (
                  <div className="flex justify-end pt-0.5">
                    <button
                      onClick={() => handleSaveToRepo(msg)}
                      id={`chat-save-msg-${msg.id}`}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100"
                    >
                      <BookmarkCheck className="w-3 h-3" />
                      <span>{savedDocId === msg.id ? 'Tersimpan!' : 'Simpan Jawaban Ke Repository'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 w-fit animate-pulse">
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
            <span>EduAI sedang menyusun penjelasan pedagogis terbaik...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 sm:p-3 shadow-md flex items-center gap-2">
        <textarea
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          id="chat-input-textarea"
          placeholder="Tanyakan apa saja seputar materi, metode mengajar, ice breaking, asesmen..."
          rows={2}
          className="flex-1 text-xs sm:text-sm p-2 bg-transparent focus:outline-none resize-none text-slate-800"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={isLoading || !inputMsg.trim()}
          id="chat-send-btn"
          className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center flex-shrink-0 transition-all shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
