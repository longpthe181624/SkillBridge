import { API_BASE_URL } from '@/lib/apiConfig';

export interface Engineer {
  id: number;
  fullName: string;
  email?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  yearsExperience: number;
  seniority: string;
  primarySkill?: string;
  salaryExpectation?: number;
  location?: string;
  status: string;
  summary?: string;
  introduction?: string;
  languageSummary?: string;
  profileImageUrl?: string;
  interestedInJapan?: boolean;
  projectTypeExperience?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EngineerListResponse {
  content: Engineer[];
  page: {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export interface CertificateRequest {
  name: string;
  issuedBy?: string;
  issuedDate?: string; // YYYY-MM-DD
  expiryDate?: string; // YYYY-MM-DD
}

export interface CreateEngineerRequest {
  // Basic Info
  fullName: string;
  email: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string; // YYYY-MM-DD
  seniority: string; // Level in form
  introduction?: string;
  
  // Professional Info
  yearsExperience: number;
  primarySkill?: string; // Comma-separated
  otherSkills?: number[]; // Array of skill IDs
  projectTypeExperience?: string; // Comma-separated
  
  // Foreign Language
  languageSummary?: string;
  
  // Other
  salaryExpectation?: number;
  interestedInJapan?: boolean;
  
  // General
  location?: string;
  status: string;
  summary?: string;
  profileImageUrl?: string;
  
  // Certificates
  certificates?: CertificateRequest[];
}

export interface UpdateEngineerRequest extends CreateEngineerRequest {}

export interface Certificate {
  id?: number;
  engineerId?: number;
  name: string;
  issuedBy?: string;
  issuedDate?: string; // YYYY-MM-DD
  expiryDate?: string; // YYYY-MM-DD
}

export interface EngineerDetail extends Engineer {
  certificates?: Certificate[];
  otherSkills?: number[]; // Array of skill IDs
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

/**
 * Get all engineers with pagination and search
 */
export async function getAllEngineers(
  page: number = 0,
  size: number = 20,
  search?: string
): Promise<EngineerListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  
  if (search) {
    params.append('search', search);
  }

  const response = await fetch(`${API_BASE_URL}/admin/engineers?${params.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to get engineers');
  }

  return data;
}

/**
 * Get engineer by ID
 */
export async function getEngineerById(id: number): Promise<Engineer> {
  const response = await fetch(`${API_BASE_URL}/admin/engineers/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to get engineer');
  }

  return data;
}

/**
 * Get engineer detail by ID with certificates and skills
 */
export async function getEngineerDetailById(id: number): Promise<EngineerDetail> {
  const response = await fetch(`${API_BASE_URL}/admin/engineers/${id}/detail`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to get engineer detail');
  }

  return data;
}

/**
 * Create a new engineer
 */
export async function createEngineer(request: CreateEngineerRequest): Promise<Engineer> {
  const response = await fetch(`${API_BASE_URL}/admin/engineers`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create engineer');
  }

  return data;
}

/**
 * Update an engineer
 */
export async function updateEngineer(
  id: number,
  request: UpdateEngineerRequest
): Promise<Engineer> {
  const response = await fetch(`${API_BASE_URL}/admin/engineers/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update engineer');
  }

  return data;
}

/**
 * Delete an engineer
 */
export async function deleteEngineer(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/engineers/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to delete engineer');
  }
}

/**
 * Upload profile image for engineer
 * Returns the S3 key (to be stored in database) and presigned URL (for preview)
 */
export async function uploadProfileImage(file: File): Promise<{ s3Key: string; presignedUrl: string }> {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('file', file);

  const headers: HeadersInit = {
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const response = await fetch(`${API_BASE_URL}/admin/engineers/upload-image`, {
    method: 'POST',
    headers,
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to upload image');
  }

  // Return both S3 key (for storage) and presigned URL (for preview)
  return {
    s3Key: data.s3Key || data.imageUrl, // Fallback to imageUrl for backward compatibility
    presignedUrl: data.imageUrl
  };
}

