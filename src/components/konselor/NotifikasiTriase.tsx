import React from 'react';
import { NotifikasiItem } from '../../types';

interface NotifikasiTriaseProps {
  notifikasi: NotifikasiItem[];
}

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'Baru saja';
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays === 1) return 'Kemarin';
  return `${diffDays} hari lalu`;
}

const dotColorMap: Record<NotifikasiItem['tipe'], string> = {
  kritis: 'bg-red-500',
  perhatian: 'bg-amber-500',
  info: 'bg-teal-500',
};

export const NotifikasiTriase: React.FC<NotifikasiTriaseProps> = ({ notifikasi }) => {
  return (
    <div className="bg-white rounded-xl p-4 border border-stone-200">
      <h3 className="text-[13px] font-medium text-stone-900 mb-3">Notifikasi triase</h3>
      {notifikasi.length === 0 ? (
        <p className="text-[11px] text-stone-400 text-center py-4">Tidak ada notifikasi.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {notifikasi.map((n) => (
            <div key={n.id} className="flex items-start gap-2.5">
              <div className={`w-1.5 h-1.5 rounded-full ${dotColorMap[n.tipe]} mt-1.5 shrink-0`} />
              <div>
                <p className="text-[12px] text-stone-700 leading-relaxed">{n.teks}</p>
                <p className="text-[10px] text-stone-400 mt-0.5">{timeAgo(n.waktu)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
