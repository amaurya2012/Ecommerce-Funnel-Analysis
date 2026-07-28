import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function InfoModal({ title, isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/60 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="info-modal-title"
        onClick={(event) => event.stopPropagation()}
        className="surface-card max-h-[80vh] w-full max-w-lg overflow-y-auto p-6 sm:p-8"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="info-modal-title" className="font-display text-xl font-semibold text-ink-high sm:text-2xl">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-mid transition-colors hover:bg-paper hover:text-ink-high"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>
        <div className="text-sm leading-relaxed text-ink-mid sm:text-base">{children}</div>
      </div>
    </div>
  );
}