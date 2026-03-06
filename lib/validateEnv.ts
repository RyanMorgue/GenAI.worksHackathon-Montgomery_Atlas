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
    key: 'OPENAI_API_KEY',
    description: 'OpenAI — AI Copilot chat & itinerary (https://platform.openai.com/api-keys)',
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
    if (!process.env[check.key]) {
      const level = check.required ? 'ERROR' : 'WARN';
      console.warn(
        `[ENV ${level}] Missing ${check.key} — ${check.description}`
      );
    }
  }
}

/** Returns true only if all required keys are present. */
export function hasRequiredEnvVars(keys: string[]): boolean {
  return keys.every((key) => Boolean(process.env[key]));
}
