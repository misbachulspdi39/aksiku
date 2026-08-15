// Role Akses Aplikasi
export type AppRole = 'admin' | 'guru';

// Data Pengguna
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  schoolName?: string;
  isActive: boolean; // Status langganan (True = Aktif, False = Nonaktif/Habis Masa)
  expiresAt?: string; // Tanggal kedaluwarsa langganan
  createdAt?: string;
}

// Tambahkan 'admin-users' ke ActiveTab agar admin punya menu sendiri
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
  | 'roadmap'
  | 'admin-users'; // Menu Manajemen User untuk Admin