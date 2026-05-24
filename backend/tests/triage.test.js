// SIGAP UB — Unit test untuk logika triase klinis
// Dijalankan dengan node --test (Node 20+ built-in test runner, tanpa dependency tambahan).
// Memvalidasi 3 skenario yang didokumentasikan di notebooks/triage_logic.md.

const test = require('node:test');
const assert = require('node:assert/strict');

const { classifyRisk } = require('../src/routes/triage');
const { classifyPhq9, classifyGad7, classifySrq20 } = require('../src/routes/assessments');

// ----------------- Cut-off per instrumen -----------------

test('PHQ-9 cut-off sesuai Kroenke et al. 2001', () => {
  assert.equal(classifyPhq9(0).riskLevel, 'rendah');     // Minimal
  assert.equal(classifyPhq9(4).riskLevel, 'rendah');     // batas atas Minimal
  assert.equal(classifyPhq9(5).riskLevel, 'rendah');     // Ringan
  assert.equal(classifyPhq9(9).riskLevel, 'rendah');     // batas atas Ringan
  assert.equal(classifyPhq9(10).riskLevel, 'sedang');    // Sedang
  assert.equal(classifyPhq9(14).riskLevel, 'sedang');    // batas atas Sedang
  assert.equal(classifyPhq9(15).riskLevel, 'tinggi');    // Sedang-Berat
  assert.equal(classifyPhq9(19).riskLevel, 'tinggi');    // batas atas Sedang-Berat
  assert.equal(classifyPhq9(20).riskLevel, 'kritis');    // Berat
  assert.equal(classifyPhq9(27).riskLevel, 'kritis');    // batas atas maksimum
});

test('GAD-7 cut-off sesuai Spitzer et al. 2006', () => {
  assert.equal(classifyGad7(0).riskLevel, 'rendah');
  assert.equal(classifyGad7(9).riskLevel, 'rendah');
  assert.equal(classifyGad7(10).riskLevel, 'sedang');
  assert.equal(classifyGad7(14).riskLevel, 'sedang');
  assert.equal(classifyGad7(15).riskLevel, 'tinggi');
  assert.equal(classifyGad7(21).riskLevel, 'tinggi');
});

test('SRQ-20 cut-off sesuai WHO 1994', () => {
  assert.equal(classifySrq20(0).riskLevel, 'rendah');
  assert.equal(classifySrq20(5).riskLevel, 'rendah');
  assert.equal(classifySrq20(7).riskLevel, 'rendah');
  assert.equal(classifySrq20(8).riskLevel, 'sedang');
  assert.equal(classifySrq20(12).riskLevel, 'sedang');
  assert.equal(classifySrq20(13).riskLevel, 'tinggi');
  assert.equal(classifySrq20(20).riskLevel, 'tinggi');
});

// ----------------- Skenario gabungan (sesuai notebook) -----------------

test('Skenario 1 (Rendah): phq9=3, gad7=2, srq20=4 → riskLevel rendah, confidence 1.00', () => {
  const result = classifyRisk(3, 2, 4);
  assert.equal(result.riskLevel, 'rendah');
  assert.equal(result.confidenceScore, 1.0);
  assert.equal(result.contributingFactors.length, 3);
});

test('Skenario 2 (Sedang): phq9=11, gad7=8, srq20=9 → riskLevel sedang, confidence 0.67', () => {
  const result = classifyRisk(11, 8, 9);
  assert.equal(result.riskLevel, 'sedang');
  assert.equal(result.confidenceScore, 0.67);
  assert.equal(result.contributingFactors.length, 2);
  const instruments = result.contributingFactors.map((f) => f.instrument).sort();
  assert.deepEqual(instruments, ['phq9', 'srq20']);
});

test('Skenario 3 (Tinggi): phq9=18, gad7=16, srq20=14 → riskLevel tinggi, confidence 1.00', () => {
  const result = classifyRisk(18, 16, 14);
  assert.equal(result.riskLevel, 'tinggi');
  assert.equal(result.confidenceScore, 1.0);
  assert.equal(result.contributingFactors.length, 3);
});

test('Skenario tambahan (Kritis murni): phq9=22, gad7=18, srq20=15', () => {
  const result = classifyRisk(22, 18, 15);
  assert.equal(result.riskLevel, 'kritis');
  // Hanya PHQ-9 yang mencapai level Kritis pada skor 22
  assert.equal(result.contributingFactors.length, 1);
  assert.equal(result.contributingFactors[0].instrument, 'phq9');
});

// ----------------- Edge cases -----------------

test('Skor nol di semua instrumen → riskLevel rendah dengan full confidence', () => {
  const result = classifyRisk(0, 0, 0);
  assert.equal(result.riskLevel, 'rendah');
  assert.equal(result.confidenceScore, 1.0);
});

test('Aturan max: satu instrumen tinggi mendominasi yang lain rendah', () => {
  // PHQ-9 = 20 (Kritis), sisanya 0 (Rendah)
  const result = classifyRisk(20, 0, 0);
  assert.equal(result.riskLevel, 'kritis');
  assert.equal(result.contributingFactors.length, 1);
  assert.equal(result.contributingFactors[0].instrument, 'phq9');
});
