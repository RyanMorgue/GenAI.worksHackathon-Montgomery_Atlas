# Montgomery ATLAS

**AI-powered civic intelligence platform for Montgomery, Alabama.**

Built for the GenAI Works Hackathon. Montgomery ATLAS combines a conversational AI Copilot, interactive city data dashboards, cinematic storytelling, and a real-time safety analysis engine to help residents and visitors navigate the city smarter.

---

## Live Demo

**https://genai-works-hackathon-montgomery-at.vercel.app**

---

## Features

| Feature | Description |
|---|---|
| 🤖 AI City Copilot | Conversational assistant — restaurants, hotels, transit, attractions, history, and more |
| 🗺️ Itinerary Generator | "Plan my perfect day in Montgomery" produces a structured, stop-by-stop day plan inside the chat |
| 🎭 Cinematic Storyline | 7-scene animated walkthrough of Montgomery's civil rights history with TTS narration |
| 🏛️ Finance Dashboard | City budget and expenditure data visualized with Recharts |
| 📍 Business Discovery | Points of interest map powered by Leaflet with filterable POI cards |
| 🚌 Transit Module | Bus routes, MAX Transit system, and rideshare information |
| 💼 Jobs Module | Local job listings with deterministic seeded data |
| 🔒 Safety Intelligence | AI-driven location risk scoring with four levels and emergency service routing |
| 🚨 Emergency Routing | Nearest hospital, police, and fire station surfaced for any at-risk location |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| 3D Background | Three.js via `@react-three/fiber` + `@react-three/drei` |
| Maps | Leaflet / React-Leaflet |
| Charts | Recharts |
| AI | Google Gemini (`gemini-2.0-flash`) via `@google/generative-ai` |
| Deployment | Vercel |

---

## Architecture

```
app/
├── page.tsx               ← Homepage: Copilot, Safety, Finance, Business Discovery
├── layout.tsx             ← Root layout with CityNavMenu
├── history/page.tsx       ← Cinematic Story Player
├── transit/page.tsx       ← Transit module
├── jobs/page.tsx          ← Jobs module
├── crime/page.tsx         ← Crime Safety Dashboard
└── api/
    ├── chat/route.ts      ← AI Copilot endpoint (POST /api/chat)
    ├── safety/route.ts    ← Safety analysis endpoint (POST /api/safety)
    ├── crime/route.ts     ← Crime data endpoint
    ├── finance/route.ts   ← Finance data endpoint
    ├── transit/route.ts   ← Transit data endpoint
    └── jobs/route.ts      ← Jobs data endpoint

components/
├── SafetyIntelligence.tsx ← Risk scoring, AI location insights, emergency routing
├── CrimeDashboard.tsx     ← Crime map + trend chart
├── FinanceDashboard.tsx   ← Budget visualizations
├── BusinessDiscovery.tsx  ← POI list + map
├── MontgomeryScene.tsx    ← Three.js 3D animated background
├── CinematicStoryPlayer.tsx ← 7-scene cinematic story player
├── CityNavMenu.tsx        ← Three-dot dropdown navigation
└── Map.tsx                ← Dynamic Leaflet map (SSR-safe)

lib/
├── ai/gemini.ts           ← Gemini wrapper (lazy init, dual key support)
├── services/
│   ├── aiCopilotService.ts ← Chat + itinerary engine with intent routing
│   └── montgomeryOpenData.ts ← SODA open data wrapper
└── validateEnv.ts         ← Runtime env var validation
```

**AI Request Flow:**

```
User types prompt
    → handleAsk() in page.tsx
    → POST /api/chat
    → AICopilotService.processPrompt()
    → Intent routing (itinerary vs. chat)
    → Gemini API (if key available)
    → getFallbackResponse() (if quota or unavailable)
    → Response appended to chatLog state
    → Rendered in chat bubble (multiline via .split('\n'))
```

---

## New Features (v2)

### 🔒 Interactive Safety Intelligence

A four-level risk scoring system that analyzes any location description in Montgomery:

| Level | Color | Score Range |
|---|---|---|
| Low Risk | 🟢 Green | 0–24 |
| Moderate Risk | 🟡 Yellow | 25–44 |
| High Risk | 🟠 Orange | 45–69 |
| Critical Risk | 🔴 Red | 70–100 |

### 🧠 AI Location Insights

Enter a natural language description of a location or scenario:

> "Downtown Montgomery at night"
> "Riverfront Park alone at dusk"

Returns:
- **Risk Score** (0–100) with animated progress bar
- **Detected Risk Factors** — lighting, time of day, isolation, crowd density
- **Safety Recommendations** — specific, actionable guidance

Powered by Gemini AI with a deterministic keyword-based fallback when the API is unavailable.

### 🚨 Emergency Response Routing

When risk is **Moderate or higher**, the panel surfaces the nearest:

- 🏥 **Hospital** — Baptist Medical Center South
- 🚔 **Police** — Montgomery Police Department HQ
- 🚒 **Fire Dept.** — Montgomery Fire Department HQ

Each card shows name, address, and a tap-to-call phone number. Always includes a 911 reminder.

---

## Installation

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/ai-city-copilot.git
cd ai-city-copilot

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local — add GEMINI_API_KEY

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Source |
|---|---|---|
| `GEMINI_API_KEY` | Yes (or `GOOGLE_API_KEY`) | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) — use a personal Gmail account |
| `GOOGLE_API_KEY` | Alias for above | Same source |
| `BRIGHTDATA_API_KEY` | No | [brightdata.com](https://brightdata.com) |
| `MONTGOMERY_APP_TOKEN` | No | [opendata.montgomeryal.gov](https://opendata.montgomeryal.gov) |

> **Important:** Generate your Gemini API key from a **personal Gmail account** at AI Studio, not a GCP organization account (org accounts zero out free-tier quota).

---

## Running the Project

```bash
# Development with hot reload
npm run dev

# Verify production build
npm run build

# Start production server locally
npm start
```

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Add API key to Vercel environment
echo "YOUR_GEMINI_KEY" | vercel env add GEMINI_API_KEY production

# Deploy
vercel --prod --yes
```

---

## Known Limitations

| Limitation | Detail |
|---|---|
| Gemini quota | GCP org accounts have `limit: 0`; the app falls back to intent-aware stub responses |
| SODA dataset IDs | Montgomery Open Data IDs are undefined; crime and finance use inline mock data |
| Recharts SSR | Container dimension warnings appear during static generation — non-breaking |

---

## Future Improvements

- Real-time Montgomery Open Data integration (crime, permits, 311 calls)
- Persistent chat history with local storage or a database
- User accounts and saved itineraries
- Live transit tracking via MAX Transit GTFS feeds
- Safety heatmap overlay on the Leaflet map
- Multi-city expansion beyond Montgomery

---

## Author

Built for the **GenAI Works Hackathon** — Montgomery, Alabama AI Civic Platform.

Powered by Google Gemini, Next.js, and Three.js.
