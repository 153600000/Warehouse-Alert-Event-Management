import express from 'express';
import {
  generateSummaryData,
  generateAlertsData,
  generateHistoryData,
} from '../utils/dataGenerator.js';

const router = express.Router();

// GET /api/dashboard/summary
router.get('/summary', (req, res) => {
  const data = generateSummaryData();
  res.json(data);
});

// Whitelist of valid severity values
const ALLOWED_SEVERITIES = new Set(['ALL', 'CRITICAL', 'WARNING', 'INFO']);

// GET /api/dashboard/alerts
router.get('/alerts', (req, res) => {
  const data = generateAlertsData();
  const rawSeverity = (req.query.severity || 'ALL').toString().toUpperCase();
  const severity = ALLOWED_SEVERITIES.has(rawSeverity) ? rawSeverity : 'ALL';

  let filteredAlerts = [...data.alerts];

  if (severity !== 'ALL') {
    filteredAlerts = filteredAlerts.filter(a => a.severity === severity);
  }

  // Safe search sanitization to prevent ReDoS attacks
  if (req.query.search) {
    const searchParam = req.query.search.toString().slice(0, 80).toLowerCase().trim();
    if (searchParam) {
      filteredAlerts = filteredAlerts.filter(a =>
        a.message.toLowerCase().includes(searchParam) ||
        a.source.toLowerCase().includes(searchParam) ||
        a.id.toLowerCase().includes(searchParam) ||
        (a.metric && a.metric.toLowerCase().includes(searchParam))
      );
    }
  }

  res.json({
    ...data,
    alerts: filteredAlerts,
  });
});

// Whitelist of valid time ranges
const ALLOWED_RANGES = new Set(['1h', '24h', '7d']);

// GET /api/dashboard/history
router.get('/history', (req, res) => {
  const rawRange = (req.query.range || '1h').toString().toLowerCase();
  const range = ALLOWED_RANGES.has(rawRange) ? rawRange : '1h';

  const data = generateHistoryData(range);
  res.json(data);
});

export default router;
