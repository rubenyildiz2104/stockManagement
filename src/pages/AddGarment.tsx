import React, { useState, useMemo, useEffect } from 'react';
import { Package, ArrowLeft, Save } from 'lucide-react';
import type { Garment, View, Size } from '../types';

interface AddGarmentProps {
    garments: Garment[];
    onAdd: (garment: Omit<Garment, 'id' | 'dateAdded'>) => void;
    onUpdate: (garment: Garment) => void;
    onNavigate: (view: View) => void;
    initialData?: Garment | null;
}

const AddGarment: React.FC<AddGarmentProps> = ({ garments, onAdd, onUpdate, onNavigate, initialData }) => {
    const isEditing = !!initialData;

    const availableCategories = useMemo(() => {
        return Array.from(new Set(garments.map(g => g.category))).sort();
    }, [garments]);

    const [formData, setFormData] = useState({
        serialNumber: '',
        name: '',
        brand: '',
        model: '',
        category: availableCategories[0] || 'Costumes',
        customCategory: '',
        useCustomCategory: false,
        size: 'M' as Size,
        color: '',
        price: '',
        currentStock: '0',

    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                serialNumber: initialData.serialNumber,
                name: initialData.name,
                brand: initialData.brand,
                model: initialData.model,
                category: initialData.category,
                customCategory: '',
                useCustomCategory: false,
                size: initialData.size,
                color: initialData.color,
                price: String(initialData.price),
                currentStock: String(initialData.currentStock),

            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const commonData = {
            serialNumber: formData.serialNumber,
            name: formData.name,
            brand: formData.brand,
            model: formData.model,
            category: formData.useCustomCategory ? formData.customCategory : formData.category,
            size: formData.size,
            color: formData.color,
            price: Number(formData.price),
            currentStock: Number(formData.currentStock),

        };

        if (isEditing && initialData) {
            onUpdate({
                ...initialData,
                ...commonData
            });
        } else {
            onAdd(commonData);
            onNavigate('inventory');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'nowrap', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', fontWeight: 800, lineHeight: 1.1 }}>
                        {isEditing ? 'Modifier' : 'Ajouter un vêtement'}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        {isEditing ? `Article ${initialData?.serialNumber}` : 'Nouveau produit dans le stock'}
                    </p>
                </div>
                <button className="btn btn-outline" onClick={() => onNavigate('inventory')} style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem', height: 'fit-content' }}>
                    <ArrowLeft size={16} />
                    Retour
                </button>
            </div>

            <div className="card" style={{ padding: '0' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ padding: '0.4rem', background: 'var(--bg-primary)', borderRadius: '6px', display: 'flex' }}>
                        <Package size={16} color="var(--text-secondary)" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Informations produit</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Entrez les champs ci-dessous</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Marque (Brand)</label>
                        <input
                            required
                            placeholder="ex: Lenoci / Textura"
                            value={formData.brand}
                            onChange={e => setFormData({ ...formData, brand: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Modèle</label>
                        <input
                            required
                            placeholder="ex: 552 / 61022"
                            value={formData.model}
                            onChange={e => setFormData({ ...formData, model: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Numéro d'Article (Série)</label>
                        <input
                            required
                            placeholder="ex: L01L85 / 643264"
                            value={formData.serialNumber}
                            onChange={e => setFormData({ ...formData, serialNumber: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Nom affiché</label>
                        <input
                            required
                            placeholder="ex: Imperméable Lenoci"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Catégorie</label>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {!formData.useCustomCategory ? (
                                <select
                                    style={{ flex: 1, minWidth: '200px' }}
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                    <option value="__NEW__">+ Nouvelle catégorie...</option>
                                </select>
                            ) : (
                                <input
                                    autoFocus
                                    style={{ flex: 1, minWidth: '200px' }}
                                    placeholder="Entrez une nouvelle catégorie"
                                    value={formData.customCategory}
                                    onChange={e => setFormData({ ...formData, customCategory: e.target.value })}
                                />
                            )}
                            {formData.useCustomCategory && (
                                <button type="button" className="btn btn-outline" onClick={() => setFormData({ ...formData, useCustomCategory: false })}>Annuler</button>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Taille</label>
                        <input
                            required
                            placeholder="ex: 52 / L / XL"
                            value={formData.size}
                            onChange={e => setFormData({ ...formData, size: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Couleur</label>
                        <input
                            required
                            placeholder="ex: Marine / Gris"
                            value={formData.color}
                            onChange={e => setFormData({ ...formData, color: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Prix unitaire (€)</label>
                        <input
                            required
                            type="number"
                            placeholder="ex: 220"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Stock Actuel</label>
                        <input
                            required
                            type="number"
                            value={formData.currentStock}
                            onChange={e => setFormData({ ...formData, currentStock: e.target.value })}
                        />
                    </div>

                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1, minWidth: '150px' }}>
                            <Save size={18} />
                            {isEditing ? 'Sauvegarder' : "Ajouter"}
                        </button>
                        <button type="button" className="btn btn-outline" onClick={() => onNavigate('inventory')} style={{ flex: 1, minWidth: '150px' }}>
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddGarment;
