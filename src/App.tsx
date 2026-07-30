import React, { useState, useEffect } from 'react';
import { ActiveTab, UserRole, SavedDocument } from './types';
import { INITIAL_SAVED_DOCUMENTS } from './data/mockDefaults';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { SupabaseStatusModal } from './components/SupabaseStatusModal';
import {
  fetchDocumentsFromSupabase,
  saveDocumentToSupabase,
  deleteDocumentFromSupabase,
} from './services/supabase';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { WorkflowPage } from './pages/WorkflowPage';
import { AiChatPage } from './pages/AiChatPage';
import { ModulAjarGenerator } from './pages/ModulAjarGenerator';
import { RppAtpTpPage } from './pages/RppAtpTpPage';
import { LkpdMateriPage } from './pages/LkpdMateriPage';
import { PptGeneratorPage } from './pages/PptGeneratorPage';
import { SoalRubrikPage } from './pages/SoalRubrikPage';
import { NilaiSiswaPage } from './pages/NilaiSiswaPage';
import { SuratAdministrasiPage } from './pages/SuratAdministrasiPage';
import { KomunikasiPage } from './pages/KomunikasiPage';
import { RepositoryPage } from './pages/RepositoryPage';
import { RoadmapPage } from './pages/RoadmapPage';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('Guru Mata Pelajaran');
  const [savedDocs, setSavedDocs] = useState<SavedDocument[]>(INITIAL_SAVED_DOCUMENTS);
  const [activeViewerDoc, setActiveViewerDoc] = useState<SavedDocument | null>(null);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);

  // Sync documents with Supabase on mount
  useEffect(() => {
    async function syncSupabaseOnLoad() {
      setIsSyncingSupabase(true);
      const { data, error } = await fetchDocumentsFromSupabase();

      if (!error && data && data.length > 0) {
        // Merge Supabase docs with initial defaults, avoiding duplicate IDs
        setSavedDocs((prev) => {
          const supabaseIds = new Set(data.map((d) => d.id));
          const localOnly = prev.filter((d) => !supabaseIds.has(d.id));
          return [...data, ...localOnly];
        });
      } else if (!error && data && data.length === 0) {
        // Table exists but empty, seed initial documents into Supabase
        for (const doc of INITIAL_SAVED_DOCUMENTS) {
          await saveDocumentToSupabase(doc);
        }
      }
      setIsSyncingSupabase(false);
    }

    syncSupabaseOnLoad();
  }, []);

  const handleSaveDocument = (newDoc: SavedDocument) => {
    setSavedDocs((prev) => [newDoc, ...prev]);
    // Asynchronously persist to Supabase backend
    saveDocumentToSupabase(newDoc);
  };

  const handleDeleteDocument = (docId: string) => {
    setSavedDocs((prev) => prev.filter((d) => d.id !== docId));
    // Asynchronously delete from Supabase backend
    deleteDocumentFromSupabase(docId);
  };

  const handleManualSync = async () => {
    setIsSyncingSupabase(true);
    const { data, error } = await fetchDocumentsFromSupabase();
    if (!error && data && data.length > 0) {
      setSavedDocs(data);
    } else {
      // Push all current documents to Supabase
      for (const doc of savedDocs) {
        await saveDocumentToSupabase(doc);
      }
    }
    setIsSyncingSupabase(false);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col antialiased selection:bg-indigo-600 selection:text-white">
      {/* Top Application Header */}
      <Header
        currentRole={userRole}
        onRoleChange={setUserRole}
        documentCount={savedDocs.length}
        onOpenRepository={() => setActiveTab('repository')}
        onLaunchWorkflow={() => setActiveTab('workflow')}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          currentRole={userRole}
          onSelectTab={setActiveTab}
        />

        {/* Dynamic Content View Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardPage
              currentRole={userRole}
              documents={savedDocs}
              onNavigate={setActiveTab}
              onOpenDocument={setActiveViewerDoc}
            />
          )}

          {activeTab === 'workflow' && (
            <WorkflowPage onSaveDocument={handleSaveDocument} />
          )}

          {activeTab === 'chat' && (
            <AiChatPage onSaveDocument={handleSaveDocument} />
          )}

          {activeTab === 'modul-ajar' && (
            <ModulAjarGenerator
              onSaveDocument={handleSaveDocument}
              onOpenViewer={setActiveViewerDoc}
            />
          )}

          {activeTab === 'rpp-atp' && (
            <RppAtpTpPage
              onSaveDocument={handleSaveDocument}
              onOpenViewer={setActiveViewerDoc}
            />
          )}

          {activeTab === 'lkpd-materi' && (
            <LkpdMateriPage
              onSaveDocument={handleSaveDocument}
              onOpenViewer={setActiveViewerDoc}
            />
          )}

          {activeTab === 'ppt' && (
            <PptGeneratorPage onSaveDocument={handleSaveDocument} />
          )}

          {activeTab === 'soal-rubrik' && (
            <SoalRubrikPage onSaveDocument={handleSaveDocument} />
          )}

          {activeTab === 'nilai' && (
            <NilaiSiswaPage onSaveDocument={handleSaveDocument} />
          )}

          {activeTab === 'administrasi' && (
            <SuratAdministrasiPage
              onSaveDocument={handleSaveDocument}
              onOpenViewer={setActiveViewerDoc}
            />
          )}

          {activeTab === 'komunikasi' && (
            <KomunikasiPage onSaveDocument={handleSaveDocument} />
          )}

          {activeTab === 'repository' && (
            <RepositoryPage
              documents={savedDocs}
              onOpenViewer={setActiveViewerDoc}
              onDeleteDocument={handleDeleteDocument}
            />
          )}

          {activeTab === 'roadmap' && <RoadmapPage />}
        </main>
      </div>

      {/* Modal Document Viewer */}
      {activeViewerDoc && (
        <DocumentViewerModal
          document={activeViewerDoc}
          onClose={() => setActiveViewerDoc(null)}
        />
      )}

      {/* Modal Supabase Connection Status */}
      <SupabaseStatusModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onSyncDocuments={handleManualSync}
      />
    </div>
  );
}

export default App;
