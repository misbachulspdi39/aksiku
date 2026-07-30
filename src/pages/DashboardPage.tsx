import React from 'react';
import { SavedDocument, UserRole } from '../types';
import {
  Sparkles,
  Zap,
  FileText,
  Clock,
  Layers,
  MessageSquare,
  BookOpenCheck,
  Presentation,
  HelpCircle,
  BarChart3,
  FolderArchive,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  FileEdit,
  Mail,
  MessageCircle,
} from 'lucide-react';

interface DashboardPageProps {
  currentRole: UserRole;
  documents: SavedDocument[];
  onNavigate: (tab: any) => void;
  onOpenDocument: (doc: SavedDocument) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentRole,
  documents,
  onNavigate,
  onOpenDocument,
}) => {
  const recentDocs = documents.slice(0, 4);

  const stats = [
    { title: 'Total Dokumen AI', value: documents.length + 18, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Waktu Hemat', value: '18.5 Jam/Bulan', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Kesesuaian Kurikulum', value: '100% Valid', icon: Award, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Akun Institusi', value: 'Unlimited', icon: CheckCircle2, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const quickTools = [
    { id: 'workflow', label: 'Workflow AI 10-in-1', desc: 'Olah PDF/materi menjadi paket RPP, Modul, Soal & PPT otomatis', icon: Layers, color: 'bg-indigo-600 text-white', highlight: true },
    { id: 'chat', label: 'AI Chat Guru', desc: 'Tanya ide PjBL, ice breaking & solusi tantangan kelas', icon: MessageSquare, color: 'bg-slate-900 text-white' },
    { id: 'modul-ajar', label: 'Modul Ajar & RPP', desc: 'Generator Modul Ajar Kurikulum Merdeka', icon: FileText, color: 'bg-indigo-50 text-indigo-700' },
    { id: 'rpp-atp', label: 'RPP, ATP & TP', desc: 'Rancangan Alur Tujuan Pembelajaran', icon: BookOpenCheck, color: 'bg-emerald-50 text-emerald-700' },
    { id: 'lkpd-materi', label: 'LKPD & Materi', desc: 'Lembar kerja siswa & handout materi', icon: FileEdit, color: 'bg-indigo-50 text-indigo-700' },
    { id: 'ppt', label: 'PowerPoint PPT', desc: 'Generator slide presentasi interaktif', icon: Presentation, color: 'bg-amber-50 text-amber-700' },
    { id: 'soal-rubrik', label: 'Bank Soal & Rubrik', desc: 'Bank Soal HOTS, AKM & Rubrik Penilaian', icon: HelpCircle, color: 'bg-indigo-50 text-indigo-700' },
    { id: 'nilai', label: 'Analisis Nilai & Rapor', desc: 'Deskripsi Nilai Rapor & statistik kelas', icon: BarChart3, color: 'bg-emerald-50 text-emerald-700' },
    { id: 'administrasi', label: 'Surat & Administrasi', desc: 'Surat tugas, prota, promes & administrasi', icon: Mail, color: 'bg-rose-50 text-rose-700' },
    { id: 'komunikasi', label: 'Pesan WA Ortu', desc: 'Generator pesan pengumuman & WA ortu', icon: MessageCircle, color: 'bg-sky-50 text-sky-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${s.bg} ${s.color} flex items-center justify-center flex-shrink-0 font-bold`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{s.title}</p>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Featured Hero Banner */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-900 p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 transform group-hover:scale-110 transition-transform">
          <Layers className="w-48 h-48 text-white" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-indigo-500/30 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-md border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Workflow AI: Sekali Klik Selesai</span>
          </div>
          <h2 className="text-white text-2xl sm:text-3xl font-bold tracking-tight">
            Upload 1 File PDF Materi &rarr; Hasil Lengkap Otomatis
          </h2>
          <p className="text-indigo-100 text-sm leading-relaxed max-w-xl">
            EduAI akan otomatis merangkum, membuat Modul Ajar, LKPD, PPT, Bank Soal HOTS, hingga Rubrik Evaluasi dalam satu proses terpadu.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('workflow')}
              id="dashboard-hero-workflow-btn"
              className="bg-white text-indigo-900 px-6 py-2.5 rounded-lg font-semibold text-xs flex items-center space-x-2 shadow-md hover:bg-slate-50 transition-colors active:scale-95"
            >
              <Zap className="w-4 h-4 text-indigo-600" />
              <span>Jalankan Super Workflow AI</span>
            </button>
            <button
              onClick={() => onNavigate('chat')}
              id="dashboard-hero-chat-btn"
              className="bg-indigo-500/30 text-white border border-indigo-400/30 px-5 py-2.5 rounded-lg font-semibold text-xs hover:bg-indigo-500/50 transition-colors"
            >
              <MessageSquare className="w-4 h-4 inline mr-1.5" />
              <span>Tanya AI Chat Guru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Tools Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Generator & Modul AI Sekolah</h3>
          <span className="text-xs text-slate-500 font-medium">Pilih alat AI spesifik kebutuhan Anda</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => onNavigate(tool.id)}
                id={`dashboard-tool-${tool.id}`}
                className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md transition-all text-left flex items-start gap-3.5"
              >
                <div className={`w-10 h-10 rounded-lg ${tool.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                      {tool.label}
                    </h4>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{tool.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & Repository */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FolderArchive className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-sm">Dokumen AI Terbaru</h3>
          </div>
          <button
            onClick={() => onNavigate('repository')}
            id="dashboard-view-all-repo-btn"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Lihat Semua Repository</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recentDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onOpenDocument(doc)}
              className="p-3.5 rounded-lg border border-slate-200 hover:border-indigo-300 bg-slate-50/60 hover:bg-indigo-50/20 cursor-pointer transition-all space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="bg-indigo-100 text-indigo-700 font-bold text-[10px] px-2 py-0.5 rounded">
                  {doc.docType}
                </span>
                <span className="text-[10px] text-slate-400">{doc.createdAt}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{doc.title}</h4>
              <p className="text-[11px] text-slate-500">
                {doc.metadata.subject || 'Umum'} • {doc.metadata.grade || ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
