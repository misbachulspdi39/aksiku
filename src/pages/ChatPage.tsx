import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateText } from '../services/aiService';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Halo Bapak/Ibu Guru! 👋 Saya **Asisten AI AKSIKU**. Ada yang bisa saya bantu terkait strategi pembelajaran SLB, modul ajar, atau penanganan siswa inklusi hari ini?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    const prompt = `Kamu adalah Asisten AI untuk Guru Sekolah Luar Biasa (SLB) dan Inklusi pada aplikasi AKSIKU. Jawablah pertanyaan berikut dengan ramah, profesional, dan solutif:\n\nPertanyaan Guru: ${userMsg}`;

    try {
      const res = await generateText(prompt);
      setMessages((prev) => [...prev, { sender: 'ai', text: res }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Maaf, terjadi kesalahan saat menghubungi AI. Coba lagi nanti.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[75vh]">
        {/* Header Chat */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl font-bold">
              💬
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">AI Chat Guru Asisten</h2>
              <p className="text-xs text-slate-500">Konsultasi Pembelajaran SLB & Kurikulum Merdeka</p>
            </div>
          </div>
        </div>

        {/* Bubble Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-100 text-slate-800 rounded-bl-none prose prose-slate max-w-none'
                }`}
              >
                {msg.sender === 'user' ? (
                  msg.text
                ) : (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 text-slate-500 rounded-2xl p-4 text-xs animate-pulse">
                Sedang mengetik jawaban...
              </div>
            </div>
          )}
        </div>

        {/* Input Chat */}
        <div className="p-4 border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tanyakan sesuatu seputar strategi mengajar SLB..."
            className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow disabled:opacity-50"
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;