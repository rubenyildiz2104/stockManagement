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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Tableau de bord</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Aperçu de votre inventaire</p>
                </div>
                <button className="btn btn-primary" onClick={() => onNavigate('add-garment')}>
                    <Plus size={20} />
                    Ajouter un vêtement
                </button>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
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

            <StockChart data={garments} />

            <div style={{ gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                <button className="card" onClick={() => onNavigate('inventory')} style={{
                    textAlign: 'left',
                    cursor: 'pointer',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    border: '1px solid var(--border-color)',
                    transition: 'all 0.2s'
                }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ padding: '0.75rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid var(--border-color)' }}>
                            <Package size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Inventaire</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Gérer vos articles en stock</p>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
