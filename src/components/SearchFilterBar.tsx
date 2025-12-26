import React, { useMemo } from 'react';
import { Search } from 'lucide-react';
import type { Category, Size } from '../types';

interface SearchFilterBarProps {
    search: string;
    onSearchChange: (val: string) => void;
    category: Category | 'Toutes';
    onCategoryChange: (val: Category | 'Toutes') => void;
    size: Size | 'Toutes';
    onSizeChange: (val: Size | 'Toutes') => void;
    availableCategories: Category[]; // Passed dynamically from Inventory
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
    search,
    onSearchChange,
    category,
    onCategoryChange,
    size,
    onSizeChange,
    availableCategories
}) => {
    const categoriesList = useMemo(() => ['Toutes', ...availableCategories.sort()], [availableCategories]);

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ padding: '0.5rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                    <Search size={18} color="var(--text-secondary)" />
                </div>
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Recherche & Filtres</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem' }}>Trouvez des articles par Marque, Modèle, Série ou Couleur</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search
                        size={16}
                        color="var(--text-secondary)"
                        style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                        type="text"
                        placeholder="Rechercher par Marque, Modèle, Série..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        style={{ width: '100%', paddingLeft: '2.25rem' }}
                    />
                </div>

                <select
                    value={category}
                    onChange={(e) => onCategoryChange(e.target.value as Category | 'Toutes')}
                    style={{ width: '220px' }}
                >
                    {categoriesList.map(c => <option key={c} value={c}>{c === 'Toutes' ? 'Toutes les catégories' : c}</option>)}
                </select>

                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Taille (ex: 52)"
                        value={size === 'Toutes' ? '' : size}
                        onChange={(e) => onSizeChange(e.target.value || 'Toutes')}
                        style={{ width: '160px' }}
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
