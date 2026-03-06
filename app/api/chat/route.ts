import { NextRequest, NextResponse } from 'next/server';
import { AICopilotService } from '@/lib/services/aiCopilotService';

const copilotService = new AICopilotService();

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
    }

    const response = await copilotService.processPrompt(prompt);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}