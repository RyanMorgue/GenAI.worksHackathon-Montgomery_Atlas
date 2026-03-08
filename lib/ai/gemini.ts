/**
 * Gemini AI Provider Wrapper
 * Initializes Google Gemini and exposes text and JSON generation functions.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Lazily resolved so the key is read at call time, not at module load.
// This means adding/changing GEMINI_API_KEY in .env.local takes effect on
// the next request without requiring a server restart.
function getClient(): GoogleGenerativeAI | null {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
    return apiKey ? new GoogleGenerativeAI(apiKey) : null;
}

export function isAvailable(): boolean {
    return !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
}

/**
 * Generate a plain text response with a system instruction.
 */
export async function generateText(
    systemInstruction: string,
    userPrompt: string
): Promise<string> {
    const client = getClient();
    if (!client) throw new Error('Gemini client not initialized');
    const model = client.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction,
    });
    const result = await model.generateContent(userPrompt);
    return result.response.text();
}

/**
 * Generate a JSON response with a system instruction.
 * Returns the raw JSON string — caller is responsible for parsing.
 */
export async function generateJSON(
    systemInstruction: string,
    userPrompt: string
): Promise<string> {
    const client = getClient();
    if (!client) throw new Error('Gemini client not initialized');
    const model = client.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction,
        generationConfig: { responseMimeType: 'application/json' },
    });
    const result = await model.generateContent(userPrompt);
    return result.response.text();
}
