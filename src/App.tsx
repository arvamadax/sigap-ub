import React, { useState } from 'react';
import { ViewType, HistoryItem, AssessmentType } from './types';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { AssessmentView } from './components/AssessmentView';
import { CloseIcon, VerifiedUserIcon } from './components/Icons';
import { Toast, ToastType } from './components/Toast';

export default function App() {
  const [view, setView] = useState<ViewType>('landing');
  const [activeAssessment, setActiveAssessment] = useState<AssessmentType>('gad7');
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');
  
  // State for SIAM UB Authentication
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loginStep, setLoginStep] = useState<'form' | 'loading' | 'success'>('form');
  const [loginMessage, setLoginMessage] = useState<string>('');
  const [username, setUsername] = useState<string>('mahasiswa@student.ub.ac.id');
  const [password, setPassword] = useState<string>('');

  // In-app toast notifications (replaces native alert())
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Set initial simulated history matching mockup specifications exactly
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

  // Counseling Consultation Form States
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
    // Access control check: If guest tries to access dashboard or assessment, trigger SSO Login Modal
    if (!isLoggedIn && (nextView === 'dashboard' || nextView === 'assessment')) {
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
      setLoginMessage('Mengautentikasi akun & sinkronisasi NIM 21500010023...');
    }, 800);

    setTimeout(() => {
      setLoginMessage('Login Berhasil! Mengalihkan ke dashboard...');
      setLoginStep('success');
    }, 1600);

    setTimeout(() => {
      setIsLoggedIn(true);
      setIsLoginModalOpen(false);
      setLoginStep('form');
      
      // Navigate to dashboard
      setFadeState('out');
      setTimeout(() => {
        setView('dashboard');
        setFadeState('in');
      }, 200);
    }, 2400);
  };

  // Dynamic state handler for finished assessments 
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
    <div className="min-h-screen bg-[#FDFBF7] selection:bg-[#006565]/10 selection:text-[#006565]">
      {/* Dynamic View Dispatcher with smooth CSS Transition wrapper */}
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
      </div>

      {/* SSO SIAM UB Login Modal Overlay */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-[#081b3a]/75 backdrop-blur-sm z-[110] flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white rounded-2xl w-full max-w-md border border-[#bdc9c8]/40 shadow-2xl overflow-hidden transition-all duration-300 scale-100 animate-in fade-in zoom-in-95 duration-150 text-left">
            
            {/* Modal Header */}
            <div className="flex bg-[#081b3a] text-white justify-between items-center px-6 py-4.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛡️</span>
                <h3 className="font-bold text-base md:text-lg tracking-tight">
                  Single Sign-On SIAM UB
                </h3>
              </div>
              {loginStep === 'form' && (
                <button 
                  onClick={() => setIsLoginModalOpen(false)}
                  className="text-gray-300 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer active:scale-90"
                >
                  <CloseIcon size={20} />
                </button>
              )}
            </div>

            {/* Modal Body */}
            {loginStep === 'form' && (
              <form onSubmit={handleSiamLoginSubmit} className="p-6 flex flex-col gap-4.5">
                <div className="bg-[#f0f9ff] border border-blue-100 p-4 rounded-xl flex gap-3 text-xs md:text-sm text-blue-800">
                  <span>💡</span>
                  <p>
                    Silakan masuk menggunakan akun <strong>SIAM UB</strong> (Sistem Informasi Akademik Mahasiswa) Anda untuk mengakses dasbor asesmen psikologis.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6e7979] uppercase tracking-wider mb-1">
                    Email UB / Username SIAM
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="mahasiswa@student.ub.ac.id"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white text-[#1b1c1a] text-xs md:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 hover:border-[#006565] focus:border-[#006565] focus:outline-none focus:ring-2 focus:ring-[#006565]/10 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6e7979] uppercase tracking-wider mb-1">
                    Kata Sandi (Password)
                  </label>
                  <input 
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white text-[#1b1c1a] text-xs md:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 hover:border-[#006565] focus:border-[#006565] focus:outline-none focus:ring-2 focus:ring-[#006565]/10 font-mono"
                  />
                </div>

                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 font-semibold">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#006565] focus:ring-[#006565]/20 cursor-pointer" />
                    Ingat Saya
                  </label>
                  <a href="https://siam.ub.ac.id" target="_blank" rel="noreferrer" className="text-[#0D9488] hover:underline">Lupa Sandi?</a>
                </div>

                <div className="flex gap-3 justify-end mt-2 pt-4 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setIsLoginModalOpen(false)}
                    className="text-gray-500 hover:bg-gray-100 hover:text-gray-800 font-bold text-xs md:text-sm px-4.5 py-2.5 rounded-xl transition-all duration-150 cursor-pointer active:scale-95"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="bg-[#0D9488] hover:bg-[#0F766E] hover:scale-[1.02] text-white font-bold text-xs md:text-sm px-6 py-2.5 rounded-xl transition-all duration-150 shadow-sm active:scale-95"
                  >
                    Login via SIAM
                  </button>
                </div>
              </form>
            )}

            {/* Authenticating Simulation Loading */}
            {loginStep === 'loading' && (
              <div className="p-10 text-center flex flex-col items-center gap-4 animate-in fade-in duration-200">
                <div className="w-12 h-12 rounded-full border-4 border-[#0D9488]/20 border-t-[#0D9488] animate-spin"></div>
                <h4 className="font-bold text-base text-[#081b3a]">Autentikasi SSO</h4>
                <p className="text-xs text-slate-500 font-semibold max-w-xs">{loginMessage}</p>
              </div>
            )}

            {/* Success Simulator Screen */}
            {loginStep === 'success' && (
              <div className="p-10 text-center flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center">
                  <VerifiedUserIcon size={30} />
                </div>
                <h4 className="font-bold text-base text-emerald-800">Login Berhasil!</h4>
                <p className="text-xs text-slate-500 font-semibold">{loginMessage}</p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Counseling Reservation Dialog Modal Overlay */}
      {isCounselorModalOpen && (
        <div className="fixed inset-0 bg-[#081b3a]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white rounded-2xl w-full max-w-lg border border-[#bdc9c8]/40 shadow-2xl overflow-hidden transition-all duration-300 scale-100 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex bg-[#081b3a] text-white justify-between items-center px-6 py-4">
              <h3 className="font-bold text-base md:text-lg tracking-tight">
                Permohonan Janji Temu Konseling
              </h3>
              <button 
                onClick={resetForm}
                className="text-gray-300 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer active:scale-90"
              >
                <CloseIcon size={20} />
              </button>
            </div>

            {/* Modal Contents */}
            {!counselorSubmitted ? (
              <form onSubmit={handleFormSubmit} className="p-6 md:p-8 flex flex-col gap-5 text-left">
                
                {/* Introduction info */}
                <div className="bg-[#f5f3ef] border border-gray-100 p-4 rounded-xl flex gap-3 text-xs md:text-sm text-[#3e4949]">
                  <span>💡</span>
                  <p>
                    Layanan konseling SIGAP UB bersifat <strong>rahasia &amp; gratis</strong> bagi mahasiswa aktif Universitas Brawijaya yang terhubung SIAM.
                  </p>
                </div>

                {/* Patient static details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#6e7979] uppercase tracking-wider mb-1">
                      Nama Mahasiswa
                    </label>
                    <input 
                      type="text" 
                      value="Mahasiswa UB Brawijaya" 
                      disabled 
                      className="w-full bg-[#efeeea]/60 text-[#1b1c1a]/70 text-xs md:text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 cursor-not-allowed font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6e7979] uppercase tracking-wider mb-1">
                      NIM (Nomor Induk)
                    </label>
                    <input 
                      type="text" 
                      value={formData.nim}
                      onChange={(e) => setFormData(prev => ({ ...prev, nim: e.target.value }))}
                      required
                      className="w-full bg-white text-[#1b1c1a] text-xs md:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 hover:border-[#006565] focus:border-[#006565] focus:outline-none focus:ring-2 focus:ring-[#006565]/10 font-medium"
                    />
                  </div>
                </div>

                {/* Problem category dropdown */}
                <div>
                  <label className="block text-xs font-bold text-[#6e7979] uppercase tracking-wider mb-1">
                    Kategori Hambatan Psikologis
                  </label>
                  <select 
                    value={formData.kategori}
                    onChange={(e) => setFormData(prev => ({ ...prev, kategori: e.target.value }))}
                    className="w-full bg-white text-[#1b1c1a] text-xs md:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#006565] focus:outline-none focus:ring-2 focus:ring-[#006565]/10 font-semibold cursor-pointer"
                  >
                    <option value="Kecemasan Akademik">Kecemasan Akademik (Stres / Ujian / Tugas)</option>
                    <option value="Stres Skripsi / Tugas Akhir">Stres Skripsi / Tugas Akhir</option>
                    <option value="Hambatan Sosial / Relasi Pertemanan">Hambatan Sosial / Relasi Pertemanan</option>
                    <option value="Depresi / Kesedihan Mendalam">Depresi / Kesedihan Mendalam</option>
                    <option value="Kecanduan / Burnout Gadget">Kecanduan / Burnout Gadget</option>
                    <option value="Lainnya">Kondisi Lainnya</option>
                  </select>
                </div>

                {/* Scheduling selection slot */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#6e7979] uppercase tracking-wider mb-1">
                      Tanggal Konseling
                    </label>
                    <input 
                      type="date" 
                      value={formData.tanggal}
                      min="2026-05-22"
                      onChange={(e) => setFormData(prev => ({ ...prev, tanggal: e.target.value }))}
                      required
                      className="w-full bg-white text-[#1b1c1a] text-xs md:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#006565] focus:outline-none focus:ring-2 focus:ring-[#006565]/10 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6e7979] uppercase tracking-wider mb-1">
                      Pilihan Sesi / Jam
                    </label>
                    <select 
                      value={formData.sesi}
                      onChange={(e) => setFormData(prev => ({ ...prev, sesi: e.target.value }))}
                      className="w-full bg-white text-[#1b1c1a] text-xs md:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#006565] focus:outline-none focus:ring-2 focus:ring-[#006565]/10 font-semibold cursor-pointer"
                    >
                      <option value="09:00 - 10:30 WIB">Sesi Pagi (09:00 - 10:30 WIB)</option>
                      <option value="11:00 - 12:30 WIB">Sesi Siang (11:00 - 12:30 WIB)</option>
                      <option value="13:30 - 15:00 WIB">Sesi Sore (13:30 - 15:00 WIB)</option>
                    </select>
                  </div>
                </div>

                {/* Personal client text notes */}
                <div>
                  <label className="block text-xs font-bold text-[#6e7979] uppercase tracking-wider mb-1">
                    Catatan keluhan tambahan (Opsional)
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="Tuliskan secara singkat keluhan atau harapan Anda..."
                    value={formData.catatan}
                    onChange={(e) => setFormData(prev => ({ ...prev, catatan: e.target.value }))}
                    className="w-full bg-white text-[#1b1c1a] text-xs md:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#006565] focus:outline-none focus:ring-2 focus:ring-[#006565]/10 placeholder-gray-400"
                  ></textarea>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 justify-end mt-2 pt-4 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className="text-gray-500 hover:bg-gray-100 hover:text-gray-800 font-bold text-xs md:text-sm px-4.5 py-2.5 rounded-xl transition-all duration-150 cursor-pointer active:scale-95"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="bg-[#006565] hover:bg-[#008080] hover:scale-[1.02] text-white font-bold text-xs md:text-sm px-6 py-2.5 rounded-xl transition-all duration-150 shadow-sm active:scale-95"
                  >
                    Kirim Permohonan
                  </button>
                </div>

              </form>
            ) : (
              // Booking Confirmed Visual Screen
              <div className="p-8 md:p-12 text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mb-4">
                  <VerifiedUserIcon size={30} />
                </div>
                
                <h4 className="font-bold text-lg text-[#081b3a] mb-2">
                  Permohonan Berhasil Dikirim!
                </h4>
                
                <p className="text-xs md:text-sm text-[#3e4949] leading-relaxed mb-6 max-w-sm">
                  Permohonan janji temu konseling Anda dengan kategori <strong>{formData.kategori}</strong> pada tanggal <strong>{formData.tanggal} ({formData.sesi})</strong> telah dicatat secara aman. Konselor kami akan memverifikasi permohonan Anda via email atau WhatsApp terdaftar.
                </p>

                <button 
                  onClick={resetForm}
                  className="bg-[#006565] text-white font-bold text-sm px-6 py-2.5 rounded-lg hover:bg-[#008080] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  Selesai &amp; Kembali
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Global Toast Notification */}
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
