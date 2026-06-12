import React, { useState } from 'react';
import { ViewType, HistoryItem, AssessmentType } from '../types';
import { getSession } from '../services/auth';
import { SummaryBar } from './dashboard/SummaryBar';
import { RecommendationCard } from './dashboard/RecommendationCard';
import { AssessmentGrid } from './dashboard/AssessmentGrid';
import { ProfileCard } from './dashboard/ProfileCard';
import { HistoryCard } from './dashboard/HistoryCard';
import { CounselingCard } from './dashboard/CounselingCard';
import {
  BellIcon,
  HelpIcon,
  CloseIcon,
} from './Icons';
import { Toast, ToastType } from './Toast';

interface DashboardViewProps {
  onSetView: (view: ViewType) => void;
  history: HistoryItem[];
  onOpenCounselorModal: () => void;
  onSelectAssessment: (type: AssessmentType) => void;
  onLogout: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSetView,
  history,
  onOpenCounselorModal,
  onSelectAssessment,
  onLogout,
}) => {
  const currentSession = getSession();
  const userName = currentSession?.nama ?? 'Mahasiswa UB';
  const userNim = currentSession?.nim ?? '';
  const userFakultas = currentSession?.fakultas ?? '';

  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [guideTab, setGuideTab] = useState<'alur' | 'privasi' | 'faq'>('alur');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const getAssessmentStatus = (type: string) => {
    const found = history.find((h) => h.assessmentName.toLowerCase().includes(type));
    return found
      ? { done: true, score: found.score, date: found.date, interpretation: found.interpretation }
      : { done: false };
  };

  const phq9Status = getAssessmentStatus('depresi');
  const gad7Status = getAssessmentStatus('kecemasan');
  const srq20Status = getAssessmentStatus('srq');

  const completedCount = [phq9Status, gad7Status, srq20Status].filter((s) => s.done).length;

  const recommendations = [
    {
      type: 'gad7' as AssessmentType,
      name: 'Asesmen Kecemasan (GAD-7)',
      desc: 'Evaluasi tingkat kecemasan umum, stres harian, dan ketegangan psikis dalam 2 minggu terakhir.',
      questions: 7,
      minutes: 2,
      statusKey: 'kecemasan',
    },
    {
      type: 'phq9' as AssessmentType,
      name: 'Asesmen Depresi (PHQ-9)',
      desc: 'Skrining mendalam tanda depresi emosional dalam 2 minggu terakhir.',
      questions: 9,
      minutes: 3,
      statusKey: 'depresi',
    },
    {
      type: 'srq20' as AssessmentType,
      name: 'Skrining Umum WHO (SRQ-20)',
      desc: '20 pertanyaan skrining mental emosional standar WHO.',
      questions: 20,
      minutes: 5,
      statusKey: 'srq',
    },
  ];

  const nextRec = recommendations.find((r) => !getAssessmentStatus(r.statusKey).done) || recommendations[0];
  const nextRecStatus = getAssessmentStatus(nextRec.statusKey);

  const getKondisiLevel = () => {
    const scores = history.map((h) => h.score || 0);
    const maxScore = Math.max(...scores, 0);
    if (maxScore >= 20) return 'kritis' as const;
    if (maxScore >= 15) return 'berat' as const;
    if (maxScore >= 10) return 'sedang' as const;
    return 'ringan' as const;
  };

  const assessmentCards = [
    {
      type: 'phq9' as AssessmentType,
      name: 'PHQ-9',
      category: 'Asesmen Depresi',
      questionsCount: 9,
      done: phq9Status.done,
      score: phq9Status.score,
      interpretation: phq9Status.interpretation,
    },
    {
      type: 'gad7' as AssessmentType,
      name: 'GAD-7',
      category: 'Asesmen Kecemasan',
      questionsCount: 7,
      done: gad7Status.done,
      score: gad7Status.score,
      interpretation: gad7Status.interpretation,
    },
    {
      type: 'srq20' as AssessmentType,
      name: 'SRQ-20',
      category: 'Skrining Umum WHO',
      questionsCount: 20,
      done: srq20Status.done,
      score: srq20Status.score,
      interpretation: srq20Status.interpretation,
    },
  ];

  const latestDate = history.length > 0 ? history[0].date : '—';

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 border-b border-stone-200">
        <nav className="flex justify-between items-center w-full px-6 md:px-10 py-3 max-w-[1200px] mx-auto h-[60px]">
          <div
            className="flex items-center gap-2.5 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            onClick={() => onSetView('landing')}
          >
            <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight">
              SIGAP <span className="text-teal-700">UB</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onSetView('landing')}
              className="text-stone-500 hover:text-stone-900 font-medium text-sm px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors"
            >
              Beranda
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-teal-700 font-semibold text-sm px-3 py-2 rounded-lg bg-teal-50"
            >
              Dashboard
            </button>
            <button
              onClick={() => onSetView('konselor')}
              className="text-stone-500 hover:text-stone-900 font-medium text-sm px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors"
            >
              Konselor
            </button>
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="text-stone-500 hover:text-stone-900 font-medium text-sm px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors"
            >
              Panduan
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setToast({ message: 'Tidak ada notifikasi baru.', type: 'info' })}
              aria-label="Notifikasi"
              className="text-stone-400 hover:text-teal-700 p-2.5 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <BellIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsGuideModalOpen(true)}
              aria-label="Bantuan"
              className="text-stone-400 hover:text-teal-700 p-2.5 rounded-lg hover:bg-stone-100 transition-colors hidden sm:flex"
            >
              <HelpIcon className="w-5 h-5" />
            </button>

            <div className="relative ml-1">
              <button
                aria-label="Menu profil"
                aria-haspopup="menu"
                aria-expanded={isProfileDropdownOpen}
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-9 h-9 rounded-full bg-teal-700 flex items-center justify-center hover:ring-2 hover:ring-teal-200 transition-all"
              >
                <span className="text-white font-bold text-sm">{userName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}</span>
              </button>
              {isProfileDropdownOpen && (
                <div role="menu" className="absolute right-0 top-12 w-52 bg-white border border-stone-200 shadow-lg rounded-xl py-1.5 z-50">
                  <div className="px-4 py-2.5 border-b border-stone-100">
                    <p className="text-sm font-semibold text-stone-900">{userName}</p>
                    <p className="text-xs text-stone-500">{userNim} &middot; {userFakultas}</p>
                  </div>
                  <button
                    role="menuitem"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      setIsGuideModalOpen(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                    Panduan & FAQ
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                  >
                    Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Summary Bar */}
      <SummaryBar
        kondisi={getKondisiLevel()}
        asesmenSelesai={completedCount}
        asesmenTotal={3}
        jadwalBerikutnya={null}
        sesiKonseling={0}
        onScheduleCounseling={onOpenCounselorModal}
      />

      {/* Main Content */}
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 md:px-10 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <section className="animate-fade-in-up">
              <h2 className="text-[11px] uppercase tracking-[0.06em] text-stone-400 font-medium mb-2.5">
                Direkomendasikan
              </h2>
              <RecommendationCard
                assessmentName={nextRec.name}
                assessmentType={nextRec.type}
                description={nextRec.desc}
                questionsCount={nextRec.questions}
                estimatedMinutes={nextRec.minutes}
                isDone={nextRecStatus.done}
                onStart={onSelectAssessment}
              />
            </section>

            <section className="animate-fade-in-up animate-fade-in-up-delay-1">
              <h2 className="text-[11px] uppercase tracking-[0.06em] text-stone-400 font-medium mb-2.5">
                Asesmen tersedia
              </h2>
              <AssessmentGrid
                assessments={assessmentCards}
                jadwalBerikutnya={null}
                onSelectAssessment={onSelectAssessment}
              />
            </section>
          </div>

          {/* Right Column — Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-4 animate-fade-in-up animate-fade-in-up-delay-2">
            <ProfileCard
              nama={userName}
              nim={userNim}
              fakultas={userFakultas}
              risikoLevel={getKondisiLevel()}
              updatedDate={latestDate}
            />
            <HistoryCard riwayat={[]} />
            <CounselingCard onOpenModal={onOpenCounselorModal} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-12 bg-white border-t border-stone-200 flex items-center px-6 md:px-10 justify-between max-w-[1200px] mx-auto w-full shrink-0">
        <span className="text-xs text-stone-400">Platform Resmi Universitas Brawijaya &copy; 2025</span>
        <span className="text-xs text-stone-400 font-medium">Tim &quot;Puding Coklat Pak Hambali&quot;</span>
      </footer>

      {/* Guide Modal */}
      {isGuideModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-stone-200">
              <h3 className="font-bold text-base text-stone-900">Panduan & FAQ</h3>
              <button
                onClick={() => setIsGuideModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1.5 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <div className="flex border-b border-stone-200 px-6 gap-1 pt-2">
              {(['alur', 'privasi', 'faq'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setGuideTab(tab)}
                  className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                    guideTab === tab
                      ? 'text-teal-700 border-b-2 border-teal-700 bg-teal-50/50'
                      : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {tab === 'alur' ? 'Alur Layanan' : tab === 'privasi' ? 'Privasi' : 'FAQ'}
                </button>
              ))}
            </div>

            <div className="p-6 max-h-[400px] overflow-y-auto">
              {guideTab === 'alur' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-stone-900 mb-3">Bagaimana Cara Menggunakan SIGAP UB?</h4>
                  <ol className="space-y-3 text-sm text-stone-600">
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">1</span>
                      <span><strong>Pilih Tes:</strong> Pilih kuesioner asesmen di halaman dashboard (PHQ-9, GAD-7, atau SRQ-20).</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">2</span>
                      <span><strong>Isi Kuesioner:</strong> Jawab seluruh pertanyaan sesuai perasaan 2 minggu terakhir (~5 menit).</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">3</span>
                      <span><strong>Analisis:</strong> Sistem menghitung skor berdasarkan standar klinis internasional.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">4</span>
                      <span><strong>Konseling:</strong> Jika risiko Sedang/Tinggi, tekan &quot;Chat Konselor&quot; untuk janji temu gratis.</span>
                    </li>
                  </ol>
                </div>
              )}
              {guideTab === 'privasi' && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-stone-900 mb-3">Perlindungan Data Anda</h4>
                  <ul className="space-y-2.5 text-sm text-stone-600">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-700 mt-0.5">&#10003;</span>
                      <span><strong>Enkripsi End-to-End:</strong> Data tidak dapat dibaca oleh staf akademis, dosen, atau fakultas.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-700 mt-0.5">&#10003;</span>
                      <span><strong>Akses Eksklusif Medis:</strong> Hanya konselor psikologis klinis terlisensi yang memiliki akses.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-700 mt-0.5">&#10003;</span>
                      <span><strong>Tanpa Stigma:</strong> Hasil tidak memengaruhi nilai, beasiswa, atau status keaktifan.</span>
                    </li>
                  </ul>
                </div>
              )}
              {guideTab === 'faq' && (
                <div className="space-y-4 text-sm">
                  <div>
                    <h5 className="font-semibold text-stone-900 mb-1">Apakah layanan ini berbayar?</h5>
                    <p className="text-stone-500">Tidak. Seluruh layanan 100% gratis bagi mahasiswa UB aktif.</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-stone-900 mb-1">Bagaimana jika halaman tes tertutup?</h5>
                    <p className="text-stone-500">Progress jawaban tersimpan otomatis. Anda bisa melanjutkan kapan saja.</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-stone-900 mb-1">Bisa menghapus riwayat asesmen?</h5>
                    <p className="text-stone-500">Tidak bisa dihapus mandiri demi keamanan rekam medis, namun kerahasiaan terjamin.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end px-6 py-4 border-t border-stone-200">
              <button
                onClick={() => setIsGuideModalOpen(false)}
                className="bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl active:scale-95 transition-all"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
