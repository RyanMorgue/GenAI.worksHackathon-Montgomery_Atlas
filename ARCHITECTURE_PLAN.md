# AI City Copilot - Architecture Plan

**Project**: AI-Powered Smart City Platform for Montgomery, Alabama  
**Approach**: Modular, scalable, production-ready  
**Target**: Hackathon-quality deliverable with engineering discipline

---

## SYSTEM OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                    SMART CITY DASHBOARD UI                      │
│  (Next.js App Router + React 19 + TailwindCSS + Framer Motion)  │
└─────────────────────────────────────────────────────────────────┘
         │                    │                       │
    ┌────▼─────┐    ┌────────▼────────┐    ┌────────▼────────┐
    │  Copilot  │    │  Historical     │    │   City Map      │
    │   Chat    │    │   Stories       │    │   Interface     │
    │ Interface │    │   Player        │    │   (Leaflet)     │
    └────┬─────┘    └────────┬────────┘    └────────┬────────┘
         │                    │                       │
    ┌────▼─────────────────────▼─────────────────────▼────┐
    │           DISCOVERY PANELS MODULE SYSTEM            │
    │  ┌──────────────┬──────────────┬──────────────┐     │
    │  │  Business    │   Jobs       │  Transport   │     │
    │  │  Discovery   │  Browser     │  System      │     │
    │  └──────────────┴──────────────┴──────────────┘     │
    │  ┌──────────────┬──────────────┬──────────────┐     │
    │  │  Crime &     │  Finance     │  Other       │     │
    │  │  Safety      │  Dashboard   │  Modules     │     │
    │  └──────────────┴──────────────┴──────────────┘     │
    └────┬──────────────────────────────────────────┬─────┘
         │                                       │
    ┌────▼─────────────────────────────────────▼────┐
    │          NEXT.JS API ROUTES LAYER              │
    │  ┌──────┬──────┬──────┬──────┬──────┬──────┐   │
    │  │/chat │/scra-│/crime│/jobs │/trans│/fina-│   │
    │  │      │ pe   │      │      │port  │ nce  │   │
    │  └──────┴──────┴──────┴──────┴──────┴──────┘   │
    └────┬──────────────────────────────────────────┘
         │
    ┌────▼──────────────────────────────────────────┐
    │       BACKEND SERVICES & INTEGRATIONS         │
    │  ┌──────────────┬──────────────────────────┐  │
    │  │   AI Engine  │   Business Discovery     │  │
    │  │  • Prompts   │  • Bright Data API       │  │
    │  │  • Context   │  • Data enrichment       │  │
    │  │  • Handlers  │  • Caching (5min TTL)   │  │
    │  └──────────────┴──────────────────────────┘  │
    │  ┌──────────────┬──────────────────────────┐  │
    │  │ Open Data    │   External APIs          │  │
    │  │  Integration │                          │  │
    │  │  • Crime     │  • LinkedIn jobs         │  │
    │  │  • Finance   │  • Indeed jobs           │  │
    │  │  • Transport │  • LLM services          │  │
    │  └──────────────┴──────────────────────────┘  │
    └────┬──────────────────────────────────────────┘
         │
    ┌────▼──────────────────────────────────────────┐
    │     CACHING & STATE MANAGEMENT LAYER          │
    │  • In-memory cache (business, jobs, finance)  │
    │  • Browser localStorage (chat history)        │
    │  • React state (UI interactions)              │
    └───────────────────────────────────────────────┘
```

---

## DIRECTORY STRUCTURE

```
ai-city-copilot/
├── app/
│   ├── layout.tsx                    # Root layout with theme
│   ├── page.tsx                      # Main dashboard
│   ├── globals.css                   # Global styles
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts             # AI Copilot chat endpoint
│   │   ├── scrape/
│   │   │   └── route.ts             # Business discovery endpoint
│   │   ├── crime/
│   │   │   └── route.ts             # Crime data endpoint
│   │   ├── jobs/
│   │   │   └── route.ts             # Jobs data endpoint
│   │   ├── transport/
│   │   │   └── route.ts             # Transport data endpoint
│   │   ├── finance/
│   │   │   └── route.ts             # Finance data endpoint
│   │   └── city-data/
│   │       └── route.ts             # General city data endpoint
│   ├── crime/
│   │   └── page.tsx                 # Crime dashboard page
│   ├── development/
│   │   └── page.tsx                 # Development projects page
│   ├── health/
│   │   └── page.tsx                 # Health services page
│   ├── history/
│   │   └── page.tsx                 # Historical stories page
│   ├── jobs/
│   │   └── page.tsx                 # Jobs browser page
│   ├── recreation/
│   │   └── page.tsx                 # Recreation page
│   └── transit/
│       └── page.tsx                 # Transit page
│
├── components/
│   ├── Dashboard.tsx                # Main dashboard layout
│   ├── CopilotChat.tsx             # Copilot chat interface
│   ├── HistoricalStoryPlayer.tsx   # Story animation player
│   ├── CityMap.tsx                 # Leaflet map component
│   ├── DiscoveryPanel.tsx          # Generic discovery panel
│   ├── BusinessDiscovery.tsx       # Business discovery module
│   ├── JobsBrowser.tsx             # Jobs listing module
│   ├── TransportSystem.tsx         # Transport navigation
│   ├── CrimeDashboard.tsx          # Crime monitoring
│   ├── FinanceDashboard.tsx        # Finance transparency
│   ├── HealthModule.tsx            # Health services
│   ├── DevelopmentModule.tsx       # Infrastructure projects
│   ├── RecreationModule.tsx        # Recreation activities
│   └── CommonComponents/
│       ├── FilterPanel.tsx          # Reusable filter component
│       ├── DataCard.tsx             # Reusable data card
│       ├── PaginationControl.tsx    # Pagination component
│       ├── LoadingSpinner.tsx       # Loading indicator
│       ├── ErrorMessage.tsx         # Error display
│       └── ChartContainer.tsx       # Chart wrapper
│
├── lib/
│   ├── services/
│   │   ├── aiCopilotService.ts      # AI engine with all handlers
│   │   ├── brightDataService.ts     # Business discovery scraper
│   │   ├── montgomeryOpenDataService.ts # Crime, finance, transport
│   │   ├── jobsAggregatorService.ts # Job scraping & aggregation
│   │   └── dataEnrichmentService.ts # Data formatting & enrichment
│   │
│   ├── utils/
│   │   ├── validation.ts            # Input validation & sanitization
│   │   ├── formatting.ts            # Data formatting utilities
│   │   ├── constants.ts             # App constants
│   │   ├── security.ts              # Security utilities
│   │   ├── cache.ts                 # Caching utilities
│   │   └── api.ts                   # API client utilities
│   │
│   └── middleware/
│       ├── rateLimit.ts             # Rate limiting middleware
│       ├── validation.ts            # Request validation middleware
│       ├── security.ts              # Security headers middleware
│       └── errorHandler.ts          # Error handling middleware
│
├── hooks/
│   ├── useSpeechRecognition.ts      # Voice input hook
│   ├── useSpeechSynthesis.ts        # Voice narration hook
│   ├── useLocalStorage.ts           # Chat history persistence
│   ├── useMap.ts                    # Map initialization hook
│   ├── useMarkers.ts                # Map markers hook
│   ├── useCache.ts                  # Caching hook
│   └── useDebounce.ts               # Search debounce hook
│
├── data/
│   ├── landmarks.ts                 # Historical landmarks data
│   ├── historicalEvents.ts          # Historical events with narratives
│   ├── businessCategories.ts        # Business category definitions
│   ├── mockedJobs.ts                # 5000 mock jobs for demo
│   ├── mockCrimeData.ts             # Mock crime incident data
│   ├── mockFinanceData.ts           # Mock finance data
│   └── mockTransportData.ts         # Mock transport data
│
├── public/
│   ├── images/
│   │   └── (icons, logos, backgrounds)
│   └── fonts/
│       └── (custom TTF/OTF fonts)
│
├── docs/
│   ├── ARCHITECTURE.md              # System architecture details
│   ├── API_DOCUMENTATION.md         # API endpoint specs
│   ├── DEPLOYMENT.md                # Deployment guide
│   └── SETUP.md                     # Development setup guide
│
├── next.config.ts                  # Next.js configuration
├── tailwind.config.ts              # TailwindCSS configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies & scripts
├── README.md                       # Project overview
├── TASK_CHECKLIST.md              # This document
└── ARCHITECTURE_PLAN.md           # Architecture details
```

---

## COMPONENT ARCHITECTURE

### 1. Dashboard System
```
Dashboard (Main Container)
├── Header
│   ├── Logo / Title
│   ├── Search Bar
│   └── User Menu
├── Sidebar
│   ├── Navigation Menu
│   │   ├── Home
│   │   ├── Copilot Chat
│   │   ├── History
│   │   ├── Map
│   │   ├── Business Discovery
│   │   ├── Jobs
│   │   ├── Transport
│   │   ├── Crime & Safety
│   │   ├── Finance
│   │   └── More...
│   └── Theme Toggle
└── Main Content Area
    └── Dynamic Module Panels (Grid Layout)
        ├── Copilot Chat Panel
        ├── Historical Stories Panel
        ├── City Map Panel
        ├── Business Discovery Panel
        ├── Jobs Panel
        ├── Transport Panel
        ├── Crime Panel
        └── Finance Panel
```

### 2. Copilot Chat System
```
CopilotChat Component
├── Message History Display
│   └── MessageItem[] (user & assistant messages)
├── Input Section
│   ├── Textarea (multi-line)
│   ├── Voice Input Button
│   └── Send Button
├── Status Indicators
│   ├── Typing Indicator
│   ├── Processing State
│   └── Error Message
└── Chat Context
    └── Message History Array
```

### 3. Map System
```
CityMap Component
├── Leaflet Map Container
├── Base Layers (Street, Satellite)
├── Marker Layers
│   ├── RestaurantMarkers[]
│   ├── CafeMarkers[]
│   ├── GymMarkers[]
│   ├── HospitalMarkers[]
│   ├── PoliceMarkers[]
│   ├── TransportMarkers[]
│   ├── AttractionMarkers[]
│   └── MarkerClusterGroup (for >100 markers)
├── Map Controls
│   ├── Zoom Control
│   ├── Pan Control
│   ├── Layer Toggle
│   └── Reset Button
└── Marker Popups
    └── BusinessInfo Display
        ├── Name
        ├── Distance
        ├── Status (Open/Closed)
        ├── Hours
        └── Phone
```

### 4. Discovery Panel System
```
DiscoveryPanel Component (Reusable)
├── Filter Section (Sidebar)
│   ├── Category Filter
│   ├── Distance Filter
│   ├── Price Range Filter
│   ├── Open Now Toggle
│   ├── Rating Filter
│   └── Clear Filters Button
├── Search Section
│   ├── Search Input
│   └── Sort Options
└── Results Section
    ├── ResultsList
    │   └── ResultCard[] (individual items)
    │       ├── Image
    │       ├── Name
    │       ├── Distance
    │       ├── Status
    │       ├── Rating
    │       └── View Details Button
    ├── Pagination Control
    │   ├── Page Selector
    │   ├── Previous Button
    │   └── Next Button
    └── LoadingState / EmptyState
```

### 5. Historical Story Player
```
StoryPlayer Component
├── Timeline Display
│   └── TimelineEvent[] (clickable events)
├── Scene Display Area
│   ├── Historical Image/Animation
│   ├── Event Title
│   ├── Event Description
│   └── Narration Text
├── Controls
│   ├── Play Button
│   ├── Pause Button
│   ├── Next Button
│   ├── Previous Button
│   └── Speed Control
└── Voice Narration
    └── Speech Synthesis Output
```

---

## DATA FLOW ARCHITECTURE

### Chat Flow
```
User Input (Textarea)
    ↓
handleKeyDown (Enter/Ctrl+Enter)
    ↓
Message Processing & Validation
    ↓
POST /api/chat
    ↓
aiCopilotService.processPrompt()
    ├─ Determine Intent (question type)
    ├─ Route to Handler
    │  ├─ CityQuestionsHandler
    │  ├─ TourismPlanningHandler
    │  ├─ NavigationHandler
    │  ├─ PublicServicesHandler
    │  └─ GeneralHandler
    ├─ Generate Response
    └─ Return Response
    ↓
Display in Chat UI
    ↓
Save to localStorage (Chat History)
```

### Business Discovery Flow
```
User Applies Filters / Searches
    ↓
DiscoveryPanel State Update
    ↓
POST /api/scrape (with query params)
    ↓
brightDataService.scrapeBusinesses()
    ├─ Check Cache (Cached within 5 min?)
    │  ├─ [YES] Return cached data
    │  └─ [NO] Call Bright Data API
    ├─ Fetch Data
    ├─ Enrich Data (distance, status, hours)
    ├─ Format Response
    └─ Cache Result
    ↓
Return Business Array
    ↓
Add Markers to Map
    ↓
Render in Discovery Panel
```

### Crime Data Flow
```
App Initialization / Manual Refresh
    ↓
GET /api/crime (optional date range)
    ↓
montgomeryOpenDataService.getCrimeData()
    ├─ Fetch from Open Data API
    ├─ Parse Crime Incidents
    ├─ Calculate 7-day trend
    ├─ Classify Severity
    └─ Format Response
    ↓
Return Crime Data Array
    ↓
Update Crime Dashboard
    ├─ Render Heatmap
    ├─ Render Trend Chart
    └─ Display Incident List
```

### Jobs Data Flow
```
User Searches Jobs / Changes Filters
    ↓
JobsBrowser State Update
    ↓
GET /api/jobs (with pagination)
    ↓
jobsAggregatorService.getJobs()
    ├─ Access Job Database (5000 jobs)
    ├─ Apply Filters
    ├─ Sort Results
    ├─ Paginate (page, limit)
    └─ Return Page
    ↓
Display Job Cards (50 per page)
    ↓
User Clicks "Apply"
    ↓
Open LinkedIn/Indeed Application Page
```

---

## API ROUTE SPECIFICATIONS

### POST /api/chat
**Purpose**: Process user queries through AI Copilot  
**Request**:
```typescript
{
  message: string;
  messageHistory?: Array<{role: 'user' | 'assistant', content: string}>;
  conversationContext?: string;
}
```
**Response**:
```typescript
{
  success: boolean;
  message: string;
  intent?: string;
  suggestions?: string[];
  error?: string;
}
```

### POST /api/scrape
**Purpose**: Discover businesses near Montgomery  
**Request**:
```typescript
{
  category: string;           // restaurant, cafe, gym, etc.
  latitude?: number;
  longitude?: number;
  radius?: number;            // miles
  maxResults?: number;
  filters?: {
    openNow?: boolean;
    radiusMin?: number;
    radiusMax?: number;
    priceRange?: [number, number];
  };
}
```
**Response**:
```typescript
{
  success: boolean;
  businesses: Array<{
    id: string;
    name: string;
    category: string;
    latitude: number;
    longitude: number;
    distance: number;
    openNow: boolean;
    hours: {open: string, close: string};
    priceRange: string;
    rating?: number;
    phone?: string;
    address: string;
  }>;
  total: number;
  error?: string;
}
```

### GET /api/crime
**Purpose**: Fetch crime incidents and trends  
**Request Params**:
```
?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&limit=100
```
**Response**:
```typescript
{
  success: boolean;
  incidents: Array<{
    id: string;
    type: string;
    severity: 'low' | 'medium' | 'high';
    latitude: number;
    longitude: number;
    date: string;
    time?: string;
    description: string;
  }>;
  trendData: Array<{date: string, count: number}>;
  total: number;
  error?: string;
}
```

### GET /api/jobs
**Purpose**: Fetch aggregated job listings  
**Request Params**:
```
?page=1&limit=50&search=&category=&salary_min=&salary_max=
```
**Response**:
```typescript
{
  success: boolean;
  jobs: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    salary?: {min: number, max: number};
    description: string;
    jobUrl: string;
    postedDate: string;
    employmentType: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  error?: string;
}
```

### GET /api/transport
**Purpose**: Fetch transportation and routing data  
**Response**:
```typescript
{
  success: boolean;
  routes: Array<{
    id: string;
    name: string;
    type: 'bus' | 'train' | 'metro';
    stops: Array<{id: string, name: string, latitude: number, longitude: number}>;
    schedule: string;
  }>;
  hubs: Array<{
    id: string;
    name: string;
    type: string;
    latitude: number;
    longitude: number;
  }>;
  error?: string;
}
```

### GET /api/finance
**Purpose**: Fetch city budget and spending data  
**Response**:
```typescript
{
  success: boolean;
  budget: {
    total: number;
    spent: number;
    remaining: number;
    period: string;
  };
  categories: Array<{
    name: string;
    allocated: number;
    spent: number;
    percentage: number;
  }>;
  vendors: Array<{
    name: string;
    totalSpent: number;
    projectCount: number;
  }>;
  error?: string;
}
```

---

## SERVICE ARCHITECTURE

### aiCopilotService.ts
```typescript
class AICopilotService {
  // Core Methods
  processPrompt(message: string, context: ConversationContext): Promise<ChatResponse>
  
  // Intent Recognition
  private recognizeIntent(message: string): IntentType
  
  // Handlers
  private handleCityQuestion(question: string): Promise<string>
  private handleTouristicPlanning(query: string): Promise<ItineraryResponse>
  private handleNavigation(request: string): Promise<NavigationResponse>
  private handlePublicServices(query: string): Promise<ServiceResponse>
  private handleGeneral(query: string): Promise<string>
  
  // Utilities
  private promptInjectionFilter(text: string): boolean
  private validateResponse(response: string): boolean
  private enrichContext(messages: ChatMessage[]): Context
}
```

### brightDataService.ts
```typescript
class BrightDataService {
  // Main Scraping
  scrapeBusinesses(category: string, params: ScrapeParams): Promise<Business[]>
  
  // Category-specific Methods
  private scrapeRestaurants(params: ScrapeParams): Promise<Business[]>
  private scrapeCafes(params: ScrapeParams): Promise<Business[]>
  private scrapeGyms(params: ScrapeParams): Promise<Business[]>
  // ... more categories
  
  // Data Processing
  private enrichBusinessData(businesses: Business[]): Business[]
  private calculateDistance(lat1, lon1, lat2, lon2): number
  private parseHours(hoursString: string): {open: string, close: string}
  
  // Caching
  private cache: Map<string, CachedItem>
  private getCached(key: string): Business[] | null
  private setCached(key: string, data: Business[], ttl: number): void
}
```

### montgomeryOpenDataService.ts
```typescript
class MontgomeryOpenDataService {
  // Crime Data
  getCrimeData(dateRange?: DateRange): Promise<CrimeIncident[]>
  private calculateCrimeTrend(incidents: CrimeIncident[]): TrendData[]
  
  // Finance Data
  getFinanceData(): Promise<FinanceData>
  private parseFinancialCategories(data: any): FinanceCategory[]
  
  // Transport Data
  getTransportData(): Promise<TransportData>
  
  // General Data Fetching
  private fetchFromOpenData(endpoint: string, params?: any): Promise<any>
  private validateData(data: any): boolean
}
```

### jobsAggregatorService.ts
```typescript
class JobsAggregatorService {
  private jobDatabase: Job[] = generateMockJobs(5000)
  
  // Main Methods
  getJobs(filters: JobFilters, pagination: Pagination): Promise<JobPage>
  searchJobs(query: string, filters: JobFilters): Promise<Job[]>
  
  // Data Processing
  private applyFilters(jobs: Job[], filters: JobFilters): Job[]
  private sortJobs(jobs: Job[], sortBy: SortOption): Job[]
  private paginateResults(jobs: Job[], page: number, limit: number): JobPage
  
  // External API Integration (Stubs)
  private scrapeLinkedIn(query: string): Promise<Job[]>
  private scrapeIndeed(query: string): Promise<Job[]>
}
```

---

## SECURITY ARCHITECTURE

### Input Validation Pipeline
```
User Input (from Textarea)
    ↓
sanitizeInput() - Remove dangerous characters
    ↓
validateLength() - Check max length
    ↓
checkPromptInjection() - Detect SQL injection, XSS patterns
    ↓
validateFormat() - Check expected format
    ↓
[BLOCKED if suspicious]
    ↓
[PASSED] → Process normally
```

### Rate Limiting Strategy
```
Request arrives at API Route
    ↓
Check Rate Limit Middleware
    ├─ Get client IP
    ├─ Look up request count in memory
    ├─ Check if exceeds limit (e.g., 100 req/min)
    │   ├─ [EXCEEDED] Return 429 Too Many Requests
    │   └─ [OK] Increment counter
    ├─ Return X-RateLimit headers
    └─ Allow request to proceed
```

---

## STATE MANAGEMENT STRATEGY

### React State (Client-side)
```
Dashboard Root
├── dashboardState
│   ├── activePanel: string
│   ├── sidebarOpen: boolean
│   ├── theme: 'dark' | 'light'
│   └── userPreferences: object
│
├── copilotState (in CopilotChat)
│   ├── messages: ChatMessage[]
│   ├── isLoading: boolean
│   ├── inputValue: string
│   ├── error: string | null
│   └── voiceTranscript: string
│
├── mapState (in CityMap)
│   ├── markers: Marker[]
│   ├── selectedMarker: Marker | null
│   ├── mapCenter: LatLng
│   ├── zoomLevel: number
│   └── visibleLayers: string[]
│
└── discoveryState (in DiscoveryPanel)
    ├── results: Item[]
    ├── filters: FilterState
    ├── currentPage: number
    ├── isLoading: boolean
    ├── searchQuery: string
    └── error: string | null
```

### Persistent State
```
localStorage
├── chatHistory: ChatMessage[]
├── userPreferences: UserPreferences
├── lastLocationViewed: {latitude, longitude}
└── selectedCategories: string[]
```

### In-Memory Cache
```
Cache Layer
├── businessCache
│   └── key: "${category}_${lat}_${lon}" → TTL 5 minutes
├── jobsCache
│   └── key: "${searchQuery}_${page}" → TTL 10 minutes
├── crimeDataCache
│   └── key: "crime_" → TTL 15 minutes
└── financeDataCache
    └── key: "finance_" → TTL 30 minutes
```

---

## PERFORMANCE OPTIMIZATION STRATEGY

### Frontend Optimization
```
1. Code Splitting
   ├── Route-based chunks (app/crime/, app/jobs/, etc.)
   ├── Component-lazy loading for heavy components
   └── Vendor chunk optimization

2. Image Optimization
   ├── Next.js Image component for automatic optimization
   ├── Responsive images (srcset)
   └── WebP format with fallbacks

3. CSS Optimization
   ├── TailwindCSS purging unused styles
   ├── CSS-in-JS minimization
   └── Critical CSS inline

4. Bundle Analysis
   └── Target <200KB main bundle (uncompressed)

5. Rendering Optimization
   ├── React.memo for expensive components
   ├── useCallback for function stability
   ├── useMemo for computed values
   └── Dynamic imports with Suspense

6. Caching Strategy
   ├── Browser cache headers
   ├── Service Worker for offline support (optional)
   └── Local storage for chat history
```

### Backend Optimization
```
1. API Route Optimization
   ├── Response caching (Bright Data: 5 min, Finance: 30 min)
   ├── Database query optimization
   └── Gzip compression

2. Data Pagination
   ├── Jobs: 50 items per page
   ├── Crimes: 100 items per page
   └── Search results: 20 items per page

3. Query Optimization
   ├── Only fetch required fields
   ├── Limit result sets
   └── Index frequently searched fields

4. Memory Management
   ├── Stream large responses
   └── Clean up cache periodically
```

---

## DEPLOYMENT ARCHITECTURE

### Environment Configuration
```
.env.local (Development)
├── NEXT_PUBLIC_API_URL=http://localhost:3000
├── LLM_API_KEY=[development key]
├── BRIGHT_DATA_API_KEY=[development key]
└── MONTGOMERY_OPEN_DATA_KEY=[development key]

.env.production (Vercel)
├── NEXT_PUBLIC_API_URL=https://ai-city.vercel.app
├── LLM_API_KEY=[production key]
├── BRIGHT_DATA_API_KEY=[production key]
└── MONTGOMERY_OPEN_DATA_KEY=[production key]
```

### Vercel Deployment
```
vercel.json Configuration
├── buildCommand: "npm run build"
├── developCommand: "npm run dev"
├── outputDirectory: ".next"
├── installCommand: "npm install"
├── env policies: [env variables]
└── functions: [serverless function config]
```

---

## TESTING STRATEGY

### Unit Testing
```
Tests for:
├── Utility functions (validation, formatting)
├── Service methods (AI processing, data formatting)
├── Component rendering (with mock data)
└── API routes (with mocked services)
```

### Integration Testing
```
Tests for:
├── UI to API integration
├── Service to service calls
├── Data flow end-to-end
└── Error handling paths
```

### E2E Testing
```
Tests for:
├── User chat interaction
├── Business discovery workflow
├── Map interactions
├── Job search and pagination
└── All dashboard modules
```

### Performance Testing
```
Metrics:
├── Load Time: Target <3s
├── Time to Interactive: Target <5s
├── Bundle Size: Target <250KB
├── Memory Usage: Monitor for leaks
└── API Response Time: Target <500ms
```

---

## MONITORING & DEBUGGING STRATEGY

### Debug Cycles

**Cycle 1: Keyboard Input & Chat**
- Verify Enter/Ctrl+Enter handling
- Test message display
- Validate API connection

**Cycle 2: API Integration & Data**
- Test all 7 API endpoints
- Verify data loading
- Check error handling

**Cycle 3: Map & Markers**
- Test map rendering
- Verify marker clustering
- Check marker popups

**Cycle 4: UI Responsiveness**
- Test all screen sizes
- Verify mobile layouts
- Check dark theme

**Cycle 5: Performance**
- Measure load times
- Check bundle size
- Profile memory usage

---

## SUMMARY

**Architecture Type**: Modular, Microservices-inspired Frontend Architecture  
**Scalability**: Designed for 10,000+ concurrent users  
**Performance Target**: <3s load time, 60fps animations  
**Security Level**: Input validation, rate limiting, XSS/SQL injection prevention  
**Maintainability**: Clean separation of concerns, documented APIs, human-readable code  

**Next Phase**: Implement Phase 2 - Frontend Core Systems (Dashboard, Chat, History, Map)

---

*This architecture supports the complete system design and guides implementation of all 18 phases.*
