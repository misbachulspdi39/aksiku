import React, { useState } from 'react';
import { QuestionItem, RubricCriterion, SavedDocument } from '../types';
import { INDONESIAN_SUBJECTS, SCHOOL_FASES } from '../data/mockDefaults';
import { buildSoalPrompt, buildRubrikPrompt } from '../prompts';
import { generateAiContent } from '../services/aiService';
import { QuestionBankViewer } from '../components/QuestionBankViewer';
import Markdown from 'react-markdown';
import { HelpCircle, Sparkles, Loader2, BookmarkCheck, CheckCircle2 } from 'lucide-react';

interface SoalRubrikPageProps {
  onSaveDocument: (doc: SavedDocument) => void;
}

export const SoalRubrikPage: React.FC<SoalRubrikPageProps> = ({ onSaveDocument }) => {
  const [activeTab, setActiveTab] = useState<'soal' | 'rubrik'>('soal');

  // Soal States
  const [subject, setSubject] = useState('IPA (Ilmu Pengetahuan Alam)');
  const [grade, setGrade] = useState('Fase D (Kelas 7 - 9 SMP)');
  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [bloom, setBloom] = useState('C4 (Analisis) & C5 (Evaluasi)');
  const [difficulty, setDifficulty] = useState('Sedang - HOTS/AKM');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['Pilihan Ganda', 'Essay']);

  // Rubrik States
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');

  // Outputs
  const [generatedQuestions, setGeneratedQuestions] = useState<QuestionItem[] | null>(null);
  const [generatedRubric, setGeneratedRubric] = useState<RubricCriterion[] | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter((t) => t !== type));
      }
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleGenerateSoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setErrorMsg('Harap masukkan topik/materi evaluasi.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setGeneratedQuestions(null);

    try {
      const promptText = buildSoalPrompt({
        subject,
        grade,
        topic,
        questionTypes: selectedTypes,
        count: questionCount,
        bloomTaxonomy: bloom,
        difficulty,
      });

      const res = await generateAiContent({
        prompt: promptText,
        responseMimeType: 'application/json',
      });

      let questions: QuestionItem[] = [];
      if (res.json && Array.isArray(res.json)) {
        questions = res.json;
      } else {
        const cleanStr = res.text.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
        questions = JSON.parse(cleanStr);
      }

      setGeneratedQuestions(questions);
    } catch (err: any) {
      console.error('Error generating Bank Soal:', err);
      setErrorMsg(err.message || 'Gagal menghasilkan Bank Soal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateRubrik = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      setErrorMsg('Harap masukkan nama tugas/asesmen.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setGeneratedRubric(null);

    try {
      const promptText = buildRubrikPrompt({
        title: taskTitle,
        subject,
        taskDescription: taskDesc || 'Tugas kelompok unjuk kerja dan presentasi produk',
      });

      const res = await generateAiContent({
        prompt: promptText,
        responseMimeType: 'application/json',
      });

      let rubric: RubricCriterion[] = [];
      if (res.json && Array.isArray(res.json)) {
        rubric = res.json;
      } else {
        const cleanStr = res.text.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
        rubric = JSON.parse(cleanStr);
      }

      setGeneratedRubric(rubric);
    } catch (err: any) {
      console.error('Error generating Rubrik:', err);
      setErrorMsg(err.message || 'Gagal menghasilkan Rubrik. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSoalToRepo = () => {
    if (!generatedQuestions) return;
    const docTitle = `Bank Soal HOTS/AKM - ${subject}: ${topic}`;
    const newDoc: SavedDocument = {
      id: `doc-soal-${Date.now()}`,
      title: docTitle,
      docType: 'Bank Soal',
      createdAt: new Date().toLocaleString('id-ID'),
      metadata: { subject, grade, topic, docType: 'Bank Soal' },
      content: JSON.stringify(generatedQuestions, null, 2),
      rawJson: generatedQuestions,
    };

    onSaveDocument(newDoc);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveRubrikToRepo = () => {
    if (!generatedRubric) return;
    const docTitle = `Rubrik Penilaian - ${taskTitle}`;
    const formatted = generatedRubric
      .map(
        (r) =>
          `ASPEK: ${r.aspect} (${r.weight || '25%'})\n` +
          `- Sangat Baik (4): ${r.score4}\n` +
          `- Baik (3): ${r.score3}\n` +
          `- Cukup (2): ${r.score2}\n` +
          `- Perlu Bimbingan (1): ${r.score1}\n`
      )
      .join('\n---\n');

    const newDoc: SavedDocument = {
      id: `doc-rubrik-${Date.now()}`,
      title: docTitle,
      docType: 'Rubrik Penilaian',
      createdAt: new Date().toLocaleString('id-ID'),
      metadata: { subject, topic: taskTitle, docType: 'Rubrik Penilaian' },
      content: formatted,
      rawJson: generatedRubric,
    };

    onSaveDocument(newDoc);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Generator Soal & Rubrik Penilaian Autentik</span>
        </div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Asesmen Pembelajaran HOTS, AKM & Rubrik
        </h1>
        <p className="text-xs text-slate-600">
          Buat naskah soal evaluasi pembelajaran berkualitas tinggi (Pilihan Ganda, Essay, AKM, HOTS, Benar-Salah) beserta kunci jawaban & pembahasan, atau susun Rubrik Penilaian Kinerja kelompok.
        </p>

        {/* Toggle Mode */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => setActiveTab('soal')}
            id="soal-tab-soal-btn"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'soal'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Generator Bank Soal (HOTS & AKM)
          </button>
          <button
            onClick={() => setActiveTab('rubrik')}
            id="soal-tab-rubrik-btn"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'rubrik'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Generator Rubrik Penilaian Autentik
          </button>
        </div>
      </div>

      {/* Mode 1: Bank Soal */}
      {activeTab === 'soal' && (
        <form onSubmit={handleGenerateSoal} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                id="soal-subject-select"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 bg-white"
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
                id="soal-grade-select"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 bg-white"
              >
                {SCHOOL_FASES.map((f) => (
                  <option key={f.code} value={f.description}>{f.description}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Soal</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                id="soal-count-select"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value={3}>3 Nomor Soal</option>
                <option value={5}>5 Nomor Soal</option>
                <option value={10}>10 Nomor Soal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Topik / Materi Evaluasi *</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              id="soal-topic-input"
              placeholder="Contoh: Hukum Newton dan Penerapan Gerak Benda"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Question Type Checkboxes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Pilih Variasi Tipe Soal:</label>
            <div className="flex flex-wrap gap-2">
              {['Pilihan Ganda', 'Essay', 'Benar Salah', 'HOTS', 'AKM'].map((t) => {
                const isSelected = selectedTypes.includes(t);
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => handleToggleType(t)}
                    className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '} {t}
                  </button>
                );
              })}
            </div>
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
              id="soal-generate-btn"
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyusun Bank Soal...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Hasilkan Bank Soal & Kunci Jawaban</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Mode 2: Rubrik Penilaian */}
      {activeTab === 'rubrik' && (
        <form onSubmit={handleGenerateRubrik} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                id="rubrik-subject-select"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 bg-white"
              >
                {INDONESIAN_SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Tugas / Asesmen *</label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                id="rubrik-title-input"
                placeholder="Contoh: Laporan Eksperimen & Presentasi Infografis Kelompok"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Tugas Siswa</label>
            <textarea
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              id="rubrik-desc-textarea"
              placeholder="Contoh: Siswa bekerja secara berkelompok untuk meneliti dampak sampah plastik di lingkungan sekitar dan menyajikan hasilnya dalam poster digital"
              rows={3}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500"
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
              id="rubrik-generate-btn"
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyusun Rubrik Penilaian...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Hasilkan Rubrik Penilaian Autentik</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Question Output Viewer */}
      {generatedQuestions && activeTab === 'soal' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex justify-end">
            <button
              onClick={handleSaveSoalToRepo}
              id="soal-save-repo-btn"
              className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>{savedSuccess ? 'Tersimpan di Repository!' : 'Simpan Bank Soal Ke Repository'}</span>
            </button>
          </div>

          <QuestionBankViewer questions={generatedQuestions} title={`${subject}: ${topic}`} />
        </div>
      )}

      {/* Rubric Output Viewer */}
      {generatedRubric && activeTab === 'rubrik' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">
                Rubrik Penilaian Autentik
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">{taskTitle}</h2>
            </div>

            <button
              onClick={handleSaveRubrikToRepo}
              id="rubrik-save-repo-btn"
              className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>{savedSuccess ? 'Tersimpan!' : 'Simpan Rubrik Ke Repository'}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold">
                <tr>
                  <th className="p-2.5 border border-slate-200">Aspek & Bobot</th>
                  <th className="p-2.5 border border-slate-200 text-emerald-800 bg-emerald-50">Sangat Baik (Skor 4)</th>
                  <th className="p-2.5 border border-slate-200 text-blue-800 bg-blue-50">Baik (Skor 3)</th>
                  <th className="p-2.5 border border-slate-200 text-amber-800 bg-amber-50">Cukup (Skor 2)</th>
                  <th className="p-2.5 border border-slate-200 text-rose-800 bg-rose-50">Perlu Bimbingan (Skor 1)</th>
                </tr>
              </thead>
              <tbody>
                {generatedRubric.map((r, i) => (
                  <tr key={i} className="border border-slate-200 hover:bg-slate-50">
                    <td className="p-2.5 border border-slate-200 font-bold text-slate-900">
                      {r.aspect} <br />
                      <span className="text-[10px] text-slate-500 font-normal">{r.weight || '25%'}</span>
                    </td>
                    <td className="p-2.5 border border-slate-200 text-slate-700">{r.score4}</td>
                    <td className="p-2.5 border border-slate-200 text-slate-700">{r.score3}</td>
                    <td className="p-2.5 border border-slate-200 text-slate-700">{r.score2}</td>
                    <td className="p-2.5 border border-slate-200 text-slate-700">{r.score1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
