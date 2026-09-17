# Nexvia — Your work. Your links. Your next.

A modern, high-craft personal web-presence platform combining branded short-links, curated portfolio projects, custom digital identity profiles, and first-party audience insights.

Designed with a calm, editorial, premium aesthetic: **Warm Cream (`#F5F1E7`), Soft Ivory (`#FAF8F2`), Deep Charcoal (`#171713`), Warm Amber (`#F4B33E`), and Muted Hairline Borders (`#DDD7C8`)**.

---

## 🚀 Product Pillars

### 1. Branded Short Links & High-Speed Redirection
- **Vanity Slugs & Collision Safety**: Create custom short codes (e.g. `/portfolio-2026`) or generate collision-safe 6-character nanoid slugs.
- **Immediate 302 Redirection**: Short links redirect instantly (`GET /r/:shortCode`), unblocked by database writes.
- **Link Studio**: Editorial management table with live link editing (`PATCH /api/links/:id`), copy to clipboard, high-resolution QR code generator (SVG & PNG), activation toggles, and deletion.
- **Asynchronous Click Logging**: Background logging using `setImmediate`, capturing device types (`ua-parser-js`), referrers, timestamps, and privacy-preserving hashed IP addresses (`sha256(ip + salt)`).

### 2. Selected Work & Portfolio Studio (`/portfolio`)
- **Numbered Project Showcase**: Present key projects, case studies, and engineering deliverables in a numbered editorial grid (`01`, `02`...) inspired by high-end studio portfolios.
- **Rich Metadata**: Project title, year, technology stack tags, live preview URL, GitHub repository link, cover imagery, and case study notes.
- **Reordering & Management**: Full drag/up/down reordering, inline editing, and live sync with public presence.

### 3. Bio & Digital Presence Studio (`/bio-builder` & `/bio/:username`)
- **Identity Customizer**: Manage display name, professional headline, bio narrative, avatar, and career experience timeline.
- **Curated Links**: Verified platform destinations (Website, GitHub, LinkedIn, Substack, etc.) with custom labels and reordering.
- **Theme Engine**: Switch between 3 bespoke themes with real-time mobile mockup preview:
  - `dark-slate`: High contrast Nexvia deep charcoal (`#171713`) with warm amber accents (`#F4B33E`).
  - `minimal-light`: Warm ivory canvas (`#FAF8F2`) with crisp hairline borders (`#DDD7C8`).
  - `gradient`: Subtle amber glow to deep charcoal gradient.
- **Public Profile View**: Clean mobile-responsive public presentation at `/bio/:username`, featuring Selected Work, Curated Links, and Experience.

### 4. Audience Analytics & Privacy-First Insights (`/dashboard`)
- **Zero Fake Metrics**: 100% verified real backend metrics with zero fabricated signals or marketing fluff.
- **Real-Time Daily Clicks**: Time series aggregation grouped by calendar day rendered via Recharts Area Charts with an amber curve.
- **Device Breakdown**: Donut chart parsing Mobile, Desktop, and Tablet user agents.
- **Top Traffic Referrers**: Aggregated traffic origins (Direct, Twitter/X, GitHub, LinkedIn, etc.).
- **Top Performing Links**: Clean leaderboard of your most engaged vanity links.

### 5. Enterprise Auth & Security Hardening
- **JWT Access + Refresh Rotation**: 15-minute access token in JSON + 7-day refresh token stored in `httpOnly`, `sameSite=strict` cookies, with automatic reuse detection and rotation.
- **Email Verification & Password Reset**: Simulated verification and reset links with dev auto-verify helper controls.
- **Input Validation**: Strict Zod schemas on all write endpoints returning uniform error shapes:
  `{ "error": { "message": "...", "code": "..." } }`
- **Rate Limiting**: `express-rate-limit` safeguards against link spam and redirection abuse.
- **Helmet & CORS**: Strict security headers and origin whitelisting.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Database** | MongoDB 7.0 via Mongoose ODM |
| **Backend API** | Node.js (v20+) + Express.js |
| **Frontend** | React 18 (Vite) + Tailwind CSS + Lucide Icons |
| **Authentication** | JWT (jsonwebtoken) + bcrypt + cookie-parser |
| **Data Validation** | Zod |
| **Visualizations** | Recharts |
| **QR Generation** | `qrcode.react` (SVG & PNG download) |
| **Device Detection** | `ua-parser-js` |
| **Testing** | Jest + Supertest (35 automated tests) |

---

## 🎨 Design System & Palette

Extracted from the Nexvia design specification:
- **Warm Cream**: `#F5F1E7` (Canvas background)
- **Soft Ivory**: `#FAF8F2` (Card surfaces, inset panels)
- **Deep Charcoal**: `#171713` / `#24241F` (Primary dark containers, typography)
- **Warm Accent Amber**: `#F4B33E` / `#E69E24` (Brand highlights, key callouts, active state indicators)
- **Muted Hairline Borders**: `#DDD7C8` / `#2A2A24` (Subtle dividers, clean structure)
- **Muted Typography**: `#77756D` / `#A5A298` (Metadata tags, timestamps, secondary labels)

---

## 📋 Prerequisites

- **Node.js**: v18 or later (tested on v22.23.1)
- **npm**: v9 or later
- **MongoDB**: Local MongoDB instance or Docker container running on port 27017

---

## ⚡ Quick Start Instructions

### 1. Database Setup
If using Docker:
```bash
docker run -d --name shortlink-mongo -p 27017:27017 --restart unless-stopped mongo:7.0
```

### 2. Backend Server Setup
```bash
cd server
npm install
cp .env.example .env
npm run dev
```
The server will boot on `http://localhost:5001`. Health check available at `http://localhost:5001/api/health`.

### 3. Frontend Client Setup
In a separate terminal:
```bash
cd client
npm install
npm run dev
```
The client will boot on `http://localhost:5174`. Open your browser at `http://localhost:5174` to explore Nexvia!

---

## 🔐 Environment Variables

Template available in `.env.example`:

| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | Port for Express server | `5001` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGO_URI` | MongoDB connection URI | `mongodb://localhost:27017/shortlink_hub` |
| `JWT_ACCESS_SECRET` | Secret key for signing 15m access tokens | `min_32_chars_random_string` |
| `JWT_REFRESH_SECRET` | Secret key for signing 7d refresh tokens | `min_32_chars_random_string` |
| `CLIENT_URL` | Frontend client origin for CORS | `http://localhost:5174` |
| `IP_HASH_SALT` | Random salt string for anonymizing IP hashes | `nexvia_default_salt` |

---

## 🧪 Testing

Run the full automated test suite (35 passing tests):
```bash
cd server
npm test
```

Test Suites:
1. `tests/auth.test.js`: Signup, email verify, login, token rotation, logout, password reset.
2. `tests/links.test.js`: Auto-slugs, vanity aliases, collision rejection, link updates (PATCH), 302 redirects, pagination, deletion.
3. `tests/analytics.test.js`: Exact click counts, unique visitors, daily aggregation, referrers, device split.
4. `tests/bio.test.js`: BioProfile creation, Selected Work projects, experience records, updates, theme validation, public query, 404 response.
5. `tests/security.test.js`: Helmet headers, Zod validation rejections, error shapes.

---

## 💡 Technical Decisions & Architecture

1. **Editorial Digital Presence Architecture**: Nexvia was built to transcend generic link shorteners by treating digital identity as an integrated whole: short links, selected project case studies, and career timelines coexist within one coherent studio.
2. **Privacy-Preserving IP Tracking**: Direct IP addresses are never saved in the database. Instead, `sha256(ip + salt)` generates an anonymous hash, satisfying GDPR/CCPA considerations while allowing accurate unique visitor counts.
3. **Fire-and-Forget Redirects**: Clicks are registered asynchronously (`setImmediate`) to ensure redirect responses are returned in under 5ms without waiting on database write latency.
4. **Honest Metrics Only**: Unlike generic SaaS templates that display fake click-through spikes or fabricated customer intent metrics, Nexvia only renders verified, real-world data from the MongoDB aggregation pipeline.
# Nexvia
# Nexvia
# Nexvia
