/**
 * SIGAP UB — Entry point Express API Gateway
 *
 * Bertugas:
 *   - Mengatur middleware keamanan global (helmet, cors, body limit).
 *   - Mendaftarkan seluruh route /api/* (auth, assessments, triage, counseling).
 *   - Menyajikan dokumentasi Swagger UI di /api-docs.
 *   - Healthcheck publik di /api/health.
 *
 * Backend sengaja independen dari database — penyimpanan dilakukan via
 * in-memory store agar demo runnable tanpa Postgres aktif.
 *
 * @module sigap-backend
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const authRoutes = require('./routes/auth');
const assessmentsRoutes = require('./routes/assessments');
const triageRoutes = require('./routes/triage');
const counselingRoutes = require('./routes/counseling');

const API_VERSION = '1.0.0';
const PORT = Number(process.env.PORT || 3001);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const BODY_LIMIT = process.env.BODY_LIMIT || '1mb';

const app = express();

// ---------- Middleware global ----------
app.use(helmet());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: BODY_LIMIT }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ---------- Healthcheck (public) ----------
/**
 * @openapi
 * /api/health:
 *   get:
 *     tags: [System]
 *     summary: Healthcheck publik
 *     description: Endpoint publik (tanpa autentikasi) untuk memverifikasi bahwa backend berjalan normal. Digunakan oleh Docker healthcheck dan monitoring.
 *     responses:
 *       200:
 *         description: Backend berjalan normal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 uptime:
 *                   type: number
 *                   description: Uptime proses dalam detik
 *                   example: 3600.5
 *                 timestamp:
 *                   type: number
 *                   description: Unix timestamp saat ini (ms)
 *                   example: 1749820800000
 */
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    version: API_VERSION,
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// ---------- Dokumentasi API (Swagger UI) ----------
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'SIGAP UB API',
      version: API_VERSION,
      description:
        'API Gateway SIGAP UB — autentikasi SIAM, asesmen psikologis (PHQ-9, GAD-7, SRQ-20), triase klinis, dan pemesanan konseling.',
    },
    servers: [{ url: `http://localhost:${PORT}`, description: 'Local dev server' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: [
    path.join(__dirname, '*.js').split(path.sep).join('/'),
    path.join(__dirname, 'routes', '*.js').split(path.sep).join('/'),
  ],
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ---------- Routes utama (semua di-prefix /api) ----------
app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentsRoutes);
app.use('/api/triage', triageRoutes);
app.use('/api/counseling', counselingRoutes);

// ---------- 404 fallback ----------
app.use((req, res) => {
  res.status(404).json({ error: `Endpoint tidak ditemukan: ${req.method} ${req.originalUrl}` });
});

// ---------- Error handler global ----------
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[SIGAP] Unhandled error:', err);
  res.status(500).json({ error: 'Terjadi kesalahan internal pada server' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[SIGAP] Backend v${API_VERSION} siap di http://localhost:${PORT}`);
    console.log(`[SIGAP] Swagger UI: http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;
