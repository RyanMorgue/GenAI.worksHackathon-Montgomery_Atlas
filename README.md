# Montgomery City Copilot

> **GenAI.works Hackathon — Montgomery Atlas**
> An AI-powered civic intelligence platform for Montgomery, Alabama.

Montgomery City Copilot helps residents and visitors explore Montgomery through interactive maps, historical storytelling, civic data, and AI assistance — all inside a cinematic, dark-themed interface.

Live deployment: [https://genai-works-hackathon-montgomery-at.vercel.app](https://genai-works-hackathon-montgomery-at.vercel.app)

---

## Project Overview

Montgomery City Copilot is an AI-powered civic intelligence platform that helps residents and visitors explore Montgomery, Alabama through interactive maps, historical storytelling, civic data, and AI assistance.

Features include:

- **AI City Copilot** — natural language civic assistant
- **Historic cinematic storytelling** — 7-scene fullscreen story with TTS narration
- **Crime and safety monitoring** — live map + trend chart
- **Jobs discovery** — paginated board with filters
- **Public health dashboard** — health data for Montgomery residents
- **Transportation hub** — bus routes, stops, real-time alerts
- **Business discovery** — POI grid with interactive map
- **City development news** — searchable news grid with category filters
- **Open Finance** — city budget and financial transparency

---

## Tech Stack

### Frontend
- **React 19** + **Next.js 16** App Router
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** — page transitions, cinematic animations, particle effects

### Animation & 3D
- **Three.js** via **@react-three/fiber** — 3D hero background
- **@react-three/drei** — Stars, Preload
- **Web Speech API** — browser-native TTS for cinematic narration

### Maps & Data Visualization
- **Leaflet** / **React-Leaflet** — interactive maps (SSR-safe)
- **Recharts** — AreaChart, BarChart, PieChart

### Backend
- **Next.js API Routes** — server-rendered on demand
- **Node.js** runtime

### Data Sources
- **Google Gemini API** — AI Copilot chat and itinerary generation (gemini-1.5-flash)
- **Bright Data** — business discovery scraping proxy
- **Montgomery Open Data (SODA)** — civic datasets
- Internal mock data for jobs, transit, news, health

### Deployment
- **Vercel** — configured via `vercel.json`

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/RyanMorgue/GenAI.worksHackathon-Montgomery_Atlas.git
cd GenAI.worksHackathon-Montgomery_Atlas
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env.local
```
Open `.env.local` and fill in your API keys (see [API Key Usage Policy](#api-key-usage-policy) below).

### 4. Run locally
```bash
npm run dev
```

### 5. Open in browser
```
http://localhost:3000
```

### 6. Build for production
```bash
npm run build
```

---

## Architecture Overview

```
ai-city-copilot/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Homepage: 3D hero + AI Copilot + Finance + Discovery
│   ├── layout.tsx                # Root layout: CityNavMenu, mobile hamburger
│   ├── history/page.tsx          # Historic cinematic story + landmarks
│   ├── crime/page.tsx            # Crime dashboard
│   ├── transit/page.tsx          # Transportation hub
│   ├── jobs/page.tsx             # Jobs discovery
│   ├── health/page.tsx           # Public health
│   ├── recreation/page.tsx       # Recreation
│   ├── development/page.tsx      # City development news
│   └── api/                      # API route handlers
│       ├── chat/route.ts         # AI Copilot endpoint
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
│   ├── CinematicStoryPlayer.tsx  # Fullscreen cinematic story engine
│   ├── CityNavMenu.tsx           # Three-dot dropdown navigation
│   ├── CrimeDashboard.tsx        # Crime map + trend chart
│   ├── BusinessDiscovery.tsx     # POI grid + Leaflet map
│   ├── FinanceDashboard.tsx      # Finance charts
│   ├── JobsModule.tsx            # Job board
│   ├── Map.tsx                   # SSR-safe Leaflet wrapper
│   └── TransportSystem.tsx       # Transit routes and schedules
│
├── lib/                          # Service layer
│   ├── validateEnv.ts            # Runtime env variable validation
│   ├── brightDataService.ts      # Bright Data scraping service
│   ├── jobGenerator.ts           # Deterministic job listing generator
│   └── services/
│       ├── aiCopilotService.ts   # Gemini chat and itinerary engine
│       └── montgomeryOpenData.ts # SODA API wrapper
│
├── hooks/
│   └── useSpeechRecognition.ts   # Web Speech API voice input
│
├── .env.example                  # Environment variable template
├── vercel.json                   # Vercel deployment config
└── next.config.ts                # Next.js configuration
```

### Frontend Interface
The homepage (`app/page.tsx`) renders a 3D animated hero section with the AI Copilot chat interface, followed by the Finance Dashboard and Business Discovery grid. Each module page is independently navigable via the three-dot `CityNavMenu`.

### API Service Layer
All external integrations live in `lib/services/`. Each service reads credentials from `process.env` and degrades gracefully to stub data when keys are absent. Runtime warnings are logged via `lib/validateEnv.ts`.

### AI Copilot Interaction System
`AICopilotService` routes user prompts by intent. "Plan my perfect day" triggers structured itinerary generation. All other prompts route to the general chat handler. When `GEMINI_API_KEY` is missing, deterministic stub responses are returned automatically.

### Cinematic Storytelling Engine
`CinematicStoryPlayer` is a fullscreen 7-scene player with:
- Pre-launch HUD screen and animated particle grid
- Scene-by-scene narration via `SpeechSynthesisUtterance`
- RGB channel-split glitch transitions (Framer Motion)
- Stale-closure-safe async callbacks using synced `useRef` + `useEffect` pattern
- Auto-advance on narration end, manual nav via progress dots

### Data Integrations
Civic data flows through the SODA API wrapper (`montgomeryOpenData.ts`). Dataset IDs are left `undefined` until confirmed to prevent hallucinated endpoints — all unconfirmed datasets return `UNAVAILABLE` status and the UI falls back to inline mock data.

---

## Debugging Cycles Completed

| # | Area | Issue Fixed |
|---|------|-------------|
| 1 | JSX | Duplicate `style` prop on `motion.div` in `app/page.tsx` |
| 2 | Imports | Unused `Image` import in `app/page.tsx` |
| 3 | Config | Wrong env var `LLM_API_KEY` → `GEMINI_API_KEY` in `aiCopilotService.ts` |
| 4 | CSS | Missing classes `rgb-hover-glow` + `custom-scrollbar` in `globals.css` |
| 5 | SSR | `Math.random()` at module level in `BusinessDiscovery.tsx` causing hydration mismatch |
| 6 | UI | `CrimeDashboard.tsx` rendered in light theme inside a dark app |
| 7 | Syntax | Apostrophe inside single-quoted string in `CinematicStoryPlayer.tsx` |
| 8 | JSX | Unescaped `"` in JSX strings in `CinematicStoryPlayer.tsx` |
| 9 | State | Unused `showMenu`/`setShowMenu` state in `CinematicStoryPlayer.tsx` |
| 10 | React | Ref mutations during render — moved to `useEffect` |
| 11 | Hooks | `Math.random()` inside `useMemo` in `MontgomeryScene.tsx` (impure) |
| 12 | Env | `BRIGHT_DATA_API_KEY` mismatch vs `.env.local`'s `BRIGHTDATA_API_KEY` |

---

## API Key Usage Policy

Some APIs used in this project require developer accounts and access credentials.

### Freely Available Keys

The following can be created by any developer at no cost:

| API | Sign-up URL |
|-----|-------------|
| Google Gemini API | https://aistudio.google.com/app/apikey |
| Bright Data | https://brightdata.com |
| Montgomery Open Data App Token | https://opendata.montgomeryal.gov |
| NewsAPI | https://newsapi.org/register |

### Keys That May Require Enterprise Access

Some integrations (civic datasets, transit APIs, health data feeds) may require:
- Organizational email verification
- Government or enterprise partnership agreements
- Paid subscription tiers

For this reason, **no API keys are included in the public repository**.

### Configuration

Copy `.env.example` to `.env.local` and fill in your values:

```env
GEMINI_API_KEY=your_key_here
BRIGHTDATA_API_KEY=your_key_here
MONTGOMERY_APP_TOKEN=your_key_here
JOBS_API_KEY=your_key_here
TRANSIT_API_KEY=your_key_here
HEALTH_API_KEY=your_key_here
NEWS_API_KEY=your_key_here
```

The app runs fully without any keys — all services degrade gracefully to stub/mock data with console warnings.

---

## Security

The `.gitignore` excludes all environment files with:

```
.env*
```

This covers `.env`, `.env.local`, `.env.production`, and any other variants. API keys are never committed to the repository. The `.env.example` file contains only placeholder values and is safe to commit.

---

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in **Vercel Dashboard → Settings → Environment Variables**
3. Deploy — Vercel auto-builds on every push to `main`

The `vercel.json` configures Next.js framework detection, build command, output directory, and `no-store` cache headers for all API routes.

---

*(Built for the GenAI.works Hackathon — Montgomery Atlas track.)*
