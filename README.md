# Montgomery City Copilot

> **GenAI.works Hackathon — Montgomery Atlas**
> An AI-powered civic intelligence platform for Montgomery, Alabama.

Montgomery City Copilot helps residents and visitors explore Montgomery through interactive maps, historical storytelling, civic data, and AI assistance — all inside a cinematic, dark-themed interface.

**Live deployment:** [https://genai-works-hackathon-montgomery-at.vercel.app](https://genai-works-hackathon-montgomery-at.vercel.app)

---

## What Is This Application?

Montgomery City Copilot is your personal AI guide to Montgomery, Alabama. Whether you are a resident, a visitor, or a researcher, the app gives you instant access to:

- **A conversational AI assistant** (ATLAS) that answers questions about the city in plain English
- **Historical storytelling** narrated with voice and cinematic visuals
- **Live civic data** — crime trends, transportation, jobs, health, and city finances
- **Business discovery** with an interactive map of local restaurants, gyms, spas, and more

No technical knowledge is required to use the app. Just type a question or click a button.

---

## Features

| Feature | Description |
|---------|-------------|
| **AI City Copilot (ATLAS)** | Ask anything about Montgomery — history, dining, transport, safety. Powered by Google Gemini. |
| **"Plan My Perfect Day"** | Type the phrase to receive a full AI-generated day itinerary with map stops. |
| **Cinematic Story Mode** | A fullscreen 7-scene narrated story of Montgomery's history with voice synthesis. |
| **Crime & Safety Dashboard** | Interactive crime map and trend chart sourced from civic data. |
| **Jobs Discovery** | Paginated job board with role filters and salary ranges. |
| **Public Health Dashboard** | Health data and wellness indicators for Montgomery residents. |
| **Transportation Hub** | Bus routes, stop locations, and real-time alert display. |
| **Business Discovery** | Map and list of local POIs (restaurants, cafes, gyms, salons, spas) with open/closed status. |
| **City Development News** | Searchable news grid with category filters. |
| **Open Finance** | City budget transparency with interactive charts. |

---

## Tech Stack

### Frontend
- **React 19** + **Next.js 16** App Router
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** — page transitions, cinematic animations, particle effects

### Animation & 3D
- **Three.js** via **@react-three/fiber** — 3D star field hero background
- **@react-three/drei** — Stars, Preload helpers
- **Web Speech API** — browser-native text-to-speech for cinematic narration

### Maps & Data Visualization
- **Leaflet** / **React-Leaflet** — interactive maps (SSR-safe dynamic import)
- **Recharts** — AreaChart, BarChart, PieChart

### AI & Backend
- **Google Gemini API** (`gemini-2.0-flash`) — AI Copilot chat and itinerary generation
- **Next.js API Routes** — server-side data fetching and AI proxy

### Data Sources
- **Montgomery Open Data (SODA)** — civic datasets
- **Internal mock/stub data** — jobs, transit, news, health (graceful fallback when live data unavailable)

### Deployment
- **Vercel** — configured via `vercel.json`

---

## Installation Guide

### Prerequisites
- Node.js 18 or later
- npm (comes with Node.js)
- A Google Gemini API key (free — see below)

### Step 1 — Clone the repository
```bash
git clone https://github.com/RyanMorgue/GenAI.worksHackathon-Montgomery_Atlas.git
cd GenAI.worksHackathon-Montgomery_Atlas
```

### Step 2 — Install dependencies
```bash
npm install
```

### Step 3 — Create your environment file
```bash
cp .env.example .env.local
```

### Step 4 — Add your Gemini API key

Open `.env.local` in any text editor and replace `your_key_here`:

```env
GEMINI_API_KEY=your_key_here
```

**How to get a free Gemini API key:**
1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with a **personal Gmail account** (not a school or work Google Workspace account)
3. Click **Create API key** then select **Create API key in new project**
4. Copy the key and paste it into `.env.local`

> **Important:** Keys from Google Workspace or GCP-billed projects have a free-tier quota of 0. Always use a personal Gmail account and create the key in a new project to get the free tier (1,500 requests/day for `gemini-2.0-flash`).

### Step 5 — Start the development server
```bash
npm run dev
```

### Step 6 — Open in your browser
```
http://localhost:3000
```

### Step 7 — Build for production (optional)
```bash
npm run build
```

---

## Usage Guide

### AI Copilot (ATLAS)

On the homepage, you will see a text input at the bottom of the hero section. Type any question about Montgomery and press **Enter** or click the **send button**.

**Example questions:**
- *"What are the best restaurants in Montgomery?"*
- *"Tell me about the Civil Rights history of Montgomery"*
- *"What bus routes go downtown?"*
- *"Plan my perfect day in Montgomery"* — generates a full curated day itinerary

You can also click the **microphone icon** to use voice input.

### Cinematic Story Mode

Click the **"Play Cinematic Storyline"** button on the homepage. A fullscreen experience launches — 7 scenes narrating Montgomery's history with voice synthesis and cinematic transitions. Use the navigation dots at the bottom to jump between scenes, or let it play through automatically.

### Navigation

Click the **three-dot menu** (top right) to access all sections:
- **Home** — Copilot + Finance Dashboard + Business Discovery
- **History** — Cinematic Story + Landmarks Map
- **Crime & Safety** — Crime map + trend charts
- **Transportation** — Bus routes + stop finder
- **Jobs** — Job board with filters
- **Public Health** — Health indicators dashboard
- **City Development** — News grid with category filters

---

## Developer Guide

### Folder Structure

```
ai-city-copilot/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Homepage: 3D hero + AI Copilot + Finance + Discovery
│   ├── layout.tsx                # Root layout: CityNavMenu, mobile hamburger
│   ├── history/page.tsx          # Cinematic story + landmarks
│   ├── crime/page.tsx            # Crime dashboard
│   ├── transit/page.tsx          # Transportation hub
│   ├── jobs/page.tsx             # Jobs discovery
│   ├── health/page.tsx           # Public health
│   ├── recreation/page.tsx       # Recreation
│   ├── development/page.tsx      # City development news
│   └── api/                      # API route handlers
│       ├── chat/route.ts         # AI Copilot endpoint (POST /api/chat)
│       ├── crime/route.ts        # Crime data
│       ├── finance/route.ts      # Finance transparency
│       ├── jobs/route.ts         # Jobs listing
│       ├── news/route.ts         # City news
│       ├── transit/route.ts      # Transit data
│       ├── scrape/route.ts       # Bright Data proxy
│       └── health/route.ts       # Health status
│
├── components/                   # Shared React components
│   ├── MontgomeryScene.tsx       # Three.js/R3F 3D background scene
│   ├── CinematicStoryPlayer.tsx  # Fullscreen 7-scene cinematic engine
│   ├── CityNavMenu.tsx           # Three-dot dropdown navigation
│   ├── CrimeDashboard.tsx        # Crime map + trend chart
│   ├── BusinessDiscovery.tsx     # POI grid + Leaflet map
│   ├── FinanceDashboard.tsx      # Finance charts
│   ├── JobsModule.tsx            # Job board
│   ├── Map.tsx                   # SSR-safe Leaflet wrapper
│   └── TransportSystem.tsx       # Transit routes and schedules
│
├── lib/                          # Service layer
│   ├── ai/
│   │   └── gemini.ts             # Google Gemini wrapper (generateText, generateJSON)
│   ├── validateEnv.ts            # Runtime env variable validation
│   ├── brightDataService.ts      # Bright Data scraping service
│   ├── jobGenerator.ts           # Deterministic job listing generator
│   └── services/
│       ├── aiCopilotService.ts   # Chat/itinerary engine with quota fallback
│       └── montgomeryOpenData.ts # SODA API wrapper
│
├── hooks/
│   └── useSpeechRecognition.ts   # Web Speech API voice input hook
│
├── .env.example                  # Environment variable template (safe to commit)
├── vercel.json                   # Vercel deployment config
└── next.config.ts                # Next.js configuration
```

### AI Copilot Integration

The Gemini AI flow:

```
User prompt
  └─► POST /api/chat
        └─► AICopilotService.processPrompt()
              ├─► "Plan my perfect day" → generateItinerary() → generateJSON() → gemini-2.0-flash
              └─► all other prompts   → generateChatResponse() → generateText() → gemini-2.0-flash

On API error (quota / network):
  └─► graceful stub fallback — app stays functional
```

**Key files:**
- [`lib/ai/gemini.ts`](lib/ai/gemini.ts) — Gemini SDK wrapper with lazy `getClient()` (key read per-request, no restart needed on key change)
- [`lib/services/aiCopilotService.ts`](lib/services/aiCopilotService.ts) — Intent routing, Gemini calls, 429 quota detection, stub fallback
- [`app/api/chat/route.ts`](app/api/chat/route.ts) — HTTP POST handler with 10-second `Promise.race` timeout

### Graceful Degradation

The app is designed to work without any API keys:

| Condition | Behavior |
|-----------|----------|
| No `GEMINI_API_KEY` | Stub chat / itinerary responses returned |
| Gemini 429 quota exceeded | Stub responses returned (no crash) |
| SODA civic data unavailable | UI falls back to inline mock data |
| Bright Data unavailable | Business discovery uses deterministically generated POIs |

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```env
# Required for AI Copilot
GEMINI_API_KEY=your_gemini_key_here

# Optional — app works without these (falls back to mock data)
NEWS_API_KEY=your_newsapi_key
BRIGHTDATA_API_KEY=your_brightdata_key
BRIGHTDATA_USERNAME=your_brightdata_username
MONTGOMERY_APP_TOKEN=your_soda_app_token
TRANSIT_API_KEY=your_transit_key
JOBS_API_KEY=your_jobs_key
HEALTH_API_KEY=your_health_key

# Internal config
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development

# Feature flags
ENABLE_3D_BACKGROUND=true
ENABLE_CINEMATIC_STORYLINE=true
ENABLE_DEPTH_LIGHTING=true
```

**Where to get keys:**

| Variable | Source | Cost |
|----------|--------|------|
| `GEMINI_API_KEY` | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) — use a personal Gmail account | Free |
| `NEWS_API_KEY` | [newsapi.org/register](https://newsapi.org/register) | Free tier |
| `BRIGHTDATA_API_KEY` | [brightdata.com](https://brightdata.com) | Paid |
| `MONTGOMERY_APP_TOKEN` | [opendata.montgomeryal.gov](https://opendata.montgomeryal.gov) | Free |

---

## Deployment Guide

### Deploy to Vercel (Recommended)

1. **Push your repository to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click **Add New → Project**
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add environment variables in Vercel**
   - Go to **Project Settings → Environment Variables**
   - Add `GEMINI_API_KEY` (required for live AI)
   - Add any other keys you have
   - Apply to **Production**, **Preview**, and **Development**

4. **Deploy**
   - Click **Deploy**
   - Every push to `main` triggers an automatic redeploy

The `vercel.json` is pre-configured with:
- Next.js framework detection
- `no-store` cache headers for all API routes (ensures live data on every request)

---

## Known Limitations

| Area | Status | Notes |
|------|--------|-------|
| Gemini API (GCP org accounts) | ⚠️ | Keys from GCP-billed projects have free-tier quota of 0 — use a personal Gmail account |
| Crime live data | ℹ️ | SODA dataset ID not confirmed — displays mock data |
| Finance live data | ℹ️ | SODA dataset ID not confirmed — displays mock data |
| Bright Data integration | ℹ️ | Requires paid account for live business scraping |
| Hero character image | ℹ️ | Place `/public/images/rosa-parks-hero.jpg` to activate the cinematic character overlay |

---

## Debugging History

| # | Area | Issue Fixed |
|---|------|-------------|
| 1 | JSX | Duplicate `style` prop on hero `motion.div` in `app/page.tsx` |
| 2 | Imports | Unused `Image` import in `app/page.tsx` |
| 3 | Config | Wrong env var `LLM_API_KEY` → `GEMINI_API_KEY` in `aiCopilotService.ts` |
| 4 | CSS | Missing utility classes `rgb-hover-glow` and `custom-scrollbar` in `globals.css` |
| 5 | SSR | `Math.random()` at module level in `BusinessDiscovery.tsx` — hydration mismatch |
| 6 | UI | `CrimeDashboard.tsx` rendered light theme inside dark-mode app |
| 7–9 | Syntax/State | String escaping and unused state in `CinematicStoryPlayer.tsx` |
| 10 | React | Ref mutations during render — moved to `useEffect` |
| 11 | Hooks | Impure `Math.random()` inside `useMemo` in `MontgomeryScene.tsx` |
| 12 | Env | `BRIGHT_DATA_API_KEY` vs `BRIGHTDATA_API_KEY` key name mismatch |
| 13 | AI | Full migration from OpenAI SDK to Google Gemini (`@google/generative-ai`) |
| 14 | AI | `gemini-1.5-flash` unavailable on v1beta endpoint — switched to `gemini-2.0-flash` |
| 15 | AI | Module-level Gemini client init — refactored to lazy `getClient()` per-request |
| 16 | SSR | Particles `Math.random()` in `app/page.tsx` — moved to `useEffect` |
| 17 | AI | Added 429 quota detection with graceful stub fallback in both chat and itinerary flows |

---

## API Key Usage Policy

No API keys are included in this repository. The `.gitignore` excludes all `.env*` files. The `.env.example` file contains only placeholder values and is safe to commit.

The app runs fully without any keys — all services degrade gracefully to stub/mock data with console warnings.

---

*(Built for the GenAI.works Hackathon — Montgomery Atlas track.)*
