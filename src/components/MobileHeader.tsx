import React from 'react';
import { LogOut, Sun, Moon, Barcode } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MobileHeaderProps {
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
    onOpenScanner?: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ theme, onToggleTheme, onOpenScanner }) => {
    return (
        <header className="mobile-header">
            <div className="logo-container">
                <span className="logo-text">Chez Gabriel Stock</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {onOpenScanner && (
                    <button
                        onClick={onOpenScanner}
                        className="btn btn-primary"
                        style={{ padding: '0.45rem 0.65rem', borderRadius: '8px', fontSize: '0.8rem' }}
                        title="Scanner un code-barres"
                    >
                        <Barcode size={18} />
                    </button>
                )}
                <button
                    onClick={onToggleTheme}
                    className="btn-outline"
                    style={{ padding: '0.5rem', borderRadius: '8px' }}
                >
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>
                <button
                    onClick={() => supabase.auth.signOut()}
                    className="btn-outline"
                    style={{ padding: '0.5rem', borderRadius: '8px', color: 'var(--accent-red)' }}
                >
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
};

export default MobileHeader;
