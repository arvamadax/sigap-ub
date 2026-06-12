import React, { useState } from 'react';
import { ViewType } from '../types';
import {
  ArrowRightIcon,
  CloseIcon,
  MenuIcon
} from './Icons';

interface LandingViewProps {
  onSetView: (view: ViewType) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  onTriggerLogin: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onSetView,
  isLoggedIn,
  onLogout,
  onTriggerLogin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const handleStartAction = () => {
    if (isLoggedIn) {
      onSetView('dashboard');
    } else {
      onTriggerLogin();
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col relative">
      {/* Background Decorators */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[50%] bg-teal-700/5 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[40%] bg-amber-400/5 rounded-full filter blur-[80px]"></div>
      </div>

      {/* TopNavBar */}
      <nav className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-stone-200 transition-all duration-300">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex justify-between items-center h-[60px]">
          <div className="flex items-center gap-2.5 cursor-pointer transition-transform hover:scale-105 active:scale-95">
            <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center shadow-md shadow-teal-700/20">
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight">SIGAP <span className="text-teal-700">UB</span></span>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-emerald-700">SIAM UB Terhubung</span>
            </div>
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => onSetView('dashboard')}
                  className="text-teal-700 font-semibold text-sm hover:underline active:scale-95 transition-all px-3 py-2"
                >
                  Ke Dasbor
                </button>
                <button
                  onClick={onLogout}
                  className="bg-red-50 text-red-600 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-red-100 active:scale-95 transition-all border border-red-200"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onTriggerLogin}
                  className="text-stone-600 font-medium text-sm hover:text-stone-900 px-3 py-2 rounded-lg hover:bg-stone-100 active:scale-95 transition-all"
                >
                  Masuk
                </button>
                <button
                  onClick={onTriggerLogin}
                  className="bg-teal-700 text-white font-semibold text-sm px-5 py-2 rounded-xl hover:bg-teal-800 active:scale-95 transition-all shadow-md shadow-teal-700/20"
                >
                  SSO Login
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-stone-600 hover:text-teal-700 p-2.5 hover:bg-stone-100 rounded-lg transition-all active:scale-90"
          >
            {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-stone-200 px-6 py-4 flex flex-col gap-3 shadow-lg absolute w-full z-50">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => { onSetView('dashboard'); setMobileMenuOpen(false); }}
                  className="w-full text-center py-2.5 bg-teal-50 text-teal-700 font-semibold text-sm rounded-xl hover:bg-teal-100 transition-all"
                >
                  Ke Dasbor
                </button>
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="w-full text-center py-2.5 bg-red-50 text-red-600 font-semibold text-sm rounded-xl hover:bg-red-100 transition-all border border-red-100"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { onTriggerLogin(); setMobileMenuOpen(false); }}
                  className="w-full text-center py-2.5 text-stone-700 font-medium text-sm hover:bg-stone-50 rounded-xl transition-all"
                >
                  Masuk
                </button>
                <button
                  onClick={() => { onTriggerLogin(); setMobileMenuOpen(false); }}
                  className="w-full text-center py-2.5 bg-teal-700 text-white font-semibold text-sm rounded-xl hover:bg-teal-800 transition-all"
                >
                  SSO Login UB
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow relative z-10 w-full overflow-y-auto">

        {/* SECTION 1 — Hero */}
        <section className="relative w-full min-h-screen bg-stone-900 flex flex-col items-center justify-center px-6 pb-20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[600px] h-[350px] bg-teal-700/10 rounded-full filter blur-[120px]" />
          </div>

          <div className="relative z-10 text-center mb-4 mt-[-40px]">
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-[3.5rem] text-white leading-tight tracking-tight max-w-2xl mx-auto">
              Kamu berhak merasa<br />baik-baik saja.
            </h1>
          </div>

          <div className="relative z-10 text-center mb-10 md:mb-14">
            <p className="text-white/60 text-base md:text-lg font-sans font-normal">
              Pilih asesmen yang sesuai dengan kondisimu sekarang.
            </p>
          </div>

          {/* 3 Assessment Cards */}
          <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            <button
              onClick={handleStartAction}
              className="group relative bg-teal-700 rounded-2xl p-7 text-left overflow-hidden hover:bg-teal-800 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 cursor-pointer min-h-[220px] md:min-h-[260px]"
            >
              <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-2 leading-tight">PHQ-9</h3>
              <div className="flex items-center gap-2 text-white/80 text-sm font-semibold group-hover:text-white group-hover:gap-3 transition-all duration-200">
                <span>Skrining Depresi</span>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-white/40 text-white/70 text-xs group-hover:border-white group-hover:text-white transition-all">&rarr;</span>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors duration-300" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors duration-300" />
              <div className="absolute bottom-5 left-7">
                <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">9 pertanyaan &middot; ~3 menit</span>
              </div>
            </button>

            <button
              onClick={handleStartAction}
              className="group relative bg-teal-800 rounded-2xl p-7 text-left overflow-hidden hover:brightness-110 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 cursor-pointer min-h-[220px] md:min-h-[260px]"
            >
              <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-2 leading-tight">GAD-7</h3>
              <div className="flex items-center gap-2 text-white/80 text-sm font-semibold group-hover:text-white group-hover:gap-3 transition-all duration-200">
                <span>Skrining Kecemasan</span>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-white/40 text-white/70 text-xs group-hover:border-white group-hover:text-white transition-all">&rarr;</span>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors duration-300" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors duration-300" />
              <div className="absolute bottom-5 left-7">
                <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">7 pertanyaan &middot; ~2 menit</span>
              </div>
            </button>

            <button
              onClick={handleStartAction}
              className="group relative bg-stone-800 rounded-2xl p-7 text-left overflow-hidden hover:brightness-125 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 cursor-pointer min-h-[220px] md:min-h-[260px] border border-white/10"
            >
              <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-2 leading-tight">SRQ-20</h3>
              <div className="flex items-center gap-2 text-white/80 text-sm font-semibold group-hover:text-white group-hover:gap-3 transition-all duration-200">
                <span>Skrining Umum WHO</span>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-white/40 text-white/70 text-xs group-hover:border-white group-hover:text-white transition-all">&rarr;</span>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-teal-700/10 group-hover:bg-teal-700/20 transition-colors duration-300" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-teal-700/10 group-hover:bg-teal-700/20 transition-colors duration-300" />
              <div className="absolute bottom-5 left-7">
                <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">20 pertanyaan &middot; ~5 menit</span>
              </div>
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-10">
            <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-14 md:h-20">
              <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#FAFAF9" />
            </svg>
          </div>

          <div className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 z-20 text-white/30 animate-bounce">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </section>

        {/* SECTION 2 — Social Proof */}
        <section className="w-full bg-white/60 backdrop-blur-sm border-y border-stone-200 py-10">
          <div className="text-center mb-8 px-6">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em]">
              Didukung oleh ekosistem Universitas Brawijaya
            </p>
          </div>

          <div className="w-full overflow-hidden">
            <div className="animate-marquee items-center">
              {Array.from({ length: 6 }).flatMap((_, gi) =>
                [
                  { src: '/logos/logo-ub.png', alt: 'Universitas Brawijaya' },
                  { src: '/logos/logo-tekra.png', alt: 'TEKRA' },
                  { src: '/logos/logo-klinikub.png', alt: 'KlinikUB' },
                  { src: '/logos/logo-jmub.png', alt: 'JMUB' },
                ].map((logo, i) => (
                  <div key={`${gi}-${i}`} className="flex items-center justify-center shrink-0 mx-12 w-32 h-12">
                    <img src={logo.src} alt={logo.alt} className="max-w-full max-h-full object-contain opacity-40 grayscale" />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-stone-200 text-center px-6">
            <h2 className="font-display font-extrabold text-2xl md:text-4xl text-stone-900 mb-3">
              Satu platform. Semua bentuk dukungan.
            </h2>
            <p className="text-stone-500 text-sm md:text-base max-w-xl mx-auto">
              Dari skrining mandiri hingga sesi tatap muka dengan konselor, SIGAP UB hadir
              di setiap langkah perjalananmu.
            </p>
          </div>
        </section>

        {/* SECTION 3 — Feature Cards */}
        <section className="w-full py-16 px-6 bg-stone-50">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-8 border border-stone-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-widest mb-3 block">Mulai dari sini</span>
                <h3 className="font-bold text-xl text-stone-900 mb-3">Asesmen Psikologis Klinis</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-6">
                  Isi kuesioner PHQ-9, GAD-7, atau SRQ-20 dalam 5 menit. Terstandar WHO, bukan AI generatif.
                </p>
                <div className="w-full h-36 bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-2xl flex items-center justify-center">
                  <svg viewBox="0 0 48 48" className="w-16 h-16 text-teal-700/30" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="10" y="6" width="28" height="36" rx="3" />
                    <path d="M18 6V3a1 1 0 011-1h10a1 1 0 011 1v3" />
                    <path d="M17 18h14M17 24h14M17 30h8" />
                  </svg>
                </div>
              </div>

              <div className="bg-stone-900 rounded-2xl p-8 border border-transparent hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3 block">Hasil instan</span>
                <h3 className="font-bold text-xl text-white mb-3">Evaluasi &amp; Triase Otomatis</h3>
                <p className="text-stone-400 text-sm leading-relaxed mb-6">
                  Skor dihitung langsung. Sistem klasifikasi berbasis threshold klinis yang bisa diaudit oleh psikolog.
                </p>
                <div className="w-full h-36 bg-white/5 rounded-2xl flex items-center justify-center">
                  <svg viewBox="0 0 48 48" className="w-16 h-16 text-teal-400/40" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="4" y="4" width="40" height="40" rx="4" />
                    <path d="M12 32l8-12 6 8 10-16" />
                  </svg>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-stone-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-widest mb-3 block">Butuh bicara?</span>
                <h3 className="font-bold text-xl text-stone-900 mb-3">Konseling Gratis &amp; Rahasia</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-6">
                  Jadwalkan sesi dengan psikolog UB. Slot diprioritaskan untuk mahasiswa dengan risiko tinggi/kritis.
                </p>
                <div className="w-full h-36 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl flex items-center justify-center">
                  <svg viewBox="0 0 48 48" className="w-16 h-16 text-amber-500/30" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8 36V16a4 4 0 014-4h24a4 4 0 014 4v12a4 4 0 01-4 4H16l-8 8v-4z" />
                    <path d="M18 20h12M18 26h8" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 — Alur Penggunaan */}
        <section className="w-full py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-xs font-bold text-teal-700 uppercase tracking-[0.2em] mb-4">Cara kerja</p>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-stone-900 mb-12 tracking-tight">
              Alur Penggunaan Platform
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              <div className="hidden md:block absolute top-10 left-12 right-12 h-0.5 bg-stone-200 z-0"></div>

              {[
                { num: '1', title: 'SSO Login', desc: 'Gunakan akun email UB Anda untuk login secara aman.' },
                { num: '2', title: 'Isi Asesmen', desc: 'Pilih kuesioner yang sesuai dan jawab jujur dalam 5 menit.' },
                { num: '3', title: 'Evaluasi Skor', desc: 'Dapatkan analisis instan dan rekomendasi tindak lanjut.' },
                { num: '4', title: 'Konseling Gratis', desc: 'Jadwalkan sesi rahasia dengan psikolog jika diperlukan.' },
              ].map((step) => (
                <div key={step.num} className="flex flex-col items-center text-center relative z-10 group">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-2xl font-black text-teal-700 mb-5 group-hover:-translate-y-2 group-hover:shadow-md group-hover:border-teal-300 transition-all duration-300">
                    {step.num}
                  </div>
                  <h4 className="font-bold text-base text-stone-900 mb-2">{step.title}</h4>
                  <p className="text-sm text-stone-500 px-2 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <button
                onClick={handleStartAction}
                className="bg-stone-900 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-stone-800 active:scale-95 transition-all duration-200 shadow-xl flex items-center justify-center gap-2"
              >
                Paham, Mulai Sekarang
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
