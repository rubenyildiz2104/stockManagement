import React from 'react';
import { Package, TrendingUp, Plus, AlertTriangle, AlertCircle, ArrowRight } from 'lucide-react';
import StatCard from '../components/StatCard';
import StockChart from '../components/StockChart';
import type { Garment, View } from '../types';

interface DashboardProps {
    garments: Garment[];
    onNavigate: (view: View) => void;
    onUpdate?: (garment: Garment) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ garments, onNavigate, onUpdate }) => {
    const totalItems = garments.reduce((sum, g) => sum + g.currentStock, 0);
    const totalValue = garments.reduce((sum, item) => sum + (item.price * item.currentStock), 0);

    const outOfStockItems = garments.filter(g => g.currentStock === 0);
    const lowStockItems = garments.filter(g => g.currentStock > 0 && g.currentStock <= 2);
    const alertItems = [...outOfStockItems, ...lowStockItems];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 800 }}>Tableau de bord</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Aperçu et alertes de votre inventaire</p>
                </div>
                <button className="btn btn-primary" onClick={() => onNavigate('add-garment')}>
                    <Plus size={18} />
                    Ajouter un vêtement
                </button>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <StatCard
                    title="Unités Totales"
                    value={totalItems}
                    subValue="Nombre total de pièces"
                    Icon={Package}
                />
                <StatCard
                    title="Valeur de l'Inventaire"
                    value={`${totalValue.toLocaleString()} €`}
                    subValue="Valeur marchande totale"
                    Icon={TrendingUp}
                />
                <StatCard
                    title="Ruptures de Stock"
                    value={outOfStockItems.length}
                    subValue="Articles à stock 0"
                    Icon={AlertTriangle}
                    variant={outOfStockItems.length > 0 ? 'danger' : 'default'}
                />
                <StatCard
                    title="Stock Critique"
                    value={lowStockItems.length}
                    subValue="Articles avec 1 ou 2 unités"
                    Icon={AlertCircle}
                />
            </div>

            {/* Low Stock Alert List Widget */}
            <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div style={{
                            padding: '0.5rem',
                            borderRadius: '8px',
                            background: alertItems.length > 0 ? 'var(--accent-red-light)' : 'rgba(16, 185, 129, 0.12)',
                            color: alertItems.length > 0 ? 'var(--accent-red)' : '#10b981',
                            display: 'flex'
                        }}>
                            {alertItems.length > 0 ? <AlertTriangle size={20} /> : <Package size={20} />}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                                Alertes de Réapprovisionnement
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                {outOfStockItems.length} en rupture • {lowStockItems.length} en stock faible
                            </p>
                        </div>
                    </div>

                    <button
                        className="btn btn-outline"
                        onClick={() => onNavigate('inventory')}
                        style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                    >
                        Gérer dans l'inventaire
                        <ArrowRight size={14} />
                    </button>
                </div>

                {alertItems.length === 0 ? (
                    <div style={{
                        padding: '1.5rem',
                        textAlign: 'center',
                        background: 'var(--bg-primary)',
                        borderRadius: '10px',
                        color: 'var(--text-secondary)',
                        fontSize: '0.875rem'
                    }}>
                        ✅ Tous vos articles ont un niveau de stock suffisant (aucun article sous le seuil critique).
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                        gap: '0.75rem'
                    }}>
                        {alertItems.slice(0, 6).map((garment) => {
                            const isOut = garment.currentStock === 0;
                            return (
                                <div
                                    key={garment.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.85rem 1rem',
                                        borderRadius: '10px',
                                        border: `1px solid ${isOut ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                                        background: 'var(--bg-secondary)',
                                        gap: '0.75rem'
                                    }}
                                >
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                                            <span className={`badge ${isOut ? 'badge-danger' : 'badge-warning'}`}>
                                                {isOut ? 'Rupture (0)' : `Reste: ${garment.currentStock}`}
                                            </span>
                                            <span style={{ fontSize: '0.725rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                                                {garment.serialNumber}
                                            </span>
                                        </div>
                                        <div style={{ fontWeight: 700, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {garment.name}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                            {garment.brand} • T.{garment.size} • {garment.color}
                                        </div>
                                    </div>

                                    {onUpdate && (
                                        <button
                                            className="btn btn-outline"
                                            onClick={() => onUpdate({ ...garment, currentStock: garment.currentStock + 1 })}
                                            style={{
                                                padding: '0.4rem 0.65rem',
                                                fontSize: '0.75rem',
                                                whiteSpace: 'nowrap',
                                                borderColor: isOut ? 'var(--accent-red)' : undefined
                                            }}
                                            title="Ajouter 1 unité en stock"
                                        >
                                            <Plus size={14} /> +1
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Category Stock Level Chart */}
            <div className="card" style={{ padding: '1rem', overflowX: 'hidden' }}>
                <StockChart data={garments} />
            </div>

            {/* Quick Link Card to Inventory */}
            <button
                className="card"
                onClick={() => onNavigate('inventory')}
                style={{
                    textAlign: 'left',
                    cursor: 'pointer',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                    border: '1px solid var(--border-color)',
                    transition: 'all 0.2s',
                    width: '100%'
                }}
            >
                <div style={{
                    padding: '0.75rem',
                    borderRadius: '12px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    display: 'flex'
                }}>
                    <Package size={24} />
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Consulter et gérer tout l'inventaire</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem' }}>
                        Filtrer par marque, taille, modèle, couleur, et exporter en Excel
                    </p>
                </div>
                <ArrowRight size={20} color="var(--text-secondary)" />
            </button>
        </div>
    );
};

export default Dashboard;
