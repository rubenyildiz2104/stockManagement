import React, { useState, useMemo } from 'react';
import { History, X, ArrowUpRight, ArrowDownRight, Search, Trash2, Download } from 'lucide-react';
import type { StockMovement } from '../types';
import { getStockMovements, clearStockMovements } from '../lib/stockHistory';

interface StockHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const StockHistoryModal: React.FC<StockHistoryModalProps> = ({ isOpen, onClose }) => {
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [movements, setMovements] = useState<StockMovement[]>(() => getStockMovements());

    // Refresh movements whenever modal opens
    React.useEffect(() => {
        if (isOpen) {
            setMovements(getStockMovements());
        }
    }, [isOpen]);

    const filteredMovements = useMemo(() => {
        return movements.filter(m => {
            const matchesSearch =
                m.garmentName.toLowerCase().includes(search.toLowerCase()) ||
                m.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
                m.brand.toLowerCase().includes(search.toLowerCase());

            if (!matchesSearch) return false;

            if (filterType === 'in') return m.change > 0;
            if (filterType === 'out') return m.change < 0;
            if (filterType === 'import') return m.type === 'import';

            return true;
        });
    }, [movements, search, filterType]);

    const handleClear = () => {
        if (window.confirm('Voulez-vous vraiment effacer l\'historique des mouvements de stock ?')) {
            clearStockMovements();
            setMovements([]);
        }
    };

    const handleExportCSV = () => {
        if (!movements.length) return;
        const headers = ['Date', 'Heure', 'Article', 'Réf Série', 'Marque', 'Taille', 'Couleur', 'Type', 'Ancien Stock', 'Nouveau Stock', 'Variation'];
        const rows = movements.map(m => {
            const dateObj = new Date(m.date);
            return [
                dateObj.toLocaleDateString('fr-FR'),
                dateObj.toLocaleTimeString('fr-FR'),
                `"${m.garmentName.replace(/"/g, '""')}"`,
                `"${m.serialNumber}"`,
                `"${m.brand}"`,
                `"${m.size}"`,
                `"${m.color}"`,
                m.type,
                m.previousStock,
                m.newStock,
                m.change > 0 ? `+${m.change}` : m.change
            ].join(';');
        });

        const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `Historique_Stock_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                onClick={e => e.stopPropagation()}
                style={{
                    maxWidth: '850px',
                    width: '95%',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 0,
                    overflow: 'hidden'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div style={{ padding: '0.5rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                            <History size={20} color="var(--text-secondary)" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Historique des Mouvements</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                {movements.length} événement(s) enregistré(s)
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {movements.length > 0 && (
                            <>
                                <button
                                    onClick={handleExportCSV}
                                    className="btn btn-outline"
                                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                                    title="Exporter en CSV"
                                >
                                    <Download size={15} />
                                    CSV
                                </button>
                                <button
                                    onClick={handleClear}
                                    className="btn btn-outline"
                                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: 'var(--accent-red)' }}
                                    title="Effacer l'historique"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </>
                        )}
                        <button onClick={onClose} style={{ color: 'var(--text-secondary)', padding: '0.5rem' }}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div style={{
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    display: 'flex',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ position: 'relative', flex: '1 1 240px' }}>
                        <Search
                            size={16}
                            color="var(--text-secondary)"
                            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
                        />
                        <input
                            type="text"
                            placeholder="Filtrer par article ou référence..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ paddingLeft: '2.2rem', paddingRight: '0.75rem', height: '36px', fontSize: '0.85rem' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {[
                            { id: 'all', label: 'Tous' },
                            { id: 'in', label: 'Entrées (+)' },
                            { id: 'out', label: 'Sorties (-)' },
                            { id: 'import', label: 'Imports' }
                        ].map(f => (
                            <button
                                key={f.id}
                                className={`pagination-btn ${filterType === f.id ? 'active' : ''}`}
                                onClick={() => setFilterType(f.id)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List / Table of movements */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
                    {filteredMovements.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                            <History size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
                            <p style={{ fontWeight: 600 }}>Aucun mouvement enregistré</p>
                            <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                Les ajouts, modifications de stock et imports apparaîtront ici automatiquement.
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {filteredMovements.map((m) => {
                                const isPositive = m.change > 0;
                                const isNegative = m.change < 0;
                                const dateObj = new Date(m.date);
                                const dateFormatted = dateObj.toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                });
                                const timeFormatted = dateObj.toLocaleTimeString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                });

                                return (
                                    <div
                                        key={m.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '0.85rem 1rem',
                                            borderRadius: '10px',
                                            border: '1px solid var(--border-color)',
                                            background: 'var(--bg-secondary)',
                                            gap: '1rem',
                                            flexWrap: 'wrap'
                                        }}
                                    >
                                        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                                            <div style={{
                                                padding: '0.5rem',
                                                borderRadius: '8px',
                                                background: isPositive
                                                    ? 'rgba(16, 185, 129, 0.12)'
                                                    : isNegative
                                                    ? 'var(--accent-red-light)'
                                                    : 'var(--bg-tertiary)',
                                                color: isPositive
                                                    ? '#10b981'
                                                    : isNegative
                                                    ? 'var(--accent-red)'
                                                    : 'var(--text-secondary)',
                                                display: 'flex'
                                            }}>
                                                {isPositive ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                            </div>

                                            <div>
                                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{m.garmentName}</span>
                                                    <span style={{
                                                        fontSize: '0.725rem',
                                                        fontFamily: 'monospace',
                                                        padding: '0.15rem 0.4rem',
                                                        background: 'var(--bg-tertiary)',
                                                        borderRadius: '4px'
                                                    }}>
                                                        {m.serialNumber}
                                                    </span>
                                                    <span style={{
                                                        fontSize: '0.725rem',
                                                        padding: '0.15rem 0.4rem',
                                                        background: 'var(--bg-tertiary)',
                                                        borderRadius: '4px',
                                                        color: 'var(--text-secondary)'
                                                    }}>
                                                        Taille: {m.size} • {m.color}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                                                    {dateFormatted} à {timeFormatted} • {m.brand}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                                            <span style={{
                                                fontWeight: 800,
                                                fontSize: '1rem',
                                                color: isPositive ? '#10b981' : isNegative ? 'var(--accent-red)' : 'var(--text-primary)'
                                            }}>
                                                {isPositive ? `+${m.change}` : m.change} unité(s)
                                            </span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                {m.previousStock} → <strong>{m.newStock}</strong>
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StockHistoryModal;
