import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { SavedDocument } from '../types';
import { X, Copy, Download, Printer, BookmarkCheck, Check, Share2 } from 'lucide-react';

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
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${docItem.title}</title>
            <style>
              body { font-family: 'Times New Roman', serif; padding: 40px; line-height: 1.6; color: #111; }
              h1, h2, h3 { color: #000; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
              table { width: 100%; border-collapse: collapse; margin: 15px 0; }
              th, td { border: 1px solid #333; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h2>${docItem.title}</h2>
            <p><strong>Mata Pelajaran:</strong> ${docItem.metadata.subject || '-'} | <strong>Kelas:</strong> ${docItem.metadata.grade || '-'}</p>
            <hr/>
            <div id="content">${docItem.content.replace(/\n/g, '<br/>')}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const handleDownloadDoc = () => {
    const blob = new Blob(
      [
        `\ufeff
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><title>${docItem.title}</title>
        <style>body { font-family: Arial, sans-serif; padding: 20px; }</style>
        </head>
        <body>
        <h2>${docItem.title}</h2>
        <div>${docItem.content.replace(/\n/g, '<br/>')}</div>
        </body></html>
      `,
      ],
      { type: 'application/msword' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docItem.title.replace(/[^a-zA-Z0-0]/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between gap-4">
          <div>
            <span className="inline-block bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-blue-400/30 mb-1">
              {docItem.docType}
            </span>
            <h2 className="text-base sm:text-lg font-bold leading-snug line-clamp-1">{docItem.title}</h2>
            <p className="text-xs text-slate-400">
              {docItem.metadata.subject ? `${docItem.metadata.subject} • ` : ''}
              {docItem.metadata.grade || ''} • Dibuat {docItem.createdAt}
            </p>
          </div>
          <button
            onClick={onClose}
            id="doc-viewer-close-btn"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              id="doc-viewer-copy-btn"
              className="flex items-center gap-1.5 bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-300 px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
            </button>

            <button
              onClick={handleDownloadDoc}
              id="doc-viewer-download-doc-btn"
              className="flex items-center gap-1.5 bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-300 px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Word (.doc)</span>
            </button>

            <button
              onClick={handlePrint}
              id="doc-viewer-print-btn"
              className="flex items-center gap-1.5 bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-300 px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>

          {onSaveToRepository && (
            <button
              onClick={handleSave}
              disabled={savedLocally}
              id="doc-viewer-save-repo-btn"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors ${
                savedLocally
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>{savedLocally ? 'Tersimpan di Repository' : 'Simpan ke Repository'}</span>
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800 text-sm leading-relaxed space-y-4">
          <div className="markdown-body prose prose-slate max-w-none">
            <Markdown>{docItem.content}</Markdown>
          </div>
        </div>
      </div>
    </div>
  );
};
