import type { StockMovement } from '../types';
import { supabase } from './supabase';

const STORAGE_KEY = 'chez_gabriel_stock_movements';

// Get all stored movements from localStorage
export const getStockMovements = (): StockMovement[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw);
    } catch (e) {
        console.error('Error reading stock movements:', e);
        return [];
    }
};

// Record a new movement
export const recordStockMovement = async (
    movement: Omit<StockMovement, 'id' | 'date'>
): Promise<StockMovement> => {
    const newMovement: StockMovement = {
        ...movement,
        id: Math.random().toString(36).substring(2, 11),
        date: new Date().toISOString()
    };

    // 1. Save locally in localStorage
    try {
        const current = getStockMovements();
        // Keep the last 500 movements to prevent storage bloat
        const updated = [newMovement, ...current].slice(0, 500);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
        console.error('Error caching stock movement:', e);
    }

    // 2. Best-effort async push to Supabase if table exists
    try {
        await supabase.from('stock_movements').insert([{
            garment_id: movement.garmentId || null,
            garment_name: movement.garmentName,
            serial_number: movement.serialNumber,
            brand: movement.brand,
            size: movement.size,
            color: movement.color,
            previous_stock: movement.previousStock,
            new_stock: movement.newStock,
            change: movement.change,
            type: movement.type,
            created_at: newMovement.date
        }]).then(({ error }) => {
            if (error && error.code !== '42P01') {
                // Ignore table doesn't exist error (42P01 in postgres)
                console.warn('Optional Supabase stock_movements sync notice:', error.message);
            }
        });
    } catch {
        // Silently continue if Supabase is offline or table is not created yet
    }

    return newMovement;
};

// Clear history
export const clearStockMovements = () => {
    localStorage.removeItem(STORAGE_KEY);
};
