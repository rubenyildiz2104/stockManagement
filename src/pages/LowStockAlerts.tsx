import React from 'react';
import { AlertCircle, ArrowLeft, Package } from 'lucide-react';
import StatCard from '../components/StatCard';
import type { Garment, View } from '../types';

interface LowStockAlertsProps {
    garments: Garment[];
    onNavigate: (view: View) => void;
}

const LowStockAlerts: React.FC<LowStockAlertsProps> = ({ garments, onNavigate }) => {
    const lowStockItems = garments.filter(item => item.currentStock < item.minStock);
    const criticalItems = lowStockItems.filter(item => item.currentStock === 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Alertes de Stock</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Articles nécessitant un réapprovisionnement immédiat</p>
                </div>
                <button className="btn btn-outline" onClick={() => onNavigate('dashboard')}>
                    <ArrowLeft size={20} />
                    Retour
                </button>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
                <StatCard title="Alertes Totales" value={lowStockItems.length} subValue="Sous le seuil minimum" Icon={AlertCircle} variant="danger" />
                <StatCard title="Rupture de Stock" value={criticalItems.length} subValue="Articles à 0 unité" Icon={Package} variant="danger" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {lowStockItems.map(item => (
                    <div key={item.id} className="card" style={{ borderLeft: `4px solid ${item.currentStock === 0 ? 'var(--accent-red)' : '#f59e0b'}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{item.category}</span>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0.25rem 0' }}>{item.brand} {item.model}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.color} — Taille {item.size}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: item.currentStock === 0 ? 'var(--accent-red)' : '#f59e0b' }}>
                                    {item.currentStock}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Actuel</div>
                            </div>
                        </div>

                        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                <span>Seuil minimum</span>
                                <span style={{ fontWeight: 600 }}>{item.minStock}</span>
                            </div>
                            <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%',
                                    width: `${Math.min(100, (item.currentStock / item.minStock) * 100)}%`,
                                    background: item.currentStock === 0 ? 'var(--accent-red)' : '#f59e0b'
                                }}></div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--accent-red)', fontWeight: 600 }}>
                                Manquant: {item.minStock - item.currentStock} unités
                            </span>
                            <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => onNavigate('inventory')}>
                                Gérer
                            </button>
                        </div>
                    </div>
                ))}

                {lowStockItems.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', background: 'white', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'inline-flex', padding: '1rem', background: '#f0fdf4', borderRadius: '50%', marginBottom: '1rem' }}>
                            <Package size={32} color="#16a34a" />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Tout est en ordre !</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Tous vos articles sont au-dessus de leur seuil de stock minimum.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LowStockAlerts;
