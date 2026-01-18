import { API_BASE_URL } from '@/lib/apiConfig';

export interface SalesContact {
  no: number;
  contactId: string; // Format: CT-YYYY-NN
  clientName: string;
  clientEmail: string;
  company: string;
  title: string;
  status: 'NEW' | 'INPROGRESS' | 'COMPLETED' | 'CLOSED' | 'CONVERTED_TO_OPPORTUNITY';
  assigneeUserId: number | null;
  assigneeName: string | null;
  internalId: number; // Database ID for navigation
}

export interface SalesContactListResponse {
  contacts: SalesContact[];
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
}

export interface SalesContactListFilters {
  search?: string;
  status?: string[];
  assigneeUserId?: number;
  page?: number;
  size?: number;
}

/**
 * Get sales contacts list with search, filter, and pagination
 */
export async function getSalesContacts(
  filters: SalesContactListFilters,
  token: string
): Promise<SalesContactListResponse> {
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
  
  params.append('page', (filters.page || 0).toString());
  params.append('size', (filters.size || 20).toString());

  const response = await fetch(`${API_BASE_URL}/sales/contacts?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch contacts');
  }

  return response.json();
}

