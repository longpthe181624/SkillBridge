import { API_BASE_URL } from '@/lib/apiConfig';

/**
 * Dashboard Summary Response
 */
export interface DashboardSummary {
  contacts: {
    all: number;
    new: number;
  };
  opportunities: {
    all: number;
    underReview: number;
  };
  proposals: {
    all: number;
    underReview: number;
  };
  contracts: {
    all: number;
    underReview: number;
  };
  changeRequests: {
    all: number;
    underReview: number;
  };
  revenue?: Array<{
    month: string; // Format: "YYYY/MM"
    amount: number; // In JPY
  }>;
}

/**
 * Approval Item
 */
export interface ApprovalItem {
  id: number;
  entityType: string; // "PROPOSAL", "SOW", "MSA"
  entityNumber: string; // e.g., "P-103", "SW-021"
  entityId: number;
  clientName: string;
  status: string;
  sentDate?: string; // Format: "YYYY-MM-DD"
  description: string;
}

/**
 * Approvals Response
 */
export interface ApprovalsResponse {
  approvals: ApprovalItem[];
  total: number;
}

/**
 * Activity Item
 */
export interface ActivityItem {
  id: number;
  description: string; // e.g., "CR-020 submitted by Client A"
  timeAgo: string; // e.g., "2 min ago", "1 hour ago"
  timestamp: string; // ISO format
  entityType: string; // "CHANGE_REQUEST", "CONTRACT", "PROPOSAL", "CONTACT"
  entityId: number;
  clientName: string;
}

/**
 * Activities Response
 */
export interface ActivitiesResponse {
  activities: ActivityItem[];
  total: number;
}

/**
 * Get dashboard summary statistics
 * GET /api/sales/dashboard/summary
 */
export async function getDashboardSummary(token: string): Promise<DashboardSummary> {
  const response = await fetch(`${API_BASE_URL}/sales/dashboard/summary`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to get dashboard summary' }));
    throw new Error(error.message || 'Failed to get dashboard summary');
  }

  return response.json();
}

/**
 * Get approvals waiting from clients
 * GET /api/sales/dashboard/approvals
 */
export async function getDashboardApprovals(token: string): Promise<ApprovalsResponse> {
  const response = await fetch(`${API_BASE_URL}/sales/dashboard/approvals`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to get approvals' }));
    throw new Error(error.message || 'Failed to get approvals');
  }

  return response.json();
}

/**
 * Get recent client activities
 * GET /api/sales/dashboard/activities
 */
export async function getDashboardActivities(token: string): Promise<ActivitiesResponse> {
  const response = await fetch(`${API_BASE_URL}/sales/dashboard/activities`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to get activities' }));
    throw new Error(error.message || 'Failed to get activities');
  }

  return response.json();
}

