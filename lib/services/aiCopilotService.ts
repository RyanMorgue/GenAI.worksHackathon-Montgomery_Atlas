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

        // Police / emergency services (check before generic "station" hits transit)
        if (p.includes('police') || p.includes('cop') || p.includes('law enforcement') || p.includes('emergency service')) {
            return {
                type: 'chat',
                text: `Police Stations in Montgomery, AL:\n\n🚔 Montgomery Police Department Headquarters — 320 N Ripley St, Downtown Montgomery\n🚔 MPD East District — 3130 Atlanta Hwy, Eastern Montgomery\n🚔 MPD West District — 2050 W Fairview Ave, Western Montgomery\n🚔 MPD North Precinct — Serving the northern residential areas\n\n⚠️ If this is an emergency, please call 911 immediately.\n\nNon-emergency police line: (334) 241-2651\nVisit montgomerypolice.com for more information.`
            };
        }

        // Fire stations
        if (p.includes('fire station') || p.includes('fire department') || p.includes('fire house') || p.includes('firefighter')) {
            return {
                type: 'chat',
                text: `Fire Stations in Montgomery, AL:\n\n🚒 Montgomery Fire Department Headquarters — 26 Decatur St, Downtown\n🚒 Fire Station No. 1 — Downtown Montgomery (Oldest active station)\n🚒 Fire Station No. 3 — South Montgomery\n🚒 Fire Station No. 5 — Eastern Montgomery\n🚒 Fire Station No. 7 — North Montgomery\n\n⚠️ For fire emergencies, please call 911 immediately.\n\nFor non-emergency inquiries: (334) 241-2600\nVisit montgomeryalabama.gov/fire for more information.`
            };
        }

        // Cafes / coffee (check before restaurants to give specific coffee response)
        if (p.includes('cafe') || p.includes('coffee') || p.includes('coffee shop') || p.includes('espresso') || p.includes('latte') || p.includes('brunch spot')) {
            return {
                type: 'chat',
                text: `Popular Cafés & Coffee Shops in Montgomery, AL:\n\n☕ Prevail Union Montgomery — Artisan coffee, modern atmosphere, and locally sourced pastries. A downtown favorite.\n☕ Vintage Café — Cozy café known for excellent breakfast and specialty coffee drinks.\n☕ Hilltop Public House — Relaxed neighborhood spot with coffee, pastries, and outdoor seating.\n☕ Café Louisa — Popular brunch and coffee destination with a warm, welcoming atmosphere.\n☕ Red Eye Coffee — Locally owned with rotating single-origin beans.\n☕ O'Henry's Coffees — Alabama chain with comfortable seating, great for working or studying.\n\nMost cafés are open Mon–Sat 7 AM–5 PM. Check individual locations for Sunday hours.`
            };
        }

        // Spas / salons / wellness / beauty
        if (p.includes('spa') || p.includes('salon') || p.includes('massage') || p.includes('beauty') || p.includes('nail') || p.includes('hair') || p.includes('wellness') || p.includes('facial') || p.includes('manicure') || p.includes('pedicure')) {
            return {
                type: 'chat',
                text: `Spas & Wellness in Montgomery, AL:\n\n💆 Woodhouse Day Spa — Luxury full-service spa with massages, facials, and body treatments.\n💆 The Spa at Renaissance Montgomery — Upscale hotel spa offering relaxation and rejuvenation packages.\n✂️ Aveda Institute Montgomery — Professional hair, skin, and nail services by trained stylists.\n✂️ Taylor Made Salon & Spa — Local full-service salon offering cuts, color, and spa treatments.\n💅 Serenity Nails & Spa — Popular nail salon with a full menu of manicure and pedicure services.\n💆 Elements Massage Montgomery — Therapeutic massage with flexible membership options.\n\nMost spas recommend booking appointments 24–48 hours in advance.`
            };
        }

        // Hotels / accommodation
        if (p.includes('hotel') || p.includes('motel') || p.includes('accommodation') || p.includes('where to stay') || p.includes('place to stay') || p.includes('inn') || p.includes('lodging') || p.includes('airbnb')) {
            return {
                type: 'chat',
                text: `Hotels in Montgomery, AL:\n\n⭐ Luxury ($$$)\n🏨 Renaissance Montgomery Hotel & Spa — Premier downtown hotel with spa, pool, and rooftop views.\n\n⭐ Mid-Range ($$)\n🏨 DoubleTree by Hilton Montgomery Downtown — Full-service hotel steps from the State Capitol.\n🏨 Hampton Inn & Suites Montgomery-Downtown — Modern rooms with complimentary hot breakfast.\n🏨 Staybridge Suites Montgomery — Extended-stay suites near major attractions, with kitchenettes.\n🏨 Marriott Prattville/Montgomery — Upscale option north of the city with easy highway access.\n\n⭐ Budget ($)\n🏨 Red Roof Inn Montgomery — Clean, reliable budget option with easy freeway access.\n🏨 Quality Inn Montgomery South — Affordable rates near shopping and dining.\n🏨 Motel 6 Montgomery — No-frills budget stay with free parking.\n\nAll downtown hotels are within 10 minutes of the Civil Rights Memorial and Legacy Museum.`
            };
        }

        // Restaurants / dining / food (now separate from cafes)
        if (p.includes('restaurant') || p.includes('eat') || p.includes('food') || p.includes('dining') || p.includes('lunch') || p.includes('dinner') || p.includes('breakfast') || p.includes('where to eat') || p.includes('hungry') || p.includes('bbq') || p.includes('bar-b-q')) {
            return {
                type: 'chat',
                text: `Top Restaurants in Montgomery, AL:\n\n🍷 Fine Dining ($$$)\n• Central Restaurant — Modern Southern cuisine on Dexter Avenue. A must-visit.\n• Vintage Year — Upscale steak and wine dining in a warm, elegant setting.\n• Acre — Farm-to-table with seasonal Southern ingredients.\n\n🍽️ Mid-Range ($$)\n• Dreamland Bar-B-Que — Famous Alabama ribs and smoked meats. A regional institution.\n• El Rey Burrito Lounge — Popular Tex-Mex with fresh ingredients and bold flavors.\n• Sa Za Serious Italian — Wood-fired pizza and handmade pasta, downtown.\n• Baumhower's Victory Grille — Casual sports bar with wings, burgers, and cold beer.\n\n🥡 Budget ($)\n• Chris' Hot Dogs — Montgomery institution since 1917. Famous chili dogs.\n• Scott Street Deli — Quick, hearty lunch sandwiches near downtown.\n• Pannie-George's Kitchen — Soul food and Southern comfort classics.\n\nMost restaurants are clustered along Dexter Avenue and in the Cloverdale district.`
            };
        }

        // Attractions / landmarks / sightseeing / tourist
        if (p.includes('attraction') || p.includes('landmark') || p.includes('museum') || p.includes('tourist') || p.includes('sightseeing') || p.includes('sight') || p.includes('top place') || p.includes('best place') || p.includes('things to see') || p.includes('visit')) {
            return {
                type: 'chat',
                text: `Top Attractions in Montgomery, AL:\n\n🏛️ Civil Rights Memorial — Maya Lin's powerful memorial honoring 40 civil rights martyrs. Free admission.\n🎭 Rosa Parks Museum — Interactive museum at the exact site of Rosa Parks' 1955 arrest.\n📖 The Legacy Museum — Bryan Stevenson's essential museum from Enslavement to Mass Incarceration.\n🏛️ Alabama State Capitol — Historic capitol where Jefferson Davis was inaugurated. Free tours available.\n🦁 Montgomery Zoo & Mann Wildlife Learning Museum — 40 acres, 500+ animals, botanical garden.\n🌊 Montgomery Riverfront Park — Scenic Alabama River park with trails, amphitheater, and events.\n🎵 Hank Williams Museum — Celebrating the life of Montgomery's legendary country music icon.\n🎭 Alabama Shakespeare Festival — World-class theatrical performances in a beautiful festival park.\n\nThe Civil Rights Memorial, Rosa Parks Museum, Legacy Museum, and State Capitol are all within easy walking distance downtown.`
            };
        }

        // Transit / transportation / getting around
        if (p.includes('transit') || p.includes('bus') || p.includes('transport') || p.includes('get around') || p.includes('uber') || p.includes('lyft') || p.includes('parking') || p.includes('directions') || p.includes('drive')) {
            return {
                type: 'chat',
                text: `Getting Around Montgomery, AL:\n\n🚌 MAX Transit (Montgomery Area Transit System) — Local bus network covering downtown, the medical district, and suburbs. Fare: $1.00–$1.50 per ride. montgomerymaxtransit.com\n🚗 Rideshare — Uber and Lyft operate throughout the city. Average downtown ride: $8–$15.\n🚲 Zyp Bikeshare — Docked bike share stations near downtown and Cloverdale.\n🅿️ Parking — Free street parking on weekends. ParkMobile app accepted at all downtown garages.\n🚶 Walking — The Civil Rights Memorial, Legacy Museum, Rosa Parks Museum, and State Capitol are all within comfortable walking distance of each other downtown.\n\nMost major attractions are within 1 mile of the downtown core.`
            };
        }

        // Events / weekend / entertainment
        if (p.includes('event') || p.includes('weekend') || p.includes('activity') || p.includes('entertainment') || p.includes('fun') || p.includes('tonight') || p.includes('this week') || p.includes('show') || p.includes('concert')) {
            return {
                type: 'chat',
                text: `Things to Do in Montgomery This Weekend:\n\n🎭 Friday Night — Alabama Shakespeare Festival for world-class theatrical performances.\n🌅 Saturday Morning — Walk the Civil Rights Memorial and Rosa Parks Museum (opens 9 AM).\n🍽️ Saturday Lunch — Dine at Central on Dexter Ave or get legendary ribs at Dreamland BBQ.\n🏛️ Saturday Afternoon — Explore the Legacy Museum and the Alabama State Capitol grounds.\n🎵 Saturday Evening — Live music at the Riverwalk Amphitheater or check local listings.\n🦁 Sunday — Montgomery Zoo opens at 9 AM — great for families.\n🎭 Sunday Afternoon — Alabama Shakespeare Festival matinee performance.\n\nFor current events and tickets: montgomeryalabama.gov/events\nVisiting Montgomery guide: visitingmontgomery.com`
            };
        }

        // Civil rights / history
        if (p.includes('history') || p.includes('civil rights') || p.includes('rosa parks') || p.includes('mlk') || p.includes('martin luther') || p.includes('selma') || p.includes('freedom') || p.includes('heritage') || p.includes('boycott')) {
            return {
                type: 'chat',
                text: `Montgomery's Civil Rights History:\n\nMontgomery is one of the most historically significant cities in American history.\n\n📍 1955 — Montgomery Bus Boycott: Rosa Parks refused to give up her seat on December 1, sparking a 381-day boycott that ended bus segregation.\n📍 Rosa Parks Museum — Located at the exact site of her arrest at Court Square. Open Tue–Sat.\n📍 Dexter Avenue Baptist Church — Where Dr. Martin Luther King Jr. served as pastor and coordinated the boycott.\n📍 The Legacy Museum — Bryan Stevenson's powerful journey from slavery to mass incarceration.\n📍 Civil Rights Memorial — Maya Lin's memorial honoring 40 martyrs who gave their lives for equality.\n📍 Freedom Rides Museum — Commemorating the 1961 Freedom Riders at the historic Greyhound terminal.\n\nAll major civil rights sites are within 1 mile of downtown, ideal for a self-guided walking tour.`
            };
        }

        // Default — capability menu
        return {
            type: 'chat',
            text: `Hi, I'm ATLAS — your Montgomery, Alabama city copilot. Here's what I can help you with:\n\n🗺️ Itinerary — "Plan my perfect day in Montgomery"\n🍽️ Restaurants — "Best restaurants in Montgomery"\n☕ Cafés — "Coffee shops in Montgomery"\n🏨 Hotels — "Hotels in Montgomery"\n💆 Spas & Salons — "Spas near me"\n🏛️ Attractions — "Top attractions in Montgomery"\n🚌 Transit — "How to get around Montgomery"\n🎭 Events — "Things to do this weekend"\n📖 History — "Civil rights history of Montgomery"\n🚔 Police Stations — "Police stations in Montgomery"\n🚒 Fire Stations — "Fire stations in Montgomery"\n\nWhat would you like to explore?`
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
