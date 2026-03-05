import express from 'express';
import next from 'next';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { parse } from 'url';

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
    const server = express();

    // Security and Utility Middleware
    // Helmet will provide basic security headers. Next.js does some of this but doing it in Express is fine too.
    server.use(helmet({ contentSecurityPolicy: false })); // Let Next.js handle CSP if needed
    server.use(cors());
    server.use(express.json());

    // API Middleware / Validation (Phase 14 - Security Hardening base)
    server.use('/api', (req, res, nextCb) => {
        // Basic Rate Limiting / Prompt Injection check can go here
        const prohibitedPhrases = ['ignore previous instructions', 'reveal system prompt', 'developer mode', 'dump database'];
        const bodyStr = JSON.stringify(req.body || {}).toLowerCase();

        for (const phrase of prohibitedPhrases) {
            if (bodyStr.includes(phrase)) {
                return res.status(403).json({ error: 'Request blocked due to security policy.' });
            }
        }
        nextCb();
    });

    // Backend API Routes Placeholder
    server.get('/api/health', (req, res) => {
        res.json({ status: 'ok', message: 'AI City Copilot API is running.' });
    });

    // Next.js Catch-all
    server.all(/.*/, (req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});
