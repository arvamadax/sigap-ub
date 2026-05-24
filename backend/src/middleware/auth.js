// SIGAP UB — Middleware verifikasi JWT
// Dipasang di seluruh route yang dilindungi (kecuali /auth/login dan /health).
// Memvalidasi header Authorization: Bearer <token> dan menempelkan payload
// terverifikasi ke req.user agar handler downstream bisa mengakses identitas user.

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sigap-dev-secret-change-me-immediately';

function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Token tidak valid atau kadaluarsa' });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    // Token expired, signature invalid, atau format malformed
    return res.status(401).json({ error: 'Token tidak valid atau kadaluarsa' });
  }
}

module.exports = authMiddleware;
module.exports.JWT_SECRET = JWT_SECRET;
