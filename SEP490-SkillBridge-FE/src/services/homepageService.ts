/**
 * Homepage Service
 * Handles all API calls for the homepage
 */

// Fixed API Base URL - must include /public path!
export const API_BASE_URL = 'http://localhost:8081/api';

export interface HomepageStatistics {
    totalEngineers: number;
    totalCustomers: number;
}

export interface EngineerProfile {
    id: number;
    fullName: string;
    category?: 'web' | 'game' | 'ai-ml';
    seniority?: string;
    salaryExpectation: number;
    yearsExperience: number;
    location: string;
    profileImageUrl: string;
    primarySkill: string;
    status: string;
    summary?: string;
    languageSummary?: string;
}

/**
 * Fetch homepage statistics
 */
export async function getHomepageStatistics(): Promise<HomepageStatistics> {
    try {
        const response = await fetch(`${API_BASE_URL}/public/homepage/statistics`);
        if (!response.ok) {
            throw new Error('Failed to fetch homepage statistics');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching homepage statistics:', error);
        // Return default values on error
        return {
            totalEngineers: 350,
            totalCustomers: 30
        };
    }
}

/**
 * Fetch all homepage engineers (grouped by categories)
 */
export async function getHomepageEngineers(): Promise<EngineerProfile[]> {
    try {
        console.log('🚀 Fetching engineers from:', `${API_BASE_URL}/public/homepage/engineers`);
        const response = await fetch(`${API_BASE_URL}/public/homepage/engineers`);
        console.log('📡 Response status:', response.status);
        if (!response.ok) {
            throw new Error('Failed to fetch homepage engineers');
        }
        const data = await response.json();
        console.log('✅ Engineers loaded:', data.length, 'engineers');
        console.log('📊 First engineer:', data[0]);
        return data;
    } catch (error) {
        console.error('❌ Error fetching homepage engineers:', error);
        return [];
    }
}

/**
 * Fetch engineers by category
 */
export async function getEngineersByCategory(category: string): Promise<EngineerProfile[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/public/homepage/engineers/${category}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${category} engineers`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${category} engineers:`, error);
        return [];
    }
}

