import React from 'react';
import { CloseIcon } from './Icons';

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  title = 'Konfirmasi',
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-message"
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[120] flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center px-6 py-4 border-b border-stone-200">
          <h3 id="confirm-modal-title" className="font-bold text-base md:text-lg text-stone-900 tracking-tight">
            {title}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Tutup"
            className="text-stone-400 hover:text-stone-600 p-1.5 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer active:scale-90"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <p
          id="confirm-modal-message"
          className="p-6 text-sm md:text-base text-stone-700 leading-relaxed"
        >
          {message}
        </p>

        <div className="flex gap-3 justify-end px-6 pb-6 pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={onCancel}
            className="text-stone-500 hover:bg-stone-100 hover:text-stone-700 font-medium text-sm px-4 py-2.5 rounded-xl transition-all duration-150 cursor-pointer active:scale-95"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm px-6 py-2.5 rounded-xl active:scale-[0.98] transition-all shadow-sm"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
