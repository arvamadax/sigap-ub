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
      className="fixed inset-0 bg-[#081b3a]/60 backdrop-blur-sm z-[120] flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="relative bg-white rounded-2xl w-full max-w-md border border-[#bdc9c8]/40 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header (matches App.tsx modal style) */}
        <div className="flex bg-[#081b3a] text-white justify-between items-center px-6 py-4">
          <h3 id="confirm-modal-title" className="font-bold text-base md:text-lg tracking-tight">
            {title}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Tutup"
            className="text-gray-300 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer active:scale-90"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Body */}
        <p
          id="confirm-modal-message"
          className="p-6 text-sm md:text-base text-[#1E293B] leading-relaxed"
        >
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-end px-6 pb-6 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:bg-gray-100 hover:text-gray-800 font-bold text-xs md:text-sm px-4.5 py-2.5 rounded-xl transition-all duration-150 cursor-pointer active:scale-95"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-[#0D9488] hover:bg-[#0F766E] hover:scale-[1.02] text-white font-bold text-xs md:text-sm px-6 py-2.5 rounded-xl transition-all duration-150 shadow-sm active:scale-95"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
