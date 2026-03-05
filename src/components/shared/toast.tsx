'use client';

import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToastStore, type ToastType } from '@/stores/toast.store';

const toastConfig: Record<ToastType, { icon: typeof CheckCircle; bg: string; border: string; text: string }> = {
  success: { icon: CheckCircle, bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' },
  error: { icon: XCircle, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
  info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
  warning: { icon: AlertTriangle, bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' },
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-4 top-[calc(1rem+var(--safe-area-top,env(safe-area-inset-top,0px)))] z-[100] flex flex-col gap-2">
      {toasts.map((toast) => {
        const config = toastConfig[toast.type];
        const Icon = config.icon;
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg animate-in slide-in-from-right ${config.bg} ${config.border}`}
            style={{ animation: 'slideIn 0.3s ease-out' }}
          >
            <Icon className={`h-5 w-5 flex-shrink-0 ${config.text}`} />
            <p className={`text-sm font-medium ${config.text}`}>{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className={`ml-2 rounded-lg p-1 transition hover:bg-black/5 ${config.text}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
