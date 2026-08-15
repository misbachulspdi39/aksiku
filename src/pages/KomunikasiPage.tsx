import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateAiContent } from '../services/aiService';
import { Send, MessageSquare, Sparkles, Loader2, Copy, Check } from 'lucide-react';

export const KomunikasiPage: React.FC = () => {
  const [studentName, setStudentName] = useState('Budi Santoso');
  const [className, setClassName] = useState('Kelas VIII-A');
  const [parentName, setParentName] = useState('Bapak/Ibu Orang Tua Budi');
  const [topicType, setTopicType] = useState<'apresiasi' | 'peringatan' | 'remedial' | 'kehadiran' | 'umum'>('apresiasi');
  const [keyNotes, setKeyNotes] = useState('Budi menunjukkan peningkatan pesat dalam nilai Matematika dan sangat aktif membantu teman sekelompoknya.');
  const [tone, setTone] = useState<'santun' | 'formal' | 'empatik'>('santun');

  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateMessage = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    setGeneratedMessage(null);

    try {
      // Prompt dibuat langsung di sini agar tidak memicu error import
      const promptText = `
Kamu adalah seorang guru profesional dan wali kelas di sekolah yang menerapkan Kurikulum Merdeka.
Tugasmu adalah menyusun pesan WhatsApp yang efektif, santun, dan komunikatif untuk dikirimkan kepada orang tua/wali murid.

**Informasi Pesan:**
- Nama Siswa: ${studentName}
- Kelas: ${className}
- Sapaan Orang Tua/Wali: ${parentName}
- Kategori Topik: ${topicType.toUpperCase()}
- Gaya Bahasa (Tone): ${tone}
- Catatan / Poin Utama:
${keyNotes}

**Instruksi Penulisan:**
1. Awali dengan salam pembuka yang ramah dan sopan.
2. Sampaikan tujuan pesan secara jelas, padat, dan langsung pada inti pembahasan.
3. Gunakan bahasa yang sesuai dengan tone (${tone}). Jangan gunakan kalimat yang terkesan menghakimi jika topik terkait kendala atau disiplin.
4. Sertakan ajakan untuk berkolaborasi/berdiskusi demi kebaikan pembelajaran siswa.
5. Gunakan format teks WhatsApp yang mudah dibaca (gunakan cetak tebal/bold (*teks*) dan bullet point jika diperlukan).
6. Akhiri dengan salam penutup dan penanda Guru/Wali Kelas.
`.trim();

      const res = await generateAiContent({ prompt: promptText });
      const textResult = typeof res === 'string' ? res : res.text;
      setGeneratedMessage(textResult);
    } catch (err: any) {
      console.error('Error generating WA Message:', err);
      setErrorMsg(err.message || 'Gagal membuat draft pesan WA. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedMessage) return;
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 rounded-2xl shadow-md space-y-2">
        <div className="flex items-center gap-2 text-teal-100 font-bold text-xs uppercase tracking-wider">
          <Send className="w-4 h-4" />
          <span>Komunikasi Efektif Guru & Orang Tua</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Generator Pesan WhatsApp ke Orang Tua
        </h1>
        <p className="text-xs md:text-sm text-teal-100 max-w-2xl">
          Susun draft pesan WhatsApp yang santun, profesional, dan empatik untuk menyampaikan kabar perkembangan, apresiasi, maupun kendala belajar siswa.
        </p>
      </div>

      {/* Form Input Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
          Informasi & Topik Komunikasi
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Siswa</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Contoh: Budi Santoso"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Kelas</label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Contoh: VIII-A"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Sapaan Orang Tua</label>
            <input
              type="text"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Contoh: Bapak/Ibu Wali Budi"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Kategori Pesan</label>
            <select
              value={topicType}
              onChange={(e: any) => setTopicType(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-emerald-500 bg-white outline-none"
            >
              <option value="apresiasi">Apresiasi & Prestasi Siswa</option>
              <option value="peringatan">Peringatan Kedisiplinan / Sikap</option>
              <option value="remedial">Informasi Remedial / Pendampingan Belajar</option>
              <option value="kehadiran">Konfirmasi Kehadiran / Absensi</option>
              <option value="umum">Pengumuman / Undangan Umum</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Gaya Bahasa (Tone)</label>
            <select
              value={tone}
              onChange={(e: any) => setTone(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-emerald-500 bg-white outline-none"
            >
              <option value="santun">Santun & Hangat (Direkomendasikan)</option>
              <option value="formal">Formal & Resmi</option>
              <option value="empatik">Empatik & Suportif</option>
            </select>
          </div>
        </div>

        <div className="text-xs">
          <label className="block font-bold text-slate-700 mb-1">Poin Poin Penting yang Ingin Disampaikan</label>
          <textarea
            rows={3}
            value={keyNotes}
            onChange={(e) => setKeyNotes(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
            placeholder="Tuliskan catatan singkat terkait perilaku, nilai, atau pengumuman..."
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleGenerateMessage}
            disabled={isLoading || !studentName}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Buat Draft Pesan WhatsApp</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Output Draft Pesan WA */}
      {generatedMessage && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-800">Draft Pesan Siap Kirim</h2>
                <p className="text-[10px] text-slate-400 font-medium">Disesuaikan untuk WhatsApp</p>
              </div>
            </div>

            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-900 text-white'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Pesan'}</span>
            </button>
          </div>

          <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-slate-800 text-xs sm:text-sm leading-relaxed font-sans whitespace-pre-wrap">
            <ReactMarkdown>{generatedMessage}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default KomunikasiPage;