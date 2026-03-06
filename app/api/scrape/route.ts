import { NextRequest, NextResponse } from 'next/server';
import { BrightDataService } from '@/lib/brightDataService';

const brightDataService = new BrightDataService();

export async function POST(request: NextRequest) {
  try {
    const { category, location, limit } = await request.json();

    if (!category || !location) {
      return NextResponse.json({ error: 'Missing category or location' }, { status: 400 });
    }

    const businesses = await brightDataService.scrapeBusinesses(category, location, limit || 10);

    return NextResponse.json({ businesses });
  } catch (error) {
    console.error('Scrape API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}