# Contributing to Multi-Modal Real-Time Dashboard Web App

Thank you for your interest in contributing! This document outlines our development process, branching strategies, and standards.

---

## 🛠️ Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/multi-modal-real-time-dashboard.git
   cd multi-modal-real-time-dashboard
   ```

2. **Install all dependencies**:
   ```bash
   npm run install:all
   ```

3. **Start Development Servers**:
   - Backend: `npm run backend` (Runs on `http://localhost:3001`)
   - Frontend: `npm run frontend` (Runs on `http://localhost:5173`)

---

## 🌿 Git Branching Strategy

- `main` / `master`: Production-ready releases.
- `develop`: Integration branch for tested features.
- Feature branches: `feature/feature-name`
- Bug fix branches: `fix/bug-description`
- Security patches: `security/vulnerability-fix`

---

## 🧪 Verification & Testing Requirements

Before opening a pull request:
1. **Compile TypeScript & Production Bundle**:
   ```bash
   npm run build
   ```
2. **Execute Full System End-to-End Suite**:
   ```bash
   npm run test:system
   ```
3. **Execute Cyber-Security Test Suite**:
   ```bash
   node verify-security.js
   ```

---

## 📐 Coding Standards

- **TypeScript**: Strict mode enabled. Explicit type annotations on exported functions and state.
- **Components**: Functional components with hooks and clean separation of concerns.
- **Styling**: CSS custom variables defined in `src/styles/theme.css` with WCAG AA compliance for both Light and Dark modes.
- **Security**: Never log passwords or sensitive keys. Use parameterized queries/sanitization.

---

## 📬 Submitting a Pull Request

1. Fork the repo and create your branch from `main`.
2. Ensure all CI tests and builds pass locally.
3. Commit using conventional commits (e.g. `feat: add conveyor tension telemetry`, `fix: handle socket reconnect jitter`).
4. Push to your fork and submit a PR referencing any active issues.
