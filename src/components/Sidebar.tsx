import React from 'react';
import { LayoutDashboard, Package, BarChart3, Settings } from 'lucide-react';
import type { View } from '../types';

interface SidebarProps {
    currentView: View;
    onViewChange: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
    const menuItems = [
        { id: 'dashboard' as View, label: 'Tableau de bord', icon: LayoutDashboard },
        { id: 'inventory' as View, label: 'Inventaire', icon: Package },
        { id: 'reports' as View, label: 'Rapports', icon: BarChart3 },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-container">
                    <div className="logo-icon">T</div>
                    <span className="logo-text">TailorStock</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                        onClick={() => onViewChange(item.id)}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="nav-item">
                    <Settings size={20} />
                    <span>Paramètres</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
