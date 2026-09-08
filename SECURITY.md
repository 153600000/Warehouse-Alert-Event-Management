# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

---

## Reporting a Vulnerability

We take the security of the **Multi-Modal Real-Time Dashboard Web App** seriously. If you discover a security vulnerability, please do **NOT** report it through public GitHub issues.

Instead, please report vulnerabilities by contacting the maintainers securely or opening a GitHub Private Security Advisory.

Please include the following details:
1. Description of the vulnerability and attack vector.
2. Steps to reproduce or proof-of-concept payload.
3. Potential impact on the system or data confidentiality/integrity.

### Response SLA
- **Initial Response**: Within 24–48 hours.
- **Triage & Patch Deployment**: Critical vulnerabilities prioritized within 72 hours.
- **Public Disclosure**: Coordinated disclosure after remediation is published.

---

## Implemented Security Controls

- **HTTP Protection**: Helmet with strict Content-Security-Policy (CSP), HSTS, and X-Frame-Options (`DENY`).
- **DDoS / Flooding Defense**: `express-rate-limit` on general API routes (1,000 req / 15m) and authentication routes (20 req / 15m).
- **DoS Payload Limits**: Strict 10KB incoming request body ceiling (`413 Payload Too Large`).
- **CSWSH Defense**: Strict WebSocket Origin validation during HTTP handshake upgrade (`403 Forbidden`).
- **Cryptographic Storage**: 10-round salted Bcrypt password hashing and timing-attack resilient verification.
- **Client Shielding**: React Error Boundary isolating runtime component failures.
