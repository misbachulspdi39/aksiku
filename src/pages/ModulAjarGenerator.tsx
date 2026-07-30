import React, { useState } from 'react';
import { SavedDocument } from '../types';
import { INDONESIAN_SUBJECTS, SCHOOL_FASES } from '../data/mockDefaults';
import { buildModulAjarPrompt } from '../prompts';
import { generateAiContent } from '../services/aiService';
import Markdown from 'react-markdown';
import { FileText, Sparkles, Loader2, Copy, Check, BookmarkCheck, Printer, Download } from 'lucide-react';

interface ModulAjarGeneratorProps {
  onSaveDocument: (doc: SavedDocument) => void;
  onOpenViewer: (doc: SavedDocument) => void;
}

export const ModulAjarGenerator: React.FC<ModulAjarGeneratorProps> = ({
  onSaveDocument,
  onOpenViewer,
}) => {
  const [subject, setSubject] = useState('Matematika');
  const [phaseGrade, setPhaseGrade] = useState('Fase D (Kelas 7 - 9 SMP)');
  const [semester, setSemester] = useState('Ganjil');
  const [topic, setTopic] = useState('');
  const [learningObjectives, setLearningObjectives] = useState('');
  const [duration, setDuration] = useState('2 x 45 menit');
  const [model, setModel] = useState('Problem Based Learning (PBL)');

  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setErrorMsg('Harap masukkan materi atau topik utama.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setGeneratedResult(null);

    try {
      const promptText = buildModulAjarPrompt({
        subject,
        phaseGrade,
        semester,
        topic,
        learningObjectives: learningObjectives || 'Memahami konsep dasar dan penerapan dalam kehidupan sehari-hari',
        duration,
        model,
      });

      const res = await generateAiContent({ prompt: promptText });
      setGeneratedResult(res.text);
    } catch (err: any) {
      console.error('Error generating Modul Ajar:', err);
      setErrorMsg(err.message || 'Gagal membuat Modul Ajar. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDoc = () => {
    if (!generatedResult) return;
    const docTitle = `Modul Ajar - ${subject} ${phaseGrade}: ${topic}`;
    const newDoc: SavedDocument = {
      id: `doc-ma-${Date.now()}`,
      title: docTitle,
      docType: 'Modul Ajar',
      createdAt: new Date().toLocaleString('id-ID'),
      metadata: {
        subject,
        grade: phaseGrade,
        semester,
        topic,
        docType: 'Modul Ajar',
        tags: ['Kurikulum Merdeka', 'Modul Ajar', model],
      },
      content: generatedResult,
    };

    onSaveDocument(newDoc);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleOpenViewerLocal = () => {
    if (!generatedResult) return;
    const docTitle = `Modul Ajar - ${subject} ${phaseGrade}: ${topic}`;
    onOpenViewer({
      id: `doc-preview-${Date.now()}`,
      title: docTitle,
      docType: 'Modul Ajar',
      createdAt: new Date().toLocaleString('id-ID'),
      metadata: { subject, grade: phaseGrade, semester, topic, docType: 'Modul Ajar' },
      content: generatedResult,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>Generator Modul Ajar Kurikulum Merdeka</span>
        </div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Penyusun Modul Ajar Resmi Lintas Fase
        </h1>
        <p className="text-xs text-slate-600">
          Masukkan informasi mata pelajaran, fase/kelas, dan topik. AI akan menyusun Modul Ajar Kurikulum Merdeka lengkap dengan Informasi Umum, Komponen Inti, Pertanyaan Pemantik, Langkah Berdiferensiasi, Asesmen, dan Lampiran.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleGenerate} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Parameter Modul Ajar</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              id="ma-subject-select"
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
              value={phaseGrade}
              onChange={(e) => setPhaseGrade(e.target.value)}
              id="ma-phase-select"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {SCHOOL_FASES.map((f) => (
                <option key={f.code} value={f.description}>{f.description}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              id="ma-semester-select"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Ganjil">Semester Ganjil</option>
              <option value="Genap">Semester Genap</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Materi / Topik Utama *</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              id="ma-topic-input"
              placeholder="Contoh: Operasi Hitung Aljabar & Pemodelan Matrik"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Model Pembelajaran</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              id="ma-model-select"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Problem Based Learning (PBL)">Problem Based Learning (PBL)</option>
              <option value="Project Based Learning (PjBL)">Project Based Learning (PjBL)</option>
              <option value="Discovery / Inquiry Learning">Discovery / Inquiry Learning</option>
              <option value="Cooperative Learning & Discussion">Cooperative Learning & Discussion</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Tujuan Pembelajaran (TP) / Target Hasil (Opsional)</label>
          <textarea
            value={learningObjectives}
            onChange={(e) => setLearningObjectives(e.target.value)}
            id="ma-tp-textarea"
            placeholder="Contoh: Siswa dapat mengidentifikasi variabel dan menyelesaikan persamaan linear dalam kehidupan sehari-hari"
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
            id="ma-generate-btn"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyusun Modul Ajar AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Hasilkan Modul Ajar Lengkap</span>
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
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                Modul Ajar Kurikulum Merdeka
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                {subject} - {topic}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenViewerLocal}
                id="ma-view-full-btn"
                className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-lg"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Mode Cetak / Full</span>
              </button>

              <button
                onClick={handleSaveDoc}
                id="ma-save-repo-btn"
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
