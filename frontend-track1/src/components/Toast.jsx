import React from 'react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

const variants = {
  success: {
    icon: CheckCircle,
    accent: 'border-l-spring',
    iconColor: 'text-spring',
  },
  error: {
    icon: AlertTriangle,
    accent: 'border-l-red-500',
    iconColor: 'text-red-500',
  },
};

const Toast = ({ message, type = 'success', onDismiss }) => {
  const { icon: Icon, accent, iconColor } = variants[type] || variants.success;

  return (
    <div
      className={`flex items-center gap-2.5 px-4 py-3 bg-white border-[3px] border-ink border-l-[6px] ${accent} rounded-lg shadow-block-sm min-w-[240px] max-w-sm`}
      data-testid={`toast-${type}`}
      role="status"
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
      <span className="text-sm font-medium text-ink flex-1">{message}</span>
      <button onClick={onDismiss} className="p-1 hover:opacity-60" aria-label="Dismiss">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
