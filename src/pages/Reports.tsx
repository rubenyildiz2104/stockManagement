import React from 'react';
import { Package, DollarSign, TrendingUp, Tag, BarChart3, PieChart } from 'lucide-react';
import StatCard from '../components/StatCard';
import StockChart from '../components/StockChart';
import type { Garment, View } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ReportsProps {
    garments: Garment[];
    onNavigate: (view: View) => void;
}

const Reports: React.FC<ReportsProps> = ({ garments }) => {
    const totalUnits = garments.reduce((sum, g) => sum + g.currentStock, 0);
    const totalValue = garments.reduce((sum, item) => sum + (item.price * item.currentStock), 0);
    const avgPrice = totalUnits > 0 ? Math.round(totalValue / totalUnits) : 0;
    const categoriesCount = new Set(garments.map(g => g.category)).size;

    // Data for Inventory by Category
    const categoryData = garments.reduce((acc, item) => {
        const existing = acc.find(d => d.name === item.category);
        if (existing) {
            existing.count += item.currentStock;
            existing.value += (item.price * item.currentStock);
        } else {
            acc.push({ name: item.category, count: item.currentStock, value: (item.price * item.currentStock) });
        }
        return acc;
    }, [] as { name: string; count: number; value: number }[]);

    // Top Brands by Value
    const brandData = garments.reduce((acc, item) => {
        const existing = acc.find(d => d.name === item.brand);
        if (existing) {
            existing.value += (item.price * item.currentStock);
        } else {
            acc.push({ name: item.brand, value: (item.price * item.currentStock) });
        }
        return acc;
    }, [] as { name: string; value: number }[]).sort((a, b) => b.value - a.value).slice(0, 8);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Rapports & Analyses</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Aperçu détaillé de la valeur de votre stock</p>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
                <StatCard title="Unités Totales" value={totalUnits} subValue="Pièces en stock" Icon={Package} />
                <StatCard title="Valeur Totale" value={`${totalValue.toLocaleString()} €`} subValue="Valeur marchande" Icon={DollarSign} />
                <StatCard title="Prix Moyen" value={`${avgPrice} €`} subValue="Par unité" Icon={TrendingUp} />
                <StatCard title="Catégories" value={categoriesCount} subValue="Types de vêtements" Icon={Tag} />
            </div>

            <StockChart data={garments} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Value by Brand */}
                <div className="card" style={{ height: '350px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <BarChart3 size={18} color="var(--text-secondary)" />
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Valeur par Marque</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem' }}>Top marques par capital immobilisé</p>
                        </div>
                    </div>
                    <div style={{ flex: 1, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={brandData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    formatter={(value: number | undefined) => [value !== undefined ? `${value.toLocaleString()} €` : '0 €', 'Valeur']}
                                />
                                <Bar dataKey="value" fill="#000000" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Units by Category */}
                <div className="card" style={{ height: '350px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <PieChart size={18} color="var(--text-secondary)" />
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Unités par Catégorie</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem' }}>Répartition du volume de stock</p>
                        </div>
                    </div>
                    <div style={{ flex: 1, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                />
                                <Bar dataKey="count" fill="#64748b" radius={[4, 4, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="card">
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <DollarSign size={18} color="var(--text-secondary)" />
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Récapitulatif Financier</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem' }}>Valeur totale par catégorie</p>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {categoryData.sort((a, b) => b.value - a.value).map(cat => (
                        <div key={cat.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                            <div>
                                <span style={{ fontWeight: 600, display: 'block' }}>{cat.name}</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{cat.count} unités</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontWeight: 700 }}>{cat.value.toLocaleString()} €</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>
                                    {((cat.value / totalValue) * 100).toFixed(1)}% du stock
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reports;
