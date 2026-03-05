# Product Requirements Document (PRD)

## Project Overview
**AI CITY COPILOT — Montgomery Smart City Dashboard** is an AI-powered civic intelligence platform focused on the city of Montgomery, Alabama. It aims to act as a digital concierge and information hub for residents and tourists, answering questions, planning routes, showing historic landmarks, and providing real-time data on civic functions ranging from emergency services to financial transparency. 

## Problem Statement
City data and local business information are often fragmented across multiple websites, apps, and datasets. Tourists and residents struggle to find up-to-date information on business hours, city events, local crime reports, historical context, and public transport in a single, cohesive, easy-to-use interface. The lack of an intelligent, centralized smart-city dashboard limits civic engagement and complicates urban navigation.

## Target Users
- **Tourists & Visitors:** Need curated itineraries, historical context, and reliable navigation to landmarks and dining.
- **Local Residents:** Interested in discovering new local businesses, checking real-time public safety/crime data, and viewing city financial transparency.
- **Job Seekers:** Looking for local employment opportunities consolidated into a single view.
- **City Officials/Planners:** Require an overview of the city's operational data and transparency metrics.

## User Stories
- As a tourist, I want to type "Plan my perfect day in Montgomery" and receive a fully generated itinerary mapped with navigation.
- As a resident, I want to see which restaurants and cafes are currently open around me based on real-time data.
- As a history buff, I want to view historical landmarks, read their history via text-to-speech, and watch generated story videos.
- As a concerned citizen, I want to see recent crime reports mapped around my neighborhood to stay safe.
- As a local taxpayer, I want to view the city's open finance dashboard to understand how public funds are allocated.
- As a commuter, I want to see a map of bus stops and transport hubs to plan my travel.

## Core Features
1. **AI City Copilot Engine:** Conversational interface (text/voice) capable of day-planning, location finding, and answering civic questions.
2. **AI Smart Day Planner:** Generates multi-stop daily itineraries (breakfast, activity, lunch, evening) with map navigation.
3. **Food and Lifestyle Discovery:** Real-time business discovery powered by Bright Data, showing hours, price, and "open now" status.
4. **Interactive Maps and Navigation:** Integrated map module displaying diverse POIs (hospitals, schools, gyms, police, historical sites).
5. **Transport Module:** Information and locations for bus stops, train stations, and taxi stands.
6. **Live Crime Reports:** Heatmaps and alerts based on the Montgomery Open Data public safety API.
7. **Historic Landmarks and Storytelling:** Coordinates for historical locations, integrated text-to-speech engine, and atmospheric animated story videos.
8. **Public Health Directory:** Map integration for nearest medical facilities and emergency contacts.
9. **Open Finance Dashboard:** Visualizations for city expenditures, vendor payments, and revenue streams.
10. **Jobs Aggregation Module:** Consolidated local listings from professional networks, automatically purging expired ones.

## Technical Architecture Overview
The platform is built as a monolithic repository using a full-stack JavaScript environment, prioritizing scalability, low operational cost, and maintainability.
- **Frontend:** Next.js (App Router), TypeScript, and TailwindCSS to provide an ultra-responsive, mobile-first UI.
- **Backend:** Node.js with Express acting as the API gateway and server, handling AI integration, data sanitization, and routing.
- **Data Scraping & APIs:**
  - Bright Data for live business scraping and enhancement.
  - Socrata Open Data API (Montgomery) for crime, finance, and generic city data.
  - LLM API for conversational routing and day planning.
- **Security:** Middleware layer for prompt injection protection, rate limiting, and input sanitization.

## Security Requirements
- **Prompt Injection Protection:** The AI Copilot must refuse attempts to "ignore previous instructions", "reveal system prompt", "enter developer mode", or "dump database" and respond with "Request blocked due to security policy."
- **Input Sanitization:** All user inputs (search queries, LLM prompts) must be sanitized before processing to prevent XSS and injection attacks.
- **Rate Limiting:** IP-based rate limiting on the `/api/chat` and `/api/scrape` endpoints to prevent abuse and manage API costs.
- **Zero Third-Party Tracking:** Analytics and telemetry tools (PostHog, Google Analytics, etc.) are strictly forbidden to ensure complete user privacy.

## Future Scalability
- **Database Caching:** Introduce Redis or a managed database (PostgreSQL) to cache heavy Bright Data responses and LLM itineraries.
- **Microservices Migration:** As traffic increases, the scraping service and AI copilot engine can be isolated into independent easily-scalable workers or serverless edge functions.
- **Multi-City Support:** The architecture will decouple Montgomery-specific hardcoded data into a configuration layer, allowing rapid deployment for other cities.
