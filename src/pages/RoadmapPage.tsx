import React from 'react';
import { Compass, CheckCircle2, Clock, Sparkles, Rocket, Zap, Shield, Cpu } from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const milestones = [
    {
      version: 'Versi 1.0 (Rilis Saat Ini)',
      status: 'completed',
      title: 'Platform AI Administrasi Guru & Kurikulum Merdeka',
      date: 'Q3 2026',
      features: [
        'Super Workflow AI 10-in-1 (Ekstraksi PDF materi menjadi 10 dokumen sekaligus)',
        'Generator Modul Ajar Resmi Lintas Fase (Fase A - F)',
        'Generator RPP Presisi, ATP (Alur Tujuan Pembelajaran) & TP',
        'Generator LKPD Interaktif & Bahan Ajar (4 Bagian)',
        'Generator Presentation Slide Suite (PPT) dengan Catatan Guru',
        'Generator Bank Soal Variatif (HOTS & AKM) + Kunci & Pembahasan',
        'Rubrik Penilaian Autentik & Deskripsi Rapor Otomatis',
        'Surat Administrasi Sekolah & Draf Komunikasi Orang Tua',
        'AI Chat Guru Konsultan Pedagogi 24/7',
        'Repository Dokumen & Mode Cetak Langsung (A4/PDF)',
      ],
    },
    {
      version: 'Versi 1.5 (Pengembangan Tahap Berikutnya)',
      status: 'in-progress',
      title: 'Integrasi LMS & Pengolahan Kamera Nilai (OCR)',
      date: 'Q4 2026',
      features: [
        'Kamera Pemindai Lembar Jawab Siswa (OCR Auto Grading)',
        'Sinkronisasi Otomatis dengan e-Rapor Kemenristekdikti & Google Classroom',
        'Ekspor Dokumen Langsung ke Format Microsoft Word (.docx) & PDF Berstempel',
        'Generator Soal Berbasis Gambar & Diagram Ilustrasi Sains',
        'Kolaborasi Real-Time Rapat Kurikulum Antar Guru',
      ],
    },
    {
      version: 'Versi 2.0 (Masa Depan)',
      status: 'upcoming',
      title: 'AI Audio Video Assistant & Personal Adaptive Learning',
      date: 'Q1 2027',
      features: [
        'Generator Video Pembelajaran Singkat (AI Avatar Guru Explainer)',
        'Kloning Suara Guru untuk Narasi Presentasi Kelas',
        'Analisis Prediktif Minat & Bakat Siswa Berbasis AI Multi-Atribut',
        'Aplikasi Mobile Native (Android & iOS) dengan Akses Mode Luring (Offline)',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Roadmap Pengembangan EduAI School</span>
        </div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Rencana Inovasi Platform & Visi Transformasi Digital
        </h1>
        <p className="text-xs text-slate-600 max-w-3xl">
          Komitmen kami untuk terus memberdayakan pendidik di seluruh Indonesia melalui pemanfaatan Generative AI mutakhir yang adaptif dengan regulasi pendidikan nasional.
        </p>
      </div>

      {/* Milestones Vertical List */}
      <div className="space-y-6">
        {milestones.map((m, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-2xl border p-6 shadow-sm transition-all relative overflow-hidden ${
              m.status === 'completed'
                ? 'border-emerald-200'
                : m.status === 'in-progress'
                ? 'border-blue-300 ring-2 ring-blue-500/20'
                : 'border-slate-200 opacity-90'
            }`}
          >
            {/* Status Tag */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    m.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : m.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {m.version}
                </span>
                <span className="text-xs text-slate-400 font-medium">• Target: {m.date}</span>
              </div>

              {m.status === 'completed' && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Aktif & Siap Digunakan
                </span>
              )}
              {m.status === 'in-progress' && (
                <span className="text-xs font-bold text-blue-600 flex items-center gap-1 animate-pulse">
                  <Rocket className="w-4 h-4" /> Sedang Dikembangkan
                </span>
              )}
              {m.status === 'upcoming' && (
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Rencana Tahap Selanjutnya
                </span>
              )}
            </div>

            <h2 className="text-base font-bold text-slate-900 mb-3">{m.title}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {m.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                  <div
                    className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                      m.status === 'completed'
                        ? 'bg-emerald-500'
                        : m.status === 'in-progress'
                        ? 'bg-blue-500'
                        : 'bg-slate-300'
                    }`}
                  />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
