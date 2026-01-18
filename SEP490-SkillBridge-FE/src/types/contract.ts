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
  // Project Close Request indicators (optional, backend may add later)
  closeRequestStatus?: string | null;
  closeRequestPending?: boolean;
  assignee: string | null;
  clientName?: string;
  clientEmail?: string;
  assigneeName?: string;
  createdAt: string;
  attachments?: string[]; // List of attachment S3 keys
}

export interface ContractListResponse {
    contracts: ContractListItem[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
}

// Contract Detail Types
export interface ContractDetail {
  internalId: number;
  id: string;
  contractType: 'MSA' | 'SOW';
  contractName: string;
  effectiveStart: string | null;
  effectiveEnd: string | null;
  status: string;
  value?: number | null;
  currency: string | null;
  paymentTerms: string | null;
  invoicingCycle: string | null;
  billingDay: string | null;
  taxWithholding: string | null;
  ipOwnership: string | null;
  governingLaw: string | null;
  clientContact: {
    name: string;
    email: string;
  };
  landbridgeContact: {
    name: string;
    email: string;
  };
  // SOW specific fields
  engagementType?: 'Fixed Price' | 'Retainer';
  parentMSA?: {
    id: string;
    status: string;
  };
  projectName?: string;
  scopeSummary?: string | null;
  // Fixed Price SOW fields
  milestones?: MilestoneDeliverable[];
  billingDetails?: FixedPriceBillingDetail[];
  // Retainer SOW fields
  deliveryItems?: DeliveryItem[];
  retainerBillingDetails?: RetainerBillingDetail[];
  engagedEngineers?: EngagedEngineer[];
  // Change Requests (common for both)
  changeRequests?: ChangeRequest[];
  // Attachments
  attachments?: Array<{
    s3Key: string;
    fileName: string;
    fileSize?: number | null;
  }>;
  // History
  history: ContractHistoryItem[];
}

export interface ContractHistoryItem {
    id: number;
    date: string;
    description: string;
    documentLink: string | null;
    documentName: string | null;
    createdBy: string | null;
}

// SOW specific types
export interface MilestoneDeliverable {
    id: number;
    milestone: string;
    deliveryNote: string;
    acceptanceCriteria: string;
    plannedEnd: string;
    paymentPercentage: string;
}

export interface FixedPriceBillingDetail {
    id: number;
    billingName: string;
    milestone: string | null;
    amount: string;
    percentage: string | null;
    invoiceDate: string;
}

export interface DeliveryItem {
    id: number;
    milestone: string;
    deliveryNote: string;
    amount: string;
    paymentDate: string;
}

export interface RetainerBillingDetail {
    id: number;
    paymentDate: string;
    deliveryNote: string;
    amount: string;
}

export interface ChangeRequest {
  id: number;
  changeRequestId: string;
  type: string;
  summary: string;
  plannedEnd?: string | null;
  effectiveFrom?: string | null;
  effectiveUntil?: string | null;
  amount: string;
  expectedExtraCost?: string | null;
  costEstimatedByLandbridge?: string | null;
  status: string;
}

export interface ChangeRequestDetail {
  id: number;
  changeRequestId: string;
  title: string;
  type: string;
  description: string;
  reason: string;
  status: string;
  createdBy: string;
  createdDate: string;
  desiredStartDate: string;
  desiredEndDate: string;
  expectedExtraCost: string;
  evidence: EvidenceItem[];
  attachments: AttachmentItem[];
  history: HistoryItem[];
  impactAnalysis: ImpactAnalysis;
  internalReviewerName?: string;
  reviewNotes?: string;
}

export interface EvidenceItem {
    type: 'link' | 'file';
    value: string;
}

export interface AttachmentItem {
    id: number;
    fileName: string;
    filePath: string;
    fileSize: number;
    uploadedAt: string;
}

export interface HistoryItem {
    id: number;
    action: string;
    userName: string;
    timestamp: string;
}

export interface ImpactAnalysis {
    // Fixed Price fields
    devHours?: number | null;
    testHours?: number | null;
    newEndDate?: string | null;
    delayDuration?: number | null;
    additionalCost?: string | null;
    // Retainer fields
    engagedEngineers?: EngagedEngineer[];
    billingDetails?: BillingDetail[];
}

export interface EngagedEngineer {
  id?: number;
  engineerLevel: string;
  startDate: string;
  endDate: string;
  rating: string | number;
  salary: string | number;
}

export interface BillingDetail {
  paymentDate: string;
  deliveryNote: string;
  amount: string;
}

