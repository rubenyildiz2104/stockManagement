import { supabase } from './supabase';
import type { Garment } from '../types';

// Convertir les données de la base vers le format de l'application
const dbToGarment = (dbRow: any): Garment => ({
    id: dbRow.id,
    name: dbRow.name,
    serialNumber: dbRow.serial_number,
    brand: dbRow.brand,
    model: dbRow.model,
    category: dbRow.category,
    size: dbRow.size,
    color: dbRow.color,
    price: dbRow.price,
    currentStock: dbRow.current_stock,
    dateAdded: dbRow.date_added,
});

// Convertir les données de l'application vers le format de la base
const garmentToDb = (garment: Omit<Garment, 'id' | 'dateAdded'> & { id?: string; dateAdded?: string }, isUpdate = false) => {
    const dbData: any = {
        name: garment.name,
        serial_number: garment.serialNumber,
        brand: garment.brand,
        model: garment.model,
        category: garment.category,
        size: garment.size,
        color: garment.color,
        price: garment.price,
        current_stock: garment.currentStock,
        date_added: garment.dateAdded,
    };

    // N'inclure l'ID que pour les mises à jour (update)
    // Pour les insertions (insert/upsert), on laisse Supabase générer un UUID valide
    if (isUpdate && garment.id) {
        dbData.id = garment.id;
    }

    return dbData;
};

// Récupérer tous les vêtements
export const getAllGarments = async (): Promise<Garment[]> => {
    const { data, error } = await supabase
        .from('garments')
        .select('*')
        .order('date_added', { ascending: false });

    if (error) {
        console.error('Error fetching garments:', error);
        throw error;
    }

    return data.map(dbToGarment);
};

// Ajouter un vêtement
export const addGarment = async (garment: Omit<Garment, 'id' | 'dateAdded'>): Promise<Garment> => {
    const { data, error } = await supabase
        .from('garments')
        .insert([garmentToDb(garment, false)])
        .select()
        .single();

    if (error) {
        console.error('Error adding garment:', error);
        throw error;
    }

    return dbToGarment(data);
};

// Mettre à jour un vêtement
export const updateGarment = async (garment: Garment): Promise<Garment> => {
    const { data, error } = await supabase
        .from('garments')
        .update(garmentToDb(garment, true))
        .eq('id', garment.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating garment:', error);
        throw error;
    }

    return dbToGarment(data);
};

// Supprimer un vêtement
export const deleteGarment = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('garments')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting garment:', error);
        throw error;
    }
};

// Importer plusieurs vêtements
export const importGarments = async (garments: Garment[]): Promise<Garment[]> => {
    const { data, error } = await supabase
        .from('garments')
        .insert(garments.map(g => garmentToDb(g, false)))
        .select();

    if (error) {
        console.error('Error importing garments:', error);
        throw error;
    }

    return data.map(dbToGarment);
};
