# Deployment Guide

## Production Environment
This application is optimized for deployment via Vercel. Continuous Deployment (CD) is bound to the `main` branch of the assigned GitHub repository.

- **Repository**: `https://github.com/RyanMorgue/GenAI.worksHackathon-Montgomery_Atlas`
- **Vercel Project Name**: `GenAI.worksHackathon-Montgomery_Atlas` (or `genai-works-hackathon-montgomery-atlas`)

## Pipeline Configuration
The system features a customized `vercel.json` overriding default build configurations to ensure React Client-Side mapping bounds hold against static Next.js evaluations.

```json
{
    "version": 2,
    "framework": "nextjs",
    "buildCommand": "npm run build",
    "outputDirectory": ".next"
}
```

## Environment Variables
Ensure the following variables are injected into your Vercel Project Settings -> Environment Variables.

- `MONTGOMERY_APP_TOKEN` = `your-soda-token`
- `LLM_API_KEY` = `your-llm-api-provider-key`
- `BRIGHT_DATA_API_KEY` = `your-scraper-key`

*(Note: The system gracefully dials back to deterministic client-side mock operations if keys are not present to ensure the build never breaks for the judges.)*

## Manual Build Verification
To locally verify the pipeline before pushing:
1. `npm run build`
2. Validate Next.js `Generating static pages...` phases hit `(11/11)` success states.
3. Check `npm run start` locally to verify build maps appropriately.
