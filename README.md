# AI CITY COPILOT — Montgomery Smart City Dashboard

![Montgomery OS](https://img.shields.io/badge/Status-MVP_Live-success)
![Next.js](https://img.shields.io/badge/Framework-Next.js_16-blue)
![Architecture](https://img.shields.io/badge/Architecture-MERN+LLM-indigo)
![Analytics](https://img.shields.io/badge/Analytics-Zero_Tracking-green)

An AI-powered civic intelligence platform focused on the city of Montgomery, Alabama. This platform serves as a digital intelligence layer for residents and tourists, providing everything from live transport discovery to open finance transparency.

## 🚀 Features

* **AI Smart Day Planner:** Type "Plan my perfect day in Montgomery" and receive a heavily structured, contextual itinerary across the city.
* **Live Food & Lifestyle Discovery:** Integrates Bright Data scaffolding for real-time gym, cafe, and restaurant availability.
* **Interactive Civic Map:** Live mapping of business discovery and crime heatmaps.
* **Montgomery Open Data Connections:** Public safety and open finance (SODA architecture compliant) data visualizations using Recharts.
* **Zero Tracking Policy:** No Google Analytics, no PostHog, no Segment. 100% telemetry-free for citizen privacy.

## 🛠️ Tech Stack

* **Frontend:** Next.js (App Router), React 19, TailwindCSS v4, Recharts, Leaflet.
* **Backend:** Node.js, Express (via custom `server.ts` proxy), Next.js Edge APIs (`proxy.ts`).
* **Security:** Helmet, rate-limiting, and LLM Prompt Injection middleware.

## 🗂️ Project Architecture

```text
/ai-city-copilot
  ├── /app            # Next.js Application Route Handlers and UI
  ├── /components     # Modular React specific UI Components
  ├── /scrapers       # Bright Data Stub/Integration adapters
  ├── /services       # Core API adapters (Montgomery SODA, LLM)
  ├── /docs           # PRD and Architecture documents
  ├── proxy.ts        # Edge security middleware and rate limiting
  └── server.ts       # Express custom server configuration
```

## 🔐 Security Standards

The `/api` and `/api/chat` layers are protected by a proxy interceptor that:
1. Validates prompt sanitization (`ignore previous instructions`, `dump database`).
2. Applies strict rate limits (20 requests per minute).
3. Blocks indexing bots.

## 📦 Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server (runs Express concurrently with Next.js router):
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000)

## 📄 Documentation

Read the complete Product Requirements Document in `docs/PRD.md` for user stories and system logic.

---
*Built autonomously via Agentic Pipeline.*
