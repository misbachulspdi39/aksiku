import React, { useState } from 'react';
import { PptSlide, SavedDocument } from '../types';
import { INDONESIAN_SUBJECTS } from '../data/mockDefaults';
import { buildPptPrompt } from '../prompts';
import { generateAiContent } from '../services/aiService';
import { PptPreview } from '../components/PptPreview';
import { Presentation, Sparkles, Loader2, BookmarkCheck } from 'lucide-react';

interface PptGeneratorPageProps {
  onSaveDocument: (doc: SavedDocument) => void;
}

export const PptGeneratorPage: React.FC<PptGeneratorPageProps> = ({ onSaveDocument }) => {
  const [subject, setSubject] = useState('Bahasa Indonesia');
  const [topic, setTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('Siswa SMP (Kelas 7-9)');
  const [slideCount, setSlideCount] = useState<number>(6);

  const [generatedSlides, setGeneratedSlides] = useState<PptSlide[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setErrorMsg('Harap masukkan materi atau topik presentasi.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setGeneratedSlides(null);

    try {
      const promptText = buildPptPrompt({
        subject,
        topic,
        targetAudience,
        slideCount,
      });

      const res = await generateAiContent({
        prompt: promptText,
        responseMimeType: 'application/json',
      });

      let slides: PptSlide[] = [];
      if (res.json && Array.isArray(res.json)) {
        slides = res.json;
      } else {
        const cleanStr = res.text.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
        slides = JSON.parse(cleanStr);
      }

      setGeneratedSlides(slides);
    } catch (err: any) {
      console.error('Error generating PPT slides:', err);
      setErrorMsg(err.message || 'Gagal menghasilkan struktur PowerPoint. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDoc = () => {
    if (!generatedSlides) return;
    const docTitle = `Presentation Slide Deck - ${subject}: ${topic}`;
    const formattedContent = generatedSlides
      .map(
        (s) =>
          `SLIDE ${s.slideNumber}: ${s.title}\n` +
          (s.subtitle ? `Subjudul: ${s.subtitle}\n` : '') +
          `Poin-poin:\n${s.bulletPoints.map((b) => `- ${b}`).join('\n')}\n` +
          (s.speakerNotes ? `Catatan Guru: ${s.speakerNotes}\n` : '')
      )
      .join('\n---\n');

    const newDoc: SavedDocument = {
      id: `doc-ppt-${Date.now()}`,
      title: docTitle,
      docType: 'PowerPoint',
      createdAt: new Date().toLocaleString('id-ID'),
      metadata: { subject, topic, docType: 'PowerPoint' },
      content: formattedContent,
      rawJson: generatedSlides,
    };

    onSaveDocument(newDoc);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-wider">
          <Presentation className="w-4 h-4" />
          <span>Generator Slide PowerPoint (PPT)</span>
        </div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Penyusun Presentasi Pembelajaran Interaktif
        </h1>
        <p className="text-xs text-slate-600">
          AI menyusun kerangka slide presentasi kelas lengkap dengan poin materi ringkas, ide visual, dan Catatan Guru (Speaker Notes) saat menyajikan slide.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleGenerate} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              id="ppt-subject-select"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 bg-white"
            >
              {INDONESIAN_SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Siswa</label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              id="ppt-target-select"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 bg-white"
            >
              <option value="Siswa SD (Fase A-C)">Siswa SD (Fase A-C)</option>
              <option value="Siswa SMP (Kelas 7-9)">Siswa SMP (Kelas 7-9)</option>
              <option value="Siswa SMA/SMK (Kelas 10-12)">Siswa SMA/SMK (Kelas 10-12)</option>
              <option value="Siswa SDLB (SD Luar Biasa)">Siswa SDLB (SD Luar Biasa)</option>
              <option value="Siswa SMPLB (SMP Luar Biasa)">Siswa SMPLB (SMP Luar Biasa)</option>
              <option value="Siswa SMALB (SMA Luar Biasa)">Siswa SMALB (SMA Luar Biasa)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Slide</label>
            <select
              value={slideCount}
              onChange={(e) => setSlideCount(Number(e.target.value))}
              id="ppt-count-select"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 bg-white"
            >
              <option value={4}>4 Slide (Singkat)</option>
              <option value={6}>6 Slide (Standar 1 Pertemuan)</option>
              <option value={8}>8 Slide (Mendalam)</option>
              <option value={10}>10 Slide (Lengkap dengan Kuis)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Topik Presentasi *</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            id="ppt-topic-input"
            placeholder="Contoh: Teks Laporan Hasil Observasi (LHO) - Struktur & Kaidah Bahasa"
            className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500"
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
            id="ppt-generate-btn"
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyusun Slide PPT...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Hasilkan Presentation Suite</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Slide Preview Output */}
      {generatedSlides && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex justify-end">
            <button
              onClick={handleSaveDoc}
              id="ppt-save-repo-btn"
              className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-orange-600 hover:bg-orange-700 text-white'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>{savedSuccess ? 'Tersimpan di Repository!' : 'Simpan Presentation Ke Repository'}</span>
            </button>
          </div>

          <PptPreview slides={generatedSlides} topicTitle={`${subject}: ${topic}`} />
        </div>
      )}
    </div>
  );
};
