import { API_BASE_URL } from '@/lib/apiConfig';

export interface CreateMSAFormData {
  opportunityId?: string | null;
  clientId: number | null;
  clientName?: string;
  effectiveStart: string | null; // Format: YYYY-MM-DD
  effectiveEnd: string | null; // Format: YYYY-MM-DD
  status: string;
  assigneeUserId: number | null;
  note?: string;
  currency: string;
  paymentTerms: string;
  invoicingCycle: string;
  billingDay: string;
  taxWithholding: string;
  ipOwnership: string;
  governingLaw: string;
  clientContactId: number | null;
  landbridgeContactId: number | null;
  attachments?: File[];
  reviewerId?: number | null;
  reviewNotes?: string;
  reviewAction?: string | null;
}

export interface MSAContractResponse {
  id: number;
  contractId: string;
  contractName: string;
  status: string;
}

export interface Opportunity {
  id: number;
  opportunityId: string; // Format: OP-YYYY-NN
  clientName: string;
  clientEmail?: string;
  clientId: number;
  status: string;
}

export interface SalesUser {
  id: number;
  fullName: string;
  email: string;
  role: 'SALES_MANAGER' | 'SALES_REP';
}

export interface ClientUser {
  id: number;
  fullName: string;
  email: string;
}

/**
 * Get opportunities with approved proposals
 */
export async function getApprovedOpportunities(token: string): Promise<Opportunity[]> {
  const response = await fetch(`${API_BASE_URL}/sales/opportunities?status=WON`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch opportunities');
  }

  const data = await response.json();
  // Filter opportunities that have approved proposals
  // Note: This filtering might need to be done on backend
  return data.opportunities || [];
}

/**
 * Get opportunity details by opportunityId (display ID like OP-2025-07)
 */
export async function getOpportunityDetails(opportunityId: string, token: string): Promise<Opportunity> {
  const response = await fetch(`${API_BASE_URL}/sales/opportunities/${encodeURIComponent(opportunityId)}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch opportunity details');
  }

  const data = await response.json();
  // Map OpportunityDetailDTO to Opportunity format
  // Note: clientId will be found from clientEmail in frontend
  return {
    id: data.id,
    opportunityId: data.opportunityId,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    clientId: 0, // Will be found from clientEmail
    status: data.status,
  };
}

/**
 * Get sales users (for Assignee and LandBridge Contact)
 */
export async function getSalesUsers(token: string): Promise<SalesUser[]> {
  const response = await fetch(`${API_BASE_URL}/sales/contacts/users`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch sales users');
  }

  return response.json();
}

/**
 * Get client users (for Client Contact)
 */
export async function getClientUsers(token: string): Promise<ClientUser[]> {
  const response = await fetch(`${API_BASE_URL}/sales/contacts/clients`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to fetch client users:', response.status, errorText);
    throw new Error(`Failed to fetch client users: ${response.status}`);
  }

  const users = await response.json();
  console.log('Client users response:', users);
  
  // Handle both array and object responses
  const usersArray = Array.isArray(users) ? users : [];
  
  // Map to ClientUser format
  return usersArray.map((u: any) => ({
    id: u.id,
    fullName: u.fullName || '',
    email: u.email || '',
  }));
}

/**
 * Create MSA contract
 */
export async function createMSAContract(
  formData: CreateMSAFormData,
  token: string
): Promise<MSAContractResponse> {
  const formDataToSend = new FormData();
  
  if (formData.opportunityId) {
    formDataToSend.append('opportunityId', formData.opportunityId);
  }
  if (formData.clientId) {
    formDataToSend.append('clientId', formData.clientId.toString());
  }
  if (formData.effectiveStart) {
    formDataToSend.append('effectiveStart', formData.effectiveStart);
  }
  if (formData.effectiveEnd) {
    formDataToSend.append('effectiveEnd', formData.effectiveEnd);
  }
  formDataToSend.append('status', formData.status);
  if (formData.assigneeUserId) {
    formDataToSend.append('assigneeUserId', formData.assigneeUserId.toString());
  }
  if (formData.note) {
    formDataToSend.append('note', formData.note);
  }
  formDataToSend.append('currency', formData.currency);
  formDataToSend.append('paymentTerms', formData.paymentTerms);
  formDataToSend.append('invoicingCycle', formData.invoicingCycle);
  formDataToSend.append('billingDay', formData.billingDay);
  formDataToSend.append('taxWithholding', formData.taxWithholding);
  formDataToSend.append('ipOwnership', formData.ipOwnership);
  formDataToSend.append('governingLaw', formData.governingLaw);
  if (formData.clientContactId) {
    formDataToSend.append('clientContactId', formData.clientContactId.toString());
  }
  if (formData.landbridgeContactId) {
    formDataToSend.append('landbridgeContactId', formData.landbridgeContactId.toString());
  }
  if (formData.reviewerId) {
    formDataToSend.append('reviewerId', formData.reviewerId.toString());
  }
  if (formData.reviewNotes) {
    formDataToSend.append('reviewNotes', formData.reviewNotes);
  }
  if (formData.reviewAction) {
    formDataToSend.append('reviewAction', formData.reviewAction);
  }
  
  // Append attachments
  if (formData.attachments && formData.attachments.length > 0) {
    formData.attachments.forEach((file) => {
      formDataToSend.append('attachments', file);
    });
  }

  const response = await fetch(`${API_BASE_URL}/sales/contracts/msa`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formDataToSend,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create MSA contract' }));
    throw new Error(error.message || 'Failed to create MSA contract');
  }

  return response.json();
}

/**
 * Submit review
 */
export async function submitReview(
  contractId: number,
  reviewNotes: string,
  action: string,
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/sales/contracts/msa/${contractId}/review`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reviewNotes, action }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to submit review' }));
    throw new Error(error.message || 'Failed to submit review');
  }
}

/**
 * Get MSA contract detail
 */
export interface MSAContractDetail {
  id: number;
  contractId: string;
  contractName: string;
  status: string;
  opportunityId?: string | null;
  clientId: number;
  clientName: string;
  clientEmail?: string;
  effectiveStart: string | null;
  effectiveEnd: string | null;
  assigneeUserId: number | null;
  assigneeName?: string;
  note?: string;
  currency: string;
  paymentTerms: string;
  invoicingCycle: string;
  billingDay: string;
  taxWithholding: string;
  ipOwnership: string;
  governingLaw: string;
  clientContactId: number | null;
  clientContactName?: string;
  clientContactEmail?: string;
  landbridgeContactId: number | null;
  landbridgeContactName?: string;
  landbridgeContactEmail?: string;
  attachments?: Array<{
    s3Key: string;
    fileName: string;
    fileSize?: number | null;
  }>;
  reviewerId?: number | null;
  reviewerName?: string;
  reviewNotes?: string;
  reviewAction?: string;
  history?: Array<{
    id: number;
    date: string;
    description: string;
    documentLink?: string | null;
    documentName?: string | null;
  }>;
}

export async function getMSAContractDetail(
  contractId: number,
  token: string
): Promise<MSAContractDetail> {
  const response = await fetch(`${API_BASE_URL}/sales/contracts/msa/${contractId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch contract detail' }));
    throw new Error(error.message || 'Failed to fetch contract detail');
  }

  return response.json();
}

/**
 * Update MSA contract
 */
export async function updateMSAContract(
  contractId: number,
  formData: CreateMSAFormData,
  token: string
): Promise<MSAContractResponse> {
  const formDataToSend = new FormData();
  
  if (formData.opportunityId) {
    formDataToSend.append('opportunityId', formData.opportunityId);
  }
  if (formData.clientId) {
    formDataToSend.append('clientId', formData.clientId.toString());
  }
  if (formData.effectiveStart) {
    formDataToSend.append('effectiveStart', formData.effectiveStart);
  }
  if (formData.effectiveEnd) {
    formDataToSend.append('effectiveEnd', formData.effectiveEnd);
  }
  formDataToSend.append('status', formData.status);
  if (formData.assigneeUserId) {
    formDataToSend.append('assigneeUserId', formData.assigneeUserId.toString());
  }
  if (formData.note) {
    formDataToSend.append('note', formData.note);
  }
  formDataToSend.append('currency', formData.currency);
  formDataToSend.append('paymentTerms', formData.paymentTerms);
  formDataToSend.append('invoicingCycle', formData.invoicingCycle);
  formDataToSend.append('billingDay', formData.billingDay);
  formDataToSend.append('taxWithholding', formData.taxWithholding);
  formDataToSend.append('ipOwnership', formData.ipOwnership);
  formDataToSend.append('governingLaw', formData.governingLaw);
  if (formData.clientContactId) {
    formDataToSend.append('clientContactId', formData.clientContactId.toString());
  }
  if (formData.landbridgeContactId) {
    formDataToSend.append('landbridgeContactId', formData.landbridgeContactId.toString());
  }
  if (formData.reviewerId) {
    formDataToSend.append('reviewerId', formData.reviewerId.toString());
  }
  if (formData.reviewNotes) {
    formDataToSend.append('reviewNotes', formData.reviewNotes);
  }
  if (formData.reviewAction) {
    formDataToSend.append('reviewAction', formData.reviewAction);
  }
  
  // Append attachments
  if (formData.attachments && formData.attachments.length > 0) {
    formData.attachments.forEach((file) => {
      formDataToSend.append('attachments', file);
    });
  }

  const response = await fetch(`${API_BASE_URL}/sales/contracts/msa/${contractId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formDataToSend,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update MSA contract' }));
    throw new Error(error.message || 'Failed to update MSA contract');
  }

  return response.json();
}

/**
 * Delete attachment from MSA contract
 */
export async function deleteMSAAttachment(
  contractId: number,
  s3Key: string,
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/sales/contracts/msa/${contractId}/attachments?s3Key=${encodeURIComponent(s3Key)}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to delete attachment' }));
    throw new Error(error.message || 'Failed to delete attachment');
  }
}

/**
 * Get presigned URL for document download
 */
export async function getPresignedUrl(
  s3Key: string,
  token: string
): Promise<{ presignedUrl: string; s3Key: string; expirationMinutes: number }> {
  const response = await fetch(`${API_BASE_URL}/sales/documents/presigned-url?s3Key=${encodeURIComponent(s3Key)}`, {
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

// Create Change Request interfaces and functions for MSA
export interface CreateMSAChangeRequestFormData {
  title: string;
  type: 'Add Scope' | 'Remove Scope' | 'Other';
  summary: string;
  effectiveFrom: string; // Format: YYYY-MM-DD
  effectiveUntil: string; // Format: YYYY-MM-DD
  references?: string;
  attachments?: File[];
  engagedEngineers: Array<{
    engineerLevel: string;
    startDate: string; // Format: YYYY-MM-DD
    endDate: string; // Format: YYYY-MM-DD
    rating: number; // Percentage (0-100)
    salary: number; // Currency amount
  }>;
  billingDetails: Array<{
    paymentDate: string; // Format: YYYY-MM-DD
    deliveryNote: string;
    amount: number; // Currency amount
  }>;
  internalReviewerId: number;
  comment?: string;
  action: 'save' | 'submit';
}

export interface MSAChangeRequestResponse {
  id: number;
  changeRequestId: string;
  success: boolean;
  message: string;
}

/**
 * Create change request for Fixed Price MSA contract
 */
export async function createChangeRequestForMSA(
  msaContractId: number,
  formData: CreateMSAChangeRequestFormData,
  token: string
): Promise<MSAChangeRequestResponse> {
  const formDataToSend = new FormData();
  
  formDataToSend.append('title', formData.title);
  formDataToSend.append('type', formData.type);
  formDataToSend.append('summary', formData.summary);
  formDataToSend.append('effectiveFrom', formData.effectiveFrom);
  formDataToSend.append('effectiveUntil', formData.effectiveUntil);
  
  if (formData.references) {
    formDataToSend.append('references', formData.references);
  }
  
  // Append engaged engineers as JSON string
  if (formData.engagedEngineers && formData.engagedEngineers.length > 0) {
    formDataToSend.append('engagedEngineers', JSON.stringify(formData.engagedEngineers));
  } else {
    formDataToSend.append('engagedEngineers', JSON.stringify([]));
  }
  
  // Append billing details as JSON string
  if (formData.billingDetails && formData.billingDetails.length > 0) {
    formDataToSend.append('billingDetails', JSON.stringify(formData.billingDetails));
  } else {
    formDataToSend.append('billingDetails', JSON.stringify([]));
  }
  
  formDataToSend.append('internalReviewerId', formData.internalReviewerId.toString());
  
  if (formData.comment) {
    formDataToSend.append('comment', formData.comment);
  }
  
  formDataToSend.append('action', formData.action);
  
  // Append attachments
  if (formData.attachments && formData.attachments.length > 0) {
    for (const file of formData.attachments) {
      formDataToSend.append('attachments', file);
    }
  }
  
  const response = await fetch(`${API_BASE_URL}/sales/contracts/msa/${msaContractId}/change-requests`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formDataToSend,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    let error;
    try {
      error = JSON.parse(errorText);
    } catch {
      error = { message: errorText || 'Failed to create change request' };
    }
    throw new Error(error.message || 'Failed to create change request');
  }
  
  return response.json();
}

// Change Request Detail interface
export interface SalesChangeRequestDetail {
  id: number;
  changeRequestId: string;
  title: string;
  type: string;
  summary: string;
  effectiveFrom: string;
  effectiveUntil: string;
  references?: string;
  status: string;
  createdBy: string;
  createdById?: number;
  createdDate: string;
  engagedEngineers: Array<{
    id?: number;
    engineerLevel: string;
    startDate: string;
    endDate: string;
    billingType?: string; // "Monthly" or "Hourly"
    hourlyRate?: number; // For hourly billing
    hours?: number; // For hourly billing
    subtotal?: number; // For hourly billing: hourlyRate * hours
    rating: number; // Percentage (0-100) for Monthly, Hourly rate for Hourly
    salary: number; // Currency amount (for monthly) or subtotal (for hourly)
  }>;
  billingDetails: Array<{
    id?: number;
    paymentDate: string;
    deliveryNote: string;
    amount: number;
  }>;
  attachments: Array<{
    id: number;
    fileName: string;
    filePath: string;
    fileSize?: number;
  }>;
  history: Array<{
    id: number;
    date: string;
    description: string;
    user: string;
    documentLink?: string;
  }>;
  internalReviewerId?: number;
  internalReviewerName?: string;
  reviewNotes?: string;
  reviewAction?: string;
  reviewDate?: string;
  comment?: string;
}

/**
 * Get change request detail for MSA
 */
export async function getChangeRequestDetailForMSA(
  msaContractId: number,
  changeRequestId: number,
  token: string
): Promise<SalesChangeRequestDetail> {
  const response = await fetch(`${API_BASE_URL}/sales/contracts/msa/${msaContractId}/change-requests/${changeRequestId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    let error;
    try {
      error = JSON.parse(errorText);
    } catch {
      error = { message: errorText || 'Failed to get change request detail' };
    }
    throw new Error(error.message || 'Failed to get change request detail');
  }
  
  return response.json();
}

/**
 * Update change request for MSA (Draft only)
 */
export async function updateChangeRequestForMSA(
  msaContractId: number,
  changeRequestId: number,
  formData: CreateMSAChangeRequestFormData,
  token: string
): Promise<void> {
  const formDataToSend = new FormData();
  
  formDataToSend.append('title', formData.title);
  formDataToSend.append('type', formData.type);
  formDataToSend.append('summary', formData.summary);
  formDataToSend.append('effectiveFrom', formData.effectiveFrom);
  formDataToSend.append('effectiveUntil', formData.effectiveUntil);
  
  if (formData.references) {
    formDataToSend.append('references', formData.references);
  }
  
  if (formData.engagedEngineers && formData.engagedEngineers.length > 0) {
    formDataToSend.append('engagedEngineers', JSON.stringify(formData.engagedEngineers));
  } else {
    formDataToSend.append('engagedEngineers', JSON.stringify([]));
  }
  
  if (formData.billingDetails && formData.billingDetails.length > 0) {
    formDataToSend.append('billingDetails', JSON.stringify(formData.billingDetails));
  } else {
    formDataToSend.append('billingDetails', JSON.stringify([]));
  }
  
  if (formData.internalReviewerId) {
    formDataToSend.append('internalReviewerId', formData.internalReviewerId.toString());
  }
  
  if (formData.comment) {
    formDataToSend.append('comment', formData.comment);
  }
  
  if (formData.attachments && formData.attachments.length > 0) {
    for (const file of formData.attachments) {
      formDataToSend.append('attachments', file);
    }
  }
  
  const response = await fetch(`${API_BASE_URL}/sales/contracts/msa/${msaContractId}/change-requests/${changeRequestId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formDataToSend,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    let error;
    try {
      error = JSON.parse(errorText);
    } catch {
      error = { message: errorText || 'Failed to update change request' };
    }
    throw new Error(error.message || 'Failed to update change request');
  }
}

/**
 * Submit change request for MSA
 */
export async function submitChangeRequestForMSA(
  msaContractId: number,
  changeRequestId: number,
  internalReviewerId: number,
  token: string
): Promise<void> {
  const formData = new FormData();
  formData.append('internalReviewerId', internalReviewerId.toString());
  
  const response = await fetch(`${API_BASE_URL}/sales/contracts/msa/${msaContractId}/change-requests/${changeRequestId}/submit`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    let error;
    try {
      error = JSON.parse(errorText);
    } catch {
      error = { message: errorText || 'Failed to submit change request' };
    }
    throw new Error(error.message || 'Failed to submit change request');
  }
}

/**
 * Submit review for change request
 */
export async function submitChangeRequestReviewForMSA(
  msaContractId: number,
  changeRequestId: number,
  reviewAction: 'APPROVE' | 'REQUEST_REVISION',
  reviewNotes: string,
  token: string
): Promise<void> {
  const formData = new FormData();
  formData.append('reviewAction', reviewAction);
  if (reviewNotes) {
    formData.append('reviewNotes', reviewNotes);
  }
  
  const response = await fetch(`${API_BASE_URL}/sales/contracts/msa/${msaContractId}/change-requests/${changeRequestId}/review`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    let error;
    try {
      error = JSON.parse(errorText);
    } catch {
      error = { message: errorText || 'Failed to submit review' };
    }
    throw new Error(error.message || 'Failed to submit review');
  }
}

