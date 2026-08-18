import React from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';

const StatusMessage = ({ type = 'loading', message, testId }) => {
  if (type === 'loading') {
    return (
      <div className="card flex items-center justify-center gap-3 py-12 text-ink/70" data-testid={testId || 'loading-state'}>
        <Loader2 className="w-5 h-5 animate-spin text-electric" />
        <span className="font-mono uppercase text-sm tracking-wide">{message || 'Loading...'}</span>
      </div>
    );
  }

  return (
    <div
      className="card flex items-center gap-3 py-6 border-red-500 bg-red-50 text-red-700"
      data-testid={testId || 'error-state'}
    >
      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
      <span className="font-medium">{message || 'Something went wrong'}</span>
    </div>
  );
};

export default StatusMessage;
