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
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>{title}</p>
                <Icon size={16} color="var(--text-secondary)" strokeWidth={2} />
            </div>
            <div>
                <h2 style={{
                    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                    fontWeight: 700,
                    color: variant === 'danger' ? 'var(--accent-red)' : 'var(--text-primary)'
                }}>
                    {value}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{subValue}</p>
            </div>
        </div>
    );
};

export default StatCard;
