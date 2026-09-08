/**
 * Security Audit Logger Middleware
 * Records security-relevant events without storing sensitive credentials
 */

export const logSecurityEvent = (eventType, details, req = null) => {
  const timestamp = new Date().toISOString();
  const clientIp = req ? (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown') : 'system';
  const userAgent = req ? (req.headers['user-agent'] || 'unknown') : 'system';

  const entry = {
    timestamp,
    eventType,
    clientIp,
    userAgent,
    ...details,
  };

  // Structured security audit log
  console.warn(`[SECURITY AUDIT] [${timestamp}] [${eventType}] IP:${clientIp} - ${JSON.stringify(details)}`);
};

export const securityHeadersMiddleware = (req, res, next) => {
  // Additional defense-in-depth headers
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
};
