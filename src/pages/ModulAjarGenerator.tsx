import React, { useState } from 'react';
import { generateWithGroq } from '../services/groqService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { Sparkles, Loader2, Copy, Check, BookOpen, Download, Printer } from 'lucide-react';

export default function ModulAjarGenerator() {
  const [subject, setSubject] = useState('Bahasa Indonesia');
  const [customSubject, setCustomSubject] = useState('');
  const [targetJenjang, setTargetJenjang] = useState('SMP (Fase D)');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('2 JP (2 x 35 Menit)');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedSubject = subject === 'Lainnya' ? customSubject : subject;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const userPrompt = `
Tolong buatkan Modul Ajar Mendalam dengan rincian berikut:
- Mata Pelajaran: ${selectedSubject}
- Target/Jenjang/Kekhususan: ${targetJenjang}
- Topik / Materi Utama: ${topic}
- Alokasi Waktu: ${duration}
- Catatan Khusus/Kebutuhan Siswa: ${additionalNotes || 'Tidak ada'}
    `;

    try {
      const output = await generateWithGroq('modul', userPrompt);
      setResult(output);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- EKSPOR WORD (.DOCX) ---
  const handleExportDocx = async () => {
    if (!result) return;

    const lines = result.split('\n');
    const docChildren = lines.map((line) => {
      const cleanLine = line.replace(/[*#]/g, '').trim();
      
      if (line.startsWith('# ') || line.startsWith('## ')) {
        return new Paragraph({
          text: cleanLine,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        });
      }

      return new Paragraph({
        children: [
          new TextRun({
            text: cleanLine,
            bold: line.includes('**'),
          }),
        ],
        spacing: { after: 80 },
      });
    });

    const doc = new Document({
      sections: [{ properties: {}, children: docChildren }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Modul_Ajar_${selectedSubject}_${topic}.docx`);
  };

  // --- PRINT / PDF ---
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 font-sans text-slate-800 antialiased tracking-normal">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-6 rounded-3xl shadow-lg flex items-center gap-4 print:hidden">
        <div className="p-3 bg-white/10 rounded-2xl">
          <BookOpen className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight font-sans">Generator Modul Ajar Mendalam</h1>
          <p className="text-xs text-indigo-100 font-medium leading-relaxed">
            Menghasilkan Modul Ajar Akreditasi A lengkap dengan Diferensiasi & Rubrik Penilaian.
          </p>
        </div>
      </div>

      {/* Form Input */}
      <form onSubmit={handleGenerate} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 print:hidden font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 1. Mata Pelajaran */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Mata Pelajaran / Program</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-semibold bg-white text-slate-800"
            >
              <optgroup label="--- MATPEL UMUM / REGULER ---">
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                <option value="Matematika">Matematika</option>
                <option value="IPAS (SD)">IPAS (SD)</option>
                <option value="IPA Terpadu">IPA Terpadu</option>
                <option value="IPS Terpadu">IPS Terpadu</option>
                <option value="Pendidikan Pancasila / PKn">Pendidikan Pancasila / PKn</option>
                <option value="Bahasa Inggris">Bahasa Inggris</option>
                <option value="Pendidikan Agama & Budi Pekerti">Pendidikan Agama & Budi Pekerti</option>
                <option value="PJOK (Penjas)">PJOK (Penjas)</option>
                <option value="Seni Budaya / Seni Rupa / Musik">Seni Budaya / Seni Rupa / Musik</option>
                <option value="Informatika / TIK">Informatika / TIK</option>
                <option value="Prakarya & Kewirausahaan">Prakarya & Kewirausahaan</option>
              </optgroup>
              <optgroup label="--- PROGRAM KHUSUS SLB ---">
                <option value="Pengembangan Diri & Bina Diri (Tunagrahita/Autis)">Pengembangan Diri & Bina Diri (Tunagrahita/Autis)</option>
                <option value="PKPBI - Komunikasi & Persepsi Bunyi (Tunarungu)">PKPBI - Komunikasi & Persepsi Bunyi (Tunarungu)</option>
                <option value="OMSK - Orientasi & Mobilitas (Tunanetra)">OMSK - Orientasi & Mobilitas (Tunanetra)</option>
                <option value="Pengembangan Diri & Gerak (Tunadaksa)">Pengembangan Diri & Gerak (Tunadaksa)</option>
                <option value="Keterampilan Vokasional / Budi Daya">Keterampilan Vokasional / Budi Daya</option>
              </optgroup>
              <option value="Lainnya">-- Ketik Manual (Mata Pelajaran Lain) --</option>
            </select>

            {subject === 'Lainnya' && (
              <input
                type="text"
                required
                placeholder="Masukkan nama mata pelajaran..."
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-indigo-300 outline-none focus:ring-2 focus:ring-indigo-500 font-medium bg-indigo-50/30"
              />
            )}
          </div>

          {/* 2. Target / Jenjang */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Target / Jenjang / Kekhususan</label>
            <select
              value={targetJenjang}
              onChange={(e) => setTargetJenjang(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-semibold bg-white text-slate-800"
            >
              <optgroup label="--- REGULER / UMUM ---">
                <option value="PAUD / TK (Fase Fondasi)">PAUD / TK (Fase Fondasi)</option>
                <option value="SD Kelas 1-2 (Fase A)">SD Kelas 1-2 (Fase A)</option>
                <option value="SD Kelas 3-4 (Fase B)">SD Kelas 3-4 (Fase B)</option>
                <option value="SD Kelas 5-6 (Fase C)">SD Kelas 5-6 (Fase C)</option>
                <option value="SMP (Fase D)">SMP (Fase D)</option>
                <option value="SMA / SMK Kelas 10 (Fase E)">SMA / SMK Kelas 10 (Fase E)</option>
                <option value="SMA / SMK Kelas 11-12 (Fase F)">SMA / SMK Kelas 11-12 (Fase F)</option>
              </optgroup>
              <optgroup label="--- KEKHUSUSAN SLB / INKLUSI ---">
                <option value="SLB - Hambatan Penglihatan (Tunanetra)">SLB - Hambatan Penglihatan (Tunanetra)</option>
                <option value="SLB - Hambatan Pendengaran (Tunarungu)">SLB - Hambatan Pendengaran (Tunarungu)</option>
                <option value="SLB - Hambatan Intelektual (Tunagrahita)">SLB - Hambatan Intelektual (Tunagrahita)</option>
                <option value="SLB - Hambatan Anggota Gerak (Tunadaksa)">SLB - Hambatan Anggota Gerak (Tunadaksa)</option>
                <option value="SLB - Autis / Spectrum Disorder">SLB - Autis / Spectrum Disorder</option>
                <option value="Kelas Inklusi (Campuran Reguler & PDBK)">Kelas Inklusi (Campuran Reguler & PDBK)</option>
              </optgroup>
            </select>
          </div>

          {/* 3. Topik / Materi Utama */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Topik / Materi Utama</label>
            <input
              type="text"
              required
              placeholder="Contoh: Teks Eksplanasi / Fotosintesis"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          {/* 4. Alokasi Waktu */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Alokasi Waktu</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-semibold bg-white text-slate-800"
            >
              <option value="1 JP (1 x 30 Menit - SLB/PAUD)">1 JP (1 x 30 Menit - SLB/PAUD)</option>
              <option value="2 JP (2 x 30 Menit - SLB/PAUD)">2 JP (2 x 30 Menit - SLB/PAUD)</option>
              <option value="2 JP (2 x 35 Menit - SD)">2 JP (2 x 35 Menit - SD)</option>
              <option value="3 JP (3 x 35 Menit - SD)">3 JP (3 x 35 Menit - SD)</option>
              <option value="2 JP (2 x 40 Menit - SMP)">2 JP (2 x 40 Menit - SMP)</option>
              <option value="3 JP (3 x 40 Menit - SMP)">3 JP (3 x 40 Menit - SMP)</option>
              <option value="2 JP (2 x 45 Menit - SMA/SMK)">2 JP (2 x 45 Menit - SMA/SMK)</option>
              <option value="3 JP (3 x 45 Menit - SMA/SMK)">3 JP (3 x 45 Menit - SMA/SMK)</option>
            </select>
          </div>

        </div>

        {/* 5. Catatan Tambahan */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Catatan Tambahan (Opsional)</label>
          <textarea
            rows={2}
            placeholder="Contoh: Gunakan pendekatan visual-kinestetik, sertakan kartu gambar..."
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-medium leading-relaxed"
          />
        </div>

        {/* Tombol Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 uppercase tracking-wider"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{isLoading ? 'Sedang Menyusun Modul Ajar...' : 'Generate Modul Ajar Pro'}</span>
        </button>
      </form>

      {/* Hasil Generate */}
      {result && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 print:hidden font-sans">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Hasil Modul Ajar Pro</h2>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin'}</span>
              </button>

              <button
                onClick={handleExportDocx}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Word (.docx)</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak / PDF</span>
              </button>
            </div>
          </div>

          {/* TAMPILAN TYPOGRAPHY MODERN */}
          <div className="text-slate-800 text-sm leading-relaxed font-sans antialiased">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-lg font-black text-indigo-900 uppercase tracking-wider mt-6 mb-3 border-b-2 border-indigo-100 pb-2 flex items-center gap-2 font-sans" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-sm font-extrabold text-indigo-800 uppercase tracking-wide mt-5 mb-3 bg-indigo-50/70 px-3.5 py-2 rounded-xl border-l-4 border-indigo-600 font-sans" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xs font-bold text-slate-900 mt-4 mb-2 tracking-wide font-sans uppercase" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-3 text-slate-700 leading-relaxed font-medium" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="space-y-2 my-3 pl-2 font-medium" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal space-y-2 my-3 pl-5 text-slate-700 font-medium leading-relaxed" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="flex items-start gap-2 text-slate-700" {...props}>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0 print:hidden" />
                    <span className="flex-1 leading-relaxed">{props.children}</span>
                  </li>
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-extrabold text-slate-900" {...props} />
                ),
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-4 rounded-xl border border-slate-200 shadow-sm font-sans">
                    <table className="w-full text-left border-collapse" {...props} />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th className="bg-indigo-600 text-white font-extrabold p-3 text-xs border-b border-slate-200 tracking-wider uppercase" {...props} />
                ),
                td: ({ node, ...props }) => (
                  <td className="p-3 border-b border-slate-100 text-xs text-slate-700 font-medium bg-white" {...props} />
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
}