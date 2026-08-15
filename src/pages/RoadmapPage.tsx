import React from 'react';
import { Map, CheckCircle2, Clock, Sparkles, Rocket, Compass, Layers } from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const roadmapItems = [
    {
      phase: 'Fase 1: Fondasi AI Administrasi',
      status: 'Selesai (Active)',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
      description: 'Pengembangan generator instan untuk dokumen pokok guru dan administrasi sekolah.',
      features: [
        'Generator Modul Ajar & RPP Kurikulum Merdeka',
        'Penyusun ATP & CP Otomatis',
        'Generator Soal & Rubrik Penilaian',
        'Draf Pesan Komunikasi WA Orang Tua'
      ]
    },
    {
      phase: 'Fase 2: Asesmen & Analisis Nilai Terpadu',
      status: 'Dalam Pengembangan',
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      icon: Clock,
      description: 'Fitur pengolahan nilai siswa, analisis capaian pembelajaran, dan narasi rapor instan.',
      features: [
        'Analisis Statistik Nilai Siswa (Rata-rata, Min, Maks)',
        'Generator Narasi Deskripsi Rapor Kurikulum Merdeka',
        'Repository Dokumen Terintegrasi',
        'Ekspor Laporan Rapor & Hasil Belajar'
      ]
    },
    {
      phase: 'Fase 3: Integrasi Pembelajaran Visual & PPT',
      status: 'Rencana Mendatang',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: Rocket,
      description: 'Peningkatan kemampuan AI dalam merancang media pembelajaran visual dan presentasi.',
      features: [
        'Generator Slide PPT Interaktif & Speaker Notes',
        'Visual Mind Map / Peta Konsep Pembelajaran',
        'Rekomendasi Video & Media Pembelajaran Interaktif',
        'Penyusun LKPD Berbasis Gambar/Diagram'
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 rounded-2xl shadow-md space-y-2">
        <div className="flex items-center gap-2 text-indigo-200 font-bold text-xs uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Pengembangan Berkelanjutan</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Roadmap Fitur EduAI School
        </h1>
        <p className="text-xs md:text-sm text-indigo-100 max-w-2xl">
          Rencana peta jalan pengembangan aplikasi EduAI School dalam membantu efisiensi kerja guru dan modernisasi pendidikan.
        </p>
      </div>

      {/* Grid Timeline Roadmap */}
      <div className="space-y-4">
        {roadmapItems.map((item, index) => {
          const StatusIcon = item.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h2 className="text-sm font-extrabold text-slate-800">
                    {item.phase}
                  </h2>
                </div>

                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold w-fit ${item.badgeColor}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  <span>{item.status}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {item.description}
              </p>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                  Fitur Utama
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
                  {item.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapPage;