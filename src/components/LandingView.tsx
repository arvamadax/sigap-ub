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
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E293B] font-sans flex flex-col relative">
      {/* Background Decorators */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[50%] bg-[#0D9488]/5 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[40%] bg-amber-400/5 rounded-full filter blur-[80px]"></div>
      </div>

      {/* TopNavBar */}
      <nav className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-[#F0EBE2] shadow-sm transition-all duration-300">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex justify-between items-center h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95 duration-150">
            <div className="w-8 h-8 bg-[#0D9488] rounded-lg flex items-center justify-center shadow-md shadow-[#0D9488]/20">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-[#1E293B]">SIGAP <span className="text-[#0D9488]">UB</span></span>
          </div>

          {/* Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#F0FDF4] px-3 py-1 rounded-full border border-[#DCFCE7] shadow-sm">
              <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-[#166534]">SIAM UB Terhubung</span>
            </div>
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => onSetView('dashboard')}
                  className="text-[#0D9488] font-bold text-sm hover:underline cursor-pointer active:scale-95 duration-150"
                >
                  Ke Dasbor
                </button>
                <button
                  onClick={onLogout}
                  className="bg-rose-50 text-rose-600 font-semibold text-xs px-4 py-2 rounded-xl hover:bg-rose-100 active:scale-95 transition-all cursor-pointer duration-150 border border-rose-200"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onTriggerLogin}
                  className="text-[#1E293B] font-semibold text-sm hover:text-[#0D9488] hover:scale-105 active:scale-95 transition-all px-3 py-2 cursor-pointer duration-150"
                >
                  Masuk
                </button>
                <button
                  onClick={onTriggerLogin}
                  className="bg-[#0D9488] text-white font-semibold text-sm px-5 py-2 rounded-xl hover:bg-[#0F766E] hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-[#0D9488]/20 cursor-pointer duration-150"
                >
                  SSO Login
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-600 hover:text-[#0D9488] p-2 hover:bg-[#FDFBF7] rounded-lg transition-all active:scale-90"
          >
            {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown — auth buttons only */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-[#F0EBE2] px-6 py-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl absolute w-full z-50">
            <div className="flex flex-col gap-2.5">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => { onSetView('dashboard'); setMobileMenuOpen(false); }}
                    className="w-full text-center py-2 bg-teal-50 text-[#0D9488] font-semibold text-sm rounded-xl hover:bg-teal-100 transition-all cursor-pointer"
                  >
                    Ke Dasbor
                  </button>
                  <button
                    onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                    className="w-full text-center py-2 bg-rose-50 text-rose-600 font-semibold text-sm rounded-xl hover:bg-rose-100 transition-all cursor-pointer border border-rose-100"
                  >
                    Keluar / Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { onTriggerLogin(); setMobileMenuOpen(false); }}
                    className="w-full text-center py-2 text-[#1E293B] font-semibold text-sm hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                  >
                    Masuk
                  </button>
                  <button
                    onClick={() => { onTriggerLogin(); setMobileMenuOpen(false); }}
                    className="w-full text-center py-2.5 bg-[#0D9488] text-white font-semibold text-sm rounded-xl hover:bg-[#0F766E] transition-all shadow-sm cursor-pointer"
                  >
                    SSO Login UB
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content — Scrollable Sections */}
      <main className="flex-grow relative z-10 w-full overflow-y-auto">

        {/* SECTION 1 — Hero (BetterHelp pattern, dark slate bg) */}
        <section className="relative w-full min-h-screen bg-[#1E293B] flex flex-col items-center justify-center px-6 pb-20 overflow-hidden">

          {/* Subtle teal glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[600px] h-[350px] bg-[#0D9488]/10 rounded-full filter blur-[120px]" />
          </div>

          {/* Headline */}
          <div className="relative z-10 text-center mb-4 mt-[-40px]">
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-[3.5rem] text-white leading-tight tracking-tight max-w-2xl mx-auto">
              Kamu berhak merasa<br />baik-baik saja.
            </h1>
          </div>

          {/* Subheadline */}
          <div className="relative z-10 text-center mb-10 md:mb-14">
            <p className="text-white/60 text-base md:text-lg font-sans font-normal">
              Pilih asesmen yang sesuai dengan kondisimu sekarang.
            </p>
          </div>

          {/* 3 Assessment Cards */}
          <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">

            {/* Card 1 — PHQ-9 */}
            <button
              onClick={handleStartAction}
              className="group relative bg-[#0D9488] rounded-2xl p-7 text-left overflow-hidden
                         hover:bg-[#0F766E] hover:-translate-y-1 active:scale-[0.98]
                         transition-all duration-300 cursor-pointer min-h-[220px] md:min-h-[260px]"
            >
              <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-2 leading-tight">
                PHQ-9
              </h3>
              <div className="flex items-center gap-2 text-white/80 text-sm font-sans font-semibold
                              group-hover:text-white group-hover:gap-3 transition-all duration-200">
                <span>Skrining Depresi</span>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full
                                 border border-white/40 text-white/70 text-xs
                                 group-hover:border-white group-hover:text-white transition-all">
                  &rarr;
                </span>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/5
                              group-hover:bg-white/10 transition-colors duration-300" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/5
                              group-hover:bg-white/10 transition-colors duration-300" />
              <div className="absolute bottom-5 left-7">
                <span className="text-[10px] font-sans font-bold text-white/40 uppercase tracking-widest">
                  9 pertanyaan · ~3 menit
                </span>
              </div>
            </button>

            {/* Card 2 — GAD-7 */}
            <button
              onClick={handleStartAction}
              className="group relative bg-[#0F766E] rounded-2xl p-7 text-left overflow-hidden
                         hover:brightness-110 hover:-translate-y-1 active:scale-[0.98]
                         transition-all duration-300 cursor-pointer min-h-[220px] md:min-h-[260px]"
            >
              <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-2 leading-tight">
                GAD-7
              </h3>
              <div className="flex items-center gap-2 text-white/80 text-sm font-sans font-semibold
                              group-hover:text-white group-hover:gap-3 transition-all duration-200">
                <span>Skrining Kecemasan</span>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full
                                 border border-white/40 text-white/70 text-xs
                                 group-hover:border-white group-hover:text-white transition-all">
                  &rarr;
                </span>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/5
                              group-hover:bg-white/10 transition-colors duration-300" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/5
                              group-hover:bg-white/10 transition-colors duration-300" />
              <div className="absolute bottom-5 left-7">
                <span className="text-[10px] font-sans font-bold text-white/40 uppercase tracking-widest">
                  7 pertanyaan · ~2 menit
                </span>
              </div>
            </button>

            {/* Card 3 — SRQ-20 */}
            <button
              onClick={handleStartAction}
              className="group relative bg-[#081b3a] rounded-2xl p-7 text-left overflow-hidden
                         hover:brightness-125 hover:-translate-y-1 active:scale-[0.98]
                         transition-all duration-300 cursor-pointer min-h-[220px] md:min-h-[260px]
                         border border-white/10"
            >
              <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-2 leading-tight">
                SRQ-20
              </h3>
              <div className="flex items-center gap-2 text-white/80 text-sm font-sans font-semibold
                              group-hover:text-white group-hover:gap-3 transition-all duration-200">
                <span>Skrining Umum WHO</span>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full
                                 border border-white/40 text-white/70 text-xs
                                 group-hover:border-white group-hover:text-white transition-all">
                  &rarr;
                </span>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-[#0D9488]/10
                              group-hover:bg-[#0D9488]/20 transition-colors duration-300" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-[#0D9488]/10
                              group-hover:bg-[#0D9488]/20 transition-colors duration-300" />
              <div className="absolute bottom-5 left-7">
                <span className="text-[10px] font-sans font-bold text-white/40 uppercase tracking-widest">
                  20 pertanyaan · ~5 menit
                </span>
              </div>
            </button>

          </div>

          {/* Wave bottom — transition to next section */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <svg
              viewBox="0 0 1440 80"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              className="w-full h-14 md:h-20"
            >
              <path
                d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
                fill="#FDFBF7"
              />
            </svg>
          </div>

          {/* Scroll chevron */}
          <div className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 z-20
                          text-white/30 animate-bounce">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none"
                 stroke="currentColor" strokeWidth="2">
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </div>

        </section>

        {/* SECTION 2 — Social Proof with logo marquee */}
        <section className="w-full bg-white/60 backdrop-blur-sm border-y border-[#F0EBE2] py-10">
          <div className="text-center mb-8 px-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
              Didukung oleh ekosistem Universitas Brawijaya
            </p>
          </div>

          {/* Marquee container */}
          <div className="w-full overflow-hidden">
            <div className="animate-marquee items-center">
              {/* 6x repeat agar tidak habis di layar lebar manapun */}
              {Array.from({ length: 6 }).flatMap((_, gi) =>
                [
                  { src: '/logos/logo-ub.png',      alt: 'Universitas Brawijaya' },
                  { src: '/logos/logo-tekra.png',   alt: 'TEKRA' },
                  { src: '/logos/logo-klinikub.png', alt: 'KlinikUB' },
                  { src: '/logos/logo-jmub.png',    alt: 'JMUB' },
                ].map((logo, i) => (
                  <div key={`${gi}-${i}`} className="flex items-center justify-center shrink-0 mx-12 w-32 h-12">
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="max-w-full max-h-full object-contain opacity-40 grayscale"
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-[#F0EBE2] text-center px-6">
            <h2 className="font-display font-extrabold text-2xl md:text-4xl text-[#1E293B] mb-3">
              Satu platform. Semua bentuk dukungan.
            </h2>
            <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto">
              Dari skrining mandiri hingga sesi tatap muka dengan konselor, SIGAP UB hadir
              di setiap langkah perjalananmu.
            </p>
          </div>
        </section>

        {/* SECTION 3 — Feature Cards */}
        <section className="w-full py-16 px-6 bg-[#FDFBF7]">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Card 1 — Asesmen Klinis */}
              <div className="bg-white rounded-3xl p-8 border border-[#F0EBE2] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <span className="text-xs font-bold text-[#0D9488] uppercase tracking-widest mb-3 block">
                  Mulai dari sini
                </span>
                <h3 className="font-bold text-xl text-[#1E293B] mb-3">
                  Asesmen Psikologis Klinis
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Isi kuesioner PHQ-9, GAD-7, atau SRQ-20 dalam 5 menit. Terstandar WHO, bukan AI generatif.
                </p>
                <div className="w-full h-36 bg-gradient-to-br from-teal-50 to-[#0D9488]/10 rounded-2xl flex items-center justify-center">
                  <span className="text-5xl">📋</span>
                </div>
              </div>

              {/* Card 2 — Triase & Hasil */}
              <div className="bg-[#1E293B] rounded-3xl p-8 border border-transparent shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3 block">
                  Hasil instan
                </span>
                <h3 className="font-bold text-xl text-white mb-3">
                  Evaluasi & Triase Otomatis
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Skor dihitung langsung. Sistem klasifikasi berbasis threshold klinis yang bisa diaudit oleh psikolog.
                </p>
                <div className="w-full h-36 bg-white/5 rounded-2xl flex items-center justify-center">
                  <span className="text-5xl">📊</span>
                </div>
              </div>

              {/* Card 3 — Konseling */}
              <div className="bg-white rounded-3xl p-8 border border-[#F0EBE2] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <span className="text-xs font-bold text-[#0D9488] uppercase tracking-widest mb-3 block">
                  Butuh bicara?
                </span>
                <h3 className="font-bold text-xl text-[#1E293B] mb-3">
                  Konseling Gratis & Rahasia
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Jadwalkan sesi dengan psikolog UB. Slot diprioritaskan untuk mahasiswa dengan risiko tinggi/kritis.
                </p>
                <div className="w-full h-36 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl flex items-center justify-center">
                  <span className="text-5xl">💬</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 4 — Alur Penggunaan */}
        <section className="w-full py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-xs font-bold text-[#0D9488] uppercase tracking-[0.2em] text-center mb-4">
              Cara kerja
            </p>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[#1E293B] mb-12 tracking-tight text-center">
              Alur Penggunaan Platform
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-10 left-12 right-12 h-0.5 bg-slate-200/50 z-0"></div>

              <div className="flex flex-col items-center text-center relative z-10 group">
                <div className="w-20 h-20 rounded-2xl bg-white border border-[#F0EBE2] shadow-sm flex items-center justify-center text-2xl font-black text-[#0D9488] mb-5 group-hover:-translate-y-2 group-hover:shadow-md group-hover:border-[#0D9488]/30 transition-all duration-300">
                  1
                </div>
                <h4 className="font-bold text-base text-[#1E293B] mb-2">SSO Login</h4>
                <p className="text-sm text-slate-500 px-2 leading-relaxed">Gunakan akun email UB Anda untuk login secara aman.</p>
              </div>

              <div className="flex flex-col items-center text-center relative z-10 group">
                <div className="w-20 h-20 rounded-2xl bg-white border border-[#F0EBE2] shadow-sm flex items-center justify-center text-2xl font-black text-[#0D9488] mb-5 group-hover:-translate-y-2 group-hover:shadow-md group-hover:border-[#0D9488]/30 transition-all duration-300">
                  2
                </div>
                <h4 className="font-bold text-base text-[#1E293B] mb-2">Isi Asesmen</h4>
                <p className="text-sm text-slate-500 px-2 leading-relaxed">Pilih kuesioner yang sesuai dan jawab jujur dalam 5 menit.</p>
              </div>

              <div className="flex flex-col items-center text-center relative z-10 group">
                <div className="w-20 h-20 rounded-2xl bg-white border border-[#F0EBE2] shadow-sm flex items-center justify-center text-2xl font-black text-[#0D9488] mb-5 group-hover:-translate-y-2 group-hover:shadow-md group-hover:border-[#0D9488]/30 transition-all duration-300">
                  3
                </div>
                <h4 className="font-bold text-base text-[#1E293B] mb-2">Evaluasi Skor Klinis</h4>
                <p className="text-sm text-slate-500 px-2 leading-relaxed">Dapatkan analisis instan dan rekomendasi tindak lanjut.</p>
              </div>

              <div className="flex flex-col items-center text-center relative z-10 group">
                <div className="w-20 h-20 rounded-2xl bg-white border border-[#F0EBE2] shadow-sm flex items-center justify-center text-2xl font-black text-[#0D9488] mb-5 group-hover:-translate-y-2 group-hover:shadow-md group-hover:border-[#0D9488]/30 transition-all duration-300">
                  4
                </div>
                <h4 className="font-bold text-base text-[#1E293B] mb-2">Konseling Gratis</h4>
                <p className="text-sm text-slate-500 px-2 leading-relaxed">Jadwalkan sesi rahasia dengan psikolog jika diperlukan.</p>
              </div>
            </div>

            <div className="mt-12 flex justify-center">
               <button
                onClick={handleStartAction}
                className="bg-[#1E293B] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
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
