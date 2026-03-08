/**
 * Runtime environment variable validation.
 * Call warnMissingEnvVars() at the top of any API route that requires keys.
 * Logs a warning (never throws) so the app gracefully degrades with stub data.
 */

interface EnvCheck {
  key: string;
  description: string;
  required: boolean;
}

const ENV_CHECKS: EnvCheck[] = [
  {
    key: 'GEMINI_API_KEY',
    description: 'Google Gemini — AI Copilot chat & itinerary (https://aistudio.google.com/app/apikey)',
    required: true,
  },
  {
    key: 'BRIGHTDATA_API_KEY',
    description: 'Bright Data — Business Discovery scraping (https://brightdata.com)',
    required: false,
  },
  {
    key: 'MONTGOMERY_APP_TOKEN',
    description: 'Montgomery Open Data SODA — increases rate limits (https://opendata.montgomeryal.gov)',
    required: false,
  },
];

/** Logs a warning for each missing env var. Pass a subset of keys to check only those. */
export function warnMissingEnvVars(keys?: string[]): void {
  const checks = keys
    ? ENV_CHECKS.filter((c) => keys.includes(c.key))
    : ENV_CHECKS;

  for (const check of checks) {
    // Accept GOOGLE_API_KEY as an alias for GEMINI_API_KEY
    const alias = check.key === 'GEMINI_API_KEY' ? 'GOOGLE_API_KEY' : undefined;
    const present = !!process.env[check.key] || (alias ? !!process.env[alias] : false);
    if (!present) {
      const level = check.required ? 'ERROR' : 'WARN';
      const keyLabel = alias ? `${check.key} (or ${alias})` : check.key;
      console.warn(
        `[ENV ${level}] Missing ${keyLabel} — ${check.description}`
      );
    }
  }
}

/** Returns true only if all required keys are present. */
export function hasRequiredEnvVars(keys: string[]): boolean {
  return keys.every((key) => Boolean(process.env[key]));
}
