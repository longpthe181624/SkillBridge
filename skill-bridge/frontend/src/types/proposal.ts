// Proposal List Types
export interface ProposalListItem {
  no: number;
  internalId: number; // Primary key for navigation
  id: string; // Format: P-YYYY-NN
  contactId: string; // Format: CT-YYYY-NN
  contactInternalId: number; // Contact primary key for navigation
  contactDescription: string;
  createdOn: string; // Format: YYYY/MM/DD
  status: 'Under review' | 'Request for change' | 'Approved';
  lastUpdated: string; // Format: YYYY/MM/DD
}

export interface ProposalListResponse {
  proposals: ProposalListItem[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

