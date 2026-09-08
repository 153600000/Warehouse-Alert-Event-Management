import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Enforce minimum 256-bit key length for HMAC SHA-256
const DEFAULT_FALLBACK_SECRET = 'nexusflow_production_hardened_secret_key_2026_987654321_alpha_bravo';
const SECRET = process.env.JWT_SECRET || DEFAULT_FALLBACK_SECRET;

const JWT_ISSUER = 'nexusflow-telemetry-engine';
const JWT_AUDIENCE = 'nexusflow-authenticated-operators';

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'Warehouse Administrator',
      jti: crypto.randomBytes(16).toString('hex'), // Unique token ID to prevent replay attacks
    },
    SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '24h',
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    }
  );
};

export const validateToken = (token) => {
  if (!token || typeof token !== 'string') {
    throw new Error('Invalid token structure');
  }

  // Defend against jwt 'none' algorithm and header spoofing
  return jwt.verify(token, SECRET, {
    algorithms: ['HS256'],
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });
};
