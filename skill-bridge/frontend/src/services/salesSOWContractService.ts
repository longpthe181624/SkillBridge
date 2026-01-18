import { API_BASE_URL } from '@/lib/apiConfig';

export interface MSAContract {
  id: number;
  contractId: string; // Format: MSA-YYYY-NN
  contractName: string;
  status: string;
}

export interface SalesUser {
  id: number;
  fullName: string;
  email: string;
  role: 'SALES_MANAGER' | 'SALES_REP';
}

export interface DeliveryItem {
  milestone: string;
  deliveryNote: string;
  amount: number;
  paymentDate: string; // Format: YYYY-MM-DD
}

export interface EngagedEngineer {
  id?: number;
  engineerLevel: string;
  startDate: string; // Format: YYYY-MM-DD
  endDate: string; // Format: YYYY-MM-DD
  billingType?: string; // "Monthly" or "Hourly"
  hourlyRate?: number; // For hourly billing
  hours?: number; // For hourly billing
  subtotal?: number; // For hourly billing: hourlyRate * hours
  rating: number; // Percentage (0-100) for Monthly, Hourly rate for Hourly
  salary: number; // Currency amount (for monthly) or subtotal (for hourly)
}

export interface MilestoneDeliverable {
  milestone: string;
  deliveryNote: string;
  acceptanceCriteria: string;
  plannedEnd: string; // Format: YYYY-MM-DD
  paymentPercentage: number;
}

export interface BillingDetail {
  billingName?: string; // For Fixed Price
  milestone?: string; // For Fixed Price
  paymentDate: string; // Format: YYYY-MM-DD
  deliveryNote: string;
  amount: number;
  percentage?: number; // For Fixed Price
}

export interface CreateSOWFormData {
  msaId: string | null;
  clientId: number | null;
  clientName?: string;
  engagementType: 'Fixed Price' | 'Retainer';
  effectiveStart: string | null; // Format: YYYY-MM-DD
  effectiveEnd: string | null; // Format: YYYY-MM-DD
  status: string;
  assigneeUserId: number | null;
  note?: string;
  scopeSummary?: string;
  projectName?: string;
  contractValue?: number; // Total contract value for Fixed Price
  deliveryItems: DeliveryItem[]; // For Retainer (deprecated, use engagedEngineers instead)
  engagedEngineers: EngagedEngineer[]; // For Retainer
  milestoneDeliverables: MilestoneDeliverable[]; // For Fixed Price
  billingDetails: BillingDetail[];
  attachments?: File[];
  reviewerId?: number | null;
  reviewNotes?: string;
  reviewAction?: string | null;
}

export interface SOWContractResponse {
  id: number;
  contractId: string;
  contractName: string;
  status: string;
}

/**
 * Get active MSA contracts (for SOW creation)
 */
export async function getActiveMSAContracts(token: string): Promise<MSAContract[]> {
  const response = await fetch(`${API_BASE_URL}/sales/contracts/msa/active`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch active MSA contracts');
  }

  return response.json();
}

/**
 * Get MSA details to auto-populate client
 */
export async function getMSADetails(msaId: string, token: string): Promise<any> {
  // Parse MSA ID to get internal ID
  // Format: MSA-YYYY-NN
  // We need to find the contract by matching the generated contractId
  // For now, we'll use the active MSA contracts list to find the matching one
  const activeMSAs = await getActiveMSAContracts(token);
  const msa = activeMSAs.find(m => m.contractId === msaId);
  
  if (!msa) {
    throw new Error('MSA contract not found');
  }
  
  // Fetch full details using internal ID
  const response = await fetch(`${API_BASE_URL}/sales/contracts/msa/${msa.id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch MSA details');
  }

  return response.json();
}

/**
 * Get sales users (for Assignee)
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
 * Create SOW contract
 */
export async function createSOWContract(
  formData: CreateSOWFormData,
  token: string
): Promise<SOWContractResponse> {
  const formDataToSend = new FormData();
  
  if (formData.msaId) {
    formDataToSend.append('msaId', formData.msaId);
  }
  if (formData.clientId) {
    formDataToSend.append('clientId', formData.clientId.toString());
  }
  formDataToSend.append('engagementType', formData.engagementType);
  if (formData.effectiveStart) {
    formDataToSend.append('effectiveStart', formData.effectiveStart);
  }
  if (formData.effectiveEnd) {
    formDataToSend.append('effectiveEnd', formData.effectiveEnd);
  }
  formDataToSend.append('status', formData.status);
  if (formData.assigneeUserId) {
    formDataToSend.append('assigneeUserId', formData.assigneeUserId.toString());
  } else {
    throw new Error('Assignee User ID is required');
  }
  if (formData.note) {
    formDataToSend.append('note', formData.note);
  }
  if (formData.scopeSummary) {
    formDataToSend.append('scopeSummary', formData.scopeSummary);
  }
  if (formData.projectName) {
    formDataToSend.append('projectName', formData.projectName);
  }
  if (formData.contractValue && formData.contractValue > 0) {
    formDataToSend.append('contractValue', formData.contractValue.toString());
  }
  
  // Append engaged engineers or milestone deliverables as JSON strings
  if (formData.engagementType === 'Retainer') {
    if (formData.engagedEngineers && formData.engagedEngineers.length > 0) {
      formDataToSend.append('engagedEngineers', JSON.stringify(formData.engagedEngineers));
    } else {
      formDataToSend.append('engagedEngineers', JSON.stringify([]));
    }
    // Keep deliveryItems for backward compatibility (empty array)
    formDataToSend.append('deliveryItems', JSON.stringify([]));
  }
  if (formData.engagementType === 'Fixed Price') {
    if (formData.milestoneDeliverables && formData.milestoneDeliverables.length > 0) {
      formDataToSend.append('milestoneDeliverables', JSON.stringify(formData.milestoneDeliverables));
    } else {
      formDataToSend.append('milestoneDeliverables', JSON.stringify([]));
    }
  }
  
  // Append billing details
  if (formData.billingDetails && formData.billingDetails.length > 0) {
    formDataToSend.append('billingDetails', JSON.stringify(formData.billingDetails));
  } else {
    formDataToSend.append('billingDetails', JSON.stringify([]));
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

  // Debug: Log request data
  console.log('Sending SOW contract creation request:', {
    msaId: formData.msaId,
    clientId: formData.clientId,
    engagementType: formData.engagementType,
    effectiveStart: formData.effectiveStart,
    effectiveEnd: formData.effectiveEnd,
    status: formData.status,
    assigneeUserId: formData.assigneeUserId,
    contractValue: formData.contractValue,
    engagedEngineersCount: formData.engagedEngineers?.length || 0,
    milestoneDeliverablesCount: formData.milestoneDeliverables?.length || 0,
    billingDetailsCount: formData.billingDetails?.length || 0,
  });

  const response = await fetch(`${API_BASE_URL}/sales/contracts/sow`, {
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
      error = { message: errorText || 'Failed to create SOW contract' };
    }
    console.error('SOW contract creation failed:', {
      status: response.status,
      statusText: response.statusText,
      error: error,
    });
    throw new Error(error.message || 'Failed to create SOW contract');
  }

  return response.json();
}

/**
 * Get SOW contract detail
 */
export interface SOWContractDetail {
  id: number;
  contractId: string;
  contractName: string;
  status: string;
  msaId?: string;
  clientId: number;
  clientName: string;
  clientEmail?: string;
  effectiveStart: string | null;
  effectiveEnd: string | null;
  assigneeUserId: number | null;
  assigneeName?: string;
  projectName?: string;
  note?: string | null;
  scopeSummary?: string | null;
  engagementType?: 'Fixed Price' | 'Retainer';
  value?: number | null;
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
  milestoneDeliverables?: Array<{
    id: number;
    milestone: string;
    deliveryNote: string;
    acceptanceCriteria: string;
    plannedEnd: string;
    paymentPercentage: number;
  }>;
  deliveryItems?: Array<{
    id: number;
    milestone: string;
    deliveryNote: string;
    amount: number;
    paymentDate: string;
  }>; // Deprecated, use engagedEngineers instead
  engagedEngineers?: Array<{
    id: number;
    engineerLevel: string;
    startDate: string;
    endDate: string;
    billingType?: string; // "Monthly" or "Hourly"
    hourlyRate?: number; // For hourly billing
    hours?: number; // For hourly billing
    subtotal?: number; // For hourly billing: hourlyRate * hours
    rating: number;
    salary: number;
  }>;
  billingDetails?: Array<{
    id: number;
    billingName: string;
    milestone?: string;
    amount: number;
    percentage?: number | null;
    invoiceDate: string;
    deliveryNote?: string;
    isPaid?: boolean;
  }>;
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
  version?: number; // Version number (V1, V2, V3, etc.) for Retainer SOW
}

/**
 * Update SOW contract (for Request_for_Change status - allows updating Engaged Engineers and Billing Details)
 */
export async function updateSOWContract(
  contractId: number,
  formData: {
    projectName?: string;
    effectiveStart?: string;
    effectiveEnd?: string;
    note?: string;
    scopeSummary?: string;
    assigneeUserId?: number;
    contractValue?: number;
    engagedEngineers?: Array<{
      engineerLevel: string;
      startDate: string;
      endDate: string;
      billingType?: string;
      hourlyRate?: number;
      hours?: number;
      subtotal?: number;
      rating: number;
      salary: number;
    }>;
    billingDetails?: Array<{
      paymentDate: string;
      deliveryNote: string;
      amount: number;
    }>;
    milestoneDeliverables?: Array<{
      id?: number;
      milestone: string;
      deliveryNote: string;
      acceptanceCriteria: string;
      plannedEnd: string;
      paymentPercentage: number;
    }>;
    fixedPriceBillingDetails?: Array<{
      id?: number;
      billingName: string;
      milestone: string;
      amount: number;
      percentage?: number | null;
      invoiceDate: string;
      isPaid?: boolean;
      deliveryNote?: string;
    }>;
    attachments?: File[];
  },
  token: string
): Promise<SOWContractResponse> {
  const formDataToSend = new FormData();
  
  // Add basic fields if provided
  if (formData.projectName !== undefined) {
    formDataToSend.append('projectName', formData.projectName);
  }
  if (formData.effectiveStart !== undefined) {
    formDataToSend.append('effectiveStart', formData.effectiveStart);
  }
  if (formData.effectiveEnd !== undefined) {
    formDataToSend.append('effectiveEnd', formData.effectiveEnd);
  }
  if (formData.note !== undefined) {
    formDataToSend.append('note', formData.note);
  }
  if (formData.scopeSummary !== undefined) {
    formDataToSend.append('scopeSummary', formData.scopeSummary);
  }
  if (formData.assigneeUserId !== undefined) {
    formDataToSend.append('assigneeUserId', formData.assigneeUserId.toString());
  }
  // Add contractValue if provided
  if (formData.contractValue !== undefined) {
    formDataToSend.append('contractValue', formData.contractValue.toString());
  }
  
  // Add engagedEngineers as JSON string if provided
  if (formData.engagedEngineers && formData.engagedEngineers.length > 0) {
    formDataToSend.append('engagedEngineers', JSON.stringify(formData.engagedEngineers));
  }
  
  // Add milestoneDeliverables as JSON string if provided (for Fixed Price)
  if (formData.milestoneDeliverables && formData.milestoneDeliverables.length > 0) {
    formDataToSend.append('milestoneDeliverables', JSON.stringify(formData.milestoneDeliverables));
  }
  
  // Add billingDetails as JSON string if provided (for Retainer)
  if (formData.billingDetails && formData.billingDetails.length > 0) {
    formDataToSend.append('billingDetails', JSON.stringify(formData.billingDetails.map(billing => ({
      paymentDate: billing.paymentDate,
      deliveryNote: billing.deliveryNote,
      amount: billing.amount,
    }))));
  }
  
  // Add fixedPriceBillingDetails as billingDetails (for Fixed Price)
  // Backend uses billingDetails for both Retainer and Fixed Price, but with different structure
  if (formData.fixedPriceBillingDetails && formData.fixedPriceBillingDetails.length > 0) {
    formDataToSend.append('billingDetails', JSON.stringify(formData.fixedPriceBillingDetails.map(billing => ({
      billingName: billing.billingName,
      milestone: billing.milestone,
      paymentDate: billing.invoiceDate, // Backend expects paymentDate field
      deliveryNote: billing.deliveryNote || '',
      amount: billing.amount,
      percentage: billing.percentage ?? null,
    }))));
  }
  
  // Add attachments if provided
  if (formData.attachments && formData.attachments.length > 0) {
    formData.attachments.forEach(file => {
      formDataToSend.append('attachments', file);
    });
  }
  
  const response = await fetch(`${API_BASE_URL}/sales/contracts/sow/${contractId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formDataToSend,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update SOW contract' }));
    throw new Error(error.message || 'Failed to update SOW contract');
  }

  return response.json();
}

export async function getSOWContractDetail(
  contractId: number,
  token: string
): Promise<SOWContractDetail> {
  const response = await fetch(`${API_BASE_URL}/sales/contracts/sow/${contractId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to get SOW contract detail' }));
    throw new Error(error.message || 'Failed to get SOW contract detail');
  }

  return response.json();
}

/**
 * Get all versions of a SOW contract
 */
/**
 * Get all versions of a SOW contract (DEPRECATED - Event-based system doesn't use versions)
 * @deprecated Use getSOWContractAppendices instead for Retainer contracts
 */
export async function getSOWContractVersions(
  contractId: number,
  token: string
): Promise<SOWContractDetail[]> {
  const response = await fetch(`${API_BASE_URL}/sales/contracts/sow/${contractId}/versions`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to get SOW contract versions' }));
    throw new Error(error.message || 'Failed to get SOW contract versions');
  }

  return response.json();
}

// ============================================
// EVENT-BASED API FUNCTIONS
// ============================================

export interface ContractAppendix {
  id: number;
  sowContractId: number;
  changeRequestId: number;
  appendixNumber: string; // PL-001, PL-002, etc.
  title: string;
  summary: string;
  pdfPath?: string | null;
  signedAt?: string | null; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export interface BaselineData {
  engineers: Array<{
    id: number;
    sowContractId: number;
    engineerId?: number;
    role: string;
    level: string;
    rating: number;
    unitRate: number;
    startDate: string;
    endDate?: string;
  }>;
  billing: Array<{
    id: number;
    sowContractId: number;
    billingMonth: string; // YYYY-MM-01
    amount: number;
    description: string;
  }>;
}

export interface CurrentState {
  engineers: Array<{
    engineerId?: number;
    role: string;
    level: string;
    rating: number;
    unitRate: number;
    startDate: string;
    endDate?: string;
  }>;
  billing: {
    month: string;
    amount: number;
  };
}

/**
 * Get baseline data for SOW contract (original contract snapshot)
 */
export async function getSOWContractBaseline(
  contractId: number,
  token: string
): Promise<BaselineData> {
  const response = await fetch(`${API_BASE_URL}/sales/contracts/sow/${contractId}/baseline`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to get baseline data' }));
    throw new Error(error.message || 'Failed to get baseline data');
  }

  return response.json();
}

/**
 * Get current state for SOW contract (baseline + events)
 */
export async function getSOWContractCurrentState(
  contractId: number,
  token: string,
  asOfDate?: string
): Promise<CurrentState> {
  const url = new URL(`${API_BASE_URL}/sales/contracts/sow/${contractId}/current-state`);
  if (asOfDate) {
    url.searchParams.append('asOfDate', asOfDate);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to get current state' }));
    throw new Error(error.message || 'Failed to get current state');
  }

  return response.json();
}

/**
 * Current Resource interface for CR creation/editing
 */
export interface CurrentResource {
  engineerId: number | null;        // Logical ID (from current state calculation)
  baseEngineerId: number | null;    // Baseline ID (optional, if from baseline)
  level: string;
  role: string;
  engineerLevelLabel: string;        // "Middle Backend Engineer" (combined display)
  startDate: string;                 // Format: YYYY-MM-DD
  endDate: string | null;            // Format: YYYY-MM-DD
  rating: number;                    // 0-100
  unitRate: number;                 // Monthly cost
}

/**
 * Current Resources Response
 */
export interface CurrentResourcesResponse {
  sowContractId: number;
  asOfDate: string;                 // Format: YYYY-MM-DD
  resources: CurrentResource[];
}

/**
 * Get current resources at a specific date for CR creation/editing
 * Returns resources calculated from baseline + approved events up to asOfDate
 */
export async function getCurrentResources(
  sowContractId: number,
  asOfDate: string,                 // Format: YYYY-MM-DD (required)
  token: string
): Promise<CurrentResourcesResponse> {
  const url = new URL(`${API_BASE_URL}/sales/contracts/sow/${sowContractId}/current-resources`);
  url.searchParams.append('asOfDate', asOfDate);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to get current resources' }));
    throw new Error(error.message || 'Failed to get current resources');
  }

  return response.json();
}

/**
 * Resource Event interface
 */
export interface ResourceEvent {
  id: number;
  changeRequestId: number;
  action: 'ADD' | 'REMOVE' | 'MODIFY';
  engineerId?: number | null;
  role?: string | null;
  level?: string | null;
  ratingOld?: number | string | null; // Can be number or string (from BigDecimal)
  ratingNew?: number | string | null;
  unitRateOld?: number | string | null; // Can be number or string (from BigDecimal)
  unitRateNew?: number | string | null;
  startDateOld?: string | null;
  startDateNew?: string | null;
  endDateOld?: string | null;
  endDateNew?: string | null;
  effectiveStart: string; // Format: YYYY-MM-DD
  createdAt: string;
}

/**
 * Events Response
 */
export interface EventsResponse {
  resources?: ResourceEvent[];
  billing?: any[];
}

/**
 * Get events for SOW contract
 */
export async function getSOWContractEvents(
  contractId: number,
  token: string,
  type?: 'resource' | 'billing',
  fromDate?: string,
  toDate?: string
): Promise<EventsResponse> {
  const url = new URL(`${API_BASE_URL}/sales/contracts/sow/${contractId}/events`);
  if (type) {
    url.searchParams.append('type', type);
  }
  if (fromDate) {
    url.searchParams.append('fromDate', fromDate);
  }
  if (toDate) {
    url.searchParams.append('toDate', toDate);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to get events' }));
    throw new Error(error.message || 'Failed to get events');
  }

  return response.json();
}

/**
 * Get all appendices for SOW contract
 */
export async function getSOWContractAppendices(
  contractId: number,
  token: string
): Promise<ContractAppendix[]> {
  const response = await fetch(`${API_BASE_URL}/sales/contracts/sow/${contractId}/appendices`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to get appendices' }));
    throw new Error(error.message || 'Failed to get appendices');
  }

  return response.json();
}

/**
 * Get appendix detail
 */
export async function getSOWContractAppendix(
  contractId: number,
  appendixId: number,
  token: string
): Promise<ContractAppendix> {
  const response = await fetch(`${API_BASE_URL}/sales/contracts/sow/${contractId}/appendices/${appendixId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to get appendix' }));
    throw new Error(error.message || 'Failed to get appendix');
  }

  return response.json();
}

/**
 * Sign appendix
 */
export async function signSOWContractAppendix(
  contractId: number,
  appendixId: number,
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/sales/contracts/sow/${contractId}/appendices/${appendixId}/sign`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to sign appendix' }));
    throw new Error(error.message || 'Failed to sign appendix');
  }
}

// Change Request interfaces and functions
export interface ChangeRequestListItem {
  id: number;
  changeRequestId: string;
  type: string;
  summary: string;
  effectiveFrom: string | null;
  effectiveUntil: string | null;
  expectedExtraCost: number | null;
  costEstimatedByLandbridge: number | null;
  status: string;
}

export interface ChangeRequestsListResponse {
  content: ChangeRequestListItem[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export async function getChangeRequestsForSOW(
  sowContractId: number,
  page: number = 0,
  size: number = 10,
  token: string
): Promise<ChangeRequestsListResponse> {
  const response = await fetch(
    `${API_BASE_URL}/sales/contracts/sow/${sowContractId}/change-requests?page=${page}&size=${size}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to get change requests' }));
    throw new Error(error.message || 'Failed to get change requests');
  }

  return response.json();
}

/**
 * Submit review for SOW contract
 */
export async function submitSOWReview(
  contractId: number,
  reviewNotes: string,
  action: string,
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/sales/contracts/sow/${contractId}/review`, {
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

// Create Change Request interfaces and functions
export interface CreateChangeRequestFormData {
  title: string;
  type: 'RESOURCE_CHANGE' | 'SCHEDULE_CHANGE' | 'SCOPE_ADJUSTMENT' | 'Extend Schedule' | 'Rate Change' | 'Increase Resource' | 'Add Scope' | 'Remove Scope' | 'Other';
  summary: string;
  effectiveFrom: string; // Format: YYYY-MM-DD
  effectiveUntil: string; // Format: YYYY-MM-DD
  references?: string;
  attachments?: File[];
  engagedEngineers: Array<{
    baseEngineerId?: number | null;    // Optional: baseline engineer ID (for MODIFY/REMOVE)
    engineerId?: number | null;        // Optional: current logical engineer ID
    action?: 'ADD' | 'MODIFY' | 'REMOVE'; // Action type (for event-based Retainer SOW)
    level?: string;                     // Level (e.g., "Middle", "Senior")
    role?: string;                      // Role (e.g., "Backend Engineer")
    engineerLevel: string;              // Combined: "Level Role" (e.g., "Middle Backend Engineer")
    startDate: string;                  // Format: YYYY-MM-DD
    endDate: string | null;             // Format: YYYY-MM-DD
    billingType?: string;               // "Monthly" or "Hourly"
    hourlyRate?: number;                // For hourly billing
    hours?: number;                     // For hourly billing
    subtotal?: number;                  // For hourly billing: hourlyRate * hours
    rating: number;                     // Percentage (0-100) for Monthly, Hourly rate for Hourly
    salary: number;                     // Currency amount (for monthly) or subtotal (for hourly)
  }>;
  billingDetails: Array<{
    paymentDate: string; // Format: YYYY-MM-DD
    deliveryNote: string;
    amount: number; // Currency amount
  }>;
  impactAnalysis?: {
    devHours: number;
    testHours: number;
    newEndDate: string; // Format: YYYY-MM-DD
    delayDuration: number; // in days
    additionalCost: number; // Currency amount
  };
  internalReviewerId: number;
  comment?: string;
  action: 'save' | 'submit';
  reviewAction?: 'APPROVE' | 'REQUEST_REVISION';
}

export interface ChangeRequestResponse {
  id: number;
  changeRequestId: string;
  success: boolean;
  message: string;
}

/**
 * Create change request for Retainer SOW contract
 */
export async function createChangeRequestForSOW(
  sowContractId: number,
  formData: CreateChangeRequestFormData,
  token: string
): Promise<ChangeRequestResponse> {
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
  
  // Append billing details as JSON string (only for Retainer)
  if (formData.billingDetails && formData.billingDetails.length > 0) {
    formDataToSend.append('billingDetails', JSON.stringify(formData.billingDetails));
  } else {
    formDataToSend.append('billingDetails', JSON.stringify([]));
  }
  
  // Append impact analysis as JSON string (only for Fixed Price)
  if (formData.impactAnalysis) {
    formDataToSend.append('impactAnalysis', JSON.stringify(formData.impactAnalysis));
  }
  
  formDataToSend.append('internalReviewerId', formData.internalReviewerId.toString());
  
  if (formData.comment) {
    formDataToSend.append('comment', formData.comment);
  }
  
  // Append reviewAction if provided (when internal reviewer is current user)
  if (formData.reviewAction) {
    formDataToSend.append('reviewAction', formData.reviewAction);
  }
  
  formDataToSend.append('action', formData.action);
  
  // Append attachments
  if (formData.attachments && formData.attachments.length > 0) {
    for (const file of formData.attachments) {
      formDataToSend.append('attachments', file);
    }
  }
  
  const response = await fetch(`${API_BASE_URL}/sales/contracts/sow/${sowContractId}/change-requests`, {
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

// Change Request Detail interfaces and functions
export interface SalesChangeRequestDetail {
  appendixId?: number; // For event-based Retainer SOW contracts
  id: number;
  changeRequestId: string;
  title: string;
  type: string;
  desiredStartDate?: string;
  desiredEndDate?: string;
  expectedExtraCost?: number | null;
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
  // Impact Analysis fields (for Fixed Price SOW)
  devHours?: number;
  testHours?: number;
  newEndDate?: string;
  delayDuration?: number;
  additionalCost?: number;
}

/**
 * Get change request detail for SOW
 */
export async function getChangeRequestDetailForSOW(
  sowContractId: number,
  changeRequestId: number,
  token: string
): Promise<SalesChangeRequestDetail> {
  const response = await fetch(`${API_BASE_URL}/sales/contracts/sow/${sowContractId}/change-requests/${changeRequestId}`, {
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
 * Update change request for SOW (Draft only)
 */
export async function updateChangeRequestForSOW(
  sowContractId: number,
  changeRequestId: number,
  formData: CreateChangeRequestFormData,
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
  
  // Append impact analysis as JSON string (only for Fixed Price)
  if (formData.impactAnalysis) {
    formDataToSend.append('impactAnalysis', JSON.stringify(formData.impactAnalysis));
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
  
  const response = await fetch(`${API_BASE_URL}/sales/contracts/sow/${sowContractId}/change-requests/${changeRequestId}`, {
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
 * Submit change request for SOW
 */
export async function submitChangeRequestForSOW(
  sowContractId: number,
  changeRequestId: number,
  internalReviewerId: number,
  token: string
): Promise<void> {
  const formData = new FormData();
  formData.append('internalReviewerId', internalReviewerId.toString());
  
  const response = await fetch(`${API_BASE_URL}/sales/contracts/sow/${sowContractId}/change-requests/${changeRequestId}/submit`, {
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
export async function submitChangeRequestReviewForSOW(
  sowContractId: number,
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
  
  const response = await fetch(`${API_BASE_URL}/sales/contracts/sow/${sowContractId}/change-requests/${changeRequestId}/review`, {
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

/**
 * Approve change request and apply changes to contract (for Retainer SOW)
 */
export async function approveChangeRequestForSOW(
  sowContractId: number,
  changeRequestId: number,
  reviewNotes: string | null,
  token: string
): Promise<void> {
  const formData = new FormData();
  if (reviewNotes) {
    formData.append('reviewNotes', reviewNotes);
  }
  
  const response = await fetch(`${API_BASE_URL}/sales/contracts/sow/${sowContractId}/change-requests/${changeRequestId}/approve`, {
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
      error = { message: errorText || 'Failed to approve change request' };
    }
    throw new Error(error.message || 'Failed to approve change request');
  }
}

/**
 * Reject change request without applying changes (for Retainer SOW)
 */
export async function rejectChangeRequestForSOW(
  sowContractId: number,
  changeRequestId: number,
  reason: string | null,
  token: string
): Promise<void> {
  const formData = new FormData();
  if (reason) {
    formData.append('reason', reason);
  }
  
  const response = await fetch(`${API_BASE_URL}/sales/contracts/sow/${sowContractId}/change-requests/${changeRequestId}/reject`, {
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
      error = { message: errorText || 'Failed to reject change request' };
    }
    throw new Error(error.message || 'Failed to reject change request');
  }
}

/**
 * Get preview of changes (Before/After comparison) for change request
 */
export interface ChangeRequestPreview {
  resources: {
    before: Array<{
      id: number;
      engineerLevel: string;
      startDate: string;
      endDate: string;
      rating: number;
      salary: number;
    }>;
    after: Array<{
      id: number;
      engineerLevel: string;
      startDate: string;
      endDate: string;
      rating: number;
      salary: number;
    }>;
  };
  billing: {
    before: Array<{
      id: number;
      paymentDate: string;
      deliveryNote: string;
      amount: number;
    }>;
    after: Array<{
      id: number;
      paymentDate: string;
      deliveryNote: string;
      amount: number;
    }>;
  };
}

export async function getChangeRequestPreviewForSOW(
  sowContractId: number,
  changeRequestId: number,
  token: string
): Promise<ChangeRequestPreview> {
  const response = await fetch(`${API_BASE_URL}/sales/contracts/sow/${sowContractId}/change-requests/${changeRequestId}/preview`, {
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
      error = { message: errorText || 'Failed to get preview' };
    }
    throw new Error(error.message || 'Failed to get preview');
  }
  
  return response.json();
}

/**
 * Update payment status for billing detail
 */
export async function updateBillingDetailPaymentStatus(
  contractId: number,
  billingDetailId: number,
  isPaid: boolean,
  engagementType: 'Fixed Price' | 'Retainer',
  token: string
): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
  const url = new URL(`${baseUrl}/sales/contracts/sow/${contractId}/billing-details/${billingDetailId}/payment-status`);
  url.searchParams.append('isPaid', isPaid.toString());
  url.searchParams.append('engagementType', engagementType);

  const response = await fetch(url.toString(), {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update payment status' }));
    throw new Error(error.message || 'Failed to update payment status');
  }
}

