import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, Barcode, CheckCircle, Plus, Minus, Search, RotateCcw, Link2 } from 'lucide-react';
import type { Garment } from '../types';

interface BarcodeScannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    garments: Garment[];
    onUpdateStock: (garment: Garment, newStock: number) => void;
    onLinkBarcode: (barcode: string, garmentIds: string[]) => Promise<void>;
    onNavigateToAdd?: (initialBarcode: string) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
    isOpen,
    onClose,
    garments,
    onUpdateStock,
    onLinkBarcode,
    onNavigateToAdd
}) => {
    const [scannedCode, setScannedCode] = useState<string | null>(null);
    const [manualCode, setManualCode] = useState('');
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);

    // Selected garment state after scan
    const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);

    // Scan-to-link search state
    const [linkSearch, setLinkSearch] = useState('');
    const [linkAllSizes, setLinkAllSizes] = useState(true);
    const [isLinking, setIsLinking] = useState(false);

    const scannerRef = useRef<Html5Qrcode | null>(null);

    // Audio beep on successful barcode scan
    const playBeep = () => {
        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContextClass) return;
            const audioCtx = new AudioContextClass();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.value = 880; // A5 note
            gain.gain.value = 0.15;
            osc.start();
            setTimeout(() => {
                osc.stop();
                audioCtx.close();
            }, 100);
            if (navigator.vibrate) navigator.vibrate(60);
        } catch {
            // Ignore audio context block if user has not interacted
        }
    };

    // Stop camera stream safely
    const stopCamera = async () => {
        if (scannerRef.current && scannerRef.current.isScanning) {
            try {
                await scannerRef.current.stop();
                await scannerRef.current.clear();
            } catch (err) {
                console.error('Error stopping scanner:', err);
            }
        }
        setIsCameraActive(false);
    };

    // Start camera stream
    const startCamera = async () => {
        setCameraError(null);
        try {
            if (!scannerRef.current) {
                scannerRef.current = new Html5Qrcode('barcode-scanner-viewport');
            }

            await scannerRef.current.start(
                { facingMode: 'environment' },
                {
                    fps: 12,
                    qrbox: { width: 280, height: 160 },
                    aspectRatio: 1.4
                },
                (decodedText) => {
                    handleCodeFound(decodedText);
                },
                () => {
                    // Ignore per-frame decode errors
                }
            );
            setIsCameraActive(true);
        } catch (err: any) {
            console.error('Failed to start camera:', err);
            setCameraError(err.message || 'Impossible d\'accéder à la caméra. Vérifiez les autorisations.');
            setIsCameraActive(false);
        }
    };

    // When modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setScannedCode(null);
            setSelectedGarment(null);
            setManualCode('');
            setLinkSearch('');
            // Give DOM time to render viewport before starting camera
            const timer = setTimeout(() => {
                startCamera();
            }, 300);
            return () => {
                clearTimeout(timer);
                stopCamera();
            };
        } else {
            stopCamera();
        }
    }, [isOpen]);

    // Handle barcode detection (from camera or manual input)
    const handleCodeFound = (code: string) => {
        const cleaned = code.trim();
        if (!cleaned) return;

        playBeep();
        stopCamera();
        setScannedCode(cleaned);

        // Find garments matching by barcode or serial number
        const matches = garments.filter(g =>
            (g.barcode && g.barcode.toLowerCase() === cleaned.toLowerCase()) ||
            g.serialNumber.toLowerCase() === cleaned.toLowerCase()
        );

        if (matches.length > 0) {
            setSelectedGarment(matches[0]);
        } else {
            setSelectedGarment(null);
        }
    };

    // Sibling sizes of the matching model
    const siblingGarments = useMemo(() => {
        if (!selectedGarment) return [];
        return garments.filter(g =>
            g.brand === selectedGarment.brand &&
            g.model === selectedGarment.model &&
            g.category === selectedGarment.category &&
            g.color === selectedGarment.color
        ).sort((a, b) => a.size.localeCompare(b.size, undefined, { numeric: true }));
    }, [garments, selectedGarment]);

    // Search results for Scan-to-Link
    const candidateLinkGroups = useMemo(() => {
        if (!linkSearch.trim()) return [];
        const term = linkSearch.toLowerCase();

        // Group by brand + model + color
        const grouped = new Map<string, Garment[]>();
        for (const g of garments) {
            const matches =
                g.name.toLowerCase().includes(term) ||
                g.brand.toLowerCase().includes(term) ||
                g.model.toLowerCase().includes(term) ||
                g.serialNumber.toLowerCase().includes(term);

            if (matches) {
                const key = `${g.brand}___${g.model}___${g.color}`;
                const list = grouped.get(key) || [];
                list.push(g);
                grouped.set(key, list);
            }
        }

        return Array.from(grouped.values()).slice(0, 5);
    }, [garments, linkSearch]);

    // Link barcode to chosen garments
    const handleConfirmLink = async (targetGarments: Garment[]) => {
        if (!scannedCode) return;
        setIsLinking(true);
        try {
            const ids = linkAllSizes
                ? targetGarments.map(g => g.id)
                : [targetGarments[0].id];

            await onLinkBarcode(scannedCode, ids);

            // Set the first matching garment as active so the shopkeeper can immediately operate on it
            setSelectedGarment(targetGarments[0]);
            setLinkSearch('');
        } catch (e) {
            console.error('Error linking barcode:', e);
        } finally {
            setIsLinking(false);
        }
    };

    const handleResetScan = () => {
        setScannedCode(null);
        setSelectedGarment(null);
        setManualCode('');
        setLinkSearch('');
        startCamera();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                onClick={e => e.stopPropagation()}
                style={{
                    maxWidth: '560px',
                    width: '95%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    padding: 0
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div style={{ padding: '0.5rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                            <Barcode size={20} color="var(--text-secondary)" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Scanner un Code-Barres</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                Vente, entrée ou association de vêtements
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ color: 'var(--text-secondary)', padding: '0.5rem' }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* View A: Camera scanning active */}
                    {!scannedCode && (
                        <>
                            <div style={{
                                position: 'relative',
                                width: '100%',
                                minHeight: '240px',
                                background: '#000',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div id="barcode-scanner-viewport" style={{ width: '100%', height: '100%' }}></div>

                                {!isCameraActive && !cameraError && (
                                    <div style={{ color: '#fff', textAlign: 'center', padding: '1rem' }}>
                                        <Camera size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.7 }} />
                                        <p style={{ fontSize: '0.875rem' }}>Démarrage de la caméra...</p>
                                    </div>
                                )}

                                {cameraError && (
                                    <div style={{ color: '#fff', textAlign: 'center', padding: '1.5rem', maxWidth: '360px' }}>
                                        <p style={{ color: 'var(--accent-red)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                                            {cameraError}
                                        </p>
                                        <button
                                            className="btn btn-outline"
                                            onClick={startCamera}
                                            style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}
                                        >
                                            <RotateCcw size={15} /> Réessayer la caméra
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Manual code input fallback */}
                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                                    Ou saisir manuellement (Code-barres, douchette USB ou N° Série) :
                                </label>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        if (manualCode.trim()) handleCodeFound(manualCode);
                                    }}
                                    style={{ display: 'flex', gap: '0.5rem' }}
                                >
                                    <input
                                        type="text"
                                        placeholder="ex: 8033285123456 ou L01L85"
                                        value={manualCode}
                                        onChange={(e) => setManualCode(e.target.value)}
                                        style={{ flex: 1, fontSize: '0.9rem' }}
                                    />
                                    <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                                        Valider
                                    </button>
                                </form>
                            </div>
                        </>
                    )}

                    {/* View B: Barcode detected AND matched */}
                    {scannedCode && selectedGarment && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{
                                padding: '1rem',
                                borderRadius: '12px',
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--border-color)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                                            {selectedGarment.brand} • {selectedGarment.category}
                                        </span>
                                        <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedGarment.name}</h2>
                                    </div>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        fontFamily: 'monospace',
                                        padding: '0.2rem 0.5rem',
                                        background: 'var(--bg-secondary)',
                                        borderRadius: '6px',
                                        border: '1px solid var(--border-color)'
                                    }}>
                                        {scannedCode}
                                    </span>
                                </div>

                                <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                                    Modèle: <strong>{selectedGarment.model}</strong> • Couleur: <strong>{selectedGarment.color}</strong> • Réf: <strong>{selectedGarment.serialNumber}</strong>
                                </div>
                            </div>

                            {/* Smart Size Selector */}
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
                                    Taille de la pièce en main :
                                </label>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {siblingGarments.map((g) => {
                                        const isCurrent = g.id === selectedGarment.id;
                                        const isOut = g.currentStock === 0;
                                        return (
                                            <button
                                                key={g.id}
                                                type="button"
                                                onClick={() => setSelectedGarment(g)}
                                                className={`pagination-btn ${isCurrent ? 'active' : ''}`}
                                                style={{
                                                    padding: '0.5rem 0.85rem',
                                                    fontSize: '0.875rem',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    minWidth: '65px',
                                                    borderColor: isCurrent ? 'var(--accent-black)' : undefined
                                                }}
                                            >
                                                <span style={{ fontWeight: 800 }}>{g.size}</span>
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    opacity: isCurrent ? 0.9 : 0.7,
                                                    color: isOut && !isCurrent ? 'var(--accent-red)' : undefined
                                                }}>
                                                    {isOut ? 'Épuisé' : `${g.currentStock} en stock`}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Action Buttons for the selected size */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                                padding: '1rem',
                                background: 'var(--bg-secondary)',
                                borderRadius: '12px',
                                border: '1px solid var(--border-color)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            Taille sélectionnée : <strong>{selectedGarment.size}</strong>
                                        </span>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                                            Stock : {selectedGarment.currentStock} pièce(s)
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Prix unitaire</span>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                                            {selectedGarment.price} €
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={() => {
                                            onUpdateStock(selectedGarment, Math.max(0, selectedGarment.currentStock - 1));
                                            onClose();
                                        }}
                                        disabled={selectedGarment.currentStock <= 0}
                                        style={{
                                            flex: 1,
                                            background: 'var(--accent-red)',
                                            color: '#fff',
                                            padding: '0.85rem',
                                            justifyContent: 'center',
                                            fontWeight: 700
                                        }}
                                    >
                                        <Minus size={18} />
                                        -1 Vente (Sortie)
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => {
                                            onUpdateStock(selectedGarment, selectedGarment.currentStock + 1);
                                            onClose();
                                        }}
                                        style={{
                                            flex: 1,
                                            padding: '0.85rem',
                                            justifyContent: 'center',
                                            fontWeight: 700
                                        }}
                                    >
                                        <Plus size={18} />
                                        +1 Réappro (Entrée)
                                    </button>
                                </div>
                            </div>

                            {/* Scan another button */}
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={handleResetScan}
                                style={{ justifyContent: 'center' }}
                            >
                                <RotateCcw size={16} />
                                Scanner un autre vêtement
                            </button>
                        </div>
                    )}

                    {/* View C: Barcode scanned but NOT linked yet (Scan-to-link) */}
                    {scannedCode && !selectedGarment && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{
                                padding: '1rem',
                                borderRadius: '10px',
                                background: 'rgba(245, 158, 11, 0.1)',
                                border: '1px solid rgba(245, 158, 11, 0.3)',
                                display: 'flex',
                                gap: '0.75rem',
                                alignItems: 'center'
                            }}>
                                <Link2 size={24} color="#f59e0b" />
                                <div>
                                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f59e0b' }}>
                                        Nouveau code-barres détecté : <code style={{ fontSize: '1rem' }}>{scannedCode}</code>
                                    </h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        Ce code n'est pas encore associé. Sélectionnez l'article correspondant ci-dessous pour le lier en 1 clic.
                                    </p>
                                </div>
                            </div>

                            {/* Search existing garment */}
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                                    Rechercher l'article correspondant (Nom, Marque, Réf) :
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                    <input
                                        type="text"
                                        placeholder="ex: Jeans Jacob Cohen, Costume Textura..."
                                        value={linkSearch}
                                        onChange={(e) => setLinkSearch(e.target.value)}
                                        style={{ paddingLeft: '2.5rem' }}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Linking options (all sizes vs single) */}
                            <div style={{
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--border-color)',
                                fontSize: '0.85rem'
                            }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                                    <input
                                        type="checkbox"
                                        className="row-checkbox"
                                        checked={linkAllSizes}
                                        onChange={(e) => setLinkAllSizes(e.target.checked)}
                                    />
                                    <span>Lier ce code-barres à <strong>toutes les tailles de ce modèle</strong> (Recommandé)</span>
                                </label>
                            </div>

                            {/* Candidate search results */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                                {candidateLinkGroups.map((group) => {
                                    const sample = group[0];
                                    const sizesLabel = group.map(g => g.size).join(', ');
                                    return (
                                        <div
                                            key={`${sample.brand}_${sample.model}_${sample.color}`}
                                            onClick={() => !isLinking && handleConfirmLink(group)}
                                            style={{
                                                padding: '0.75rem 1rem',
                                                borderRadius: '8px',
                                                border: '1px solid var(--border-color)',
                                                background: 'var(--bg-secondary)',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                transition: 'all 0.15s'
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--text-primary)')}
                                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
                                        >
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{sample.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                    {sample.brand} • Modèle: {sample.model} • Réf: {sample.serialNumber}
                                                </div>
                                                <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                                                    Tailles existantes : <strong>{sizesLabel}</strong>
                                                </div>
                                            </div>
                                            <button
                                                className="btn btn-primary"
                                                style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
                                                disabled={isLinking}
                                            >
                                                <CheckCircle size={14} /> Associer
                                            </button>
                                        </div>
                                    );
                                })}

                                {linkSearch.trim() && candidateLinkGroups.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                        Aucun article correspondant trouvé pour "{linkSearch}".
                                    </div>
                                )}
                            </div>

                            {/* Footer navigation */}
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={handleResetScan}
                                    style={{ flex: 1, justifyContent: 'center' }}
                                >
                                    <RotateCcw size={15} /> Réessayer le scan
                                </button>
                                {onNavigateToAdd && (
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => {
                                            onClose();
                                            onNavigateToAdd(scannedCode);
                                        }}
                                        style={{ flex: 1.2, justifyContent: 'center' }}
                                    >
                                        <Plus size={15} /> Créer un nouvel article
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BarcodeScannerModal;
