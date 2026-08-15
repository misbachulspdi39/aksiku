import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { SavedDocument } from '../types';
import { FolderKanban, Search, FileText, Calendar, Tag, Trash2, Download, ExternalLink, Filter } from 'lucide-react';

interface RepositoryPageProps {
  savedDocs: SavedDocument[];
}

export const RepositoryPage: React.FC<RepositoryPageProps> = ({ savedDocs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<SavedDocument | null>(null);

  // Filter dokumen berdasarkan pencarian & kategori
  const filteredDocs = savedDocs.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownloadTxt = (doc: SavedDocument) => {
    const element = document.createElement('a');
    const file = new Blob([doc.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${doc.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-800 to-indigo-900 text-white p-6 rounded-2xl shadow-md space-y-2">
        <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
          <FolderKanban className="w-4 h-4" />
          <span>Arsip & Penyimpanan Digital</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Repository Dokumen Pembelajaran
        </h1>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
          Kelola, cari, dan tinjau kembali seluruh perangkat ajar, hasil analisis nilai, serta dokumen administrasi yang telah Anda buat.
        </p>
      </div>

      {/* Bar Pencarian & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan judul atau kata kunci..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 text-xs">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {['all', 'Modul Ajar', 'Analisis Rapor', 'Soal / Rubrik', 'Surat'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'Semua Dokumen' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Dokumen / Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* List Dokumen */}
        <div className="md:col-span-1 space-y-3">
          <h2 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider px-1">
            Daftar Dokumen ({filteredDocs.length})
          </h2>

          {filteredDocs.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-600">Belum Ada Dokumen</p>
              <p className="text-[11px] text-slate-400">
                Dokumen yang disimpan dari Modul Ajar, Rapor, atau Surat akan tampil di sini.
              </p>
            </div>
          ) : (
            filteredDocs.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                      {doc.type || 'Dokumen'}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3" />
                      {new Date(doc.createdAt || Date.now()).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  <h3 className="text-xs font-extrabold text-slate-800 line-clamp-2 leading-snug">
                    {doc.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {doc.content}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Detail Preview Dokumen */}
        <div className="md:col-span-2">
          {selectedDoc ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 sticky top-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                    {selectedDoc.type || 'Dokumen'}
                  </span>
                  <h2 className="text-base font-extrabold text-slate-800 mt-1">
                    {selectedDoc.title}
                  </h2>
                </div>

                <button
                  onClick={() => handleDownloadTxt(selectedDoc)}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh TXT</span>
                </button>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed max-h-[500px] overflow-y-auto">
                <ReactMarkdown>{selectedDoc.content}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400 space-y-2">
              <ExternalLink className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-600">Pilih Dokumen untuk Melihat Detail</p>
              <p className="text-[11px] text-slate-400">
                Klik salah satu dokumen dari daftar di sebelah kiri.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepositoryPage;