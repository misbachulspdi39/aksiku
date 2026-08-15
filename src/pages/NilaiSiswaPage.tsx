import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateAiContent } from '../services/aiService';
import { SavedDocument } from '../types';
import {
  Users,
  TrendingUp,
  Award,
  AlertCircle,
  Upload,
  Plus,
  Sparkles,
  Loader2,
  Save,
  Check,
  BarChart3
} from 'lucide-react';

interface Student {
  id: number;
  nama: string;
  formatif: number;
  sumatif: number;
  nilaiAkhir: number;
  capaianUnggul?: string;
  capaianBimbingan?: string;
}

interface NilaiSiswaPageProps {
  onSaveDocument?: (doc: SavedDocument) => void;
}

export const NilaiSiswaPage: React.FC<NilaiSiswaPageProps> = ({ onSaveDocument }) => {
  // State Data Siswa Initial (Dummy awal)
  const [students, setStudents] = useState<Student[]>([
    { id: 1, nama: 'Ahmad Rizky Pratama', formatif: 88, sumatif: 92, nilaiAkhir: 90, capaianUnggul: 'Sangat baik dalam pemecahan masalah soal cerita dan analisis data', capaianBimbingan: 'Perlu peningkatan pada ketelitian hitungan aljabar dasar' },
    { id: 2, nama: 'Bunga Cantika Putri', formatif: 95, sumatif: 98, nilaiAkhir: 97, capaianUnggul: 'Menguasai seluruh kompetensi dasar dan tingkat lanjut HOTS dengan sangat presisi', capaianBimbingan: 'Tidak ada' },
    { id: 3, nama: 'Citra Dewi Lestari', formatif: 78, sumatif: 82, nilaiAkhir: 80, capaianUnggul: 'Bagus dalam diskusi kelompok dan presentasi konsep', capaianBimbingan: 'Memerlukan latihan soal mandiri secara bertahap' },
    { id: 4, nama: 'Doni Firmansyah', formatif: 65, sumatif: 70, nilaiAkhir: 68, capaianUnggul: 'Antusias saat pembelajaran berbasis praktik/eksperimen', capaianBimbingan: 'Sangat memerlukan bimbingan remedial pada pemahaman rumus' },
    { id: 5, nama: 'Eka Nurjanah', formatif: 82, sumatif: 86, nilaiAkhir: 84, capaianUnggul: 'Cermat dalam membaca petunjuk soal dan pengerjaan LKPD', capaianBimbingan: 'Perlu dorongan untuk lebih aktif mengekspresikan pendapat' },
  ]);

  const [subject, setSubject] = useState('Matematika');
  const [className, setClassName] = useState('Kelas VIII-A');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Form Manual Input
  const [newNama, setNewNama] = useState('');
  const [newFormatif, setNewFormatif] = useState('');
  const [newSumatif, setNewSumatif] = useState('');

  // 1. STATISTIK OTOMATIS (Berubah dinamis mengikuti data 'students')
  const stats = useMemo(() => {
    if (students.length === 0) return { total: 0, avg: 0, max: 0, min: 0 };
    const scores = students.map((s) => s.nilaiAkhir);
    const sum = scores.reduce((a, b) => a + b, 0);
    return {
      total: students.length,
      avg: Number((sum / students.length).toFixed(1)),
      max: Math.max(...scores),
      min: Math.min(...scores),
    };
  }, [students]);

  // 2. TAMBAH SISWA MANUAL
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNama || !newFormatif || !newSumatif) return;

    const f = Number(newFormatif);
    const s = Number(newSumatif);
    const finalScore = Math.round((f + s) / 2);

    const newStudent: Student = {
      id: Date.now(),
      nama: newNama,
      formatif: f,
      sumatif: s,
      nilaiAkhir: finalScore,
      capaianUnggul: 'Belum dianalisis AI',
      capaianBimbingan: 'Belum dianalisis AI',
    };

    setStudents((prev) => [...prev, newStudent]);
    setNewNama('');
    setNewFormatif('');
    setNewSumatif('');
  };

  // 3. UPLOAD FILE CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split('\n');
      const parsedStudents: Student[] = [];

      lines.forEach((line, index) => {
        if (index === 0 || !line.trim()) return; // Skip Header
        const cols = line.split(',');
        if (cols.length >= 3) {
          const nama = cols[0].trim();
          const formatif = Number(cols[1]) || 0;
          const sumatif = Number(cols[2]) || 0;
          const nilaiAkhir = Math.round((formatif + sumatif) / 2);

          parsedStudents.push({
            id: Date.now() + index,
            nama,
            formatif,
            sumatif,
            nilaiAkhir,
            capaianUnggul: 'Belum dianalisis AI',
            capaianBimbingan: 'Belum dianalisis AI',
          });
        }
      });

      if (parsedStudents.length > 0) {
        setStudents(parsedStudents);
      }
    };
    reader.readAsText(file);
  };

  // 4. PROSES ANALISIS NARASI RAPOR AI UNTUK SELURUH SISWA
  const handleRunAiAnalysis = async () => {
    if (students.length === 0) return;
    setIsAnalyzing(true);

    try {
      const prompt = `
Kamu adalah Sistem Analisis Rapor Kurikulum Merdeka untuk mata pelajaran ${subject} ${className}.
Berikut adalah daftar siswa dan nilai akhirnya:
${students.map((s, idx) => `${idx + 1}. ${s.nama} (Nilai Akhir: ${s.nilaiAkhir}, Formatif: ${s.formatif}, Sumatif: ${s.sumatif})`).join('\n')}

Tugasmu:
Berikan narasi deskripsi capaian rapor Kurikulum Merdeka untuk MASING-MASING siswa di atas.
Format respon HARUS dalam JSON array murni tanpa markdown lain seperti berikut:
[
  {
    "id": 1,
    "capaianUnggul": "Sangat baik dalam...",
    "capaianBimbingan": "Perlu peningkatan pada..."
  }
]
`;

      const res = await generateAiContent({ prompt });
      const rawText = typeof res === 'string' ? res : res.text;
      
      // Sanitasi JSON secara aman mengambil isi di antara kurung siku [ ... ]
      const jsonStart = rawText.indexOf('[');
      const jsonEnd = rawText.lastIndexOf(']') + 1;
      
      let aiResults = [];
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const cleanJsonStr = rawText.substring(jsonStart, jsonEnd);
        aiResults = JSON.parse(cleanJsonStr);
      } else {
        throw new Error('Format JSON tidak ditemukan pada respon AI');
      }

      // Match hasil AI dengan data siswa
      const updatedStudents = students.map((std, idx) => {
        const result = aiResults[idx];
        return {
          ...std,
          capaianUnggul: result?.capaianUnggul || 'Menunjukkan penguasaan kompetensi yang baik.',
          capaianBimbingan: result?.capaianBimbingan || 'Perlu bimbingan bertahap.',
        };
      });

      setStudents(updatedStudents);
    } catch (err) {
      console.error('Gagal analisis AI, menggunakan fallback:', err);
      // Fallback deskripsi otomatis jika JSON AI bermasalah
      setStudents((prev) =>
        prev.map((s) => ({
          ...s,
          capaianUnggul: s.nilaiAkhir >= 85 ? 'Sangat menguasai seluruh materi dan kompetensi pembelajaran' : 'Memahami konsep dasar pembelajaran dengan cukup baik',
          capaianBimbingan: s.nilaiAkhir < 75 ? 'Sangat memerlukan latihan soal remedial dan bimbingan tambahan' : 'Perlu menjaga konsistensi dalam pemahaman konsep lanjutan',
        }))
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 5. SIMPAN KE REPOSITORY DOKUMEN
  const handleSaveToRepository = () => {
    if (!onSaveDocument) return;

    let contentMarkdown = `# Laporan Analisis Nilai & Rapor Kurikulum Merdeka\n\n`;
    contentMarkdown += `**Mata Pelajaran:** ${subject} | **Kelas:** ${className}\n`;
    contentMarkdown += `**Rata-Rata Kelas:** ${stats.avg} | **Siswa:** ${stats.total}\n\n`;
    contentMarkdown += `| No | Nama Siswa | Formatif | Sumatif | Nilai Akhir | Capaian Unggul | Capaian Bimbingan |\n`;
    contentMarkdown += `|---|---|---|---|---|---|---|\n`;

    students.forEach((s, i) => {
      contentMarkdown += `| ${i + 1} | ${s.nama} | ${s.formatif} | ${s.sumatif} | **${s.nilaiAkhir}** | ${s.capaianUnggul} | ${s.capaianBimbingan} |\n`;
    });

    onSaveDocument({
      id: Date.now().toString(),
      title: `Analisis Nilai ${subject} - ${className}`,
      type: 'Analisis Rapor',
      content: contentMarkdown,
      createdAt: new Date().toISOString(),
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-800 text-white p-6 rounded-3xl shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-indigo-200 font-extrabold text-xs uppercase tracking-wider">
          <BarChart3 className="w-4 h-4"/>
          <span>Analisis Nilai & Deskripsi Rapor Kurikulum Merdeka</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight">
          Olah Nilai Siswa & Narasi Rapor Otomatis
        </h1>
        <p className="text-xs md:text-sm text-indigo-100 max-w-3xl leading-relaxed">
          Ubah angka nilai siswa menjadi kalimat narasi capaian rapor yang konstruktif, buat analisis statistik ketuntasan kelas, dan peroleh rekomendasi remedial/pengayaan.
        </p>
      </div>

      {/* STATS SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5"/>
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase">JUMLAH SISWA</p>
            <p className="text-lg font-black text-slate-800">{stats.total} Siswa</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5"/>
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase">RATA-RATA KELAS</p>
            <p className="text-lg font-black text-indigo-600">{stats.avg}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5"/>
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase">NILAI TERTINGGI</p>
            <p className="text-lg font-black text-emerald-600">{stats.max}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5"/>
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase">NILAI TERENDAH</p>
            <p className="text-lg font-black text-rose-600">{stats.min}</p>
          </div>
        </div>
      </div>

      {/* PANEL AKSI UPLOAD & FORM TAMBAH SISWA */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Input & Import Data Nilai
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">
              Upload file CSV atau ketik nilai siswa secara manual
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Tombol Upload File CSV */}
            <label className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl cursor-pointer transition">
              <Upload className="w-4 h-4 text-slate-500"/>
              <span>Upload File CSV</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Tombol Jalankan Analisis AI */}
            <button
              onClick={handleRunAiAnalysis}
              disabled={isAnalyzing || students.length === 0}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition disabled:opacity-50"
            >
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4"/>}
              <span>{isAnalyzing ? 'Menganalisis AI...' : 'Proses Analisis AI'}</span>
            </button>
          </div>
        </div>

        {/* Input Manual Form */}
        <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Nama Siswa"
            value={newNama}
            onChange={(e) => setNewNama(e.target.value)}
            className="p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
          />
          <input
            type="number"
            placeholder="Nilai Formatif (0-100)"
            value={newFormatif}
            onChange={(e) => setNewFormatif(e.target.value)}
            className="p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
          />
          <input
            type="number"
            placeholder="Nilai Sumatif (0-100)"
            value={newSumatif}
            onChange={(e) => setNewSumatif(e.target.value)}
            className="p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl p-2.5 transition"
          >
            <Plus className="w-4 h-4"/>
            <span>Tambah Siswa</span>
          </button>
        </form>
      </div>

      {/* TABEL DATA SISWA */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider">
            DATA NILAI SISWA ({subject} - {className})
          </h2>

          <div className="flex items-center gap-2">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="p-1.5 text-xs font-bold border border-slate-200 rounded-xl outline-none"
            >
              <option value="Matematika">Matematika</option>
              <option value="Bahasa Indonesia">Bahasa Indonesia</option>
              <option value="IPA">IPA</option>
              <option value="IPS">IPS</option>
            </select>

            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="p-1.5 text-xs font-bold border border-slate-200 rounded-xl outline-none"
            >
              <option value="Kelas VIII-A">Kelas VIII-A</option>
              <option value="Kelas VIII-B">Kelas VIII-B</option>
              <option value="Kelas IX-A">Kelas IX-A</option>
            </select>

            <button
              onClick={handleSaveToRepository}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition ${
                isSaved
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {isSaved ? <Check className="w-3.5 h-3.5"/> : <Save className="w-3.5 h-3.5 text-slate-500"/>}
              <span>{isSaved ? 'Tersimpan!' : 'Simpan Ke Repository'}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase">
                <th className="p-3 w-12 text-center">NO</th>
                <th className="p-3 min-w-[180px]">NAMA SISWA</th>
                <th className="p-3 text-center">FORMATIF</th>
                <th className="p-3 text-center">SUMATIF</th>
                <th className="p-3 text-center">NILAI AKHIR</th>
                <th className="p-3 min-w-[320px]">CAPAIAN UNGGUL & BIMBINGAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {students.map((student, index) => {
                const isHigh = student.nilaiAkhir >= 85;
                const isLow = student.nilaiAkhir < 70;

                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 text-center font-bold text-slate-400">{index + 1}</td>
                    <td className="p-3 font-extrabold text-slate-800">{student.nama}</td>
                    <td className="p-3 text-center font-medium text-slate-600">{student.formatif}</td>
                    <td className="p-3 text-center font-medium text-slate-600">{student.sumatif}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`font-black px-2 py-1 rounded-lg text-xs ${
                          isHigh
                            ? 'bg-emerald-50 text-emerald-600'
                            : isLow
                            ? 'bg-rose-50 text-rose-600'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {student.nilaiAkhir}
                      </span>
                    </td>
                    <td className="p-3 space-y-1">
                      <p className="text-[11px] font-bold text-emerald-700 leading-snug">
                        + {student.capaianUnggul || 'Sangat baik dalam pemecahan masalah.'}
                      </p>
                      <p className="text-[11px] font-bold text-rose-600 leading-snug">
                        - {student.capaianBimbingan || 'Perlu peningkatan latihan mandiri.'}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NilaiSiswaPage;