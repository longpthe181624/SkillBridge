import { API_BASE_URL } from '@/lib/apiConfig';

export interface AdminDashboardSummary {
    engineers: {
        active: number;
        inactive: number;
    };
    systemUsers: {
        active: number;
        inactive: number;
    };
    skills: {
        total: number;
    };
    projectTypes: {
        total: number;
    };
}

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};

/**
 * Get dashboard summary statistics
 */
export async function getDashboardSummary(): Promise<AdminDashboardSummary> {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/summary`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to get dashboard summary');
    }

    return data;
}

