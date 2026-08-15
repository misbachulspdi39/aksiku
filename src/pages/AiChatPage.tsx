import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sendAiChatMessage, ChatMessage as ServiceChatMessage } from '../services/groqService';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  BrainCircuit 
} from 'lucide-react';

interface LocalChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export default function AiChatPage() {
  const [messages, setMessages] = useState<LocalChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Halo Bapak/Ibu Guru! 👋 Saya **Asisten AI AKSIKU**. Ada yang bisa saya bantu terkait strategi pembelajaran SLB/Inklusi, modul ajar, atau ide kegiatan belajar hari ini?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: LocalChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      // Konversi riwayat percakapan untuk service
      const historyForService: ServiceChatMessage[] = messages
        .filter((m) => m.id !== '1') // Melewati salam awal jika ada
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text,
        }));

      const aiResponseText = await sendAiChatMessage(query, historyForService);

      const aiMsg: LocalChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error: any) {
      console.error('Chat Error:', error);
      const errorMsg: LocalChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `⚠️ *Maaf, terjadi kendala:* ${error?.message || 'Gagal merespon permintaan.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    if (window.confirm('Apakah Anda yakin ingin membersihkan percakapan ini?')) {
      setMessages([
        {
          id: Date.now().toString(),
          sender: 'ai',
          text: 'Percakapan telah direset. Ada topik baru yang ingin didiskusikan, Bapak/Ibu Guru?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const quickPrompts = [
    { label: ' Slogan SLB / Inklusi', prompt: 'Berikan 7 contoh slogan motivasi inspiratif untuk Sekolah Luar Biasa (SLB).' },
    { label: ' Strategi Tunagrahita', prompt: 'Bagaimana strategi pembelajaran matematika sederhana untuk anak Tunagrahita Fase A?' },
    { label: ' Ice Breaking Inklusif', prompt: 'Berikan 3 ide Ice Breaking yang cocok dan ramah anak inklusi/SLB sebelum mulai kelas.' },
  ];

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-6rem)] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* 1. CHAT HEADER */}
      <div className="p-4 sm:px-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 text-indigo-300 flex items-center justify-center font-bold shadow-inner">
            <BrainCircuit className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm sm:text-base tracking-tight text-white">
                AI Chat Guru Asisten
              </h1>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Konsultasi Pembelajaran SLB & Kurikulum Merdeka
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          title="Reset Chat"
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset Chat</span>
        </button>
      </div>

      {/* 2. CHAT BODY */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50">
        
        {messages.length <= 2 && (
          <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl space-y-2 mb-4">
            <p className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Rekomendasi Pertanyaan Cepat:
            </p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.prompt)}
                  className="text-xs bg-white hover:bg-indigo-600 hover:text-white text-indigo-950 font-medium px-3 py-1.5 rounded-xl border border-indigo-200/80 shadow-2xs transition cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-slate-200 text-indigo-600'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
            </div>

            <div
              className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 shadow-xs space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
              }`}
            >
              <div
                className={`flex items-center justify-between gap-4 text-[11px] pb-1 border-b ${
                  msg.sender === 'user'
                    ? 'border-indigo-500/50 text-indigo-100'
                    : 'border-slate-100 text-slate-400 font-medium'
                }`}
              >
                <span className="font-bold">
                  {msg.sender === 'user' ? 'Bapak/Ibu Guru' : 'Asisten AI AKSIKU'}
                </span>
                <span>{msg.timestamp}</span>
              </div>

              <div className="text-xs sm:text-sm leading-relaxed">
                {msg.sender === 'user' ? (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1 className="text-base font-extrabold text-indigo-950 mt-4 mb-2 border-b border-indigo-100 pb-1" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className="text-sm font-bold text-indigo-900 mt-3 mb-2 bg-indigo-50 px-2.5 py-1 rounded-lg border-l-3 border-indigo-600" {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 className="text-xs font-bold text-slate-900 mt-3 mb-1" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="mb-2.5 text-slate-700 leading-relaxed" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="space-y-1.5 my-2 pl-1" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal space-y-1.5 my-2 pl-5 text-slate-700" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="flex items-start gap-2 text-slate-700" {...props}>
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                          <span className="flex-1">{props.children}</span>
                        </li>
                      ),
                      strong: ({ node, ...props }) => (
                        <strong className="font-extrabold text-slate-900" {...props} />
                      ),
                      table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-3 rounded-xl border border-slate-200">
                          <table className="w-full text-left border-collapse text-xs" {...props} />
                        </div>
                      ),
                      th: ({ node, ...props }) => (
                        <th className="bg-indigo-600 text-white font-bold p-2" {...props} />
                      ),
                      td: ({ node, ...props }) => (
                        <td className="p-2 border-b border-slate-100 bg-slate-50/50" {...props} />
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                )}
              </div>

              {msg.sender === 'ai' && (
                <div className="pt-2 flex items-center justify-end border-t border-slate-100">
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-[11px] font-bold rounded-lg transition cursor-pointer"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Respon</span>
                      </>
                    )}
                  </button>
                </div>
              )}

            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-2xl bg-white border border-slate-200 text-indigo-600 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 animate-bounce" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-2xs text-xs font-semibold text-slate-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
              <span>Asisten AI sedang menyusun jawaban terbaik...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* 3. INPUT FORM AREA */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan sesuatu seputar strategi mengajar SLB / Kurikulum Merdeka..."
            disabled={isLoading}
            className="flex-1 p-3 text-xs sm:text-sm rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium bg-slate-50/50"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 sm:px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Kirim</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}