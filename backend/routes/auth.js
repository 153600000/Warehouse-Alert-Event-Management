import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateToken, validateToken } from '../utils/tokenManager.js';
import { logSecurityEvent } from '../middleware/securityAudit.js';

const router = express.Router();

// Salted bcrypt hash for password "password" (10 salt rounds)
// $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi is standard bcrypt test hash
const SALT_ROUNDS = 10;
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('password', SALT_ROUNDS);

const USERS = {
  admin: {
    id: 'USR-001',
    username: 'admin',
    name: 'Chief Logistics Officer (Admin)',
    email: 'admin@warehouse.internal',
    passwordHash: ADMIN_PASSWORD_HASH,
    role: 'Facility Lead & Operations Admin',
    department: 'Smart Fulfillment Logistics',
    location: 'Building B - Distribution Hub',
    joined: '2023-01-15T09:00:00Z',
  },
};

/**
 * Constant-time string comparator to prevent timing analysis attacks
 */
const safeCompare = (a, b) => {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};

  // Input validation & sanitization
  if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    logSecurityEvent('MALFORMED_LOGIN_PAYLOAD', { bodyKeys: Object.keys(req.body || {}) }, req);
    return res.status(400).json({
      error: 'Invalid request. Username and password strings are required.',
      code: 'INVALID_INPUT'
    });
  }

  const cleanUsername = username.trim().toLowerCase().slice(0, 64);
  const cleanPassword = password.slice(0, 128); // prevent hash DOS via huge strings

  const user = USERS[cleanUsername];

  if (!user) {
    // Perform dummy hash comparison to prevent timing-based user enumeration
    await bcrypt.compare(cleanPassword, ADMIN_PASSWORD_HASH);

    logSecurityEvent('AUTH_FAILURE_USER_NOT_FOUND', { attemptedUser: cleanUsername }, req);
    return res.status(401).json({
      error: 'Invalid credentials. Access denied.',
      code: 'INVALID_CREDENTIALS'
    });
  }

  // Verify password using bcrypt salted hashing
  const isMatch = await bcrypt.compare(cleanPassword, user.passwordHash);

  if (!isMatch) {
    logSecurityEvent('AUTH_FAILURE_INVALID_PASSWORD', { attemptedUser: cleanUsername }, req);
    return res.status(401).json({
      error: 'Invalid credentials. Access denied.',
      code: 'INVALID_CREDENTIALS'
    });
  }

  const token = generateToken(user);

  logSecurityEvent('AUTH_SUCCESS', { user: user.username }, req);

  // Strip password hash from returned object
  const { passwordHash, ...safeUserData } = user;

  return res.json({
    token,
    user: safeUserData,
    expiresIn: '24h',
    message: 'Authentication successful',
  });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  logSecurityEvent('AUTH_LOGOUT', {}, req);
  res.json({ success: true, message: 'Session closed successfully' });
});

// GET /api/auth/validate
router.get('/validate', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false, error: 'No token supplied' });
  }

  const token = authHeader.substring(7).trim();

  try {
    const payload = validateToken(token);
    const user = USERS['admin'];

    const { passwordHash, ...safeUserData } = user;

    return res.json({
      valid: true,
      user: {
        ...safeUserData,
        tokenExpiry: new Date(payload.exp * 1000).toISOString(),
      },
    });
  } catch (error) {
    return res.status(401).json({ valid: false, error: 'Session expired or invalid' });
  }
});

export default router;
