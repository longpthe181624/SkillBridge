import { API_BASE_URL } from '@/lib/apiConfig';
import { ContractListItem, ContractListResponse } from '@/types/contract';

export interface SalesContractListFilters {
    search?: string;
    status?: string;
    page?: number;
    size?: number;
}

/**
 * Get sales contracts list with search, filter, and pagination
 */
export async function getSalesContracts(
    filters: SalesContractListFilters,
    token: string
): Promise<ContractListResponse> {
    const params = new URLSearchParams();

    if (filters.search) {
        params.append('search', filters.search);
    }

    if (filters.status && filters.status !== 'All') {
        params.append('status', filters.status);
    }

    params.append('page', (filters.page || 0).toString());
    params.append('size', (filters.size || 20).toString());

    const response = await fetch(`${API_BASE_URL}/sales/contracts?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to fetch contracts' }));
        throw new Error(error.message || 'Failed to fetch contracts');
    }

    return response.json();
}

