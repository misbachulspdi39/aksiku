/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';
import { SavedDocument } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://uuxkufduxidhfetpguae.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1eGt1ZmR1eGlkaGZldHBndWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzODc0MzMsImV4cCI6MjEwMDk2MzQzM30.qjpY65hPNJ8DuDmvdw5Lyy-2nzOqkNG35BcpUzOfUyM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const SUPABASE_CONFIG_INFO = {
  projectName: 'guru super app Project',
  projectId: 'uuxkufduxidhfetpguae',
  url: SUPABASE_URL,
};

export const SUPABASE_SQL_SCHEMA = `-- Jalankan SQL ini di SQL Editor Dashboard Supabase Anda:
-- URL: https://supabase.com/dashboard/project/uuxkufduxidhfetpguae/sql

CREATE TABLE IF NOT EXISTS public.saved_documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  doc_type TEXT NOT NULL,
  created_at TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  raw_json JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Matikan atau sesuaikan RLS untuk akses publik dari aplikasi
ALTER TABLE public.saved_documents ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses Baca & Tulis Publik (Anon)
CREATE POLICY "Akses publik penuh saved_documents" 
ON public.saved_documents 
FOR ALL 
USING (true) 
WITH CHECK (true);
`;

/**
 * Sync & Fetch documents from Supabase `saved_documents` table
 */
export async function fetchDocumentsFromSupabase(): Promise<{ data: SavedDocument[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('saved_documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error:', error);
      return { data: null, error };
    }

    const formattedDocs: SavedDocument[] = (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      docType: item.doc_type,
      createdAt: item.created_at,
      content: item.content,
      metadata: item.metadata || {},
      rawJson: item.raw_json,
    }));

    return { data: formattedDocs, error: null };
  } catch (err) {
    console.error('Unexpected error fetching from Supabase:', err);
    return { data: null, error: err };
  }
}

/**
 * Upsert a saved document into Supabase
 */
export async function saveDocumentToSupabase(doc: SavedDocument): Promise<{ success: boolean; error: any }> {
  try {
    const payload = {
      id: doc.id,
      title: doc.title,
      doc_type: doc.docType,
      created_at: doc.createdAt,
      content: doc.content,
      metadata: doc.metadata || {},
      raw_json: doc.rawJson || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('saved_documents').upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase save error:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Unexpected error saving to Supabase:', err);
    return { success: false, error: err };
  }
}

/**
 * Delete a saved document from Supabase
 */
export async function deleteDocumentFromSupabase(id: string): Promise<{ success: boolean; error: any }> {
  try {
    const { error } = await supabase.from('saved_documents').delete().eq('id', id);

    if (error) {
      console.warn('Supabase delete error:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Unexpected error deleting from Supabase:', err);
    return { success: false, error: err };
  }
}

/**
 * Quick connection check
 */
export async function checkSupabaseConnection(): Promise<{ connected: boolean; tableExists: boolean; message: string }> {
  try {
    const { data, error } = await supabase.from('saved_documents').select('id').limit(1);

    if (error) {
      if (error.code === '42P01' || error.message?.includes('relation "public.saved_documents" does not exist')) {
        return {
          connected: true,
          tableExists: false,
          message: 'Terhubung ke Supabase! Tabel "saved_documents" belum dibuat di database.',
        };
      }
      return {
        connected: false,
        tableExists: false,
        message: `Koneksi gagal: ${error.message}`,
      };
    }

    return {
      connected: true,
      tableExists: true,
      message: 'Terhubung ke Supabase & tabel "saved_documents" aktif!',
    };
  } catch (err: any) {
    return {
      connected: false,
      tableExists: false,
      message: `Error: ${err?.message || 'Gagal terhubung ke Supabase'}`,
    };
  }
}
