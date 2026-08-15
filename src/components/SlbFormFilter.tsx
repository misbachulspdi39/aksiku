import React from 'react';
import { JENIS_KEKHUSUSAN, JENJANG_SLB, MAPEL_UMUM, MAPEL_VOKASI_SLB } from '../data/slbData';

interface FormFilterProps {
  kekhususan: string;
  setKekhususan: (val: string) => void;
  jenjang: string;
  setJenjang: (val: string) => void;
  kategoriMapel: 'UMUM' | 'VOKASI';
  setKategoriMapel: (val: 'UMUM' | 'VOKASI') => void;
  mapel: string;
  setMapel: (val: string) => void;
  materi: string;
  setMateri: (val: string) => void;
  loading: boolean;
  onSubmit: () => void;
  buttonLabel: string;
}

export const SlbFormFilter: React.FC<FormFilterProps> = ({
  kekhususan,
  setKekhususan,
  jenjang,
  setJenjang,
  kategoriMapel,
  setKategoriMapel,
  mapel,
  setMapel,
  materi,
  setMateri,
  loading,
  onSubmit,
  buttonLabel
}) => {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dropdown Kekhususan */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            🎯 Jenis Kekhususan Peserta Didik
          </label>
          <select
            value={kekhususan}
            onChange={(e) => setKekhususan(e.target.value)}
            className="w-full p-2.5 border rounded-xl border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {JENIS_KEKHUSUSAN.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </div>

        {/* Dropdown Jenjang */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            🏫 Jenjang / Fase
          </label>
          <select
            value={jenjang}
            onChange={(e) => setJenjang(e.target.value)}
            className="w-full p-2.5 border rounded-xl border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {JENJANG_SLB.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </div>

        {/* Radio Kategori Mapel */}
        <div className="md:col-span-2 flex gap-6 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
            <input
              type="radio"
              name="kategoriMapel"
              checked={kategoriMapel === 'UMUM'}
              onChange={() => {
                setKategoriMapel('UMUM');
                setMapel(MAPEL_UMUM[0]);
              }}
              className="text-blue-600"
            />
            📚 Mata Pelajaran Umum / Akademik
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
            <input
              type="radio"
              name="kategoriMapel"
              checked={kategoriMapel === 'VOKASI'}
              onChange={() => {
                setKategoriMapel('VOKASI');
                setMapel(MAPEL_VOKASI_SLB[0]);
              }}
              className="text-blue-600"
            />
            🛠️ Keterampilan Vokasi SLB
          </label>
        </div>

        {/* Dropdown Mapel */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            📖 Mata Pelajaran
          </label>
          <select
            value={mapel}
            onChange={(e) => setMapel(e.target.value)}
            className="w-full p-2.5 border rounded-xl border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {(kategoriMapel === 'VOKASI' ? MAPEL_VOKASI_SLB : MAPEL_UMUM).map((m, idx) => (
              <option key={idx} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Input Materi */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            ✍️ Topik / Materi Utama Pembelajaran
          </label>
          <input
            type="text"
            value={materi}
            onChange={(e) => setMateri(e.target.value)}
            placeholder="Contoh: Menjahit Kain Perca Lurus / Pengenalan Uang Logam"
            className="w-full p-2.5 border rounded-xl border-slate-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition disabled:bg-slate-400"
      >
        {loading ? '⚡ Menyusun Dokumen SLB via Groq AI...' : buttonLabel}
      </button>
    </div>
  );
};

export default SlbFormFilter;