import React, { useState, useEffect } from 'react';
import { ViewType, HistoryItem, AssessmentType } from './types';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { AssessmentView } from './components/AssessmentView';
import { KonselorView } from './components/KonselorView';
import { CloseIcon, VerifiedUserIcon } from './components/Icons';
import { Toast, ToastType } from './components/Toast';
import { authenticate, getSession, logout as authLogout, AuthSession } from './services/auth';
import { storage } from './services/storage';

export default function App() {
  const [view, setView] = useState<ViewType>('landing');
  const [activeAssessment, setActiveAssessment] = useState<AssessmentType>('gad7');
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginMode, setLoginMode] = useState<'mahasiswa' | 'konselor'>('mahasiswa');
  const [loginStep, setLoginStep] = useState<'form' | 'loading' | 'success' | 'error'>('form');
  const [loginMessage, setLoginMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [isCounselorModalOpen, setIsCounselorModalOpen] = useState(false);
  const [counselorSubmitted, setCounselorSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nim: '',
    kategori: 'Kecemasan Akademik',
    tanggal: '2026-06-25',
    sesi: '09:00 - 10:30 WIB',
    catatan: '',
  });

  useEffect(() => {
    const existing = getSession();
    if (existing) {
      setSession(existing);
      setIsLoggedIn(true);
      const savedHistory = storage.getHistory(existing.nim);
      setHistory(savedHistory);
    }
  }, []);

  const changeView = (nextView: ViewType) => {
    if (!isLoggedIn && (nextView === 'dashboard' || nextView === 'assessment')) {
      setLoginMode('mahasiswa');
      setIsLoginModalOpen(true);
      return;
    }
    if (!isLoggedIn && nextView === 'konselor') {
      setLoginMode('konselor');
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
    authLogout();
    setSession(null);
    setIsLoggedIn(false);
    setHistory([]);
    setFadeState('out');
    setTimeout(() => {
      setView('landing');
      setFadeState('in');
    }, 200);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setToast({ message: 'Silakan isi email/NIM dan password.', type: 'error' });
      return;
    }

    setLoginStep('loading');
    setLoginMessage(loginMode === 'konselor' ? 'Mengautentikasi konselor...' : 'Menghubungkan ke server SIAM UB...');

    setTimeout(() => {
      setLoginMessage('Memverifikasi kredensial...');
    }, 600);

    setTimeout(() => {
      const result = authenticate(username, password);
      if (!result) {
        setLoginStep('error');
        setLoginMessage('Email/NIM atau password salah.');
        return;
      }

      if (loginMode === 'konselor' && result.role !== 'konselor') {
        setLoginStep('error');
        setLoginMessage('Akun ini bukan akun konselor. Gunakan login mahasiswa.');
        return;
      }

      if (loginMode === 'mahasiswa' && result.role === 'konselor') {
        setLoginStep('error');
        setLoginMessage('Akun konselor tidak bisa login di sini. Gunakan login konselor.');
        return;
      }

      setLoginStep('success');
      setLoginMessage('Login berhasil!');

      setTimeout(() => {
        setSession(result);
        setIsLoggedIn(true);
        const savedHistory = storage.getHistory(result.nim);
        setHistory(savedHistory);
        setIsLoginModalOpen(false);
        resetLoginForm();

        setFadeState('out');
        setTimeout(() => {
          setView(result.role === 'konselor' ? 'konselor' : 'dashboard');
          setFadeState('in');
        }, 200);
      }, 800);
    }, 1400);
  };

  const resetLoginForm = () => {
    setLoginStep('form');
    setLoginMessage('');
    setUsername('');
    setPassword('');
  };

  const handleAddHistoryItem = (
    type: AssessmentType,
    score: number,
    interpretation: string,
    label: 'Selesai' | 'Perhatian' | 'Aman',
  ) => {
    const formattedDate = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const nameMap: Record<AssessmentType, string> = {
      gad7: 'Asesmen Kecemasan (GAD-7)',
      phq9: 'Asesmen Depresi (PHQ-9)',
      srq20: 'Skrining Umum (SRQ-20)',
    };
    const newItem: HistoryItem = {
      id: `${type}-${Date.now()}`,
      assessmentName: nameMap[type],
      date: formattedDate,
      status: label,
      score,
      interpretation,
    };
    setHistory((prev) => [newItem, ...prev]);
    if (session) {
      storage.addHistory(session.nim, newItem);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCounselorSubmitted(true);
  };

  const resetCounselorForm = () => {
    setIsCounselorModalOpen(false);
    setCounselorSubmitted(false);
    setFormData({
      nim: session?.nim ?? '',
      kategori: 'Kecemasan Akademik',
      tanggal: '2026-06-25',
      sesi: '09:00 - 10:30 WIB',
      catatan: '',
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 selection:bg-teal-700/10 selection:text-teal-900">
      <div
        className={`transition-all duration-300 ease-in-out transform ${
          fadeState === 'in' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
      >
        {view === 'landing' && (
          <LandingView
            onSetView={changeView}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            onTriggerLogin={() => {
              setLoginMode('mahasiswa');
              setIsLoginModalOpen(true);
            }}
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
          <KonselorView onSetView={changeView} onLogout={handleLogout} />
        )}
      </div>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl w-full max-w-[420px] shadow-2xl overflow-hidden">
            {loginStep === 'form' && (
              <>
                <button
                  onClick={() => {
                    setIsLoginModalOpen(false);
                    resetLoginForm();
                  }}
                  className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 p-1.5 hover:bg-stone-100 rounded-lg transition-colors z-10"
                >
                  <CloseIcon size={18} />
                </button>

                <div className="pt-8 pb-2 px-8 text-center">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg ${
                      loginMode === 'konselor'
                        ? 'bg-amber-600 shadow-amber-600/20'
                        : 'bg-teal-700 shadow-teal-700/20'
                    }`}
                  >
                    {loginMode === 'konselor' ? (
                      <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    )}
                  </div>
                  <h2 className="font-display font-bold text-xl text-stone-900 mb-1">
                    {loginMode === 'konselor' ? 'Login Konselor' : 'Masuk ke SIGAP UB'}
                  </h2>
                  <p className="text-sm text-stone-500">
                    {loginMode === 'konselor'
                      ? 'Gunakan akun konselor untuk akses panel triase'
                      : 'Gunakan akun SIAM untuk mengakses asesmen'}
                  </p>
                </div>

                {/* Mode toggle tabs */}
                <div className="flex mx-8 mt-5 bg-stone-100 rounded-xl p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode('mahasiswa');
                      setUsername('');
                      setPassword('');
                    }}
                    className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${
                      loginMode === 'mahasiswa'
                        ? 'bg-white text-teal-700 shadow-sm'
                        : 'text-stone-500 hover:text-stone-700'
                    }`}
                  >
                    Mahasiswa
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode('konselor');
                      setUsername('');
                      setPassword('');
                    }}
                    className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${
                      loginMode === 'konselor'
                        ? 'bg-white text-amber-700 shadow-sm'
                        : 'text-stone-500 hover:text-stone-700'
                    }`}
                  >
                    Konselor
                  </button>
                </div>

                <form onSubmit={handleLoginSubmit} className="px-8 pt-5 pb-8 flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      {loginMode === 'konselor' ? 'Email Konselor' : 'Email UB / NIM'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={loginMode === 'konselor' ? 'konselor@ub.ac.id' : 'email@student.ub.ac.id atau NIM'}
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

                  {loginMode === 'mahasiswa' && (
                    <div className="flex items-center justify-between text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer text-stone-500">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded border-stone-300 text-teal-700 focus:ring-teal-700/20"
                        />
                        Ingat saya
                      </label>
                      <a
                        href="https://siam.ub.ac.id"
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-700 hover:underline font-medium"
                      >
                        Lupa sandi?
                      </a>
                    </div>
                  )}

                  <button
                    type="submit"
                    className={`w-full font-semibold text-sm py-2.5 px-4 rounded-xl active:scale-[0.98] transition-all mt-1 text-white ${
                      loginMode === 'konselor'
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : 'bg-teal-700 hover:bg-teal-800'
                    }`}
                  >
                    {loginMode === 'konselor' ? 'Masuk sebagai Konselor' : 'Masuk'}
                  </button>

                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 mt-1">
                    <p className="text-[11px] text-stone-400 text-center leading-relaxed">
                      {loginMode === 'konselor' ? (
                        <>Demo: <span className="font-mono text-stone-600">konselor@ub.ac.id</span> / <span className="font-mono text-stone-600">SIGAP-UB123</span></>
                      ) : (
                        <>Demo: <span className="font-mono text-stone-600">arva@student.ub.ac.id</span> / <span className="font-mono text-stone-600">SIGAP-UB123</span></>
                      )}
                    </p>
                  </div>
                </form>
              </>
            )}

            {loginStep === 'loading' && (
              <div className="py-16 px-8 text-center flex flex-col items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full border-[3px] border-stone-200 animate-spin ${
                    loginMode === 'konselor' ? 'border-t-amber-600' : 'border-t-teal-700'
                  }`}
                />
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
                <p className="text-sm text-stone-500">
                  {session?.role === 'konselor' ? 'Mengalihkan ke panel konselor...' : 'Mengalihkan ke dashboard...'}
                </p>
              </div>
            )}

            {loginStep === 'error' && (
              <div className="py-16 px-8 text-center flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <h3 className="font-semibold text-base text-stone-900">Login Gagal</h3>
                <p className="text-sm text-stone-500 max-w-[280px]">{loginMessage}</p>
                <button
                  onClick={resetLoginForm}
                  className="mt-2 text-teal-700 font-semibold text-sm hover:underline"
                >
                  Coba lagi
                </button>
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
                onClick={resetCounselorForm}
                className="text-stone-400 hover:text-stone-600 p-1.5 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            {!counselorSubmitted ? (
              <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-5">
                <div className="bg-teal-50 border border-teal-100 p-3.5 rounded-xl flex gap-3 text-sm text-teal-800">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                  <p>
                    Layanan konseling SIGAP UB bersifat <strong>rahasia &amp; gratis</strong> untuk mahasiswa UB aktif.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Nama</label>
                    <input
                      type="text"
                      value={session?.nama ?? 'Mahasiswa UB'}
                      disabled
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">NIM</label>
                    <input
                      type="text"
                      value={session?.nim ?? formData.nim}
                      disabled
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Kategori Hambatan</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData((prev) => ({ ...prev, kategori: e.target.value }))}
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
                      min="2026-06-12"
                      onChange={(e) => setFormData((prev) => ({ ...prev, tanggal: e.target.value }))}
                      required
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 hover:border-stone-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Sesi</label>
                    <select
                      value={formData.sesi}
                      onChange={(e) => setFormData((prev) => ({ ...prev, sesi: e.target.value }))}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 hover:border-stone-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 focus:outline-none cursor-pointer transition-colors"
                    >
                      <option value="09:00 - 10:30 WIB">Pagi (09:00 - 10:30)</option>
                      <option value="11:00 - 12:30 WIB">Siang (11:00 - 12:30)</option>
                      <option value="13:30 - 15:00 WIB">Sore (13:30 - 15:00)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Catatan <span className="text-stone-400 font-normal">(opsional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan keluhan atau harapan Anda..."
                    value={formData.catatan}
                    onChange={(e) => setFormData((prev) => ({ ...prev, catatan: e.target.value }))}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 hover:border-stone-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 focus:outline-none placeholder-stone-400 transition-colors"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={resetCounselorForm}
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
                  Janji temu <strong>{formData.kategori}</strong> pada{' '}
                  <strong>
                    {formData.tanggal} ({formData.sesi})
                  </strong>{' '}
                  telah dicatat. Konselor akan menghubungi via email/WhatsApp.
                </p>
                <button
                  onClick={resetCounselorForm}
                  className="bg-teal-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-teal-800 active:scale-[0.98] transition-all"
                >
                  Selesai
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
