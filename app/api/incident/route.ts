import { NextRequest, NextResponse } from 'next/server';
import { isAvailable, generateJSON } from '@/lib/ai/gemini';

export interface IncidentAnalysis {
  scenario: string;
  severityLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  riskScore: number;
  affectedZones: {
    name: string;
    lat: number;
    lng: number;
    riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  }[];
  immediateRisks: string[];
  recommendations: string[];
  resourcesNeeded: string[];
  estimatedDuration: string;
}

// Montgomery reference zones for the fallback
const MONTGOMERY_ZONES = {
  downtown: { name: 'Downtown Core', lat: 32.3792, lng: -86.3077 },
  capitol: { name: 'State Capitol Area', lat: 32.3766, lng: -86.2996 },
  dexter: { name: 'Dexter Avenue Corridor', lat: 32.3802, lng: -86.3011 },
  riverfront: { name: 'Riverfront Park', lat: 32.3731, lng: -86.2981 },
  civilRights: { name: 'Civil Rights District', lat: 32.3748, lng: -86.3012 },
  southMontgomery: { name: 'South Montgomery', lat: 32.3200, lng: -86.2900 },
  eastMontgomery: { name: 'East Montgomery', lat: 32.3800, lng: -86.2500 },
};

function fallbackIncidentAnalysis(scenario: string): IncidentAnalysis {
  const s = scenario.toLowerCase();

  // Protest / demonstration
  if (s.includes('protest') || s.includes('demonstration') || s.includes('march') || s.includes('rally')) {
    return {
      scenario,
      severityLevel: 'Moderate',
      riskScore: 58,
      affectedZones: [
        { ...MONTGOMERY_ZONES.dexter, riskLevel: 'High' },
        { ...MONTGOMERY_ZONES.capitol, riskLevel: 'Moderate' },
        { ...MONTGOMERY_ZONES.downtown, riskLevel: 'Moderate' },
      ],
      immediateRisks: [
        'Large crowd assembly on Dexter Avenue likely to restrict vehicle access',
        'Heightened emotional tension may lead to escalation',
        'Emergency service access routes may be blocked',
      ],
      recommendations: [
        'Deploy crowd management units to Dexter Avenue and State Capitol grounds',
        'Coordinate with protest organizers to establish designated assembly zones',
        'Pre-position medical units at Bicentennial Park',
        'Activate traffic rerouting on Court Street and McDonough Street',
      ],
      resourcesNeeded: ['Police', 'Traffic Control', 'Medical Standby', 'Communications'],
      estimatedDuration: '3–6 hours',
    };
  }

  // Concert / festival / large public event
  if (s.includes('concert') || s.includes('festival') || s.includes('event') || s.includes('crowd') || s.includes('show')) {
    return {
      scenario,
      severityLevel: 'Low',
      riskScore: 28,
      affectedZones: [
        { ...MONTGOMERY_ZONES.riverfront, riskLevel: 'Moderate' },
        { ...MONTGOMERY_ZONES.downtown, riskLevel: 'Low' },
      ],
      immediateRisks: [
        'Parking congestion near Riverfront Amphitheater',
        'Elevated pedestrian traffic on Commerce Street',
        'Pickpocket risk elevated in dense crowd areas',
      ],
      recommendations: [
        'Open overflow parking at Bicentennial Park and Water Works Street lots',
        'Assign foot patrol officers throughout the venue perimeter',
        'Ensure first aid stations are operational',
      ],
      resourcesNeeded: ['Police', 'Traffic Control', 'Medical Standby'],
      estimatedDuration: '4–8 hours',
    };
  }

  // Evacuation / emergency
  if (s.includes('evacuation') || s.includes('evacuate') || s.includes('emergency') || s.includes('disaster')) {
    return {
      scenario,
      severityLevel: 'Critical',
      riskScore: 88,
      affectedZones: [
        { ...MONTGOMERY_ZONES.downtown, riskLevel: 'Critical' },
        { ...MONTGOMERY_ZONES.southMontgomery, riskLevel: 'High' },
        { ...MONTGOMERY_ZONES.eastMontgomery, riskLevel: 'High' },
        { ...MONTGOMERY_ZONES.riverfront, riskLevel: 'Moderate' },
      ],
      immediateRisks: [
        'City-wide road network under critical load',
        'Emergency communication channels may be saturated',
        'Vulnerable populations require assisted evacuation',
        'Fuel and supply shortages expected within 2 hours',
      ],
      recommendations: [
        'Activate Emergency Operations Center at City Hall',
        'Open Red Cross shelters at BJCC and Montgomery Fair Park',
        'Deploy National Guard to assist with traffic flow on I-85 and US-231',
        'Issue emergency alerts via EAS and Montgomery Alert system',
        'Prioritize evacuation of hospitals and care facilities first',
      ],
      resourcesNeeded: ['Police', 'Fire', 'Medical', 'National Guard', 'Red Cross', 'FEMA'],
      estimatedDuration: '12–48 hours',
    };
  }

  // Severe weather
  if (s.includes('weather') || s.includes('storm') || s.includes('tornado') || s.includes('flood') || s.includes('hurricane')) {
    return {
      scenario,
      severityLevel: 'High',
      riskScore: 72,
      affectedZones: [
        { ...MONTGOMERY_ZONES.riverfront, riskLevel: 'Critical' },
        { ...MONTGOMERY_ZONES.southMontgomery, riskLevel: 'High' },
        { ...MONTGOMERY_ZONES.downtown, riskLevel: 'Moderate' },
      ],
      immediateRisks: [
        'Alabama River flooding risk — Riverfront Park area at critical elevation',
        'Debris and downed power lines on major corridors',
        'Flash flooding likely on low-lying roads in South Montgomery',
      ],
      recommendations: [
        'Issue shelter-in-place advisory for Riverfront zone',
        'Pre-position swift water rescue teams',
        'Close Maxwell Boulevard and Coosa Street to through traffic',
        'Open emergency warming/cooling shelters at city recreation centers',
      ],
      resourcesNeeded: ['Fire & Rescue', 'Police', 'Medical', 'Utilities Emergency'],
      estimatedDuration: '6–24 hours',
    };
  }

  // Vehicle accident / crash
  if (s.includes('accident') || s.includes('crash') || s.includes('collision') || s.includes('vehicle')) {
    return {
      scenario,
      severityLevel: 'Moderate',
      riskScore: 42,
      affectedZones: [
        { ...MONTGOMERY_ZONES.downtown, riskLevel: 'Moderate' },
      ],
      immediateRisks: [
        'Traffic disruption on primary corridors',
        'Potential fuel or fluid spill requiring hazmat assessment',
      ],
      recommendations: [
        'Redirect traffic via alternate city routes',
        'Deploy hazmat unit if fuel leak suspected',
        'Clear scene within 45 minutes to restore traffic flow',
      ],
      resourcesNeeded: ['Police', 'Fire', 'Medical', 'Towing'],
      estimatedDuration: '1–3 hours',
    };
  }

  // Default / generic
  return {
    scenario,
    severityLevel: 'Low',
    riskScore: 22,
    affectedZones: [
      { ...MONTGOMERY_ZONES.downtown, riskLevel: 'Low' },
    ],
    immediateRisks: [
      'Scenario is non-standard — limited pattern match available',
      'General situational awareness elevated',
    ],
    recommendations: [
      'Monitor the situation using standard city surveillance feeds',
      'Keep emergency services on standby',
      'Update ATLAS with additional scenario details for refined analysis',
    ],
    resourcesNeeded: ['Police (Standby)'],
    estimatedDuration: 'Undetermined',
  };
}

export async function POST(request: NextRequest) {
  let scenario: string;
  try {
    const body = await request.json();
    scenario = body?.scenario;
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!scenario || typeof scenario !== 'string' || !scenario.trim()) {
    return NextResponse.json({ success: false, error: 'scenario is required' }, { status: 400 });
  }

  if (isAvailable()) {
    try {
      const raw = await generateJSON(
        `You are ATLAS, a city intelligence AI for Montgomery, Alabama.
Analyze this incident scenario and return JSON with this exact structure:
{
  "scenario": "string",
  "severityLevel": "Low" | "Moderate" | "High" | "Critical",
  "riskScore": number (0-100),
  "affectedZones": [{"name": "string", "lat": number, "lng": number, "riskLevel": "Low"|"Moderate"|"High"|"Critical"}],
  "immediateRisks": ["2-4 specific risk factors"],
  "recommendations": ["3-5 actionable response steps"],
  "resourcesNeeded": ["list of emergency resource types"],
  "estimatedDuration": "string e.g. '2-4 hours'"
}
Use real Montgomery, AL coordinates (lat ~32.37, lng ~-86.30) for affected zones. Return only valid JSON.`,
        `Simulate and analyze this incident: ${scenario}`
      );
      const data: IncidentAnalysis = JSON.parse(raw);
      return NextResponse.json({ success: true, ...data });
    } catch (err) {
      const isQuota = String(err).includes('429') || String(err).includes('quota');
      if (!isQuota) {
        return NextResponse.json({ success: false, error: 'AI analysis failed' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ success: true, ...fallbackIncidentAnalysis(scenario) });
}
