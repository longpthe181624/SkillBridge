import { ContractDetail, ChangeRequestDetail } from '@/types/contract';
import { API_BASE_URL } from '@/lib/apiConfig';

// Contract List Types
export interface ContractListParams {
  search?: string;
  status?: string;
  type?: string;
  page?: number;
  size?: number;
}

export interface ContractListItem {
  internalId: number;
  id: string;
  no: number;
  contractName: string;
  type: 'MSA' | 'SOW';
  periodStart: string | null;
  periodEnd: string | null;
  period?: string;
  value: number | null;
  formattedValue: string;
  status: string;
  closeRequestStatus?: string | null;
  closeRequestPending?: boolean;
  assignee: string | null;
  createdAt: string;
}

export interface ContractListResponse {
  contracts: ContractListItem[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

/**
 * Get contracts for authenticated client
 */
export async function getContractList(
  token: string,
  params: ContractListParams = {}
): Promise<ContractListResponse> {
  const { search, status = 'All', type, page = 0, size = 20 } = params;

  const queryParams = new URLSearchParams();
  if (search) queryParams.append('search', search);
  if (status && status !== 'All') queryParams.append('status', status);
  if (type && type !== 'All') queryParams.append('type', type);
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

  const url = `${API_BASE_URL}/client/contracts?${queryParams.toString()}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(userId && { 'X-User-Id': userId.toString() }),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch contracts' }));
    throw new Error(error.message || 'Failed to fetch contracts');
  }

  return response.json();
}

/**
 * Get contract detail for authenticated client
 */
export async function getContractDetail(
  token: string,
  contractId: number
): Promise<ContractDetail> {
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

  const url = `${API_BASE_URL}/client/contracts/${contractId}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(userId && { 'X-User-Id': userId.toString() }),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch contract detail' }));
    throw new Error(error.message || 'Failed to fetch contract detail');
  }

  return response.json();
}

/**
 * Approve contract
 */
export async function approveContract(
  token: string,
  contractId: number
): Promise<void> {
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

  const url = `${API_BASE_URL}/client/contracts/${contractId}/approve`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(userId && { 'X-User-Id': userId.toString() }),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to approve contract' }));
    throw new Error(error.message || 'Failed to approve contract');
  }

  return response.json();
}

/**
 * Add comment to contract
 */
export async function addComment(
  token: string,
  contractId: number,
  comment: string
): Promise<void> {
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

  const url = `${API_BASE_URL}/client/contracts/${contractId}/comment`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(userId && { 'X-User-Id': userId.toString() }),
    },
    body: JSON.stringify({ comment }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to add comment' }));
    throw new Error(error.message || 'Failed to add comment');
  }

  return response.json();
}

/**
 * Cancel contract
 */
export async function cancelContract(
  token: string,
  contractId: number,
  reason: string
): Promise<void> {
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

  const url = `${API_BASE_URL}/client/contracts/${contractId}/cancel`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(userId && { 'X-User-Id': userId.toString() }),
    },
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to cancel contract' }));
    throw new Error(error.message || 'Failed to cancel contract');
  }

  return response.json();
}

// Change Request Types
export interface CreateChangeRequestData {
  title: string;
  type: string;
  description: string;
  reason: string;
  desiredStartDate: string; // YYYY/MM/DD
  desiredEndDate: string; // YYYY/MM/DD
  expectedExtraCost: number;
  attachments?: File[];
}

export interface UpdateChangeRequestData {
  title?: string;
  type?: string;
  description?: string;
  reason?: string;
  desiredStartDate?: string; // YYYY/MM/DD
  desiredEndDate?: string; // YYYY/MM/DD
  expectedExtraCost?: number;
}

export interface ChangeRequestResponse {
  success: boolean;
  message: string;
  changeRequestId: number;
  changeRequestDisplayId: string;
}

/**
 * Create change request
 */
export async function createChangeRequest(
  token: string,
  contractId: number,
  data: CreateChangeRequestData
): Promise<ChangeRequestResponse> {
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

  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('type', data.type);
  formData.append('description', data.description);
  formData.append('reason', data.reason);
  formData.append('desiredStartDate', data.desiredStartDate);
  formData.append('desiredEndDate', data.desiredEndDate);
  formData.append('expectedExtraCost', data.expectedExtraCost.toString());
  
  if (data.attachments && data.attachments.length > 0) {
    data.attachments.forEach((file) => {
      formData.append('attachments', file);
    });
  }

  const url = `${API_BASE_URL}/client/contracts/${contractId}/change-requests`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      ...(userId && { 'X-User-Id': userId.toString() }),
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create change request' }));
    throw new Error(error.message || 'Failed to create change request');
  }

  return response.json();
}

/**
 * Save change request as draft
 */
export async function saveChangeRequestDraft(
  token: string,
  contractId: number,
  data: Partial<CreateChangeRequestData>
): Promise<ChangeRequestResponse> {
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

  const formData = new FormData();
  if (data.title && data.title.trim()) formData.append('title', data.title.trim());
  if (data.type && data.type.trim()) formData.append('type', data.type.trim());
  if (data.description && data.description.trim()) formData.append('description', data.description.trim());
  if (data.reason && data.reason.trim()) formData.append('reason', data.reason.trim());
  if (data.desiredStartDate && data.desiredStartDate.trim()) formData.append('desiredStartDate', data.desiredStartDate.trim());
  if (data.desiredEndDate && data.desiredEndDate.trim()) formData.append('desiredEndDate', data.desiredEndDate.trim());
  if (data.expectedExtraCost !== undefined && data.expectedExtraCost !== null) {
    formData.append('expectedExtraCost', data.expectedExtraCost.toString());
  }
  
  if (data.attachments && data.attachments.length > 0) {
    data.attachments.forEach((file) => {
      formData.append('attachments', file);
    });
  }

  const url = `${API_BASE_URL}/client/contracts/${contractId}/change-requests/draft`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      ...(userId && { 'X-User-Id': userId.toString() }),
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to save change request draft' }));
    throw new Error(error.message || 'Failed to save change request draft');
  }

  return response.json();
}

/**
 * Get change request detail
 */
export async function getChangeRequestDetail(
  token: string,
  contractId: number,
  changeRequestId: number
): Promise<ChangeRequestDetail> {
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

  const url = `${API_BASE_URL}/client/contracts/${contractId}/change-requests/${changeRequestId}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(userId && { 'X-User-Id': userId.toString() }),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to get change request detail' }));
    throw new Error(error.message || 'Failed to get change request detail');
  }

  return response.json();
}

/**
 * Update change request (Draft status only)
 */
export async function updateChangeRequest(
  token: string,
  contractId: number,
  changeRequestId: number,
  data: UpdateChangeRequestData
): Promise<void> {
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

  const url = `${API_BASE_URL}/client/contracts/${contractId}/change-requests/${changeRequestId}`;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(userId && { 'X-User-Id': userId.toString() }),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update change request' }));
    throw new Error(error.message || 'Failed to update change request');
  }
}

/**
 * Submit change request (Draft -> Under Review)
 */
export async function submitChangeRequest(
  token: string,
  contractId: number,
  changeRequestId: number
): Promise<void> {
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

  const url = `${API_BASE_URL}/client/contracts/${contractId}/change-requests/${changeRequestId}/submit`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(userId && { 'X-User-Id': userId.toString() }),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to submit change request' }));
    throw new Error(error.message || 'Failed to submit change request');
  }
}

/**
 * Approve change request (Under Review -> Active)
 */
export async function approveChangeRequest(
  token: string,
  contractId: number,
  changeRequestId: number
): Promise<void> {
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

  const url = `${API_BASE_URL}/client/contracts/${contractId}/change-requests/${changeRequestId}/approve`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(userId && { 'X-User-Id': userId.toString() }),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to approve change request' }));
    throw new Error(error.message || 'Failed to approve change request');
  }
}

/**
 * Request for change (Under Review -> Request for Change)
 */
export async function requestForChange(
  token: string,
  contractId: number,
  changeRequestId: number,
  message?: string
): Promise<void> {
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

  const url = `${API_BASE_URL}/client/contracts/${contractId}/change-requests/${changeRequestId}/request-for-change`;
  
  const body = message ? JSON.stringify({ message }) : undefined;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(userId && { 'X-User-Id': userId.toString() }),
    },
    ...(body && { body }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to request for change' }));
    throw new Error(error.message || 'Failed to request for change');
  }
}

/**
 * Terminate change request
 */
export async function terminateChangeRequest(
  token: string,
  contractId: number,
  changeRequestId: number
): Promise<void> {
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

  const url = `${API_BASE_URL}/client/contracts/${contractId}/change-requests/${changeRequestId}/terminate`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(userId && { 'X-User-Id': userId.toString() }),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to terminate change request' }));
    throw new Error(error.message || 'Failed to terminate change request');
  }
}

/**
 * Get all versions of a SOW contract for client
 */
export async function getSOWContractVersions(
  token: string,
  contractId: number
): Promise<ContractDetail[]> {
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

  const url = `${API_BASE_URL}/client/contracts/${contractId}/versions`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(userId && { 'X-User-Id': userId.toString() }),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch contract versions' }));
    throw new Error(error.message || 'Failed to fetch contract versions');
  }

  return response.json();
}

