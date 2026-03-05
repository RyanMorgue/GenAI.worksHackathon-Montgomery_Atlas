/**
 * Montgomery Open Data Service (SODA API Wrapper)
 * Fetches data from Montgomery's open data portal: https://opendata.montgomeryal.gov
 */

export interface CivicDataResponse {
    status: 'AVAILABLE' | 'UNAVAILABLE';
    data: any[];
    message?: string;
}

export class MontgomeryOpenDataService {
    private readonly baseUrl = 'https://opendata.montgomeryal.gov/resource';
    private readonly appToken: string;

    // Dataset mappings - Unconfirmed datasets are explicitly left undefined to ensure 
    // we never hallucinate an API endpoint per the strict system prompt rules.
    private readonly datasets = {
        crime: undefined, // Example: 'qdhn-rcw8' if confirmed
        finance: undefined,
        development: undefined,
        infrastructure: undefined
    };

    constructor() {
        // App token is optional for SODA but increases rate limits
        this.appToken = process.env.MONTGOMERY_APP_TOKEN || '';
    }

    private async fetchSoda(datasetId: string, queryParams: URLSearchParams = new URLSearchParams()): Promise<any[]> {
        const url = `${this.baseUrl}/${datasetId}.json?${queryParams.toString()}`;
        const headers: Record<string, string> = {};

        if (this.appToken) {
            headers['X-App-Token'] = this.appToken;
        }

        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`SODA API Error: ${response.statusText}`);
        }
        return response.json();
    }

    async getCrimeReports(limit: number = 100): Promise<CivicDataResponse> {
        if (!this.datasets.crime) {
            return {
                status: 'UNAVAILABLE',
                data: [],
                message: 'Crime dataset ID could not be confirmed. Safe skip applied.'
            };
        }

        try {
            const params = new URLSearchParams({
                '$limit': limit.toString(),
                '$order': 'date DESC'
            });
            const data = await this.fetchSoda(this.datasets.crime, params);
            return { status: 'AVAILABLE', data };
        } catch (error) {
            console.error('[SODA] Failed to fetch crime reports:', error);
            return { status: 'UNAVAILABLE', data: [] };
        }
    }

    async getFinanceTransparency(): Promise<CivicDataResponse> {
        if (!this.datasets.finance) {
            return {
                status: 'UNAVAILABLE',
                data: [],
                message: 'Finance dataset ID could not be confirmed. Safe skip applied.'
            };
        }

        return { status: 'UNAVAILABLE', data: [] }; // Implementation placeholder
    }

    async getInfrastructureUpdates(): Promise<CivicDataResponse> {
        if (!this.datasets.infrastructure) {
            return {
                status: 'UNAVAILABLE',
                data: [],
                message: 'Infrastructure dataset ID could not be confirmed. Safe skip applied.'
            };
        }
        return { status: 'UNAVAILABLE', data: [] }; // Implementation placeholder
    }
}
