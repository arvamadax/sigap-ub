import React from 'react';
import { AssessmentType } from '../../types';
import { ArrowRightIcon } from '../Icons';

interface RecommendationCardProps {
  assessmentName: string;
  assessmentType: AssessmentType;
  description: string;
  questionsCount: number;
  estimatedMinutes: number;
  isDone: boolean;
  onStart: (type: AssessmentType) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  assessmentName,
  assessmentType,
  description,
  questionsCount,
  estimatedMinutes,
  isDone,
  onStart,
}) => {
  return (
    <div
      className="bg-teal-800 rounded-xl p-5 md:p-6 cursor-pointer group hover:bg-teal-900 transition-colors relative overflow-hidden"
      onClick={() => onStart(assessmentType)}
    >
      <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-white/5 group-hover:bg-white/[0.08] transition-colors" />
      <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/5 group-hover:bg-white/[0.08] transition-colors" />
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <span
            className={`inline-block px-2.5 py-0.5 text-[11px] font-medium rounded-md mb-2 ${
              isDone ? 'bg-teal-400/20 text-teal-200' : 'bg-white/10 text-white/80'
            }`}
          >
            {isDone ? 'Selesai' : 'Direkomendasikan'}
          </span>
          <h3 className="font-semibold text-lg text-white mb-1">{assessmentName}</h3>
          <p className="text-[13px] text-white/60 leading-relaxed max-w-md">{description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] text-white/40 font-medium">{questionsCount} pertanyaan</span>
            <span className="text-[11px] text-white/40">&middot;</span>
            <span className="text-[11px] text-white/40 font-medium">~{estimatedMinutes} menit</span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStart(assessmentType);
          }}
          className="shrink-0 bg-white text-teal-800 font-semibold text-[13px] px-4 py-2.5 rounded-lg hover:bg-stone-50 active:scale-95 transition-all flex items-center gap-1.5"
        >
          {isDone ? 'Ulangi' : 'Mulai'}
          <ArrowRightIcon size={14} />
        </button>
      </div>
    </div>
  );
};
