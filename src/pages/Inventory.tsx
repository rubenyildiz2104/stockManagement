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
    const [brand, setBrand] = useState<string | 'Toutes'>('Toutes');
    const [color, setColor] = useState<string | 'Toutes'>('Toutes');
    const [model, setModel] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { availableCategories, availableBrands, availableColors } = useMemo(() => {
        return {
            availableCategories: Array.from(new Set(garments.map(g => g.category))).sort(),
            availableBrands: Array.from(new Set(garments.map(g => g.brand))).sort(),
            availableColors: Array.from(new Set(garments.map(g => g.color))).sort(),
        };
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
            const matchesBrand = brand === 'Toutes' || g.brand === brand;
            const matchesColor = color === 'Toutes' || g.color === color;
            const matchesModel = model === '' || g.model.toLowerCase().includes(model.toLowerCase());

            return matchesSearch && matchesCategory && matchesSize && matchesBrand && matchesColor && matchesModel;
        });
    }, [garments, search, category, size, brand, color, model]);

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 800 }}>Inventaire</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {filteredGarments.length} article(s) trouvé(s)
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', width: '100%', maxWidth: 'max-content' }}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".xlsx, .xls"
                        style={{ display: 'none' }}
                    />
                    <button className="btn btn-outline" onClick={() => fileInputRef.current?.click()} style={{ flex: 1 }}>
                        <FileSpreadsheet size={18} />
                        Importer
                    </button>
                    <button className="btn btn-primary" onClick={() => onNavigate('add-garment')} style={{ flex: 1.2 }}>
                        <Plus size={18} />
                        Ajouter
                    </button>
                </div>
            </div>

            <SearchFilterBar
                search={search}
                onSearchChange={setSearch}
                category={category}
                onCategoryChange={setCategory}
                brand={brand}
                onBrandChange={setBrand}
                color={color}
                onColorChange={setColor}
                model={model}
                onModelChange={setModel}
                size={size}
                onSizeChange={setSize}
                availableCategories={availableCategories}
                availableBrands={availableBrands}
                availableColors={availableColors}
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
