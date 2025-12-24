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
        minStock: '10'
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
                minStock: String(initialData.minStock)
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
            minStock: Number(formData.minStock),
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
                        {isEditing ? 'Modifier le vêtement' : 'Ajouter un nouveau vêtement'}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {isEditing ? `Modification de l'article ${initialData?.serialNumber}` : 'Remplissez les détails pour ajouter un nouvel article à votre inventaire'}
                    </p>
                </div>
                <button className="btn btn-outline" onClick={() => onNavigate('inventory')}>
                    <ArrowLeft size={20} />
                    Retour à l'inventaire
                </button>
            </div>

            <div className="card" style={{ maxWidth: '800px' }}>
                <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ padding: '0.5rem', background: '#f8fafc', borderRadius: '8px' }}>
                        <Package size={18} color="var(--text-secondary)" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Informations sur le vêtement</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem' }}>Entrez tous les détails requis</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
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

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Catégorie</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {!formData.useCustomCategory ? (
                                <select
                                    style={{ flex: 1 }}
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                    <option value="__NEW__">+ Nouvelle catégorie...</option>
                                </select>
                            ) : (
                                <input
                                    autoFocus
                                    style={{ flex: 1 }}
                                    placeholder="Entrez une nouvelle catégorie"
                                    value={formData.customCategory}
                                    onChange={e => setFormData({ ...formData, customCategory: e.target.value })}
                                />
                            )}
                            {formData.useCustomCategory && (
                                <button type="button" className="btn btn-outline" onClick={() => setFormData({ ...formData, useCustomCategory: false })}>Annuler</button>
                            )}
                        </div>
                        {formData.category === '__NEW__' && !formData.useCustomCategory && (
                            <button
                                type="button"
                                style={{ fontSize: '0.75rem', alignSelf: 'flex-start', color: '#3b82f6', border: 'none', background: 'transparent', cursor: 'pointer' }}
                                onClick={() => setFormData({ ...formData, useCustomCategory: true, category: availableCategories[0] || 'Costumes' })}
                            >
                                Cliquez pour ajouter une nouvelle catégorie
                            </button>
                        )}
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

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Stock Minimum Requis</label>
                        <input
                            required
                            type="number"
                            value={formData.minStock}
                            onChange={e => setFormData({ ...formData, minStock: e.target.value })}
                        />
                    </div>

                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', background: '#000', cursor: 'pointer' }}>
                            <Save size={18} />
                            {isEditing ? 'Enregistrer les modifications' : "Ajouter à l'inventaire"}
                        </button>
                        <button type="button" className="btn btn-outline" onClick={() => onNavigate('inventory')} style={{ flex: 0.4, justifyContent: 'center' }}>
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddGarment;
