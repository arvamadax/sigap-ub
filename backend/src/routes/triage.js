// SIGAP UB — Routes triase klinis
// Mengkombinasikan tiga instrumen (PHQ-9, GAD-7, SRQ-20) menjadi satu
// keputusan triase tunggal: level risiko tertinggi menentukan klasifikasi.
// Implementasi sengaja eksplisit (threshold + max) — bukan model statistik.

const express = require('express');
const authMiddleware = require('../middleware/auth');
const { classifyPhq9, classifyGad7, classifySrq20 } = require('./assessments');

const router = express.Router();

const RISK_RANK = { rendah: 1, sedang: 2, tinggi: 3, kritis: 4 };
const RISK_BY_RANK = { 1: 'rendah', 2: 'sedang', 3: 'tinggi', 4: 'kritis' };

function classifyRisk(phq9Score, gad7Score, srq20Score) {
  const phq9 = classifyPhq9(phq9Score);
  const gad7 = classifyGad7(gad7Score);
  const srq20 = classifySrq20(srq20Score);

  const entries = [
    { instrument: 'phq9', level: phq9.riskLevel, score: phq9Score },
    { instrument: 'gad7', level: gad7.riskLevel, score: gad7Score },
    { instrument: 'srq20', level: srq20.riskLevel, score: srq20Score },
  ];

  const maxRank = entries.reduce((acc, e) => Math.max(acc, RISK_RANK[e.level]), 0);
  const riskLevel = RISK_BY_RANK[maxRank];
  const contributingFactors = entries.filter((e) => RISK_RANK[e.level] === maxRank);

  // Confidence sederhana: berapa instrumen yang setuju pada level tertinggi
  const confidenceScore = Number((contributingFactors.length / entries.length).toFixed(2));

  return { riskLevel, confidenceScore, contributingFactors };
}

// Data mock daftar mahasiswa — pada produksi diambil dari tabel triase di DB
const mockTriageList = [
  { id: 1, nama: 'Ahmad Rizky Pratama', nim: '21500043', fakultas: 'FILKOM', semester: 4, phq9: 18, gad7: 15, srq20: null },
  { id: 2, nama: 'Dinda Setiawati', nim: '22500017', fakultas: 'FILKOM', semester: 3, phq9: 16, gad7: 11, srq20: 14 },
  { id: 3, nama: 'Bagas Firmansyah', nim: '22500088', fakultas: 'FEB', semester: 3, phq9: 12, gad7: 10, srq20: 9 },
  { id: 4, nama: 'Nadia Rahmawati', nim: '23500055', fakultas: 'FIA', semester: 2, phq9: 10, gad7: 6, srq20: 8 },
  { id: 5, nama: 'Muhammad Hafizh', nim: '21500102', fakultas: 'FILKOM', semester: 5, phq9: 5, gad7: 4, srq20: 3 },
];

const mockNotifikasi = [
  { id: 'n1', teks: 'Ahmad Rizky Pratama menyelesaikan PHQ-9 dengan skor 18 (berat)', waktu: '2026-06-12T08:30:00Z', tipe: 'kritis' },
  { id: 'n2', teks: 'Skor GAD-7 Dinda Setiawati naik 5 poin dari asesmen sebelumnya', waktu: '2026-06-11T14:15:00Z', tipe: 'kritis' },
  { id: 'n3', teks: 'Bagas Firmansyah mengonfirmasi sesi konseling 15 Jun 2026', waktu: '2026-06-11T10:00:00Z', tipe: 'info' },
  { id: 'n4', teks: 'Nadia Rahmawati membatalkan sesi konseling 13 Jun 2026', waktu: '2026-06-10T16:45:00Z', tipe: 'perhatian' },
];

/**
 * @openapi
 * /api/triage/classify:
 *   post:
 *     tags: [Triage]
 *     summary: Klasifikasi risiko gabungan dari skor PHQ-9, GAD-7, SRQ-20
 *     description: Mengkombinasikan tiga instrumen menjadi satu keputusan triase. Level risiko tertinggi menentukan klasifikasi akhir.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phq9Score, gad7Score, srq20Score]
 *             properties:
 *               phq9Score:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 27
 *                 example: 12
 *                 description: Skor total PHQ-9 (0-27)
 *               gad7Score:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 21
 *                 example: 10
 *                 description: Skor total GAD-7 (0-21)
 *               srq20Score:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 20
 *                 example: 8
 *                 description: Skor total SRQ-20 (0-20)
 *     responses:
 *       200:
 *         description: Hasil klasifikasi triase gabungan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 riskLevel:
 *                   type: string
 *                   enum: [rendah, sedang, tinggi, kritis]
 *                   example: sedang
 *                 confidenceScore:
 *                   type: number
 *                   example: 0.67
 *                 contributingFactors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       instrument:
 *                         type: string
 *                         example: phq9
 *                       level:
 *                         type: string
 *                         example: sedang
 *                       score:
 *                         type: number
 *                         example: 12
 *       400:
 *         description: Skor tidak valid
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 */
router.post('/classify', authMiddleware, (req, res) => {
  try {
    const { phq9Score, gad7Score, srq20Score } = req.body || {};

    const scores = [phq9Score, gad7Score, srq20Score];
    if (scores.some((s) => typeof s !== 'number' || s < 0)) {
      return res.status(400).json({
        error: 'phq9Score, gad7Score, dan srq20Score wajib berupa angka non-negatif',
      });
    }

    const result = classifyRisk(phq9Score, gad7Score, srq20Score);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Gagal melakukan klasifikasi triase' });
  }
});

/**
 * @openapi
 * /api/triage/list:
 *   get:
 *     tags: [Triage]
 *     summary: Daftar mahasiswa beserta skor triase (khusus konselor)
 *     description: Mengembalikan daftar seluruh mahasiswa yang sudah melakukan asesmen beserta skor PHQ-9, GAD-7, dan SRQ-20. Digunakan oleh dashboard konselor untuk tabel triase.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar mahasiswa dengan skor triase
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mahasiswa:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nama:
 *                         type: string
 *                         example: Ahmad Rizky Pratama
 *                       nim:
 *                         type: string
 *                         example: "21500043"
 *                       fakultas:
 *                         type: string
 *                         example: FILKOM
 *                       semester:
 *                         type: integer
 *                         example: 4
 *                       phq9:
 *                         type: integer
 *                         nullable: true
 *                         example: 18
 *                       gad7:
 *                         type: integer
 *                         nullable: true
 *                         example: 15
 *                       srq20:
 *                         type: integer
 *                         nullable: true
 *                         example: null
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 */
router.get('/list', authMiddleware, (_req, res) => {
  try {
    return res.status(200).json({ mahasiswa: mockTriageList });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil daftar triase' });
  }
});

/**
 * @openapi
 * /api/triage/notifications:
 *   get:
 *     tags: [Triage]
 *     summary: Notifikasi triase untuk konselor
 *     description: Mengembalikan feed notifikasi terkait triase — kasus kritis baru, perubahan skor signifikan, dan update jadwal konseling.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar notifikasi triase
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: n1
 *                       teks:
 *                         type: string
 *                         example: Ahmad Rizky Pratama menyelesaikan PHQ-9 dengan skor 18 (berat)
 *                       waktu:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-06-12T08:30:00Z"
 *                       tipe:
 *                         type: string
 *                         enum: [kritis, perhatian, info]
 *                         example: kritis
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 */
router.get('/notifications', authMiddleware, (_req, res) => {
  try {
    return res.status(200).json({ notifications: mockNotifikasi });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil notifikasi triase' });
  }
});

module.exports = router;
module.exports.classifyRisk = classifyRisk;
