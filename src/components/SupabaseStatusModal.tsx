import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertCircle, Copy, Check, RefreshCw, ExternalLink, X, Code } from 'lucide-react';
import {
  SUPABASE_CONFIG_INFO,
  SUPABASE_SQL_SCHEMA,
  checkSupabaseConnection,
  fetchDocumentsFromSupabase,
} from '../services/supabase';

interface SupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncDocuments?: () => void;
}

export const SupabaseStatusModal: React.FC<SupabaseStatusModalProps> = ({
  isOpen,
  onClose,
  onSyncDocuments,
}) => {
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<{ connected: boolean; tableExists: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSql, setShowSql] = useState(false);

  const runTest = async () => {
    setTesting(true);
    const result = await checkSupabaseConnection();
    setStatus(result);
    setTesting(false);
  };

  useEffect(() => {
    if (isOpen) {
      runTest();
    }
  }, [isOpen]);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-emerald-100 shadow-inner">
              <Database className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Supabase Backend Database</h3>
                <span className="bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Connected
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                {SUPABASE_CONFIG_INFO.projectName} ({SUPABASE_CONFIG_INFO.projectId})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto text-slate-800">
          {/* Live Connection Status Banner */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
              status?.connected && status?.tableExists
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : status?.connected
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {testing ? (
              <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin mt-0.5 flex-shrink-0" />
            ) : status?.connected && status?.tableExists ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between font-bold mb-0.5">
                <span>
                  {titleText(testing, status)}
                </span>
                <button
                  onClick={runTest}
                  disabled={testing}
                  className="text-[11px] text-emerald-700 underline font-semibold flex items-center gap-1 hover:text-emerald-900"
                >
                  <RefreshCw className={`w-3 h-3 ${testing ? 'animate-spin' : ''}`} />
                  Cek Ulang
                </button>
              </div>
              <p>{status?.message || 'Memeriksa status koneksi Supabase...'}</p>
            </div>
          </div>

          {/* Config Details */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 text-indigo-900">
              Detail Credentials Supabase Active
            </h4>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500 font-medium">Project Name:</span>
              <span className="col-span-2 font-semibold text-slate-800">{SUPABASE_CONFIG_INFO.projectName}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500 font-medium">Project ID:</span>
              <span className="col-span-2 font-mono text-slate-800 bg-slate-200/70 px-1.5 py-0.5 rounded w-fit text-[11px]">
                {SUPABASE_CONFIG_INFO.projectId}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500 font-medium">Rest API URL:</span>
              <span className="col-span-2 font-mono text-emerald-700 break-all text-[11px]">
                {SUPABASE_CONFIG_INFO.url}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500 font-medium">Auto Table:</span>
              <span className="col-span-2 font-medium text-slate-800">
                public.saved_documents (Modul, RPP, LKPD, PPT, Bank Soal, Dll)
              </span>
            </div>
          </div>

          {/* Database Setup Helper / SQL Toggle */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <div className="p-3.5 bg-slate-100 flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Code className="w-4 h-4 text-emerald-600" />
                <span>Skrip SQL Tabel Supabase (saved_documents)</span>
              </div>
              <button
                onClick={() => setShowSql(!showSql)}
                className="text-xs text-indigo-600 font-semibold hover:underline"
              >
                {showSql ? 'Sembunyikan SQL' : 'Lihat SQL Schema'}
              </button>
            </div>

            {showSql && (
              <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] relative overflow-x-auto max-h-48 leading-relaxed">
                <pre>{SUPABASE_SQL_SCHEMA}</pre>
                <button
                  onClick={handleCopySql}
                  className="absolute top-2 right-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-sans font-bold px-2.5 py-1 rounded shadow flex items-center gap-1"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Tersalin!' : 'Salin SQL'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <a
            href="https://supabase.com/dashboard/project/uuxkufduxidhfetpguae"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
          >
            <span>Buka Dashboard Supabase</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2">
            {onSyncDocuments && (
              <button
                onClick={onSyncDocuments}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sinkronkan Repository</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function titleText(testing: boolean, status: { connected: boolean; tableExists: boolean } | null) {
  if (testing) return 'Memeriksa Koneksi Database...';
  if (status?.connected && status?.tableExists) return 'Sistem Database Supabase Aktif & Siap';
  if (status?.connected) return 'Supabase Terhubung (Perlu Dibuat Tabel)';
  return 'Status Koneksi Supabase';
}
