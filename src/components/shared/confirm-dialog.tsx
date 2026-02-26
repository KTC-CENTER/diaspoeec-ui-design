'use client';

import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  const confirmColors = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-orange-500 hover:bg-orange-600 text-white',
    default: 'bg-forest-900 hover:bg-forest-700 text-white',
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-2xl">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-lg p-1 text-ink-400 transition hover:bg-ink-50"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
            variant === 'danger' ? 'bg-red-50' : variant === 'warning' ? 'bg-orange-50' : 'bg-sage-200'
          }`}>
            <AlertTriangle className={`h-5 w-5 ${
              variant === 'danger' ? 'text-red-500' : variant === 'warning' ? 'text-orange-500' : 'text-forest-900'
            }`} />
          </div>
          <h3 className="text-lg font-semibold text-ink-900" style={{ fontFamily: 'var(--font-heading)' }}>
            {title}
          </h3>
        </div>

        <p className="mb-6 text-sm text-ink-600">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${confirmColors[variant]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
