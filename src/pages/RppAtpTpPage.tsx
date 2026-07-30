import React, { useState } from 'react';
import { SavedDocument } from '../types';
import { INDONESIAN_SUBJECTS, SCHOOL_FASES } from '../data/mockDefaults';
import { buildRppPrompt, buildAtpTpPrompt } from '../prompts';
import { generateAiContent } from '../services/aiService';
import Markdown from 'react-markdown';
import { BookOpenCheck, Sparkles, Loader2, BookmarkCheck, Printer } from 'lucide-react';

interface RppAtpTpPageProps {
  onSaveDocument: (doc: SavedDocument) => void;
  onOpenViewer: (doc: SavedDocument) => void;
}

export const RppAtpTpPage: React.FC<RppAtpTpPageProps> = ({
  onSaveDocument,
  onOpenViewer,
}) => {
  const [mode, setMode] = useState<'rpp' | 'atp-tp'>('atp-tp');
  const [subject, setSubject] = useState('IPA (Ilmu Pengetahuan Alam)');
  const [phase, setPhase] = useState('Fase D (Kelas 7 - 9 SMP)');
  const [materiInput, setMateriInput] = useState('');

  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materiInput.trim()) {
      setErrorMsg('Harap masukkan cakupan materi atau topik utama.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setGeneratedResult(null);

    try {
      const promptText =
        mode === 'rpp'
          ? buildRppPrompt({
              subject,
              grade: phase,
              topic: materiInput,
              timeAllocation: '2 x 45 menit',
            })
          : buildAtpTpPrompt({
              subject,
              phase,
              materiData: materiInput,
            });

      const res = await generateAiContent({ prompt: promptText });
      setGeneratedResult(res.text);
    } catch (err: any) {
      console.error('Error generating ATP/TP/RPP:', err);
      setErrorMsg(err.message || 'Gagal menghasilkan dokumen. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDoc = () => {
    if (!generatedResult) return;
    const docTypeLabel = mode === 'rpp' ? 'RPP' : 'ATP';
    const docTitle = `${docTypeLabel} - ${subject} ${phase}: ${materiInput}`;
    const newDoc: SavedDocument = {
      id: `doc-${mode}-${Date.now()}`,
      title: docTitle,
      docType: docTypeLabel as any,
      createdAt: new Date().toLocaleString('id-ID'),
      metadata: { subject, grade: phase, topic: materiInput, docType: docTypeLabel as any },
      content: generatedResult,
    };

    onSaveDocument(newDoc);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
          <BookOpenCheck className="w-4 h-4" />
          <span>Generator RPP, ATP & Tujuan Pembelajaran (TP)</span>
        </div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Perancangan Kurikulum Merdeka Terstruktur
        </h1>
        <p className="text-xs text-slate-600">
          Hasilkan Alur Tujuan Pembelajaran (ATP), Pemetaan Tujuan Pembelajaran (TP), dan Rencana Pelaksanaan Pembelajaran (RPP) yang sistematis sesuai pedoman Kemendikbudristek RI.
        </p>

        {/* Toggle Mode */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => {
              setMode('atp-tp');
              setGeneratedResult(null);
            }}
            id="rpp-mode-atp-btn"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'atp-tp'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Generator ATP & TP (Alur Tujuan Pembelajaran)
          </button>
          <button
            onClick={() => {
              setMode('rpp');
              setGeneratedResult(null);
            }}
            id="rpp-mode-rpp-btn"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'rpp'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Generator RPP Presisi
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
              id="atp-subject-select"
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
              value={phase}
              onChange={(e) => setPhase(e.target.value)}
              id="atp-phase-select"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {SCHOOL_FASES.map((f) => (
                <option key={f.code} value={f.description}>{f.description}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Cakupan Elemen / Topik Materi *</label>
          <textarea
            value={materiInput}
            onChange={(e) => setMateriInput(e.target.value)}
            id="atp-materi-textarea"
            placeholder="Contoh: Klasifikasi Makhluk Hidup, Sel, dan Organisasi Kehidupan"
            rows={3}
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
            id="atp-generate-btn"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Hasilkan Dokumen {mode === 'rpp' ? 'RPP' : 'ATP & TP'}</span>
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
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                Hasil {mode === 'rpp' ? 'RPP' : 'ATP & TP'}
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                {subject} - {materiInput}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  onOpenViewer({
                    id: `preview-${Date.now()}`,
                    title: `${mode.toUpperCase()} ${subject}`,
                    docType: (mode === 'rpp' ? 'RPP' : 'ATP') as any,
                    createdAt: new Date().toLocaleString('id-ID'),
                    metadata: { subject, grade: phase, docType: 'ATP' },
                    content: generatedResult,
                  })
                }
                id="atp-print-btn"
                className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-lg"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Mode Cetak</span>
              </button>

              <button
                onClick={handleSaveDoc}
                id="atp-save-btn"
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
