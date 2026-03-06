import { NextRequest, NextResponse } from 'next/server';
import { MontgomeryOpenDataService } from '@/lib/services/montgomeryOpenData';

const openDataService = new MontgomeryOpenDataService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');

    const result = await openDataService.getCrimeReports(limit);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Crime API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}