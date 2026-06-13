// SIGAP UB — Routes autentikasi (simulasi SSO SIAM UB)
// Catatan: menggunakan data in-memory + JWT supaya backend bisa dijalankan
// tanpa database aktif. Pada implementasi produksi, panggilan ke SSO UB
// dilakukan di sini dan profil mahasiswa diambil dari endpoint SIAM resmi.

const express = require('express');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || authMiddleware.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Pengguna dummy — pada produksi diganti query ke SIAM UB
const mockUsers = [
  {
    nim: '255150300111053',
    password: 'SIGAP-UB123',
    nama: 'Arva Mada Jayastu',
    email: 'arva@student.ub.ac.id',
    fakultas: 'FILKOM',
    angkatan: 2025,
    role: 'mahasiswa',
  },
  {
    nim: '25515030111106',
    password: 'SIGAP-UB123',
    nama: 'Fristian Boas Nathaniel',
    email: 'fristian@student.ub.ac.id',
    fakultas: 'FILKOM',
    angkatan: 2025,
    role: 'mahasiswa',
  },
  {
    nim: '255150301111027',
    password: 'SIGAP-UB123',
    nama: 'Farrel Arzaqia Mecca',
    email: 'farrel@student.ub.ac.id',
    fakultas: 'FILKOM',
    angkatan: 2025,
    role: 'mahasiswa',
  },
  {
    nim: 'KN-001',
    password: 'SIGAP-UB123',
    nama: 'Dr. Sari Puspita, M.Psi.',
    email: 'konselor@ub.ac.id',
    fakultas: 'Psikologi',
    angkatan: 0,
    role: 'konselor',
  },
];

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login simulasi SSO SIAM UB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nim: { type: string, example: "255150300111053" }
 *               password: { type: string, example: "SIGAP-UB123" }
 *     responses:
 *       200: { description: Login sukses, token dikembalikan }
 *       400: { description: Body request tidak valid }
 *       401: { description: Kredensial salah }
 */
router.post('/login', (req, res) => {
  try {
    const { nim, password } = req.body || {};

    if (!nim || !password) {
      return res.status(400).json({ error: 'NIM dan password wajib diisi' });
    }

    const user = mockUsers.find((u) => (u.nim === nim || u.email === nim) && u.password === password);
    if (!user) {
      return res.status(401).json({ error: 'Kombinasi NIM dan password salah' });
    }

    const tokenPayload = {
      nim: user.nim,
      nama: user.nama,
      fakultas: user.fakultas,
      role: user.role,
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.status(200).json({
      token,
      user: {
        nim: user.nim,
        nama: user.nama,
        fakultas: user.fakultas,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Kesalahan internal saat memproses login' });
  }
});

/**
 * @openapi
 * /api/auth/verify:
 *   get:
 *     tags: [Auth]
 *     summary: Verifikasi JWT yang sedang aktif
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Token valid, data user dikembalikan }
 *       401: { description: Token tidak valid atau kadaluarsa }
 */
router.get('/verify', authMiddleware, (req, res) => {
  try {
    return res.status(200).json({ user: req.user });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal memverifikasi token' });
  }
});

module.exports = router;
