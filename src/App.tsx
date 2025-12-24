import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DeleteModal from './components/DeleteModal';
import type { View, Garment } from './types';
import { initialGarments } from './utils/mockData';
import './index.css';

import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import AddGarment from './pages/AddGarment';
import Reports from './pages/Reports';

const App: React.FC = () => {
  const [garments, setGarments] = useState<Garment[]>(initialGarments);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [editingGarment, setEditingGarment] = useState<Garment | null>(null);

  // Modal State
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; garment: Garment | null }>({
    isOpen: false,
    garment: null
  });

  const handleDeleteRequest = (garment: Garment) => {
    setDeleteModal({ isOpen: true, garment });
  };

  const confirmDelete = () => {
    if (deleteModal.garment) {
      setGarments(prev => prev.filter(g => g.id !== deleteModal.garment!.id));
      setDeleteModal({ isOpen: false, garment: null });
    }
  };

  const handleEdit = (garment: Garment) => {
    setEditingGarment(garment);
    setCurrentView('add-garment');
  };

  const handleAdd = (newGarment: Omit<Garment, 'id' | 'dateAdded'>) => {
    const garment: Garment = {
      ...newGarment,
      id: Math.random().toString(36).substr(2, 9),
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setGarments(prev => [garment, ...prev]);
  };

  const handleUpdate = (updatedGarment: Garment) => {
    setGarments(prev => prev.map(g => g.id === updatedGarment.id ? updatedGarment : g));
    setEditingGarment(null);
    setCurrentView('inventory');
  };

  const handleImport = (importedGarments: Garment[]) => {
    setGarments(prev => [...importedGarments, ...prev]);
  };

  const renderView = () => {
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
    <div className="layout-container">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="main-content">
        {renderView()}
      </main>

      <DeleteModal
        isOpen={deleteModal.isOpen}
        itemName={deleteModal.garment?.name || ''}
        onClose={() => setDeleteModal({ isOpen: false, garment: null })}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default App;
