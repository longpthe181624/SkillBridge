/**
 * API Configuration Utility
 * Centralized API URL configuration for all services
 *
 * Handles:
 * - Environment variable NEXT_PUBLIC_API_URL
 * - Normalizes trailing slashes
 * - Ensures /api suffix for consistency
 */

/**
 * Get normalized API base URL
 *
 * Examples:
 * - https://api.skill-bridge.dev.inisoft.vn/ -> https://api.skill-bridge.dev.inisoft.vn/api
 * - https://api.skill-bridge.dev.inisoft.vn -> https://api.skill-bridge.dev.inisoft.vn/api
 * - http://localhost:8080/api -> http://localhost:8080/api
 */
export const getApiBaseUrl = (): string => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

    // Log for debugging (only in development or if explicitly enabled)
    if (typeof window !== 'undefined' && (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEBUG_API_URL === 'true')) {
        console.log('[API Config] Raw NEXT_PUBLIC_API_URL:', envUrl);
    }

    // Remove trailing slash if present
    let cleanUrl = envUrl.replace(/\/+$/, '');

    // If URL doesn't end with /api, append it
    if (!cleanUrl.endsWith('/api')) {
        cleanUrl = `${cleanUrl}/api`;
    }

    // Log final URL for debugging
    if (typeof window !== 'undefined' && (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEBUG_API_URL === 'true')) {
        console.log('[API Config] Final API_BASE_URL:', cleanUrl);
    }

    return cleanUrl;
};

/**
 * Exported API base URL for use in services
 * Note: This is evaluated at build time for Next.js, so NEXT_PUBLIC_API_URL must be set during build
 */
export const API_BASE_URL = getApiBaseUrl();

