import React from 'react';
import { MahasiswaTriage } from '../../types';
import { getRisikoLevel } from '../../data/mockData';

interface RisikoChartProps {
  mahasiswa: MahasiswaTriage[];
}

export const RisikoChart: React.FC<RisikoChartProps> = ({ mahasiswa }) => {
  const counts = mahasiswa.reduce(
    (acc, m) => {
      const level = getRisikoLevel(m);
      acc[level]++;
      return acc;
    },
    { tinggi: 0, sedang: 0, rendah: 0 },
  );

  const maxCount = Math.max(counts.tinggi, counts.sedang, counts.rendah, 1);
  const now = new Date();
  const bulan = now.toLocaleDateString('id-ID', { month: 'long' });
  const tahun = now.getFullYear();

  const bars = [
    { label: 'Tinggi', count: counts.tinggi, barColor: 'bg-red-400', textColor: 'text-red-600' },
    { label: 'Sedang', count: counts.sedang, barColor: 'bg-amber-400', textColor: 'text-amber-600' },
    { label: 'Rendah', count: counts.rendah, barColor: 'bg-teal-400', textColor: 'text-teal-600' },
  ];

  return (
    <div className="bg-white rounded-xl p-4 border border-stone-200">
      <h3 className="text-[13px] font-medium text-stone-900 mb-4">Distribusi risiko</h3>
      <div className="flex items-end justify-center gap-6 h-20 mb-3">
        {bars.map((bar) => (
          <div key={bar.label} className="flex flex-col items-center gap-1">
            <div
              className={`w-8 ${bar.barColor} rounded-t-sm`}
              style={{ height: `${Math.max((bar.count / maxCount) * 60, 4)}px` }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-6">
        {bars.map((bar) => (
          <div key={bar.label} className="text-center">
            <p className="text-[11px] text-stone-400">{bar.label}</p>
            <p className={`text-[11px] font-medium ${bar.textColor}`}>{bar.count}</p>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-stone-400 text-center mt-3">
        Data {mahasiswa.length} mahasiswa &middot; {bulan} {tahun}
      </p>
    </div>
  );
};
