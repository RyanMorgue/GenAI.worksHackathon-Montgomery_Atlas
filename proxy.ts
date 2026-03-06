import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 20;

export default async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/api/') || request.url.includes('/chat')) {

        // Fixed: 'ip' property is removed in Next 15+ request objects, use headers
        const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
        const currentWindowStart = Math.floor(Date.now() / RATE_LIMIT_WINDOW_MS) * RATE_LIMIT_WINDOW_MS;

        let rateData = rateLimitMap.get(ip);

        if (!rateData || rateData.lastReset < currentWindowStart) {
            rateData = { count: 1, lastReset: currentWindowStart };
        } else {
            rateData.count++;
        }

        rateLimitMap.set(ip, rateData);

        if (rateData.count > MAX_REQUESTS_PER_WINDOW) {
            return new NextResponse(
                JSON.stringify({ error: 'Too Many Requests - Rate limit exceeded.' }),
                { status: 429, headers: { 'content-type': 'application/json' } }
            );
        }

        if (request.method === 'POST') {
            try {
                const clonedRequest = request.clone();
                const textBody = await clonedRequest.text();
                const lowerBody = textBody.toLowerCase();

                const prohibitedPhrases = [
                    'ignore previous instructions',
                    'reveal system prompt',
                    'developer mode',
                    'dump database',
                    'sudo',
                    '<script>'
                ];

                for (const phrase of prohibitedPhrases) {
                    if (lowerBody.includes(phrase)) {
                        console.warn(`[Security] Blocked potential injection from ${ip}: matched "${phrase}"`);
                        return new NextResponse(
                            JSON.stringify({ error: 'Request blocked due to security policy.' }),
                            { status: 403, headers: { 'content-type': 'application/json' } }
                        );
                    }
                }
            } catch (err) {
            }
        }
    }

    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('X-Content-Type-Options', 'nosniff');

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
