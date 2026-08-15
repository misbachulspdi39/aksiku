import React from 'react';
import { 
  FileText, 
  MessageSquare, 
  Layers, 
  Sparkles, 
  BookOpen, 
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const recentActivities = [
    { id: 1, title: 'Modul Ajar IPA Sistem Pencernaan', date: 'Baru saja', type: 'Modul Ajar' },
    { id: 2, title: 'Konsultasi Strategi Pembelajaran SLB', date: '10 menit lalu', type: 'AI Chat' },
    { id: 3, title: 'LKPD Interaktif Matematika Fase D', date: '1 jam lalu', type: 'LKPD' },
  ];

  const quickStats = [
    { label: 'Modul Dihasilkan', value: '18', icon: FileText, color: 'from-blue-500 to-indigo-600', textColor: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Sesi Chat AI', value: '42', icon: MessageSquare, color: 'from-emerald-500 to-teal-600', textColor: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { label: 'Batch Workflow', value: '10', icon: Layers, color: 'from-purple-500 to-violet-600', textColor: 'text-purple-600', bgColor: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans text-slate-800 antialiased">
      
      {/* Hero Welcome Banner Modern */}
      <div className="relative overflow-hidden p-8 sm:p-10 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl text-white shadow-xl border border-slate-800">
        
        {/* Decorative Background Glow Elements */}
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-1/3 -bottom-10 w-60 h-60 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-blue-200 text-xs font-extrabold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>AKSIKU — Aplikasi Administrasi Guru Esaku</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white">
            Selamat Datang di AKSIKU!
          </h1>
          
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium pt-1">
            Platform Asisten Kurikulum Merdeka Terintegrasi dengan Grok AI. Buat Modul Ajar, RPP, LKPD, Bank Soal, hingga Analisis Rapor secara otomatis dan berkualitas tinggi.
          </p>
        </div>
      </div>

      {/* Quick Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {(quickStats || []).slice(0, 3).map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx} 
              className="group p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between hover:-translate-y-1"
            >
              <div className="space-y-1">
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" /> +12%
                  </span>
                </div>
              </div>

              <div className={`p-4 rounded-2xl bg-gradient-to-tr ${stat.color} text-white shadow-md transition-transform group-hover:scale-110`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        
        {/* Header Aktivitas */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Aktivitas Dokumen Terbaru
              </h2>
              <p className="text-xs text-slate-500 font-medium">Riwayat generasi modul dan dokumen mengajar Anda</p>
            </div>
          </div>

          <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
            <span>Lihat Semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* List Aktivitas */}
        <div className="divide-y divide-slate-100">
          {(recentActivities || []).slice(0, 5).map((act) => (
            <div 
              key={act.id} 
              className="py-4 flex items-center justify-between text-sm group hover:bg-slate-50/70 px-3 rounded-2xl transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                    {act.title}
                  </p>
                  <span className="inline-block mt-0.5 text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    {act.type}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{act.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;