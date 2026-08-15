import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { generateAiContent } from '../services/aiService';
import { SavedDocument } from '../types';
import {
  FileText,
  Sparkles,
  Loader2,
  Save,
  Check,
  Copy,
  Printer,
  BookOpen,
  Heart
} from 'lucide-react';

interface LkpdMateriPageProps {
  onSaveDocument?: (doc: SavedDocument) => void;
}

export const LkpdMateriPage: React.FC<LkpdMateriPageProps> = ({ onSaveDocument }) => {
  const [topic, setTopic] = useState('Mengenal Anggota Tubuh & Kebersihan Diri');
  const [gradeClass, setGradeClass] = useState('SLB - Tunagrahita (Hambatan Intelektual)');
  const [lkpdType, setLkpdType] = useState('LKPD Praktikum & Eksperimen');
  const [subject, setSubject] = useState('Program Kebutuhan Khusus (Bina Diri)');

  // Initial Content Default Ramah SLB
  const initialText = `# Lembar Kerja Peserta Didik (LKPD) Kebutuhan Khusus / SLB\n` +
    `## Mata Pelajaran: Program Kebutuhan Khusus (Bina Diri)\n` +
    `## Sasaran: SLB / Peserta Didik Berkebutuhan Khusus (PDBK)\n\n` +
    `### Judul Aktivitas: Latihan Mencuci Tangan dengan Enam Langkah Benar\n\n` +
    `### Tujuan Pembelajaran\n` +
    `Peserta didik dapat mempraktikkan langkah-langkah mencuci tangan menggunakan sabun secara mandiri atau dengan bimbingan minimal.\n\n` +
    `### Petunjuk Pendampingan Guru / Orang Tua\n` +
    `1. Gunakan instruksi singkat, jelas, dan ulangi contoh gerakan secara visual.\n` +
    `2. Berikan pujian (verbal/gestur) pada setiap langkah yang berhasil dilakukan siswa.\n\n` +
    `### Langkah Aktivitas Visual\n` +
    `- [ ] **Langkah 1**: Basahi kedua tangan dengan air mengalir.\n` +
    `- [ ] **Langkah 2**: Tuangkan sabun secukupnya ke telapak tangan.\n` +
    `- [ ] **Langkah 3**: Gosok telapak tangan dan punggung tangan bergantian.\n` +
    `- [ ] **Langkah 4**: Bilas dengan air bersih sampai busa hilang.\n` +
    `- [ ] **Langkah 5**: Keringkan tangan menggunakan lap bersih atau tisu.\n\n` +
    `### Lembar Cecklist Evaluasi Mandiri Siswa\n` +
    `| No | Kegiatan | Ceklist (😊 Bisa / 🤝 Dibantu) |\n` +
    `|---|---|---|\n` +
    `| 1 | Membuka kran air sendiri | [ ] |\n` +
    `| 2 | Menggunakan sabun secukupnya | [ ] |\n` +
    `| 3 | Menggosok tangan hingga bersih | [ ] |\n`;

  const [result, setResult] = useState<string>(initialText);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Fungsi Generate LKPD via AI
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);

    try {
      const prompt = `
Buatkan dokumen ${lkpdType} yang interaktif, aplikatif, dan siap cetak.
- Mata Pelajaran / Program: ${subject}
- Topik / Materi: ${topic}
- Kelas / Sasaran Kekhususan: ${gradeClass}

CATATAN PENTING UNTUK INKLUSIF / SLB:
Jika sasaran adalah SLB / Peserta Didik Berkebutuhan Khusus (PDBK), gunakan bahasa yang sangat mudah dipahami, langkah-langkah kerja yang konkrit, instruksi yang ramah visual/sederhana, serta sediakan panduan untuk guru pendamping/orang tua.

Sajikan dalam format Markdown rapi yang mencakup:
1. Judul Aktivitas & Identitas (Mata Pelajaran/Program, Sasaran Kekhususan, Alokasi Waktu)
2. Tujuan Pembelajaran Inklusif
3. Petunjuk Pendampingan Guru / Orang Tua
4. Aktivitas Utama / Langkah Kerja Sederhana & Konkrit
5. Lembar Ceklist / Tabel Evaluasi Sederhana
`;

      const response = await generateAiContent({ prompt });
      const rawText = typeof response === 'string' ? response : response.text;
      setResult(rawText);
    } catch (error) {
      console.error('Gagal generate LKPD:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi Copy ke Clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Fungsi Simpan ke Repository
  const handleSave = () => {
    if (!onSaveDocument || !result) return;

    onSaveDocument({
      id: Date.now().toString(),
      title: `${lkpdType} - ${topic} (${gradeClass})`,
      type: 'LKPD & Materi',
      content: result,
      createdAt: new Date().toISOString(),
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Fungsi Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 font-sans text-slate-800 antialiased">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-800 text-white p-6 rounded-3xl shadow-lg space-y-2">
        <div className="flex items-center gap-2 text-indigo-200 font-extrabold text-xs uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Lembar Kerja Peserta Didik & Bahan Ajar (Inklusif & SLB Friendly)</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
          <span>Generator LKPD & Materi Interaktif</span>
          <Heart className="w-6 h-6 text-rose-300 fill-rose-300 inline" />
        </h1>
        <p className="text-xs md:text-sm text-indigo-100 max-w-2xl leading-relaxed font-medium">
          Buat LKPD Kurikulum Merdeka untuk Sekolah Reguler maupun Sekolah Luar Biasa (SLB) yang adaptif, siap cetak, dan ramah anak.
        </p>
      </div>

      {/* Form Generator Input */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            
            {/* Dropdown / Input Mata Pelajaran (Termasuk SLB) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mata Pelajaran / Program
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold bg-white text-slate-800"
              >
                <optgroup label="-- PROGRAM KHUSUS SLB --">
                  <option value="Program Kebutuhan Khusus (Bina Diri)">SLB: Bina Diri (Merawat Diri)</option>
                  <option value="Program Kebutuhan Khusus (Bina Persepsi Bunyi & Irama)">SLB: Bina Persepsi Bunyi & Irama (Tunarungu)</option>
                  <option value="Program Kebutuhan Khusus (Bina Diri & Gerak)">SLB: Bina Diri & Gerak (Tunadaksa)</option>
                  <option value="Program Kebutuhan Khusus (Bina Adaptasi Sosial)">SLB: Bina Adaptasi Sosial (Autisme)</option>
                  <option value="Keterampilan Vokasional SLB">SLB: Keterampilan Vokasional</option>
                  <option value="Keaksaraan Dasar & Numerasi SLB">SLB: Keaksaraan & Numerasi Dasar</option>
                </optgroup>
                <optgroup label="-- MATA PELAJARAN UMUM --">
                  <option value="IPA">IPA (Sains)</option>
                  <option value="IPS">IPS (Sosial)</option>
                  <option value="Matematika">Matematika</option>
                  <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                  <option value="Bahasa Inggris">Bahasa Inggris</option>
                  <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
                  <option value="Informatika">Informatika</option>
                  <option value="Pendidikan Agama & Budi Pekerti">Pendidikan Agama</option>
                  <option value="Seni Budaya & Prakarya">Seni Budaya & Prakarya</option>
                  <option value="PJOK">PJOK</option>
                </optgroup>
              </select>
            </div>

            {/* Input Topik / Materi */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Topik / Materi LKPD *
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Contoh: Merawat Kebersihan Tangan"
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
              />
            </div>

            {/* Dropdown Kelas / Kekhususan SLB */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kelas / Sasaran Kekhususan
              </label>
              <select
                value={gradeClass}
                onChange={(e) => setGradeClass(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold bg-white text-slate-800"
              >
                <optgroup label="-- SASARAN SLB / INKLUSIF --">
                  <option value="SLB - Tunagrahita (Hambatan Intelektual)">SLB: Tunagrahita (Hambatan Intelektual)</option>
                  <option value="SLB - Tunarungu (Hambatan Pendengaran)">SLB: Tunarungu (Hambatan Pendengaran)</option>
                  <option value="SLB - Tunanetra (Hambatan Penglihatan)">SLB: Tunanetra (Hambatan Penglihatan)</option>
                  <option value="SLB - Tunadaksa (Hambatan Motorik/Fisik)">SLB: Tunadaksa (Hambatan Fisik)</option>
                  <option value="SLB - Autisme / Spektrum Autis">SLB: Autisme / Spektrum Autis</option>
                  <option value="Peserta Didik Berkebutuhan Khusus (PDBK) Inklusif">Sekolah Inklusif (PDBK)</option>
                </optgroup>
                <optgroup label="-- KELAS REGULER --">
                  <option value="Fase A (Kelas 1-2 SD)">Fase A (Kelas 1-2 SD)</option>
                  <option value="Fase B (Kelas 3-4 SD)">Fase B (Kelas 3-4 SD)</option>
                  <option value="Fase C (Kelas 5-6 SD)">Fase C (Kelas 5-6 SD)</option>
                  <option value="Kelas VII (7) SMP">Kelas VII (7) SMP</option>
                  <option value="Kelas VIII (8) SMP">Kelas VIII (8) SMP</option>
                  <option value="Kelas IX (9) SMP">Kelas IX (9) SMP</option>
                  <option value="Kelas X (10) SMA/SMK">Kelas X (10) SMA/SMK</option>
                  <option value="Kelas XI (11) SMA/SMK">Kelas XI (11) SMA/SMK</option>
                  <option value="Kelas XII (12) SMA/SMK">Kelas XII (12) SMA/SMK</option>
                </optgroup>
              </select>
            </div>

            {/* Dropdown Jenis Dokumen LKPD */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Jenis Dokumen
              </label>
              <select
                value={lkpdType}
                onChange={(e) => setLkpdType(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold bg-white text-slate-800"
              >
                <option value="LKPD Praktikum & Eksperimen">LKPD Praktikum / Praktik Langsung</option>
                <option value="LKPD Diskusi Kelompok">LKPD Diskusi Kelompok</option>
                <option value="Handout & Ringkasan Materi">Handout Ringkasan Materi Visual</option>
                <option value="Lembar Soal Latihan Siswa">Lembar Soal Latihan & Gambar</option>
                <option value="Lembar Refleksi & Jurnal Siswa">Lembar Ceklist & Refleksi Siswa</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isLoading || !topic}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition disabled:opacity-50 uppercase tracking-wider"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{isLoading ? 'Menyusun LKPD AI...' : 'Generate LKPD Adaptif AI'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* HASIL LKPD (Markdown Display & Toolbar Aksi) */}
      {result && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header Result Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Hasil {lkpdType}
              </h2>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{isCopied ? 'Tersalin!' : 'Salin Teks'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Cetak / PDF</span>
              </button>

              <button
                onClick={handleSave}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition ${
                  isSaved
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{isSaved ? 'Tersimpan!' : 'Simpan Ke Repository'}</span>
              </button>
            </div>
          </div>

          {/* Area Render Markdown Modern */}
          <div className="p-6 md:p-8 text-slate-800 text-xs leading-relaxed font-sans antialiased">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-base font-black text-indigo-900 uppercase tracking-wider mt-4 mb-3 border-b-2 border-indigo-100 pb-2" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-sm font-extrabold text-indigo-800 uppercase tracking-wide mt-5 mb-2.5 bg-indigo-50/70 px-3 py-1.5 rounded-lg border-l-4 border-indigo-600" {...props} />
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
                  <th className="bg-indigo-600 text-white font-bold p-2.5 text-xs uppercase tracking-wider border-b border-slate-200" {...props} />
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
};

export default LkpdMateriPage;