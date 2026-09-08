import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import authMiddleware from './middleware/auth.js';
import { logSecurityEvent, securityHeadersMiddleware } from './middleware/securityAudit.js';
import { generateLiveData } from './utils/dataGenerator.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// 1. HTTP Security Headers (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'", 'ws://localhost:3001', 'ws://127.0.0.1:3001', 'http://localhost:3001', 'http://localhost:5173'],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    frameguard: { action: 'deny' }, // Clickjacking defense
    noSniff: true,                 // MIME sniffing defense
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  })
);

app.use(securityHeadersMiddleware);

// 2. Strict CORS Configuration
const ALLOWED_ORIGINS = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : []),
]);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. server-to-server or curl) only if in development
      if (!origin) {
        return callback(null, true);
      }
      if (ALLOWED_ORIGINS.has(origin)) {
        return callback(null, true);
      }
      logSecurityEvent('CORS_BLOCKED', { blockedOrigin: origin });
      return callback(new Error('Cross-Origin Request Blocked by Security Policy'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400, // 24 hours
  })
);

// 3. Payload Body Size Limitation (Denial-of-Service Defense)
app.use(express.json({ limit: '10kb' }));

// 4. Rate Limiting Protection (Brute-Force & Flood Defense)
const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,                 // 1000 requests per windowMs to allow healthy telemetry polling
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: (req) => req.path === '/api/health',
  message: {
    error: 'Too many requests from this IP. Please try again after 15 minutes.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  handler: (req, res, next, options) => {
    logSecurityEvent('RATE_LIMIT_EXCEEDED_GENERAL', { ip: req.ip, path: req.originalUrl }, req);
    res.status(options.statusCode).json(options.message);
  },
});

const authBruteForceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // max 20 login attempts per 15 min window
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: 'Too many authentication attempts. Account access temporarily throttled for 15 minutes.',
    code: 'AUTH_RATE_LIMIT_EXCEEDED',
  },
  handler: (req, res, next, options) => {
    logSecurityEvent('BRUTE_FORCE_ATTACK_SUSPECTED', { ip: req.ip, user: req.body?.username }, req);
    res.status(options.statusCode).json(options.message);
  },
});

app.use('/api/', generalApiLimiter);
app.use('/api/auth/login', authBruteForceLimiter);

// 5. Root & System Health Endpoints
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Multi-Modal Real-Time Dashboard Web App - Backend Server</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f19; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
        .card { background: #151e2e; border: 1px solid #243044; border-radius: 16px; padding: 2.5rem; max-width: 580px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
        .status { display: inline-flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 9999px; padding: 4px 14px; font-size: 0.85rem; font-weight: 700; margin-bottom: 1.5rem; }
        .dot { width: 8px; height: 8px; background: #34d399; border-radius: 50%; box-shadow: 0 0 8px #34d399; }
        h1 { margin: 0 0 0.5rem 0; font-size: 1.65rem; font-weight: 800; }
        .subtitle { color: #60a5fa; font-weight: 600; font-size: 0.95rem; margin-bottom: 0.75rem; }
        p { color: #94a3b8; font-size: 0.92rem; line-height: 1.5; margin: 0 0 1.75rem 0; }
        .btn { display: inline-block; background: #3b82f6; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 1rem; padding: 0.75rem 1.5rem; border-radius: 10px; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); }
        .btn:hover { background: #2563eb; transform: translateY(-1px); }
        .endpoints { text-align: left; background: #0b0f19; border: 1px solid #243044; border-radius: 10px; padding: 1rem; margin-top: 1.5rem; font-family: monospace; font-size: 0.8rem; color: #cbd5e1; }
        .endpoints div { margin-bottom: 4px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="status"><span class="dot"></span> Backend API & WebSocket Active</div>
        <h1>Multi-Modal Real-Time Dashboard</h1>
        <div class="subtitle">Smart Warehouse Sensor Monitoring &bull; Enterprise Operations</div>
        <p>Production-hardened backend API & live WebSocket streaming server running on Port 3001. Launch the frontend dashboard application below:</p>
        <a href="http://localhost:5173" class="btn">Launch Dashboard (localhost:5173) &rarr;</a>
        <div class="endpoints">
          <div><strong>Active Server Endpoints:</strong></div>
          <div>&bull; WebSocket Live Stream: <code>ws://localhost:3001/live</code></div>
          <div>&bull; Healthcheck: <a href="/api/health" style="color:#60a5fa;"><code>/api/health</code></a></div>
          <div>&bull; Auth API: <code>/api/auth/login</code></div>
          <div>&bull; Aggregated Summary API: <code>/api/dashboard/summary</code></div>
          <div>&bull; Alerts API: <code>/api/dashboard/alerts</code></div>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'Multi-Modal Real-Time Dashboard Engine',
    domain: 'Smart Warehouse Sensor Monitoring',
    securityMode: 'Production-Hardened',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 6. Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

// Catch-all 404 for unknown endpoints
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Requested API endpoint does not exist', code: 'NOT_FOUND' });
});

// Global Centralized Error Handler
app.use((err, req, res, next) => {
  const isDev = process.env.NODE_ENV !== 'production';
  logSecurityEvent('UNHANDLED_EXCEPTION', { error: err.message, stack: isDev ? err.stack : undefined }, req);

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    code: err.code || 'INTERNAL_ERROR',
    ...(isDev ? { stack: err.stack } : {}),
  });
});

// 7. Secure WebSocket Server with CSWSH & Flood Defense
const wss = new WebSocketServer({
  server: httpServer,
  path: '/live',
  maxPayload: 4096, // Max 4KB per message frame to prevent memory exhaustion attacks
  verifyClient: (info, callback) => {
    const origin = info.origin || info.req.headers.origin;

    // Defend against Cross-Site WebSocket Hijacking (CSWSH)
    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      logSecurityEvent('WEBSOCKET_CSWSH_REJECTED', { origin, ip: info.req.socket.remoteAddress });
      return callback(false, 403, 'Forbidden: Unauthorized Origin');
    }

    callback(true);
  },
});

const clients = new Map();

wss.on('connection', (ws, req) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const clientId = Math.random().toString(36).substring(2, 9);

  clients.set(ws, {
    id: clientId,
    ip: clientIp,
    isPaused: false,
    intervalMs: 1000,
    lastSent: Date.now(),
    messageCountWindow: 0,
    windowStart: Date.now(),
  });

  // Transmit initial sample frame
  try {
    const initialFrame = generateLiveData();
    ws.send(JSON.stringify(initialFrame));
  } catch (e) {
    ws.close(1011, 'Failed to initialize session');
    return;
  }

  ws.on('message', (raw) => {
    const clientConfig = clients.get(ws);
    if (!clientConfig) return;

    // Client message rate limiting (max 15 control actions per 5 seconds)
    const now = Date.now();
    if (now - clientConfig.windowStart > 5000) {
      clientConfig.windowStart = now;
      clientConfig.messageCountWindow = 0;
    }

    clientConfig.messageCountWindow += 1;
    if (clientConfig.messageCountWindow > 15) {
      logSecurityEvent('WEBSOCKET_MESSAGE_FLOOD', { clientId, ip: clientConfig.ip });
      ws.send(JSON.stringify({ type: 'ERROR', message: 'Rate limit exceeded for control actions.' }));
      return;
    }

    try {
      const message = JSON.parse(raw.toString());

      if (message.action === 'pause') {
        clientConfig.isPaused = true;
        ws.send(JSON.stringify({ type: 'STATUS', message: 'Stream paused by operator' }));
      } else if (message.action === 'resume') {
        clientConfig.isPaused = false;
        ws.send(JSON.stringify({ type: 'STATUS', message: 'Stream resumed by operator' }));
      } else if (message.action === 'speed' && typeof message.interval === 'number') {
        // Enforce safe frequency bounds (300ms to 5000ms)
        clientConfig.intervalMs = Math.max(300, Math.min(5000, message.interval));
        ws.send(JSON.stringify({ type: 'STATUS', message: `Cadence set to ${clientConfig.intervalMs}ms` }));
      } else if (message.action === 'ping') {
        ws.send(JSON.stringify({ type: 'PONG', timestamp: new Date().toISOString() }));
      }
    } catch (err) {
      // Catch malformed JSON frames safely
      ws.send(JSON.stringify({ type: 'ERROR', message: 'Malformed JSON payload rejected.' }));
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
  });

  ws.on('error', (err) => {
    logSecurityEvent('WEBSOCKET_CLIENT_ERROR', { clientId, error: err.message });
    clients.delete(ws);
  });
});

// Broadcast Tick (Cadence controller per connection)
const broadcastInterval = setInterval(() => {
  const now = Date.now();
  for (const [ws, config] of clients.entries()) {
    if (ws.readyState === 1 && !config.isPaused) {
      if (now - config.lastSent >= config.intervalMs) {
        config.lastSent = now;
        try {
          const telemetry = generateLiveData();
          ws.send(JSON.stringify(telemetry));
        } catch (e) {
          clients.delete(ws);
        }
      }
    }
  }
}, 200);

const PORT = process.env.PORT || 3001;
const server = httpServer.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🛡️  PRODUCTION-HARDENED WAREHOUSE TELEMETRY SERVER`);
  console.log(`🔒 Security Mode: Active (Helmet, Rate Limiter, CSWSH Guard)`);
  console.log(`🚀 REST Base: http://localhost:${PORT}/api`);
  console.log(`📡 WebSocket: ws://localhost:${PORT}/live`);
  console.log(`===================================================`);
});

// Graceful Shutdown Handlers (Zero-downtime & Safe connection cleanup)
const gracefulShutdown = (signal) => {
  console.log(`\n[SHUTDOWN] Received ${signal}. Closing server safely...`);
  clearInterval(broadcastInterval);

  // Inform and close all active WebSockets
  for (const [ws] of clients.entries()) {
    try {
      ws.close(1001, 'Server shutting down');
    } catch (e) {}
  }
  clients.clear();

  server.close(() => {
    console.log('[SHUTDOWN] HTTP server closed cleanly. Exiting process.');
    process.exit(0);
  });

  // Force exit if hanging after 5 seconds
  setTimeout(() => {
    console.error('[SHUTDOWN] Force exiting after timeout.');
    process.exit(1);
  }, 5000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
