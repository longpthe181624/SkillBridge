import { API_BASE_URL } from '@/lib/apiConfig';

export interface User {
  id: number;
  fullName: string;
  role: 'SALES_MANAGER' | 'SALES_REP';
  email: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponse {
  users: User[];
  page: {
    total: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export interface UserListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  status?: string;
}

/**
 * Get list of users with pagination, search, and filter
 */
export async function getUsers(params: UserListParams = {}): Promise<UserListResponse> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const queryParams = new URLSearchParams();
  if (params.page !== undefined) queryParams.append('page', params.page.toString());
  if (params.pageSize !== undefined) queryParams.append('pageSize', params.pageSize.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.role) queryParams.append('role', params.role);
  if (params.status) queryParams.append('status', params.status);

  const response = await fetch(`${API_BASE_URL}/admin/users?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch users' }));
    throw new Error(error.message || 'Failed to fetch users');
  }

  return response.json();
}

export interface CreateUserRequest {
  fullName: string;
  role: 'SALES_MANAGER' | 'SALES_REP';
  email: string;
  phone?: string;
}

/**
 * Create a new user
 */
export async function createUser(request: CreateUserRequest): Promise<User> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_BASE_URL}/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create user' }));
    throw new Error(error.message || 'Failed to create user');
  }

  return response.json();
}

export interface UpdateUserRequest {
  fullName: string;
  role: 'SALES_MANAGER' | 'SALES_REP';
  phone?: string;
  // Email is NOT included - it cannot be edited
}

/**
 * Get user by ID
 */
export async function getUserById(id: number): Promise<User> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch user' }));
    throw new Error(error.message || 'Failed to fetch user');
  }

  return response.json();
}

/**
 * Update an existing user
 * Note: Email is NOT included in request (cannot be edited)
 */
export async function updateUser(id: number, request: UpdateUserRequest): Promise<User> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update user' }));
    throw new Error(error.message || 'Failed to update user');
  }

  return response.json();
}

/**
 * Delete user (soft delete)
 */
export async function deleteUser(userId: number): Promise<void> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to delete user' }));
    throw new Error(error.message || 'Failed to delete user');
  }
}

