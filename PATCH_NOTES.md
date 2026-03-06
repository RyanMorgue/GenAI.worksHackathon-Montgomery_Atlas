# Patch Notes — Cleanup Phase

This document records all structural and file changes made during the cleanup exercise.

## Removed / Deleted

- **server.ts**: custom Express server removed; project now uses native Next.js runtime.
- **services/** and **scrapers/** directories: emptied and deleted after moving contents to `/lib`.
- **package-lock.json**: removed in favour of `package.json` (pnpm/yarn assumed).
- **app/globals.css**: original global stylesheet lost during refactor; recreated under `/styles`.
- Dependencies pruned from `package.json`: `express`, `cors`, `helmet`, `dotenv`, `ts-node`, `tsx`, related types.

## New & Relocated Files

- **Directories created**: `/lib/services`, `/hooks`, `/data`, `/styles`.
- **Services moved** to `lib/services`:
  - `aiCopilotService.ts` → same name under `/lib/services`
  - `montgomeryAPI.ts` → `montgomeryOpenData.ts`
- **Bright Data scraper** moved to `/lib/brightDataService.ts`.
- **Job generator** code extracted to `/lib/jobGenerator.ts` and imported in jobs page.
- **Static data arrays** relocated to `/data`:
  - `landmarks.ts` (used by history page)
  - `events.ts` (used by recreation page)
- **Custom hook** added: `/hooks/useSpeechRecognition.ts` and integrated into home page.
- **Middleware file** created: `middleware.ts` (renamed from proxy.ts with improved naming and logic) for rate limits and security headers.
- **API route** added: `/app/api/health/route.ts` replicating previous health check.
- **Updated README.md** to reflect Next.js 16 and removal of Express; links fixed.
- **Updated docs/ARCHITECTURE.md** with new architecture description.
- **Moved global CSS** to `/styles/globals.css` and updated import path in layout.

## Refactors & Code Cleanup

- Removed unused React imports (`useRef`) from history page.
- Home page (`app/page.tsx`) refactored to use `useSpeechRecognition` hook; cleaned up state management.
- Jobs and recreation pages import generators/data from new modules instead of inline constants.
- `package.json` scripts updated to `next dev` / `next start`; lint command extended.
- `tsconfig.json` already supported `@/*` alias; no change required.
- Adjusted middleware export name to `middleware` for clarity.
- Documentation links corrected and outdated references removed.

## Structural Changes

- Enforced required folder structure: `app`, `components`, `lib`, `hooks`, `data`, `public`, `styles`.
- All business logic is now modular; front‑end pages are clean and import from `/lib` or `/data`.
- Unused or stub code removed or flagged for future integration.

---

The repository now adheres to a clean Next.js architecture and is ready for the next development phases.
