import React from 'react';
import { RisikoLevel } from '../../types';

interface ProfileCardProps {
  nama: string;
  nim: string;
  fakultas: string;
  risikoLevel: RisikoLevel;
  updatedDate: string;
}

const risikoConfig: Record<RisikoLevel, { label: string; className: string }> = {
  ringan: { label: 'Rendah', className: 'bg-teal-50 text-teal-800' },
  sedang: { label: 'Sedang', className: 'bg-amber-50 text-amber-800' },
  berat: { label: 'Tinggi', className: 'bg-red-50 text-red-800' },
  kritis: { label: 'Kritis', className: 'bg-red-100 text-red-900 font-semibold' },
};

export const ProfileCard: React.FC<ProfileCardProps> = ({
  nama,
  nim,
  fakultas,
  risikoLevel,
  updatedDate,
}) => {
  const config = risikoConfig[risikoLevel];
  const initials = nama
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white rounded-xl p-4 border border-stone-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-teal-700 rounded-full flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-[13px]">{initials}</span>
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-stone-900 truncate">{nama}</p>
          <p className="text-[11px] text-stone-400">
            {nim} &middot; {fakultas}
          </p>
        </div>
      </div>
      <div className="border-t border-stone-100 pt-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-stone-400">Tingkat risiko saat ini</p>
          <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-md ${config.className}`}>
            {config.label}
          </span>
        </div>
        <p className="text-[10px] text-stone-400 mt-1.5">Diperbarui {updatedDate}</p>
      </div>
    </div>
  );
};
