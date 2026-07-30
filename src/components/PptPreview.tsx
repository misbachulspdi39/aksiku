import React, { useState } from 'react';
import { PptSlide } from '../types';
import { Presentation, ChevronLeft, ChevronRight, Copy, Check, Eye, Lightbulb, MessageSquare } from 'lucide-react';

interface PptPreviewProps {
  slides: PptSlide[];
  topicTitle?: string;
}

export const PptPreview: React.FC<PptPreviewProps> = ({ slides, topicTitle }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showNotes, setShowNotes] = useState(true);

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[currentSlideIndex];

  const handleCopyAll = () => {
    const formatted = slides
      .map(
        (s) =>
          `SLIDE ${s.slideNumber}: ${s.title}\n` +
          (s.subtitle ? `Subjudul: ${s.subtitle}\n` : '') +
          `Poin-poin:\n${s.bulletPoints.map((b) => `- ${b}`).join('\n')}\n` +
          (s.speakerNotes ? `Catatan Guru: ${s.speakerNotes}\n` : '') +
          `-----------------------------------\n`
      )
      .join('\n');

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <Presentation className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Pratinjau Slide PowerPoint ({slides.length} Slide)</h3>
            <p className="text-xs text-slate-500">{topicTitle || 'Materi Pembelajaran'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotes(!showNotes)}
            id="ppt-toggle-notes-btn"
            className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showNotes ? 'Sembunyikan Catatan' : 'Tampilkan Catatan'}</span>
          </button>
          <button
            onClick={handleCopyAll}
            id="ppt-copy-all-btn"
            className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-medium shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin Semua Slide'}</span>
          </button>
        </div>
      </div>

      {/* Main Slide Canvas (Aspect 16:9) */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 min-h-[300px] flex flex-col justify-between shadow-xl relative overflow-hidden">
        {/* Slide Number Badge */}
        <div className="flex justify-between items-center text-xs text-slate-400 font-mono border-b border-slate-800 pb-2">
          <span>EduAI Presentation Suite</span>
          <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded-md font-bold">
            Slide {currentSlide.slideNumber} / {slides.length}
          </span>
        </div>

        {/* Slide Content */}
        <div className="my-6 space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight">{currentSlide.title}</h2>
          {currentSlide.subtitle && (
            <p className="text-sm font-medium text-slate-300 italic">{currentSlide.subtitle}</p>
          )}

          <ul className="space-y-2 mt-4 text-sm text-slate-200">
            {currentSlide.bulletPoints.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Visual Suggestion Footer */}
        {currentSlide.visualSuggestion && (
          <div className="bg-slate-800/80 rounded-xl p-3 text-xs text-slate-300 flex items-center gap-2 border border-slate-700/50">
            <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              <strong>Saran Visual:</strong> {currentSlide.visualSuggestion}
            </span>
          </div>
        )}
      </div>

      {/* Speaker Notes */}
      {showNotes && currentSlide.speakerNotes && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
          <MessageSquare className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block text-amber-950">Catatan Penyampaian Guru (Speaker Notes):</strong>
            <p className="mt-0.5 leading-relaxed">{currentSlide.speakerNotes}</p>
          </div>
        </div>
      )}

      {/* Slide Navigation Dots & Arrows */}
      <div className="flex items-center justify-between pt-2">
        <button
          disabled={currentSlideIndex === 0}
          onClick={() => setCurrentSlideIndex((prev) => prev - 1)}
          id="ppt-prev-slide-btn"
          className="flex items-center gap-1 text-xs font-medium text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:text-blue-600"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Sebelumnya</span>
        </button>

        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[200px] sm:max-w-xs px-2 py-1">
          {slides.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`w-6 h-6 rounded-md text-[11px] font-bold flex items-center justify-center transition-all ${
                idx === currentSlideIndex
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s.slideNumber}
            </button>
          ))}
        </div>

        <button
          disabled={currentSlideIndex === slides.length - 1}
          onClick={() => setCurrentSlideIndex((prev) => prev + 1)}
          id="ppt-next-slide-btn"
          className="flex items-center gap-1 text-xs font-medium text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:text-blue-600"
        >
          <span>Berikutnya</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
