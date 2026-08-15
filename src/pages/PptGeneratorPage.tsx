import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateAiContent } from '../services/aiService';
import { Presentation, Sparkles, Loader2, Copy, Check, Layout, FileText, Download } from 'lucide-react';

export const PptGeneratorPage: React.FC = () => {
  const [topic, setTopic] = useState('Sistem Pencernaan Manusia');
  const [gradeLevel, setGradeLevel] = useState('SMP Kelas 8');
  const [slideCount, setSlideCount] = useState<number>(6);
  const [presentationStyle, setPresentationStyle] = useState('Interaktif & Visual');
  const [additionalNotes, setAdditionalNotes] = useState('Sertakan pertanyaan pemantik di awal dan kuis singkat di slide akhir.');

  const [generatedPpt, setGeneratedPpt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGeneratePpt = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    setGeneratedPpt(null);

    try {
      const promptText = `
Kamu adalah seorang pakar Instructional Design dan pembuat materi presentasi pembelajaran Kurikulum Merdeka.
Tugasmu adalah membuat struktur dan outline slide presentasi PowerPoint (PPT) yang menarik, jelas, dan interaktif.

**Detail Permintaan:**
- Topik / Materi: ${topic}
- Target Jenjang: ${gradeLevel}
- Jumlah Slide: ${slideCount} Slide
- Gaya Presentasi: ${presentationStyle}
- Catatan Khusus: ${additionalNotes}

**Format Output Per Slide yang Diharapkan:**
Untuk setiap slide (Slide 1 hingga Slide ${slideCount}), gunakan format berikut:

---
### 🖥️ Slide [Nomor]: [Judul Slide]
**Judul Visual/Header:** [Judul singkat & menarik]
**Poin Utama (Bulleted Content):**
- [Poin 1]
- [Poin 2]
- [Poin 3]

**Catatan Guru / Speaker Notes:**
[Penjelasan singkat apa yang harus disampaikan guru pada slide ini]

**Saran Elemen Visual/Gambar:**
[Deskripsi ilustrasi, diagram, atau gambar yang cocok dimasukkan ke slide]
---

Buatkan outline lengkap sekarang.
`.trim();

      const res = await generateAiContent({ prompt: promptText });
      const textResult = typeof res === 'string' ? res : res.text;
      setGeneratedPpt(textResult);
    } catch (err: any) {
      console.error('Error generating PPT:', err);
      setErrorMsg(err.message || 'Gagal membuat outline PPT. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedPpt) return;
    navigator.clipboard.writeText(generatedPpt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6 rounded-2xl shadow-md space-y-2">
        <div className="flex items-center gap-2 text-amber-100 font-bold text-xs uppercase tracking-wider">
          <Presentation className="w-4 h-4" />
          <span>Asisten Presentasi Interaktif</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          PowerPoint (PPT) Outline Generator
        </h1>
        <p className="text-xs md:text-sm text-amber-100 max-w-2xl">
          Rancang struktur slide presentasi mengajar yang sistematis, lengkap dengan poin utama, speaker notes, dan rekomendasi elemen visual.
        </p>
      </div>

      {/* Form Input Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
          Parameter Slide Presentasi
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Topik / Materi Pembelajaran</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="Contoh: Ekosistem & Rantai Makanan"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Jenjang / Kelas</label>
            <input
              type="text"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="Contoh: SMA Kelas 10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Jumlah Slide</label>
            <select
              value={slideCount}
              onChange={(e) => setSlideCount(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-amber-500 bg-white outline-none"
            >
              <option value={5}>5 Slide (Singkat & Padat)</option>
              <option value={6}>6 Slide (Standar Jam Pelajaran)</option>
              <option value={8}>8 Slide (Mendalam)</option>
              <option value={10}>10 Slide (Lengkap & Komprehensif)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Gaya Presentasi</label>
            <select
              value={presentationStyle}
              onChange={(e) => setPresentationStyle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-amber-500 bg-white outline-none"
            >
              <option value="Interaktif & Visual">Interaktif & Banyak Visual</option>
              <option value="Konseptual & Struktur">Konseptual & Terstruktur</option>
              <option value="Storytelling & Studi Kasus">Storytelling & Studi Kasus</option>
              <option value="Diskusi & Problem Solving">Diskusi & Problem Solving</option>
            </select>
          </div>
        </div>

        <div className="text-xs">
          <label className="block font-bold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
          <textarea
            rows={3}
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-amber-500 outline-none leading-relaxed"
            placeholder="Contoh: Tambahkan pertanyaan diskusi interaktif..."
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleGeneratePpt}
            disabled={isLoading || !topic}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Buat Outline Slide PPT</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Output Result */}
      {generatedPpt && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                <Layout className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-800">Outline Slide Presentasi</h2>
                <p className="text-[10px] text-slate-400 font-medium">Siap dipindahkan ke PowerPoint / Canva</p>
              </div>
            </div>

            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow ${
                copied
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-900 text-white'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Outline'}</span>
            </button>
          </div>

          <div className="p-5 bg-amber-50/40 rounded-2xl border border-amber-100 text-slate-800 text-xs sm:text-sm leading-relaxed font-sans">
            <ReactMarkdown>{generatedPpt}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default PptGeneratorPage;