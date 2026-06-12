import React from 'react';
import { RisikoLevel } from '../../types';

interface SummaryBarProps {
  kondisi: RisikoLevel;
  asesmenSelesai: number;
  asesmenTotal: number;
  jadwalBerikutnya: Date | null;
  sesiKonseling: number;
  onScheduleCounseling?: () => void;
}

const kondisiConfig: Record<RisikoLevel, { label: string; colorClass: string }> = {
  ringan: { label: 'Ringan', colorClass: 'text-teal-700' },
  sedang: { label: 'Sedang', colorClass: 'text-amber-600' },
  berat: { label: 'Berat', colorClass: 'text-red-600' },
  kritis: { label: 'Kritis', colorClass: 'text-red-700 font-semibold' },
};

function formatDate(date: Date): string {
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

export const SummaryBar: React.FC<SummaryBarProps> = ({
  kondisi,
  asesmenSelesai,
  asesmenTotal,
  jadwalBerikutnya,
  sesiKonseling,
  onScheduleCounseling,
}) => {
  const config = kondisiConfig[kondisi];

  return (
    <div className="bg-stone-100/80 border-b border-stone-200">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x md:divide-stone-300/60">
          <div className="md:pr-6">
            <p className="text-[11px] uppercase tracking-[0.06em] text-stone-400 font-medium mb-1">Status kondisi</p>
            <p className={`text-xl font-medium ${config.colorClass}`}>{config.label}</p>
          </div>
          <div className="md:px-6">
            <p className="text-[11px] uppercase tracking-[0.06em] text-stone-400 font-medium mb-1">Asesmen</p>
            <p className="text-xl font-medium text-stone-900">{asesmenSelesai}/{asesmenTotal}</p>
          </div>
          <div className="md:px-6">
            <p className="text-[11px] uppercase tracking-[0.06em] text-stone-400 font-medium mb-1">Jadwal berikutnya</p>
            <p className="text-xl font-medium text-stone-900">
              {jadwalBerikutnya ? formatDate(jadwalBerikutnya) : '—'}
            </p>
            {jadwalBerikutnya && (
              <p className="text-[10px] text-stone-400 mt-0.5">Terjadwal otomatis</p>
            )}
          </div>
          <div className="md:pl-6">
            <p className="text-[11px] uppercase tracking-[0.06em] text-stone-400 font-medium mb-1">Sesi konseling</p>
            <p className="text-xl font-medium text-stone-900">{sesiKonseling}</p>
            {sesiKonseling === 0 && onScheduleCounseling && (
              <button
                onClick={onScheduleCounseling}
                className="text-[10px] text-teal-700 font-medium mt-0.5 hover:underline"
              >
                Jadwalkan sekarang
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
