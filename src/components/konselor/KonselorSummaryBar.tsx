import React from 'react';
import { MahasiswaTriage } from '../../types';
import { getRisikoLevel } from '../../data/mockData';

interface KonselorSummaryBarProps {
  mahasiswa: MahasiswaTriage[];
  sesiHariIni: number;
}

export const KonselorSummaryBar: React.FC<KonselorSummaryBarProps> = ({
  mahasiswa,
  sesiHariIni,
}) => {
  const counts = mahasiswa.reduce(
    (acc, m) => {
      const level = getRisikoLevel(m);
      acc[level]++;
      return acc;
    },
    { tinggi: 0, sedang: 0, rendah: 0 },
  );

  return (
    <div className="bg-stone-100/80 border-b border-stone-200">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x md:divide-stone-300/60">
          <div className="md:pr-6">
            <p className="text-[11px] uppercase tracking-[0.06em] text-stone-400 font-medium mb-1">Risiko tinggi</p>
            <p className="text-[22px] font-medium text-red-600">{counts.tinggi}</p>
            <p className="text-[10px] text-stone-400 mt-0.5">Perlu tindakan segera</p>
          </div>
          <div className="md:px-6">
            <p className="text-[11px] uppercase tracking-[0.06em] text-stone-400 font-medium mb-1">Risiko sedang</p>
            <p className="text-[22px] font-medium text-amber-600">{counts.sedang}</p>
            <p className="text-[10px] text-stone-400 mt-0.5">Dalam pantauan</p>
          </div>
          <div className="md:px-6">
            <p className="text-[11px] uppercase tracking-[0.06em] text-stone-400 font-medium mb-1">Total terpantau</p>
            <p className="text-[22px] font-medium text-teal-700">{mahasiswa.length}</p>
            <p className="text-[10px] text-stone-400 mt-0.5">Mahasiswa aktif</p>
          </div>
          <div className="md:pl-6">
            <p className="text-[11px] uppercase tracking-[0.06em] text-stone-400 font-medium mb-1">Sesi hari ini</p>
            <p className="text-[22px] font-medium text-stone-900">{sesiHariIni}</p>
            <p className="text-[10px] text-stone-400 mt-0.5">Konseling terjadwal</p>
          </div>
        </div>
      </div>
    </div>
  );
};
