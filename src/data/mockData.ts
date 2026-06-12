import { MahasiswaTriage, NotifikasiItem, RisikoLevel } from '../types';

export interface MahasiswaProfile {
  nama: string;
  nim: string;
  fakultas: string;
  semester: number;
  risikoLevel: RisikoLevel;
  asesmenSelesai: number;
  asesmenTotal: number;
  jadwalBerikutnya: Date | null;
  sesiKonseling: number;
  riwayat: RiwayatItem[];
}

export interface RiwayatItem {
  instrumen: string;
  skor: number;
  tanggal: Date;
  label: string;
  skorSebelumnya?: number[];
}

export const mockMahasiswa: MahasiswaProfile = {
  nama: 'Arva Mahendra',
  nim: '21500010023',
  fakultas: 'FILKOM',
  semester: 5,
  risikoLevel: 'sedang',
  asesmenSelesai: 2,
  asesmenTotal: 3,
  jadwalBerikutnya: new Date('2026-06-26'),
  sesiKonseling: 0,
  riwayat: [
    { instrumen: 'PHQ-9', skor: 12, tanggal: new Date('2023-09-05'), label: 'Depresi sedang', skorSebelumnya: [8, 10] },
    { instrumen: 'SRQ-20', skor: 5, tanggal: new Date('2023-10-12'), label: 'Gejala ringan', skorSebelumnya: [7, 6] },
  ],
};

export const mockDaftarMahasiswa: MahasiswaTriage[] = [
  { id: 1, nama: 'Ahmad Rizky Pratama', nim: '21500043', fakultas: 'FILKOM', semester: 4, phq9: 18, gad7: 15, srq20: null },
  { id: 2, nama: 'Dinda Setiawati', nim: '22500017', fakultas: 'FILKOM', semester: 3, phq9: 16, gad7: 11, srq20: 14 },
  { id: 3, nama: 'Bagas Firmansyah', nim: '22500088', fakultas: 'FEB', semester: 3, phq9: 12, gad7: 10, srq20: 9 },
  { id: 4, nama: 'Nadia Rahmawati', nim: '23500055', fakultas: 'FIA', semester: 2, phq9: 10, gad7: 6, srq20: 8 },
  { id: 5, nama: 'Muhammad Hafizh', nim: '21500102', fakultas: 'FILKOM', semester: 5, phq9: 5, gad7: 4, srq20: 3 },
];

export const mockNotifikasi: NotifikasiItem[] = [
  {
    id: 'n1',
    teks: 'Ahmad Rizky Pratama menyelesaikan PHQ-9 dengan skor 18 (berat)',
    waktu: new Date('2026-06-12T08:30:00'),
    tipe: 'kritis',
  },
  {
    id: 'n2',
    teks: 'Skor GAD-7 Dinda Setiawati naik 5 poin dari asesmen sebelumnya',
    waktu: new Date('2026-06-11T14:15:00'),
    tipe: 'kritis',
  },
  {
    id: 'n3',
    teks: 'Bagas Firmansyah mengonfirmasi sesi konseling 15 Jun 2026',
    waktu: new Date('2026-06-11T10:00:00'),
    tipe: 'info',
  },
  {
    id: 'n4',
    teks: 'Nadia Rahmawati membatalkan sesi konseling 13 Jun 2026',
    waktu: new Date('2026-06-10T16:45:00'),
    tipe: 'perhatian',
  },
];

export const THRESHOLDS = {
  'PHQ-9': { ringan: 5, sedang: 10, berat: 15, sangat_berat: 20 },
  'GAD-7': { ringan: 5, sedang: 10, berat: 15 },
  'SRQ-20': { risiko: 8 },
} as const;

export function getRisikoLevel(m: MahasiswaTriage): 'tinggi' | 'sedang' | 'rendah' {
  const phqBerat = m.phq9 !== null && m.phq9 >= THRESHOLDS['PHQ-9'].berat;
  const gadBerat = m.gad7 !== null && m.gad7 >= THRESHOLDS['GAD-7'].berat;
  if (phqBerat || gadBerat) return 'tinggi';

  const phqSedang = m.phq9 !== null && m.phq9 >= THRESHOLDS['PHQ-9'].sedang;
  const gadSedang = m.gad7 !== null && m.gad7 >= THRESHOLDS['GAD-7'].sedang;
  const srqRisiko = m.srq20 !== null && m.srq20 >= THRESHOLDS['SRQ-20'].risiko;
  if (phqSedang || gadSedang || srqRisiko) return 'sedang';

  return 'rendah';
}
