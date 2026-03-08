# Montgomery ATLAS

**AI-powered city intelligence platform for Montgomery, Alabama.**

Built for the GenAI Works Hackathon. Montgomery ATLAS combines a conversational AI Copilot, live city intelligence mapping, an incident simulator, an interactive safety analysis engine, cinematic civil rights storytelling, and real-time civic data dashboards — all in a single platform.

---

## Live Demo

**https://genai-works-hackathon-montgomery-at.vercel.app**

---

## Features

| Feature | Description |
|---|---|
| 🤖 AI City Copilot | Conversational assistant — restaurants, hotels, transit, attractions, history, events, and more |
| 🗺️ Itinerary Generator | "Plan my perfect day in Montgomery" produces a stop-by-stop day plan inside the chat bubble |
| 🎭 Cinematic Storyline | 7-scene animated walkthrough of Montgomery's civil rights history with TTS narration |
| 🔒 Safety Intelligence | AI-driven location risk scoring (Low/Moderate/High/Critical) with factors + recommendations |
| 🚨 Emergency Routing | Nearest hospital, police, and fire station surfaced for any Moderate+ risk location |
| 🗺️ Live City Intelligence Map | Leaflet map with color-coded risk zone overlays across 8 Montgomery zones |
| 🛡️ ATLAS Command Center | Full ops dashboard: live map, incident simulator, alert feed, emergency quick-access |
| ⚡ AI Incident Simulator | Simulate scenarios ("Protest downtown", "Severe weather") — ATLAS analyzes risk + updates map |
| 🏛️ Finance Dashboard | Montgomery city budget and expenditure visualized with Recharts |
| 📍 Business Discovery | Points of interest map with filterable POI cards |
| 🚌 Transit Module | MAX Transit system, bus routes, and rideshare info |
| 💼 Jobs Module | Local job listings with deterministic seeded data |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| 3D Background | Three.js via `@react-three/fiber` + `@react-three/drei` |
| Maps | Leaflet / React-Leaflet (dynamic import, SSR-safe) |
| Charts | Recharts |
| AI | Google Gemini (`gemini-2.0-flash`) via `@google/generative-ai` |
| Deployment | Vercel |

---

## Architecture

```
app/
├── page.tsx                ← Homepage: Copilot + Safety Intelligence + Finance + Business Discovery
├── dashboard/page.tsx      ← ATLAS Command Center: Live Map + Incident Simulator + Alert Feed
├── layout.tsx              ← Root layout with CityNavMenu
├── history/page.tsx        ← Cinematic Story Player
├── transit/page.tsx        ← Transit module
├── jobs/page.tsx           ← Jobs module
├── crime/page.tsx          ← Crime Safety Dashboard
└── api/
    ├── chat/route.ts       ← AI Copilot (POST /api/chat)
    ├── safety/route.ts     ← Location risk analysis (POST /api/safety)
    ├── incident/route.ts   ← Incident simulation (POST /api/incident)
    ├── crime/route.ts      ← Crime data
    ├── finance/route.ts    ← Finance data
    ├── transit/route.ts    ← Transit data
    └── jobs/route.ts       ← Jobs data

components/
├── SafetyIntelligence.tsx  ← Risk scoring, AI location insights, emergency routing
├── CityIntelligenceMap.tsx ← Leaflet map with color-coded risk zone overlays
├── CrimeDashboard.tsx      ← Crime map + trend chart
├── FinanceDashboard.tsx    ← Budget visualizations
├── BusinessDiscovery.tsx   ← POI list + Leaflet map
├── MontgomeryScene.tsx     ← Three.js 3D animated background
├── CinematicStoryPlayer.tsx ← 7-scene cinematic story player
├── CityNavMenu.tsx         ← Navigation dropdown (includes Dashboard link)
└── Map.tsx                 ← Dynamic Leaflet POI map (SSR-safe)

lib/
├── ai/gemini.ts            ← Gemini wrapper (lazy init, dual key support)
├── services/
│   ├── aiCopilotService.ts ← Chat + itinerary engine with 11-intent routing
│   └── montgomeryOpenData.ts ← SODA open data wrapper
└── validateEnv.ts          ← Runtime env var validation
```

**AI Request Flow:**
```
User prompt
    → handleAsk() / simulate()
    → POST /api/chat | /api/safety | /api/incident
    → Gemini API (if key available)
    → Deterministic keyword fallback (if quota or no key)
    → Response rendered in chat bubble / safety card / incident panel
    → Live map updated with incident zones
```

---

## Intelligence Features

### 🔒 Safety Intelligence (homepage)

Enter any Montgomery location description and receive:
- **Risk Score** (0–100) with animated progress bar
- **Detected Risk Factors** — lighting, time of day, crowd density, isolation
- **Safety Recommendations** — specific, actionable guidance
- **Emergency Response Routing** — shown for Moderate risk and above

| Level | Color | Score |
|---|---|---|
| Low Risk | 🟢 Green | 0–24 |
| Moderate Risk | 🟡 Yellow | 25–44 |
| High Risk | 🟠 Orange | 45–69 |
| Critical Risk | 🔴 Red | 70–100 |

---

### 🗺️ Live City Intelligence Map (`/dashboard`)

A Leaflet map overlaid with **8 real-time risk zones** across Montgomery:

| Zone | Default Risk |
|---|---|
| Downtown Core | Moderate |
| Civil Rights District | Low |
| Riverfront Park | Low |
| Dexter Avenue Corridor | Moderate |
| South Montgomery | High |
| East Montgomery | Moderate |
| Old Cloverdale | Low |
| Cramton Bowl Area | Low |

Zones update dynamically when an incident is simulated. Incident zones glow with solid color overlays and an "⚡ INCIDENT ACTIVE" legend indicator.

---

### 🛡️ ATLAS Command Center (`/dashboard`)

A city operations dashboard with:
- **Status bar** — ATLAS ONLINE indicator, current threat level, live UTC clock
- **Stat cards** — Zones Monitored, Current Threat, AI Engine status, Alert count
- **Live City Intelligence Map** — full map with zone overlays
- **Zone Status Grid** — 8-zone risk summary cards
- **Alert Feed** — timestamped incident alerts with risk level badges
- **Emergency Quick-Access** — tap-to-call for 911, MPD, Fire, and Baptist Medical

---

### ⚡ AI Incident Simulator (`/dashboard`)

Simulate scenarios and see ATLAS analyze the situation in real time:

**Example scenarios:**
- `"Large protest downtown"` → Moderate (58/100), Dexter Ave + Capitol zones affected
- `"Emergency evacuation"` → Critical (88/100), city-wide zones, National Guard resources
- `"Severe weather — tornado watch"` → High (72/100), Riverfront critical, South Montgomery high
- `"Public concert at Riverfront at night"` → Low (28/100), standard crowd management

**Output per simulation:**
- Severity level + risk score with animated bar
- Estimated duration
- Resources needed (Police / Fire / Medical / etc.)
- Immediate risk factors
- Response recommendations
- Affected zone list → updates Live Map in real time

---

## Installation

```bash
git clone https://github.com/YOUR_USERNAME/ai-city-copilot.git
cd ai-city-copilot
npm install
cp .env.example .env.local   # add GEMINI_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Source |
|---|---|---|
| `GEMINI_API_KEY` | Yes (or `GOOGLE_API_KEY`) | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) — **personal Gmail account only** |
| `GOOGLE_API_KEY` | Alias for above | Same source |
| `BRIGHTDATA_API_KEY` | No | [brightdata.com](https://brightdata.com) |
| `MONTGOMERY_APP_TOKEN` | No | [opendata.montgomeryal.gov](https://opendata.montgomeryal.gov) |

> GCP organization accounts zero out free-tier quota. Use a **personal Gmail** account at AI Studio. All features fall back gracefully with no key.

---

## Running the Project

```bash
npm run dev      # development with hot reload
npm run build    # production build
npm start        # production server
```

---

## Deployment (Vercel)

```bash
npm i -g vercel
echo "YOUR_KEY" | vercel env add GEMINI_API_KEY production
vercel --prod --yes
```

---

## Known Limitations

| Limitation | Detail |
|---|---|
| Gemini quota | GCP org accounts have `limit: 0`; all features fall back to deterministic keyword responses |
| SODA dataset IDs | Montgomery Open Data IDs undefined; crime/finance use inline mock data |
| Recharts SSR | Container dimension warnings during static generation — non-breaking |

---

## Future Improvements

- Real-time Montgomery Open Data integration (crime, permits, 311 calls)
- Safety heatmap layer on the intelligence map
- Live transit tracking via MAX Transit GTFS feeds
- Persistent chat history and saved itineraries
- Multi-city expansion beyond Montgomery

---

## Author

Built for the **GenAI Works Hackathon** — Montgomery, Alabama AI Civic Platform.

Powered by Google Gemini, Next.js, Leaflet, Three.js, and Framer Motion.
