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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
                <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 800 }}>Analyses</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Aperçu de la performance du stock</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '1rem'
            }}>
                <StatCard title="Unités" value={totalUnits} subValue="En stock" Icon={Package} />
                <StatCard title="Valeur" value={`${totalValue.toLocaleString()} €`} subValue="Marchande" Icon={DollarSign} />
                <StatCard title="Moyen" value={`${avgPrice} €`} subValue="Prix/unité" Icon={TrendingUp} />
                <StatCard title="Types" value={categoriesCount} subValue="Catégories" Icon={Tag} />
            </div>

            <div className="card" style={{ padding: '1rem', overflowX: 'hidden' }}>
                <StockChart data={garments} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '1.5rem' }}>
                {/* Value by Brand */}
                <div className="card" style={{ height: '350px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <BarChart3 size={18} color="var(--text-secondary)" />
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Valeur par Marque</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem' }}>Top marques actives</p>
                        </div>
                    </div>
                    <div style={{ flex: 1, width: '100%', overflow: 'hidden' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={brandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'var(--text-secondary)' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'var(--text-secondary)' }} />
                                <Tooltip
                                    cursor={{ fill: 'var(--bg-primary)', opacity: 0.1 }}
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--card-bg)',
                                        color: 'var(--text-primary)',
                                        fontSize: '12px'
                                    }}
                                    formatter={(value: number | undefined) => [value !== undefined ? `${value.toLocaleString()} €` : '0 €', 'Valeur']}
                                />
                                <Bar dataKey="value" fill="var(--accent-black)" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Units by Category */}
                <div className="card" style={{ height: '350px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <PieChart size={18} color="var(--text-secondary)" />
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Stock par Catégorie</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem' }}>Volume par type</p>
                        </div>
                    </div>
                    <div style={{ flex: 1, width: '100%', overflow: 'hidden' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'var(--text-secondary)' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'var(--text-secondary)' }} />
                                <Tooltip
                                    cursor={{ fill: 'var(--bg-primary)', opacity: 0.1 }}
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--card-bg)',
                                        color: 'var(--text-primary)',
                                        fontSize: '12px'
                                    }}
                                />
                                <Bar dataKey="count" fill="var(--text-secondary)" radius={[4, 4, 0, 0]} barSize={25} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: 'clamp(1rem, 4vw, 1.5rem)' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <DollarSign size={18} color="var(--text-secondary)" />
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Récapitulatif Financier</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem' }}>Valeur par catégorie</p>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {categoryData.sort((a, b) => b.value - a.value).map(cat => (
                        <div key={cat.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                            <div style={{ flex: 1 }}>
                                <span style={{ fontWeight: 600, display: 'block', fontSize: '0.9rem' }}>{cat.name}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{cat.count} unités</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{cat.value.toLocaleString()} €</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>
                                    {totalValue > 0 ? ((cat.value / totalValue) * 100).toFixed(1) : 0}% du total
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
