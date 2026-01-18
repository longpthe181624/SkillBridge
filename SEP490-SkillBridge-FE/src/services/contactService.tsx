/**
 * Contact Service
 * Handles contact form submissions
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081/api';

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
    contactId?: number;
}

/**
 * Submit contact form
 * @param contactData Contact form data
 * @returns ContactSubmissionResponse
 */
export async function submitContactForm(
    contactData: ContactFormData
): Promise<ContactSubmissionResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/public/contact/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData),
        });

        const responseData = await response.json().catch(() => null);

        if (!response.ok) {
            // Handle validation errors (400) or server errors (500)
            if (response.status === 400) {
                // Validation errors from backend
                const errorMessage = responseData?.message || 'Validation error. Please check your input.';
                throw new Error(errorMessage);
            } else if (response.status === 500) {
                // Server errors
                const errorMessage = responseData?.message || 'Server error. Please try again later.';
                throw new Error(errorMessage);
            } else {
                // Other errors
                const errorMessage = responseData?.message || 'Failed to submit contact form. Please try again.';
                throw new Error(errorMessage);
            }
        }

        // Success response
        return responseData as ContactSubmissionResponse;
    } catch (error) {
        console.error('Error submitting contact form:', error);
        // Re-throw the error so the component can handle it
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred. Please try again.');
    }
}

