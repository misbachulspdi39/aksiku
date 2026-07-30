import React, { useState } from 'react';
import { SavedDocument } from '../types';
import { buildSuratAdminPrompt } from '../prompts';
import { generateAiContent } from '../services/aiService';
import Markdown from 'react-markdown';
import { Mail, Sparkles, Loader2, BookmarkCheck, Printer } from 'lucide-react';

interface SuratAdministrasiPageProps {
  onSaveDocument: (doc: SavedDocument) => void;
  onOpenViewer: (doc: SavedDocument) => void;
}

export const SuratAdministrasiPage: React.FC<SuratAdministrasiPageProps> = ({
  onSaveDocument,
  onOpenViewer,
}) => {
  const [docType, setDocType] = useState<string>('Surat Tugas');
  const [schoolName, setSchoolName] = useState('SMP Negeri 1 EduAI');
  const [docDetails, setDocDetails] = useState('');

  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const docOptions = [
    'Surat Tugas',
    'Berita Acara Rapat / Pelaksanaan',
    'Surat Undangan Orang Tua / Rapat',
    'Notulen Rapat Guru & Kurikulum',
    'Program Tahunan (Prota)',
    'Program Semester (Promes)',
    'Jadwal Mengajar Terstruktur',
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docDetails.trim()) {
      setErrorMsg('Harap masukkan rincian/detail dokumen administrasi.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setGeneratedResult(null);

    try {
      const fullContext = `Satuan Pendidikan: ${schoolName}\nJenis Dokumen: ${docType}\nDetail / Perihal: ${docDetails}`;
      const promptText = buildSuratAdminPrompt(docType, fullContext);

      const res = await generateAiContent({ prompt: promptText });
      setGeneratedResult(res.text);
    } catch (err: any) {
      console.error('Error generating Surat/Admin:', err);
      setErrorMsg(err.message || 'Gagal membuat dokumen administrasi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDoc = () => {
    if (!generatedResult) return;
    const docTitle = `${docType} - ${schoolName}`;
    const newDoc: SavedDocument = {
      id: `doc-admin-${Date.now()}`,
      title: docTitle,
      docType: 'Surat & Administrasi',
      createdAt: new Date().toLocaleString('id-ID'),
      metadata: { topic: docType, docType: 'Surat & Administrasi' },
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
        <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
          <Mail className="w-4 h-4" />
          <span>Generator Surat & Administrasi Sekolah</span>
        </div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Penyusun Dokumen Legal Pedagogis & Administrasi
        </h1>
        <p className="text-xs text-slate-600">
          Buat surat tugas resmi, berita acara, undangan rapat orang tua, notulen, hingga susunan Program Tahunan (Prota) dan Program Semester (Promes) secara cepat dan siap cetak.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleGenerate} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Jenis Dokumen</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              id="admin-doctype-select"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 bg-white font-medium"
            >
              {docOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Satuan Pendidikan / Sekolah</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              id="admin-school-input"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Detail / Perihal Dokumen *</label>
          <textarea
            value={docDetails}
            onChange={(e) => setDocDetails(e.target.value)}
            id="admin-details-textarea"
            placeholder="Contoh: Menugaskan Bpk. Ahmad (NIP: 198203...) untuk mendampingi Olimpiade Sains Kabupaten pada tanggal 10 Agustus 2026 di SMA N 1"
            rows={4}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
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
            id="admin-generate-btn"
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyusun Dokumen Administrasi...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Hasilkan Dokumen {docType}</span>
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
              <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded">
                Dokumen Resmi Administrasi
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">{docType}</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  onOpenViewer({
                    id: `admin-${Date.now()}`,
                    title: `${docType} - ${schoolName}`,
                    docType: 'Surat & Administrasi',
                    createdAt: new Date().toLocaleString('id-ID'),
                    metadata: { docType: 'Surat & Administrasi' },
                    content: generatedResult,
                  })
                }
                id="admin-print-btn"
                className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-lg"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak / Simpan PDF</span>
              </button>

              <button
                onClick={handleSaveDoc}
                id="admin-save-btn"
                className={`flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-lg transition-colors ${
                  savedSuccess
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
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
