import type { StockMovement } from '../types';
import { getStockMovements } from './stockHistory';

export type SalesPeriod = 'today' | '7days' | '30days' | 'all';

export interface SalesSummary {
    period: SalesPeriod;
    totalRevenue: number;
    totalUnitsSold: number;
    averageBasket: number;
    sales: StockMovement[];
    dailyChart: { date: string; revenue: number; units: number }[];
    topBrands: { brand: string; count: number; revenue: number }[];
}

export const getSalesSummary = (period: SalesPeriod = 'today'): SalesSummary => {
    const movements = getStockMovements();
    const now = new Date();

    // Only negative changes are sales / stock exits
    const salesMovements = movements.filter(m => m.change < 0);

    const filtered = salesMovements.filter(m => {
        const itemDate = new Date(m.date);

        if (period === 'today') {
            return itemDate.toDateString() === now.toDateString();
        }

        if (period === '7days') {
            const diffDays = (now.getTime() - itemDate.getTime()) / (1000 * 3600 * 24);
            return diffDays <= 7;
        }

        if (period === '30days') {
            const diffDays = (now.getTime() - itemDate.getTime()) / (1000 * 3600 * 24);
            return diffDays <= 30;
        }

        return true;
    });

    let totalRevenue = 0;
    let totalUnitsSold = 0;
    const brandMap = new Map<string, { count: number; revenue: number }>();

    filtered.forEach(m => {
        const units = Math.abs(m.change);
        const unitPrice = m.price || 0;
        const itemRevenue = units * unitPrice;

        totalUnitsSold += units;
        totalRevenue += itemRevenue;

        const currentBrand = brandMap.get(m.brand) || { count: 0, revenue: 0 };
        currentBrand.count += units;
        currentBrand.revenue += itemRevenue;
        brandMap.set(m.brand, currentBrand);
    });

    const averageBasket = totalUnitsSold > 0 ? Math.round(totalRevenue / totalUnitsSold) : 0;

    // Daily chart aggregation for the last 7 days
    const dailyMap = new Map<string, { revenue: number; units: number }>();
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateKey = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
        dailyMap.set(dateKey, { revenue: 0, units: 0 });
    }

    salesMovements.forEach(m => {
        const d = new Date(m.date);
        const diffDays = (now.getTime() - d.getTime()) / (1000 * 3600 * 24);
        if (diffDays <= 7) {
            const dateKey = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
            if (dailyMap.has(dateKey)) {
                const current = dailyMap.get(dateKey)!;
                const units = Math.abs(m.change);
                current.units += units;
                current.revenue += units * (m.price || 0);
            }
        }
    });

    const dailyChart = Array.from(dailyMap.entries()).map(([date, val]) => ({
        date,
        revenue: val.revenue,
        units: val.units
    }));

    const topBrands = Array.from(brandMap.entries())
        .map(([brand, data]) => ({ brand, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    return {
        period,
        totalRevenue,
        totalUnitsSold,
        averageBasket,
        sales: filtered,
        dailyChart,
        topBrands
    };
};
