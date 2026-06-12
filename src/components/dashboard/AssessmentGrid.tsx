import React from 'react';
import { AssessmentType } from '../../types';

interface AssessmentCardData {
  type: AssessmentType;
  name: string;
  category: string;
  questionsCount: number;
  done: boolean;
  score?: number;
  interpretation?: string;
}

interface AssessmentGridProps {
  assessments: AssessmentCardData[];
  jadwalBerikutnya: Date | null;
  onSelectAssessment: (type: AssessmentType) => void;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

const iconPaths: Record<string, React.ReactNode> = {
  phq9: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </>
  ),
  gad7: <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-2-4-3.5c-.5 1.5-2 2-4 3.5S5 13 5 15a7 7 0 0 0 7 7z" />,
  srq20: (
    <>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
    </>
  ),
};

const AssessmentIcon: React.FC<{ type: string; done: boolean }> = ({ type, done }) => (
  <div className={`w-9 h-9 ${done ? 'bg-teal-50' : 'bg-stone-100'} rounded-lg flex items-center justify-center shrink-0`}>
    <svg
      viewBox="0 0 24 24"
      className={`w-[18px] h-[18px] ${done ? 'text-teal-700' : 'text-stone-400'}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {iconPaths[type] || iconPaths.srq20}
    </svg>
  </div>
);

export const AssessmentGrid: React.FC<AssessmentGridProps> = ({
  assessments,
  jadwalBerikutnya,
  onSelectAssessment,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {assessments.map((item) => (
        <button
          key={item.type}
          onClick={() => onSelectAssessment(item.type)}
          className="bg-white rounded-xl p-4 border border-stone-200 text-left hover:border-teal-300 transition-colors group"
        >
          <div className="flex items-start gap-3 mb-2">
            <AssessmentIcon type={item.type} done={item.done} />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-stone-900 group-hover:text-teal-700 transition-colors truncate">
                {item.name}
              </p>
              <p className="text-[11px] text-stone-400">{item.category}</p>
            </div>
          </div>
          {item.done ? (
            <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-md bg-teal-50 text-teal-800">
              Skor {item.score} &middot; {item.interpretation}
            </span>
          ) : (
            <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-500">
              Belum diisi
            </span>
          )}
        </button>
      ))}

      <div className="bg-stone-50 rounded-xl p-4 border border-dashed border-stone-300 flex flex-col items-center justify-center text-center gap-2">
        <div className="w-9 h-9 bg-stone-100 rounded-lg flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            className="w-[18px] h-[18px] text-stone-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
          </svg>
        </div>
        <div>
          <p className="text-[11px] text-stone-400 font-medium">Skrining berikutnya</p>
          <p className="text-[13px] font-medium text-stone-600">
            {jadwalBerikutnya ? formatDate(jadwalBerikutnya) : 'Belum terjadwal'}
          </p>
        </div>
      </div>
    </div>
  );
};
