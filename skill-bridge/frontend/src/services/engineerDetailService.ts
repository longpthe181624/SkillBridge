/**
 * Engineer Detail Service
 * Handles API calls for engineer detail view
 */

import { API_BASE_URL } from '@/lib/apiConfig';

export interface EngineerSkill {
  id: number;
  name: string;
  level?: string;
  yearsOfExperience?: number;
}

export interface Certificate {
  id: number;
  name: string;
  issuedBy: string;
  issuedDate?: string;
  expiryDate?: string;
}

export interface EngineerDetail {
  id: number;
  fullName: string;
  location: string;
  profileImageUrl: string;
  salaryExpectation: number;
  yearsExperience: number;
  seniority: string;
  status: 'AVAILABLE' | 'BUSY' | 'NOT_AVAILABLE';
  primarySkill: string;
  languageSummary: string;
  summary: string;
  introduction: string;
  skills: EngineerSkill[];
  certificates: Certificate[];
}

/**
 * Get engineer detail by ID
 * @param id Engineer ID
 * @returns Engineer detail information
 */
export async function getEngineerById(id: number): Promise<EngineerDetail> {
  try {
    console.log('🔍 Fetching engineer detail for ID:', id);
    const response = await fetch(`${API_BASE_URL}/public/engineers/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Engineer not found');
      }
      throw new Error(`Failed to fetch engineer: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Engineer detail loaded:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching engineer detail:', error);
    throw error;
  }
}

/**
 * Check if engineer exists
 * @param id Engineer ID
 * @returns true if engineer exists
 */
export async function engineerExists(id: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/public/engineers/${id}`, {
      method: 'HEAD'
    });
    return response.ok;
  } catch {
    return false;
  }
}

