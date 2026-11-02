import React from 'react';
import { AlertCircle, X, Trash2 } from 'lucide-react';

interface BulkDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    count: number;
}

const BulkDeleteModal: React.FC<BulkDeleteModalProps> = ({ isOpen, onClose, onConfirm, count }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ padding: '0.75rem', background: 'var(--accent-red-light)', borderRadius: '10px' }}>
                            <AlertCircle size={24} color="var(--accent-red)" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Suppression groupée</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Cette action est irréversible</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ color: 'var(--text-secondary)', padding: '0.25rem' }}>
                        <X size={20} />
                    </button>
                </div>

                <p style={{ color: 'var(--text-primary)', marginBottom: '2rem', lineHeight: 1.6 }}>
                    Êtes-vous sûr de vouloir supprimer définitivement <strong style={{ fontWeight: 700, color: 'var(--accent-red)' }}>{count} article(s)</strong> de votre inventaire ?
                </p>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className="btn btn-primary"
                        onClick={onConfirm}
                        style={{ flex: 1, background: 'var(--accent-red)', justifyContent: 'center' }}
                    >
                        <Trash2 size={16} />
                        Supprimer les {count} articles
                    </button>
                    <button
                        className="btn btn-outline"
                        onClick={onClose}
                        style={{ flex: 0.6, justifyContent: 'center' }}
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BulkDeleteModal;
