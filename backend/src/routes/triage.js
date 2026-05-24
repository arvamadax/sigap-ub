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

/**
 * @openapi
 * /api/triage/classify:
 *   post:
 *     tags: [Triage]
 *     summary: Klasifikasi risiko gabungan dari skor PHQ-9, GAD-7, SRQ-20
 *     security:
 *       - bearerAuth: []
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

module.exports = router;
module.exports.classifyRisk = classifyRisk;
