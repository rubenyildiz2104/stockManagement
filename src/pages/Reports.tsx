import React, { useState, useMemo } from 'react';
import { Package, DollarSign, TrendingUp, Tag, BarChart3, PieChart, ShoppingBag, Receipt, Calendar } from 'lucide-react';
import StatCard from '../components/StatCard';
import StockChart from '../components/StockChart';
import type { Garment, View } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getSalesSummary, type SalesPeriod } from '../lib/salesTracker';

interface ReportsProps {
    garments: Garment[];
    onNavigate: (view: View) => void;
}

const Reports: React.FC<ReportsProps> = ({ garments }) => {
    const [reportTab, setReportTab] = useState<'inventory' | 'sales'>('sales');
    const [salesPeriod, setSalesPeriod] = useState<SalesPeriod>('7days');

    // Inventory metrics
    const totalUnits = garments.reduce((sum, g) => sum + g.currentStock, 0);
    const totalValue = garments.reduce((sum, item) => sum + (item.price * item.currentStock), 0);
    const avgPrice = totalUnits > 0 ? Math.round(totalValue / totalUnits) : 0;
    const categoriesCount = new Set(garments.map(g => g.category)).size;

    // Sales metrics
    const salesSummary = useMemo(() => {
        return getSalesSummary(salesPeriod);
    }, [salesPeriod]);

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

    // Top Brands by Inventory Value
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 800 }}>Analyses & Rapports</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Suivi financier des ventes et valorisation du stock
                    </p>
                </div>

                {/* Report view switcher */}
                <div style={{
                    display: 'flex',
                    background: 'var(--bg-secondary)',
                    padding: '0.35rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    gap: '0.25rem'
                }}>
                    <button
                        className={`pagination-btn ${reportTab === 'sales' ? 'active' : ''}`}
                        onClick={() => setReportTab('sales')}
                        style={{ padding: '0.45rem 1rem', border: 'none', borderRadius: '7px', fontWeight: 600 }}
                    >
                        <Receipt size={16} style={{ marginRight: '0.4rem' }} /> Ventes & Revenus
                    </button>
                    <button
                        className={`pagination-btn ${reportTab === 'inventory' ? 'active' : ''}`}
                        onClick={() => setReportTab('inventory')}
                        style={{ padding: '0.45rem 1rem', border: 'none', borderRadius: '7px', fontWeight: 600 }}
                    >
                        <Package size={16} style={{ marginRight: '0.4rem' }} /> Stock & Valeur
                    </button>
                </div>
            </div>

            {/* TAB 1: SALES & REVENUE */}
            {reportTab === 'sales' && (
                <>
                    {/* Period selection */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        {[
                            { id: 'today' as SalesPeriod, label: "Aujourd'hui" },
                            { id: '7days' as SalesPeriod, label: '7 derniers jours' },
                            { id: '30days' as SalesPeriod, label: '30 derniers jours' },
                            { id: 'all' as SalesPeriod, label: 'Tout' }
                        ].map(p => (
                            <button
                                key={p.id}
                                className={`pagination-btn ${salesPeriod === p.id ? 'active' : ''}`}
                                onClick={() => setSalesPeriod(p.id)}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {/* Sales KPI Cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                        gap: '1rem'
                    }}>
                        <StatCard
                            title="Chiffre d'Affaires"
                            value={`${salesSummary.totalRevenue.toLocaleString()} €`}
                            subValue={`Sur ${salesPeriod === 'today' ? "aujourd'hui" : salesPeriod === '7days' ? '7j' : 'la période'}`}
                            Icon={DollarSign}
                        />
                        <StatCard
                            title="Pièces Vendues"
                            value={salesSummary.totalUnitsSold}
                            subValue="Articles sortis"
                            Icon={ShoppingBag}
                        />
                        <StatCard
                            title="Panier Moyen"
                            value={`${salesSummary.averageBasket.toLocaleString()} €`}
                            subValue="Par pièce vendue"
                            Icon={TrendingUp}
                        />
                        <StatCard
                            title="Transactions"
                            value={salesSummary.sales.length}
                            subValue="Ventes enregistrées"
                            Icon={Receipt}
                        />
                    </div>

                    {/* Daily Revenue Chart */}
                    <div className="card" style={{ height: '360px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <Calendar size={18} color="var(--text-secondary)" />
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Évolution des Ventes (7 Derniers Jours)</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem' }}>Chiffre d'affaires quotidien en €</p>
                            </div>
                        </div>
                        <div style={{ flex: 1, width: '100%', overflow: 'hidden' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={salesSummary.dailyChart} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} />
                                    <Tooltip
                                        cursor={{ fill: 'var(--bg-primary)', opacity: 0.1 }}
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: '1px solid var(--border-color)',
                                            background: 'var(--card-bg)',
                                            color: 'var(--text-primary)',
                                            fontSize: '12px'
                                        }}
                                        formatter={(val: number | undefined) => [val !== undefined ? `${val.toLocaleString()} €` : '0 €', 'Revenus']}
                                    />
                                    <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} barSize={36} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Selling Brands */}
                    <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Top Marques Vendues</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                            Classement des marques par chiffre d'affaires
                        </p>
                        {salesSummary.topBrands.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Aucune vente pour cette période.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {salesSummary.topBrands.map((b, idx) => (
                                    <div key={b.brand} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-secondary)', width: '20px' }}>
                                                #{idx + 1}
                                            </span>
                                            <div>
                                                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{b.brand}</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>
                                                    {b.count} pièce(s) vendue(s)
                                                </span>
                                            </div>
                                        </div>
                                        <span style={{ fontWeight: 800, color: '#10b981', fontSize: '0.95rem' }}>
                                            {b.revenue.toLocaleString()} €
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* TAB 2: INVENTORY & VALUE */}
            {reportTab === 'inventory' && (
                <>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                        gap: '1rem'
                    }}>
                        <StatCard title="Unités" value={totalUnits} subValue="En stock" Icon={Package} />
                        <StatCard title="Valeur" value={`${totalValue.toLocaleString()} €`} subValue="Marchande totale" Icon={DollarSign} />
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
                </>
            )}
        </div>
    );
};

export default Reports;
