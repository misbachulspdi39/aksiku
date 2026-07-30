import React, { useState } from 'react';
import { SavedDocument } from '../types';
import {
  FolderOpen,
  Search,
  FileText,
  Trash2,
  Eye,
  Download,
  Tag,
  Clock,
  Sparkles,
} from 'lucide-react';

interface RepositoryPageProps {
  documents: SavedDocument[];
  onOpenViewer: (doc: SavedDocument) => void;
  onDeleteDocument: (docId: string) => void;
}

export const RepositoryPage: React.FC<RepositoryPageProps> = ({
  documents,
  onOpenViewer,
  onDeleteDocument,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterType, setSelectedFilterType] = useState<string>('all');

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.docType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedFilterType === 'all' || doc.docType === selectedFilterType;

    return matchesSearch && matchesType;
  });

  const handleDownloadDoc = (doc: SavedDocument) => {
    const blob = new Blob([doc.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
          <FolderOpen className="w-4 h-4" />
          <span>Repository Dokumen & Arsip Perencanaan AI</span>
        </div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Penyimpanan Terpusat Administrasi Guru
        </h1>
        <p className="text-xs text-slate-600">
          Kelola, cari, lihat, cetak, dan unduh seluruh dokumen yang telah Anda hasilkan dari Workflow AI, Modul Ajar, Bank Soal, Slide PPT, dan Surat Administrasi.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="repo-search-input"
            placeholder="Cari dokumen, mata pelajaran..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto text-xs">
          {[
            { id: 'all', label: 'Semua Dokumen' },
            { id: 'Super Workflow Package', label: 'Paket Workflow' },
            { id: 'Modul Ajar', label: 'Modul Ajar' },
            { id: 'PowerPoint', label: 'PPT' },
            { id: 'Bank Soal', label: 'Bank Soal' },
            { id: 'LKPD', label: 'LKPD' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedFilterType(type.id)}
              id={`repo-filter-${type.id}`}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedFilterType === type.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Belum Ada Dokumen Tersimpan</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Gunakan fitur Super Workflow AI atau Generator Modul Ajar untuk membuat dokumen pertama Anda, lalu simpan ke repository ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-100">
                    {doc.docType}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {doc.createdAt}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {doc.title}
                </h3>

                {doc.metadata?.subject && (
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {doc.metadata.subject} ({doc.metadata.grade || 'Umum'})
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenViewer(doc)}
                  id={`repo-view-${doc.id}`}
                  className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 font-semibold px-3 py-1.5 rounded-xl text-slate-700 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat / Cetak</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDownloadDoc(doc)}
                    id={`repo-download-${doc.id}`}
                    title="Unduh File .md"
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteDocument(doc.id)}
                    id={`repo-delete-${doc.id}`}
                    title="Hapus Dokumen"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
