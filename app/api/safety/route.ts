import { NextRequest, NextResponse } from 'next/server';
import { isAvailable, generateJSON } from '@/lib/ai/gemini';

export interface SafetyAnalysis {
  location: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  riskScore: number; // 0–100
  factors: string[];
  recommendations: string[];
  emergencyServices: {
    hospital: { name: string; address: string; phone: string };
    police: { name: string; address: string; phone: string };
    fire: { name: string; address: string; phone: string };
  };
}

// Deterministic fallback — keyword-driven risk assessment for Montgomery
function fallbackAnalysis(location: string): SafetyAnalysis {
  const loc = location.toLowerCase();

  let riskLevel: SafetyAnalysis['riskLevel'] = 'Low';
  let riskScore = 15;
  const factors: string[] = [];
  const recommendations: string[] = [];

  // Time-of-day signals
  if (loc.includes('night') || loc.includes('midnight') || loc.includes('2am') || loc.includes('3am')) {
    riskScore += 35;
    factors.push('Late-night hours — reduced foot traffic and visibility');
    recommendations.push('Stay in well-lit, populated areas after dark');
    recommendations.push('Use rideshare apps (Uber/Lyft) instead of walking alone');
  }
  if (loc.includes('evening') || loc.includes('dusk') || loc.includes('after dark')) {
    riskScore += 15;
    factors.push('Evening hours — limited natural lighting');
    recommendations.push('Remain near public spaces and active venues');
  }

  // Location-specific signals
  if (loc.includes('downtown') || loc.includes('dexter')) {
    riskScore += 10;
    factors.push('Urban downtown area — higher pedestrian density');
    recommendations.push('Be aware of your surroundings in crowded areas');
  }
  if (loc.includes('riverfront') || loc.includes('river')) {
    riskScore += 8;
    factors.push('Waterfront location — isolated sections possible');
    recommendations.push('Stick to the main Riverfront Park path and lit areas');
  }
  if (loc.includes('parking') || loc.includes('garage') || loc.includes('lot')) {
    riskScore += 20;
    factors.push('Parking structure — limited sightlines and potential blind spots');
    recommendations.push('Park in well-lit, monitored garages');
    recommendations.push('Have keys ready before approaching your vehicle');
  }
  if (loc.includes('alone') || loc.includes('by myself') || loc.includes('solo')) {
    riskScore += 15;
    factors.push('Traveling alone — reduced safety buffer');
    recommendations.push('Share your location with a trusted contact');
    recommendations.push('Stay on main roads and populated routes');
  }
  if (loc.includes('festival') || loc.includes('event') || loc.includes('crowd') || loc.includes('concert')) {
    riskScore += 5;
    factors.push('Large public gathering — pickpocket risk elevated');
    recommendations.push('Keep valuables secure and be mindful of your belongings');
  }
  if (loc.includes('civil rights') || loc.includes('legacy museum') || loc.includes('rosa parks')) {
    factors.push('High-traffic tourist area — generally well-monitored');
    recommendations.push('Area is regularly patrolled; security is present during open hours');
  }

  // Default factors if none detected
  if (factors.length === 0) {
    factors.push('General urban environment');
    recommendations.push('Stay aware of your surroundings');
    recommendations.push('Keep emergency contacts saved on your phone');
  }

  // Derive risk level from score
  riskScore = Math.min(riskScore, 100);
  if (riskScore >= 70) riskLevel = 'Critical';
  else if (riskScore >= 45) riskLevel = 'High';
  else if (riskScore >= 25) riskLevel = 'Moderate';
  else riskLevel = 'Low';

  return {
    location,
    riskLevel,
    riskScore,
    factors,
    recommendations,
    emergencyServices: {
      hospital: {
        name: 'Baptist Medical Center South',
        address: '2105 E South Blvd, Montgomery, AL 36116',
        phone: '(334) 288-2100',
      },
      police: {
        name: 'Montgomery Police Department HQ',
        address: '320 N Ripley St, Montgomery, AL 36104',
        phone: '(334) 241-2651',
      },
      fire: {
        name: 'Montgomery Fire Department HQ',
        address: '26 Decatur St, Montgomery, AL 36104',
        phone: '(334) 241-2600',
      },
    },
  };
}

export async function POST(request: NextRequest) {
  let location: string;
  try {
    const body = await request.json();
    location = body?.location;
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!location || typeof location !== 'string' || !location.trim()) {
    return NextResponse.json({ success: false, error: 'location is required' }, { status: 400 });
  }

  // Use Gemini if available
  if (isAvailable()) {
    try {
      const systemInstruction = `You are a public safety analyst for Montgomery, Alabama.
Analyze the given location description and return a JSON safety assessment with this exact structure:
{
  "location": "string (the location as described)",
  "riskLevel": "Low" | "Moderate" | "High" | "Critical",
  "riskScore": number (0-100),
  "factors": ["array of 2-4 specific risk factors detected"],
  "recommendations": ["array of 2-4 actionable safety recommendations"],
  "emergencyServices": {
    "hospital": { "name": "string", "address": "string", "phone": "string" },
    "police": { "name": "string", "address": "string", "phone": "string" },
    "fire": { "name": "string", "address": "string", "phone": "string" }
  }
}
Use real Montgomery, AL emergency services. Base risk on time of day, location type, and context clues. Return only valid JSON.`;

      const raw = await generateJSON(systemInstruction, `Analyze safety for: ${location}`);
      const data: SafetyAnalysis = JSON.parse(raw);
      return NextResponse.json({ success: true, ...data });
    } catch (err) {
      const isQuota = String(err).includes('429') || String(err).includes('quota');
      if (!isQuota) {
        return NextResponse.json({ success: false, error: 'AI analysis failed' }, { status: 500 });
      }
      // Fall through to deterministic fallback on quota error
    }
  }

  const result = fallbackAnalysis(location);
  return NextResponse.json({ success: true, ...result });
}
