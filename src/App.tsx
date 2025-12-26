import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DeleteModal from './components/DeleteModal';
import type { View, Garment } from './types';
import { getAllGarments, addGarment, updateGarment, deleteGarment, importGarments } from './lib/database';
import './index.css';

import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import AddGarment from './pages/AddGarment';
import Reports from './pages/Reports';
import Login from './pages/Login';
import MobileNav from './components/MobileNav';
import MobileHeader from './components/MobileHeader';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [garments, setGarments] = useState<Garment[]>([]);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [editingGarment, setEditingGarment] = useState<Garment | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  // Theme & Sidebar State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Authentication & Initial Load
  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadGarments();
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadGarments();
      } else {
        setGarments([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  // Modal State
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; garment: Garment | null }>({
    isOpen: false,
    garment: null
  });

  const loadGarments = async () => {
    try {
      setLoading(true);
      const data = await getAllGarments();
      setGarments(data);
    } catch (error) {
      console.error('Error loading garments:', error);
      alert('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = (garment: Garment) => {
    setDeleteModal({ isOpen: true, garment });
  };

  const confirmDelete = async () => {
    if (deleteModal.garment) {
      try {
        await deleteGarment(deleteModal.garment.id);
        setGarments(prev => prev.filter(g => g.id !== deleteModal.garment!.id));
        setDeleteModal({ isOpen: false, garment: null });
      } catch (error) {
        console.error('Error deleting garment:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleEdit = (garment: Garment) => {
    setEditingGarment(garment);
    setCurrentView('add-garment');
  };

  const handleAdd = async (newGarment: Omit<Garment, 'id' | 'dateAdded'>) => {
    try {
      const added = await addGarment(newGarment);
      setGarments(prev => [added, ...prev]);
    } catch (error) {
      console.error('Error adding garment:', error);
      alert('Erreur lors de l\'ajout');
    }
  };

  const handleUpdate = async (updatedGarment: Garment) => {
    try {
      const updated = await updateGarment(updatedGarment);
      setGarments(prev => prev.map(g => g.id === updated.id ? updated : g));
      setEditingGarment(null);
      setCurrentView('inventory');
    } catch (error) {
      console.error('Error updating garment:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleImport = async (importedGarments: Garment[]) => {
    try {
      const added = await importGarments(importedGarments);
      setGarments(prev => [...added, ...prev]);
      alert(`${added.length} articles importés avec succès !`);
    } catch (error) {
      console.error('Error importing garments:', error);
      alert('Erreur lors de l\'importation');
    }
  };

  if (loading && !session) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>Vériﬁcation de l'accès...</p>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  const renderView = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 5rem)' }}>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>Chargement des données...</p>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard garments={garments} onNavigate={setCurrentView} />;
      case 'inventory':
        return (
          <Inventory
            garments={garments}
            onNavigate={setCurrentView}
            onDelete={handleDeleteRequest}
            onEdit={handleEdit}
            onImport={handleImport}
          />
        );
      case 'add-garment':
        return (
          <AddGarment
            garments={garments}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            initialData={editingGarment}
            onNavigate={(view) => {
              setEditingGarment(null);
              setCurrentView(view);
            }}
          />
        );
      case 'reports':
        return <Reports garments={garments} onNavigate={setCurrentView} />;
      default:
        return <Dashboard garments={garments} onNavigate={setCurrentView} />;
    }
  };

  return (
    <>
      <div className="layout-container">
        <MobileHeader theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} />

        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        />

        <main className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          {renderView()}
        </main>

        <MobileNav currentView={currentView} onViewChange={setCurrentView} />
      </div>

      <DeleteModal
        isOpen={deleteModal.isOpen}
        itemName={deleteModal.garment?.name || ''}
        onClose={() => setDeleteModal({ isOpen: false, garment: null })}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default App;
