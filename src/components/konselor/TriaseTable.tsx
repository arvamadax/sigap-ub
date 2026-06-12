import React, { useState, useMemo } from 'react';
import { MahasiswaTriage } from '../../types';
import { THRESHOLDS, getRisikoLevel } from '../../data/mockData';

interface TriaseTableProps {
  mahasiswa: MahasiswaTriage[];
}

type FilterType = 'semua' | 'tinggi' | 'sedang' | 'rendah';

function getScoreBadgeClass(instrumen: 'PHQ-9' | 'GAD-7' | 'SRQ-20', score: number | null): string {
  if (score === null) return 'bg-stone-100 text-stone-400';

  if (instrumen === 'SRQ-20') {
    return score >= THRESHOLDS['SRQ-20'].risiko ? 'bg-red-50 text-red-700' : 'bg-teal-50 text-teal-700';
  }

  const t = instrumen === 'PHQ-9' ? THRESHOLDS['PHQ-9'] : THRESHOLDS['GAD-7'];
  if (score >= t.berat) return 'bg-red-50 text-red-700';
  if (score >= t.sedang) return 'bg-amber-50 text-amber-700';
  if (score >= t.ringan) return 'bg-teal-50 text-teal-700';
  return 'bg-stone-50 text-stone-600';
}

function getAvatarClass(level: 'tinggi' | 'sedang' | 'rendah'): string {
  switch (level) {
    case 'tinggi':
      return 'bg-red-600';
    case 'sedang':
      return 'bg-amber-500';
    case 'rendah':
      return 'bg-teal-600';
  }
}

function getActionButton(level: 'tinggi' | 'sedang' | 'rendah'): { label: string; className: string } {
  switch (level) {
    case 'tinggi':
      return { label: 'Hubungi', className: 'border-teal-300 text-teal-700 hover:bg-teal-50' };
    case 'sedang':
      return { label: 'Pantau', className: 'border-stone-200 text-stone-600 hover:bg-stone-50' };
    case 'rendah':
      return { label: 'Lihat', className: 'border-stone-200 text-stone-400 hover:bg-stone-50' };
  }
}

function getTotalScore(m: MahasiswaTriage): number {
  return (m.phq9 || 0) + (m.gad7 || 0) + (m.srq20 || 0);
}

export const TriaseTable: React.FC<TriaseTableProps> = ({ mahasiswa }) => {
  const [filter, setFilter] = useState<FilterType>('semua');
  const [fakultasFilter, setFakultasFilter] = useState<string>('semua');

  const fakultasList = useMemo(() => [...new Set(mahasiswa.map((m) => m.fakultas))].sort(), [mahasiswa]);

  const filtered = useMemo(() => {
    let result = [...mahasiswa];

    if (filter !== 'semua') {
      result = result.filter((m) => getRisikoLevel(m) === filter);
    }
    if (fakultasFilter !== 'semua') {
      result = result.filter((m) => m.fakultas === fakultasFilter);
    }

    result.sort((a, b) => getTotalScore(b) - getTotalScore(a));
    return result;
  }, [mahasiswa, filter, fakultasFilter]);

  const filters: { key: FilterType; label: string }[] = [
    { key: 'semua', label: 'Semua' },
    { key: 'tinggi', label: 'Risiko tinggi' },
    { key: 'sedang', label: 'Risiko sedang' },
  ];

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-stone-100 flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`text-[11px] font-medium px-3 py-1.5 rounded-md border transition-colors ${
              filter === f.key
                ? 'bg-teal-50 border-teal-300 text-teal-800'
                : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'
            }`}
          >
            {f.label}
          </button>
        ))}
        <select
          value={fakultasFilter}
          onChange={(e) => setFakultasFilter(e.target.value)}
          className="text-[11px] font-medium px-2.5 py-1.5 rounded-md border border-stone-200 bg-stone-50 text-stone-500 cursor-pointer hover:bg-stone-100 transition-colors"
        >
          <option value="semua">Semua fakultas</option>
          {fakultasList.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div className="divide-y divide-stone-100">
        {filtered.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-[13px] text-stone-400">Tidak ada mahasiswa ditemukan.</p>
          </div>
        ) : (
          filtered.map((m) => {
            const level = getRisikoLevel(m);
            const action = getActionButton(level);
            const initials = m.nama
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            return (
              <div key={m.id} className="px-4 py-3 flex items-center gap-3 hover:bg-stone-50 transition-colors">
                <div
                  className={`w-9 h-9 ${getAvatarClass(level)} rounded-full flex items-center justify-center shrink-0`}
                >
                  <span className="text-white font-bold text-[11px]">{initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-stone-900 truncate">{m.nama}</p>
                  <p className="text-[11px] text-stone-400">
                    {m.nim} &middot; {m.fakultas} &middot; Sem. {m.semester}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${getScoreBadgeClass('PHQ-9', m.phq9)}`}>
                    {m.phq9 !== null ? m.phq9 : '—'}
                  </span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${getScoreBadgeClass('GAD-7', m.gad7)}`}>
                    {m.gad7 !== null ? m.gad7 : '—'}
                  </span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${getScoreBadgeClass('SRQ-20', m.srq20)}`}>
                    {m.srq20 !== null ? m.srq20 : '—'}
                  </span>
                </div>
                <button
                  className={`text-[11px] font-medium px-3 py-1.5 rounded-md border transition-colors shrink-0 ${action.className}`}
                >
                  {action.label}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
