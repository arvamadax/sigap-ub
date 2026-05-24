// SIGAP UB — Routes asesmen psikologis
// Menerima jawaban kuesioner, menghitung skor total, mengklasifikasikan
// risiko berdasarkan cut-off klinis tervalidasi WHO (PHQ-9, GAD-7, SRQ-20),
// dan mengembalikan interpretasi tekstual. Penyimpanan mock in-memory
// agar demo tetap berjalan tanpa koneksi database.

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Penyimpanan sementara untuk demo (di-reset saat restart proses)
const assessmentStore = [
  {
    assessmentId: uuidv4(),
    type: 'srq20',
    score: 5,
    riskLevel: 'rendah',
    interpretation: 'Sehat',
    createdAt: new Date('2025-10-12T09:00:00Z').toISOString(),
  },
  {
    assessmentId: uuidv4(),
    type: 'phq9',
    score: 12,
    riskLevel: 'sedang',
    interpretation: 'Depresi Sedang',
    createdAt: new Date('2025-09-05T10:30:00Z').toISOString(),
  },
];

/**
 * Cut-off PHQ-9 sesuai Kroenke et al. (2001).
 */
function classifyPhq9(score) {
  if (score <= 4) return { riskLevel: 'rendah', interpretation: 'Minimal' };
  if (score <= 9) return { riskLevel: 'rendah', interpretation: 'Ringan' };
  if (score <= 14) return { riskLevel: 'sedang', interpretation: 'Sedang' };
  if (score <= 19) return { riskLevel: 'tinggi', interpretation: 'Sedang-Berat' };
  return { riskLevel: 'kritis', interpretation: 'Berat' };
}

/**
 * Cut-off GAD-7 sesuai Spitzer et al. (2006).
 */
function classifyGad7(score) {
  if (score <= 4) return { riskLevel: 'rendah', interpretation: 'Minimal' };
  if (score <= 9) return { riskLevel: 'rendah', interpretation: 'Ringan' };
  if (score <= 14) return { riskLevel: 'sedang', interpretation: 'Sedang' };
  return { riskLevel: 'tinggi', interpretation: 'Berat' };
}

/**
 * Cut-off SRQ-20 sesuai WHO (1994).
 */
function classifySrq20(score) {
  if (score <= 5) return { riskLevel: 'rendah', interpretation: 'Sehat' };
  if (score <= 7) return { riskLevel: 'rendah', interpretation: 'Ringan' };
  if (score <= 12) return { riskLevel: 'sedang', interpretation: 'Sedang' };
  return { riskLevel: 'tinggi', interpretation: 'Berat' };
}

function classifyAssessment(type, score) {
  switch (type) {
    case 'phq9': return classifyPhq9(score);
    case 'gad7': return classifyGad7(score);
    case 'srq20': return classifySrq20(score);
    default: return null;
  }
}

/**
 * @openapi
 * /api/assessments/submit:
 *   post:
 *     tags: [Assessments]
 *     summary: Submit jawaban kuesioner asesmen psikologis
 *     security:
 *       - bearerAuth: []
 */
router.post('/submit', authMiddleware, (req, res) => {
  try {
    const { type, answers } = req.body || {};

    if (!type || !['gad7', 'phq9', 'srq20'].includes(type)) {
      return res.status(400).json({ error: 'Tipe asesmen wajib salah satu dari: gad7, phq9, srq20' });
    }
    if (!Array.isArray(answers) || answers.some((n) => typeof n !== 'number')) {
      return res.status(400).json({ error: 'answers wajib berupa array number' });
    }

    const score = answers.reduce((acc, n) => acc + n, 0);
    const classification = classifyAssessment(type, score);
    if (!classification) {
      return res.status(400).json({ error: 'Tipe asesmen tidak dikenal' });
    }

    const record = {
      assessmentId: uuidv4(),
      type,
      score,
      riskLevel: classification.riskLevel,
      interpretation: classification.interpretation,
      createdAt: new Date().toISOString(),
    };
    assessmentStore.unshift(record);

    return res.status(201).json(record);
  } catch (err) {
    return res.status(500).json({ error: 'Gagal memproses asesmen' });
  }
});

/**
 * @openapi
 * /api/assessments/history:
 *   get:
 *     tags: [Assessments]
 *     summary: Riwayat asesmen user yang sedang login
 *     security:
 *       - bearerAuth: []
 */
router.get('/history', authMiddleware, (_req, res) => {
  try {
    return res.status(200).json({ history: assessmentStore });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil riwayat asesmen' });
  }
});

module.exports = router;
module.exports.classifyPhq9 = classifyPhq9;
module.exports.classifyGad7 = classifyGad7;
module.exports.classifySrq20 = classifySrq20;
