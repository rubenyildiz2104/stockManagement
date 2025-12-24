import React, { useState, useMemo, useRef } from 'react';
import { Plus, FileSpreadsheet } from 'lucide-react';
import type { Garment, View, Category, Size } from '../types';
import SearchFilterBar from '../components/SearchFilterBar';
import GarmentTable from '../components/GarmentTable';
import { parseExcelStock } from '../utils/excelParser';

interface InventoryProps {
    garments: Garment[];
    onNavigate: (view: View) => void;
    onDelete: (garment: Garment) => void;
    onEdit: (garment: Garment) => void;
    onImport: (garments: Garment[]) => void;
}

const Inventory: React.FC<InventoryProps> = ({ garments, onNavigate, onDelete, onEdit, onImport }) => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState<Category | 'Toutes'>('Toutes');
    const [size, setSize] = useState<Size | 'Toutes'>('Toutes');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const availableCategories = useMemo(() => {
        return Array.from(new Set(garments.map(g => g.category)));
    }, [garments]);

    const filteredGarments = useMemo(() => {
        return garments.filter(g => {
            const searchStr = search.toLowerCase();
            const matchesSearch =
                g.name.toLowerCase().includes(searchStr) ||
                g.serialNumber.toLowerCase().includes(searchStr) ||
                g.brand.toLowerCase().includes(searchStr) ||
                g.model.toLowerCase().includes(searchStr) ||
                g.color.toLowerCase().includes(searchStr);
            const matchesCategory = category === 'Toutes' || g.category === category;
            const matchesSize = size === 'Toutes' || g.size === size;
            return matchesSearch && matchesCategory && matchesSize;
        });
    }, [garments, search, category, size]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target?.result;
            if (bstr instanceof ArrayBuffer) {
                const imported = parseExcelStock(bstr);
                onImport(imported);
                alert(`${imported.length} articles importés avec succès !`);
            }
        };
        reader.readAsArrayBuffer(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Gestion d'Inventaire</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Affichage de {filteredGarments.length} sur {garments.length} vêtements</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".xlsx, .xls"
                        style={{ display: 'none' }}
                    />
                    <button className="btn btn-outline" onClick={() => fileInputRef.current?.click()}>
                        <FileSpreadsheet size={20} />
                        Importer Excel
                    </button>
                    <button className="btn btn-primary" onClick={() => onNavigate('add-garment')}>
                        <Plus size={20} />
                        Ajouter un vêtement
                    </button>
                </div>
            </div>

            <SearchFilterBar
                search={search}
                onSearchChange={setSearch}
                category={category}
                onCategoryChange={setCategory}
                size={size}
                onSizeChange={setSize}
                availableCategories={availableCategories}
            />

            <GarmentTable
                garments={filteredGarments}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        </div>
    );
};

export default Inventory;
