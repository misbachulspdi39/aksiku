import React, { useState } from 'react';
import { QuestionItem } from '../types';
import { HelpCircle, Eye, EyeOff, CheckCircle2, Copy, Check, Printer } from 'lucide-react';

interface QuestionBankViewerProps {
  questions: QuestionItem[];
  title?: string;
}

export const QuestionBankViewer: React.FC<QuestionBankViewerProps> = ({ questions, title }) => {
  const [showAnswerKeys, setShowAnswerKeys] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('Semua');

  if (!questions || questions.length === 0) return null;

  const filteredQuestions =
    selectedType === 'Semua' ? questions : questions.filter((q) => q.type === selectedType);

  const handleCopyQuestions = () => {
    const text = questions
      .map((q) => {
        let qText = `${q.number}. [${q.type} - ${q.bloomTaxonomy}] ${q.question}\n`;
        if (q.options && q.options.length > 0) {
          qText += q.options.map((o) => `   ${o}`).join('\n') + '\n';
        }
        if (showAnswerKeys) {
          qText += `   > KUNCI JAWABAN: ${q.correctAnswer}\n   > PEMBAHASAN: ${q.explanation}\n`;
        }
        return qText;
      })
      .join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintExam = () => {
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${title || 'Naskah Soal Evaluasi'}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 30px; line-height: 1.5; color: #111; }
              .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
              .question-item { margin-bottom: 15px; page-break-inside: avoid; }
              .options { margin-left: 20px; }
              .answer-box { background: #f9f9f9; padding: 8px; border-left: 3px solid #00a86b; margin-top: 5px; font-size: 13px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>${title || 'NASKAH SOAL EVALUASI PEMBELAJARAN'}</h2>
              <p>Nama Siswa: ............................................ Kelas: .................... Tanggal: ....................</p>
            </div>
            ${questions
              .map(
                (q) => `
              <div class="question-item">
                <p><strong>${q.number}.</strong> ${q.question}</p>
                ${
                  q.options
                    ? `<div class="options">${q.options.map((o) => `<p>${o}</p>`).join('')}</div>`
                    : ''
                }
                ${
                  showAnswerKeys
                    ? `<div class="answer-box"><strong>Kunci Jawaban:</strong> ${q.correctAnswer}<br/><strong>Pembahasan:</strong> ${q.explanation}</div>`
                    : ''
                }
              </div>
            `
              )
              .join('')}
          </body>
        </html>
      `);
      printWin.document.close();
      printWin.focus();
      printWin.print();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Bank Soal & Asesmen ({questions.length} Nomor)</h3>
            <p className="text-xs text-slate-500">{title || 'Evaluasi Kurikulum Merdeka'}</p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Answer Keys Toggle */}
          <button
            onClick={() => setShowAnswerKeys(!showAnswerKeys)}
            id="soal-toggle-keys-btn"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              showAnswerKeys
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {showAnswerKeys ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showAnswerKeys ? 'Sembunyikan Kunci & Pembahasan' : 'Tampilkan Kunci & Pembahasan'}</span>
          </button>

          <button
            onClick={handleCopyQuestions}
            id="soal-copy-btn"
            className="flex items-center gap-1.5 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg font-medium"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin Soal'}</span>
          </button>

          <button
            onClick={handlePrintExam}
            id="soal-print-btn"
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Naskah Ujian</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-medium">Tipe:</span>
        {['Semua', 'Pilihan Ganda', 'Essay', 'Benar Salah', 'HOTS', 'AKM'].map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
              selectedType === t
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => (
          <div key={q.id} className="p-4 rounded-xl border border-slate-200 hover:border-blue-200 bg-slate-50/50 transition-colors space-y-2 text-xs text-slate-800">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center text-xs">
                  {q.number}
                </span>
                <span>{q.question}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded border border-indigo-200 text-[10px]">
                  {q.bloomTaxonomy}
                </span>
                <span className="bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded border border-slate-200 text-[10px]">
                  {q.type}
                </span>
              </div>
            </div>

            {/* Options if choice */}
            {q.options && q.options.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-8 mt-2 font-medium text-slate-700">
                {q.options.map((opt, i) => (
                  <div key={i} className="p-2 rounded-lg bg-white border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Answer Key & Explanation */}
            {showAnswerKeys && (
              <div className="mt-3 ml-8 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1 animate-in fade-in">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Kunci Jawaban: {q.correctAnswer}</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  <strong>Pembahasan:</strong> {q.explanation}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
