import React from 'react';
import { Package, TrendingUp, Plus } from 'lucide-react';
import StatCard from '../components/StatCard';
import StockChart from '../components/StockChart';
import type { Garment, View } from '../types';

interface DashboardProps {
    garments: Garment[];
    onNavigate: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ garments, onNavigate }) => {
    const totalItems = garments.reduce((sum, g) => sum + g.currentStock, 0);
    const totalValue = garments.reduce((sum, item) => sum + (item.price * item.currentStock), 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 800 }}>Tableau de bord</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Aperçu de votre inventaire</p>
                </div>
                <button className="btn btn-primary" onClick={() => onNavigate('add-garment')}>
                    <Plus size={18} />
                    Ajouter
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <StatCard
                    title="Unités Totales"
                    value={totalItems}
                    subValue="Nombre total de pièces"
                    Icon={Package}
                />
                <StatCard
                    title="Valeur de l'Inventaire"
                    value={`${totalValue.toLocaleString()} €`}
                    subValue="Valeur totale du stock"
                    Icon={TrendingUp}
                />
            </div>

            <div className="card" style={{ padding: '1rem', overflowX: 'hidden' }}>
                <StockChart data={garments} />
            </div>

            <button className="card" onClick={() => onNavigate('inventory')} style={{
                textAlign: 'left',
                cursor: 'pointer',
                padding: '1.5rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                border: '1px solid var(--border-color)',
                transition: 'all 0.2s',
                width: '100%'
            }}>
                <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex' }}>
                    <Package size={24} />
                </div>
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Consulter l'inventaire</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem' }}>Gérer vos articles en stock</p>
                </div>
            </button>
        </div>
    );
};

export default Dashboard;
