// SIGAP UB — Entry point Express API Gateway
// Mengatur middleware global, mendaftarkan seluruh route /api/*, menyajikan
// dokumentasi Swagger di /api-docs, dan mengaktifkan endpoint healthcheck.
// Backend ini sengaja independen dari database — semua data digunakan
// dari in-memory store agar demo runnable tanpa Postgres aktif.

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

const PORT = Number(process.env.PORT || 3001);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const app = express();

// ---------- Middleware global ----------
app.use(helmet());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ---------- Healthcheck (public) ----------
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

// ---------- Dokumentasi API (Swagger UI) ----------
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'SIGAP UB API',
      version: '1.0.0',
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
  apis: [path.join(__dirname, 'routes', '*.js')],
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
    console.log(`[SIGAP] Backend siap di http://localhost:${PORT}`);
    console.log(`[SIGAP] Swagger UI: http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;
