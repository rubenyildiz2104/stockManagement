import React, { useState, useMemo, useRef } from 'react';
import { Plus, FileSpreadsheet, PackageSearch, Loader2, Download, History, Trash2, X } from 'lucide-react';
import type { Garment, View, Category, Size } from '../types';
import SearchFilterBar from '../components/SearchFilterBar';
import GarmentTable from '../components/GarmentTable';
import StockHistoryModal from '../components/StockHistoryModal';
import BulkDeleteModal from '../components/BulkDeleteModal';
import { parseExcelStock } from '../utils/excelParser';
import { exportToExcel } from '../utils/excelExporter';

interface InventoryProps {
    garments: Garment[];
    onNavigate: (view: View) => void;
    onDelete: (garment: Garment) => void;
    onEdit: (garment: Garment) => void;
    onImport: (garments: Garment[]) => void;
    onUpdate: (garment: Garment) => void;
    onBulkDelete: (ids: string[]) => void;
}

const SkeletonTable = () => (
    <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="skeleton" style={{ height: '40px', width: '100%', borderRadius: '8px' }}></div>
        ))}
    </div>
);

const EmptyState = () => (
    <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: '20px', color: 'var(--text-secondary)' }}>
            <PackageSearch size={48} />
        </div>
        <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Aucun article trouvé</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '300px', margin: '0.5rem auto' }}>
                Essayez d'ajuster vos filtres ou effectuez une nouvelle recherche.
            </p>
        </div>
    </div>
);

const Inventory: React.FC<InventoryProps> = ({
    garments,
    onNavigate,
    onDelete,
    onEdit,
    onImport,
    onUpdate,
    onBulkDelete
}) => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState<Category | 'Toutes'>('Toutes');
    const [size, setSize] = useState<Size | 'Toutes'>('Toutes');
    const [brand, setBrand] = useState<string | 'Toutes'>('Toutes');
    const [color, setColor] = useState('');
    const [model, setModel] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const fileInputRef = useRef<HTMLInputElement>(null);

    const { availableCategories, availableBrands } = useMemo(() => {
        return {
            availableCategories: Array.from(new Set(garments.map(g => g.category))).sort(),
            availableBrands: Array.from(new Set(garments.map(g => g.brand))).sort(),
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
            const matchesColor = color === '' || g.color.toLowerCase().includes(color.toLowerCase());
            const matchesModel = model === '' || g.model.toLowerCase().includes(model.toLowerCase());

            return matchesSearch && matchesCategory && matchesSize && matchesBrand && matchesColor && matchesModel;
        });
    }, [garments, search, category, size, brand, color, model]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target?.result;
            if (bstr instanceof ArrayBuffer) {
                const imported = parseExcelStock(bstr);
                onImport(imported);
            }
            setIsImporting(false);
        };
        reader.readAsArrayBuffer(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleQuickStock = (garment: Garment, newStock: number) => {
        onUpdate({ ...garment, currentStock: newStock });
    };

    // Toggle individual row selection
    const handleToggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    // Toggle select all on current page
    const handleToggleSelectAll = (idsOnPage: string[]) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            const allSelected = idsOnPage.length > 0 && idsOnPage.every(id => next.has(id));
            if (allSelected) {
                idsOnPage.forEach(id => next.delete(id));
            } else {
                idsOnPage.forEach(id => next.add(id));
            }
            return next;
        });
    };

    // Selected garments subset
    const selectedGarments = useMemo(() => {
        return garments.filter(g => selectedIds.has(g.id));
    }, [garments, selectedIds]);

    const handleExportSelected = () => {
        if (!selectedGarments.length) return;
        exportToExcel(selectedGarments);
    };

    const handleConfirmBulkDelete = () => {
        onBulkDelete(Array.from(selectedIds));
        setSelectedIds(new Set());
        setIsBulkDeleteOpen(false);
    };

    const isLoading = garments.length === 0 && search === '';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 800 }}>Inventaire</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {filteredGarments.length} article(s) trouvé(s)
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', width: '100%', maxWidth: 'max-content' }}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".xlsx, .xls"
                        style={{ display: 'none' }}
                    />
                    <button
                        className="btn btn-outline"
                        onClick={() => setIsHistoryOpen(true)}
                        style={{ flex: 1 }}
                        title="Consulter l'historique des entrées / sorties"
                    >
                        <History size={17} />
                        Historique
                    </button>
                    <button
                        className="btn btn-outline"
                        onClick={() => exportToExcel(filteredGarments)}
                        style={{ flex: 1 }}
                        title="Exporter tous les articles filtrés en Excel"
                    >
                        <Download size={17} />
                        Exporter
                    </button>
                    <button
                        className="btn btn-outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isImporting}
                        style={{ flex: 1 }}
                    >
                        {isImporting ? <Loader2 size={17} className="animate-spin" /> : <FileSpreadsheet size={17} />}
                        {isImporting ? 'Import...' : 'Importer'}
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => onNavigate('add-garment')}
                        style={{ flex: 1.2 }}
                    >
                        <Plus size={17} />
                        Ajouter
                    </button>
                </div>
            </div>

            {/* Bulk Selection Floating / Top Action Bar */}
            {selectedIds.size > 0 && (
                <div className="bulk-actions-bar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                            {selectedIds.size} article(s) sélectionné(s)
                        </span>
                        <button
                            onClick={() => setSelectedIds(new Set())}
                            style={{
                                color: 'var(--btn-text)',
                                opacity: 0.8,
                                padding: '0.2rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontSize: '0.75rem',
                                textDecoration: 'underline'
                            }}
                        >
                            <X size={14} /> Désélectionner
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button
                            className="btn btn-outline"
                            onClick={handleExportSelected}
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderColor: 'rgba(255, 255, 255, 0.25)',
                                color: '#fff',
                                padding: '0.45rem 0.85rem'
                            }}
                        >
                            <Download size={15} />
                            Exporter la sélection ({selectedIds.size})
                        </button>
                        <button
                            className="btn"
                            onClick={() => setIsBulkDeleteOpen(true)}
                            style={{
                                background: 'var(--accent-red)',
                                color: '#fff',
                                padding: '0.45rem 0.85rem'
                            }}
                        >
                            <Trash2 size={15} />
                            Supprimer la sélection
                        </button>
                    </div>
                </div>
            )}

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
            />

            {isLoading ? (
                <SkeletonTable />
            ) : filteredGarments.length > 0 ? (
                <GarmentTable
                    garments={filteredGarments}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStockChange={handleQuickStock}
                    selectedIds={selectedIds}
                    onToggleSelect={handleToggleSelect}
                    onToggleSelectAll={handleToggleSelectAll}
                />
            ) : (
                <EmptyState />
            )}

            {/* Modals */}
            <StockHistoryModal
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
            />

            <BulkDeleteModal
                isOpen={isBulkDeleteOpen}
                onClose={() => setIsBulkDeleteOpen(false)}
                onConfirm={handleConfirmBulkDelete}
                count={selectedIds.size}
            />
        </div>
    );
};

export default Inventory;
