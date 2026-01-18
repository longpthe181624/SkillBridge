import { API_BASE_URL } from '@/lib/apiConfig';

export interface PresignedUrlResponse {
  presignedUrl: string;
  s3Key: string;
  expirationMinutes: number;
}

export interface ProposalVersion {
  id: number;
  version: number;
  name: string; // e.g., "v1", "v2", "v3"
  title: string;
  createdBy: number;
  createdByName: string;
  createdAt: string;
  status: string;
  reviewerId: number | null;
  reviewerName: string | null;
  internalFeedback: string | null;
  clientFeedback: string | null;
  isCurrent: boolean;
}

export interface HistoryEntry {
  id: number;
  date: string; // Format: "YYYY/MM/DD"
  activity: string;
  fileLink: string | null;
  fileUrl: string | null;
  createdAt: string;
}

export interface OpportunityDetail {
  id: number;
  opportunityId: string; // Format: OP-YYYY-NN
  contactId: number | null;
  clientName: string;
  clientCompany: string | null;
  clientEmail: string;
  assigneeUserId: number | null;
  assigneeName: string | null;
  probability: number;
  estValue: number;
  currency: string;
  status: 'NEW' | 'PROPOSAL_DRAFTING' | 'PROPOSAL_SENT' | 'REVISION' | 'WON' | 'LOST';
  stage: 'New' | 'Proposal' | 'Won' | 'Lost';
  createdBy: number;
  createdByName?: string;
  proposal?: Proposal;
  proposalVersions?: ProposalVersion[];
  history?: HistoryEntry[];
  canConvertToContract?: boolean;
}

export interface ProposalAttachment {
  s3Key: string;
  fileName: string;
  fileSize?: number | null;
}

export interface Proposal {
  id: number;
  opportunityId: number;
  title: string;
  status: 'draft' | 'internal_review' | 'approved' | 'sent_to_client' | 'revision_requested' | 'rejected' | 'Request for Change';
  reviewerId: number | null;
  reviewerName: string | null;
  reviewNotes: string | null;
  reviewAction: 'APPROVE' | 'REQUEST_REVISION' | 'REJECT' | null;
  reviewSubmittedAt: string | null;
  link: string | null;
  attachments: (ProposalAttachment | string)[]; // Support both old format (string) and new format (ProposalAttachment)
  createdBy: number;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
  canEdit: boolean;
  clientFeedback?: string | null;
}

export interface CreateOpportunityRequest {
  clientName: string;
  clientCompany?: string;
  clientEmail: string;
  assigneeUserId: number | null;
  probability: number;
  estValue: number;
  currency?: string;
}

export interface UpdateOpportunityRequest {
  clientName?: string;
  clientCompany?: string;
  clientEmail?: string;
  assigneeUserId?: number | null;
  probability?: number;
  estValue?: number;
  currency?: string;
}

export interface AssignReviewerRequest {
  reviewerId: number;
}

export interface SubmitReviewRequest {
  reviewNotes: string;
  action: 'APPROVE' | 'REQUEST_REVISION' | 'REJECT';
}

/**
 * Create opportunity from contact
 */
export async function createOpportunityFromContact(
  contactId: number,
  request: CreateOpportunityRequest,
  token: string
): Promise<OpportunityDetail> {
  const response = await fetch(`${API_BASE_URL}/sales/opportunities/create-from-contact/${contactId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create opportunity' }));
    throw new Error(error.message || 'Failed to create opportunity');
  }

  return response.json();
}

/**
 * Get opportunity by ID
 */
export async function getOpportunityDetail(
  opportunityId: string,
  token: string
): Promise<OpportunityDetail> {
  const response = await fetch(`${API_BASE_URL}/sales/opportunities/${opportunityId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch opportunity' }));
    throw new Error(error.message || 'Failed to fetch opportunity');
  }

  return response.json();
}

/**
 * Update opportunity
 */
export async function updateOpportunity(
  opportunityId: string,
  request: UpdateOpportunityRequest,
  token: string
): Promise<OpportunityDetail> {
  const response = await fetch(`${API_BASE_URL}/sales/opportunities/${opportunityId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update opportunity' }));
    throw new Error(error.message || 'Failed to update opportunity');
  }

  return response.json();
}

/**
 * Create proposal
 */
export async function createProposal(
  opportunityId: string,
  title: string,
  files: File[],
  reviewerId: number | null,
  token: string
): Promise<Proposal> {
  const formData = new FormData();
  formData.append('title', title);
  if (reviewerId !== null) {
    formData.append('reviewerId', reviewerId.toString());
  }
  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await fetch(`${API_BASE_URL}/sales/opportunities/${opportunityId}/proposals`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create proposal' }));
    throw new Error(error.message || 'Failed to create proposal');
  }

  return response.json();
}

/**
 * Update proposal
 */
export async function updateProposal(
  proposalId: number,
  title: string | null,
  files: File[] | null,
  reviewerId: number | null,
  token: string
): Promise<Proposal> {
  const formData = new FormData();
  if (title) {
    formData.append('title', title);
  }
  if (reviewerId !== null) {
    formData.append('reviewerId', reviewerId.toString());
  }
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append('files', file);
    });
  }

  const response = await fetch(`${API_BASE_URL}/sales/opportunities/proposals/${proposalId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update proposal' }));
    throw new Error(error.message || 'Failed to update proposal');
  }

  return response.json();
}

/**
 * Assign reviewer to proposal
 */
export async function assignReviewer(
  proposalId: number,
  request: AssignReviewerRequest,
  token: string
): Promise<Proposal> {
  const response = await fetch(`${API_BASE_URL}/sales/opportunities/proposals/${proposalId}/assign-reviewer`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to assign reviewer' }));
    throw new Error(error.message || 'Failed to assign reviewer');
  }

  return response.json();
}

/**
 * Submit review
 */
export async function submitReview(
  proposalId: number,
  request: SubmitReviewRequest,
  token: string
): Promise<Proposal> {
  const response = await fetch(`${API_BASE_URL}/sales/opportunities/proposals/${proposalId}/submit-review`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to submit review' }));
    throw new Error(error.message || 'Failed to submit review');
  }

  return response.json();
}

/**
 * Get contact data for pre-population (used when creating opportunity from contact)
 */
export async function getContactDataForOpportunity(
  contactId: number,
  token: string
): Promise<{
  clientName: string;
  clientCompany: string | null;
  assigneeUserId: number | null;
  assigneeName: string | null;
  clientEmail: string;
}> {
  const response = await fetch(`${API_BASE_URL}/sales/contacts/${contactId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch contact data' }));
    throw new Error(error.message || 'Failed to fetch contact data');
  }

  const contact = await response.json();
  return {
    clientName: contact.clientName,
    clientCompany: contact.clientCompany || null,
    assigneeUserId: contact.assigneeUserId,
    assigneeName: contact.assigneeName || null,
    clientEmail: contact.email,
  };
}

/**
 * Mark opportunity as lost
 */
export async function markOpportunityAsLost(
  opportunityId: string,
  token: string
): Promise<OpportunityDetail> {
  const response = await fetch(`${API_BASE_URL}/sales/opportunities/${opportunityId}/mark-lost`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to mark opportunity as lost' }));
    throw new Error(error.message || 'Failed to mark opportunity as lost');
  }

  return response.json();
}

/**
 * Convert opportunity to contract
 */
export async function convertOpportunityToContract(
  opportunityId: string,
  token: string
): Promise<OpportunityDetail> {
  const response = await fetch(`${API_BASE_URL}/sales/opportunities/${opportunityId}/convert-to-contract`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to convert opportunity to contract' }));
    throw new Error(error.message || 'Failed to convert opportunity to contract');
  }

  return response.json();
}

/**
 * Get presigned URL for document download
 */
export async function getPresignedUrl(
  s3Key: string,
  token: string
): Promise<PresignedUrlResponse> {
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

