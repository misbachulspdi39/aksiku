import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { generateWithGroq } from '../services/groqService';
import { Zap, Sparkles, Loader2, Copy, Check } from 'lucide-react';

export default function WorkflowPage() {
  const [subject, setSubject] = useState('');
  const [targetJenjang, setTargetJenjang] = useState('');
  const [topic, setTopic] = useState('');

  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const userPrompt = `
Tolong hasilkan BUNDLE PERANGKAT AJAR LENGKAP 10-IN-1:
- Mata Pelajaran: ${subject}
- Target / Kekhususan: ${targetJenjang}
- Topik Utama: ${topic}
    `;

    try {
      const output = await generateWithGroq('workflow', userPrompt);
      setResult(output);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans text-slate-800 antialiased">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white p-6 rounded-3xl shadow-lg flex items-center gap-4">
        <div className="p-3 bg-white/10 rounded-2xl">
          <Zap className="w-8 h-8 text-yellow-300" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight">Workflow AI 10-in-1 Super Fast</h1>
          <p className="text-xs text-purple-100 font-medium leading-relaxed">Sekali klik untuk menghasilkan 10 dokumen administrasi & perangkat ajar lengkap sekaligus.</p>
        </div>
      </div>

      {/* Form Input */}
      <form onSubmit={handleGenerate} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Mata Pelajaran</label>
            <input
              type="text"
              required
              placeholder="Contoh: Bahasa Inggris / IPAS"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-purple-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Target / Jenjang</label>
            <input
              type="text"
              required
              placeholder="Contoh: SLB Tunagrahita / SMA Kelas 10"
              value={targetJenjang}
              onChange={(e) => setTargetJenjang(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-purple-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Topik Utama</label>
            <input
              type="text"
              required
              placeholder="Contoh: Greeting & Introduction"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-purple-500 font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 uppercase tracking-wider"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{isLoading ? 'Groq AI Sedang Membuat 10 Dokumen Sekaligus...' : 'Jalankan Workflow 10-in-1'}</span>
        </button>
      </form>

      {/* Hasil Output dengan Tampilan Font Modern */}
      {result && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Hasil Bundle 10-in-1 (Groq AI)</h2>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Semua Dokumen'}</span>
            </button>
          </div>

          <div className="text-slate-800 text-xs leading-relaxed font-sans antialiased">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-base font-black text-purple-900 uppercase tracking-wider mt-6 mb-3 border-b-2 border-purple-100 pb-1.5" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-sm font-extrabold text-purple-800 uppercase tracking-wide mt-5 mb-2.5 bg-purple-50/70 px-3 py-1.5 rounded-lg border-l-4 border-purple-600" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xs font-bold text-slate-900 mt-4 mb-2 tracking-wide uppercase" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-2.5 text-slate-700 leading-relaxed font-medium" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="space-y-1.5 my-2.5 pl-4 list-disc text-slate-700 font-medium" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal space-y-1.5 my-2.5 pl-5 text-slate-700 font-medium" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-extrabold text-slate-900" {...props} />
                ),
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-4 rounded-xl border border-slate-200 shadow-sm">
                    <table className="w-full text-left border-collapse" {...props} />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th className="bg-purple-600 text-white font-bold p-2.5 text-xs uppercase tracking-wider border-b border-slate-200" {...props} />
                ),
                td: ({ node, ...props }) => (
                  <td className="p-2.5 border-b border-slate-100 text-xs text-slate-700 bg-white font-medium" {...props} />
                ),
              }}
            >
              {result}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}