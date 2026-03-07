/**
 * AI Copilot Engine
 * Handles natural language processing, intent routing, and structured itinerary generation.
 */

import OpenAI from 'openai';

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
    private apiKey: string;
    private client: OpenAI | null;

    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY || '';
        this.client = this.apiKey ? new OpenAI({ apiKey: this.apiKey }) : null;
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
        if (!this.client) {
            console.warn('[AICopilot] No LLM API Key. Firing deterministic itinerary stub.');
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
            const completion = await this.client.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a Montgomery, Alabama city guide. Generate a perfect day itinerary as JSON with this exact structure: {"stops":[{"timeBlock":"Morning","location":{"id":"l1","name":"Place Name","lat":32.37,"lng":-86.30},"description":"Short description"}]}. Include 4-6 stops covering morning, lunch, afternoon, and evening. Use real Montgomery locations. Return only valid JSON.'
                    },
                    { role: 'user', content: prompt }
                ],
                response_format: { type: 'json_object' },
                max_tokens: 700,
            });

            const raw = completion.choices[0].message.content || '{}';
            const data = JSON.parse(raw);
            return {
                type: 'itinerary',
                text: 'Here is your perfect day in Montgomery!',
                itinerary: { id: `itin-${Date.now()}`, stops: data.stops || [] }
            };
        } catch (err) {
            console.error('[AICopilot] Itinerary error:', err);
            return { type: 'chat', text: 'Failed to generate itinerary. Please try again.' };
        }
    }

    private async generateChatResponse(prompt: string): Promise<CopilotResponse> {
        if (!this.client) {
            return {
                type: 'chat',
                text: `You asked: "${prompt}". I am the Montgomery AI Copilot. Please provide an LLM API Key to enable dynamic responses, or try asking me to "Plan my perfect day in Montgomery".`
            };
        }

        try {
            const completion = await this.client.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are ATLAS, an AI city copilot for Montgomery, Alabama. Answer questions about the city concisely and helpfully. Focus on local attractions, history, civic services, dining, and events. Keep responses under 150 words.'
                    },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 300,
            });
            return {
                type: 'chat',
                text: completion.choices[0].message.content || 'No response.'
            };
        } catch (err) {
            console.error('[AICopilot] Chat error:', err);
            return { type: 'chat', text: 'Connection error. Please try again.' };
        }
    }
}
