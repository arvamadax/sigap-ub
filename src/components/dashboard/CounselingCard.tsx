import React from 'react';

interface CounselingCardProps {
  onOpenModal: () => void;
  scheduledSession?: { date: string; time: string } | null;
}

export const CounselingCard: React.FC<CounselingCardProps> = ({ onOpenModal, scheduledSession }) => {
  return (
    <div className="bg-white rounded-xl p-4 border border-stone-200">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
          <svg
            viewBox="0 0 24 24"
            className="w-[18px] h-[18px] text-teal-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div>
          <p className="text-[13px] font-medium text-stone-900">Jadwalkan sesi konseling</p>
          <p className="text-[11px] text-stone-400">Gratis & rahasia &middot; Psikolog UB asli</p>
        </div>
      </div>
      {scheduledSession ? (
        <div className="bg-teal-50 rounded-lg p-3 text-center">
          <p className="text-[11px] text-teal-700 font-medium">Sesi terjadwal</p>
          <p className="text-[13px] font-medium text-teal-800">
            {scheduledSession.date} &middot; {scheduledSession.time}
          </p>
        </div>
      ) : (
        <button
          onClick={onOpenModal}
          className="w-full py-2.5 border border-stone-200 text-stone-700 rounded-lg text-[13px] font-medium hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700 transition-colors flex items-center justify-center gap-1.5"
        >
          Pilih jadwal konseling
          <svg
            viewBox="0 0 24 24"
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}
    </div>
  );
};
