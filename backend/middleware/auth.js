import { validateToken } from '../utils/tokenManager.js';
import { logSecurityEvent } from './securityAudit.js';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Strict Bearer schema check
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logSecurityEvent('UNAUTHORIZED_ACCESS_ATTEMPT', {
      path: req.originalUrl,
      method: req.method,
      reason: 'Missing or malformed Authorization header',
    }, req);

    return res.status(401).json({
      error: 'Authentication required. Authorization Bearer token must be provided.',
      code: 'AUTH_TOKEN_MISSING'
    });
  }

  const token = authHeader.substring(7).trim();

  // Basic sanity check against token injection / extreme sizes
  if (!token || token.length > 2048) {
    logSecurityEvent('SUSPICIOUS_TOKEN_LENGTH', {
      length: token.length,
      path: req.originalUrl,
    }, req);

    return res.status(401).json({
      error: 'Malformed authentication token.',
      code: 'AUTH_TOKEN_MALFORMED'
    });
  }

  try {
    const payload = validateToken(token);
    req.user = payload;
    next();
  } catch (error) {
    logSecurityEvent('TOKEN_VALIDATION_FAILED', {
      path: req.originalUrl,
      reason: error.message,
    }, req);

    return res.status(401).json({
      error: 'Session expired or token invalid. Please log in again.',
      code: 'AUTH_TOKEN_INVALID'
    });
  }
};

export default authMiddleware;
