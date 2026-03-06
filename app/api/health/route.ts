import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({ status: 'ok', message: 'AI City Copilot API is running.' });
}
