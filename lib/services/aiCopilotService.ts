/**
 * AI Copilot Engine
 * Handles natural language processing, intent routing, and structured itinerary generation.
 */

import { isAvailable, generateText, generateJSON } from '@/lib/ai/gemini';

export interface CopilotResponse {
    type: 'chat' | 'itinerary';
    text: string;
    itinerary?: DayItinerary;
}

export interface DayItinerary {
    id: string;
    stops: {
        timeBlock: string;
        location: { id: string; name: string; lat: number; lng: number };
        description: string;
    }[];
}

export class AICopilotService {
    constructor() {
        console.log('[AICopilot] GEMINI_API_KEY present:', !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY));
        console.log('[AICopilot] Client initialized:', isAvailable());
    }

    async processPrompt(prompt: string): Promise<CopilotResponse> {
        const normalizedPrompt = prompt.toLowerCase();

        // 1. Intent Routing
        if (normalizedPrompt.includes('plan my perfect day')) {
            return this.generateItinerary(prompt);
        }

        // 2. Standard Chat Interaction
        return this.generateChatResponse(prompt);
    }

    private async generateItinerary(prompt: string): Promise<CopilotResponse> {
        if (!isAvailable()) {
            console.warn('[AICopilot] No Gemini API Key. Firing deterministic itinerary stub.');
            return {
                type: 'itinerary',
                text: "Here is your perfect day in Montgomery, generated specifically for you!",
                itinerary: {
                    id: `itin-${Date.now()}`,
                    stops: [
                        {
                            timeBlock: 'Morning',
                            location: { id: 'l1', name: 'Prevail Union Cafe', lat: 32.3789, lng: -86.3090 },
                            description: 'Start your day with a locally roasted coffee and artisanal pastry.'
                        },
                        {
                            timeBlock: 'Lunch',
                            location: { id: 'l2', name: 'Central', lat: 32.3792, lng: -86.3101 },
                            description: 'Enjoy an upscale Southern lunch at a highly acclaimed venue.'
                        },
                        {
                            timeBlock: 'Afternoon',
                            location: { id: 'l3', name: 'Civil Rights Memorial', lat: 32.3765, lng: -86.3013 },
                            description: 'Reflect upon the historical significance at this important cultural landmark.'
                        },
                        {
                            timeBlock: 'Evening',
                            location: { id: 'l4', name: 'The Aviator Bar', lat: 32.3801, lng: -86.3098 },
                            description: 'Wind down with aviation-themed cocktails and a relaxed atmosphere.'
                        }
                    ]
                }
            };
        }

        try {
            const t0 = Date.now();
            const raw = await generateJSON(
                'You are a Montgomery, Alabama city guide. Generate a perfect day itinerary as JSON with this exact structure: {"stops":[{"timeBlock":"Morning","location":{"id":"l1","name":"Place Name","lat":32.37,"lng":-86.30},"description":"Short description"}]}. Include 4-6 stops covering morning, lunch, afternoon, and evening. Use real Montgomery locations. Return only valid JSON.',
                prompt
            );
            console.log(`[AICopilot] itinerary OK in ${Date.now() - t0}ms`);

            let data: { stops?: DayItinerary['stops'] } = {};
            try {
                data = JSON.parse(raw);
            } catch {
                console.error('[AICopilot] JSON parse failed. Raw response:', raw);
                data = { stops: [] };
            }
            return {
                type: 'itinerary',
                text: 'Here is your perfect day in Montgomery!',
                itinerary: { id: `itin-${Date.now()}`, stops: data.stops || [] }
            };
        } catch (err) {
            console.error('[AICopilot] FULL ERROR:', err);
            const isQuota = String(err).includes('429') || String(err).includes('quota');
            if (isQuota) {
                console.warn('[AICopilot] Quota exceeded — falling back to stub itinerary.');
                return {
                    type: 'itinerary',
                    text: "Here is your perfect day in Montgomery, generated specifically for you!",
                    itinerary: {
                        id: `itin-${Date.now()}`,
                        stops: [
                            {
                                timeBlock: 'Morning',
                                location: { id: 'l1', name: 'Prevail Union Cafe', lat: 32.3789, lng: -86.3090 },
                                description: 'Start your day with a locally roasted coffee and artisanal pastry.'
                            },
                            {
                                timeBlock: 'Lunch',
                                location: { id: 'l2', name: 'Central', lat: 32.3792, lng: -86.3101 },
                                description: 'Enjoy an upscale Southern lunch at a highly acclaimed venue.'
                            },
                            {
                                timeBlock: 'Afternoon',
                                location: { id: 'l3', name: 'Civil Rights Memorial', lat: 32.3765, lng: -86.3013 },
                                description: 'Reflect upon the historical significance at this important cultural landmark.'
                            },
                            {
                                timeBlock: 'Evening',
                                location: { id: 'l4', name: 'The Aviator Bar', lat: 32.3801, lng: -86.3098 },
                                description: 'Wind down with aviation-themed cocktails and a relaxed atmosphere.'
                            }
                        ]
                    }
                };
            }
            return { type: 'chat', text: 'AI service temporarily unavailable. Please try again.' };
        }
    }

    private async generateChatResponse(prompt: string): Promise<CopilotResponse> {
        if (!isAvailable()) {
            return {
                type: 'chat',
                text: `You asked: "${prompt}". I am the Montgomery AI Copilot. Please provide a Gemini API Key to enable dynamic responses, or try asking me to "Plan my perfect day in Montgomery".`
            };
        }

        try {
            const t0 = Date.now();
            const text = await generateText(
                'You are ATLAS, an AI city copilot for Montgomery, Alabama. Answer questions about the city concisely and helpfully. Focus on local attractions, history, civic services, dining, and events. Keep responses under 150 words.',
                prompt
            );
            console.log(`[AICopilot] chat OK in ${Date.now() - t0}ms`);
            return { type: 'chat', text: text || 'No response.' };
        } catch (err) {
            console.error('[AICopilot] FULL ERROR:', err);
            const isQuota = String(err).includes('429') || String(err).includes('quota');
            if (isQuota) {
                console.warn('[AICopilot] Quota exceeded — falling back to stub response.');
                return {
                    type: 'chat',
                    text: `Welcome to Montgomery, Alabama! I'm ATLAS, your city copilot. Montgomery is rich with history — from the Civil Rights Memorial and the Legacy Museum to vibrant dining on Dexter Avenue. Ask me to "Plan my perfect day in Montgomery" for a curated itinerary, or explore the city's transit, jobs, and development updates using the navigation menu above.`
                };
            }
            return { type: 'chat', text: 'AI service temporarily unavailable. Please try again.' };
        }
    }
}
