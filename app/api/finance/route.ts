import { NextRequest, NextResponse } from 'next/server';
import { MontgomeryOpenDataService } from '@/lib/services/montgomeryOpenData';

const openDataService = new MontgomeryOpenDataService();

export async function GET(request: NextRequest) {
  try {
    const result = await openDataService.getFinanceTransparency();

    return NextResponse.json(result);
  } catch (error) {
    console.error('Finance API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}