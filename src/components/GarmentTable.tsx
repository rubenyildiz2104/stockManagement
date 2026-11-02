import React, { useState, useMemo, useEffect } from 'react';
import { Edit2, Trash2, Package, Minus, Plus as PlusIcon, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Garment } from '../types';

type SortField = 'serialNumber' | 'name' | 'brand' | 'category' | 'model' | 'color' | 'size' | 'currentStock' | 'price' | 'totalPrice';
type SortOrder = 'asc' | 'desc';

interface GarmentTableProps {
    garments: Garment[];
    onEdit: (garment: Garment) => void;
    onDelete: (garment: Garment) => void;
    onStockChange: (garment: Garment, newStock: number) => void;
    selectedIds?: Set<string>;
    onToggleSelect?: (id: string) => void;
    onToggleSelectAll?: (idsOnPage: string[]) => void;
}

const GarmentTable: React.FC<GarmentTableProps> = ({
    garments,
    onEdit,
    onDelete,
    onStockChange,
    selectedIds = new Set(),
    onToggleSelect,
    onToggleSelectAll
}) => {
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);

    // Reset to page 1 when the dataset length changes (e.g. search or filter)
    useEffect(() => {
        setCurrentPage(1);
    }, [garments.length]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    // Sort the dataset
    const sortedGarments = useMemo(() => {
        const list = [...garments];
        list.sort((a, b) => {
            let valA: string | number = '';
            let valB: string | number = '';

            switch (sortField) {
                case 'totalPrice':
                    valA = a.price * a.currentStock;
                    valB = b.price * b.currentStock;
                    break;
                case 'price':
                case 'currentStock':
                    valA = a[sortField];
                    valB = b[sortField];
                    break;
                default:
                    valA = (a[sortField] || '').toLowerCase();
                    valB = (b[sortField] || '').toLowerCase();
                    break;
            }

            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        return list;
    }, [garments, sortField, sortOrder]);

    // Paginate the dataset
    const totalPages = Math.max(1, Math.ceil(sortedGarments.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (safeCurrentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, sortedGarments.length);
    const pagedGarments = useMemo(() => sortedGarments.slice(startIndex, endIndex), [sortedGarments, startIndex, endIndex]);

    const allOnPageSelected = pagedGarments.length > 0 && pagedGarments.every(g => selectedIds.has(g.id));

    const renderSortIcon = (field: SortField) => {
        if (sortField !== field) {
            return <ArrowUpDown size={13} style={{ opacity: 0.4 }} />;
        }
        return sortOrder === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />;
    };

    const renderStatusBadge = (stock: number) => {
        if (stock === 0) {
            return <span className="badge badge-danger">Épuisé (0)</span>;
        }
        if (stock === 1) {
            return <span className="badge badge-info">Pièce unique</span>;
        }
        return <span className="badge badge-success">En stock ({stock})</span>;
    };

    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                    <div style={{ padding: '0.5rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                        <Package size={18} color="var(--text-secondary)" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Inventaire des articles</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem' }}>
                            {garments.length} article(s) au total • Page {safeCurrentPage} sur {totalPages}
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Lignes :</label>
                    <select
                        className="page-size-select"
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        <option value={15}>15</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
                            {onToggleSelectAll && (
                                <th style={{ padding: '1rem 1rem', width: '40px', textAlign: 'center' }}>
                                    <input
                                        type="checkbox"
                                        className="row-checkbox"
                                        checked={allOnPageSelected}
                                        onChange={() => onToggleSelectAll(pagedGarments.map(g => g.id))}
                                        title="Sélectionner tous les articles de cette page"
                                    />
                                </th>
                            )}
                            <th className="sortable" onClick={() => handleSort('serialNumber')} style={{ padding: '1rem 1.25rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                <span className="sort-header-inner">Réf / Série {renderSortIcon('serialNumber')}</span>
                            </th>
                            <th className="sortable" onClick={() => handleSort('name')} style={{ padding: '1rem 1.25rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                <span className="sort-header-inner">Nom {renderSortIcon('name')}</span>
                            </th>
                            <th className="sortable" onClick={() => handleSort('brand')} style={{ padding: '1rem 1.25rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                <span className="sort-header-inner">Marque {renderSortIcon('brand')}</span>
                            </th>
                            <th className="sortable" onClick={() => handleSort('category')} style={{ padding: '1rem 1.25rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                <span className="sort-header-inner">Type {renderSortIcon('category')}</span>
                            </th>
                            <th className="sortable" onClick={() => handleSort('model')} style={{ padding: '1rem 1.25rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                <span className="sort-header-inner">Modèle {renderSortIcon('model')}</span>
                            </th>
                            <th className="sortable" onClick={() => handleSort('color')} style={{ padding: '1rem 1.25rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                <span className="sort-header-inner">Couleur {renderSortIcon('color')}</span>
                            </th>
                            <th className="sortable" onClick={() => handleSort('size')} style={{ padding: '1rem 1.25rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                <span className="sort-header-inner">Taille {renderSortIcon('size')}</span>
                            </th>
                            <th style={{ padding: '1rem 1.25rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Statut</th>
                            <th className="sortable" onClick={() => handleSort('currentStock')} style={{ padding: '1rem 1.25rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                <span className="sort-header-inner">Stock {renderSortIcon('currentStock')}</span>
                            </th>
                            <th className="sortable" onClick={() => handleSort('price')} style={{ padding: '1rem 1.25rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                <span className="sort-header-inner">Prix U. {renderSortIcon('price')}</span>
                            </th>
                            <th className="sortable" onClick={() => handleSort('totalPrice')} style={{ padding: '1rem 1.25rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                <span className="sort-header-inner">Prix Total {renderSortIcon('totalPrice')}</span>
                            </th>
                            <th style={{ padding: '1rem 1.25rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagedGarments.map((garment) => {
                            const isSelected = selectedIds.has(garment.id);
                            return (
                                <tr
                                    key={garment.id}
                                    style={{
                                        borderBottom: '1px solid var(--border-color)',
                                        background: isSelected ? 'var(--bg-tertiary)' : undefined,
                                        transition: 'background 0.15s'
                                    }}
                                >
                                    {onToggleSelect && (
                                        <td data-label="Sélection" style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                                            <input
                                                type="checkbox"
                                                className="row-checkbox"
                                                checked={isSelected}
                                                onChange={() => onToggleSelect(garment.id)}
                                            />
                                        </td>
                                    )}
                                    <td data-label="Réf / Série" style={{ padding: '0.85rem 1.25rem', fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: 600 }}>
                                        {garment.serialNumber}
                                    </td>
                                    <td data-label="Nom" style={{ padding: '0.85rem 1.25rem', fontWeight: 600, fontSize: '0.875rem' }}>
                                        {garment.name}
                                    </td>
                                    <td data-label="Marque" style={{ padding: '0.85rem 1.25rem', fontSize: '0.85rem' }}>
                                        {garment.brand}
                                    </td>
                                    <td data-label="Type" style={{ padding: '0.85rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {garment.category}
                                    </td>
                                    <td data-label="Modèle" style={{ padding: '0.85rem 1.25rem', fontSize: '0.85rem' }}>
                                        {garment.model}
                                    </td>
                                    <td data-label="Couleur" style={{ padding: '0.85rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {garment.color}
                                    </td>
                                    <td data-label="Taille" style={{ padding: '0.85rem 1.25rem' }}>
                                        <span style={{
                                            padding: '0.2rem 0.5rem',
                                            background: 'var(--bg-tertiary)',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            fontWeight: 700
                                        }}>
                                            {garment.size}
                                        </span>
                                    </td>
                                    <td data-label="Statut" style={{ padding: '0.85rem 1.25rem' }}>
                                        {renderStatusBadge(garment.currentStock)}
                                    </td>
                                    <td data-label="Stock" style={{ padding: '0.85rem 1.25rem' }}>
                                        <div className="stock-control">
                                            <button
                                                className="btn-stock"
                                                onClick={() => onStockChange(garment, Math.max(0, garment.currentStock - 1))}
                                                disabled={garment.currentStock <= 0}
                                                title="Diminuer le stock"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="stock-value">{garment.currentStock}</span>
                                            <button
                                                className="btn-stock"
                                                onClick={() => onStockChange(garment, garment.currentStock + 1)}
                                                title="Augmenter le stock"
                                            >
                                                <PlusIcon size={14} />
                                            </button>
                                        </div>
                                    </td>
                                    <td data-label="Prix U." style={{ padding: '0.85rem 1.25rem', fontSize: '0.85rem' }}>
                                        {garment.price.toLocaleString()} €
                                    </td>
                                    <td data-label="Prix Total" style={{ padding: '0.85rem 1.25rem', fontWeight: 700, fontSize: '0.85rem' }}>
                                        {(garment.price * garment.currentStock).toLocaleString()} €
                                    </td>
                                    <td data-label="Actions" style={{ padding: '0.85rem 1.25rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                            <button
                                                onClick={() => onEdit(garment)}
                                                className="btn btn-outline"
                                                style={{ padding: '0.4rem', border: '1px solid var(--border-color)', minWidth: '34px', minHeight: '34px' }}
                                                title="Modifier l'article"
                                            >
                                                <Edit2 size={15} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(garment)}
                                                className="btn btn-outline"
                                                style={{ padding: '0.4rem', border: '1px solid var(--border-color)', color: 'var(--accent-red)', minWidth: '34px', minHeight: '34px' }}
                                                title="Supprimer l'article"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination footer */}
            <div className="pagination-bar">
                <span style={{ color: 'var(--text-secondary)' }}>
                    Affichage de <strong>{garments.length === 0 ? 0 : startIndex + 1}</strong> à <strong>{endIndex}</strong> sur <strong>{garments.length}</strong> article(s)
                </span>

                <div className="pagination-controls">
                    <button
                        className="pagination-btn"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={safeCurrentPage <= 1}
                        title="Page précédente"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - safeCurrentPage) <= 1)
                        .map((page, idx, arr) => {
                            const prevPage = arr[idx - 1];
                            const showEllipsis = prevPage && page - prevPage > 1;
                            return (
                                <React.Fragment key={page}>
                                    {showEllipsis && <span style={{ padding: '0 0.25rem', color: 'var(--text-secondary)' }}>...</span>}
                                    <button
                                        className={`pagination-btn ${safeCurrentPage === page ? 'active' : ''}`}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                </React.Fragment>
                            );
                        })}

                    <button
                        className="pagination-btn"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={safeCurrentPage >= totalPages}
                        title="Page suivante"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GarmentTable;
