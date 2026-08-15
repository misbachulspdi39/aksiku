import { createClient } from '@supabase/supabase-js';

// Ambil URL dan Anon Key dari environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 1. Informasi Konfigurasi Supabase
export const SUPABASE_CONFIG_INFO = {
  url: supabaseUrl,
  hasKey: Boolean(supabaseAnonKey),
};

// 2. Skema SQL Dasar untuk Inisialisasi Database
export const SUPABASE_SQL_SCHEMA = `
-- Tabel untuk menyimpan dokumen/modul ajar
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`;

// 3. Fungsi Cek Koneksi Supabase (Dibutuhkan oleh SupabaseStatusModal.tsx)
export async function checkSupabaseConnection(): Promise<boolean> {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  try {
    const { error } = await supabase.from('documents').select('id').limit(1);
    return !error || error.code !== 'PGRST301';
  } catch (err) {
    console.error('Supabase connection check failed:', err);
    return false;
  }
}

// 4. Fungsi Helper untuk Mengambil Dokumen (Export kedua nama fungsi agar compatible)
export async function fetchDocumentsFromSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) return [];
  const { data, error } = await supabase.from('documents').select('*');
  if (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
  return data;
}

export const getDocumentsFromSupabase = fetchDocumentsFromSupabase;

// 5. Fungsi Helper untuk Menyimpan Dokumen
export async function saveDocumentToSupabase(title: string, content: string) {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  const { data, error } = await supabase
    .from('documents')
    .insert([{ title, content }])
    .select();
  if (error) {
    console.error('Error saving document:', error);
    throw error;
  }
  return data;
}

// 6. Fungsi Helper untuk Menghapus Dokumen
export async function deleteDocumentFromSupabase(id: string) {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);
  if (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
  return true;
}