import React, { useState } from 'react';
import { SavedDocument, UserProfile } from './types';

// Import Halaman Utama & Fitur
import DashboardPage from './pages/DashboardPage';
import WorkflowPage from './pages/WorkflowPage';
import AiChatPage from './pages/AiChatPage';
import ModulAjarGenerator from './pages/ModulAjarGenerator';
import RppAtpTpPage from './pages/RppAtpTpPage';
import LkpdMateriPage from './pages/LkpdMateriPage';
import PptGeneratorPage from './pages/PptGeneratorPage';
import SoalRubrikPage from './pages/SoalRubrikPage';
import { NilaiSiswaPage } from './pages/NilaiSiswaPage';
import SuratAdministrasiPage from './pages/SuratAdministrasiPage';
import { KomunikasiPage } from './pages/KomunikasiPage';
import RepositoryPage from './pages/RepositoryPage';
import RoadmapPage from './pages/RoadmapPage';

// Import Halaman Autentikasi & Admin (Named Import)
import { LoginPage } from './pages/LoginPage';
import { AdminUserPage } from './pages/AdminUserPage';

// Import Icons (Lucide React)
import {
  LayoutDashboard,
  Zap,
  MessageSquare,
  BookOpen,
  FileText,
  FileCheck,
  Presentation,
  HelpCircle,
  BarChart3,
  Mail,
  Send,
  FolderKanban,
  Map,
  Sparkles,
  GraduationCap,
  Users,
  LogOut,
  ShieldCheck
} from 'lucide-react';

type ActivePage =
  | 'dashboard'
  | 'workflow'
  | 'chat'
  | 'modul'
  | 'rpp'
  | 'lkpd'
  | 'ppt'
  | 'soal'
  | 'rapor'
  | 'surat'
  | 'wa_ortu'
  | 'repository'
  | 'roadmap'
  | 'admin_users';

export default function App() {
  // State Autentikasi User (Mengecek Sesi Login dari LocalStorage)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('eduai_user_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentPage, setCurrentPage] = useState<ActivePage>('dashboard');
  const [savedDocs, setSavedDocs] = useState<SavedDocument[]>([]);

  // Handler Login
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('eduai_user_session', JSON.stringify(user));
    // Jika login sebagai admin, langsung arahkan ke Manajemen Pengguna
    if (user.role === 'admin') {
      setCurrentPage('admin_users');
    } else {
      setCurrentPage('dashboard');
    }
  };

  // Handler Logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('eduai_user_session');
  };

  // Handler untuk menyimpan dokumen ke Repository
  const handleSaveDocument = (doc: SavedDocument) => {
    setSavedDocs((prev) => [doc, ...prev]);
  };

  // KONDISI 1: Jika Belum Login -> Tampilkan Halaman Login
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // KONDISI 2: Jika User Diblokir / Status Langganan Nonaktif
  if (!currentUser.isActive) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-3xl max-w-md text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto font-black text-xl">
            !
          </div>
          <h2 className="text-xl font-black text-slate-800">Masa Langganan Habis</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Akun Anda (<b>{currentUser.email}</b>) saat ini sedang tidak aktif atau masa berlangganan telah berakhir. Silakan hubungi Administrator untuk perpanjangan akun.
          </p>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition"
          >
            Keluar & Gunakan Akun Lain
          </button>
        </div>
      </div>
    );
  }

  // Daftar Menu Navigasi Berdasarkan Role
  const navigationItems = [
    ...(currentUser.role === 'admin'
      ? [
          {
            group: 'PANEL ADMINISTRATOR',
            items: [
              { id: 'admin_users', label: 'Kelola Pengguna', icon: Users, badge: 'Admin' },
            ]
          }
        ]
      : []),
    {
      group: 'MENU UTAMA',
      items: [
        { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
        { id: 'workflow', label: 'Workflow AI 10-in-1', icon: Zap, badge: 'Super AI' },
        { id: 'chat', label: 'AI Chat Guru', icon: MessageSquare },
      ]
    },
    {
      group: 'PERENCANAAN',
      items: [
        { id: 'modul', label: 'Modul Ajar & RPP', icon: BookOpen },
        { id: 'rpp', label: 'RPP, ATP & TP', icon: FileText },
        { id: 'lkpd', label: 'LKPD & Materi', icon: FileCheck },
        { id: 'ppt', label: 'PowerPoint PPT', icon: Presentation },
      ]
    },
    {
      group: 'ASESMEN & NILAI',
      items: [
        { id: 'soal', label: 'Bank Soal & Rubrik', icon: HelpCircle },
        { id: 'rapor', label: 'Analisis Nilai & Rapor', icon: BarChart3 },
      ]
    },
    {
      group: 'ADMINISTRASI',
      items: [
        { id: 'surat', label: 'Surat & Administrasi', icon: Mail },
        { id: 'wa_ortu', label: 'Pesan WA Ortu', icon: Send },
        { id: 'repository', label: 'Repository Dokumen', icon: FolderKanban },
        { id: 'roadmap', label: 'Roadmap EduAI', icon: Map },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0 shadow-xl">
        
        {/* Bagian Atas: Logo & Menu */}
        <div className="flex-1 min-h-0 flex flex-col">
          {/* Logo Brand */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/40 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white text-base shadow-md shadow-blue-500/20">
                A
              </div>
              <div>
                <h1 className="font-extrabold text-white text-sm tracking-wide leading-none">
                  EduAI School
                </h1>
                <p className="text-[10px] text-blue-400 font-bold mt-1 tracking-wider uppercase">
                  AKSIKU • Kurikulum Merdeka
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/60 px-2.5 py-0.5 rounded-full shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Edisi SLB & Inklusi
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-3 space-y-4 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-800">
            {navigationItems.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  {group.group}
                </p>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentPage(item.id as ActivePage)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 font-bold'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                        <span className="truncate tracking-wide">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md shrink-0 ${
                          item.badge === 'Admin' ? 'bg-purple-500 text-white' : 'bg-indigo-500 text-white'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Bagian Bawah: Info User & Tombol LOGOUT */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 shrink-0">
          <div className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50 shadow-sm">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">{currentUser.role}</p>
            </div>
            
            <button
              onClick={handleLogout}
              title="Keluar / Logout"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs rounded-lg transition shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP HEADER NAVBAR */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Lisensi Aktif</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage('workflow')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-md shadow-blue-500/20 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Workflow AI 10-in-1</span>
            </button>

            <div className="flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200">
              {currentUser.role === 'admin' ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>Administrator</span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>{currentUser.schoolName || 'Guru Mata Pelajaran'}</span>
                </>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT DYNAMIC RENDER */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6">
          {currentPage === 'admin_users' && currentUser.role === 'admin' && <AdminUserPage />}
          {currentPage === 'dashboard' && (
            <DashboardPage onNavigate={(page) => setCurrentPage(page as ActivePage)} />
          )}
          {currentPage === 'workflow' && <WorkflowPage />}
          {currentPage === 'chat' && <AiChatPage />}
          {currentPage === 'modul' && <ModulAjarGenerator />}
          {currentPage === 'rpp' && <RppAtpTpPage />}
          {currentPage === 'lkpd' && <LkpdMateriPage />}
          {currentPage === 'ppt' && <PptGeneratorPage />}
          {currentPage === 'soal' && <SoalRubrikPage />}
          
          {currentPage === 'rapor' && (
            <NilaiSiswaPage onSaveDocument={handleSaveDocument} />
          )}

          {currentPage === 'surat' && <SuratAdministrasiPage />}
          {currentPage === 'wa_ortu' && <KomunikasiPage />}
          {currentPage === 'repository' && (
            <RepositoryPage savedDocs={savedDocs} />
          )}
          {currentPage === 'roadmap' && <RoadmapPage />}
        </main>
      </div>
    </div>
  );
}