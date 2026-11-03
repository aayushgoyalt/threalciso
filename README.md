# THEREALCISO

**THEREALCISO** is an independent, high-credibility cybersecurity journalism, threat intelligence, and executive risk analysis platform engineered specifically for Chief Information Security Officers (CISOs), Data Protection Officers (DPOs), and IT risk leadership across India and the APAC region.

---

## 🏛️ Architectural Overview & Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Database**: MongoDB Atlas with Mongoose ODM (Connection caching & pooling)
- **Authentication**: Custom JWT Session with `jose` & `bcryptjs` (Role-Based Access Control: `admin`, `editor`)
- **Route Protection**: Next.js 16 Proxy Convention (`src/proxy.ts`) with `httpOnly`, `sameSite: 'lax'`, secure cookies
- **Serverless Rate Limiting**: MongoDB TTL Collection (`RateLimit`) — zero-external dependency, fully distributed & serverless-safe
- **Rich Text Editor**: TipTap WYSIWYG editor with server-side `sanitize-html` stripping
- **Asset Storage**: Cloudinary for production, local filesystem (`/public/uploads`) fallback in development
- **Transactional Dispatch**: Resend integration for newsletter confirmations with automated console simulation fallback
- **Search**: MongoDB compound text indexing on title, summary deck, and body
- **SEO & Social Graph**: Dynamic metadata, Open Graph cards, dynamic XML Sitemap (`/sitemap.xml`), robots.txt (`/robots.txt`), and JSON-LD `NewsArticle` schema

---

## 🛡️ Security Engineering Highlights

1. **Pull-Based Scheduling**: Public queries enforce `{ status: 'published', publishedAt: { $lte: new Date() } }`. Articles scheduled for future release are automatically hidden until their target timestamp without relying on external cron jobs.
2. **Dynamic Event Derivation**: Event status (`upcoming`, `ongoing`, `past`) is derived dynamically at query time from `startDate` and `endDate`, eliminating stale state.
3. **Protected Lead Capture & Token Gating**: `Resource.fileUrl` is excluded by default (`select: false`). Direct download URLs are never exposed in public HTML. Instead, completing the lead form signs a short-lived HMAC/JWT token valid for 15 minutes (`/api/resources/[slug]/download?token=...`).
4. **View Deduplication & Bot Rejection**: Incoming view tracking requests inspect the `User-Agent` against known crawlers, headless browsers, and search bots. Unique human visitors are hashed via IP and persistent anonymous identifiers, logging only one increment per 24-hour sliding window in an indexed TTL collection.
5. **Anti-Brute Force Login Protection**: Login endpoints enforce atomic rate limiting (5 attempts per 15 minutes per IP) stored in a MongoDB TTL collection.

---

## ⚙️ Environment Variables

Create `.env.local` based on `.env.example`:

| Variable | Description | Example / Default |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas Connection String | `mongodb+srv://<user>:<password>@cluster.mongodb.net/CISOapp` |
| `AUTH_SECRET` | 256-bit cryptographic key for session tokens | Generated 64-char hex string |
| `NEXTAUTH_URL` | Public site domain / origin URL | `http://localhost:3000` |
| `DOWNLOAD_TOKEN_SECRET` | Secret key for signing gated download links | Generated 64-char hex string |
| `SEED_ADMIN_EMAIL` | Initial administrator email for database seed | `admin@therealciso.in` |
| `SEED_ADMIN_PASSWORD` | Initial administrator password | `CisoAdminSecure2026!` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name (Production upload) | *(Optional in dev)* |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | *(Optional in dev)* |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | *(Optional in dev)* |
| `RESEND_API_KEY` | Resend API Key for newsletters | *(Optional in dev, logs to console)* |
| `NEWSLETTER_FROM_EMAIL` | Sender email address for briefings | `editorial@therealciso.in` |

---

## 🚀 Quickstart & Seeding

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Ensure `.env.local` is populated with your MongoDB connection string and auth keys.

### 3. Run Database Seeding
Populate the database with:
- **1 Admin** (`admin@therealciso.in`) + **1 Editor** (`editor@therealciso.in`)
- **5 Distinguished Authors** with Indian threat intelligence credentials
- **9 Core Verticals** (News, Breaches & Attacks, Threats & Vulnerabilities, Privacy & Compliance, Cloud & Identity, AI & Security, Policy & Regulation, Opinion, Interviews)
- **14 Topic Tags** (`dpdp-act`, `cert-in`, `zero-trust`, `ransomware`, etc.)
- **25 Original Cybersecurity Articles** (including 1 scheduled future article)
- **6 Events** (Upcoming and Past Summits/Webinars)
- **6 Gated Resources** (Executive whitepapers, benchmark reports, playbooks)
- **Site Settings document**

```bash
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000).

---

## 🧪 Testing Guide

### 1. Public Features
- **Homepage (`/`)**: Displays the hero featured story, 7-day trending stream by verified reads, breaking advisory ticker, vertical sections, and upcoming webinars.
- **Article Detail (`/articles/[slug]`)**: View byline credentials, auto-calculated reading time, severity pills, rich prose, share links, related stories, and live view incrementation.
- **Bot & View Deduplication**: Send a bot header (`curl -X POST -H "User-Agent: Googlebot" .../view`) to observe bot rejection. Legitimate requests increment views and deduplicate within 24 hours.
- **Categories (`/category/breaches-attacks`)**: Filter by vertical, toggle sorting (Latest vs Most Read), and test pagination.
- **Full-Text Search (`/search?q=CERT-In`)**: Perform multi-field search across title, excerpt, and content with category, severity, and date filters.
- **Events Hub (`/events`)**: Toggle between Upcoming and Past tabs with dates dynamically derived at query time.
- **Gated Whitepapers (`/resources`)**: Inspect public HTML to verify `fileUrl` is never exposed. Click "Download", complete the executive form, and verify that a signed 15-minute token link is generated.
- **Newsletter (`/newsletter`)**: Subscribe to daily or weekly briefings; test duplicate prevention and 1-click unsubscribe (`/newsletter/unsubscribe?token=...`).

### 2. Admin Portal (`/admin`)
- **Login (`/admin/login`)**:
  - Admin: `admin@therealciso.in` / `CisoAdminSecure2026!`
  - Editor: `editor@therealciso.in` / `CisoEditorSecure2026!`
- **Dashboard (`/admin`)**: Review total articles, 7-day verified reads, active subscribers, and recent leads.
- **Article Suite (`/admin/articles/new`)**:
  - Full TipTap WYSIWYG editor (Headings, bold, lists, quotes, code, links, images).
  - Image uploader (Cloudinary in prod, `/public/uploads` in dev).
  - Severity selector, category/author/tag selectors.
  - Pull-based scheduling date picker.
- **Data Export**:
  - Leads CSV: `/api/admin/export/leads`
  - Subscribers CSV: `/api/admin/export/subscribers`
- **Role-Based Governance**: Access `/admin/settings` and `/admin/users` as an Admin, or test access restrictions as an Editor.

---

## ☁️ Deploying to Vercel

1. Push this repository to GitHub or GitLab.
2. Import the project into the [Vercel Dashboard](https://vercel.com).
3. In Project Settings > **Environment Variables**, define:
   - `MONGODB_URI`: Your MongoDB Atlas URI.
   - `AUTH_SECRET`: Random 64-character secret.
   - `NEXTAUTH_URL`: Your production domain (e.g. `https://therealciso.in`).
   - `DOWNLOAD_TOKEN_SECRET`: Random 64-character secret.
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `RESEND_API_KEY`
4. Deploy. The Next.js 16 build will automatically generate static pages, optimize route bundles, and initialize the proxy handler.
