import React, { useEffect } from 'react';

export type ToastType = 'info' | 'success' | 'error';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  /** Auto-dismiss duration in ms. Defaults to 3000. */
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor =
    type === 'success' ? 'bg-[#0D9488]'
    : type === 'error' ? 'bg-rose-600'
    : 'bg-slate-600';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 right-4 z-[200] px-4 py-3 rounded-xl text-white shadow-xl ${bgColor} text-sm font-medium max-w-sm flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200`}
    >
      <span className="flex-1 leading-relaxed">{message}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup notifikasi"
        className="text-white/80 hover:text-white text-sm leading-none cursor-pointer active:scale-90"
      >
        ✕
      </button>
    </div>
  );
};
