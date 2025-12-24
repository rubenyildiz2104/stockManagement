import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    subValue: string;
    Icon: LucideIcon;
    variant?: 'default' | 'danger';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subValue, Icon, variant = 'default' }) => {
    return (
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', fontWeight: 600 }}>{title}</p>
                <Icon size={18} color="var(--text-secondary)" strokeWidth={1.5} />
            </div>
            <div>
                <h2 style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: variant === 'danger' ? 'var(--accent-red)' : 'var(--text-primary)'
                }}>
                    {value}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{subValue}</p>
            </div>
        </div>
    );
};

export default StatCard;
