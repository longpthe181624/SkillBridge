import { API_BASE_URL } from './homepageService';

export interface SearchFilters {
    query?: string;
    skills?: string[];
    languages?: string[];
    experienceMin?: number;
    experienceMax?: number;
    seniority?: string[];
    location?: string[];
    salaryMin?: number;
    salaryMax?: number;
    availability?: boolean;
    page?: number;
    size?: number;
    sortBy?: string;
}

export interface EngineerSearchResult {
    id: number;
    fullName: string;
    seniority?: string;
    salaryExpectation: number;
    yearsExperience: number;
    location: string;
    profileImageUrl: string;
    primarySkill: string;
    status: string;
    summary?: string;
    languageSummary?: string;
    category?: 'web' | 'game' | 'ai-ml';
}

export interface EngineerSearchResponse {
    results: EngineerSearchResult[];
    totalResults: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
}

/**
 * Search engineers with filters
 */
export const searchEngineers = async (
    filters: SearchFilters
): Promise<EngineerSearchResponse> => {
    try {
        const params = new URLSearchParams();

        // Add filters to query params
        if (filters.query) params.append('query', filters.query);
        if (filters.skills && filters.skills.length > 0) {
            filters.skills.forEach(skill => params.append('skills', skill));
        }
        if (filters.languages && filters.languages.length > 0) {
            filters.languages.forEach(lang => params.append('languages', lang));
        }
        if (filters.experienceMin !== undefined) {
            params.append('experienceMin', filters.experienceMin.toString());
        }
        if (filters.experienceMax !== undefined) {
            params.append('experienceMax', filters.experienceMax.toString());
        }
        if (filters.seniority && filters.seniority.length > 0) {
            filters.seniority.forEach(level => params.append('seniority', level));
        }
        if (filters.location && filters.location.length > 0) {
            filters.location.forEach(loc => params.append('location', loc));
        }
        if (filters.salaryMin !== undefined) {
            params.append('salaryMin', filters.salaryMin.toString());
        }
        if (filters.salaryMax !== undefined) {
            params.append('salaryMax', filters.salaryMax.toString());
        }
        if (filters.availability !== undefined) {
            params.append('availability', filters.availability.toString());
        }

        params.append('page', (filters.page || 0).toString());
        params.append('size', (filters.size || 20).toString());
        params.append('sortBy', filters.sortBy || 'relevance');

        const response = await fetch(
            `${API_BASE_URL}/public/engineers/search?${params.toString()}`
        );

        if (!response.ok) {
            throw new Error('Failed to search engineers');
        }

        const data: EngineerSearchResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error searching engineers:', error);
        throw error;
    }
};

/**
 * Get available skills for filter dropdown
 */
export const getAvailableSkills = async (): Promise<string[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/public/engineers/filters/skills`);

        if (!response.ok) {
            throw new Error('Failed to fetch available skills');
        }

        const data: string[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching available skills:', error);
        return [];
    }
};

/**
 * Get available locations for filter dropdown
 */
export const getAvailableLocations = async (): Promise<string[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/public/engineers/filters/locations`);

        if (!response.ok) {
            throw new Error('Failed to fetch available locations');
        }

        const data: string[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching available locations:', error);
        return [];
    }
};

/**
 * Get available seniority levels for filter dropdown
 */
export const getAvailableSeniorities = async (): Promise<string[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/public/engineers/filters/seniorities`);

        if (!response.ok) {
            throw new Error('Failed to fetch available seniorities');
        }

        const data: string[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching available seniorities:', error);
        return [];
    }
};

