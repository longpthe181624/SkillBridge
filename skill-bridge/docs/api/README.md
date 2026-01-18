# SkillBridge API Documentation

## Overview
This document provides information about the SkillBridge backend API endpoints and how to use the Postman collection for testing.

## Base URL
```
http://localhost:8080/api
```

## Import Postman Collection

1. Open Postman
2. Click **Import** button
3. Select the file: `SkillBridge_API_Collection.postman_collection.json`
4. The collection will be imported with all endpoints organized by category

## Environment Variables

The collection uses the following variables that you can set in Postman:

- `baseUrl`: Base API URL (default: `http://localhost:8080/api`)
- `userId`: User ID for authenticated requests (default: `1`)
- `token`: JWT authentication token (set after login)

### Setting Variables

1. Click on the collection name
2. Go to **Variables** tab
3. Update the values as needed
4. Or set them at the environment level

## Authentication

Most endpoints require authentication. Follow these steps:

1. **Login** first using the `POST /auth/login` endpoint
2. Copy the `token` from the response
3. Set the `token` variable in Postman collection/environment
4. The token will be automatically included in subsequent requests via `Authorization: Bearer {{token}}` header

### Sample Login Request
```json
{
  "email": "skillbridgetest@gmail.com",
  "password": "password123"
}
```

### Sample Login Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "skillbridgetest@gmail.com",
    "name": "Test User"
  }
}
```

## API Endpoints

### Authentication
- `POST /auth/login` - Login and get JWT token
- `POST /auth/logout` - Logout
- `POST /auth/forgot-password` - Request password reset

### Public APIs
- `GET /public/homepage/statistics` - Get homepage statistics
- `GET /public/homepage/engineers` - Get homepage engineers
- `GET /public/homepage/engineers/{category}` - Get engineers by category
- `GET /public/engineers/search` - Search engineers with filters
- `GET /public/engineers/{id}` - Get engineer detail
- `GET /public/engineers/filters/skills` - Get available skills
- `GET /public/engineers/filters/locations` - Get available locations
- `GET /public/engineers/filters/seniorities` - Get available seniorities
- `POST /public/contact/submit` - Submit contact form

### Client - Contacts
- `GET /client/contacts` - Get contacts list (with pagination and filters)
- `POST /client/contacts` - Create new contact
- `GET /client/contacts/{contactId}` - Get contact detail
- `POST /client/contacts/{contactId}/logs` - Add communication log
- `POST /client/contacts/{contactId}/proposal/approve` - Approve proposal
- `POST /client/contacts/{contactId}/proposal/comment` - Add proposal comment
- `POST /client/contacts/{contactId}/cancel` - Cancel consultation

### Client - Proposals
- `GET /client/proposals` - Get proposals list (with pagination and filters)

### Client - Contracts
- `GET /client/contracts` - Get contracts list (with pagination and filters)
- `GET /client/contracts/{contractId}` - Get contract detail
- `POST /client/contracts/{contractId}/approve` - Approve contract
- `POST /client/contracts/{contractId}/comment` - Add comment (Request for Change)
- `POST /client/contracts/{contractId}/cancel` - Cancel contract

### Client - Change Requests
- `POST /client/contracts/{contractId}/change-requests` - Create change request
- `POST /client/contracts/{contractId}/change-requests/draft` - Save change request as draft
- `GET /client/contracts/{contractId}/change-requests/{changeRequestId}` - Get change request detail
- `PUT /client/contracts/{contractId}/change-requests/{changeRequestId}` - Update change request (Draft only)
- `POST /client/contracts/{contractId}/change-requests/{changeRequestId}/submit` - Submit change request
- `POST /client/contracts/{contractId}/change-requests/{changeRequestId}/approve` - Approve change request
- `POST /client/contracts/{contractId}/change-requests/{changeRequestId}/request-for-change` - Request for change
- `POST /client/contracts/{contractId}/change-requests/{changeRequestId}/terminate` - Terminate change request

## Request Headers

### Common Headers
- `Content-Type: application/json` - For JSON requests
- `Authorization: Bearer {token}` - For authenticated requests
- `X-User-Id: {userId}` - User ID (currently required, will be extracted from JWT in future)

### Multipart Form Data
For file uploads (e.g., change request attachments), use `multipart/form-data`:
- `Content-Type: multipart/form-data` (set automatically by Postman)

## Sample Requests

### Create Change Request
**Endpoint:** `POST /client/contracts/{contractId}/change-requests`

**Request Type:** `multipart/form-data`

**Form Data:**
```
title: Add New Feature
type: Add Scope
description: Add user authentication feature
reason: Client requested new feature
desiredStartDate: 2025/01/15
desiredEndDate: 2025/02/15
expectedExtraCost: 500000
attachments: [file]
```

### Update Change Request (Draft)
**Endpoint:** `PUT /client/contracts/{contractId}/change-requests/{changeRequestId}`

**Request Body:**
```json
{
  "title": "Updated Change Request Title",
  "type": "Add Scope",
  "description": "Updated description",
  "reason": "Updated reason",
  "desiredStartDate": "2025/01/20",
  "desiredEndDate": "2025/02/20",
  "expectedExtraCost": 600000
}
```

### Request for Change
**Endpoint:** `POST /client/contracts/{contractId}/change-requests/{changeRequestId}/request-for-change`

**Request Body:**
```json
{
  "message": "Please review and update the change request details"
}
```

## Query Parameters

### Pagination
- `page`: Page number (default: 0)
- `size`: Page size (default: 20)

### Filtering
- `search`: Search query (optional)
- `status`: Status filter (optional, e.g., "All", "Active", "Pending", "Under Review")
- `type`: Type filter for contracts (optional, "All", "MSA", "SOW")

### Example
```
GET /client/contracts?search=project&status=Active&type=SOW&page=0&size=20
```

## Date Format

Dates should be formatted as: `yyyy/MM/dd`

Examples:
- `2025/01/15`
- `2025/12/31`

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "User ID is required"
}
```

### 404 Not Found
```json
{
  "message": "Contract not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to process request: error message"
}
```

## Testing Tips

1. **Start with Authentication**: Always login first to get the token
2. **Set Variables**: Update `userId` and `token` variables after login
3. **Use Collection Variables**: Variables are shared across all requests in the collection
4. **Check Response**: Review response status and body to understand the API behavior
5. **Test Error Cases**: Try invalid data to see error handling

## Notes

- The `X-User-Id` header is currently required for most endpoints. In production, this will be extracted from the JWT token.
- For testing, you can use `userId = 1` (default user from seed data)
- File uploads are supported for change request attachments
- All dates should follow the format: `yyyy/MM/dd`

## Support

For issues or questions, please refer to the backend code or contact the development team.

