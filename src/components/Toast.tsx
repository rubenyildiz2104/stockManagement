import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastProps {
    toast: Toast;
    onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastProps> = ({ toast, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(toast.id);
        }, 3000);
        return () => clearTimeout(timer);
    }, [toast.id, onClose]);

    const icons = {
        success: <CheckCircle className="toast-success" size={20} />,
        error: <AlertCircle className="toast-error" size={20} />,
        info: <Info className="toast-info" size={20} />
    };

    return (
        <div className="toast">
            {icons[toast.type]}
            <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500 }}>{toast.message}</span>
            <button onClick={() => onClose(toast.id)} style={{ color: 'var(--text-secondary)', padding: '0.25rem' }}>
                <X size={16} />
            </button>
        </div>
    );
};

interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onClose={onRemove} />
            ))}
        </div>
    );
};
