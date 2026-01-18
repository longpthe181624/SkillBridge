import { ContactListResponse, ContactDetail } from '@/types/contact';
import { API_BASE_URL } from '@/lib/apiConfig';

// Contact Form Types
export interface ContactFormData {
  name: string;
  companyName: string;
  phone: string;
  email: string;
  title: string;
  message: string;
}

export interface ContactSubmissionResponse {
  success: boolean;
  message: string;
}

// Contact List Types
export interface ContactListParams {
  search?: string;
  status?: string;
  page?: number;
  size?: number;
}

/**
 * Submit contact form (for guests)
 */
export async function submitContactForm(
  formData: ContactFormData
): Promise<ContactSubmissionResponse> {
  const url = `${API_BASE_URL}/public/contact/submit`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ 
      message: 'Failed to submit contact form' 
    }));
    throw new Error(error.message || 'Failed to submit contact form');
  }

  return response.json();
}

/**
 * Get contacts for authenticated client
 */
export async function getContacts(
  token: string,
  params: ContactListParams = {}
): Promise<ContactListResponse> {
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

  const url = `${API_BASE_URL}/client/contacts?${queryParams.toString()}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(userId && { 'X-User-Id': userId.toString() }),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch contacts' }));
    throw new Error(error.message || 'Failed to fetch contacts');
  }

  return response.json();
}

/**
 * Create a new contact for authenticated client
 */
export interface CreateContactRequest {
  title: string;
  description: string;
}

export interface CreateContactResponse {
  success: boolean;
  message: string;
  contactId: number;
}

export async function createContact(
  token: string,
  request: CreateContactRequest
): Promise<CreateContactResponse> {
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

  const url = `${API_BASE_URL}/client/contacts`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(userId && { 'X-User-Id': userId.toString() }),
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create contact' }));
    throw new Error(error.message || 'Failed to create contact');
  }

  return response.json();
}

/**
 * Get contact detail by ID
 */
export async function getContactDetail(
  token: string,
  contactId: number
): Promise<ContactDetail> {
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

  const url = `${API_BASE_URL}/client/contacts/${contactId}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(userId && { 'X-User-Id': userId.toString() }),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch contact detail' }));
    throw new Error(error.message || 'Failed to fetch contact detail');
  }

  return response.json();
}

/**
 * Add communication log
 */
export interface AddLogRequest {
  message: string;
}

export interface CommunicationLogResponse {
  id: number;
  message: string;
  createdAt: string;
  createdBy: number;
  createdByName?: string;
}

export async function addCommunicationLog(
  token: string,
  contactId: number,
  request: AddLogRequest
): Promise<CommunicationLogResponse> {
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

  const url = `${API_BASE_URL}/client/contacts/${contactId}/logs`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(userId && { 'X-User-Id': userId.toString() }),
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to add communication log' }));
    throw new Error(error.message || 'Failed to add communication log');
  }

  return response.json();
}

/**
 * Add proposal comment
 */
export interface CommentRequest {
  message: string;
}

export interface CommentResponse {
  success: boolean;
  message: string;
  commentId: number;
}

export async function addProposalComment(
  token: string,
  contactId: number,
  request: CommentRequest
): Promise<CommentResponse> {
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

  const url = `${API_BASE_URL}/client/contacts/${contactId}/proposal/comment`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(userId && { 'X-User-Id': userId.toString() }),
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to add comment' }));
    throw new Error(error.message || 'Failed to add comment');
  }

  return response.json();
}

/**
 * Cancel consultation
 */
export interface CancelRequest {
  reason: string;
}

export interface CancelResponse {
  success: boolean;
  message: string;
}

export async function cancelConsultation(
  token: string,
  contactId: number,
  request: CancelRequest
): Promise<CancelResponse> {
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

  const url = `${API_BASE_URL}/client/contacts/${contactId}/cancel`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(userId && { 'X-User-Id': userId.toString() }),
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to cancel consultation' }));
    throw new Error(error.message || 'Failed to cancel consultation');
  }

  return response.json();
}

/**
 * Approve proposal
 */
export interface ApproveResponse {
  success: boolean;
  message: string;
}

export async function approveProposal(
  token: string,
  contactId: number
): Promise<ApproveResponse> {
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

  const url = `${API_BASE_URL}/client/contacts/${contactId}/proposal/approve`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(userId && { 'X-User-Id': userId.toString() }),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to approve proposal' }));
    throw new Error(error.message || 'Failed to approve proposal');
  }

  return response.json();
}

/**
 * Get presigned URL for document download (for client users)
 */
export interface PresignedUrlResponse {
  presignedUrl: string;
  s3Key: string;
  expirationMinutes: number;
}

export async function getPresignedUrl(
  s3Key: string,
  token: string
): Promise<PresignedUrlResponse> {
  const response = await fetch(`${API_BASE_URL}/client/documents/presigned-url?s3Key=${encodeURIComponent(s3Key)}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to get presigned URL' }));
    throw new Error(error.message || 'Failed to get presigned URL');
  }

  return response.json();
}