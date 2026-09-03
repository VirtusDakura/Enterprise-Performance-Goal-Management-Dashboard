'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 rounded-xl border p-3.5 shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 ${
            t.type === 'success'
              ? 'border-emerald-500/30 bg-slate-900/95 text-emerald-300 shadow-emerald-950/30'
              : t.type === 'error'
              ? 'border-rose-500/30 bg-slate-900/95 text-rose-300 shadow-rose-950/30'
              : 'border-indigo-500/30 bg-slate-900/95 text-indigo-300 shadow-indigo-950/30'
          }`}
        >
          {t.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          ) : t.type === 'error' ? (
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          ) : (
            <Info className="h-4 w-4 text-indigo-400 shrink-0" />
          )}
          <span className="text-xs font-medium text-slate-100">{t.message}</span>
          <button
            onClick={() => onDismiss(t.id)}
            className="ml-2 rounded p-1 text-slate-400 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
