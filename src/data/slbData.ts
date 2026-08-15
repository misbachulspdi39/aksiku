export interface SelectOption {
  id: string;
  label: string;
}

export const JENIS_KEKHUSUSAN: SelectOption[] = [
  { id: 'AUTIS', label: 'Autis / Spektrum Autisme' },
  { id: 'TUNA_NETRA', label: 'Hambatan Penglihatan (Tunanetra)' },
  { id: 'TUNA_RUNGU', label: 'Hambatan Pendengaran (Tunarungu)' },
  { id: 'TUNA_GRAHITA_RINGAN', label: 'Hambatan Intelektual Ringan (Tunagrahita Ringan)' },
  { id: 'TUNA_GRAHITA_SEDANG', label: 'Hambatan Intelektual Sedang (Tunagrahita Sedang)' },
  { id: 'TUNA_DAKSA', label: 'Hambatan Fisik & Motorik (Tunadaksa)' },
  { id: 'TUNA_LARAS', label: 'Hambatan Emosi & Perilaku (Tunalaras)' },
  { id: 'GANDA', label: 'Hambatan Majemuk / Ganda' },
  { id: 'INKLUSI', label: 'Kelas Inklusi / Reguler (Adaptif)' }
];

export const JENJANG_SLB: SelectOption[] = [
  { id: 'TKLB', label: 'PAUD / TKLB' },
  { id: 'FASE_A', label: 'Fase A (Kelas 1-2 SDLB / Usia Mental ≤ 7 Tahun)' },
  { id: 'FASE_B', label: 'Fase B (Kelas 3-4 SDLB / Usia Mental ± 8 Tahun)' },
  { id: 'FASE_C', label: 'Fase C (Kelas 5-6 SDLB / Usia Mental ± 9 Tahun)' },
  { id: 'FASE_D', label: 'Fase D (Kelas 7-9 SMPLB / Usia Mental ± 10 Tahun)' },
  { id: 'FASE_E', label: 'Fase E (Kelas 10 SMALB / Usia Mental ± 11 Tahun)' },
  { id: 'FASE_F', label: 'Fase F (Kelas 11-12 SMALB / Usia Mental ± 12 Tahun)' }
];

export const MAPEL_UMUM = [
  'Bahasa Indonesia',
  'Matematika',
  'Pendidikan Pancasila',
  'IPAS (IPA & IPS Terpadu)',
  'Pendidikan Agama dan Budi Pekerti',
  'PJOK (Pendidikan Jasmani & Kesehatan)',
  'Seni Budaya (Rupa, Musik, Tari, Teater)',
  'Bahasa Inggris',
  'Program Kebutuhan Khusus (Bina Diri / Bina Gerak / Bina Persepsi Bunyi)'
];

export const MAPEL_VOKASI_SLB = [
  'Tata Busana (Menjahit & Fashion Dasar)',
  'Tata Boga (Kuliner & Pengolahan Makanan)',
  'Batik (Batik Tulis, Cap & Ecoprint)',
  'Kriya Kayu & Ukir',
  'Kriya Keramik & Gerabah',
  'Kriya Anyaman',
  'Pertanian & Hortikultura (Tanaman Hias/Sayur)',
  'Peternakan (Unggas & Ikan Hias)',
  'Sablon & Digital Printing',
  'Tata Kecantikan & Perawatan Diri',
  'Pijat & Massage Tradisional (Tunanetra)',
  'Teknologi Informasi (TIK / Desain Grafis Dasar)',
  'Otomotif & Servis Sepeda Motor'
];