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
 *     security:
 *       - bearerAuth: []
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
 *     security:
 *       - bearerAuth: []
 */
router.get('/slots', authMiddleware, (_req, res) => {
  try {
    return res.status(200).json({ slots: availableSlots });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil daftar slot' });
  }
});

module.exports = router;
