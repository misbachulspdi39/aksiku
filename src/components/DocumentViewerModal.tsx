import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // Disarankan agar tabel & list Markdown rendernya sempurna
import { SavedDocument } from '../types';
import { X, Copy, Download, Printer, BookmarkCheck, Check } from 'lucide-react';

interface DocumentViewerModalProps {
  document: SavedDocument | null;
  onClose: () => void;
  onSaveToRepository?: (doc: SavedDocument) => void;
  isSavedInRepo?: boolean;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document: docItem,
  onClose,
  onSaveToRepository,
  isSavedInRepo = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [savedLocally, setSavedLocally] = useState(isSavedInRepo);

  if (!docItem) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(docItem.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      // Mengambil style typography dari halaman agar tampilan cetak rapi
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${docItem.title}</title>
            <style>
              body { 
                font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; 
                padding: 40px; 
                line-height: 1.6; 
                color: #1e293b; 
              }
              h1, h2, h3 { color: #0f172a; margin-top: 20px; }
              h2 { border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; }
              table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 14px; }
              th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
              th { background-color: #f8fafc; font-weight: bold; }
              .meta-info { font-size: 12px; color: #64748b; margin-bottom: 20px; }
              hr { border: none; border-top: 1px solid #e2e8f0; margin: 20px 0; }
            </style>
          </head>
          <body>
            <h2>${docItem.title}</h2>
            <div class="meta-info">
              <strong>Mata Pelajaran:</strong> ${docItem.metadata.subject || '-'} | 
              <strong>Kelas:</strong> ${docItem.metadata.grade || '-'} |
              <strong>Tanggal:</strong> ${docItem.createdAt || '-'}
            </div>
            <hr/>
            <div id="content">${docItem.content.replace(/\n/g, '<br/>')}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const handleDownloadDoc = () => {
    // FIX BUG: Perbaikan regex 0-9 untuk nama file yang valid
    const fileName = docItem.title.replace(/[^a-zA-Z0-9]/g, '_');
    
    const blob = new Blob(
      [
        `\ufeff
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <title>${docItem.title}</title>
          <style>
            body { font-family: 'Calibri', 'Arial', sans-serif; padding: 20px; line-height: 1.5; }
            h1, h2, h3 { color: #111827; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 6px; }
          </style>
        </head>
        <body>
          <h2>${docItem.title}</h2>
          <p><b>Mata Pelajaran:</b> ${docItem.metadata.subject || '-'} | <b>Kelas:</b> ${docItem.metadata.grade || '-'}</p>
          <hr/>
          <div>${docItem.content.replace(/\n/g, '<br/>')}</div>
        </body>
        </html>
      `,
      ],
      { type: 'application/msword' }
    );
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (onSaveToRepository) {
      onSaveToRepository(docItem);
      setSavedLocally(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between gap-4">
          <div>
            <span className="inline-block bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-blue-400/30 mb-1 uppercase tracking-wider">
              {docItem.docType}
            </span>
            <h2 className="text-base sm:text-lg font-bold leading-snug line-clamp-1">{docItem.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {docItem.metadata.subject ? `${docItem.metadata.subject} • ` : ''}
              {docItem.metadata.grade ? `Kelas ${docItem.metadata.grade} • ` : ''} 
              Dibuat {docItem.createdAt}
            </p>
          </div>
          <button
            onClick={onClose}
            id="doc-viewer-close-btn"
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls / Baris Tombol Aksi */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              id="doc-viewer-copy-btn"
              className="flex items-center gap-1.5 bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-300 px-3 py-1.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
            </button>

            <button
              onClick={handleDownloadDoc}
              id="doc-viewer-download-doc-btn"
              className="flex items-center gap-1.5 bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-300 px-3 py-1.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Word (.doc)</span>
            </button>

            <button
              onClick={handlePrint}
              id="doc-viewer-print-btn"
              className="flex items-center gap-1.5 bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-300 px-3 py-1.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
          </div>

          {onSaveToRepository && (
            <button
              onClick={handleSave}
              disabled={savedLocally}
              id="doc-viewer-save-repo-btn"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors shadow-sm ${
                savedLocally
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>{savedLocally ? 'Tersimpan di Repository' : 'Simpan ke Repository'}</span>
            </button>
          )}
        </div>

        {/* Content Area (Menggunakan Custom Typography .prose-document) */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white">
          <article className="prose-document">
            <Markdown remarkPlugins={[remarkGfm]}>
              {docItem.content}
            </Markdown>
          </article>
        </div>

      </div>
    </div>
  );
};