import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateAiContent } from '../services/aiService';
import { Mail, Sparkles, Loader2, Copy, Check, FileText } from 'lucide-react';

export const SuratAdministrasiPage: React.FC = () => {
  const [suratType, setSuratType] = useState('Surat Izin Kegiatan / Kunjungan Lapangan');
  const [schoolName, setSchoolName] = useState('SMP Negeri 1 Merdeka');
  const [recipient, setRecipient] = useState('Orang Tua / Wali Murid Kelas VIII');
  const [purpose, setPurpose] = useState('Pelaksanaan Kegiatan Projek Penguatan Profil Pelajar Pancasila (P5) Studi Lapangan.');
  const [eventDetails, setEventDetails] = useState('Hari/Tanggal: Selasa, 20 Oktober 2026\nWaktu: 08.00 - 14.00 WIB\nLokasi: Museum Edukasi');

  const [generatedSurat, setGeneratedSurat] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateSurat = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    setGeneratedSurat(null);

    try {
      const promptText = `
Kamu adalah seorang staf administrasi sekolah profesional.
Tugasmu adalah menyusun draft surat resmi administrasi sekolah dengan struktur yang rapi dan bahasa baku.

**Detail Surat:**
- Jenis Surat: ${suratType}
- Nama Sekolah: ${schoolName}
- Pihak Penerima (Kepada Yth.): ${recipient}
- Perihal / Tujuan Surat: ${purpose}
- Detail Acara / Waktu / Tempat:
${eventDetails}

**Struktur Surat Resmi yang Diharapkan:**
1. Kop Surat (Placeholder Nama Sekolah, Alamat, Kontak)
2. Nomor Surat, Lampiran, Perihal
3. Tempat & Tanggal Surat
4. Alamat Tujuan (Kepada Yth.)
5. Salam Pembuka
6. Isi Surat (Jelas, Baku, dan Sopan)
7. Detail Waktu & Tempat (Format Rapi)
8. Salam Penutup
9. Tanda Tangan (Kepala Sekolah / Panitia)

Buatkan draf surat resmi lengkap sekarang.
`.trim();

      const res = await generateAiContent({ prompt: promptText });
      const textResult = typeof res === 'string' ? res : res.text;
      setGeneratedSurat(textResult);
    } catch (err: any) {
      console.error('Error generating Surat:', err);
      setErrorMsg(err.message || 'Gagal membuat draft surat. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedSurat) return;
    navigator.clipboard.writeText(generatedSurat);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-md space-y-2">
        <div className="flex items-center gap-2 text-blue-100 font-bold text-xs uppercase tracking-wider">
          <Mail className="w-4 h-4" />
          <span>Administrasi Sekolah</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Generator Surat Resmi & Administrasi
        </h1>
        <p className="text-xs md:text-sm text-blue-100 max-w-2xl">
          Buat draft surat undangan, pemberitahuan, izin kegiatan, hingga surat keterangan sekolah secara praktis dan berstandar baku.
        </p>
      </div>

      {/* Form Input Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
          Parameter & Informasi Surat
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Jenis / Judul Surat</label>
            <input
              type="text"
              value={suratType}
              onChange={(e) => setSuratType(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Contoh: Surat Undangan Rapat Orang Tua"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Instansi / Sekolah</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Contoh: SMP Negeri 1 Merdeka"
            />
          </div>
        </div>

        <div className="text-xs">
          <label className="block font-bold text-slate-700 mb-1">Penerima Surat (Kepada Yth.)</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Contoh: Orang Tua / Wali Murid Kelas VII"
          />
        </div>

        <div className="text-xs">
          <label className="block font-bold text-slate-700 mb-1">Tujuan / Maksud Surat</label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ringkasan singkat perihal surat..."
          />
        </div>

        <div className="text-xs">
          <label className="block font-bold text-slate-700 mb-1">Detail Acara (Tanggal, Waktu, Tempat)</label>
          <textarea
            rows={3}
            value={eventDetails}
            onChange={(e) => setEventDetails(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
            placeholder="Tuliskan jadwal lengkap acara..."
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleGenerateSurat}
            disabled={isLoading || !suratType}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Buat Draft Surat Resmi</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Output Result */}
      {generatedSurat && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-800">Draft Surat Resmi</h2>
                <p className="text-[10px] text-slate-400 font-medium">Siap untuk dicetak atau disunting</p>
              </div>
            </div>

            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow ${
                copied
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-900 text-white'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Surat'}</span>
            </button>
          </div>

          <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed font-sans whitespace-pre-wrap">
            <ReactMarkdown>{generatedSurat}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuratAdministrasiPage;