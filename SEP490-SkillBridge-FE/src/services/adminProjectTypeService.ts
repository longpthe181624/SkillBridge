import { API_BASE_URL } from '@/lib/apiConfig';

export interface ProjectType {
    id: number;
    name: string;
    description?: string;
}

export interface ProjectTypeListResponse {
    content: ProjectType[];
    page: {
        number: number;
        size: number;
        totalElements: number;
        totalPages: number;
    };
}

export interface CreateProjectTypeRequest {
    name: string;
    description?: string;
}

export interface UpdateProjectTypeRequest {
    name: string;
    description?: string;
}

export interface ErrorResponse {
    message: string;
}

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};

/**
 * Get all project types with pagination and search
 */
export async function getAllProjectTypes(
    page: number = 0,
    size: number = 20,
    search?: string
): Promise<ProjectTypeListResponse> {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    });

    if (search) {
        params.append('search', search);
    }

    const response = await fetch(`${API_BASE_URL}/admin/master-data/project-types?${params.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to get project types');
    }

    return data;
}

/**
 * Create a new project type
 */
export async function createProjectType(request: CreateProjectTypeRequest): Promise<ProjectType> {
    const response = await fetch(`${API_BASE_URL}/admin/master-data/project-types`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to create project type');
    }

    return data;
}

/**
 * Update a project type
 */
export async function updateProjectType(
    projectTypeId: number,
    request: UpdateProjectTypeRequest
): Promise<ProjectType> {
    const response = await fetch(`${API_BASE_URL}/admin/master-data/project-types/${projectTypeId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to update project type');
    }

    return data;
}

/**
 * Delete a project type
 */
export async function deleteProjectType(projectTypeId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/master-data/project-types/${projectTypeId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete project type');
    }
}

