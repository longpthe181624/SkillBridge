export interface ContactListItem {
  no: number;
  internalId: number; // Internal database ID for navigation
  id: string; // Format: CT-YYYY-NN
  title: string;
  description: string;
  createdOn: string; // Format: YYYY/MM/DD
  status: 'New' | 'Converted to Opportunity' | 'Closed';
}

export interface ContactListResponse {
  contacts: ContactListItem[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

// Contact Detail Types
export interface CommunicationLog {
  id: number;
  message: string;
  createdAt: string;
  createdBy: number;
  createdByName?: string;
}

export interface ContactProposalAttachment {
  s3Key: string;
  fileName: string;
  fileSize?: number | null;
}

export interface ContactProposal {
  id: number;
  version: number;
  title: string;
  status: string; // Backend status: sent_to_client, revision_requested, approved, etc.
  proposalLink: string | null;
  proposalApprovedAt?: string | null; // Format: YYYY/MM/DD HH:MM
  createdAt: string; // Format: YYYY/MM/DD HH:MM
  isCurrent: boolean;
  clientFeedback?: string | null;
  attachments?: ContactProposalAttachment[]; // List of attachments with s3Key and fileName
}

export interface ContactDetail {
  id: string; // Format: CC-YYYY-NN
  contactId: number;
  clientName: string;
  phone: string;
  email: string;
  clientCompany: string | null;
  dateReceived: string;
  consultationRequest: string;
  onlineMtgDate: string | null;
  onlineMtgLink: string | null;
  status: 'New' | 'Converted to Opportunity' | 'Closed' | 'Cancelled';
  proposalLink: string | null; // Deprecated: Use proposals array
  proposalStatus: 'Pending' | 'Approved' | 'Commented' | 'Request for Change'; // Deprecated: Use proposals array
  proposalApprovedAt?: string | null; // Format: YYYY/MM/DD HH:MM (Deprecated: Use proposals array)
  proposalComment?: {
    message: string;
    createdAt: string; // Format: YYYY/MM/DD HH:MM
  } | null;
  proposals?: ContactProposal[]; // List of all proposals
  communicationLogs: CommunicationLog[];
}

