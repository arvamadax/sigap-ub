import React, { useState } from 'react';
import { ViewType, HistoryItem, AssessmentType } from './types';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { AssessmentView } from './components/AssessmentView';
import { KonselorView } from './components/KonselorView';
import { CloseIcon, VerifiedUserIcon } from './components/Icons';
import { Toast, ToastType } from './components/Toast';

export default function App() {
  const [view, setView] = useState<ViewType>('landing');
  const [activeAssessment, setActiveAssessment] = useState<AssessmentType>('gad7');
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loginStep, setLoginStep] = useState<'form' | 'loading' | 'success'>('form');
  const [loginMessage, setLoginMessage] = useState<string>('');
  const [username, setUsername] = useState<string>('mahasiswa@student.ub.ac.id');
  const [password, setPassword] = useState<string>('');

  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'srq20-initial',
      assessmentName: 'Skrining Umum (SRQ-20)',
      date: '12 Okt 2023',
      status: 'Selesai',
      score: 5,
      interpretation: 'Gejala Ringan'
    },
    {
      id: 'phq9-initial',
      assessmentName: 'Asesmen Depresi (PHQ-9)',
      date: '05 Sep 2023',
      status: 'Perhatian',
      score: 12,
      interpretation: 'Depresi Sedang'
    }
  ]);

  const [isCounselorModalOpen, setIsCounselorModalOpen] = useState<boolean>(false);
  const [counselorSubmitted, setCounselorSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    nim: '21500010023',
    kategori: 'Kecemasan Akademik',
    tanggal: '2026-05-25',
    sesi: '09:00 - 10:30 WIB',
    catatan: ''
  });

  const changeView = (nextView: ViewType) => {
    if (!isLoggedIn && (nextView === 'dashboard' || nextView === 'assessment' || nextView === 'konselor')) {
      setIsLoginModalOpen(true);
      return;
    }
    setFadeState('out');
    setTimeout(() => {
      setView(nextView);
      setFadeState('in');
    }, 200);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    changeView('landing');
  };

  const handleSiamLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setToast({ message: 'Silakan isi email dan password SIAM Anda.', type: 'error' });
      return;
    }
    setLoginStep('loading');
    setLoginMessage('Menghubungkan ke server SIAM UB...');
    setTimeout(() => {
      setLoginMessage('Mengautentikasi akun...');
    }, 800);
    setTimeout(() => {
      setLoginMessage('Login berhasil!');
      setLoginStep('success');
    }, 1600);
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsLoginModalOpen(false);
      setLoginStep('form');
      setFadeState('out');
      setTimeout(() => {
        setView('dashboard');
        setFadeState('in');
      }, 200);
    }, 2400);
  };

  const handleAddHistoryItem = (
    type: AssessmentType,
    score: number,
    interpretation: string,
    label: 'Selesai' | 'Perhatian' | 'Aman'
  ) => {
    const formattedDate = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const nameMap: Record<AssessmentType, string> = {
      gad7: 'Asesmen Kecemasan (GAD-7)',
      phq9: 'Asesmen Depresi (PHQ-9)',
      srq20: 'Skrining Umum (SRQ-20)'
    };
    const newItem: HistoryItem = {
      id: `${type}-${Date.now()}`,
      assessmentName: nameMap[type],
      date: formattedDate,
      status: label,
      score: score,
      interpretation: interpretation
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCounselorSubmitted(true);
  };

  const resetForm = () => {
    setIsCounselorModalOpen(false);
    setCounselorSubmitted(false);
    setFormData({
      nim: '21500010023',
      kategori: 'Kecemasan Akademik',
      tanggal: '2026-05-25',
      sesi: '09:00 - 10:30 WIB',
      catatan: ''
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 selection:bg-teal-700/10 selection:text-teal-900">
      <div className={`transition-all duration-300 ease-in-out transform ${
        fadeState === 'in' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}>
        {view === 'landing' && (
          <LandingView
            onSetView={changeView}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            onTriggerLogin={() => setIsLoginModalOpen(true)}
          />
        )}
        {view === 'dashboard' && (
          <DashboardView
            onSetView={changeView}
            history={history}
            onOpenCounselorModal={() => setIsCounselorModalOpen(true)}
            onSelectAssessment={(type) => {
              setActiveAssessment(type);
              changeView('assessment');
            }}
            onLogout={handleLogout}
          />
        )}
        {view === 'assessment' && (
          <AssessmentView
            onSetView={changeView}
            assessmentType={activeAssessment}
            onAddHistoryItem={handleAddHistoryItem}
          />
        )}
        {view === 'konselor' && (
          <KonselorView
            onSetView={changeView}
            onLogout={handleLogout}
          />
        )}
      </div>

      {/* Login Modal — Vercel-style SSO */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl w-full max-w-[420px] shadow-2xl overflow-hidden">

            {loginStep === 'form' && (
              <>
                <button
                  onClick={() => setIsLoginModalOpen(false)}
                  className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 p-1.5 hover:bg-stone-100 rounded-lg transition-colors z-10"
                >
                  <CloseIcon size={18} />
                </button>

                <div className="pt-8 pb-2 px-8 text-center">
                  <div className="w-14 h-14 bg-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-700/20">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <h2 className="font-display font-bold text-xl text-stone-900 mb-1">Masuk ke SIGAP UB</h2>
                  <p className="text-sm text-stone-500">Gunakan akun SIAM untuk mengakses asesmen</p>
                </div>

                <div className="px-8 pt-5">
                  <button
                    type="button"
                    onClick={() => {
                      if (!password) {
                        setToast({ message: 'Isi password terlebih dahulu di form bawah.', type: 'error' });
                        return;
                      }
                      handleSiamLoginSubmit({ preventDefault: () => {} } as React.FormEvent);
                    }}
                    className="w-full flex items-center justify-center gap-3 bg-stone-900 text-white font-semibold text-sm py-3 px-4 rounded-xl hover:bg-stone-800 active:scale-[0.98] transition-all"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    Login via SSO SIAM UB
                  </button>
                </div>

                <div className="flex items-center gap-3 px-8 py-4">
                  <div className="flex-1 h-px bg-stone-200"></div>
                  <span className="text-xs text-stone-400 font-medium">atau masuk manual</span>
                  <div className="flex-1 h-px bg-stone-200"></div>
                </div>

                <form onSubmit={handleSiamLoginSubmit} className="px-8 pb-8 flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Email UB</label>
                    <input
                      type="text"
                      required
                      placeholder="mahasiswa@student.ub.ac.id"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 hover:border-stone-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 hover:border-stone-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 focus:outline-none font-mono transition-colors"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer text-stone-500">
                      <input type="checkbox" defaultChecked className="rounded border-stone-300 text-teal-700 focus:ring-teal-700/20" />
                      Ingat saya
                    </label>
                    <a href="https://siam.ub.ac.id" target="_blank" rel="noreferrer" className="text-teal-700 hover:underline font-medium">
                      Lupa sandi?
                    </a>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm py-2.5 px-4 rounded-xl active:scale-[0.98] transition-all mt-1"
                  >
                    Masuk
                  </button>
                </form>
              </>
            )}

            {loginStep === 'loading' && (
              <div className="py-16 px-8 text-center flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-[3px] border-stone-200 border-t-teal-700 animate-spin"></div>
                <div>
                  <h3 className="font-semibold text-base text-stone-900 mb-1">Mengautentikasi</h3>
                  <p className="text-sm text-stone-500">{loginMessage}</p>
                </div>
              </div>
            )}

            {loginStep === 'success' && (
              <div className="py-16 px-8 text-center flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
                  <VerifiedUserIcon size={28} />
                </div>
                <h3 className="font-semibold text-base text-stone-900">Login Berhasil</h3>
                <p className="text-sm text-stone-500">Mengalihkan ke dashboard...</p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Counseling Modal */}
      {isCounselorModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

            <div className="flex justify-between items-center px-6 py-4 border-b border-stone-200">
              <h3 className="font-bold text-base text-stone-900">Janji Temu Konseling</h3>
              <button
                onClick={resetForm}
                className="text-stone-400 hover:text-stone-600 p-1.5 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            {!counselorSubmitted ? (
              <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-5">
                <div className="bg-teal-50 border border-teal-100 p-3.5 rounded-xl flex gap-3 text-sm text-teal-800">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                  <p>Layanan konseling SIGAP UB bersifat <strong>rahasia &amp; gratis</strong> untuk mahasiswa UB aktif.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Nama</label>
                    <input
                      type="text"
                      value="Mahasiswa UB Brawijaya"
                      disabled
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">NIM</label>
                    <input
                      type="text"
                      value={formData.nim}
                      onChange={(e) => setFormData(prev => ({ ...prev, nim: e.target.value }))}
                      required
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 hover:border-stone-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Kategori Hambatan</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData(prev => ({ ...prev, kategori: e.target.value }))}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 hover:border-stone-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 focus:outline-none cursor-pointer transition-colors"
                  >
                    <option value="Kecemasan Akademik">Kecemasan Akademik (Stres / Ujian / Tugas)</option>
                    <option value="Stres Skripsi / Tugas Akhir">Stres Skripsi / Tugas Akhir</option>
                    <option value="Hambatan Sosial / Relasi Pertemanan">Hambatan Sosial / Relasi Pertemanan</option>
                    <option value="Depresi / Kesedihan Mendalam">Depresi / Kesedihan Mendalam</option>
                    <option value="Kecanduan / Burnout Gadget">Kecanduan / Burnout Gadget</option>
                    <option value="Lainnya">Kondisi Lainnya</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Tanggal</label>
                    <input
                      type="date"
                      value={formData.tanggal}
                      min="2026-05-22"
                      onChange={(e) => setFormData(prev => ({ ...prev, tanggal: e.target.value }))}
                      required
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 hover:border-stone-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Sesi</label>
                    <select
                      value={formData.sesi}
                      onChange={(e) => setFormData(prev => ({ ...prev, sesi: e.target.value }))}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 hover:border-stone-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 focus:outline-none cursor-pointer transition-colors"
                    >
                      <option value="09:00 - 10:30 WIB">Pagi (09:00 - 10:30)</option>
                      <option value="11:00 - 12:30 WIB">Siang (11:00 - 12:30)</option>
                      <option value="13:30 - 15:00 WIB">Sore (13:30 - 15:00)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Catatan <span className="text-stone-400 font-normal">(opsional)</span></label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan keluhan atau harapan Anda..."
                    value={formData.catatan}
                    onChange={(e) => setFormData(prev => ({ ...prev, catatan: e.target.value }))}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 hover:border-stone-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 focus:outline-none placeholder-stone-400 transition-colors"
                  ></textarea>
                </div>

                <div className="flex gap-3 justify-end pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-stone-500 hover:text-stone-700 hover:bg-stone-100 font-medium text-sm px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm px-6 py-2.5 rounded-xl active:scale-[0.98] transition-all"
                  >
                    Kirim Permohonan
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-10 text-center flex flex-col items-center">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mb-4">
                  <VerifiedUserIcon size={28} />
                </div>
                <h4 className="font-bold text-lg text-stone-900 mb-2">Permohonan Terkirim</h4>
                <p className="text-sm text-stone-500 leading-relaxed mb-6 max-w-sm">
                  Janji temu <strong>{formData.kategori}</strong> pada <strong>{formData.tanggal} ({formData.sesi})</strong> telah dicatat. Konselor akan menghubungi via email/WhatsApp.
                </p>
                <button
                  onClick={resetForm}
                  className="bg-teal-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-teal-800 active:scale-[0.98] transition-all"
                >
                  Selesai
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
