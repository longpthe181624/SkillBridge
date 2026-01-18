import { API_BASE_URL } from '@/lib/apiConfig';

export interface SalesContactDetail {
    id: string; // Format: CC-YYYY-NN
    contactId: number; // Internal ID
    dateReceived: string; // Format: YYYY/MM/DD HH:MM JST
    clientName: string;
    email: string;
    phone: string;
    clientCompany: string | null;
    consultationRequest: string;
    requestType: string; // PROJECT, HIRING, CONSULTATION
    status: string; // NEW, INPROGRESS, CONVERTED_TO_OPPORTUNITY, CLOSED
    priority: string; // NORMAL, HIGH, URGENT
    assigneeUserId: number | null;
    assigneeName: string | null;
    convertedToOpportunity: boolean;
    internalNotes: string | null;
    onlineMtgLink: string | null;
    onlineMtgDateTime: string | null; // Format: YYYY/MM/DD HH:MM
    communicationLogs: CommunicationLog[];
}

export interface CommunicationLog {
    id: number;
    message: string;
    createdAt: string; // Format: YYYY/MM/DD HH:MM
    createdBy: number;
    createdByName: string | null;
}

export interface UpdateContactRequest {
    requestType?: string;
    priority?: string;
    assigneeUserId?: number;
    status?: string;
    internalNotes?: string;
    onlineMtgLink?: string;
    onlineMtgDateTime?: string;
}

export interface CreateCommunicationLogRequest {
    message: string;
}

/**
 * Get contact detail by ID
 */
export async function getSalesContactDetail(contactId: number, token: string): Promise<SalesContactDetail> {
    const response = await fetch(`${API_BASE_URL}/sales/contacts/${contactId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to fetch contact detail' }));
        throw new Error(error.message || 'Failed to fetch contact detail');
    }

    return response.json();
}

/**
 * Update contact
 */
export async function updateSalesContact(
    contactId: number,
    request: UpdateContactRequest,
    token: string
): Promise<SalesContactDetail> {
    const response = await fetch(`${API_BASE_URL}/sales/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to update contact' }));
        throw new Error(error.message || 'Failed to update contact');
    }

    return response.json();
}

/**
 * Convert contact to opportunity
 */
export async function convertToOpportunity(contactId: number, token: string): Promise<SalesContactDetail> {
    const response = await fetch(`${API_BASE_URL}/sales/contacts/${contactId}/convert-to-opportunity`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to convert to opportunity' }));
        throw new Error(error.message || 'Failed to convert to opportunity');
    }

    return response.json();
}

/**
 * Add communication log
 */
export async function addCommunicationLog(
    contactId: number,
    request: CreateCommunicationLogRequest,
    token: string
): Promise<CommunicationLog | null> {
    const response = await fetch(`${API_BASE_URL}/sales/contacts/${contactId}/communication-logs`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        // Log error but don't throw - return null instead
        const error = await response.json().catch(() => ({ message: 'Failed to add communication log' }));
        console.error('Failed to add communication log:', error.message || 'Unknown error');
        return null;
    }

    return response.json();
}

/**
 * Send meeting email
 */
export async function sendMeetingEmail(
    contactId: number,
    onlineMtgLink: string,
    onlineMtgDateTime: string,
    token: string
): Promise<SalesContactDetail> {
    const response = await fetch(`${API_BASE_URL}/sales/contacts/${contactId}/send-mtg-email`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            onlineMtgLink,
            onlineMtgDateTime,
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to send meeting email' }));
        throw new Error(error.message || 'Failed to send meeting email');
    }

    return response.json();
}

/**
 * Get list of sales users (for assignee dropdown)
 */
export interface SalesUser {
    id: number;
    email: string;
    fullName: string;
    role: string;
}

export async function getSalesUsers(token: string): Promise<SalesUser[]> {
    const response = await fetch(`${API_BASE_URL}/sales/contacts/users`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to fetch sales users' }));
        throw new Error(error.message || 'Failed to fetch sales users');
    }

    return response.json();
}

