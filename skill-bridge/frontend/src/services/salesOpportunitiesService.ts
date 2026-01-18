import { API_BASE_URL } from '@/lib/apiConfig';

export interface Opportunity {
  id: number;
  opportunityId: string; // Format: OP-YYYY-NN
  estValue: number;
  currency: string;
  probability: number;
  clientEmail: string;
  clientName: string;
  status: 'NEW' | 'IN_PROGRESS' | 'PROPOSAL_DRAFTING' | 'PROPOSAL_SENT' | 'REVISION' | 'WON' | 'LOST';
  assigneeUserId: number | null;
  assigneeName: string | null;
  createdBy: number;
  createdByName?: string;
}

export interface OpportunitiesListResponse {
  opportunities: Opportunity[];
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
}

export interface OpportunitiesListFilters {
  search?: string;
  status?: string[];
  assigneeUserId?: number;
  createdBy?: number;
  page?: number;
  size?: number;
}

/**
 * Get sales opportunities list with search, filter, and pagination
 */
export async function getSalesOpportunities(
  filters: OpportunitiesListFilters,
  token: string
): Promise<OpportunitiesListResponse> {
  const params = new URLSearchParams();
  
  if (filters.search) {
    params.append('search', filters.search);
  }
  
  if (filters.status && filters.status.length > 0) {
    filters.status.forEach(status => params.append('status', status));
  }
  
  if (filters.assigneeUserId) {
    params.append('assigneeUserId', filters.assigneeUserId.toString());
  }
  
  if (filters.createdBy) {
    params.append('createdBy', filters.createdBy.toString());
  }
  
  params.append('page', (filters.page || 0).toString());
  params.append('size', (filters.size || 20).toString());

  const response = await fetch(`${API_BASE_URL}/sales/opportunities?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch opportunities');
  }

  return response.json();
}

