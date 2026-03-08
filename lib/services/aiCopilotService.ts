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
        const p = prompt.toLowerCase();

        // Intent routing — itinerary triggers
        if (
            p.includes('plan my perfect day') ||
            p.includes('plan my day') ||
            p.includes('itinerary') ||
            p.includes('day trip') ||
            p.includes('things to do') ||
            p.includes('what to do') ||
            p.includes('weekend in montgomery') ||
            p.includes('day in montgomery')
        ) {
            return this.generateItinerary(prompt);
        }

        // Standard chat (all other intents)
        return this.generateChatResponse(prompt);
    }

    /**
     * Returns a structured, intent-aware response when Gemini is unavailable.
     * Detects keywords and routes to the most relevant curated content.
     */
    private getFallbackResponse(prompt: string): CopilotResponse {
        const p = prompt.toLowerCase();

        // Hotels / accommodation
        if (p.includes('hotel') || p.includes('motel') || p.includes('accommodation') || p.includes('where to stay') || p.includes('place to stay')) {
            return {
                type: 'chat',
                text: `Here are top-rated hotels in Montgomery, AL:\n\n🏨 Renaissance Montgomery Hotel & Spa — Upscale downtown hotel with spa and conference center.\n🏨 DoubleTree by Hilton Montgomery Downtown — Full-service hotel steps from the State Capitol.\n🏨 Hampton Inn & Suites Montgomery-Downtown — Modern rooms with complimentary breakfast.\n🏨 Staybridge Suites Montgomery — Extended-stay suites near major attractions.\n🏨 Red Roof Inn Montgomery — Budget-friendly option with easy freeway access.\n\nAll are within 10 minutes of the Civil Rights Memorial and Legacy Museum.`
            };
        }

        // Restaurants / dining / food
        if (p.includes('restaurant') || p.includes('eat') || p.includes('food') || p.includes('dining') || p.includes('lunch') || p.includes('dinner') || p.includes('breakfast') || p.includes('cafe') || p.includes('where to eat')) {
            return {
                type: 'chat',
                text: `Top restaurants in Montgomery, AL:\n\n🍽️ Central — Upscale Southern cuisine on Dexter Avenue, a local favorite.\n☕ Prevail Union Cafe — Artisanal coffee and pastries, perfect for breakfast.\n🍖 Dreamland Bar-B-Que — Legendary Alabama BBQ ribs and sandwiches.\n🥗 Chris' Hot Dogs — Montgomery institution open since 1917.\n🍷 Acre — Farm-to-table dining with a seasonal menu.\n🍕 Baumhower's Victory Grille — Casual sports bar with wings and burgers.\n\nMost top restaurants are clustered along Dexter Avenue and in the Cloverdale district.`
            };
        }

        // Attractions / landmarks / sightseeing
        if (p.includes('attraction') || p.includes('landmark') || p.includes('museum') || p.includes('visit') || p.includes('sightseeing') || p.includes('sight') || p.includes('top place') || p.includes('best place')) {
            return {
                type: 'chat',
                text: `Top attractions in Montgomery, AL:\n\n🏛️ Civil Rights Memorial — Powerful outdoor memorial designed by Maya Lin honoring civil rights martyrs.\n🎭 Rosa Parks Museum — Interactive museum at the site of Rosa Parks' 1955 arrest.\n📖 The Legacy Museum — From Enslavement to Mass Incarceration, by the Equal Justice Initiative.\n🏛️ Alabama State Capitol — Historic building where Jefferson Davis was inaugurated.\n🦁 Montgomery Zoo — 40-acre zoo with 500+ animals and botanical gardens.\n🌊 Montgomery Riverfront Park — Scenic park along the Alabama River with trails and event space.\n🎵 Hank Williams Museum — Tribute to the legendary country music icon.`
            };
        }

        // Transit / transportation / getting around
        if (p.includes('transit') || p.includes('bus') || p.includes('transport') || p.includes('get around') || p.includes('ride') || p.includes('uber') || p.includes('lyft') || p.includes('parking') || p.includes('directions')) {
            return {
                type: 'chat',
                text: `Getting around Montgomery, AL:\n\n🚌 MAX Transit — Local bus network connecting downtown, the medical district, and suburbs. Fare: $1.00–$1.50.\n🚗 Rideshare — Uber and Lyft operate throughout the city. Average downtown ride: $8–$15.\n🚲 Zyp Bikeshare — Docked bike share stations near downtown and Cloverdale.\n🅿️ Parking — Free street parking on weekends; ParkMobile app accepted at downtown garages.\n\nThe Civil Rights Memorial, Legacy Museum, Rosa Parks Museum, and State Capitol are all within comfortable walking distance of each other downtown.`
            };
        }

        // Events / weekend / things to do / activities
        if (p.includes('event') || p.includes('weekend') || p.includes('activity') || p.includes('entertainment') || p.includes('fun') || p.includes('tonight') || p.includes('this week')) {
            return {
                type: 'chat',
                text: `Things to do in Montgomery this weekend:\n\n🎭 Friday Night — Alabama Shakespeare Festival for world-class performances.\n🌅 Saturday Morning — Walk the Civil Rights Memorial and Rosa Parks Museum.\n🍽️ Saturday Lunch — Dine at Central on Dexter Avenue or grab BBQ at Dreamland.\n🏛️ Saturday Afternoon — Explore the Legacy Museum and Alabama State Capitol grounds.\n🎵 Saturday Evening — Live music at Riverwalk Amphitheater.\n🦁 Sunday — Montgomery Zoo opens at 9 AM, great for families.\n\nFor current events visit montgomeryalabama.gov/events`
            };
        }

        // Civil rights / history
        if (p.includes('history') || p.includes('civil rights') || p.includes('rosa parks') || p.includes('mlk') || p.includes('martin luther') || p.includes('selma') || p.includes('freedom') || p.includes('heritage')) {
            return {
                type: 'chat',
                text: `Montgomery's Civil Rights History:\n\nMontgomery is one of the most historically significant cities in American history.\n\n📍 1955 — Montgomery Bus Boycott: Rosa Parks refused to give up her seat on December 1, sparking a 381-day boycott that ended bus segregation.\n📍 Rosa Parks Museum — Located at the exact site of her arrest at Court Square.\n📍 Dexter Avenue Baptist Church — Where Dr. Martin Luther King Jr. served as pastor and organized the boycott.\n📍 The Legacy Museum — Bryan Stevenson's museum tracing racial injustice from slavery to mass incarceration.\n📍 Civil Rights Memorial — Maya Lin's memorial honoring 40 martyrs who died during the movement.\n\nAll major sites are within 1 mile of downtown, ideal for a walking tour.`
            };
        }

        // Default — menu-style help message
        return {
            type: 'chat',
            text: `Hi, I'm ATLAS — your Montgomery, Alabama city copilot. Here's what I can help you with:\n\n🗺️ Itinerary — "Plan my perfect day in Montgomery"\n🏨 Hotels — "Hotels in Montgomery"\n🍽️ Dining — "Best restaurants in Montgomery"\n🏛️ Attractions — "Top attractions in Montgomery"\n🚌 Transit — "How to get around Montgomery"\n🎭 Events — "Things to do this weekend"\n📖 History — "Civil rights history of Montgomery"\n\nWhat would you like to explore?`
        };
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
            return this.getFallbackResponse(prompt);
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
                console.warn('[AICopilot] Quota exceeded — falling back to intent-aware response.');
                return this.getFallbackResponse(prompt);
            }
            return { type: 'chat', text: 'AI service temporarily unavailable. Please try again.' };
        }
    }
}
