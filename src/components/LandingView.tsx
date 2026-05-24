import React, { useState } from 'react';
import { ViewType } from '../types';
import { 
  PsychologyIcon, 
  ChevronRightIcon, 
  ArrowRightIcon, 
  AssignmentIcon, 
  QueryStatsIcon, 
  CalendarIcon,
  CloseIcon,
  MenuIcon,
  VerifiedUserIcon
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
  const [landingTab, setLandingTab] = useState<'hero' | 'tentang' | 'panduan'>('hero');

  const handleStartAction = () => {
    if (isLoggedIn) {
      onSetView('dashboard');
    } else {
      onTriggerLogin();
    }
  };

  const navTo = (tab: 'hero' | 'tentang' | 'panduan') => {
    setLandingTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="h-screen bg-[#FDFBF7] text-[#1E293B] font-sans flex flex-col overflow-hidden relative">
      {/* Background Decorators for Premium Look */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[50%] bg-[#0D9488]/5 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[40%] bg-amber-400/5 rounded-full filter blur-[80px]"></div>
      </div>

      {/* TopNavBar */}
      <nav className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-[#F0EBE2] shadow-sm transition-all duration-300">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex justify-between items-center h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95 duration-150" onClick={() => navTo('hero')}>
            <div className="w-8 h-8 bg-[#0D9488] rounded-lg flex items-center justify-center shadow-md shadow-[#0D9488]/20">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-[#1E293B]">SIGAP <span className="text-[#0D9488]">UB</span></span>
          </div>

          {/* Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navTo('hero')} className={`font-semibold text-sm transition-all cursor-pointer ${landingTab === 'hero' ? 'text-[#0D9488] border-b-2 border-[#0D9488] pb-1' : 'text-slate-500 hover:text-[#0D9488] hover:scale-105'}`}>Beranda</button>
            <button onClick={() => navTo('tentang')} className={`font-semibold text-sm transition-all cursor-pointer ${landingTab === 'tentang' ? 'text-[#0D9488] border-b-2 border-[#0D9488] pb-1' : 'text-slate-500 hover:text-[#0D9488] hover:scale-105'}`}>Tentang SIGAP</button>
            <button onClick={() => navTo('panduan')} className={`font-semibold text-sm transition-all cursor-pointer ${landingTab === 'panduan' ? 'text-[#0D9488] border-b-2 border-[#0D9488] pb-1' : 'text-slate-500 hover:text-[#0D9488] hover:scale-105'}`}>Panduan</button>
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

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-[#F0EBE2] px-6 py-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl absolute w-full z-50">
            <button onClick={() => navTo('hero')} className={`text-left font-semibold text-sm py-1 cursor-pointer ${landingTab === 'hero' ? 'text-[#0D9488] border-l-2 border-[#0D9488] pl-2' : 'text-slate-600 hover:text-[#0D9488] pl-2'}`}>Beranda</button>
            <button onClick={() => navTo('tentang')} className={`text-left font-semibold text-sm py-1 cursor-pointer ${landingTab === 'tentang' ? 'text-[#0D9488] border-l-2 border-[#0D9488] pl-2' : 'text-slate-600 hover:text-[#0D9488] pl-2'}`}>Tentang SIGAP</button>
            <button onClick={() => navTo('panduan')} className={`text-left font-semibold text-sm py-1 cursor-pointer ${landingTab === 'panduan' ? 'text-[#0D9488] border-l-2 border-[#0D9488] pl-2' : 'text-slate-600 hover:text-[#0D9488] pl-2'}`}>Panduan</button>
            <div className="h-px bg-slate-100 my-1"></div>
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

      {/* Main Content Area (Sub-routing) */}
      <main className="flex-grow flex flex-col relative z-10 w-full h-full">
        {/* HERO TAB */}
        {landingTab === 'hero' && (
          <section key="hero" className="absolute inset-0 flex flex-col lg:flex-row items-center justify-center max-w-[1280px] mx-auto px-6 md:px-12 animate-in fade-in zoom-in-95 duration-500 gap-12 lg:gap-8">
            {/* Left Hero Content */}
            <div className="flex-1 max-w-2xl relative z-10 flex flex-col items-start text-left">
              {/* Clinical Screening Badge */}
              <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md px-3.5 py-1.5 rounded-full mb-6 border border-[#0D9488]/20 shadow-sm transition-all hover:scale-105 cursor-default">
                <span className="bg-[#0D9488] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">New</span>
                <span className="font-bold text-xs text-[#0D9488]">Sistem Skrining Terstandar WHO</span>
                <ChevronRightIcon className="text-[#0D9488]/70 w-4 h-4" />
              </div>

              {/* Bold Headline */}
              <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-[#1E293B] tracking-tight leading-[1.1] mb-6">
                Sistem Asesmen Psikologis Proaktif
              </h1>

              {/* Underlined highlight Subheadline */}
              <p className="text-lg md:text-xl text-slate-500 leading-relaxed mb-8 max-w-xl">
                Platform komprehensif Universitas Brawijaya untuk deteksi dini, skrining klinis, dan manajemen kesejahteraan mental mahasiswa. Memberikan dukungan tepat waktu untuk{' '}
                <span className="relative inline-block whitespace-nowrap">
                  <span className="relative z-10 font-bold text-[#1E293B]">mahasiswa</span>
                  <span className="absolute left-0 bottom-0.5 w-full h-[6px] bg-[#FEF08A]/80 z-0 rounded"></span>
                </span>
                .
              </p>

              {/* Active CTA Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <button 
                  onClick={handleStartAction}
                  className="w-full sm:w-auto bg-[#0D9488] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#0F766E] hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-xl shadow-[#0D9488]/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Mulai Asesmen
                </button>
                <button 
                  onClick={handleStartAction}
                  className="w-full sm:w-auto font-bold text-[#0D9488] hover:text-[#0F766E] hover:bg-teal-50/50 rounded-xl hover:scale-105 active:scale-95 transition-all py-3 px-6 flex items-center justify-center gap-2 group cursor-pointer duration-150"
                >
                  {isLoggedIn ? 'Buka Dasbor Saya' : 'Masuk via SSO UB'}
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Hero Perspective Vector Card Grid */}
            <div className="hidden md:flex flex-1 w-full lg:w-auto relative min-h-[480px] items-center justify-center lg:pl-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-radial from-[#0D9488]/10 to-transparent rounded-full filter blur-3xl pointer-events-none"></div>
              
              {/* Perspective Dashboard Mockup Frame */}
              <div className="relative z-10 w-full max-w-[500px] transform rotate-[-3deg] lg:rotate-[-4deg] transition-all duration-500 hover:rotate-[-1deg] float-shadow rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm border border-[#F0EBE2] shadow-2xl">
                <div className="bg-[#1E293B] text-white px-4 py-3 flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  </div>
                  <div className="bg-slate-800 px-3 py-1 rounded text-slate-300 text-[10px] flex items-center gap-1">
                    <span className="inline-block w-3 h-3 text-[8px] leading-3 text-center">🛡️</span>
                    sigap.ub.ac.id/dashboard
                  </div>
                </div>

                <div className="p-5 bg-white/90 space-y-4">
                  <div className="flex justify-between items-end border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-bold text-base text-[#1E293B]">Risk Distribution Overview</h3>
                      <p className="text-[10px] text-slate-500">Current semester real-time triage data.</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Total Assessed</span>
                      <span className="text-xl text-[#0D9488] font-black">3,429</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="bg-[#FDFBF7] p-2.5 rounded-lg border border-[#F0EBE2]">
                      <div className="text-[9px] text-slate-500 mb-0.5">Low Risk</div>
                      <div className="text-sm font-bold text-emerald-700">2,104</div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    <div className="bg-[#FDFBF7] p-2.5 rounded-lg border border-[#F0EBE2]">
                      <div className="text-[9px] text-slate-500 mb-0.5">Moderate</div>
                      <div className="text-sm font-bold text-amber-600">980</div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '38%' }}></div>
                      </div>
                    </div>
                    <div className="bg-[#FDFBF7] p-2.5 rounded-lg border border-[#F0EBE2]">
                      <div className="text-[9px] text-slate-500 mb-0.5">High Risk</div>
                      <div className="text-sm font-bold text-rose-600">345</div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-[11px] text-slate-700">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                      <span className="flex items-center gap-1 text-amber-700 font-medium">⚠️ Student ID: 215... marked Moderate</span>
                      <span className="text-[9px] text-slate-400">2m ago</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">✅ Counseling Session #402 Completed</span>
                      <span className="text-[9px] text-slate-400">15m ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Float Cards */}
              <div 
                onClick={handleStartAction}
                className="absolute -top-6 -left-4 lg:-left-10 z-20 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-white shadow-xl animate-float-1 flex flex-col items-center justify-center gap-1.5 w-28 h-28 cursor-pointer hover:scale-110 active:scale-95 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-[#0D9488]/10 flex items-center justify-center text-[#0D9488]">
                  <AssignmentIcon size={22} />
                </div>
                <span className="font-bold text-[10px] text-[#1E293B] text-center leading-tight">Self<br />Asesmen</span>
              </div>

              <div 
                onClick={handleStartAction}
                className="absolute top-12 -right-4 lg:-right-8 z-20 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-white shadow-xl animate-float-2 flex flex-col items-center justify-center gap-1.5 w-28 h-28 cursor-pointer hover:scale-110 active:scale-95 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#0D9488]">
                  <PsychologyIcon size={22} className="relative -top-0.5" />
                </div>
                <span className="font-bold text-[10px] text-[#1E293B] text-center leading-tight">Skrining<br />Klinis</span>
              </div>

              <div 
                onClick={handleStartAction}
                className="absolute bottom-12 -left-6 lg:-left-12 z-20 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-white shadow-xl animate-float-3 flex flex-col items-center justify-center gap-1.5 w-28 h-28 cursor-pointer hover:scale-110 active:scale-95 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                  <QueryStatsIcon size={22} />
                </div>
                <span className="font-bold text-[10px] text-[#1E293B] text-center leading-tight">Insight<br />Dashboard</span>
              </div>

              <div 
                onClick={handleStartAction}
                className="absolute -bottom-4 right-0 lg:right-6 z-20 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-white shadow-xl animate-float-4 flex flex-col items-center justify-center gap-1.5 w-28 h-28 cursor-pointer hover:scale-110 active:scale-95 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-[#0D9488]/10 flex items-center justify-center text-[#0D9488]">
                  <CalendarIcon size={22} />
                </div>
                <span className="font-bold text-[10px] text-[#1E293B] text-center leading-tight">Atur<br />Jadwal</span>
              </div>
            </div>
          </section>
        )}

        {/* TENTANG TAB */}
        {landingTab === 'tentang' && (
          <section key="tentang" className="absolute inset-0 flex items-center justify-center px-6 md:px-12 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full h-full">
            <div className="w-full max-w-4xl bg-white/70 backdrop-blur-xl p-8 md:p-14 rounded-[2.5rem] border border-white shadow-2xl text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#0D9488]/10 rounded-full filter blur-[60px] pointer-events-none"></div>
              
              <div className="w-16 h-16 bg-gradient-to-br from-teal-50 to-[#0D9488]/20 text-[#0D9488] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <VerifiedUserIcon size={32} />
              </div>
              <h2 className="font-display font-extrabold text-3xl md:text-5xl text-[#1E293B] mb-6 tracking-tight">
                Tentang SIGAP <span className="text-[#0D9488]">UB</span>
              </h2>
              <p className="text-slate-600 text-sm md:text-lg leading-relaxed max-w-3xl mx-auto mb-10 font-medium">
                SIGAP UB diinisiasi sebagai solusi sistemik Universitas Brawijaya dalam mendukung kesehatan mental mahasiswa secara preventif. Kami percaya bahwa kesehatan mental merupakan pilar krusial bagi keberhasilan akademik dan pengembangan potensi diri.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left relative z-10">
                <div className="bg-white/80 p-6 rounded-2xl border border-slate-100 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                    <span className="text-xl">🔒</span>
                  </div>
                  <div>
                    <strong className="text-[#1E293B] block mb-1.5 text-base">100% Rahasia & Aman</strong>
                    <span className="text-sm text-slate-500 leading-snug block">Data hasil tes dienkripsi dengan standar tinggi dan hanya dapat diakses oleh konselor medis profesional.</span>
                  </div>
                </div>
                <div className="bg-white/80 p-6 rounded-2xl border border-slate-100 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 shrink-0">
                    <span className="text-xl">🎓</span>
                  </div>
                  <div>
                    <strong className="text-[#1E293B] block mb-1.5 text-base">Terintegrasi SIAM</strong>
                    <span className="text-sm text-slate-500 leading-snug block">Terhubung langsung dengan database kemahasiswaan Universitas Brawijaya untuk kemudahan akses.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* PANDUAN TAB */}
        {landingTab === 'panduan' && (
          <section key="panduan" className="absolute inset-0 flex items-center justify-center px-6 md:px-12 animate-in fade-in zoom-in-95 duration-500 w-full h-full">
            <div className="w-full max-w-5xl bg-white/70 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white shadow-2xl text-center relative">
              <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[#1E293B] mb-12 tracking-tight">
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
        )}
      </main>
    </div>
  );
};
