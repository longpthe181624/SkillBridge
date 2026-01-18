import { API_BASE_URL } from '@/lib/apiConfig';

/**
 * Project Close Request Service
 * Story-41: Project Close Request for SOW Contract
 */

export interface CreateProjectCloseRequestRequest {
    message?: string;
    links?: string;
}

export interface ResubmitProjectCloseRequestRequest {
    message?: string;
    links?: string;
}

export interface ApproveProjectCloseRequestRequest {
    confirm?: boolean;
}

export interface RejectProjectCloseRequestRequest {
    reason: string;
}

export interface UserInfo {
    id: number;
    name: string;
    email: string;
}

export interface ProjectCloseRequestDetail {
    id: number;
    sowId: number;
    sowContractName?: string;
    sowPeriod?: string;
    status: 'Pending' | 'ClientApproved' | 'Rejected';
    message?: string;
    links?: string;
    requestedBy?: UserInfo;
    clientRejectReason?: string;
    createdAt: string;
    updatedAt: string;
    sowStatus?: string;
}

export interface ProjectCloseRequestResponse {
    success: boolean;
    message: string;
    data: ProjectCloseRequestDetail;
}

/**
 * Create a new Project Close Request (SalesRep)
 * POST /api/sales/sows/{sowId}/close-requests
 */
export async function createProjectCloseRequest(
    sowId: number,
    request: CreateProjectCloseRequestRequest,
    token: string
): Promise<ProjectCloseRequestResponse> {
    const response = await fetch(`${API_BASE_URL}/sales/sows/${sowId}/close-requests`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to create close request' }));
        throw new Error(error.message || 'Failed to create close request');
    }

    return response.json();
}

/**
 * Resubmit a rejected Project Close Request (SalesRep)
 * POST /api/sales/sows/{sowId}/close-requests/{id}/resubmit
 */
export async function resubmitProjectCloseRequest(
    sowId: number,
    closeRequestId: number,
    request: ResubmitProjectCloseRequestRequest,
    token: string
): Promise<ProjectCloseRequestResponse> {
    const response = await fetch(`${API_BASE_URL}/sales/sows/${sowId}/close-requests/${closeRequestId}/resubmit`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to resubmit close request' }));
        throw new Error(error.message || 'Failed to resubmit close request');
    }

    return response.json();
}

/**
 * Get latest Project Close Request for a SOW (Client or SalesRep)
 * GET /api/client/sows/{sowId}/close-requests/latest
 * Returns null if no close request exists (404 response)
 */
export async function getLatestProjectCloseRequest(
    sowId: number,
    token: string
): Promise<ProjectCloseRequestDetail | null> {
    const response = await fetch(`${API_BASE_URL}/client/sows/${sowId}/close-requests/latest`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (response.status === 404) {
        // No close request found - this is a valid state
        return null;
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to get close request' }));
        throw new Error(error.message || 'Failed to get close request');
    }

    return response.json();
}

/**
 * Approve a Project Close Request (Client)
 * POST /api/client/close-requests/{id}/approve
 */
export async function approveProjectCloseRequest(
    closeRequestId: number,
    request: ApproveProjectCloseRequestRequest,
    token: string
): Promise<ProjectCloseRequestResponse> {
    const response = await fetch(`${API_BASE_URL}/client/close-requests/${closeRequestId}/approve`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to approve close request' }));
        throw new Error(error.message || 'Failed to approve close request');
    }

    return response.json();
}

/**
 * Reject a Project Close Request (Client)
 * POST /api/client/close-requests/{id}/reject
 */
export async function rejectProjectCloseRequest(
    closeRequestId: number,
    request: RejectProjectCloseRequestRequest,
    token: string
): Promise<ProjectCloseRequestResponse> {
    const response = await fetch(`${API_BASE_URL}/client/close-requests/${closeRequestId}/reject`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to reject close request' }));
        throw new Error(error.message || 'Failed to reject close request');
    }

    return response.json();
}

