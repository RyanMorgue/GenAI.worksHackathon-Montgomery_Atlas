# Feature Sandbox & Specifications

## 1. UI Redesign & Theming
The dashboard is built on a dark modern workspace aesthetic drawing inspiration from `huly.io` and dark-fantasy cinematic atmospheres.
- **Glassmorphism:** Elements utilize translucent backgrounds, blur filters, and subtle border highlights.
- **RGB Hover Effects:** Interactive components (buttons, links, active cards) possess the `.rgb-hover-glow` directive, mapping an animated rainbow CSS gradient for premium tactical feedback.
- **Responsive Layout:** Mobile-friendly margin adjustments and fluid grid layouts map beautifully from 4k screens down to mobile devices.

## 2. Interactive AI City Copilot
A floating civic assistant embedded on the home page.
- Native Text-To-Speech (Web Speech API) recognition toggle.
- Full keyboard listener (`Enter` parsing).
- Rotating background layers featuring dark-fantasy/Tim Burton style AI renders.

## 3. Historic Montgomery Hub
Dedicated `/history` module preserving city narratives.
- Interactive side-column landmark selector mapping Wikipedia datasets.
- Immersive AI Story Video placeholders.
- Text-to-Speech narration player with pause controls mapped natively.

## 4. Local Business Discovery
A 10+ element matrix simulating BrightData hooks for local economics.
- Nine strict categories from Restaurants to Pilates Studios.
- Dual-tab filtering (OPEN NOW vs CLOSED).
- Deterministic data population parsing operating hours, price ranges, and map coordinates.

## 5. Dedicated Utility Modules
- **Montgomery Job Board:** Paginated (100 page capacity limits) external LinkedIn/Indeed routing.
- **Crime & Safety Report:** Mapping internal incident dispatches via UI feeds.
- **Transit Hub:** Live bus/train line mapping and arrival predictions.
- **Public Health Network:** Clinic queues and Emergency Hotline listings.
