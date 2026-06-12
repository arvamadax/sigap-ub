import React from 'react';
import { RiwayatItem } from '../../data/mockData';

interface HistoryCardProps {
  riwayat: RiwayatItem[];
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getTrend(current: number, previous: number[]): { label: string; colorClass: string } {
  if (previous.length === 0) return { label: 'baru', colorClass: 'text-stone-400' };
  const last = previous[previous.length - 1];
  const diff = current - last;
  if (diff > 3) return { label: 'naik', colorClass: 'text-red-600' };
  if (diff > 0) return { label: 'naik', colorClass: 'text-amber-600' };
  if (diff < -2) return { label: 'membaik', colorClass: 'text-teal-600' };
  return { label: 'stabil', colorClass: 'text-teal-600' };
}

function getBarColor(current: number, previous: number[]): string {
  if (previous.length === 0) return 'bg-stone-300';
  const last = previous[previous.length - 1];
  const diff = current - last;
  if (diff > 3) return 'bg-red-400';
  if (diff > 0) return 'bg-amber-400';
  return 'bg-teal-400';
}

function getSeverityBadge(label: string): string {
  const lower = label.toLowerCase();
  if (lower.includes('berat') || lower.includes('tinggi') || lower.includes('kritis')) {
    return 'bg-red-50 text-red-700';
  }
  if (lower.includes('sedang')) {
    return 'bg-amber-50 text-amber-700';
  }
  return 'bg-teal-50 text-teal-700';
}

const MiniSparkline: React.FC<{ current: number; previous: number[] }> = ({ current, previous }) => {
  const all = [...previous.slice(-2), current];
  const max = Math.max(...all, 1);
  const barColor = getBarColor(current, previous);

  return (
    <div className="flex items-end gap-0.5 h-4">
      {all.map((val, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-sm ${barColor}`}
          style={{
            height: `${Math.max((val / max) * 16, 3)}px`,
            opacity: 0.4 + (i / all.length) * 0.6,
          }}
        />
      ))}
    </div>
  );
};

export const HistoryCard: React.FC<HistoryCardProps> = ({ riwayat }) => {
  if (riwayat.length === 0) {
    return (
      <div className="bg-white rounded-xl p-4 border border-stone-200">
        <h3 className="text-[13px] font-medium text-stone-900 mb-3">Riwayat & tren</h3>
        <div className="text-center py-6">
          <p className="text-[11px] text-stone-400">Belum ada riwayat asesmen.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 border border-stone-200">
      <h3 className="text-[13px] font-medium text-stone-900 mb-3">Riwayat & tren</h3>
      <div className="flex flex-col gap-3">
        {riwayat.map((item, i) => {
          const trend = getTrend(item.skor, item.skorSebelumnya || []);
          const badgeClass = getSeverityBadge(item.label);
          return (
            <div key={i} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-2 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13px] font-medium text-stone-900 truncate">{item.instrumen}</p>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md shrink-0 ${badgeClass}`}>
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px] text-stone-400">
                    {formatDate(item.tanggal)} &middot; Skor {item.skor}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <MiniSparkline current={item.skor} previous={item.skorSebelumnya || []} />
                    <span className={`text-[10px] font-medium ${trend.colorClass}`}>{trend.label}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
