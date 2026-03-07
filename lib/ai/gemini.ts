/**
 * Gemini AI Provider Wrapper
 * Initializes Google Gemini and exposes text and JSON generation functions.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export function isAvailable(): boolean {
    return !!genAI;
}

/**
 * Generate a plain text response with a system instruction.
 */
export async function generateText(
    systemInstruction: string,
    userPrompt: string
): Promise<string> {
    if (!genAI) throw new Error('Gemini client not initialized');
    const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
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
    if (!genAI) throw new Error('Gemini client not initialized');
    const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction,
        generationConfig: { responseMimeType: 'application/json' },
    });
    const result = await model.generateContent(userPrompt);
    return result.response.text();
}
