import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, itemName }) => {
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
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Confirmer la suppression</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Cette action est irréversible</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ color: 'var(--text-secondary)', padding: '0.25rem' }}>
                        <X size={20} />
                    </button>
                </div>

                <p style={{ color: 'var(--text-primary)', marginBottom: '2rem', lineHeight: 1.6 }}>
                    Êtes-vous sûr de vouloir supprimer l'article <strong style={{ fontWeight: 700 }}>"{itemName}"</strong> ? Il sera définitivement retiré de votre inventaire.
                </p>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className="btn btn-primary"
                        onClick={onConfirm}
                        style={{ flex: 1, background: 'var(--accent-red)', justifyContent: 'center' }}
                    >
                        Supprimer l'article
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

export default DeleteModal;
