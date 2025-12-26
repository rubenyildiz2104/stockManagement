import React from 'react';
import { LayoutDashboard, Package, BarChart3, Settings } from 'lucide-react';
import type { View } from '../types';

interface MobileNavProps {
    currentView: View;
    onViewChange: (view: View) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ currentView, onViewChange }) => {
    const navItems = [
        { id: 'dashboard' as View, label: 'Bord', icon: LayoutDashboard },
        { id: 'inventory' as View, label: 'Stock', icon: Package },
        { id: 'reports' as View, label: 'Stats', icon: BarChart3 },
        { id: 'settings' as View, label: 'Paramètres', icon: Settings },
    ];

    return (
        <nav className="mobile-nav">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    className={`mobile-nav-item ${currentView === item.id ? 'active' : ''}`}
                    onClick={() => onViewChange((item.id as string) === 'settings' ? 'inventory' : item.id)} // Settings redirect for now
                >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default MobileNav;
