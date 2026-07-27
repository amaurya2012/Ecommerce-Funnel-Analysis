import React, { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function Toast({ message, visible, onDismiss, duration = 2500 }) {
  useEffect(() => {
    if (!visible) return undefined;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [visible, duration, onDismiss]);

  return (
    <div
      className={[
        'pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4',
        'transition-all duration-300 sm:inset-x-auto sm:right-6',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
      ].join(' ')}
      aria-live="polite"
    >
      <div className="surface-card flex items-center gap-2.5 bg-navy px-4 py-3 shadow-card-hover">
        <CheckCircle2 size={18} strokeWidth={2} className="shrink-0 text-orange" />
        <span className="font-body text-sm font-medium text-white">{message}</span>
      </div>
    </div>
  );
}