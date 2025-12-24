import React from 'react';
import { Edit2, Trash2, Package } from 'lucide-react';
import type { Garment } from '../types';

interface GarmentTableProps {
    garments: Garment[];
    onEdit: (garment: Garment) => void;
    onDelete: (garment: Garment) => void;
}

const GarmentTable: React.FC<GarmentTableProps> = ({ garments, onEdit, onDelete }) => {
    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ padding: '0.5rem', background: '#f8fafc', borderRadius: '8px' }}>
                    <Package size={18} color="var(--text-secondary)" />
                </div>
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Tous les vêtements</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem' }}>Gerez votre inventaire et visualisez les valeurs totales</p>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', background: '#f8fafc' }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Marque</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Modèle</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Couleur</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Taille</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Stock</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Prix Unitaire</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Prix Total</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {garments.map((garment) => (
                            <tr key={garment.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.875rem' }}>{garment.brand}</td>
                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>{garment.model}</td>
                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{garment.color}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        background: '#f1f5f9',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        fontWeight: 700
                                    }}>
                                        {garment.size}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                                        {garment.currentStock}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>{garment.price.toLocaleString()} €</td>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: 700, fontSize: '0.875rem' }}>{(garment.price * garment.currentStock).toLocaleString()} €</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                        <button
                                            onClick={() => onEdit(garment)}
                                            className="btn btn-outline"
                                            style={{ padding: '0.425rem', border: '1px solid var(--border-color)' }}
                                            title="Modifier"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(garment)}
                                            className="btn btn-outline"
                                            style={{ padding: '0.425rem', border: '1px solid var(--border-color)', color: 'var(--accent-red)' }}
                                            title="Supprimer"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GarmentTable;
