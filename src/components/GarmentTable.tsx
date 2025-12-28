import { Edit2, Trash2, Package, Minus, Plus as PlusIcon } from 'lucide-react';
import type { Garment } from '../types';

interface GarmentTableProps {
    garments: Garment[];
    onEdit: (garment: Garment) => void;
    onDelete: (garment: Garment) => void;
    onStockChange: (garment: Garment, newStock: number) => void;
}

const GarmentTable: React.FC<GarmentTableProps> = ({ garments, onEdit, onDelete, onStockChange }) => {
    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ padding: '0.5rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                    <Package size={18} color="var(--text-secondary)" />
                </div>
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Tous les vêtements</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem' }}>Gerez votre inventaire</p>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Marque</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Type</th>
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
                                <td data-label="Marque" style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.875rem' }}>{garment.brand}</td>
                                <td data-label="Type" style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{garment.category}</td>
                                <td data-label="Modèle" style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>{garment.model}</td>
                                <td data-label="Couleur" style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{garment.color}</td>
                                <td data-label="Taille" style={{ padding: '1rem 1.5rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        background: 'var(--bg-tertiary)',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        fontWeight: 700
                                    }}>
                                        {garment.size}
                                    </span>
                                </td>
                                <td data-label="Stock" style={{ padding: '1rem 1.5rem' }}>
                                    <div className="stock-control">
                                        <button
                                            className="btn-stock"
                                            onClick={() => onStockChange(garment, Math.max(0, garment.currentStock - 1))}
                                            disabled={garment.currentStock <= 0}
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="stock-value">{garment.currentStock}</span>
                                        <button
                                            className="btn-stock"
                                            onClick={() => onStockChange(garment, garment.currentStock + 1)}
                                        >
                                            <PlusIcon size={14} />
                                        </button>
                                    </div>
                                </td>
                                <td data-label="Unit." style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>{garment.price.toLocaleString()} €</td>
                                <td data-label="Total" style={{ padding: '1rem 1.5rem', fontWeight: 700, fontSize: '0.875rem' }}>{(garment.price * garment.currentStock).toLocaleString()} €</td>
                                <td data-label="Actions" style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                        <button
                                            onClick={() => onEdit(garment)}
                                            className="btn btn-outline"
                                            style={{ padding: '0.425rem', border: '1px solid var(--border-color)', minWidth: '36px', minHeight: '36px' }}
                                            title="Modifier"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(garment)}
                                            className="btn btn-outline"
                                            style={{ padding: '0.425rem', border: '1px solid var(--border-color)', color: 'var(--accent-red)', minWidth: '36px', minHeight: '36px' }}
                                            title="Supprimer"
                                        >
                                            <Trash2 size={16} />
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
