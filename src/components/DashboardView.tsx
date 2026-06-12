import React, { useState } from 'react';
import { ViewType, HistoryItem, AssessmentType } from '../types';
import {
  BellIcon,
  HelpIcon,
  VerifiedUserIcon,
  FormatListNumberedIcon,
  HistoryIcon,
  SupportAgentIcon,
  MoodBadIcon,
  CloseIcon,
  ArrowRightIcon,
} from './Icons';
import { Toast, ToastType } from './Toast';

interface DashboardViewProps {
  onSetView: (view: ViewType) => void;
  history: HistoryItem[];
  onOpenCounselorModal: () => void;
  onSelectAssessment: (type: AssessmentType) => void;
  onLogout: () => void;
}

function ProgressRing({ completed, total }: { completed: number; total: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? completed / total : 0;
  const offset = circumference - progress * circumference;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#E7E5E4" strokeWidth="6" />
        <circle
          cx="48" cy="48" r={radius} fill="none"
          stroke="#0F766E" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="progress-ring-circle"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-stone-900">{completed}/{total}</span>
        <span className="text-[11px] text-stone-500 font-medium">selesai</span>
      </div>
    </div>
  );
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSetView,
  history,
  onOpenCounselorModal,
  onSelectAssessment,
  onLogout
}) => {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const [guideTab, setGuideTab] = useState<'alur' | 'privasi' | 'faq'>('alur');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const completedAssessments = history.length;
  const totalAssessments = 3;

  const getAssessmentStatus = (type: string) => {
    const found = history.find(h => h.assessmentName.toLowerCase().includes(type));
    return found ? { done: true, score: found.score, date: found.date } : { done: false };
  };

  const phq9Status = getAssessmentStatus('depresi');
  const gad7Status = getAssessmentStatus('kecemasan');
  const srq20Status = getAssessmentStatus('srq');

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
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight">SIGAP <span className="text-teal-700">UB</span></span>
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
                <span className="text-white font-bold text-sm">MU</span>
              </button>
              {isProfileDropdownOpen && (
                <div role="menu" className="absolute right-0 top-12 w-52 bg-white border border-stone-200 shadow-lg rounded-xl py-1.5 z-50">
                  <div className="px-4 py-2.5 border-b border-stone-100">
                    <p className="text-sm font-semibold text-stone-900">Mahasiswa UB</p>
                    <p className="text-xs text-stone-500">21500010023 · FILKOM</p>
                  </div>
                  <button
                    role="menuitem"
                    onClick={() => { setIsProfileDropdownOpen(false); setIsGuideModalOpen(true); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                    Panduan &amp; FAQ
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => { setIsProfileDropdownOpen(false); onLogout(); }}
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

      {/* Main Content */}
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 md:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Welcome + Progress Card */}
            <section className="bg-white rounded-2xl p-6 md:p-8 border border-stone-200 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <ProgressRing completed={completedAssessments} total={totalAssessments} />
                <div className="flex-1">
                  <h1 className="font-display font-bold text-2xl md:text-[1.75rem] text-stone-900 mb-1.5 leading-tight">
                    Selamat datang kembali, <span className="text-teal-700">Mahasiswa UB</span>
                  </h1>
                  <p className="text-sm text-stone-500 leading-relaxed max-w-lg">
                    {completedAssessments === 0
                      ? 'Mulai asesmen pertamamu untuk mengetahui kondisi kesehatan mentalmu saat ini.'
                      : `${completedAssessments} dari ${totalAssessments} asesmen telah diselesaikan. Lanjutkan untuk gambaran yang lebih lengkap.`
                    }
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold text-emerald-700">SIAM Terhubung</span>
                    </div>
                    <span className="text-xs text-stone-400 font-medium">&middot;</span>
                    <span className="text-xs text-stone-400 font-medium">Data terenkripsi end-to-end</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Assessment — GAD-7 */}
            <section className="animate-fade-in-up animate-fade-in-up-delay-1">
              <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Direkomendasikan untuk kamu</h2>
              <div
                className="relative bg-teal-700 rounded-2xl p-6 md:p-8 overflow-hidden cursor-pointer group hover:bg-teal-800 transition-colors"
                onClick={() => onSelectAssessment('gad7')}
              >
                <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors" />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-white/15 text-white text-[11px] font-bold rounded-full uppercase tracking-wide">
                        Rekomendasi
                      </span>
                      {gad7Status.done && (
                        <span className="px-2 py-0.5 bg-emerald-400/20 text-emerald-100 text-[11px] font-bold rounded-full">
                          Selesai
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-xl md:text-2xl text-white mb-1">
                      Asesmen Kecemasan (GAD-7)
                    </h3>
                    <p className="text-sm text-white/70 max-w-md leading-relaxed">
                      Evaluasi tingkat kecemasan umum, stres harian, dan ketegangan psikis dalam 2 minggu terakhir.
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-xs text-white/50 font-medium">7 pertanyaan</span>
                      <span className="text-xs text-white/50">&middot;</span>
                      <span className="text-xs text-white/50 font-medium">~2 menit</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectAssessment('gad7'); }}
                    className="shrink-0 bg-white text-teal-700 font-bold text-sm px-6 py-3 rounded-xl hover:bg-stone-50 active:scale-95 transition-all shadow-sm"
                  >
                    {gad7Status.done ? 'Ulangi Tes' : 'Mulai Tes'}
                  </button>
                </div>
              </div>
            </section>

            {/* Other Assessments Grid */}
            <section className="animate-fade-in-up animate-fade-in-up-delay-2">
              <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Asesmen lainnya</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* PHQ-9 Card */}
                <div className="bg-white rounded-2xl p-5 border border-stone-200 hover:border-teal-300 hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
                      <MoodBadIcon className="w-5 h-5" />
                    </div>
                    {phq9Status.done && (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full border border-emerald-200">
                        Selesai
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-stone-900 mb-1 group-hover:text-teal-700 transition-colors">
                    Asesmen Depresi
                  </h4>
                  <p className="text-xs text-stone-500 mb-3 leading-relaxed">
                    Skrining mendalam tanda depresi emosional (PHQ-9).
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-400 font-medium">9 pertanyaan &middot; ~3 min</span>
                    <button
                      onClick={() => onSelectAssessment('phq9')}
                      className="text-teal-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-teal-200 hover:bg-teal-50 active:scale-95 transition-all"
                    >
                      {phq9Status.done ? 'Ulangi' : 'Mulai'}
                    </button>
                  </div>
                </div>

                {/* SRQ-20 Card */}
                <div className="bg-white rounded-2xl p-5 border border-stone-200 hover:border-teal-300 hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
                    </div>
                    {srq20Status.done && (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full border border-emerald-200">
                        Selesai
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-stone-900 mb-1 group-hover:text-teal-700 transition-colors">
                    Skrining Umum WHO
                  </h4>
                  <p className="text-xs text-stone-500 mb-3 leading-relaxed">
                    20 pertanyaan skrining mental emosional standar WHO (SRQ-20).
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-400 font-medium">20 pertanyaan &middot; ~5 min</span>
                    <button
                      onClick={() => onSelectAssessment('srq20')}
                      className="text-teal-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-teal-200 hover:bg-teal-50 active:scale-95 transition-all"
                    >
                      {srq20Status.done ? 'Ulangi' : 'Mulai'}
                    </button>
                  </div>
                </div>

              </div>
            </section>
          </div>

          {/* Right Column — Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-5 animate-fade-in-up animate-fade-in-up-delay-3">

            {/* Compact Profile Card */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-teal-700 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">MU</span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-stone-900 truncate">Mahasiswa UB Brawijaya</p>
                  <p className="text-xs text-stone-500">21500010023 &middot; FILKOM</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-emerald-700">SIAK UB Tersinkronisasi</span>
              </div>
            </div>

            {/* Assessment History Timeline */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200">
              <h3 className="font-semibold text-sm text-stone-900 mb-4 flex items-center gap-2">
                <HistoryIcon size={16} className="text-stone-400" />
                Riwayat Asesmen
              </h3>

              {history.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <HistoryIcon size={20} className="text-stone-400" />
                  </div>
                  <p className="text-xs text-stone-500">Belum ada riwayat tes.</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-stone-200"></div>
                  <div className="flex flex-col gap-4">
                    {history.map((item) => (
                      <div key={item.id} className="flex gap-3 relative">
                        <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 mt-0.5 z-10 ${
                          item.status === 'Selesai' || item.status === 'Aman'
                            ? 'bg-emerald-500 border-emerald-200'
                            : 'bg-amber-500 border-amber-200'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-stone-900 truncate">{item.assessmentName}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-stone-400">{item.date}</span>
                            {item.score !== undefined && (
                              <span className="text-xs text-stone-500 font-medium bg-stone-100 px-1.5 py-0.5 rounded">
                                Skor {item.score}
                              </span>
                            )}
                          </div>
                          {item.interpretation && (
                            <span className={`inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                              item.status === 'Perhatian'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}>
                              {item.interpretation}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Counselor CTA */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center">
                  <SupportAgentIcon size={22} className="text-teal-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-stone-900">Butuh bicara?</h3>
                  <p className="text-xs text-stone-500">Gratis &amp; rahasia untuk mahasiswa UB</p>
                </div>
              </div>
              <button
                onClick={onOpenCounselorModal}
                className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-semibold active:scale-[0.98] transition-all"
              >
                Chat Konselor
              </button>
            </div>
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
              <h3 className="font-bold text-base text-stone-900">Panduan &amp; FAQ</h3>
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

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
};
