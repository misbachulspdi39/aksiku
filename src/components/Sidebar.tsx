import React from 'react';
import { UserProfile } from '../types';
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
  Users,
  LogOut,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  currentUser,
  onLogout
}) => {
  // Seluruh daftar menu LENGKAP tanpa ada yang dipotong
  const menuGroups = [
    ...(currentUser?.role === 'admin'
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
    <aside className="w-68 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col h-screen sticky top-0 select-none shadow-xl shrink-0 font-sans">
      
      {/* Header Brand */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-black text-lg text-white tracking-wide leading-none">
              EduAI School
            </h1>
            <p className="text-[10px] font-extrabold text-blue-400 mt-1 tracking-wider uppercase">
              AKSIKU • Kurikulum Merdeka
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/60 px-2.5 py-0.5 rounded-full shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Edisi SLB & Inklusi
          </span>
        </div>
      </div>

      {/* Navigasi Scrollable */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <h2 className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
              {group.group}
            </h2>

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 font-bold'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                      }`}
                    />
                    <span className="truncate tracking-wide">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md shrink-0 ${
                      item.badge === 'Admin' 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-indigo-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Info & Logout (jika ada) */}
      {currentUser && (
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 shrink-0">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">{currentUser.role}</p>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                title="Keluar / Logout"
                className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};