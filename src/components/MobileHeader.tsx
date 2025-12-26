import React from 'react';
import { LogOut, Sun, Moon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MobileHeaderProps {
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ theme, onToggleTheme }) => {
    return (
        <header className="mobile-header">
            <div className="logo-container">
                <div className="logo-icon">T</div>
                <span className="logo-text">Chez Gabriel Stock</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
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
