import React, { useState } from 'react';
import { ViewType, HistoryItem, AssessmentType } from '../types';
import {
  PsychologyIcon,
  BellIcon,
  HelpIcon,
  VerifiedUserIcon,
  FormatListNumberedIcon,
  LinkIcon,
  HistoryIcon,
  SupportAgentIcon,
  MoodBadIcon,
  CloseIcon,
  ArrowRightIcon,
  MenuIcon
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
  onLogout
}) => {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const [guideTab, setGuideTab] = useState<'alur' | 'privasi' | 'faq'>('alur');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E293B] font-sans flex flex-col scroll-smooth">
      {/* Header Bar */}
      <header className="bg-white/95 backdrop-blur-xl sticky top-0 z-50 border-b border-[#F0EBE2] shadow-sm">
        <nav className="flex justify-between items-center w-full px-6 md:px-12 py-3.5 max-w-[1280px] mx-auto h-16">
          {/* Logo Brand */}
          <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95 duration-150" onClick={() => onSetView('landing')}>
            <div className="w-8 h-8 bg-[#0D9488] rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="font-bold text-lg text-[#1E293B] tracking-tight">SIGAP <span className="text-[#0D9488]">UB</span></span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => onSetView('landing')}
              className="text-slate-500 hover:text-[#0D9488] font-medium text-sm rounded px-2.5 py-1.5 hover:bg-[#FDFBF7] transition-all duration-150 cursor-pointer hover:scale-105 active:scale-95"
            >
              Beranda
            </button>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[#0D9488] border-b-2 border-[#0D9488] font-bold pb-1 text-sm tracking-wide cursor-pointer transition-all hover:scale-105"
            >
              Dashboard
            </button>
            <button 
              onClick={() => scrollToSection('asesmen-section')}
              className="text-slate-500 hover:text-[#0D9488] font-medium text-sm rounded px-2.5 py-1.5 hover:bg-[#FDFBF7] transition-all duration-150 cursor-pointer hover:scale-105 active:scale-95"
            >
              Asesmen
            </button>
            <button 
              onClick={() => setIsGuideModalOpen(true)}
              className="text-slate-500 hover:text-[#0D9488] font-medium text-sm rounded px-2.5 py-1.5 hover:bg-[#FDFBF7] transition-all duration-150 cursor-pointer hover:scale-105 active:scale-95"
            >
              Panduan
            </button>
          </div>

          {/* User Controls and Profile Image */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setToast({ message: 'Tidak ada notifikasi baru saat ini.', type: 'info' })}
              aria-label="Notifications"
              className="text-slate-500 hover:text-[#0D9488] transition-colors p-2 rounded-full hover:bg-slate-100 cursor-pointer active:scale-90"
            >
              <BellIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsGuideModalOpen(true)}
              aria-label="Help" 
              className="text-slate-500 hover:text-[#0D9488] transition-colors p-2 rounded-full hover:bg-slate-100 hidden sm:block cursor-pointer active:scale-90"
            >
              <HelpIcon className="w-5 h-5" />
            </button>
            
            {/* Indonesian Student Profile Image */}
            <div className="relative">
              <button
                type="button"
                aria-label="Profile menu"
                aria-haspopup="menu"
                aria-expanded={isProfileDropdownOpen}
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-9 h-9 rounded-full overflow-hidden border border-[#F0EBE2] ml-1 hover:opacity-90 cursor-pointer transition-opacity active:scale-90 duration-150"
              >
                <div className="w-full h-full bg-[#0D9488] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MU</span>
                </div>
              </button>
              {isProfileDropdownOpen && (
                <div role="menu" className="absolute right-0 top-12 w-48 bg-white border border-[#F0EBE2] shadow-lg rounded-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { setIsProfileDropdownOpen(false); onLogout(); }}
                    className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium transition-colors cursor-pointer"
                  >
                    Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Core Grid */}
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-6 md:px-12 py-8 md:py-10 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px]">
          
          {/* Main Assessment List (Left Column) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Elegant Welcome Banner */}
            <section className="bg-white rounded-2xl p-6 md:p-8 border border-[#F0EBE2] shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md">
              <div className="absolute -right-12 -top-12 w-44 h-44 bg-[#0D9488]/5 rounded-full blur-2xl pointer-events-none"></div>
              <h1 className="font-display font-extrabold text-2xl md:text-3xl text-[#1E293B] mb-2 leading-tight">
                Selamat Datang Kembali, <span className="text-[#0D9488]">Mahasiswa UB</span>
              </h1>
              <p className="text-sm md:text-base text-slate-500 max-w-2xl leading-relaxed">
                Pantau kesehatan mentalmu secara rutin untuk performa akademik terbaik. Platform asesmen psikologis resmi Universitas Brawijaya.
              </p>
            </section>

            {/* Privacy Protection Banner */}
            <section className="bg-slate-100 rounded-2xl p-4 flex items-start gap-4 border border-slate-200">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#1E293B] mb-0.5">Aman &amp; Terenkripsi</h3>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                  Hasil asesmen Anda bersifat anonim dan rahasia, tidak memengaruhi nilai akademik.
                </p>
              </div>
            </section>

            {/* Assessment Grid Core Block */}
            <section id="asesmen-section" className="scroll-mt-20">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                Asesmen Tersedia
              </h3>
              
              <div className="flex flex-col gap-4">
                
                {/* 1. Depression Assessment Block (PHQ-9) */}
                <div className="bg-white rounded-2xl p-6 border border-[#F0EBE2] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-teal-500/40">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shrink-0">
                      <MoodBadIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#1E293B] group-hover:text-[#0D9488] transition-colors">
                        Asesmen Depresi (PHQ-9)
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 mb-3">
                        Skrining mendalam mengenai tanda depresi emosional Anda dalam 2 minggu terakhir.
                      </p>
                      <span className="inline-flex items-center gap-1.5 font-bold text-[11px] text-slate-400 bg-[#FDFBF7] px-2.5 py-1.5 rounded-lg border border-[#F0EBE2]">
                        <FormatListNumberedIcon size={14} className="text-slate-400" />
                        9 Pertanyaan
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onSelectAssessment('phq9')}
                    className="mt-2 sm:mt-0 w-full sm:w-auto px-5 py-2.5 border border-[#0D9488] text-[#0D9488] hover:bg-teal-50 hover:scale-[1.02] active:scale-95 font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                  >
                    Mulai Tes
                  </button>
                </div>

                {/* 2. Anxiety Assessment Block (GAD-7) - Recommended */}
                <div className="bg-white p-6 rounded-2xl border-2 border-[#0D9488] shadow-md hover:shadow-lg transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:scale-[1.01]">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#0D9488]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-[#1E293B] group-hover:text-[#0D9488] transition-colors">
                          Asesmen Kecemasan (GAD-7)
                        </h4>
                        <span className="px-2 py-0.5 bg-teal-100 text-[#0D9488] text-[9px] font-black rounded-full uppercase tracking-wider">
                          Rekomendasi
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 mb-3">
                        Evaluasi tingkat kecemasan umum, stres harian, dan ketegangan psikis Anda.
                      </p>
                      <span className="inline-flex items-center gap-1.5 font-bold text-[11px] text-slate-400 bg-[#FDFBF7] px-2.5 py-1.5 rounded-lg border border-[#F0EBE2]">
                        <FormatListNumberedIcon size={14} className="text-slate-400" />
                        7 Pertanyaan
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onSelectAssessment('gad7')}
                    className="mt-2 sm:mt-0 w-full sm:w-auto py-3 bg-[#0D9488] text-white font-bold rounded-xl shadow-md shadow-teal-200 active:scale-95 hover:scale-[1.02] transition-all px-6 text-xs cursor-pointer hover:bg-[#0F766E]"
                  >
                    Mulai Tes
                  </button>
                </div>

                {/* 3. General Screening Assessment Block (SRQ-20) */}
                <div className="bg-white rounded-2xl p-6 border border-[#F0EBE2] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-teal-500/40">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#FDFBF7] border border-slate-200 text-slate-500 rounded-2xl flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#1E293B] group-hover:text-[#0D9488] transition-colors">
                        Skrining Umum (SRQ-20)
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 mb-3">
                        20 pertanyaan skrining mental emosional standar WHO untuk deteksi dini gejala stres.
                      </p>
                      <span className="inline-flex items-center gap-1.5 font-bold text-[11px] text-slate-400 bg-[#FDFBF7] px-2.5 py-1.5 rounded-lg border border-[#F0EBE2]">
                        <FormatListNumberedIcon size={14} className="text-slate-400" />
                        20 Pertanyaan
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onSelectAssessment('srq20')}
                    className="mt-2 sm:mt-0 w-full sm:w-auto px-5 py-2.5 border border-[#0D9488] text-[#0D9488] hover:bg-teal-50 hover:scale-[1.02] active:scale-95 font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                  >
                    Mulai Tes
                  </button>
                </div>

              </div>
            </section>
          </div>

          {/* Sidebar Status & History (Right Column) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* SIAK Integration Status Block */}
            <div className="p-6 bg-white rounded-2xl border border-[#F0EBE2] shadow-sm">
              <div className="flex items-center gap-2 bg-[#F0FDF4] px-3 py-1.5 rounded-full border border-[#DCFCE7] justify-center mb-4">
                <div className="w-2.5 h-2.5 bg-[#22C55E] rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-[#166534]">SIAK UB Terhubung</span>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nama Lengkap</span>
                  <span className="font-bold text-slate-700">Mahasiswa UB Brawijaya</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">NIM / Fakultas</span>
                  <span className="font-semibold text-sm text-slate-600">21500010023 / FILKOM</span>
                </div>
              </div>
            </div>

            {/* Assessment History Block */}
            <div className="bg-white rounded-2xl p-6 border border-[#F0EBE2] shadow-sm flex flex-col">
              <h3 className="font-bold text-base text-[#1E293B] mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                <HistoryIcon size={20} className="text-slate-400" />
                Riwayat Asesmen
              </h3>

              <div className="flex flex-col gap-4">
                {history.map((item) => (
                  <div key={item.id} className="flex flex-col gap-1 pb-4 border-b border-slate-100 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-xs text-[#1E293B] leading-tight">
                        {item.assessmentName}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        item.status === 'Selesai' 
                          ? 'bg-green-100 text-green-700' 
                          : item.status === 'Aman'
                            ? 'bg-teal-50 text-[#0D9488]'
                            : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                      <span>{item.date}</span>
                      {item.score !== undefined && (
                        <span className="font-mono bg-[#FDFBF7] border border-[#F0EBE2] px-1.5 rounded text-slate-500 text-[10px]">
                          Skor: {item.score} ({item.interpretation})
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {history.length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-500">
                    Belum ada riwayat tes. Silakan selesaikan salah satu asesmen Anda.
                  </div>
                )}

              </div>
            </div>

            {/* Support/Counselor Button Block */}
            <div className="p-6 bg-white rounded-2xl border border-[#F0EBE2] shadow-sm text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-[#0D9488] mb-3">
                <SupportAgentIcon size={30} className="text-[#0D9488]" />
              </div>
              <h3 className="font-bold text-base text-[#1E293B] mb-1">
                Butuh Bantuan?
              </h3>
              <p className="text-xs text-slate-500 mb-4 max-w-[200px] leading-relaxed">
                Hubungi konselor profesional kami secara rahasia dan gratis.
              </p>
              <button 
                onClick={onOpenCounselorModal}
                className="w-full py-2.5 bg-[#0D9488] hover:bg-[#0F766E] text-white rounded-xl text-xs font-bold hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                Chat Konselor
              </button>
            </div>

          </div>

        </div>
      </main>

      {/* Dynamic Guides Overlay Modal */}
      {isGuideModalOpen && (
        <div className="fixed inset-0 bg-[#081b3a]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white rounded-2xl w-full max-w-2xl border border-[#bdc9c8]/40 shadow-2xl overflow-hidden transition-all duration-300 scale-100 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex bg-[#081b3a] text-white justify-between items-center px-6 py-4">
              <div className="flex items-center gap-2">
                <span>📘</span>
                <h3 className="font-bold text-base md:text-lg tracking-tight">
                  Panduan Pengguna &amp; FAQ SIGAP UB
                </h3>
              </div>
              <button 
                onClick={() => setIsGuideModalOpen(false)}
                className="text-gray-300 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer active:scale-90"
              >
                <CloseIcon size={20} />
              </button>
            </div>

            {/* Tabs Selector Bar */}
            <div className="bg-[#fcfbfa] border-b border-slate-100 flex p-1 gap-1">
              <button 
                onClick={() => setGuideTab('alur')}
                className={`flex-1 text-center py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  guideTab === 'alur' ? 'bg-[#0D9488] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                Alur Layanan
              </button>
              <button 
                onClick={() => setGuideTab('privasi')}
                className={`flex-1 text-center py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  guideTab === 'privasi' ? 'bg-[#0D9488] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                Privasi &amp; Keamanan
              </button>
              <button 
                onClick={() => setGuideTab('faq')}
                className={`flex-1 text-center py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  guideTab === 'faq' ? 'bg-[#0D9488] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                FAQ Terpopuler
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 md:p-8 max-h-[400px] overflow-y-auto text-left">
              {guideTab === 'alur' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-150">
                  <h4 className="font-bold text-sm text-[#1E293B] border-b border-slate-100 pb-2">Bagaimana Cara Menggunakan SIGAP UB?</h4>
                  <ol className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
                    <li className="flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-teal-50 text-[#0D9488] flex items-center justify-center font-bold shrink-0">1</span>
                      <span><strong>Pilih Tes:</strong> Pilih kuesioner asesmen yang sesuai dengan keluhan Anda di halaman utama dashboard (PHQ-9 Depresi, GAD-7 Kecemasan, atau SRQ-20 Gejala Umum).</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-teal-50 text-[#0D9488] flex items-center justify-center font-bold shrink-0">2</span>
                      <span><strong>Isi Kuesioner:</strong> Jawab seluruh pertanyaan secara objektif sesuai perasaan yang Anda rasakan selama 2 minggu terakhir. Proses ini memakan waktu sekitar 5 menit.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-teal-50 text-[#0D9488] flex items-center justify-center font-bold shrink-0">3</span>
                      <span><strong>Analisis Risiko:</strong> Sistem akan menghitung skor Anda berdasarkan standar klinis internasional. Hasil skrining akan langsung terekam aman di Riwayat Asesmen.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-teal-50 text-[#0D9488] flex items-center justify-center font-bold shrink-0">4</span>
                      <span><strong>Konseling Gratis:</strong> Jika Anda berada dalam risiko Sedang atau Tinggi, sistem menganjurkan penekanan tombol <strong>"Chat Konselor"</strong> untuk memesan janji temu aman &amp; gratis.</span>
                    </li>
                  </ol>
                </div>
              )}

              {guideTab === 'privasi' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-150">
                  <h4 className="font-bold text-sm text-[#1E293B] border-b border-slate-100 pb-2 flex items-center gap-2">
                    <VerifiedUserIcon size={16} className="text-[#0D9488]" />
                    Komitmen Perlindungan Kerahasiaan Data
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed mb-2">
                    Kami sangat menghargai privasi Anda. Seluruh arsitektur database SIGAP UB dirancang dengan standar enkripsi setingkat perbankan.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-[#0D9488]">✔</span>
                      <span><strong>Enkripsi End-to-End:</strong> Data kuesioner Anda dienkripsi sehingga tidak dapat dibaca oleh staf umum akademis, dosen, maupun fakultas.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#0D9488]">✔</span>
                      <span><strong>Akses Eksklusif Medis:</strong> Hanya konselor psikologis klinis terlisensi yang menangani kasus Anda yang memiliki hak kunci deskripsi data.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#0D9488]">✔</span>
                      <span><strong>Jaminan Stigma Negatif:</strong> Hasil diagnosis tidak memengaruhi nilai akhir kuliah, status keaktifan mahasiswa, beasiswa, maupun relasi organisasi di dalam kampus.</span>
                    </li>
                  </ul>
                </div>
              )}

              {guideTab === 'faq' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-150">
                  <h4 className="font-bold text-sm text-[#1E293B] border-b border-slate-100 pb-2">Pertanyaan Sering Diajukan (FAQ)</h4>
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <h5 className="font-bold text-[#1E293B] mb-0.5">Q: Apakah layanan konseling ini berbayar?</h5>
                      <p className="text-slate-500 leading-relaxed">A: Tidak. Seluruh layanan skrining, skoring klinis, dan konsultasi tatap muka dengan konselor profesional SIGAP UB ditanggung penuh oleh Universitas Brawijaya (100% Gratis bagi mahasiswa UB aktif).</p>
                    </div>
                    <div>
                      <h5 className="font-bold text-[#1E293B] mb-0.5">Q: Bagaimana jika saya tidak sengaja menutup halaman tes?</h5>
                      <p className="text-slate-500 leading-relaxed">A: Halaman tes memiliki dialog konfirmasi pengamanan. Namun jika tidak sengaja tertutup, progress jawaban pada pertanyaan terakhir akan otomatis tersimpan sementara.</p>
                    </div>
                    <div>
                      <h5 className="font-bold text-[#1E293B] mb-0.5">Q: Apakah saya bisa menghapus riwayat asesmen lama?</h5>
                      <p className="text-slate-500 leading-relaxed">A: Untuk alasan rekaman medis &amp; triage klinis, data riwayat tidak dapat dihapus mandiri, namun terjamin kerahasiaannya di bawah regulasi ketat UB.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 justify-end px-6 py-4 bg-[#fcfbfa] border-t border-slate-100">
              <button 
                onClick={() => setIsGuideModalOpen(false)}
                className="bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-xs px-6 py-2 rounded-xl transition-all cursor-pointer active:scale-95 duration-150"
              >
                Saya Mengerti
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer Block */}
      <footer className="h-12 bg-white border-t border-[#F0EBE2] flex items-center px-8 justify-between shrink-0">
        <div className="text-[10px] text-slate-400">
          Platform Resmi Universitas Brawijaya © 2025
        </div>
        <div className="text-[10px] text-slate-400 font-medium italic">
          Dikembangkan oleh Tim &quot;Puding Coklat Pak Hambali&quot;
        </div>
      </footer>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

