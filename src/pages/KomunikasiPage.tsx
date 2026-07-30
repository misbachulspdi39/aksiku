import React, { useState } from 'react';
import { SavedDocument } from '../types';
import { buildKomunikasiPrompt } from '../prompts';
import { generateAiContent } from '../services/aiService';
import Markdown from 'react-markdown';
import { MessageCircle, Sparkles, Loader2, BookmarkCheck, Copy, Check } from 'lucide-react';

interface KomunikasiPageProps {
  onSaveDocument: (doc: SavedDocument) => void;
}

export const KomunikasiPage: React.FC<KomunikasiPageProps> = ({ onSaveDocument }) => {
  const [msgType, setMsgType] = useState<string>('Pesan WhatsApp ke Orang Tua');
  const [contextInput, setContextInput] = useState('');

  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const typeOptions = [
    'Pesan WhatsApp ke Orang Tua',
    'Pengumuman Singkat Grup Kelas / Sekolah',
    'Email Formal Pendampingan Siswa',
    'Surat Resmi Pemberitahuan Wali Murid',
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contextInput.trim()) {
      setErrorMsg('Harap masukkan pesan atau topik komunikasi yang ingin disampaikan.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setGeneratedResult(null);

    try {
      const promptText = buildKomunikasiPrompt(msgType, contextInput);
      const res = await generateAiContent({ prompt: promptText });
      setGeneratedResult(res.text);
    } catch (err: any) {
      console.error('Error generating Komunikasi:', err);
      setErrorMsg(err.message || 'Gagal menyusun pesan komunikasi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedResult) return;
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveDoc = () => {
    if (!generatedResult) return;
    const docTitle = `Draf Komunikasi: ${msgType}`;
    const newDoc: SavedDocument = {
      id: `doc-kom-${Date.now()}`,
      title: docTitle,
      docType: 'Komunikasi',
      createdAt: new Date().toLocaleString('id-ID'),
      metadata: { topic: msgType, docType: 'Komunikasi' },
      content: generatedResult,
    };

    onSaveDocument(newDoc);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-wider">
          <MessageCircle className="w-4 h-4" />
          <span>Generator Komunikasi Guru & Wali Kelas</span>
        </div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Komunikasi Santun & Efektif dengan Orang Tua
        </h1>
        <p className="text-xs text-slate-600">
          Buat draf pesan WhatsApp yang ramah dan terstruktur untuk orang tua/wali murid, pengumuman kegiatan sekolah, hingga email formal konsultasi siswa.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleGenerate} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Saluran / Format Komunikasi</label>
          <select
            value={msgType}
            onChange={(e) => setMsgType(e.target.value)}
            id="komunikasi-type-select"
            className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 bg-white font-medium"
          >
            {typeOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Pesan / Poin yang Ingin Disampaikan *</label>
          <textarea
            value={contextInput}
            onChange={(e) => setContextInput(e.target.value)}
            id="komunikasi-context-textarea"
            placeholder="Contoh: Mengingatkan orang tua bahwa besok siswa membawa bahan praktikum biologi (daun & botol kaca bekas), serta informasi pembagian rapor tengah semester minggu depan"
            rows={4}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            id="komunikasi-generate-btn"
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyusun Draf Pesan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Hasilkan Draf Komunikasi</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Output */}
      {generatedResult && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <span className="bg-cyan-100 text-cyan-800 text-[10px] font-bold px-2 py-0.5 rounded">
                Draf Pesan Siap Kirim
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">{msgType}</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                id="komunikasi-copy-btn"
                className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-lg"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin Pesan'}</span>
              </button>

              <button
                onClick={handleSaveDoc}
                id="komunikasi-save-btn"
                className={`flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-lg transition-colors ${
                  savedSuccess
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                }`}
              >
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>{savedSuccess ? 'Tersimpan!' : 'Simpan Ke Repository'}</span>
              </button>
            </div>
          </div>

          <div className="markdown-body prose prose-slate max-w-none text-xs sm:text-sm p-4 bg-slate-50/50 rounded-xl border border-slate-200/80">
            <Markdown>{generatedResult}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
};
