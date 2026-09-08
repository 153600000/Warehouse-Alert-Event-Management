# Full-Stack Real-Time Dashboard Web Application
## Complete Development Prompt, Specification & Implementation Guide

**Status**: Production-Ready | **Version**: 1.0 | **Estimated Duration**: 48 hours (6 days)

---

## TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Core Requirements](#core-requirements)
3. [Tech Stack](#tech-stack)
4. [Domain Selection](#domain-selection)
5. [Application Architecture](#application-architecture)
6. [Implementation Roadmap](#implementation-roadmap)
7. [Code Templates](#code-templates)
8. [Testing Strategy](#testing-strategy)
9. [Deployment & Final Checklist](#deployment--final-checklist)
10. [Quick Reference](#quick-reference)

---

## PROJECT OVERVIEW

### 🎯 Mission Statement

Build a **production-ready, multi-page dashboard web application** that demonstrates:
- Real-time data streaming with live updates (WebSocket/SSE)
- Periodic API polling with aggregated data
- Professional UI with consistent theming & animations
- Robust session/authentication management
- Multi-page routing and sophisticated state management
- Rich interactivity and user controls

### 📊 Project Scope

| Aspect | Specification |
|--------|--------------|
| **Frontend** | React 18+, TypeScript, Zustand, Framer Motion |
| **Backend** | Node.js/Express, WebSocket, JWT Authentication |
| **Pages** | 6-8 distinct pages with routing |
| **Real-Time** | 3+ live metrics updating via WebSocket (500ms-2s interval) |
| **Polling** | 2+ API endpoints with 5-15s fetch intervals |
| **Interactivity** | 2+ multi-modal interaction types |
| **Theming** | Professional color palette, dark/light mode |
| **Authentication** | Login/logout, session management, token validation |
| **Evaluation Focus** | Functional correctness (40%), UI Quality (30%), Code Quality (20%), Feature Completeness (10%) |

---

## CORE REQUIREMENTS

### 1. Live Real-Time Data Ingestion ✨

Create at least **one dashboard page** displaying live-updating metrics streamed from backend.

**Mandatory UI Elements:**
- [ ] At least **3 different real-time metrics** (numeric values fluctuating over time)
- [ ] **LIVE indicator badge** (visible, pulsing or animated)
- [ ] **Last update timestamp** (e.g., "Updated 2 seconds ago")
- [ ] **Visibly changing data** over time (bars growing, numbers updating, status changes)
- [ ] Auto-refresh without manual page reload

**Backend Mechanism:**
- Use **WebSocket**, **Server-Sent Events (SSE)**, long-polling, or equivalent
- Send updates every **500ms to 2 seconds**
- Include: timestamp, numeric values, status/categorical field, event labels

**Example Payload:**
```json
{
  "timestamp": "2024-01-15T14:32:45Z",
  "metrics": {
    "temperature": 72.5,
    "humidity": 45,
    "pressure": 1013.25
  },
  "status": "NOMINAL",
  "event": "SENSOR_UPDATE"
}
```

---

### 2. Periodic API Polling (5-15s Intervals) 📊

Implement a **separate section/page** that periodically fetches aggregated data.

**Mandatory UI Elements:**
- [ ] "Last Updated" timestamp showing when data was refreshed
- [ ] Fetches every **X seconds** (recommended: 5-15s)
- [ ] Shows **aggregated/derived data** (NOT raw live stream)
- [ ] Data logically differs from live feed

**Example Periodic Data:**

**Endpoint 1**: `GET /api/dashboard/summary`
- Average metrics over last 10 minutes
- Total events/alerts in time window
- Trend comparison (↑ or ↓ vs previous period)

**Endpoint 2**: `GET /api/dashboard/alerts`
- Filtered alerts based on thresholds
- Event history
- Sorted by severity or timestamp

**Example Response Structure:**
```json
{
  "summary": {
    "avgTemperature": 71.8,
    "totalEvents": 42,
    "criticalCount": 3,
    "trend": {
      "temperature": -0.5,
      "direction": "DOWN"
    }
  },
  "lastUpdated": "2024-01-15T14:35:00Z"
}
```

---

### 3. Consistent Theming & Color System 🎨

Implement a **unified design language** across all pages.

**Color Palette Definition:**
```css
:root {
  /* Primary */
  --primary-color: #1e40af;        /* Deep blue */
  --primary-hover: #1e3a8a;
  --primary-light: #dbeafe;
  
  /* Secondary */
  --secondary-color: #059669;      /* Green */
  --secondary-hover: #047857;
  
  /* Accent */
  --accent-color: #dc2626;         /* Red for alerts */
  
  /* Neutral */
  --bg-primary: #ffffff;
  --bg-secondary: #f3f4f6;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --text-disabled: #d1d5db;
  
  /* Status */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1f2937;
    --bg-secondary: #111827;
    --text-primary: #f3f4f6;
    --text-secondary: #d1d5db;
  }
}
```

**Apply Consistently To:**
- [ ] Login/Entry page
- [ ] Dashboard pages
- [ ] Navigation/Header
- [ ] Cards and widgets
- [ ] Buttons (primary, secondary, danger)
- [ ] Forms and inputs
- [ ] Charts and visualizations
- [ ] Alerts/Toasts
- [ ] Settings page

**Contrast Requirements:**
- [ ] Text-to-background: WCAG AA minimum 4.5:1
- [ ] Components readable in both light and dark modes
- [ ] No color-only information conveyance

---

### 4. Session Management & Authentication 🔐

Implement frontend session handling with backend validation.

**Mandatory Features:**
- [ ] **Login Page** with dummy credentials (e.g., username/password form)
- [ ] **Protected Routes** (dashboard area redirects to login if not authenticated)
- [ ] **Logout Functionality** (clear session, redirect to login)
- [ ] **Session Expiration Handling** (detect expired/invalid token, redirect)
- [ ] **Safe State Transitions** (abort API calls if session expires mid-request)
- [ ] **Error Messages** (invalid credentials, session expired, access denied)

**Demo Credentials:**
```
Username: admin
Password: password
```

**Backend Authentication Endpoints:**
```
POST /api/auth/login
  Request: { username: string, password: string }
  Response: { token: string, user: { id, name, email } }

POST /api/auth/logout
  Request: {}
  Response: { success: boolean }

GET /api/auth/validate
  Request: (requires Authorization header)
  Response: { valid: boolean, user: {...} }
```

**Authentication Flow:**
```
1. User lands on app → redirected to /login if no session
2. User enters credentials → POST /api/auth/login
3. Backend returns token/session → store in localStorage
4. User redirected to /dashboard
5. Protected routes check for valid token
6. If expired during API call → catch error → redirect to login
```

---

### 5. Multi-Page Application (5-6 Pages) 📄

Build a routing-based multi-page experience with React Router or equivalent.

**Minimum Page Structure:**

**1. Public Entry Page** (`/login` or `/`)
- Login form with email/password
- Welcome message or branding
- Links to sign up (optional dummy link)
- Consistent themed login card

**2. Dashboard Overview** (`/dashboard`)
- Live real-time metrics (3+ KPIs)
- LIVE indicator and timestamp
- Quick stats widgets
- Mini charts or progress bars
- Link to detailed pages

**3. Analytics / Trends Page** (`/analytics`)
- Periodic API data display
- Line charts, bar charts, or area charts
- Trend indicators (↑↓)
- Time range selector (optional: last hour/day/week)
- Comparison metrics

**4. Alerts / Events Page** (`/alerts`)
- Event list/table with filtering
- Click row to see details (modal/drawer)
- Severity badges (CRITICAL, WARN, INFO)
- Timestamp and event description
- Pagination or infinite scroll

**5. Settings / Preferences Page** (`/settings`)
- Theme selector (dark/light mode)
- Live update frequency toggle
- Alert threshold sliders
- Pause/resume live stream controls
- Save preferences to localStorage

**6. Profile / Session Activity Page** (`/profile`)
- Display logged-in user info
- Last login time
- Session details
- Logout button
- Optional: Activity history

**Navigation:**
- [ ] Consistent header/sidebar with links to all pages
- [ ] Active route highlighting
- [ ] Smooth page transitions
- [ ] Mobile-friendly navigation (hamburger menu or mobile nav)

---

### 6. Domain Selection & Coherence 🏢

Choose **ONE domain** and maintain consistency throughout.

**Suggested Domains** (or create your own):
- **Smart Warehouse Monitoring**: temperature, humidity, package count, shelf status
- **Fleet/Vehicle Telemetry**: GPS location, fuel level, engine health, driver metrics
- **IoT Environment Control**: room temperature, air quality, lighting levels, occupancy
- **Stock/Crypto Dashboard**: price, volume, market cap, volatility, trade alerts
- **Campus Event Tracker**: event attendance, traffic flow, capacity metrics
- **Fitness Metrics Tracker**: heart rate, steps, calories, workout sessions
- **E-Commerce Analytics**: sales revenue, conversion rate, cart abandonment, traffic

**Consistency Requirements:**
- [ ] Use domain-relevant metric names (not generic "value1, value2")
- [ ] Domain visible in all headings and labels
- [ ] Live stream and periodic data aligned with domain logic
- [ ] Chart labels and units match domain (e.g., °F for temperature, $/share for stock)
- [ ] Status values make sense for domain (e.g., "NOMINAL" for sensors, "BULLISH" for crypto)

**Example - Warehouse Domain:**
```
Live Metrics: Warehouse Temperature, Humidity, Package Count
Status: NOMINAL / ALERT / CRITICAL
Events: TEMPERATURE_HIGH, HUMIDITY_WARNING, PACKAGE_RECEIVED
Periodic Data: Avg Temperature Last Hour, Total Packages Processed, Alerts Triggered
```

---

### 7. Multi-Modality Interactivity ⚡

Implement **at least 2 different interaction types** (more is better).

**Visual Interactions:**
- [ ] **Animated Charts**: Line/bar charts with smooth transitions on data update
- [ ] **Micro-Animations**: Button hover states, icon changes, loading spinners
- [ ] **Progress Indicators**: Animated bars for percentages or thresholds
- [ ] **Expand/Collapse**: Click card to expand details, smooth height animation
- [ ] **Tooltips**: Hover over chart points to show values

**Form Interactions:**
- [ ] **Search/Filter**: Input field filters table/list data in real-time
- [ ] **Sorting**: Click column header to sort (ascending/descending)
- [ ] **Multi-Select**: Checkboxes to filter events by severity/type
- [ ] **Range Slider**: Adjust alert thresholds or time ranges
- [ ] **Dropdown/Select**: Change display options

**Real-Time Controls:**
- [ ] **Pause/Resume Toggle**: Button to pause live updates
- [ ] **Speed Adjuster**: Slider to change live update frequency
- [ ] **Manual Refresh**: Button to force API call
- [ ] **Threshold Slider**: Adjust alert sensitivity on the fly

**Modal / Drawer Interactions:**
- [ ] **Click Card → Detail Modal**: Click a metric or event card to open full details
- [ ] **Row Click → Drawer**: Click table row to open side panel
- [ ] **Confirmation Dialog**: Confirm actions (e.g., clear alerts, reset settings)
- [ ] **Toast Notifications**: Success/error messages on actions

**Mandatory Details:**
- [ ] At least **one control that changes rendered content** (filter, search, sort)
- [ ] At least **one interaction with visible UI response** (modal, drawer, toggle, toast)

**Recommended Implementation:**
- Use **Framer Motion**, **React Spring**, or **GSAP** for animations
- Smooth duration: 200-400ms for most micro-interactions
- Loading states during API calls (skeleton screens or spinners)

---

## TECH STACK

### Frontend
```
Framework:       React 18+
Routing:         React Router v6+
State Management: Redux Toolkit OR Zustand
Styling:         Tailwind CSS OR Material UI OR Chakra UI
Animations:      Framer Motion OR React Spring
Charts:          Recharts OR Chart.js OR Plotly
Icons:           React Icons or Heroicons
Forms:           React Hook Form + Zod/Yup for validation
HTTP:            Axios OR Fetch API
WebSocket:       Socket.io OR native WebSocket API
```

### Backend
```
Runtime:         Node.js (Express, Fastify) OR Python (Flask, FastAPI)
Real-Time:       WebSocket (socket.io) OR Server-Sent Events (SSE)
Data Storage:    Optional (can use in-memory for dummy data)
Authentication:  JWT OR simple session tokens
Dummy Data:      Generate in-memory, no database required
```

---

## APPLICATION ARCHITECTURE

### Project Structure

```
project-root/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── AlertsPage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── components/
│   │   │   ├── Navigation.jsx
│   │   │   ├── LiveMetricsCard.jsx
│   │   │   ├── ChartComponent.jsx
│   │   │   ├── AlertModal.jsx
│   │   │   └── ThemeProvider.jsx
│   │   ├── hooks/
│   │   │   ├── useWebSocket.js
│   │   │   ├── useAuth.js
│   │   │   └── usePeriodicalFetch.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   ├── ThemeContext.js
│   │   │   └── DashboardContext.js
│   │   ├── store/
│   │   │   ├── authStore.ts
│   │   │   ├── dashboardStore.ts
│   │   │   └── themeStore.ts
│   │   ├── styles/
│   │   │   ├── theme.css
│   │   │   ├── variables.css
│   │   │   └── globals.css
│   │   ├── utils/
│   │   │   ├── authUtils.js
│   │   │   ├── dateFormatter.js
│   │   │   └── apiClient.js
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   └── live.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   └── liveDataController.js
│   ├── utils/
│   │   ├── tokenManager.js
│   │   └── dataGenerator.js
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## IMPLEMENTATION ROADMAP

### **Day 1: Foundation & Authentication** 🏗️ (8 hours)

**Goal**: Establish project structure and auth flow

**Frontend Tasks (4 hours)**
- [ ] Initialize React + TypeScript project
  ```bash
  npm create vite@latest dashboard -- --template react-ts
  cd dashboard
  npm install react-router-dom zustand axios framer-motion
  ```
- [ ] Setup folder structure (pages, components, hooks, store, styles)
- [ ] Create theme configuration (CSS variables)
- [ ] Create Zustand auth store (login, logout, validateSession)
- [ ] Build login page component with form validation
- [ ] Setup routing with React Router
- [ ] Create ProtectedRoute component
- [ ] Add error handling UI (toast notifications)

**Backend Tasks (3 hours)**
- [ ] Initialize Express server
  ```bash
  mkdir backend && cd backend
  npm init -y
  npm install express cors ws dotenv jsonwebtoken
  ```
- [ ] Setup basic middleware (CORS, JSON parser)
- [ ] Create JWT token manager (generateToken, validateToken)
- [ ] Build auth routes (`/login`, `/logout`, `/validate`)
- [ ] Implement auth middleware for protected routes
- [ ] Test endpoints with Postman/Thunder Client

**Testing (1 hour)**
- [ ] Manual test: Login with correct credentials → redirected to dashboard
- [ ] Manual test: Login with wrong credentials → error message displayed
- [ ] Manual test: Access `/dashboard` without token → redirected to login
- [ ] Verify no console errors

**Deliverables**:
- ✅ Working login/logout flow
- ✅ Protected routes functional
- ✅ JWT-based authentication
- ✅ Error messages displayed

---

### **Day 2: Real-Time Data & Live Dashboard** ⚡ (8 hours)

**Goal**: Implement WebSocket/SSE and live metrics display

**Frontend Tasks (4.5 hours)**
- [ ] Create `useWebSocket` hook for real-time connection
- [ ] Create `LiveMetricsCard` component
- [ ] Build dashboard overview page layout
- [ ] Add LIVE indicator badge with pulsing animation
- [ ] Display last update timestamp (auto-formatted)
- [ ] Create metric display logic (3+ metrics)
- [ ] Add pause/resume controls (optional)
- [ ] Style with consistent theme using CSS variables

**Backend Tasks (3 hours)**
- [ ] Setup WebSocket server (ws library or socket.io)
- [ ] Create `dataGenerator.js` for realistic dummy data
- [ ] Implement live data broadcast loop (every 500ms-2s)
- [ ] Add connection/disconnection handling
- [ ] Handle pause/resume messages from client
- [ ] Test WebSocket with browser DevTools Network tab

**Testing (0.5 hours)**
- [ ] Open WebSocket connection → verify in DevTools
- [ ] Verify data updates every 500ms-2s
- [ ] Check LIVE indicator visibility and animation
- [ ] Verify timestamp updates correctly
- [ ] Test pause/resume functionality
- [ ] Check for memory leaks (DevTools → Performance)

**Deliverables**:
- ✅ Live dashboard with 3+ real-time metrics
- ✅ LIVE indicator with animation
- ✅ Last update timestamp displayed
- ✅ Smooth data updates visible
- ✅ No WebSocket connection errors

---

### **Day 3: Periodic API Polling & Analytics** 📊 (8 hours)

**Goal**: Implement polling endpoints and analytics page

**Frontend Tasks (4.5 hours)**
- [ ] Create `usePeriodicalFetch` hook (5-15s intervals)
- [ ] Build analytics/trends page layout
- [ ] Integrate chart library (Recharts recommended)
- [ ] Create chart components (line, bar, area charts)
- [ ] Display periodic data with timestamps
- [ ] Add trend indicators (↑↓ with percentage/delta)
- [ ] Implement optional time range selector
- [ ] Show "Last updated" for periodic data

**Backend Tasks (3 hours)**
- [ ] Create `GET /api/dashboard/summary` endpoint
- [ ] Create `GET /api/dashboard/alerts` endpoint
- [ ] Generate aggregated dummy data (averages, totals)
- [ ] Include trending/delta calculations
- [ ] Test endpoints return correct JSON structure
- [ ] Verify authentication on endpoints (middleware)

**Testing (0.5 hours)**
- [ ] Verify periodic fetch every 10-15 seconds
- [ ] Check API payload structure matches frontend expectations
- [ ] Verify "Last updated" timestamp updates
- [ ] Compare live data vs periodic data (should be different/aggregated)
- [ ] Test charts render correctly with data
- [ ] Check responsive layout on mobile device

**Deliverables**:
- ✅ Analytics page with charts
- ✅ Periodic polling (5-15s intervals)
- ✅ Aggregated data display
- ✅ Trend indicators
- ✅ Responsive charts

---

### **Day 4: Alerts & Multi-Modality Interactivity** 🎯 (8 hours)

**Goal**: Build alerts page and interactive features

**Frontend Tasks (5.5 hours)**
- [ ] Build alerts/events page with table/list
- [ ] Implement search functionality (filter by text)
- [ ] Add filtering by severity/type
- [ ] Add sorting (click column header)
- [ ] Create alert detail modal (on click)
- [ ] Implement modal animations (Framer Motion)
- [ ] Add toast notification component (success/error)
- [ ] Create threshold slider control
- [ ] Test all interactions on mobile

**Backend Tasks (2 hours)**
- [ ] Generate realistic alerts dummy data
- [ ] Support filtering parameters (if frontend requests)
- [ ] Add alert severity logic (CRITICAL, WARN, INFO)
- [ ] Return meaningful alert messages

**Testing (0.5 hours)**
- [ ] Click alert → modal opens with full details
- [ ] Filter by severity → table updates correctly
- [ ] Search field → results filter in real-time
- [ ] Click column header → data sorts ascending/descending
- [ ] Toast notification appears on action
- [ ] Modal closes on background click or close button
- [ ] Mobile: Touch interactions work smoothly

**Deliverables**:
- ✅ Fully interactive alerts page
- ✅ Multiple interaction types (modal, filtering, search, sorting)
- ✅ Smooth animations (Framer Motion)
- ✅ Mobile-responsive design

---

### **Day 5: Settings, Profile & Polish** ✨ (8 hours)

**Goal**: Complete remaining pages and refine UI

**Frontend Tasks (6 hours)**
- [ ] Create settings page
  - [ ] Dark mode toggle with immediate update
  - [ ] Live update frequency selector
  - [ ] Alert threshold sliders
  - [ ] Save preferences to localStorage
- [ ] Create profile/session page
  - [ ] Display logged-in user info
  - [ ] Show session details (last login, etc)
  - [ ] Logout button with confirmation
- [ ] Implement dark mode switching globally
- [ ] Add smooth page transitions (Framer Motion)
- [ ] Refine all animations (200-400ms duration)
- [ ] Add hover states to all interactive elements
- [ ] Build mobile hamburger menu
- [ ] Fix responsive layout issues

**Backend Tasks (1 hour)**
- [ ] Add optional endpoints for user preferences (if needed)
- [ ] Verify all endpoints work with authentication

**Testing & Polish (1 hour)**
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile responsiveness (iOS Safari, Android Chrome)
- [ ] Test all page transitions smooth
- [ ] Verify dark mode works everywhere
- [ ] Check animations performance (60fps)
- [ ] Test with slow network (DevTools throttle → Slow 3G)
- [ ] Verify no console errors or warnings
- [ ] Test session expiration flow

**Deliverables**:
- ✅ Settings page with working controls
- ✅ Profile/session page
- ✅ Dark mode fully functional
- ✅ Smooth animations throughout
- ✅ Mobile-optimized layout

---

### **Day 6: Testing, Documentation & Final Polish** 🧪 (8 hours)

**Goal**: QA, documentation, and deployment readiness

**Comprehensive Testing (4.5 hours)**
- [ ] Authentication flows (login, logout, expiration)
- [ ] Real-time updates under various network conditions
- [ ] API polling error handling
- [ ] Session expiration scenarios
- [ ] Dark mode switching on every page
- [ ] All interactive elements (clicks, inputs, modals)
- [ ] Responsive design (mobile 375px, tablet 768px, desktop 1920px)
- [ ] Performance metrics (load time, animation fps)

**Documentation (2 hours)**
- [ ] README.md with setup instructions
- [ ] API documentation (endpoints, payloads)
- [ ] Component documentation
- [ ] Architecture overview
- [ ] Setup guide for running locally
- [ ] Environment variables documentation

**Final Polish (1.5 hours)**
- [ ] Code cleanup and formatting (ESLint)
- [ ] Remove all console.logs
- [ ] Optimize bundle size
- [ ] Cache optimization
- [ ] Final visual/UX review
- [ ] Performance audit (Lighthouse)

**Deliverables**:
- ✅ Production-ready application
- ✅ Comprehensive documentation
- ✅ No bugs or console errors
- ✅ Optimized performance

---

## CODE TEMPLATES

### Frontend: Theme Configuration

**`src/styles/theme.css`**
```css
/* Light Mode (Default) */
:root {
  /* Primary Colors */
  --color-primary: #1e40af;
  --color-primary-hover: #1e3a8a;
  --color-primary-light: #dbeafe;
  
  /* Secondary Colors */
  --color-secondary: #059669;
  --color-secondary-hover: #047857;
  
  /* Accent & Status */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  
  /* Neutral */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f3f4f6;
  --color-bg-tertiary: #e5e7eb;
  
  --color-text-primary: #1f2937;
  --color-text-secondary: #6b7280;
  --color-text-disabled: #d1d5db;
  
  --color-border: #d1d5db;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto';
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 2rem;
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 300ms ease-in-out;
}

/* Dark Mode */
[data-theme="dark"] {
  --color-bg-primary: #1f2937;
  --color-bg-secondary: #111827;
  --color-bg-tertiary: #374151;
  
  --color-text-primary: #f3f4f6;
  --color-text-secondary: #d1d5db;
  --color-text-disabled: #6b7280;
  
  --color-border: #374151;
}

/* Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  transition: background-color var(--transition-base),
              color var(--transition-base);
}

button {
  cursor: pointer;
  border: none;
  font-family: inherit;
  transition: all var(--transition-fast);
}

input, textarea, select {
  font-family: inherit;
  font-size: inherit;
}

a {
  color: var(--color-primary);
  text-decoration: none;
  
  &:hover {
    color: var(--color-primary-hover);
  }
}
```

### Frontend: Auth Store (Zustand)

**`src/store/authStore.ts`**
```typescript
import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  validateSession: () => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem('authToken') || null,
  isAuthenticated: !!localStorage.getItem('authToken'),
  isLoading: false,
  error: null,
  
  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },
  
  validateSession: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    
    try {
      const response = await fetch('/api/auth/validate', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!response.ok) {
        throw new Error('Invalid session');
      }
      
      const data = await response.json();
      set({ user: data.user });
      return true;
    } catch (error) {
      localStorage.removeItem('authToken');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
      return false;
    }
  },
  
  clearError: () => set({ error: null }),
}));
```

### Frontend: Protected Route Component

**`src/components/ProtectedRoute.tsx`**
```typescript
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useEffect, useState } from 'react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, validateSession } = useAuthStore();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const valid = await validateSession();
      setIsValid(valid);
      setIsValidating(false);
    };
    checkAuth();
  }, [validateSession]);
  
  if (isValidating) {
    return <div>Loading...</div>;
  }
  
  return isValid ? <>{children}</> : <Navigate to="/login" replace />;
};
```

### Frontend: Login Page

**`src/pages/LoginPage.tsx`**
```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, error, isLoading, clearError } = useAuthStore();
  const [formData, setFormData] = useState({ username: '', password: '' });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(formData.username, formData.password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };
  
  return (
    <div className="login-container">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1>Dashboard Login</h1>
        <p className="subtitle">Warehouse Monitoring System</p>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="admin"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="hint">Demo: admin / password</p>
      </motion.div>
    </div>
  );
};
```

### Frontend: WebSocket Hook

**`src/hooks/useWebSocket.ts`**
```typescript
import { useEffect, useRef, useState } from 'react';

interface LiveMetrics {
  timestamp: string;
  metrics: Record<string, number>;
  status: 'NOMINAL' | 'ALERT' | 'CRITICAL';
  event: string;
}

export const useWebSocket = (url: string) => {
  const [data, setData] = useState<LiveMetrics | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(url);
        wsRef.current = ws;
        
        ws.onopen = () => {
          setIsConnected(true);
          setError(null);
          reconnectAttempts.current = 0;
        };
        
        ws.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            setData(parsed);
          } catch (err) {
            setError('Failed to parse message');
          }
        };
        
        ws.onerror = () => {
          setError('WebSocket connection error');
          setIsConnected(false);
        };
        
        ws.onclose = () => {
          setIsConnected(false);
          // Auto-reconnect with exponential backoff
          if (reconnectAttempts.current < 5) {
            const delay = Math.pow(2, reconnectAttempts.current) * 1000;
            setTimeout(connectWebSocket, delay);
            reconnectAttempts.current++;
          }
        };
      } catch (err) {
        setError('Failed to create WebSocket');
      }
    };
    
    connectWebSocket();
    
    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [url]);
  
  const pause = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: 'pause' }));
    }
  };
  
  const resume = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: 'resume' }));
    }
  };
  
  return { data, isConnected, error, pause, resume };
};
```

### Frontend: Periodic Fetch Hook

**`src/hooks/usePeriodicalFetch.ts`**
```typescript
import { useEffect, useState } from 'react';

interface FetchOptions {
  url: string;
  interval: number; // milliseconds
  enabled?: boolean;
}

export const usePeriodicalFetch = <T>({
  url,
  interval,
  enabled = true,
}: FetchOptions) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  
  useEffect(() => {
    if (!enabled) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const result = await response.json();
        setData(result);
        setLastUpdated(new Date().toISOString());
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData(); // Fetch immediately
    const intervalId = setInterval(fetchData, interval);
    
    return () => clearInterval(intervalId);
  }, [url, interval, enabled]);
  
  return { data, isLoading, error, lastUpdated };
};
```

### Frontend: Live Metrics Card Component

**`src/components/LiveMetricsCard.tsx`**
```typescript
import { motion } from 'framer-motion';

interface Metric {
  label: string;
  value: number;
  unit: string;
}

interface Props {
  title: string;
  metrics: Metric[];
  status: 'NOMINAL' | 'ALERT' | 'CRITICAL';
  lastUpdated: string;
  isLive: boolean;
}

export const LiveMetricsCard = ({
  title,
  metrics,
  status,
  lastUpdated,
  isLive,
}: Props) => {
  return (
    <motion.div
      className={`metrics-card metrics-${status.toLowerCase()}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="card-header">
        <h3>{title}</h3>
        <div className="live-indicator">
          {isLive && (
            <>
              <span className="live-dot"></span>
              <span className="live-text">LIVE</span>
            </>
          )}
        </div>
      </div>
      
      <div className="metrics-grid">
        {metrics.map((metric, idx) => (
          <motion.div
            key={idx}
            className="metric-item"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
          >
            <span className="metric-label">{metric.label}</span>
            <span className="metric-value">
              {metric.value.toFixed(2)} {metric.unit}
            </span>
          </motion.div>
        ))}
      </div>
      
      <div className="card-footer">
        <small>Updated: {new Date(lastUpdated).toLocaleTimeString()}</small>
      </div>
    </motion.div>
  );
};
```

**`src/components/LiveMetricsCard.css`**
```css
.metrics-card {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.metrics-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.metrics-card.metrics-nominal {
  border-left: 4px solid var(--color-success);
}

.metrics-card.metrics-alert {
  border-left: 4px solid var(--color-warning);
}

.metrics-card.metrics-critical {
  border-left: 4px solid var(--color-error);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.card-header h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin: 0;
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-error);
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-error);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-lg);
}

.metric-item {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-md);
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-md);
}

.metric-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.metric-value {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
}

.card-footer {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}
```

### Backend: Express Server Setup

**`backend/server.js`**
```javascript
import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import authMiddleware from './middleware/auth.js';
import { generateLiveData } from './utils/dataGenerator.js';

const app = express();
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

// WebSocket Handler
const activeConnections = new Set();

wss.on('connection', (ws) => {
  console.log('Client connected');
  activeConnections.add(ws);
  ws.isPaused = false;
  
  ws.on('message', (message) => {
    try {
      const action = JSON.parse(message);
      if (action.action === 'pause') {
        ws.isPaused = true;
      } else if (action.action === 'resume') {
        ws.isPaused = false;
      }
    } catch (error) {
      console.error('Message parse error:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
    activeConnections.delete(ws);
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    activeConnections.delete(ws);
  });
});

// Live Data Broadcast
setInterval(() => {
  const liveData = generateLiveData();
  
  activeConnections.forEach((ws) => {
    if (!ws.isPaused && ws.readyState === 1) { // OPEN
      ws.send(JSON.stringify(liveData));
    }
  });
}, 1000); // Send every 1 second

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Backend: Dummy Data Generator

**`backend/utils/dataGenerator.js`**
```javascript
export const generateLiveData = () => {
  const baseTemp = 72;
  const baseHumidity = 45;
  const basePressure = 1013.25;
  
  // Add random fluctuations
  const temperature = baseTemp + (Math.random() - 0.5) * 4;
  const humidity = baseHumidity + (Math.random() - 0.5) * 10;
  const pressure = basePressure + (Math.random() - 0.5) * 2;
  
  // Determine status based on thresholds
  let status = 'NOMINAL';
  if (temperature > 75 || temperature < 60) status = 'ALERT';
  if (temperature > 80 || temperature < 50) status = 'CRITICAL';
  
  // Generate event type
  const events = [
    'SENSOR_UPDATE',
    'TEMPERATURE_WARNING',
    'HUMIDITY_CHANGE',
    'PRESSURE_FLUCTUATION',
    'SYSTEM_CHECK',
  ];
  
  const event = events[Math.floor(Math.random() * events.length)];
  
  return {
    timestamp: new Date().toISOString(),
    metrics: {
      temperature: parseFloat(temperature.toFixed(2)),
      humidity: parseFloat(humidity.toFixed(2)),
      pressure: parseFloat(pressure.toFixed(2)),
    },
    status,
    event,
  };
};

export const generateSummaryData = () => {
  return {
    avgTemperature: 71.5 + (Math.random() - 0.5) * 2,
    totalEvents: Math.floor(Math.random() * 100) + 40,
    criticalCount: Math.floor(Math.random() * 5),
    warningCount: Math.floor(Math.random() * 10),
    trend: {
      temperature: (Math.random() - 0.5),
      humidity: (Math.random() - 0.5),
      direction: Math.random() > 0.5 ? 'UP' : 'DOWN',
    },
    lastUpdated: new Date().toISOString(),
  };
};

export const generateAlertsData = () => {
  const alerts = [
    { id: 1, severity: 'CRITICAL', message: 'Temperature exceeds threshold' },
    { id: 2, severity: 'WARNING', message: 'Humidity above 60%' },
    { id: 3, severity: 'INFO', message: 'System check completed' },
    { id: 4, severity: 'WARNING', message: 'Pressure fluctuation detected' },
  ];
  
  return {
    alerts: alerts
      .filter(() => Math.random() > 0.3)
      .map((alert) => ({
        ...alert,
        timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      })),
    lastUpdated: new Date().toISOString(),
  };
};
```

### Backend: Authentication Routes

**`backend/routes/auth.js`**
```javascript
import express from 'express';
import { generateToken, validateToken } from '../utils/tokenManager.js';

const router = express.Router();

// Dummy user database
const users = {
  admin: { id: '1', name: 'Admin User', email: 'admin@example.com' },
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Simple validation (for demo purposes)
  if (username === 'admin' && password === 'password') {
    const user = users[username];
    const token = generateToken(user);
    
    return res.json({
      token,
      user,
    });
  }
  
  res.status(401).json({ error: 'Invalid credentials' });
});

router.post('/logout', (req, res) => {
  // Token invalidation logic here if using server-side token storage
  res.json({ success: true });
});

router.get('/validate', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  try {
    const payload = validateToken(token);
    const user = users['admin']; // In real app, look up user by ID
    
    if (!user) {
      return res.status(401).json({ valid: false });
    }
    
    res.json({ valid: true, user });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
});

export default router;
```

### Backend: Dashboard Routes

**`backend/routes/dashboard.js`**
```javascript
import express from 'express';
import { generateSummaryData, generateAlertsData } from '../utils/dataGenerator.js';

const router = express.Router();

router.get('/summary', (req, res) => {
  const data = generateSummaryData();
  res.json(data);
});

router.get('/alerts', (req, res) => {
  const data = generateAlertsData();
  res.json(data);
});

router.get('/history', (req, res) => {
  // Historical data for charts
  const history = Array.from({ length: 20 }, (_, i) => ({
    timestamp: new Date(Date.now() - (20 - i) * 60000).toISOString(),
    avgTemp: 70 + Math.random() * 4,
    avgHumidity: 45 + Math.random() * 10,
  }));
  
  res.json({ history, lastUpdated: new Date().toISOString() });
});

export default router;
```

### Backend: Token Manager

**`backend/utils/tokenManager.js`**
```javascript
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.name, email: user.email },
    SECRET,
    { expiresIn: '24h' }
  );
};

export const validateToken = (token) => {
  if (!token) throw new Error('No token provided');
  return jwt.verify(token, SECRET);
};
```

### Backend: Auth Middleware

**`backend/middleware/auth.js`**
```javascript
import { validateToken } from '../utils/tokenManager.js';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const payload = validateToken(token);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default authMiddleware;
```

---

## TESTING STRATEGY

### Unit Testing

Test individual components and utilities:

```typescript
// Example: Test auth store
import { useAuthStore } from '../store/authStore';

describe('Auth Store', () => {
  it('should login with correct credentials', async () => {
    const { login } = useAuthStore.getState();
    await login('admin', 'password');
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBeDefined();
  });
  
  it('should show error with wrong credentials', async () => {
    const { login } = useAuthStore.getState();
    try {
      await login('admin', 'wrong');
    } catch {
      const state = useAuthStore.getState();
      expect(state.error).toBeDefined();
    }
  });
});
```

### Manual Testing Checklist

#### Authentication
- [ ] Login with correct credentials (admin/password) → dashboard loads
- [ ] Login with wrong credentials → error message displayed
- [ ] Logout → redirected to login page
- [ ] Back button after logout → can't access dashboard
- [ ] Refresh page with valid token → stay logged in
- [ ] Refresh page without token → redirected to login
- [ ] Clear localStorage → redirected to login on next page load

#### Real-Time Updates
- [ ] WebSocket connects on dashboard load (check DevTools → Network → WS)
- [ ] Data updates every 1-2 seconds (check message tab)
- [ ] LIVE indicator visible and pulsing
- [ ] Timestamp updates with each message
- [ ] All 3+ metrics display and change values
- [ ] Status changes (NOMINAL → ALERT → CRITICAL)
- [ ] Close and reopen page → WebSocket reconnects automatically

#### Periodic Polling
- [ ] API called every 10-15 seconds (DevTools → Network → XHR)
- [ ] "Last updated" timestamp updates
- [ ] No duplicate API calls at same time
- [ ] Handles network errors gracefully (offline mode)
- [ ] Shows loading state during fetch (skeleton or spinner)
- [ ] Data structure matches expected format

#### Navigation
- [ ] All 6+ pages accessible from navigation
- [ ] Active route highlighted in navigation
- [ ] Page transitions smooth (no white flash)
- [ ] Browser back/forward buttons work
- [ ] Links don't break or 404

#### Theming
- [ ] Light mode has sufficient contrast (WCAG AA)
- [ ] Dark mode has sufficient contrast (WCAG AA)
- [ ] Dark mode toggle switches both modes instantly
- [ ] Theme preference persists on page refresh
- [ ] All pages respect theme (no orphaned elements)
- [ ] Charts, tables, forms themed correctly

#### Interactivity
- [ ] Click metric card → detail modal opens
- [ ] Modal close button works
- [ ] Click outside modal → closes
- [ ] Search field filters data in real-time
- [ ] Click column header → sorts ascending/descending
- [ ] Filter checkbox → table updates
- [ ] Slider changes → values update
- [ ] Toast notification appears and disappears
- [ ] Button hover states visible

#### Responsiveness
- **Mobile (375px)**:
  - [ ] Content readable without horizontal scroll
  - [ ] Touch targets at least 44x44px
  - [ ] Hamburger menu visible
  - [ ] Modal fits screen
  - [ ] Inputs accessible
  
- **Tablet (768px)**:
  - [ ] 2-column layout works
  - [ ] Navigation accessible
  - [ ] Charts readable
  
- **Desktop (1920px)**:
  - [ ] Multi-column layouts work
  - [ ] Charts have adequate space
  - [ ] Sidebar navigation visible

#### Performance
- [ ] Page loads in < 3 seconds (Lighthouse)
- [ ] No layout shift (CLS < 0.1)
- [ ] Animations at 60fps (DevTools → Performance → check FPS)
- [ ] No memory leaks (leave open 5 min, watch heap)
- [ ] Bundle size reasonable (< 500KB gzipped)

### Common Pitfalls & Solutions

#### Pitfall 1: WebSocket Connection Issues
**Problem**: WebSocket fails to connect  
**Solution**: Add error handling and auto-reconnect
```typescript
// Already in useWebSocket hook with exponential backoff
```

#### Pitfall 2: Race Conditions in Real-Time Updates
**Problem**: UI updates conflict between live and periodic data  
**Solution**: Keep data separate
```typescript
const [liveData, setLiveData] = useState({});
const [periodicData, setPeriodicData] = useState({});
```

#### Pitfall 3: Memory Leaks with WebSocket
**Problem**: WebSocket listeners accumulate on component remount  
**Solution**: Cleanup on unmount (already in template)
```typescript
return () => {
  if (wsRef.current?.readyState === WebSocket.OPEN) {
    wsRef.current.close();
  }
};
```

#### Pitfall 4: Session Expiration During API Calls
**Problem**: User gets 401 error mid-action  
**Solution**: Catch 401 and redirect to login
```typescript
if (response.status === 401) {
  useAuthStore.getState().logout();
  navigate('/login');
}
```

#### Pitfall 5: Theme Not Persisting
**Problem**: Dark mode resets on refresh  
**Solution**: Save to localStorage and restore on mount
```typescript
const setTheme = (theme) => {
  localStorage.setItem('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
};
```

#### Pitfall 6: Unoptimized Re-renders
**Problem**: Metrics card re-renders too frequently  
**Solution**: Use React.memo for expensive components
```typescript
export const LiveMetricsCard = React.memo(({ data }) => {...});
```

---

## DEPLOYMENT & FINAL CHECKLIST

### Pre-Deployment Code Checklist

**Code Quality**
- [ ] No console.log statements left (or only debug level)
- [ ] No unused variables or imports
- [ ] ESLint passes without warnings
- [ ] Code formatted consistently (Prettier)
- [ ] TypeScript: no errors (if using TS)
- [ ] All functions have comments/JSDoc
- [ ] Error handling on all API calls
- [ ] No hardcoded API URLs (use env vars)

**Frontend Build**
- [ ] `npm run build` succeeds
- [ ] Bundle size < 500KB gzipped
- [ ] No errors in build output
- [ ] Source maps generated (for debugging)
- [ ] Assets optimized (images compressed)

**Backend Configuration**
- [ ] Environment variables documented
- [ ] No secrets in code (use .env file)
- [ ] Error handling on all routes
- [ ] CORS configured correctly
- [ ] Authentication enforced on protected routes
- [ ] Rate limiting configured (optional but recommended)

**Security**
- [ ] No hardcoded credentials
- [ ] Tokens stored securely (httpOnly cookies if possible)
- [ ] HTTPS enforced in production URLs
- [ ] CORS allows only expected origins
- [ ] XSS protection (sanitize DOM)
- [ ] CSRF tokens (if using cookies)
- [ ] Input validation on backend

**Testing**
- [ ] All user flows tested manually
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested on iOS and Android
- [ ] Tested with slow network (DevTools → Slow 3G)
- [ ] No console errors/warnings in any scenario
- [ ] Session expiration tested
- [ ] Error states tested (network error, 404, 500, etc)

**Documentation**
- [ ] README.md with clear setup instructions
- [ ] API documentation (endpoints, payloads)
- [ ] Environment variables documented (.env.example)
- [ ] Architecture diagram (optional)
- [ ] Setup guide: "How to run locally"
- [ ] Deployment guide: "How to deploy"
- [ ] Known issues documented

**Performance**
- [ ] Lighthouse score > 80
- [ ] Page load time < 3 seconds
- [ ] First paint < 1 second
- [ ] Time to interactive < 3 seconds
- [ ] Cumulative Layout Shift < 0.1
- [ ] No memory leaks (5+ min test)
- [ ] API response time < 500ms

### Environment Variables Template

**Frontend (.env)**
```env
VITE_API_URL=https://your-api.com
VITE_WS_URL=wss://your-api.com
```

**Backend (.env)**
```env
JWT_SECRET=your-super-secret-key-here
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-frontend.com
```

### Deployment Instructions

**Frontend (Vercel/Netlify)**
```bash
# Build
npm run build

# Deploy (Vercel)
vercel

# Or Netlify
netlify deploy
```

**Backend (Heroku/Railway)**
```bash
# Set environment variables
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main

# Or Railway
railway deploy
```

### Post-Deployment Testing

- [ ] App loads at production URL
- [ ] Can login with demo credentials
- [ ] Real-time data updates visible
- [ ] Periodic polling working
- [ ] Dark mode toggle works
- [ ] All pages accessible
- [ ] Session management works
- [ ] No console errors on production

---

## QUICK REFERENCE

### Development Timeline (48 hours)

| Day | Focus | Hours | Key Deliverables |
|-----|-------|-------|------------------|
| 1 | Auth + Setup | 8 | Login/logout, protected routes |
| 2 | Real-Time | 8 | WebSocket, live metrics, LIVE badge |
| 3 | Analytics | 8 | Polling, charts, trends |
| 4 | Interactivity | 8 | Alerts, filtering, modals |
| 5 | Polish | 8 | Settings, profile, animations, responsive |
| 6 | Testing | 8 | QA, documentation, optimization |

### Project Scope Summary

| Requirement | Type | Example |
|-------------|------|---------|
| Live Metrics | Real-Time | 3+ KPIs updating every 1-2s |
| Periodic Data | Polling | Summary/alerts every 10-15s |
| Theming | Design | Primary, secondary, accent colors |
| Auth | Security | Login, JWT token, session management |
| Pages | Navigation | 6+ pages with routing |
| Domain | Coherence | Warehouse/fleet/crypto/fitness |
| Interactivity | UX | Filtering, modals, animations, controls |

### Tech Stack Quick Reference

```
Frontend:  React + TypeScript + Zustand + Framer Motion
Backend:   Node.js/Express + WebSocket + JWT
Database:  None (in-memory dummy data)
Deploy:    Vercel/Netlify (frontend), Heroku/Railway (backend)
```

### Critical Checklist (Pre-Shipping)

- [ ] 6+ pages with working navigation
- [ ] Login/logout functional
- [ ] WebSocket real-time updates (3+ metrics)
- [ ] LIVE indicator visible and updating
- [ ] Periodic API polling (2+ endpoints)
- [ ] Dark mode toggle working
- [ ] Theme persisting on refresh
- [ ] Filtering/search working
- [ ] Modal interactions working
- [ ] Mobile responsive (no horizontal scroll)
- [ ] No console errors
- [ ] Performance optimized
- [ ] Documentation complete

### API Endpoints Quick Reference

```
POST /api/auth/login
  → { token, user }

POST /api/auth/logout
  → { success }

GET /api/auth/validate
  → { valid, user }

WS /live
  ← { timestamp, metrics, status, event }

GET /api/dashboard/summary
  → { avgMetrics, trends, lastUpdated }

GET /api/dashboard/alerts
  → { alerts[], lastUpdated }
```

### Demo Credentials

```
Username: admin
Password: password
```

### Quick Start Commands

**Frontend**
```bash
npm create vite@latest dashboard -- --template react-ts
cd dashboard
npm install
npm run dev  # localhost:5173
```

**Backend**
```bash
mkdir backend && cd backend
npm init -y
npm install express cors ws jsonwebtoken
node server.js  # localhost:3001
```

### Debugging Tips

**WebSocket Issues**
```javascript
// DevTools → Network → WS
// Check "Messages" tab for incoming data
console.log(ws.readyState); // 0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED
```

**API Issues**
```javascript
// DevTools → Network → XHR
// Check Response tab for payload structure
console.log('Headers sent:', {
  'Authorization': `Bearer ${token}`
});
```

**Auth Issues**
```javascript
// DevTools → Application → Local Storage
console.log(localStorage.getItem('authToken'));
```

**Theme Issues**
```javascript
// DevTools → Elements → <html>
console.log(document.documentElement.getAttribute('data-theme'));
const color = getComputedStyle(document.documentElement)
  .getPropertyValue('--color-primary');
console.log(color);
```

### Success Criteria

✅ **Functionality** - All 7 requirements met  
✅ **Quality** - Professional appearance, consistent theming, smooth animations  
✅ **Code** - Modular, documented, error handling throughout  
✅ **UX** - Intuitive navigation, responsive, fast loading  
✅ **Performance** - < 3s load time, 60fps animations, no memory leaks  

---

## BONUS FEATURES (Optional, But Impressive)

- [ ] Unit tests with Jest/Vitest
- [ ] E2E tests with Cypress/Playwright
- [ ] Performance metrics dashboard
- [ ] Advanced filtering/search UI
- [ ] Export data to CSV/PDF
- [ ] Custom widget drag/drop
- [ ] Advanced animations (scroll parallax, etc)
- [ ] Accessibility audit (WCAG AAA)
- [ ] Offline support with Service Worker
- [ ] Multi-user simulation
- [ ] Activity audit log
- [ ] Email alert notifications (mock)
- [ ] Real-time collaboration (mock)
- [ ] Advanced chart types (3D, 3D scatter, etc)
- [ ] Mobile app (React Native)

---

## LEARNING RESOURCES

- **React**: https://react.dev
- **React Router**: https://reactrouter.com
- **Zustand**: https://github.com/pmndrs/zustand
- **Framer Motion**: https://www.framer.com/motion
- **Recharts**: https://recharts.org
- **WebSocket API**: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
- **Express**: https://expressjs.com
- **JWT.io**: https://jwt.io

---

## FINAL NOTES

**You now have everything needed to build a production-ready full-stack dashboard:**

✅ Complete specification (7 core requirements)  
✅ Tech stack recommendations  
✅ 6-day development roadmap  
✅ Ready-to-use code templates  
✅ Testing strategies  
✅ Common pitfalls & solutions  
✅ Deployment guide  
✅ Quick reference checklists  

**Estimated time**: 48 hours (6 days)  
**Difficulty**: Intermediate to Advanced  
**Learning value**: High (full-stack, real-time, state management, authentication)  

**Key to success:**
1. Start with Day 1 foundation (don't skip auth)
2. Test frequently (don't wait until the end)
3. Follow the checklist (don't assume things work)
4. Polish gradually (animations, responsiveness, etc)
5. Document as you go (don't leave it for the end)

**Good luck! You've got this!** 🚀

---

**Last Updated**: 2024  
**Version**: 1.0 - Complete Full-Stack Assessment  
**Status**: Ready to Build ✅
