import React, { useState } from 'react';
import { SavedDocument, WorkflowResult, WorkflowStepState } from '../types';
import { runBatchSuperWorkflow } from '../services/aiService';
import { buildSuperWorkflowPrompt } from '../prompts';
import { PptPreview } from '../components/PptPreview';
import { QuestionBankViewer } from '../components/QuestionBankViewer';
import Markdown from 'react-markdown';
import {
  Layers,
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  Loader2,
  BookOpen,
  Presentation,
  HelpCircle,
  BarChart,
  Lightbulb,
  BookmarkCheck,
  Copy,
  Check,
  Printer,
  Download,
} from 'lucide-react';

interface WorkflowPageProps {
  onSaveDocument: (doc: SavedDocument) => void;
}

export const WorkflowPage: React.FC<WorkflowPageProps> = ({ onSaveDocument }) => {
  const [topicInput, setTopicInput] = useState('');
  const [selectedPdfName, setSelectedPdfName] = useState<string | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('application/pdf');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [activeStepId, setActiveStepId] = useState<number>(0);
  const [workflowResult, setWorkflowResult] = useState<WorkflowResult | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<
    'ringkasan' | 'modul-ajar' | 'lkpd' | 'ppt' | 'soal' | 'rubrik' | 'rapor' | 'aktivitas'
  >('modul-ajar');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedTab, setCopiedTab] = useState(false);

  const workflowSteps: WorkflowStepState[] = [
    { id: 1, label: 'Membaca & Analisis PDF/Materi', key: 'summary', description: 'Ekstraksi konsep & poin penting', status: activeStepId > 1 ? 'completed' : activeStepId === 1 ? 'processing' : 'pending' },
    { id: 2, label: 'Merangkum Pembelajaran', key: 'summary', description: 'Sintesis poin esensial', status: activeStepId > 2 ? 'completed' : activeStepId === 2 ? 'processing' : 'pending' },
    { id: 3, label: 'Membuat Modul Ajar', key: 'modulAjar', description: 'Kurikulum Merdeka Lintas Fase', status: activeStepId > 3 ? 'completed' : activeStepId === 3 ? 'processing' : 'pending' },
    { id: 4, label: 'Membuat LKPD Siswa', key: 'lkpd', description: 'Studi kasus & tugas kelompok', status: activeStepId > 4 ? 'completed' : activeStepId === 4 ? 'processing' : 'pending' },
    { id: 5, label: 'Membuat Slide PPT', key: 'pptSlides', description: 'Struktur presentasi interaktif', status: activeStepId > 5 ? 'completed' : activeStepId === 5 ? 'processing' : 'pending' },
    { id: 6, label: 'Membuat Bank Soal HOTS/AKM', key: 'questions', description: 'Pilihan ganda, essay & kunci', status: activeStepId > 6 ? 'completed' : activeStepId === 6 ? 'processing' : 'pending' },
    { id: 7, label: 'Membuat Rubrik Penilaian', key: 'rubric', description: 'Kriteria Skor 1-4', status: activeStepId > 7 ? 'completed' : activeStepId === 7 ? 'processing' : 'pending' },
    { id: 8, label: 'Membuat Analisis Nilai', key: 'gradeAnalysisExample', description: 'Saran remedial & pengayaan', status: activeStepId > 8 ? 'completed' : activeStepId === 8 ? 'processing' : 'pending' },
    { id: 9, label: 'Membuat Deskripsi Rapor', key: 'raporDescriptionExample', description: 'Kalimat narasi Kurikulum Merdeka', status: activeStepId > 9 ? 'completed' : activeStepId === 9 ? 'processing' : 'pending' },
    { id: 10, label: 'Ide Aktivitas Berdiferensiasi', key: 'classroomActivities', description: 'Metode PjBL & ice breaking', status: activeStepId >= 10 ? 'completed' : activeStepId === 10 ? 'processing' : 'pending' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPdfName(file.name);
      setMimeType(file.type || 'application/pdf');
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        // Strip data:application/pdf;base64, header
        const base64Data = result.split(',')[1] || result;
        setPdfBase64(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetTopic = (topic: string) => {
    setTopicInput(topic);
    setSelectedPdfName(null);
    setPdfBase64(null);
  };

  const handleStartWorkflow = async () => {
    if (!topicInput && !pdfBase64) {
      setErrorMsg('Harap masukkan topik/materi pembelajaran atau unggah berkas PDF.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setWorkflowResult(null);
    setActiveStepId(1);

    // Simulate animated step transitions for realistic UX feedback
    const stepInterval = setInterval(() => {
      setActiveStepId((prev) => (prev < 9 ? prev + 1 : prev));
    }, 1200);

    try {
      const promptText = buildSuperWorkflowPrompt(
        topicInput || `Materi dari berkas PDF: ${selectedPdfName}`
      );

      const result = await runBatchSuperWorkflow({
        prompt: promptText,
        pdfBase64: pdfBase64 || undefined,
        mimeType: pdfBase64 ? mimeType : undefined,
      });

      clearInterval(stepInterval);
      setActiveStepId(10);
      setWorkflowResult(result);
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Workflow execution error:', err);
      setErrorMsg(err.message || 'Gagal memproses Workflow AI. Silakan periksa koneksi atau coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePackageToRepo = () => {
    if (!workflowResult) return;

    const newDoc: SavedDocument = {
      id: `doc-wf-${Date.now()}`,
      title: `Paket AI Workflow: ${workflowResult.fileOrTopicTitle || topicInput || 'Materi Pembelajaran'}`,
      docType: 'Super Workflow Package',
      createdAt: new Date().toLocaleString('id-ID'),
      metadata: {
        topic: workflowResult.fileOrTopicTitle,
        tags: ['Workflow AI 10-in-1', 'Kurikulum Merdeka', 'Paket Lengkap'],
        docType: 'Super Workflow Package',
      },
      content: `# PAKET PERENCANAAN PEMBELAJARAN WORKFLOW AI
**Topik/Materi**: ${workflowResult.fileOrTopicTitle}

---
## 1. RINGKASAN MATERI
${workflowResult.summary}

---
## 2. MODUL AJAR KURIKULUM MERDEKA
${workflowResult.modulAjar}

---
## 3. LEMBAR KERJA PESERTA DIDIK (LKPD)
${workflowResult.lkpd}

---
## 4. IDE AKTIVITAS KELAS BERDIFERENSIASI
${workflowResult.classroomActivities.map((a, i) => `${i + 1}. ${a}`).join('\n')}
`,
    };

    onSaveDocument(newDoc);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopyCurrentTab = () => {
    if (!workflowResult) return;
    let textToCopy = '';
    if (activeResultTab === 'modul-ajar') textToCopy = workflowResult.modulAjar;
    else if (activeResultTab === 'lkpd') textToCopy = workflowResult.lkpd;
    else if (activeResultTab === 'ringkasan') textToCopy = workflowResult.summary;
    else if (activeResultTab === 'aktivitas') textToCopy = workflowResult.classroomActivities.join('\n');
    else if (activeResultTab === 'rapor') textToCopy = `${workflowResult.gradeAnalysisExample}\n\n${workflowResult.raporDescriptionExample}`;

    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedTab(true);
      setTimeout(() => setCopiedTab(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Workflow AI Super Generator 10-in-1</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Otomatisasi Pembelajaran Dari 1 Berkas Materi
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          Cukup unggah satu berkas PDF materi pembelajaran atau masukkan topik, lalu klik jalankan. AI akan secara otomatis menghasilkan seluruh 10 kebutuhan dokumen & media pengajaran Kurikulum Merdeka secara simultan!
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Langkah 1: Masukkan Materi / Unggah File PDF</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* File Upload Zone */}
          <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative">
            <input
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileUpload}
              id="workflow-file-input"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            {selectedPdfName ? (
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block">
                  ✓ Berkas Dipilih: {selectedPdfName}
                </span>
                <p className="text-[11px] text-slate-500">Klik untuk mengganti berkas PDF</p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-bold text-slate-800">Unggah File PDF Materi</p>
                <p className="text-[11px] text-slate-500 mt-1">Seret file ke sini atau klik untuk mencari file PDF dari laptop/HP Anda</p>
              </div>
            )}
          </div>

          {/* Text Input / Preset Area */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800">Atau Masukkan Topik / Rangkuman Manual:</label>
            <textarea
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              id="workflow-topic-textarea"
              placeholder="Contoh: Sistem Pencernaan Manusia (Nutrisi, organ pencernaan utama, pencernaan mekanis & kimiawi, gangguan pencernaan)"
              rows={4}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
            />

            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-500 font-medium">Contoh Topik Cepat (Klik untuk uji coba):</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Sistem Pencernaan Manusia (IPA kelas 8)',
                  'Persamaan Linear Satu Variabel (Matematika Kelas 7)',
                  'Nilai Pancasila dalam Kehidupan (PPKn kelas 10)',
                  'Ekosistem & Rantai Makanan (IPA kelas 5)',
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetTopic(preset)}
                    className="text-[10px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-medium px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleStartWorkflow}
            disabled={isLoading}
            id="workflow-start-btn"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:opacity-95 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI Sedang Memproses 10 Alur...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Jalankan Super Workflow AI (10-in-1)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Workflow Execution Stepper Status */}
      {(isLoading || workflowResult) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 animate-in fade-in">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
            <span>Status Alur Pengerjaan AI (10 Tahapan)</span>
            {workflowResult && (
              <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Seluruh 10 Alur Selesai!
              </span>
            )}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {workflowSteps.map((step) => (
              <div
                key={step.id}
                className={`p-2.5 rounded-xl border text-xs transition-all ${
                  step.status === 'completed'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : step.status === 'processing'
                    ? 'bg-blue-50 border-blue-300 text-blue-900 animate-pulse font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1">
                  <span>{step.id}. {step.label}</span>
                  {step.status === 'completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  ) : step.status === 'processing' ? (
                    <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin flex-shrink-0" />
                  ) : null}
                </div>
                <p className="text-[10px] opacity-80 line-clamp-1">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generated Workflow Suite Results */}
      {workflowResult && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header Action */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-extrabold bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase tracking-wider">
                Hasil Super Workflow AI
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                {workflowResult.fileOrTopicTitle || 'Dokumen Perencanaan Pembelajaran Lengkap'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCurrentTab}
                id="workflow-copy-tab-btn"
                className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-2 rounded-xl"
              >
                {copiedTab ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTab ? 'Tersalin' : 'Salin Tab Ini'}</span>
              </button>

              <button
                onClick={handleSavePackageToRepo}
                id="workflow-save-all-btn"
                className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm ${
                  savedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>{savedSuccess ? 'Tersimpan di Repository!' : 'Simpan Semua Dokumen Ke Repository'}</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 pb-1 text-xs">
            {[
              { id: 'modul-ajar', label: 'Modul Ajar', icon: FileText },
              { id: 'lkpd', label: 'LKPD Siswa', icon: BookOpen },
              { id: 'ppt', label: 'Slide PPT', icon: Presentation },
              { id: 'soal', label: 'Soal HOTS/AKM', icon: HelpCircle },
              { id: 'rubrik', label: 'Rubrik Penilaian', icon: CheckCircle2 },
              { id: 'rapor', label: 'Analisis & Rapor', icon: BarChart },
              { id: 'aktivitas', label: 'Ide Aktivitas', icon: Lightbulb },
              { id: 'ringkasan', label: 'Rangkuman Materi', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeResultTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveResultTab(tab.id as any)}
                  id={`workflow-result-tab-${tab.id}`}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Content Area */}
          <div className="pt-2">
            {activeResultTab === 'modul-ajar' && (
              <div className="markdown-body prose prose-slate max-w-none text-xs sm:text-sm">
                <Markdown>{workflowResult.modulAjar}</Markdown>
              </div>
            )}

            {activeResultTab === 'lkpd' && (
              <div className="markdown-body prose prose-slate max-w-none text-xs sm:text-sm">
                <Markdown>{workflowResult.lkpd}</Markdown>
              </div>
            )}

            {activeResultTab === 'ppt' && (
              <PptPreview slides={workflowResult.pptSlides} topicTitle={workflowResult.fileOrTopicTitle} />
            )}

            {activeResultTab === 'soal' && (
              <QuestionBankViewer questions={workflowResult.questions} title={workflowResult.fileOrTopicTitle} />
            )}

            {activeResultTab === 'rubrik' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">Rubrik Penilaian Autentik</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse border border-slate-200">
                    <thead className="bg-slate-100 text-slate-700 uppercase font-bold">
                      <tr>
                        <th className="p-2.5 border border-slate-200">Aspek & Bobot</th>
                        <th className="p-2.5 border border-slate-200 text-emerald-800 bg-emerald-50/50">Sangat Baik (Skor 4)</th>
                        <th className="p-2.5 border border-slate-200 text-blue-800 bg-blue-50/50">Baik (Skor 3)</th>
                        <th className="p-2.5 border border-slate-200 text-amber-800 bg-amber-50/50">Cukup (Skor 2)</th>
                        <th className="p-2.5 border border-slate-200 text-rose-800 bg-rose-50/50">Perlu Bimbingan (Skor 1)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workflowResult.rubric?.map((r, i) => (
                        <tr key={i} className="border border-slate-200 hover:bg-slate-50">
                          <td className="p-2.5 border border-slate-200 font-bold text-slate-900">
                            {r.aspect} <br/> <span className="text-[10px] text-slate-500 font-normal">{r.weight}</span>
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

            {activeResultTab === 'rapor' && (
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 space-y-1">
                  <h4 className="font-bold text-blue-950">Analisis Hasil Belajar & Saran Remedial</h4>
                  <p className="leading-relaxed">{workflowResult.gradeAnalysisExample}</p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                  <h4 className="font-bold text-emerald-950">Contoh Kalimat Deskripsi Rapor Kurikulum Merdeka</h4>
                  <p className="leading-relaxed">{workflowResult.raporDescriptionExample}</p>
                </div>
              </div>
            )}

            {activeResultTab === 'aktivitas' && (
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">Rekomendasi Ide Aktivitas Kelas Berdiferensiasi</h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {workflowResult.classroomActivities?.map((act, i) => (
                    <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3 text-xs text-slate-800">
                      <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </div>
                      <p className="leading-relaxed font-medium">{act}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeResultTab === 'ringkasan' && (
              <div className="markdown-body prose prose-slate max-w-none text-xs sm:text-sm">
                <Markdown>{workflowResult.summary}</Markdown>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
