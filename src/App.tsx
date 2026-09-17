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
  ShieldCheck,
  Heart,
  Menu,
  X
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State untuk Toggle Sidebar Mobile

  // Handler Login
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('eduai_user_session', JSON.stringify(user));
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
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden relative">
      
      {/* BACKDROP OVERLAY UNTUK MOBILE */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-[290px] sm:w-[320px] bg-slate-900 text-slate-300 border-r border-slate-800 
        flex flex-col justify-between shrink-0 h-screen shadow-2xl md:shadow-xl
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* Bagian Atas: Logo & Menu */}
        <div className="flex-1 min-h-0 flex flex-col">
          
          {/* Logo Brand & Judul Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/40 shrink-0 relative">
            
            {/* Tombol Tutup Sidebar untuk Tampilan HP */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3 pr-6 md:pr-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white text-xl shadow-md shadow-blue-500/20 shrink-0 mt-0.5">
                A
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="font-extrabold text-xs sm:text-sm md:text-base text-white leading-tight tracking-wide">
                  AKSIKU : Aplikasi Kreatif dan Asisten Kecerdasan Artifisial untuk Guru
                </h1>
                <p className="text-[10px] sm:text-xs text-blue-400 font-extrabold mt-1.5 tracking-wider uppercase">
                  KREATIF DAN EFISIEN BERKARYA
                </p>
              </div>
            </div>

            <div className="mt-3.5 flex items-center">
              <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/60 px-3 py-1 rounded-full shadow-inner">
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
                      onClick={() => {
                        setCurrentPage(item.id as ActivePage);
                        setIsSidebarOpen(false); // Otomatis tutup sidebar di mobile saat memilih menu
                      }}
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

        {/* Bagian Bawah: Info User, Logout, & Footer Credit */}
        <div className="border-t border-slate-800 bg-slate-950/40 shrink-0">
          <div className="p-3 pb-2">
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

          {/* Credit Developer */}
          <div className="p-3 pt-1 text-center border-t border-slate-800/50">
            <p className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1 leading-tight">
              <span>Didevelop dengan</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
              <span>oleh :</span>
            </p>
            <p className="text-xs font-bold text-slate-200 mt-0.5">
              Misbachul Munir PP
            </p>
          </div>
        </div>

      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP HEADER NAVBAR */}
        <header className="h-14 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between shrink-0 shadow-sm">
          
          {/* Tombol Hamburger (HP) + Indicator Lisensi */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Buka Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden sm:inline">Lisensi Aktif</span>
            </div>
          </div>

          {/* Akses Cepat + Profil Topbar */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                setCurrentPage('workflow');
                setIsSidebarOpen(false);
              }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md shadow-blue-500/20 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Workflow AI 10-in-1</span>
              <span className="sm:hidden">Workflow</span>
            </button>

            <div className="flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200">
              {currentUser.role === 'admin' ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span className="hidden sm:inline">Administrator</span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span className="truncate max-w-[100px] sm:max-w-none">
                    {currentUser.schoolName || 'Guru'}
                  </span>
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