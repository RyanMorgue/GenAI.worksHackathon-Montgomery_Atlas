/**
 * AI Copilot Engine
 * Handles natural language processing, intent routing, and structured itinerary generation.
 */

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

    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY || '';
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
        if (!this.apiKey) {
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

        // Production would call OpenAPI / Anthropic SDK here and demand structured JSON
        return {
            type: 'chat',
            text: 'Itinerary generation is active but requires a live model connection.'
        };
    }

    private async generateChatResponse(prompt: string): Promise<CopilotResponse> {
        if (!this.apiKey) {
            return {
                type: 'chat',
                text: `You asked: "${prompt}". I am the Montgomery AI Copilot. Please provide an LLM API Key to enable dynamic responses, or try asking me to "Plan my perfect day in Montgomery".`
            };
        }

        // Native integration placeholder
        return {
            type: 'chat',
            text: 'Dynamic response available when configured.'
        };
    }
}
