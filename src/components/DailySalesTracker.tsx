import React, { useState, useMemo } from 'react';
import { ShoppingBag, TrendingUp, Receipt, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { getSalesSummary, type SalesPeriod } from '../lib/salesTracker';

interface DailySalesTrackerProps {
    onNavigateToReports?: () => void;
}

export const DailySalesTracker: React.FC<DailySalesTrackerProps> = () => {
    const [period, setPeriod] = useState<SalesPeriod>('today');
    const [showAll, setShowAll] = useState(false);

    const summary = useMemo(() => {
        return getSalesSummary(period);
    }, [period]);

    const displayedSales = showAll ? summary.sales : summary.sales.slice(0, 5);

    return (
        <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Header with period toggle */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
            }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{
                        padding: '0.5rem',
                        borderRadius: '8px',
                        background: 'rgba(16, 185, 129, 0.12)',
                        color: '#10b981',
                        display: 'flex'
                    }}>
                        <Receipt size={20} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Journal des Ventes & Chiffre d'Affaires</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            Suivi des sorties de caisse et revenus de la boutique
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-primary)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    {[
                        { id: 'today' as SalesPeriod, label: "Aujourd'hui" },
                        { id: '7days' as SalesPeriod, label: "7 jours" },
                        { id: '30days' as SalesPeriod, label: "30 jours" }
                    ].map(p => (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                                setPeriod(p.id);
                                setShowAll(false);
                            }}
                            className={`pagination-btn ${period === p.id ? 'active' : ''}`}
                            style={{
                                border: 'none',
                                padding: '0.35rem 0.65rem',
                                fontSize: '0.75rem',
                                borderRadius: '6px'
                            }}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Metrics cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.75rem'
            }}>
                <div style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)'
                }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <TrendingUp size={14} color="#10b981" /> Chiffre d'Affaires
                    </span>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '0.25rem', color: '#10b981' }}>
                        {summary.totalRevenue.toLocaleString()} €
                    </div>
                </div>

                <div style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)'
                }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <ShoppingBag size={14} /> Pièces Vendues
                    </span>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '0.25rem' }}>
                        {summary.totalUnitsSold} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>unité(s)</span>
                    </div>
                </div>

                <div style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)'
                }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Receipt size={14} /> Panier Moyen
                    </span>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '0.25rem' }}>
                        {summary.averageBasket.toLocaleString()} €
                    </div>
                </div>
            </div>

            {/* List of recent sales */}
            <div>
                {summary.sales.length === 0 ? (
                    <div style={{
                        padding: '1.5rem',
                        textAlign: 'center',
                        background: 'var(--bg-primary)',
                        borderRadius: '10px',
                        color: 'var(--text-secondary)',
                        fontSize: '0.85rem'
                    }}>
                        Aucune vente enregistrée pour {period === 'today' ? "aujourd'hui" : period === '7days' ? 'les 7 derniers jours' : 'cette période'}.
                        <br />
                        <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                            Les sorties de stock (vente ou scan -1) apparaîtront ici automatiquement avec leur montant.
                        </span>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {displayedSales.map((sale) => {
                            const dateObj = new Date(sale.date);
                            const timeStr = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                            const dateStr = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
                            const units = Math.abs(sale.change);
                            const itemPrice = sale.price || 0;
                            const totalSalePrice = units * itemPrice;

                            return (
                                <div
                                    key={sale.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '8px',
                                        background: 'var(--bg-secondary)',
                                        border: '1px solid var(--border-color)',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                        <div style={{
                                            padding: '0.4rem',
                                            borderRadius: '6px',
                                            background: 'var(--bg-tertiary)',
                                            color: 'var(--text-secondary)',
                                            display: 'flex',
                                            fontSize: '0.75rem',
                                            fontWeight: 600
                                        }}>
                                            <Clock size={14} style={{ marginRight: '0.25rem' }} />
                                            {period === 'today' ? timeStr : `${dateStr} ${timeStr}`}
                                        </div>

                                        <div>
                                            <div style={{ fontWeight: 700 }}>
                                                {sale.garmentName}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                {sale.brand} • T.{sale.size} • {sale.color} • Réf: {sale.serialNumber}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 800, color: '#10b981', fontSize: '0.95rem' }}>
                                            +{totalSalePrice.toLocaleString()} €
                                        </div>
                                        <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                                            {units} x {itemPrice} €
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {summary.sales.length > 5 && (
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => setShowAll(!showAll)}
                                style={{
                                    marginTop: '0.5rem',
                                    fontSize: '0.8rem',
                                    padding: '0.4rem',
                                    justifyContent: 'center',
                                    width: '100%'
                                }}
                            >
                                {showAll ? (
                                    <>
                                        <ChevronUp size={15} /> Réduire la liste
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown size={15} /> Voir toutes les ventes ({summary.sales.length})
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailySalesTracker;
