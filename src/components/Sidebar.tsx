import React from 'react';
import {
  LayoutDashboard,
  Layers,
  MessageSquare,
  FileText,
  BookOpenCheck,
  Presentation,
  HelpCircle,
  BarChart3,
  Mail,
  MessageCircle,
  FolderArchive,
  ChevronRight,
  FileEdit,
  GraduationCap,
  Compass,
} from 'lucide-react';
import { ActiveTab, UserRole } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  currentRole?: UserRole;
  onSelectTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, currentRole, onSelectTab }) => {
  const menuGroups = [
    {
      title: 'Menu Utama',
      items: [
        { id: 'dashboard' as ActiveTab, label: 'Dashboard Utama', icon: LayoutDashboard },
        {
          id: 'workflow' as ActiveTab,
          label: 'Workflow AI 10-in-1',
          icon: Layers,
          badge: 'Super AI',
          badgeColor: 'bg-indigo-600 text-white',
        },
        { id: 'chat' as ActiveTab, label: 'AI Chat Guru', icon: MessageSquare },
      ],
    },
    {
      title: 'Perencanaan',
      items: [
        { id: 'modul-ajar' as ActiveTab, label: 'Modul Ajar & RPP', icon: FileText },
        { id: 'rpp-atp' as ActiveTab, label: 'RPP, ATP & TP', icon: BookOpenCheck },
        { id: 'lkpd-materi' as ActiveTab, label: 'LKPD & Materi', icon: FileEdit },
        { id: 'ppt' as ActiveTab, label: 'PowerPoint PPT', icon: Presentation },
      ],
    },
    {
      title: 'Asesmen & Nilai',
      items: [
        { id: 'soal-rubrik' as ActiveTab, label: 'Bank Soal & Rubrik', icon: HelpCircle },
        { id: 'nilai' as ActiveTab, label: 'Analisis Nilai & Rapor', icon: BarChart3 },
      ],
    },
    {
      title: 'Administrasi',
      items: [
        { id: 'administrasi' as ActiveTab, label: 'Surat & Administrasi', icon: Mail },
        { id: 'komunikasi' as ActiveTab, label: 'Pesan WA Ortu', icon: MessageCircle },
        { id: 'repository' as ActiveTab, label: 'Repository Dokumen', icon: FolderArchive },
        { id: 'roadmap' as ActiveTab, label: 'Roadmap EduAI', icon: Compass },
      ],
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-white text-slate-700 flex-shrink-0 flex flex-col justify-between border-r border-slate-200">
      <div className="p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-65px)]">
        {/* Navigation Sections */}
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
              {group.title}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    id={`sidebar-nav-${item.id}`}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    ) : isActive ? (
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Info Footer Section */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs flex-shrink-0">
            GB
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-slate-900 truncate">Drs. Bambang S.</p>
            <p className="text-[11px] text-slate-500 truncate">{currentRole || 'Guru Biologi'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
