const jwt = require('jsonwebtoken');
const config = require('../config/config');
const db = require('../config/db');

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.JWT_SECRET);

    const [rows] = await db.query(
      'SELECT id, full_name, username, email, role, avatar_url, bio FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists.' });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
}

// Optional auth for endpoints that can give extra data if logged in
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.JWT_SECRET);
      const [rows] = await db.query(
        'SELECT id, full_name, username, email, role, avatar_url, bio FROM users WHERE id = ?',
        [decoded.id]
      );
      if (rows && rows.length > 0) {
        req.user = rows[0];
      }
    }
  } catch (e) {
    // ignore token errors for optional auth
  }
  next();
}

module.exports = { authMiddleware, optionalAuth };
