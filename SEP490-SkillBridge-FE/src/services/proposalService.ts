import { ProposalListResponse, ProposalListItem } from '@/types/proposal';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Proposal List Types
export interface ProposalListParams {
    search?: string;
    status?: string;
    page?: number;
    size?: number;
}

/**
 * Get proposals for authenticated client
 */
export async function getProposals(
    token: string,
    params: ProposalListParams = {}
): Promise<ProposalListResponse> {
    const { search, status = 'All', page = 0, size = 20 } = params;

    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (status && status !== 'All') queryParams.append('status', status);
    queryParams.append('page', page.toString());
    queryParams.append('size', size.toString());

    // Get user ID from token (decode JWT) or use stored user
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

    const url = `${API_BASE_URL}/client/proposals?${queryParams.toString()}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...(userId && { 'X-User-Id': userId.toString() }),
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to fetch proposals' }));
        throw new Error(error.message || 'Failed to fetch proposals');
    }

    return response.json();
}

