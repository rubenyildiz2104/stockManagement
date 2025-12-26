import React from 'react';
import { User, Shield, Moon, Sun, Bell, LogOut, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SettingsProps {
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
}

const Settings: React.FC<SettingsProps> = ({ theme, onToggleTheme }) => {
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
                <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 800 }}>Paramètres</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Gérer vos préférences et votre compte</p>
            </div>

            <div className="card" style={{ padding: '0' }}>
                <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={18} /> Compte
                    </h3>
                </div>
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Profil utilisateur</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Gérer vos informations personnelles</p>
                        </div>
                        <button className="btn btn-outline" style={{ fontSize: '0.75rem' }}>Modifier</button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                        <div>
                            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Sécurité</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Changer votre mot de passe</p>
                        </div>
                        <Shield size={18} color="var(--text-secondary)" />
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '0' }}>
                <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Bell size={18} /> Préférences
                    </h3>
                </div>
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Thème de l'application</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Basculer entre clair et sombre</p>
                        </div>
                        <button
                            className="btn btn-outline"
                            onClick={onToggleTheme}
                            style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                        >
                            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                            {theme === 'light' ? 'Sombre' : 'Clair'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '0', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-red)' }}>
                        <LogOut size={18} /> Zone de danger
                    </h3>
                </div>
                <div style={{ padding: '1.25rem' }}>
                    <button
                        onClick={handleLogout}
                        className="btn"
                        style={{
                            width: '100%',
                            background: 'var(--accent-red-light)',
                            color: 'var(--accent-red)',
                            fontWeight: 600,
                            justifyContent: 'center'
                        }}
                    >
                        Se déconnecter de l'application
                    </button>
                </div>
            </div>

            <div style={{ textAlign: 'center', padding: '1rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                    <Info size={12} /> Chez Gabriel Stock v1.0.0
                </p>
            </div>
        </div>
    );
};

export default Settings;
