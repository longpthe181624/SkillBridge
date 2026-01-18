import { API_BASE_URL } from '@/lib/apiConfig';

export interface Skill {
    id: number;
    name: string;
    description?: string;
    parentSkillId?: number | null;
}

export interface SubSkill {
    id: number;
    name: string;
    parentSkillId: number;
}

export interface SkillListResponse {
    content: Skill[];
    page: {
        number: number;
        size: number;
        totalElements: number;
        totalPages: number;
    };
}

export interface CreateSkillRequest {
    name: string;
    description?: string;
    subSkills?: Array<{
        name: string;
    }>;
}

export interface CreateSubSkillRequest {
    name: string;
}

export interface UpdateSkillRequest {
    name: string;
    description?: string;
    subSkills?: Array<{
        id?: number;
        name: string;
    }>;
}

export interface UpdateSubSkillRequest {
    name: string;
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
 * Get all parent skills with pagination and search
 */
export async function getAllParentSkills(
    page: number = 0,
    size: number = 20,
    search?: string
): Promise<SkillListResponse> {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    });

    if (search) {
        params.append('search', search);
    }

    const response = await fetch(`${API_BASE_URL}/admin/master-data/skills?${params.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to get skills');
    }

    return data;
}

/**
 * Get sub-skills for a parent skill
 */
export async function getSubSkillsByParentId(parentSkillId: number): Promise<SubSkill[]> {
    const response = await fetch(`${API_BASE_URL}/admin/master-data/skills/${parentSkillId}/sub-skills`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to get sub-skills');
    }

    return data;
}

/**
 * Create a new skill with optional sub-skills
 */
export async function createSkill(request: CreateSkillRequest): Promise<Skill> {
    const response = await fetch(`${API_BASE_URL}/admin/master-data/skills`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to create skill');
    }

    return data;
}

/**
 * Create a new sub-skill
 */
export async function createSubSkill(parentSkillId: number, request: CreateSubSkillRequest): Promise<SubSkill> {
    const response = await fetch(`${API_BASE_URL}/admin/master-data/skills/${parentSkillId}/sub-skills`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to create sub-skill');
    }

    return data;
}

/**
 * Update a skill
 */
export async function updateSkill(skillId: number, request: UpdateSkillRequest): Promise<Skill> {
    const response = await fetch(`${API_BASE_URL}/admin/master-data/skills/${skillId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to update skill');
    }

    return data;
}

/**
 * Update a sub-skill
 */
export async function updateSubSkill(subSkillId: number, request: UpdateSubSkillRequest): Promise<SubSkill> {
    const response = await fetch(`${API_BASE_URL}/admin/master-data/skills/sub-skills/${subSkillId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to update sub-skill');
    }

    return data;
}

/**
 * Delete a skill (with cascade delete of sub-skills)
 */
export async function deleteSkill(skillId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/master-data/skills/${skillId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete skill');
    }
}

/**
 * Delete a sub-skill
 */
export async function deleteSubSkill(subSkillId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/master-data/skills/sub-skills/${subSkillId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete sub-skill');
    }
}

