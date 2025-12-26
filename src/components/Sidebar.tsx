import React from 'react';
import { LayoutDashboard, Package, BarChart3, Settings, Menu, Sun, Moon, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { View } from '../types';

interface SidebarProps {
    currentView: View;
    onViewChange: (view: View) => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    currentView,
    onViewChange,
    isCollapsed,
    onToggleCollapse,
    theme,
    onToggleTheme
}) => {
    const menuItems = [
        { id: 'dashboard' as View, label: 'Tableau de bord', icon: LayoutDashboard },
        { id: 'inventory' as View, label: 'Inventaire', icon: Package },
        { id: 'reports' as View, label: 'Rapports', icon: BarChart3 },
    ];

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header" style={{ position: 'relative' }}>
                <div className="logo-container" style={{ visibility: isCollapsed ? 'hidden' : 'visible', opacity: isCollapsed ? 0 : 1, transition: 'all 0.2s' }}>
                    <div className="logo-icon">T</div>
                    {!isCollapsed && <span className="logo-text">TailorStock</span>}
                </div>
                <button
                    onClick={onToggleCollapse}
                    className="nav-item"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        right: isCollapsed ? '50%' : '0',
                        transform: isCollapsed ? 'translate(50%, -50%)' : 'translateY(-50%)',
                        width: '40px',
                        height: '40px',
                        padding: 0,
                        justifyContent: 'center',
                        borderRadius: '8px'
                    }}
                >
                    <Menu size={20} />
                </button>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                        onClick={() => onViewChange(item.id)}
                        title={isCollapsed ? item.label : ''}
                        style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                    >
                        <item.icon size={20} />
                        {!isCollapsed && <span>{item.label}</span>}
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button
                    className="nav-item"
                    onClick={onToggleTheme}
                    title={isCollapsed ? (theme === 'light' ? 'Mode Sombre' : 'Mode Clair') : ''}
                    style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', marginBottom: '0.5rem' }}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    {!isCollapsed && <span>{theme === 'light' ? 'Mode Sombre' : 'Mode Clair'}</span>}
                </button>
                <button
                    className="nav-item"
                    title={isCollapsed ? 'Paramètres' : ''}
                    style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', marginBottom: '0.5rem' }}
                >
                    <Settings size={20} />
                    {!isCollapsed && <span>Paramètres</span>}
                </button>
                <button
                    className="nav-item"
                    onClick={() => supabase.auth.signOut()}
                    title={isCollapsed ? 'Déconnexion' : ''}
                    style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', color: 'var(--accent-red)' }}
                >
                    <LogOut size={20} />
                    {!isCollapsed && <span>Déconnexion</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
