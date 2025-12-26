import React, { useMemo } from 'react';
import { Search } from 'lucide-react';
import type { Category, Size } from '../types';

interface SearchFilterBarProps {
    search: string;
    onSearchChange: (val: string) => void;
    category: Category | 'Toutes';
    onCategoryChange: (val: Category | 'Toutes') => void;
    brand: string | 'Toutes';
    onBrandChange: (val: string | 'Toutes') => void;
    color: string;
    onColorChange: (val: string) => void;
    model: string;
    onModelChange: (val: string) => void;
    size: Size | 'Toutes';
    onSizeChange: (val: Size | 'Toutes') => void;
    availableCategories: Category[];
    availableBrands: string[];
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
    search,
    onSearchChange,
    category,
    onCategoryChange,
    brand,
    onBrandChange,
    color,
    onColorChange,
    model,
    onModelChange,
    size,
    onSizeChange,
    availableCategories,
    availableBrands
}) => {
    const categoriesList = useMemo(() => ['Toutes', ...availableCategories], [availableCategories]);
    const brandsList = useMemo(() => ['Toutes', ...availableBrands], [availableBrands]);

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ padding: '0.5rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                    <Search size={18} color="var(--text-secondary)" />
                </div>
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Recherche & Filtres</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem' }}>Affinez votre recherche par attributs</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1 1 100%' }}>
                    <Search
                        size={16}
                        color="var(--text-secondary)"
                        style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                        type="text"
                        placeholder="Recherche globale (Nom, Série...)"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        style={{ width: '100%', paddingLeft: '2.25rem' }}
                    />
                </div>

                <select
                    value={category}
                    onChange={(e) => onCategoryChange(e.target.value as Category | 'Toutes')}
                    style={{ flex: '1 1 calc(50% - 0.5rem)', minWidth: '140px' }}
                >
                    {categoriesList.map(c => <option key={c} value={c}>{c === 'Toutes' ? 'Catégorie: Toutes' : c}</option>)}
                </select>

                <select
                    value={brand}
                    onChange={(e) => onBrandChange(e.target.value)}
                    style={{ flex: '1 1 calc(50% - 0.5rem)', minWidth: '140px' }}
                >
                    {brandsList.map(b => <option key={b} value={b}>{b === 'Toutes' ? 'Marque: Toutes' : b}</option>)}
                </select>

                <div style={{ position: 'relative', flex: '1 1 calc(33% - 0.75rem)', minWidth: '120px' }}>
                    <input
                        type="text"
                        placeholder="Modèle..."
                        value={model}
                        onChange={(e) => onModelChange(e.target.value)}
                        style={{ width: '100%' }}
                    />
                    {model && (
                        <button
                            onClick={() => onModelChange('')}
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '10px' }}
                        >✕</button>
                    )}
                </div>

                <div style={{ position: 'relative', flex: '1 1 calc(33% - 0.75rem)', minWidth: '120px' }}>
                    <input
                        type="text"
                        placeholder="Couleur..."
                        value={color}
                        onChange={(e) => onColorChange(e.target.value)}
                        style={{ width: '100%' }}
                    />
                    {color && (
                        <button
                            onClick={() => onColorChange('')}
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '10px' }}
                        >✕</button>
                    )}
                </div>

                <div style={{ position: 'relative', flex: '1 1 calc(33% - 0.75rem)', minWidth: '100px' }}>
                    <input
                        type="text"
                        placeholder="Taille (ex: 52)"
                        value={size === 'Toutes' ? '' : size}
                        onChange={(e) => onSizeChange(e.target.value || 'Toutes')}
                        style={{ width: '100%' }}
                    />
                    {size !== 'Toutes' && (
                        <button
                            onClick={() => onSizeChange('Toutes')}
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '10px' }}
                        >✕</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchFilterBar;
