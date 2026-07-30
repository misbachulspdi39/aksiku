import React from 'react';
import { UserRole } from '../types';
import { School, Sparkles, UserCheck, BookOpen, Layers, Database } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  documentCount: number;
  onOpenRepository: () => void;
  onLaunchWorkflow: () => void;
  onOpenSupabaseModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  documentCount,
  onOpenRepository,
  onLaunchWorkflow,
  onOpenSupabaseModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-3 transition-all shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 max-w-[1600px] mx-auto">
        {/* App Title & School Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
            <School className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-indigo-950 tracking-tight text-lg">EduAI School</h1>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                AI Ready: Gemini 3.6
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-slate-400" />
              Platform AI Terintegrasi Guru Indonesia • Kurikulum Merdeka
            </p>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center flex-wrap gap-2.5 w-full sm:w-auto justify-end">
          {/* Supabase Connection Status Badge */}
          {onOpenSupabaseModal && (
            <button
              onClick={onOpenSupabaseModal}
              id="header-supabase-btn"
              title="Cek Backend Supabase Database"
              className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-2.5 py-2 rounded-lg border border-emerald-200 shadow-2xs transition-all"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">Supabase DB</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>
          )}

          {/* Super Workflow Quick Launch */}
          <button
            onClick={onLaunchWorkflow}
            id="header-launch-workflow-btn"
            className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg shadow-sm transition-all duration-150 active:scale-95"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-100" />
            <span>Workflow AI 10-in-1</span>
          </button>

          {/* Role Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100/90 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700">
            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              id="header-role-select"
              className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer pr-1 py-0.5"
            >
              <option value="Guru Mata Pelajaran">Guru Mata Pelajaran</option>
              <option value="Wali Kelas">Wali Kelas</option>
              <option value="Kepala Sekolah">Kepala Sekolah</option>
            </select>
          </div>

          {/* Repository Counter */}
          <button
            onClick={onOpenRepository}
            id="header-repo-btn"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-indigo-700 bg-white hover:bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 shadow-xs transition-colors"
          >
            <span>Repository</span>
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {documentCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
