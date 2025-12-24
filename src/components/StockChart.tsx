import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Garment } from '../types';

interface StockChartProps {
    data: Garment[];
}

const StockChart: React.FC<StockChartProps> = ({ data }) => {
    const chartData = data.reduce((acc, item) => {
        const existing = acc.find(d => d.name === item.category);
        if (existing) {
            existing.current += item.currentStock;
        } else {
            acc.push({
                name: item.category,
                current: item.currentStock,
            });
        }
        return acc;
    }, [] as { name: string; current: number }[]);

    return (
        <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Aperçu des niveaux de stock</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Stock actuel par catégorie de vêtement</p>
            </div>

            <div style={{ flex: 1, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                        barGap={0}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            align="center"
                            iconType="square"
                            formatter={(value) => <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500 }}>{value === 'current' ? 'Stock Actuel' : 'Stock'}</span>}
                        />
                        <Bar dataKey="current" name="current" fill="#000000" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default StockChart;
