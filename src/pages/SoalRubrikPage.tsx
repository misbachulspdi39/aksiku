import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { generateWithGroq } from '../services/groqService';
import { HelpCircle, Sparkles, Loader2, Copy, Check, FileDown, FileText } from 'lucide-react';

export default function SoalRubrikPage() {
  // State Input Utama
  const [subject, setSubject] = useState('Bahasa Indonesia');
  const [customSubject, setCustomSubject] = useState('');
  const [grade, setGrade] = useState('SMP Kelas 7-9 (Fase D)');
  const [kekhususanSLB, setKekhususanSLB] = useState('Tidak Ada (Reguler)');
  const [topic, setTopic] = useState('');
  
  // State Bentuk Soal (Checkbox + Jumlah Soal Per Jenis)
  const [questionTypes, setQuestionTypes] = useState({
    pg: { checked: true, count: 5, label: 'Pilihan Ganda (PG)' },
    pgKompleks: { checked: false, count: 3, label: 'Pilihan Ganda Kompleks' },
    menjodohkan: { checked: false, count: 5, label: 'Menjodohkan / Pasangkan' },
    isianSingkat: { checked: false, count: 5, label: 'Isian Singkat' },
    esai: { checked: true, count: 2, label: 'Esai / Uraian' },
    praktik: { checked: false, count: 1, label: 'Unjuk Kerja / Praktik SLB' },
  });

  const [additionalNotes, setAdditionalNotes] = useState('');

  // State Hasil
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedSubject = subject === 'Lainnya' ? customSubject : subject;

  // Handler Checkbox
  const handleCheckboxChange = (key: keyof typeof questionTypes) => {
    setQuestionTypes((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        checked: !prev[key].checked,
      },
    }));
  };

  // Handler Input Jumlah Soal
  const handleCountChange = (key: keyof typeof questionTypes, value: number) => {
    setQuestionTypes((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        count: Math.max(1, value),
      },
    }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (subject === 'Lainnya' && !customSubject.trim()) {
      alert('Silakan ketikkan nama mata pelajaran secara manual!');
      return;
    }

    // Ambil jenis soal yang dicentang beserta jumlahnya
    const activeTypes = Object.values(questionTypes)
      .filter((item) => item.checked)
      .map((item) => `${item.label} (${item.count} Soal)`);

    if (activeTypes.length === 0) {
      alert('Pilih minimal 1 bentuk/jenis soal yang ingin ditampilkan!');
      return;
    }

    setIsLoading(true);

    // Deteksi Otomatis Jika Mata Pelajaran Bahasa Inggris atau Bahasa Asing Lainnya
    const lowerSubject = selectedSubject.toLowerCase();
    const isEnglish = lowerSubject.includes('inggris') || lowerSubject.includes('english');
    const isForeignLang = isEnglish || lowerSubject.includes('jepang') || lowerSubject.includes('arab') || lowerSubject.includes('jerman') || lowerSubject.includes('mandarin');

    // Instruksi Bahasa Spesifik
    let languageInstruction = "";
    if (isEnglish) {
      languageInstruction = `
CRITICAL LANGUAGE REQUIREMENT:
Because the subject is English, ALL STIMULUS TEXTS, QUESTIONS, AND MULTIPLE-CHOICE OPTIONS (A, B, C, D) MUST BE WRITTEN ENTIRELY IN ENGLISH (100%).
Only Answer Keys, Explanations, and Grading Rubrics can be in Indonesian for teacher assessment ease.
`;
    } else if (isForeignLang) {
      languageInstruction = `
INSTRUKSI BAHASA:
Karena mata pelajaran adalah ${selectedSubject}, SELURUH STIMULUS TEKS, PERTANYAAN, DAN PILIHAN JAWABAN WAJIB Menggunakan bahasa target (${selectedSubject}). Pembahasan & Rubrik boleh menggunakan Bahasa Indonesia.
`;
    }

    const userPrompt = `
Tolong buatkan Bank Soal Adaptif & Rubrik Penilaian Analitik dengan rincian berikut:
- Mata Pelajaran: ${selectedSubject}
- Kelas / Fase: ${grade}
- Target Kekhususan SLB: ${kekhususanSLB}
- Topik / Materi Utama: ${topic}
- Rincian Bentuk & Jumlah Soal:
${activeTypes.map((t) => `  * ${t}`).join('\n')}
- Catatan Khusus / Adaptasi: ${additionalNotes || 'Tidak ada'}
${languageInstruction}
PETUNJUK PENULISAN:
1. Jika target adalah SLB/Kekhususan, sesuaikan tingkat kesulitan, gunakan kalimat yang jernih, serta petunjuk visual/konkrit yang ramah anak.
2. Buatkan rincian soal sesuai jumlah yang diminta untuk tiap jenis.
3. Lengkapi setiap nomor soal dengan:
   - Soal / Pertanyaan (Wajib sesuai aturan bahasa di atas)
   - Kunci Jawaban
   - Pembahasan Ringkas
   - Rubrik Penilaian / Pedoman Penskoran
`;

    try {
      const output = await generateWithGroq('soal', userPrompt);
      setResult(output);
    } catch (err: any) {
      alert(err.message || 'Gagal menghasilkan bank soal.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Ekspor ke Word (.doc)
  const handleExportWord = () => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
      "xmlns:w='urn:schemas-microsoft-com:office:word' " +
      "xmlns='http://www.w3.org/TR/REC-html40'>" +
      "<head><meta charset='utf-8'><title>Bank Soal dan Rubrik Penilaian</title></head><body>";
    const footer = "</body></html>";
    
    const sourceHTML = header + document.getElementById('soal-result-content')?.innerHTML + footer;
    const blob = new Blob(['\ufeff', sourceHTML], {
      type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bank_Soal_${selectedSubject.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Ekspor ke PDF via Print Browser
  const handleExportPDF = () => {
    const printContent = document.getElementById('soal-result-content');
    if (!printContent) return;

    const printWindow = window.open('', '', 'width=800,height=900');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Bank Soal & Rubrik - ${selectedSubject}</title>
            <style>
              body { font-family: sans-serif; padding: 20px; line-height: 1.6; font-size: 12px; color: #1e293b; }
              h1 { font-size: 18px; color: #065f46; border-bottom: 2px solid #a7f3d0; padding-bottom: 6px; }
              h2 { font-size: 14px; color: #047857; background: #ecfdf5; padding: 6px 10px; border-left: 4px solid #059669; }
              h3 { font-size: 12px; color: #0f172a; text-transform: uppercase; margin-top: 15px; }
              table { width: 100%; border-collapse: collapse; margin: 15px 0; }
              th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
              th { background-color: #059669; color: white; }
              ul, ol { padding-left: 20px; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans text-slate-800 antialiased pb-12">
      {/* Header Banner */}
      <div className="bg-emerald-600 text-white p-6 rounded-3xl shadow-lg flex items-center gap-4">
        <div className="p-3 bg-white/10 rounded-2xl shrink-0">
          <HelpCircle className="w-8 h-8 text-emerald-100" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight font-sans">Bank Soal HOTS & Rubrik Analitik Adaptif</h1>
          <p className="text-xs text-emerald-100 font-medium leading-relaxed mt-0.5">
            Membuat soal berbasis stimulus, HOTS, maupun adaptif SLB lengkap dengan kunci, pembahasan, dan rubrik skor.
          </p>
        </div>
      </div>

      {/* Form Input Utama */}
      <form onSubmit={handleGenerate} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5 font-sans">
        
        {/* Baris 1: Mapel, Kelas/Fase, Kekhususan SLB */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 1. Mata Pelajaran */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">Mata Pelajaran / Program *</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 font-bold bg-white text-slate-800"
            >
              <optgroup label="--- MATPEL REGULER / UMUM ---">
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                <option value="Matematika">Matematika</option>
                <option value="IPAS (SD)">IPAS (SD)</option>
                <option value="IPA Terpadu">IPA Terpadu</option>
                <option value="IPS Terpadu">IPS Terpadu</option>
                <option value="Pendidikan Pancasila / PKn">Pendidikan Pancasila / PKn</option>
                <option value="Bahasa Inggris">Bahasa Inggris</option>
                <option value="Pendidikan Agama & Budi Pekerti">Pendidikan Agama & Budi Pekerti</option>
                <option value="PJOK (Penjas)">PJOK (Penjas)</option>
                <option value="Seni Budaya / Seni Rupa">Seni Budaya / Seni Rupa</option>
                <option value="Informatika / TIK">Informatika / TIK</option>
              </optgroup>
              <optgroup label="--- PROGRAM KHUSUS SLB ---">
                <option value="Pengembangan Diri & Bina Diri (Tunagrahita/Autis)">Pengembangan Diri & Bina Diri</option>
                <option value="PKPBI - Persepsi Bunyi & Irama (Tunarungu)">PKPBI (Tunarungu)</option>
                <option value="OMSK - Orientasi & Mobilitas (Tunanetra)">OMSK (Tunanetra)</option>
                <option value="Pengembangan Diri & Gerak (Tunadaksa)">Bina Diri & Gerak (Tunadaksa)</option>
                <option value="Keterampilan Vokasional SLB">Keterampilan Vokasional</option>
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
                className="w-full mt-2 p-2.5 text-xs rounded-xl border border-emerald-300 outline-none focus:ring-2 focus:ring-emerald-500 font-semibold bg-emerald-50/30"
              />
            )}
          </div>

          {/* 2. Kelas / Fase */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">Kelas / Fase *</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 font-bold bg-white text-slate-800"
            >
              <optgroup label="--- REGULER ---">
                <option value="PAUD / TK (Fase Fondasi)">PAUD / TK (Fase Fondasi)</option>
                <option value="SD Kelas 1-2 (Fase A)">SD Kelas 1-2 (Fase A)</option>
                <option value="SD Kelas 3-4 (Fase B)">SD Kelas 3-4 (Fase B)</option>
                <option value="SD Kelas 5-6 (Fase C)">SD Kelas 5-6 (Fase C)</option>
                <option value="SMP Kelas 7-9 (Fase D)">SMP Kelas 7-9 (Fase D)</option>
                <option value="SMA/SMK Kelas 10 (Fase E)">SMA/SMK Kelas 10 (Fase E)</option>
                <option value="SMA/SMK Kelas 11-12 (Fase F)">SMA/SMK Kelas 11-12 (Fase F)</option>
              </optgroup>
              <optgroup label="--- SLB / KEKHUSUSAN ---">
                <option value="TKLB (Fase Fondasi)">TKLB</option>
                <option value="SDLB Kelas 1-2 (Fase A)">SDLB Kelas 1-2 (Fase A)</option>
                <option value="SDLB Kelas 3-4 (Fase B)">SDLB Kelas 3-4 (Fase B)</option>
                <option value="SDLB Kelas 5-6 (Fase C)">SDLB Kelas 5-6 (Fase C)</option>
                <option value="SMPLB (Fase D)">SMPLB (Fase D)</option>
                <option value="SMALB (Fase E/F)">SMALB (Fase E/F)</option>
              </optgroup>
            </select>
          </div>

          {/* 3. Jenis Kekhususan SLB */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">Jenis Kekhususan SLB</label>
            <select
              value={kekhususanSLB}
              onChange={(e) => setKekhususanSLB(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 font-bold bg-white text-slate-800"
            >
              <option value="Tidak Ada (Reguler)">Tidak Ada (Kelas Reguler)</option>
              <option value="Hambatan Penglihatan (Tunanetra)">Tunanetra (Hambatan Penglihatan)</option>
              <option value="Hambatan Pendengaran (Tunarungu)">Tunarungu (Hambatan Pendengaran)</option>
              <option value="Hambatan Intelektual Ringan (Tunagrahita)">Tunagrahita Ringan</option>
              <option value="Hambatan Intelektual Sedang (Tunagrahita)">Tunagrahita Sedang</option>
              <option value="Hambatan Anggota Gerak (Tunadaksa)">Tunadaksa (Hambatan Motorik)</option>
              <option value="Spektrum Autisme (Autis)">Autisme (ASD)</option>
              <option value="Hambatan Emosi & Perilaku (Tunalaras)">Tunalaras</option>
              <option value="Kelas Inklusi (Campuran PDBK & Reguler)">Kelas Inklusi (Campuran)</option>
            </select>
          </div>

        </div>

        {/* Baris 2: Topik / Materi Utama */}
        <div className="space-y-1.5">
          <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">Topik / Materi Utama *</label>
          <input
            type="text"
            required
            placeholder="Contoh: Ekosistem Laut / Cara Mencuci Tangan / Simple Present Tense"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
          />
        </div>

        {/* Baris 3: Centang Bentuk Soal + Input Jumlah di Sampingnya */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            Pilih Bentuk Soal & Tentukan Jumlah Soal:
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {(Object.keys(questionTypes) as Array<keyof typeof questionTypes>).map((key) => {
              const item = questionTypes[key];
              return (
                <div
                  key={key}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition ${
                    item.checked
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <label className="flex items-center gap-2 cursor-pointer select-none flex-1 mr-2">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleCheckboxChange(key)}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className={`text-xs font-bold ${item.checked ? 'text-emerald-950' : 'text-slate-700'}`}>
                      {item.label}
                    </span>
                  </label>

                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Jml:</span>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      disabled={!item.checked}
                      value={item.count}
                      onChange={(e) => handleCountChange(key, parseInt(e.target.value) || 1)}
                      className={`w-12 p-1 text-center text-xs font-black rounded-lg border outline-none transition ${
                        item.checked
                          ? 'border-emerald-400 bg-white text-emerald-900 focus:ring-2 focus:ring-emerald-500'
                          : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Baris 4: Catatan Khusus Opsional */}
        <div className="space-y-1.5">
          <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">Catatan Khusus Adaptasi (Opsional)</label>
          <input
            type="text"
            placeholder="Contoh: Sertakan gambar pendukung konkrit, gunakan opsi pilihan A-B-C saja untuk SLB..."
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
          />
        </div>

        {/* Tombol Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 uppercase tracking-wider"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{isLoading ? 'Menyusun Soal & Rubrik Skor...' : 'Generate Bank Soal Detail'}</span>
        </button>
      </form>

      {/* Hasil Generate dengan Fitur Ekspor & Tipografi Modern */}
      {result && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 font-sans">
          
          {/* Header Action: Salin, Ekspor Word, Ekspor PDF */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              Hasil Bank Soal & Rubrik Analitik
            </h2>
            
            <div className="flex items-center gap-2">
              {/* Tombol Salin */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-xl transition"
                title="Salin teks ke clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
              </button>

              {/* Tombol Ekspor Word */}
              <button
                onClick={handleExportWord}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-extrabold rounded-xl transition"
                title="Unduh file Microsoft Word (.doc)"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Word (.doc)</span>
              </button>

              {/* Tombol Ekspor PDF */}
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-extrabold rounded-xl transition"
                title="Cetak atau simpan sebagai PDF"
              >
                <FileDown className="w-3.5 h-3.5 text-rose-600" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Container Konten Hasil */}
          <div id="soal-result-content" className="text-slate-800 text-xs leading-relaxed font-sans antialiased">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-base font-black text-emerald-900 uppercase tracking-wider mt-6 mb-3 border-b-2 border-emerald-100 pb-1.5 font-sans" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-sm font-extrabold text-emerald-800 uppercase tracking-wide mt-5 mb-2.5 bg-emerald-50/70 px-3 py-1.5 rounded-lg border-l-4 border-emerald-600 font-sans" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xs font-extrabold text-slate-900 mt-4 mb-2 tracking-wide uppercase font-sans" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-2.5 text-slate-700 leading-relaxed font-semibold" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="space-y-1.5 my-2.5 pl-4 list-disc text-slate-700 font-semibold" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal space-y-1.5 my-2.5 pl-5 text-slate-700 font-semibold leading-relaxed" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-extrabold text-slate-900" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="my-3 p-3 bg-slate-50 border-l-4 border-emerald-500 italic text-slate-600 rounded-r-xl font-medium" {...props} />
                ),
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-4 rounded-xl border border-slate-200 shadow-sm font-sans">
                    <table className="w-full text-left border-collapse" {...props} />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th className="bg-emerald-600 text-white font-extrabold p-2.5 text-xs uppercase tracking-wider border-b border-slate-200" {...props} />
                ),
                td: ({ node, ...props }) => (
                  <td className="p-2.5 border-b border-slate-100 text-xs text-slate-700 bg-white font-semibold" {...props} />
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