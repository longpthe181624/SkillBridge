const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Dashboard Summary Types
export interface DashboardSummary {
    contacts: {
        inprogress: number;
        new: number;
    };
    proposals: {
        underReview: number;
        reviewed: number;
    };
    contracts: {
        active: number;
        draft: number;
    };
    changeRequests: {
        underReview: number;
        approved: number;
    };
}

// Activity Types
export interface Activity {
    id: number;
    date: string; // Format: YYYY/MM/DD
    description: string;
    type: string; // PROPOSAL, CONTRACT, CHANGE_REQUEST, CONTACT
    entityId: number;
    entityType: string; // proposal, contract, changeRequest, contact
}

export interface ActivitiesResponse {
    activities: Activity[];
    total: number;
}

// Alert Types
export interface Alert {
    id: number;
    message: string;
    priority: string; // HIGH, MEDIUM, LOW
    type: string; // CHANGE_REQUEST_DECISION, CONTRACT_SIGNATURE, PROPOSAL_REVIEW, etc.
    entityId: number;
    entityType: string; // changeRequest, contract, proposal, contact
}

export interface AlertsResponse {
    alerts: Alert[];
    total: number;
}

/**
 * Get dashboard summary statistics
 */
export async function getDashboardSummary(
    token: string
): Promise<DashboardSummary> {
    const userStr = localStorage.getItem('user');
    let userId: number | null = null;
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            userId = user.id;
        } catch (e) {
            console.error('Error parsing user:', e);
        }
    }

    const url = `${API_BASE_URL}/client/dashboard/summary`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...(userId && { 'X-User-Id': userId.toString() }),
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to fetch dashboard summary' }));
        throw new Error(error.message || 'Failed to fetch dashboard summary');
    }

    return response.json();
}

/**
 * Get recent activities
 */
export async function getDashboardActivities(
    token: string,
    limit: number = 10
): Promise<ActivitiesResponse> {
    const userStr = localStorage.getItem('user');
    let userId: number | null = null;
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            userId = user.id;
        } catch (e) {
            console.error('Error parsing user:', e);
        }
    }

    const url = `${API_BASE_URL}/client/dashboard/activities?limit=${limit}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...(userId && { 'X-User-Id': userId.toString() }),
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to fetch dashboard activities' }));
        throw new Error(error.message || 'Failed to fetch dashboard activities');
    }

    return response.json();
}

/**
 * Get alerts/notifications
 */
export async function getDashboardAlerts(
    token: string,
    limit: number = 10
): Promise<AlertsResponse> {
    const userStr = localStorage.getItem('user');
    let userId: number | null = null;
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            userId = user.id;
        } catch (e) {
            console.error('Error parsing user:', e);
        }
    }

    const url = `${API_BASE_URL}/client/dashboard/alerts?limit=${limit}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...(userId && { 'X-User-Id': userId.toString() }),
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to fetch dashboard alerts' }));
        throw new Error(error.message || 'Failed to fetch dashboard alerts');
    }

    return response.json();
}

