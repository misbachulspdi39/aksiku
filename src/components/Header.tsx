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
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-3.5 transition-all shadow-sm font-sans">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 max-w-[1700px] mx-auto">
        
        {/* App Title & School Brand */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0 transition-transform hover:scale-105">
            <School className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-black text-slate-900 tracking-tight text-xl leading-none">
                EduAI School
              </h1>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100 shadow-xs">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                AI Ready: Gemini 3.6
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mt-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Platform AI Terintegrasi Guru Indonesia • Kurikulum Merdeka</span>
            </p>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center flex-wrap gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
          
          {/* Supabase Connection Status Badge */}
          {onOpenSupabaseModal && (
            <button
              onClick={onOpenSupabaseModal}
              id="header-supabase-btn"
              title="Cek Backend Supabase Database"
              className="flex items-center gap-2 text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100/90 px-3 py-2.5 rounded-xl border border-emerald-200 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Database className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Supabase DB</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>
          )}

          {/* Super Workflow Quick Launch */}
          <button
            onClick={onLaunchWorkflow}
            id="header-launch-workflow-btn"
            className="flex items-center gap-2 text-xs font-extrabold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all active:scale-95 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-indigo-100" />
            <span>Workflow AI 10-in-1</span>
          </button>

          {/* Role Switcher */}
          <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100/80 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 transition-colors shadow-xs">
            <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              id="header-role-select"
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer pr-1 py-0.5 text-xs"
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
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-700 bg-white hover:bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <span>Repository</span>
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-xs">
              {documentCount}
            </span>
          </button>

        </div>
      </div>
    </header>
  );
};