export type UserRole = 'Guru Mata Pelajaran' | 'Wali Kelas' | 'Kepala Sekolah';

export type ActiveTab =
  | 'dashboard'
  | 'workflow'
  | 'chat'
  | 'modul-ajar'
  | 'rpp-atp'
  | 'lkpd-materi'
  | 'ppt'
  | 'soal-rubrik'
  | 'nilai'
  | 'administrasi'
  | 'komunikasi'
  | 'repository'
  | 'roadmap';

export interface DocumentMetadata {
  subject?: string;
  grade?: string; // Fase A, B, C, D, E, F / Kelas 1-12
  semester?: string;
  topic?: string;
  authorRole?: UserRole;
  tags?: string[];
  docType: DocType;
}

export type DocType =
  | 'Modul Ajar'
  | 'RPP'
  | 'ATP'
  | 'TP'
  | 'LKPD'
  | 'Materi Ajar'
  | 'PowerPoint'
  | 'Bank Soal'
  | 'Rubrik Penilaian'
  | 'Deskripsi Nilai'
  | 'Analisis Nilai'
  | 'Analisis Siswa'
  | 'Surat & Administrasi'
  | 'Komunikasi'
  | 'Super Workflow Package';

export interface SavedDocument {
  id: string;
  title: string;
  docType: DocType;
  createdAt: string;
  content: string;
  rawJson?: any;
  metadata: DocumentMetadata;
}

export interface PptSlide {
  slideNumber: number;
  title: string;
  subtitle?: string;
  bulletPoints: string[];
  visualSuggestion?: string;
  speakerNotes?: string;
}

export interface QuestionItem {
  id: string;
  number: number;
  type: 'Pilihan Ganda' | 'Essay' | 'Benar Salah' | 'Menjodohkan' | 'Isian' | 'HOTS' | 'AKM';
  bloomTaxonomy: 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';
  question: string;
  options?: string[]; // for PG / Benar Salah / Menjodohkan
  correctAnswer: string;
  explanation: string;
  points?: number;
}

export interface RubricCriterion {
  aspect: string;
  weight?: string;
  score4: string; // Sangat Baik
  score3: string; // Baik
  score2: string; // Cukup
  score1: string; // Perlu Bimbingan
}

export interface StudentScore {
  id: string;
  name: string;
  nisn?: string;
  formatifScore: number;
  sumatifScore: number;
  finalScore: number;
  strengths?: string;
  areasToImprove?: string;
  raporDescription?: string;
}

export interface ClassGradeAnalysis {
  subject: string;
  className: string;
  totalStudents: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passingRate: number; // percentage
  competencySummary: string;
  remedialStudents: string[];
  remedialAdvice: string;
  enrichmentStudents: string[];
  enrichmentAdvice: string;
}

export interface StudentProfileAnalysis {
  studentName: string;
  className: string;
  strengths: string[];
  weaknesses: string[];
  learningStyleRecommendation: string;
  homeroomNotes: string;
}

export interface WorkflowResult {
  fileOrTopicTitle: string;
  summary: string;
  modulAjar: string;
  lkpd: string;
  pptSlides: PptSlide[];
  questions: QuestionItem[];
  rubric: RubricCriterion[];
  gradeAnalysisExample: string;
  raporDescriptionExample: string;
  classroomActivities: string[];
}

export interface WorkflowStepState {
  id: number;
  label: string;
  key: keyof WorkflowResult;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  category?: 'Penjelasan' | 'Ice Breaking' | 'PjBL' | 'Diferensiasi' | 'Asesmen' | 'Lainnya';
}
