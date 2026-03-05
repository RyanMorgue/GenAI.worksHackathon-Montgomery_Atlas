# System Architecture

## Architecture Overview
The AI CITY COPILOT is designed as a modular, scalable, full-stack application. It leverages Next.js for the presentation layer, powered by a custom Node.js/Express backend that orchestrates external API calls to Montgomery Open Data, Bright Data, and LLM inference providers.

## High-Level Diagram

```mermaid
graph TD
    Client[Client Browser/Mobile]
    NextJS[Next.js Frontend]
    Express[Express.js Backend API]
    
    SubGraph_ExternalAPIs[External APIs & Services]
        LLM[LLM API Engine]
        SODA[Montgomery Open Data]
        BrightData[Bright Data Scraper]
        TTS[Text-to-Speech Engine]
    end
    
    Client -- HTTP/WebSocket --> NextJS
    NextJS -- Internal Fetch --> Express
    Express -- Prompting --> LLM
    Express -- REST --> SODA
    Express -- Proxy Scrape --> BrightData
    Express -- Generate --> TTS
```

## Component Breakdown

### Frontend Layer (Next.js + TailwindCSS)
- **Framework:** Next.js React Framework using the App Router (`/app`).
- **Styling:** TailwindCSS for utility-first styling.
- **Maps:** Leaflet or Mapbox GL JS for interactive map rendering, marker management, and path routing.
- **Components:** Modular React components broken down by feature (`/components/map`, `/components/chat`, `/components/dashboard`).

### Backend Layer (Node.js + Express)
The backend acts as a secure proxy and business logic executor. 
- **API Routes (`/api`):** Exposes clean endpoints for the frontend to consume (e.g., `/api/crime`, `/api/plan-day`, `/api/businesses`).
- **Services (`/services`):** Encapsulates the core business logic, formatting, and external API orchestration.
- **Scrapers (`/scrapers`):** Contains Bright Data configuration and batching logic for business discovery.

### Secondary Modules
- **AI Copilot Engine:** Processes conversational input, extracts intent (e.g., "planning" vs "querying data"), and generates structured JSON itineraries.
- **Open Finance & Crime:** Fetches and standardizes SODA responses into application-specific interfaces.
- **Security Middleware (`/security`):** Inspects incoming payload strings for malicious commands or known injection vectors before hitting the LLM.

## Architecture Decisions & Rationale
1. **Express + Next.js:** While Next.js App Router has built-in Route Handlers, using a dedicated Express backend layer provides finer control over WebSockets (if needed), advanced rate-limiting, and separation of concerns for the heavily-tasked web scraping workers.
2. **No Tracking/Analytics:** Strictly adheres to the project requirement. No client-side SDKs will be implemented. All internal logging will be handled via a custom minimal `console.log` wrapping utility on the Express server.
3. **Stateless AI:** Conversation history is maintained on the client-side (sessionStorage/React state) to minimize server database requirements and keep operational costs low.
4. **Proxy Scraping:** Bright Data calls are strictly routed through the Express backend to protect credentials and handle batching.

## Data Models (Internal Interfaces)

**Location Object:**
```typescript
interface LocationPOI {
    id: string;
    name: string;
    category: string;
    lat: number;
    lng: number;
    hours?: string;
    isOpen?: boolean;
    priceRange?: '$' | '$$' | '$$$';
    dataSource: 'montgomery' | 'brightdata' | 'wiki';
}
```

**Itinerary Object:**
```typescript
interface DayItinerary {
    id: string;
    promptText: string;
    stops: {
        timeBlock: 'Morning' | 'Lunch' | 'Afternoon' | 'Evening';
        location: LocationPOI;
        description: string;
    }[];
}
```

## Scalability and Maintainability
- The scraper tasks are designed to be run asynchronously and can easily be moved to an external cron service.
- The repository structure maps 1:1 with the requested folder hierarchy, ensuring clean separation between security, services, maps, and UI.
