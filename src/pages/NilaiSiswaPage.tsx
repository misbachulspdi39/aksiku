import React, { useState } from 'react';
import { SavedDocument } from '../types';
import { SAMPLE_STUDENT_SCORES, INDONESIAN_SUBJECTS } from '../data/mockDefaults';
import { buildDeskripsiNilaiPrompt, buildAnalisisNilaiPrompt, buildAnalisisSiswaPrompt } from '../prompts';
import { generateAiContent } from '../services/aiService';
import Markdown from 'react-markdown';
import { BarChart3, Sparkles, Loader2, BookmarkCheck, Users, Award, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface NilaiSiswaPageProps {
  onSaveDocument: (doc: SavedDocument) => void;
}

export const NilaiSiswaPage: React.FC<NilaiSiswaPageProps> = ({ onSaveDocument }) => {
  const [activeTab, setActiveTab] = useState<'rapor' | 'analisis-kelas' | 'analisis-siswa'>('rapor');

  const [subject, setSubject] = useState('Matematika');
  const [className, setClassName] = useState('Kelas VIII-A');
  const [studentScores, setStudentScores] = useState(SAMPLE_STUDENT_SCORES);

  // Single Student Analysis State
  const [selectedStudent, setSelectedStudent] = useState(SAMPLE_STUDENT_SCORES[0].name);
  const [studentNotesInput, setStudentNotesInput] = useState(
    'Siswa sangat aktif dalam diskusi kelompok matematika, namun sering terburu-buru dalam mengerjakan soal hitungan aljabar.'
  );

  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Calculate quick stats from sample dataset
  const totalStudents = studentScores.length;
  const avgScore = (
    studentScores.reduce((acc, curr) => acc + curr.finalScore, 0) / totalStudents
  ).toFixed(1);
  const maxScore = Math.max(...studentScores.map((s) => s.finalScore));
  const minScore = Math.min(...studentScores.map((s) => s.finalScore));

  const handleGenerateRapor = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    setGeneratedResult(null);

    try {
      const promptText = buildDeskripsiNilaiPrompt(
        studentScores.map((s) => ({
          name: s.name,
          score: s.finalScore,
          topicStrengths: s.topicStrengths,
          topicWeaknesses: s.topicWeaknesses,
        })),
        subject
      );

      const res = await generateAiContent({ prompt: promptText });
      setGeneratedResult(res.text);
    } catch (err: any) {
      console.error('Error generating Deskripsi Rapor:', err);
      setErrorMsg(err.message || 'Gagal membuat deskripsi rapor. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateClassAnalysis = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    setGeneratedResult(null);

    try {
      const rawScoresText = studentScores
        .map((s) => `${s.name}: Nilai Akhir=${s.finalScore}, Catatan=${s.topicStrengths || ''} / ${s.topicWeaknesses || ''}`)
        .join('\n');

      const promptText = buildAnalisisNilaiPrompt({
        subject,
        className,
        rawScores: rawScoresText,
      });

      const res = await generateAiContent({ prompt: promptText });
      setGeneratedResult(res.text);
    } catch (err: any) {
      console.error('Error generating Class Analysis:', err);
      setErrorMsg(err.message || 'Gagal membuat analisis kelas. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateStudentAnalysis = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    setGeneratedResult(null);

    try {
      const promptText = buildAnalisisSiswaPrompt({
        name: selectedStudent,
        grade: className,
        notes: studentNotesInput,
      });

      const res = await generateAiContent({ prompt: promptText });
      setGeneratedResult(res.text);
    } catch (err: any) {
      console.error('Error generating Student Analysis:', err);
      setErrorMsg(err.message || 'Gagal membuat analisis siswa. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToRepo = () => {
    if (!generatedResult) return;
    const docTypeLabel =
      activeTab === 'rapor'
        ? 'Deskripsi Nilai'
        : activeTab === 'analisis-kelas'
        ? 'Analisis Nilai'
        : 'Analisis Siswa';

    const docTitle = `${docTypeLabel} - ${subject} (${className})`;
    const newDoc: SavedDocument = {
      id: `doc-nilai-${Date.now()}`,
      title: docTitle,
      docType: docTypeLabel as any,
      createdAt: new Date().toLocaleString('id-ID'),
      metadata: { subject, grade: className, docType: docTypeLabel as any },
      content: generatedResult,
    };

    onSaveDocument(newDoc);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-wider">
          <BarChart3 className="w-4 h-4" />
          <span>Analisis Nilai & Deskripsi Rapor Kurikulum Merdeka</span>
        </div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Olah Nilai Siswa & Narasi Rapor Otomatis
        </h1>
        <p className="text-xs text-slate-600">
          Ubah angka nilai siswa menjadi kalimat narasi capaian rapor yang konstruktif, buat analisis statistik ketuntasan kelas, dan peroleh rekomendasi remedial/pengayaan bagi wali kelas.
        </p>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => {
              setActiveTab('rapor');
              setGeneratedResult(null);
            }}
            id="nilai-tab-rapor-btn"
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'rapor'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Deskripsi Rapor Otomatis
          </button>
          <button
            onClick={() => {
              setActiveTab('analisis-kelas');
              setGeneratedResult(null);
            }}
            id="nilai-tab-kelas-btn"
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'analisis-kelas'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Analisis Nilai & Remedial Kelas
          </button>
          <button
            onClick={() => {
              setActiveTab('analisis-siswa');
              setGeneratedResult(null);
            }}
            id="nilai-tab-siswa-btn"
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'analisis-siswa'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Analisis Profil Siswa (Wali Kelas)
          </button>
        </div>
      </div>

      {/* Class Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-medium">Jumlah Siswa</p>
            <p className="text-base font-extrabold text-slate-900">{totalStudents} Siswa</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-medium">Rata-Rata Kelas</p>
            <p className="text-base font-extrabold text-slate-900">{avgScore}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-medium">Nilai Tertinggi</p>
            <p className="text-base font-extrabold text-emerald-700">{maxScore}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-medium">Nilai Terendah</p>
            <p className="text-base font-extrabold text-rose-700">{minScore}</p>
          </div>
        </div>
      </div>

      {/* Dataset Preview & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Data Nilai Siswa {className} ({subject})
          </h2>

          <div className="flex items-center gap-2 text-xs">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              id="nilai-subject-select"
              className="p-1.5 rounded-lg border border-slate-300 bg-white font-medium"
            >
              {INDONESIAN_SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              id="nilai-class-select"
              className="p-1.5 rounded-lg border border-slate-300 bg-white font-medium"
            >
              <option value="Kelas VII-A">Kelas VII-A</option>
              <option value="Kelas VIII-A">Kelas VIII-A</option>
              <option value="Kelas IX-B">Kelas IX-B</option>
              <option value="Kelas X-1">Kelas X-1</option>
            </select>
          </div>
        </div>

        {/* Student Score Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse border border-slate-200">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
              <tr>
                <th className="p-2 border border-slate-200">No</th>
                <th className="p-2 border border-slate-200">Nama Siswa</th>
                <th className="p-2 border border-slate-200">Formatif</th>
                <th className="p-2 border border-slate-200">Sumatif</th>
                <th className="p-2 border border-slate-200">Nilai Akhir</th>
                <th className="p-2 border border-slate-200">Capaian Unggul & Bimbingan</th>
              </tr>
            </thead>
            <tbody>
              {studentScores.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="p-2 border border-slate-200 text-center font-bold">{idx + 1}</td>
                  <td className="p-2 border border-slate-200 font-bold text-slate-900">{s.name}</td>
                  <td className="p-2 border border-slate-200">{s.formatifScore}</td>
                  <td className="p-2 border border-slate-200">{s.sumatifScore}</td>
                  <td className={`p-2 border border-slate-200 font-extrabold ${s.finalScore >= 75 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {s.finalScore}
                  </td>
                  <td className="p-2 border border-slate-200 text-[11px] text-slate-600">
                    <span className="text-emerald-800 font-medium">+ {s.topicStrengths}</span> <br/>
                    <span className="text-rose-800 font-medium">- {s.topicWeaknesses}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Generate Action Buttons depending on Tab */}
        <div className="flex justify-end pt-2">
          {activeTab === 'rapor' && (
            <button
              onClick={handleGenerateRapor}
              disabled={isLoading}
              id="nilai-generate-rapor-btn"
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Hasilkan Deskripsi Rapor Kurikulum Merdeka</span>
            </button>
          )}

          {activeTab === 'analisis-kelas' && (
            <button
              onClick={handleGenerateClassAnalysis}
              disabled={isLoading}
              id="nilai-generate-kelas-btn"
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Analisis Kompetensi & Strategi Remedial Kelas</span>
            </button>
          )}

          {activeTab === 'analisis-siswa' && (
            <div className="w-full space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Siswa</label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    id="nilai-student-select"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    {studentScores.map((s) => (
                      <option key={s.id} value={s.name}>{s.name} (Nilai: {s.finalScore})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Pengamatan Wali Kelas</label>
                  <input
                    type="text"
                    value={studentNotesInput}
                    onChange={(e) => setStudentNotesInput(e.target.value)}
                    id="nilai-student-notes-input"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleGenerateStudentAnalysis}
                  disabled={isLoading}
                  id="nilai-generate-siswa-btn"
                  className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Analisis Profil & Rekomendasi Siswa Ini</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Generated Result Output */}
      {generatedResult && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded">
                Hasil Analisis AI
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                {activeTab === 'rapor'
                  ? 'Deskripsi Capaian Rapor'
                  : activeTab === 'analisis-kelas'
                  ? 'Analisis Ketuntasan & Remedial Kelas'
                  : `Analisis Profil Siswa: ${selectedStudent}`}
              </h2>
            </div>

            <button
              onClick={handleSaveToRepo}
              id="nilai-save-repo-btn"
              className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>{savedSuccess ? 'Tersimpan!' : 'Simpan Ke Repository'}</span>
            </button>
          </div>

          <div className="markdown-body prose prose-slate max-w-none text-xs sm:text-sm p-4 bg-slate-50/50 rounded-xl border border-slate-200/80">
            <Markdown>{generatedResult}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
};
