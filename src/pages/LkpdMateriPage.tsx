import React, { useState } from 'react';
import { SavedDocument } from '../types';
import { INDONESIAN_SUBJECTS, SCHOOL_FASES } from '../data/mockDefaults';
import { buildLkpdPrompt, buildMateriPrompt } from '../prompts';
import { generateAiContent } from '../services/aiService';
import Markdown from 'react-markdown';
import { FileEdit, Sparkles, Loader2, BookmarkCheck, Printer, FileText } from 'lucide-react';

interface LkpdMateriPageProps {
  onSaveDocument: (doc: SavedDocument) => void;
  onOpenViewer: (doc: SavedDocument) => void;
}

export const LkpdMateriPage: React.FC<LkpdMateriPageProps> = ({
  onSaveDocument,
  onOpenViewer,
}) => {
  const [mode, setMode] = useState<'lkpd' | 'materi'>('lkpd');
  const [subject, setSubject] = useState('Informatika / Keterampilan Digital');
  const [grade, setGrade] = useState('Fase D (Kelas 7 - 9 SMP)');
  const [topic, setTopic] = useState('');
  const [objective, setObjective] = useState('');

  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setErrorMsg('Harap masukkan judul/topik kegiatan.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setGeneratedResult(null);

    try {
      const promptText =
        mode === 'lkpd'
          ? buildLkpdPrompt({
              subject,
              grade,
              topic,
              objective: objective || 'Menganalisis masalah dan menemukan solusi terstruktur',
            })
          : buildMateriPrompt({
              subject,
              grade,
              topic,
              depth: 'Komprehensif (Lengkap dengan Ringkasan, Materi, Catatan Guru & Handout Siswa)',
            });

      const res = await generateAiContent({ prompt: promptText });
      setGeneratedResult(res.text);
    } catch (err: any) {
      console.error('Error generating LKPD/Materi:', err);
      setErrorMsg(err.message || 'Gagal menghasilkan media. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDoc = () => {
    if (!generatedResult) return;
    const docTypeLabel = mode === 'lkpd' ? 'LKPD' : 'Materi Ajar';
    const docTitle = `${docTypeLabel} - ${subject}: ${topic}`;
    const newDoc: SavedDocument = {
      id: `doc-${mode}-${Date.now()}`,
      title: docTitle,
      docType: docTypeLabel as any,
      createdAt: new Date().toLocaleString('id-ID'),
      metadata: { subject, grade, topic, docType: docTypeLabel as any },
      content: generatedResult,
    };

    onSaveDocument(newDoc);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
          <FileEdit className="w-4 h-4" />
          <span>Generator LKPD Siswa & Bahan Ajar Lengkap</span>
        </div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Media Pembelajaran Interaktif & Handout Siswa
        </h1>
        <p className="text-xs text-slate-600">
          Buat Lembar Kerja Peserta Didik (LKPD) yang mendorong siswa berpikir kritis (HOTS) atau hasilkan paket materi lengkap yang memuat Ringkasan, Materi Utama, Catatan Guru, dan Handout Siap Cetak.
        </p>

        {/* Toggle Mode */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => {
              setMode('lkpd');
              setGeneratedResult(null);
            }}
            id="lkpd-mode-lkpd-btn"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'lkpd'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Generator LKPD Siswa (Praktikum & Diskusi)
          </button>
          <button
            onClick={() => {
              setMode('materi');
              setGeneratedResult(null);
            }}
            id="lkpd-mode-materi-btn"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'materi'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Generator Bahan Ajar & Handout (4 Bagian)
          </button>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleGenerate} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              id="lkpd-subject-select"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {INDONESIAN_SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Fase / Kelas</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              id="lkpd-grade-select"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {SCHOOL_FASES.map((f) => (
                <option key={f.code} value={f.description}>{f.description}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Judul Topik / Aktivitas *</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            id="lkpd-topic-input"
            placeholder="Contoh: Algoritma & Pemrograman Berpikir Komputasional"
            className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Tujuan / Masalah Pemantik (Opsional)</label>
          <textarea
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            id="lkpd-objective-textarea"
            placeholder="Contoh: Siswa dapat merancang urutan langkah logis untuk menyelesaikan persoalan kehidupan sehari-hari"
            rows={2}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
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
            id="lkpd-generate-btn"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyusun Media...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Hasilkan {mode === 'lkpd' ? 'LKPD Siswa' : 'Materi Pembelajaran'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Generated Result Output */}
      {generatedResult && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded">
                Hasil {mode === 'lkpd' ? 'LKPD Siswa' : 'Bahan Ajar Lengkap'}
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                {subject} - {topic}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  onOpenViewer({
                    id: `lkpd-${Date.now()}`,
                    title: `${mode.toUpperCase()} - ${topic}`,
                    docType: (mode === 'lkpd' ? 'LKPD' : 'Materi Ajar') as any,
                    createdAt: new Date().toLocaleString('id-ID'),
                    metadata: { subject, grade, topic, docType: 'LKPD' },
                    content: generatedResult,
                  })
                }
                id="lkpd-print-btn"
                className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-lg"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Mode Cetak</span>
              </button>

              <button
                onClick={handleSaveDoc}
                id="lkpd-save-btn"
                className={`flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-lg transition-colors ${
                  savedSuccess
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
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
