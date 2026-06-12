import React, { useState } from 'react';
import { ViewType } from '../types';
import { mockDaftarMahasiswa, mockNotifikasi } from '../data/mockData';
import { KonselorSummaryBar } from './konselor/KonselorSummaryBar';
import { TriaseTable } from './konselor/TriaseTable';
import { RisikoChart } from './konselor/RisikoChart';
import { NotifikasiTriase } from './konselor/NotifikasiTriase';

interface KonselorViewProps {
  onSetView: (view: ViewType) => void;
  onLogout: () => void;
}

export const KonselorView: React.FC<KonselorViewProps> = ({ onSetView, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'triase' | 'jadwal' | 'laporan'>('triase');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col">
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
            <span className="text-[10px] font-medium text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md ml-1">
              Konselor
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {(['triase', 'jadwal', 'laporan'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                  activeTab === tab
                    ? 'text-teal-700 bg-teal-50 font-semibold'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {tab === 'triase' ? 'Triase' : tab === 'jadwal' ? 'Jadwal' : 'Laporan'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[11px] font-semibold text-emerald-700">SIAM Terhubung</span>
            </div>

            <div className="relative ml-1">
              <button
                aria-label="Menu profil konselor"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-9 h-9 rounded-full bg-teal-700 flex items-center justify-center hover:ring-2 hover:ring-teal-200 transition-all"
              >
                <span className="text-white font-bold text-sm">KN</span>
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-12 w-52 bg-white border border-stone-200 shadow-lg rounded-xl py-1.5 z-50">
                  <div className="px-4 py-2.5 border-b border-stone-100">
                    <p className="text-sm font-semibold text-stone-900">Konselor UB</p>
                    <p className="text-xs text-stone-500">Psikologi Klinis</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onSetView('dashboard');
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                    Dashboard mahasiswa
                  </button>
                  <button
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

      <KonselorSummaryBar mahasiswa={mockDaftarMahasiswa} sesiHariIni={2} />

      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 md:px-10 py-6">
        {activeTab === 'triase' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-8">
              <h2 className="text-[11px] uppercase tracking-[0.06em] text-stone-400 font-medium mb-3">
                Triase mahasiswa
              </h2>
              <TriaseTable mahasiswa={mockDaftarMahasiswa} />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-4">
              <RisikoChart mahasiswa={mockDaftarMahasiswa} />
              <NotifikasiTriase notifikasi={mockNotifikasi} />
            </div>
          </div>
        )}
        {activeTab === 'jadwal' && (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-stone-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <p className="text-[13px] text-stone-500">Fitur jadwal konseling segera hadir.</p>
          </div>
        )}
        {activeTab === 'laporan' && (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-stone-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
            </div>
            <p className="text-[13px] text-stone-500">Fitur laporan analitik segera hadir.</p>
          </div>
        )}
      </main>

      <footer className="h-12 bg-white border-t border-stone-200 flex items-center px-6 md:px-10 justify-between max-w-[1200px] mx-auto w-full shrink-0">
        <span className="text-xs text-stone-400">Platform Resmi Universitas Brawijaya &copy; 2025</span>
        <span className="text-xs text-stone-400 font-medium">Panel Konselor</span>
      </footer>
    </div>
  );
};
