import { NextRequest, NextResponse } from 'next/server';
import { AICopilotService } from '@/lib/services/aiCopilotService';
import { warnMissingEnvVars } from '@/lib/validateEnv';

warnMissingEnvVars(['OPENAI_API_KEY']);

const copilotService = new AICopilotService();
const TIMEOUT_MS = 10_000;

export async function POST(request: NextRequest) {
  const t0 = Date.now();

  let prompt: string;
  try {
    const body = await request.json();
    prompt = body?.prompt;
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return NextResponse.json({ success: false, error: 'prompt is required' }, { status: 400 });
  }

  console.log(`[Chat] prompt="${prompt.slice(0, 80)}"`)

  try {
    const response = await Promise.race([
      copilotService.processPrompt(prompt),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), TIMEOUT_MS)
      ),
    ]);

    console.log(`[Chat] OK in ${Date.now() - t0}ms`);
    return NextResponse.json({ success: true, ...response });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Chat] FAIL in ${Date.now() - t0}ms —`, msg);

    if (msg === 'Request timeout') {
      return NextResponse.json(
        { success: false, error: 'AI service timed out. Please try again.' },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'AI service temporarily unavailable.' },
      { status: 500 }
    );
  }
}