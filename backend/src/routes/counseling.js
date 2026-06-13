// SIGAP UB — Routes pemesanan sesi konseling
// Menyediakan slot statis dan menerima pemesanan dari mahasiswa.
// Penyimpanan in-memory hanya untuk demo; produksi memakai tabel
// counseling_bookings di PostgreSQL.

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const bookingStore = [];

// Slot mock — pada produksi diambil dari availability konselor di DB
const availableSlots = [
  { date: '2026-06-20', time: '09:00 - 10:30 WIB', available: true },
  { date: '2026-06-20', time: '11:00 - 12:30 WIB', available: true },
  { date: '2026-06-20', time: '13:30 - 15:00 WIB', available: false },
  { date: '2026-06-23', time: '09:00 - 10:30 WIB', available: true },
  { date: '2026-06-23', time: '11:00 - 12:30 WIB', available: true },
  { date: '2026-06-25', time: '09:00 - 10:30 WIB', available: true },
  { date: '2026-06-25', time: '13:30 - 15:00 WIB', available: true },
];

/**
 * @openapi
 * /api/counseling/book:
 *   post:
 *     tags: [Counseling]
 *     summary: Pesan sesi konseling baru
 *     description: Membuat janji temu konseling pada slot yang tersedia. Slot akan ditandai tidak tersedia setelah berhasil dipesan.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [date, time, category]
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Tanggal sesi konseling (YYYY-MM-DD)
 *                 example: "2026-06-20"
 *               time:
 *                 type: string
 *                 description: Slot waktu sesi
 *                 example: "09:00 - 10:30 WIB"
 *               category:
 *                 type: string
 *                 description: Kategori hambatan psikologis
 *                 example: "Kecemasan Akademik"
 *               notes:
 *                 type: string
 *                 nullable: true
 *                 description: Catatan opsional dari mahasiswa
 *                 example: "Stres menjelang UAS"
 *     responses:
 *       201:
 *         description: Booking berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookingId:
 *                   type: string
 *                   format: uuid
 *                   example: "b2c3d4e5-f6a7-8901-bcde-f23456789012"
 *                 status:
 *                   type: string
 *                   example: pending
 *                 scheduledAt:
 *                   type: string
 *                   example: "2026-06-20 09:00 - 10:30 WIB"
 *                 category:
 *                   type: string
 *                   example: "Kecemasan Akademik"
 *                 notes:
 *                   type: string
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Field wajib kosong atau slot sudah penuh
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *       404:
 *         description: Slot konseling tidak ditemukan
 */
router.post('/book', authMiddleware, (req, res) => {
  try {
    const { date, time, category, notes } = req.body || {};

    if (!date || !time || !category) {
      return res.status(400).json({ error: 'date, time, dan category wajib diisi' });
    }

    const slot = availableSlots.find((s) => s.date === date && s.time === time);
    if (!slot) {
      return res.status(404).json({ error: 'Slot konseling tidak ditemukan' });
    }
    if (!slot.available) {
      return res.status(400).json({ error: 'Slot konseling sudah penuh, silakan pilih slot lain' });
    }

    const booking = {
      bookingId: uuidv4(),
      status: 'pending',
      scheduledAt: `${date} ${time}`,
      category,
      notes: notes || null,
      createdAt: new Date().toISOString(),
    };
    bookingStore.push(booking);
    slot.available = false;

    return res.status(201).json(booking);
  } catch (err) {
    return res.status(500).json({ error: 'Gagal memproses pemesanan konseling' });
  }
});

/**
 * @openapi
 * /api/counseling/slots:
 *   get:
 *     tags: [Counseling]
 *     summary: Daftar slot konseling yang tersedia
 *     description: Mengembalikan semua slot konseling beserta status ketersediaan. Slot yang sudah dipesan akan memiliki available=false.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar slot konseling
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 slots:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2026-06-20"
 *                       time:
 *                         type: string
 *                         example: "09:00 - 10:30 WIB"
 *                       available:
 *                         type: boolean
 *                         example: true
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 */
router.get('/slots', authMiddleware, (_req, res) => {
  try {
    return res.status(200).json({ slots: availableSlots });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil daftar slot' });
  }
});

module.exports = router;
