import React, { useState } from 'react';
import { ViewType, Question, AssessmentType } from '../types';
import { GAD7_QUESTIONS, PHQ9_QUESTIONS, SRQ20_QUESTIONS } from '../data/assessments';
import { CloseIcon, ArrowLeftIcon, ArrowRightIcon, VerifiedUserIcon } from './Icons';
import { Toast, ToastType } from './Toast';
import { ConfirmModal } from './ConfirmModal';

interface AssessmentViewProps {
  onSetView: (view: ViewType) => void;
  onAddHistoryItem: (type: AssessmentType, score: number, interpretation: string, label: 'Selesai' | 'Perhatian' | 'Aman') => void;
  assessmentType: AssessmentType;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({ 
  onSetView, 
  onAddHistoryItem,
  assessmentType
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState<boolean>(false);
  const [questionFade, setQuestionFade] = useState<'in' | 'out'>('in');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState<boolean>(false);

  const questions = assessmentType === 'gad7' 
    ? GAD7_QUESTIONS 
    : assessmentType === 'phq9' 
      ? PHQ9_QUESTIONS 
      : SRQ20_QUESTIONS;

  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const animateQuestionTransition = (action: () => void) => {
    setQuestionFade('out');
    setTimeout(() => {
      action();
      setQuestionFade('in');
    }, 150);
  };

  const handleSelectOption = (score: number) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: score
    });
  };

  const handleNext = () => {
    if (answers[currentQuestion.id] === undefined) {
      setToast({ message: 'Silakan pilih salah satu opsi jawaban sebelum melanjutkan.', type: 'error' });
      return;
    }

    if (currentIndex < questions.length - 1) {
      animateQuestionTransition(() => {
        setCurrentIndex(currentIndex + 1);
      });
    } else {
      setShowResult(true);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      animateQuestionTransition(() => {
        setCurrentIndex(currentIndex - 1);
      });
    }
  };

  const getInterpretationAndLabel = (score: number): { text: string; label: 'Selesai' | 'Perhatian' | 'Aman'; color: string; desc: string } => {
    if (assessmentType === 'gad7') {
      if (score <= 4) {
        return { 
          text: "Kecemasan Minimal", 
          label: "Aman", 
          color: "text-emerald-700 bg-emerald-50 border-emerald-200",
          desc: "Kesejahteraan mental Anda berada dalam kondisi sehat dan stabil. Teruskan kebiasaan baik penata-kelolaan stres Anda."
        };
      } else if (score <= 9) {
        return { 
          text: "Kecemasan Ringan", 
          label: "Aman", 
          color: "text-blue-700 bg-blue-50 border-blue-200", 
          desc: "Anda menunjukkan sedikit tanda kecemasan. Hal ini wajar dalam dinamika kehidupan akademik; lakukan relaksasi mandiri jika ketegangan meningkat."
        };
      } else if (score <= 14) {
        return { 
          text: "Kecemasan Sedang", 
          label: "Perhatian", 
          color: "text-amber-700 bg-amber-50 border-amber-200",
          desc: "Anda berada dalam level kecemasan menengah. Kami menyarankan Anda menyusun jadwal konsultasi santai bersama konselor SIGAP UB."
        };
      } else {
        return { 
          text: "Kecemasan Berat", 
          label: "Perhatian", 
          color: "text-red-700 bg-red-50 border-red-200",
          desc: "Tingkat kecemasan Anda sangat tinggi. Kami sangat menganjurkan Anda segera menekan tombol konseling untuk mendapatkan triage prioritas."
        };
      }
    } else if (assessmentType === 'phq9') {
      if (score <= 4) {
        return { 
          text: "Depresi Minimal", 
          label: "Aman", 
          color: "text-emerald-700 bg-emerald-50 border-emerald-200",
          desc: "Kesejahteraan emosional Anda sangat baik dan seimbang. Pertahankan relasi sosial sehat dan gaya hidup aktif."
        };
      } else if (score <= 9) {
        return { 
          text: "Depresi Ringan", 
          label: "Aman", 
          color: "text-blue-700 bg-blue-50 border-blue-200", 
          desc: "Anda menunjukkan indikasi kelelahan emosional ringan. Istirahat sejenak dari rutinitas tugas akademik dan berbicaralah dengan orang terdekat."
        };
      } else if (score <= 14) {
        return { 
          text: "Depresi Sedang", 
          label: "Perhatian", 
          color: "text-amber-700 bg-amber-50 border-amber-200",
          desc: "Anda berada dalam kategori stres/kesedihan menengah. Konselor kami siap mendengarkan cerita Anda secara aman dan tertutup."
        };
      } else if (score <= 19) {
        return { 
          text: "Depresi Sedang-Berat", 
          label: "Perhatian", 
          color: "text-orange-700 bg-orange-50 border-orange-200",
          desc: "Tingkat kelelahan psikis Anda berada pada kategori serius. Sangat disarankan untuk segera memesan sesi janji temu konseling."
        };
      } else {
        return { 
          text: "Depresi Berat", 
          label: "Perhatian", 
          color: "text-red-700 bg-red-50 border-red-200",
          desc: "Indikasi depresi klinis sangat berat terdeteksi. Segera hubungi hotline bantuan atau tekan tombol penjadwalan konseling segera."
        };
      }
    } else {
      // SRQ-20 scoring
      if (score <= 5) {
        return { 
          text: "Sehat & Aman", 
          label: "Aman", 
          color: "text-emerald-700 bg-emerald-50 border-emerald-200",
          desc: "Hasil skrining umum Anda menunjukkan stabilitas mental emosional yang baik. Teruskan regulasi diri Anda."
        };
      } else if (score <= 7) {
        return { 
          text: "Indikasi Stres Ringan", 
          label: "Aman", 
          color: "text-blue-700 bg-blue-50 border-blue-200", 
          desc: "Anda berada pada ambang batas stres ringan. Luangkan waktu untuk hobi, olahraga, atau relaksasi meditasi."
        };
      } else if (score <= 12) {
        return { 
          text: "Indikasi Stres Sedang", 
          label: "Perhatian", 
          color: "text-amber-700 bg-amber-50 border-amber-200",
          desc: "Skrining mendeteksi tanda-tanda stres emosional sedang. Disarankan untuk memantau kondisi dan berdiskusi dengan konselor."
        };
      } else {
        return { 
          text: "Stres Emosional Berat", 
          label: "Perhatian", 
          color: "text-red-700 bg-red-50 border-red-200",
          desc: "Tingkat distress emosional Anda cukup tinggi dan mengganggu fungsi aktivitas. Konselor kami siap membantu Anda."
        };
      }
    }
  };

  const handleFinish = () => {
    let totalScore = 0;
    questions.forEach(q => {
      totalScore += (answers[q.id] || 0);
    });

    const interpretation = getInterpretationAndLabel(totalScore);
    onAddHistoryItem(assessmentType, totalScore, interpretation.text, interpretation.label);
    onSetView('dashboard');
  };

  const handleSaveAndExit = () => {
    setIsExitConfirmOpen(true);
  };

  const confirmSaveAndExit = () => {
    setIsExitConfirmOpen(false);
    onSetView('dashboard');
  };

  // Title translation map
  const moduleTitleMap: Record<AssessmentType, string> = {
    gad7: 'Modul GAD-7 Kecemasan',
    phq9: 'Modul PHQ-9 Depresi',
    srq20: 'Skrining Umum SRQ-20'
  };

  // 1. QUESTION FLOW STATE
  if (!showResult) {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col antialiased">
        {/* Wizard Header bar */}
        <header className="w-full px-6 md:px-12 py-4 max-w-[1280px] mx-auto flex justify-between items-center z-50">
          <div className="font-bold text-xl text-teal-700 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 duration-150" onClick={() => onSetView('dashboard')}>
            SIGAP <span className="text-stone-900">UB</span>
          </div>
          <div>
            <button
              onClick={handleSaveAndExit}
              className="text-stone-500 hover:text-teal-700 transition-colors flex items-center gap-1.5 font-bold text-xs md:text-sm cursor-pointer hover:scale-105 active:scale-95 duration-150"
            >
              <CloseIcon size={16} />
              <span className="hidden md:inline">Simpan &amp; Keluar</span>
            </button>
          </div>
        </header>

        {/* Core Quiz Form Frame */}
        <main className="flex-grow flex items-center justify-center p-6 md:p-12 w-full max-w-3xl mx-auto text-left">
          <div className="w-full flex flex-col gap-8">
            
            {/* Top Progress bar and titles matching mockup */}
            <div className="w-full flex flex-col gap-2.5">
              <div className="flex justify-between items-center w-full">
                <span className="font-bold text-xs text-stone-400 uppercase tracking-wider">
                  {moduleTitleMap[assessmentType]}
                </span>
                <span className="font-bold text-xs text-teal-700">
                  Pertanyaan {currentIndex + 1} dari {questions.length}
                </span>
              </div>
              <div aria-valuemax={100} aria-valuemin={0} aria-valuenow={progressPercent} className="h-2 w-full bg-stone-100 rounded-full overflow-hidden" role="progressbar">
                <div
                  className="h-full bg-teal-700 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Simulated Question Card Frame */}
            <div className={`bg-white border border-stone-200 rounded-2xl shadow-sm p-6 md:p-12 w-full transition-all duration-200 ${
              questionFade === 'in' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-[0.99]'
            }`}>
              <h1 className="font-display font-bold text-xl md:text-2xl text-stone-900 mb-8 leading-snug">
                {currentQuestion.text}
              </h1>

              {/* Stack of full-width accessible radio options */}
              <div className="flex flex-col gap-4">
                {currentQuestion.options.map((option) => {
                  const isSelected = answers[currentQuestion.id] === option.score;
                  const optionId = `option-${currentQuestion.id}-${option.score}`;
                  return (
                    <label
                      key={option.score}
                      htmlFor={optionId}
                      className={`relative flex items-center p-4.5 border rounded-xl cursor-pointer transition-all duration-200 group hover:scale-[1.01] active:scale-[0.99] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-teal-700/40 has-[:focus-visible]:ring-offset-2 ${
                        isSelected
                          ? 'border-teal-700 bg-teal-50/50 ring-1 ring-teal-700/40 shadow-sm'
                          : 'border-stone-200 hover:border-teal-700 hover:bg-stone-50'
                      }`}
                    >
                      <input
                        type="radio"
                        id={optionId}
                        name={`question-${currentQuestion.id}`}
                        value={option.score}
                        checked={isSelected}
                        onChange={() => handleSelectOption(option.score)}
                        className="sr-only"
                      />
                      {/* Stylized custom animated radio indicator */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-all duration-200 ${
                        isSelected
                          ? 'border-teal-700'
                          : 'border-stone-300 group-hover:border-teal-700'
                      }`}>
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-teal-700 animate-scale-up"></div>
                        )}
                      </div>
                      <span className={`text-sm md:text-base text-stone-900 ${isSelected ? 'font-semibold' : ''}`}>
                        {option.text}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Bottom Form Navigation controls */}
            <div className="flex justify-between items-center w-full mt-2">
              <button 
                onClick={handleBack}
                disabled={currentIndex === 0}
                className={`transition-all font-bold text-xs md:text-sm flex items-center gap-2 group cursor-pointer active:scale-95 ${
                  currentIndex === 0
                    ? 'text-stone-300 pointer-events-none'
                    : 'text-stone-500 hover:text-teal-700'
                }`}
              >
                <ArrowLeftIcon size={16} className="group-hover:-translate-x-1 transition-transform" />
                Sebelumnya
              </button>
              
              <button 
                onClick={handleNext}
                className="bg-teal-700 hover:bg-teal-800 hover:scale-[1.02] active:scale-95 text-white font-bold text-xs md:text-sm py-3 px-6 rounded-xl transition-all flex items-center gap-2 shadow-sm duration-150 cursor-pointer"
              >
                {currentIndex === questions.length - 1 ? 'Selesai & Evaluasi' : 'Selanjutnya'}
                <ArrowRightIcon size={16} />
              </button>
            </div>

          </div>
        </main>

        {/* Minimal Footer for Focused Design */}
        <footer className="w-full py-8 mt-auto border-t border-stone-200 text-xs text-stone-400">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>© 2026 Universitas Brawijaya Psychological Support System</div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setToast({ message: 'Nomor Crisis Hotline (Kemenkes): 119', type: 'info' })}
                className="hover:text-teal-700 transition-colors cursor-pointer"
              >
                Crisis Hotlines
              </button>
            </div>
          </div>
        </footer>

        <ConfirmModal
          isOpen={isExitConfirmOpen}
          title="Simpan & Keluar"
          message="Apakah Anda yakin ingin menyimpan progress sementara dan keluar?"
          confirmLabel="Ya, Keluar"
          onConfirm={confirmSaveAndExit}
          onCancel={() => setIsExitConfirmOpen(false)}
        />

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    );
  }

  // 2. DIAGNOSTIC RESULTS REPORT STATE
  let calculatedScore = 0;
  questions.forEach(q => {
    calculatedScore += (answers[q.id] || 0);
  });
  const outcome = getInterpretationAndLabel(calculatedScore);
  const maxScore = assessmentType === 'gad7' ? 21 : assessmentType === 'phq9' ? 27 : 20;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col items-center justify-center p-6 antialiased">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-stone-200 shadow-md p-8 md:p-12 text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">

        {/* Verification Icon */}
        <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-700 mb-6">
          <VerifiedUserIcon size={36} />
        </div>

        <span className="font-bold text-xs text-teal-700 uppercase tracking-widest block mb-1">
          Laporan Hasil Asesmen Mandiri
        </span>
        <h1 className="font-display font-black text-2xl md:text-3xl text-stone-900 mb-2 leading-tight">
          Asesmen Berhasil Terselesaikan
        </h1>
        <p className="text-xs md:text-sm text-stone-500 max-w-md mb-8">
          Sistem deteksi dini SIGAP UB telah memproses jawaban Anda. Detail diagnosis tercantum di bawah ini.
        </p>

        {/* Score & Evaluation Card */}
        <div className="w-full bg-stone-50 rounded-2xl p-6 border border-stone-200 mb-8 flex flex-col items-center text-center">
          <div className="flex items-baseline gap-1 mt-1 mb-2">
            <span className="text-4xl font-black text-teal-700">{calculatedScore}</span>
            <span className="text-stone-400 text-sm font-semibold">/ {maxScore} poin</span>
          </div>

          {/* Classification badge */}
          <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border mb-4 ${outcome.color}`}>
            {outcome.text} ({outcome.label})
          </div>

          <p className="text-xs md:text-sm text-stone-500 leading-relaxed max-w-lg">
            {outcome.desc}
          </p>
        </div>

        {/* Re-entry control */}
        <button
          onClick={handleFinish}
          className="w-full bg-teal-700 hover:bg-teal-800 hover:scale-[1.02] active:scale-95 text-white font-bold py-4 px-6 rounded-xl transition-all duration-150 shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          Simpan &amp; Kembali ke Dashboard
          <ArrowRightIcon size={16} />
        </button>

      </div>
    </div>
  );
};
