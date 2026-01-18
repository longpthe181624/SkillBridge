# User Story: Project Close Request for SOW Contract

## Story Information
- **Story ID**: Story-41
- **Title**: Project Close Request for SOW Contract
- **Epic**: Sales Portal - Contract Management & Client Portal - Contract Management
- **Priority**: High
- **Story Points**: 21
- **Sprint**: TBD
- **Status**: Ready for Development

## User Story

### As a Sales Representative
**I want to** create a Project Close Request for an active SOW contract that has reached its end date  
**So that** I can formally request client confirmation to close the project and mark the SOW as completed

### As a Client
**I want to** review and approve/reject Project Close Requests from Sales Representatives  
**So that** I can confirm project completion or request additional work before closing the project

## Goal

Enable Sales Representatives to request project closure for SOW contracts that are Active and have reached their end date, allowing Clients to approve or reject the closure request. Upon approval, the SOW status changes to Completed.

---

## Acceptance Criteria

### Primary Acceptance Criteria

#### Sales Representative Side
- [ ] I can see a "Project Close Request" button on SOW Detail page when:
  - SOW status is "Active"
  - SOW end_date <= today
  - No existing Pending Close Request exists for this SOW
- [ ] I can open a modal form to create a Close Request with message and links
- [ ] I can submit the Close Request, which sends it to the Client for review
- [ ] I can see the status of my Close Request (Pending, Approved, Rejected)
- [ ] If rejected, I can see the rejection reason and resubmit an updated Close Request
- [ ] I receive notifications when Client approves or rejects my Close Request

#### Client Side
- [ ] I can see a "Close Request Pending Review" indicator on my Contracts/Projects list for SOWs with pending Close Requests
- [ ] I can open a Review Close Request page to see SOW details, message, and links
- [ ] I can approve the Close Request, which marks the SOW as Completed
- [ ] I can reject the Close Request with a required reason, keeping the SOW Active
- [ ] I receive notifications when a new Close Request is submitted or resubmitted

#### Business Rules
- [ ] Only one Pending Close Request is allowed per SOW at a time
- [ ] Close Request can only be created when SOW is Active and end_date <= today
- [ ] Close Request can only be approved/rejected when status is Pending
- [ ] Rejection requires a reason (mandatory field)
- [ ] Upon approval, SOW status automatically changes to Completed
- [ ] Upon rejection, SOW remains Active and SalesRep can resubmit

---

## Part 1: Database & Model Design

### 1.1. ProjectCloseRequest Entity

- [ ] **Table Creation**:
  - [ ] Create `project_close_requests` table if it doesn't exist
  - [ ] Table follows existing naming conventions

- [ ] **Required Fields**:
  - [ ] `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
  - [ ] `sow_id` (INT, FK → sow_contracts.id, NOT NULL)
  - [ ] `requested_by_user_id` (INT, FK → users.id, NOT NULL)
  - [ ] `status` (ENUM: 'Pending', 'ClientApproved', 'Rejected', NOT NULL, DEFAULT 'Pending')
  - [ ] `message` (TEXT) – thank you message / notes from SalesRep
  - [ ] `links` (TEXT or JSON) – URLs to documents, feedback forms, etc. (one per line or JSON array)
  - [ ] `client_reject_reason` (TEXT, NULL) – reason provided by Client when rejecting
  - [ ] `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
  - [ ] `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)

- [ ] **Indexes**:
  - [ ] Index on `sow_id` for fast lookups
  - [ ] Index on `status` for filtering
  - [ ] Index on `requested_by_user_id` for user queries
  - [ ] Unique constraint on `(sow_id, status)` where status = 'Pending' (to ensure only one pending request per SOW)

- [ ] **Foreign Keys**:
  - [ ] Foreign key constraint on `sow_id` → `sow_contracts(id)` with CASCADE delete
  - [ ] Foreign key constraint on `requested_by_user_id` → `users(id)`

### 1.2. Entity Class (Java)

- [ ] **ProjectCloseRequest Entity**:
  - [ ] Create `ProjectCloseRequest.java` entity class
  - [ ] Map all database fields to entity properties
  - [ ] Include proper JPA annotations (@Entity, @Table, @Id, @Column, etc.)
  - [ ] Include relationships (@ManyToOne for SOW and User)
  - [ ] Include enum for status (ProjectCloseRequestStatus enum)

- [ ] **Repository Interface**:
  - [ ] Create `ProjectCloseRequestRepository.java` extending JpaRepository
  - [ ] Add query methods:
    - [ ] `findBySowIdAndStatus(Integer sowId, ProjectCloseRequestStatus status)`
    - [ ] `findFirstBySowIdOrderByCreatedAtDesc(Integer sowId)`
    - [ ] `findBySowIdOrderByCreatedAtDesc(Integer sowId)`
    - [ ] `existsBySowIdAndStatus(Integer sowId, ProjectCloseRequestStatus status)`

---

## Part 2: Backend - Service & API

### 2.1. Validation Service

- [ ] **Business Rule Validation**:
  - [ ] Method to check if SOW is Active
  - [ ] Method to check if SOW end_date <= today
  - [ ] Method to check if no Pending Close Request exists for SOW
  - [ ] Method to validate user role (SalesRep or SalesManager)
  - [ ] Method to validate Close Request can be created (combines all checks above)
  - [ ] Method to validate Close Request can be approved/rejected (status must be Pending)

### 2.2. API: Create Close Request (SalesRep)

#### Endpoint: POST /api/sales/sows/{sowId}/close-requests

- [ ] **Request Headers**:
  - [ ] `Authorization: Bearer {token}` (required)
  - [ ] `Content-Type: application/json`

- [ ] **Request Body**:
```json
{
  "message": "Thank you for working with us. The project scope has been delivered. Please review and confirm project closure.",
  "links": "https://docs.example.com/handover\nhttps://feedback.example.com/form\nhttps://repo.example.com/project"
}
```

- [ ] **Validation**:
  - [ ] User must be authenticated (JWT token)
  - [ ] User role must be SALES_REP or SALES_MANAGER
  - [ ] SOW must exist
  - [ ] SOW status must be "Active"
  - [ ] SOW end_date <= today
  - [ ] No existing Pending Close Request for this SOW
  - [ ] Message is optional but recommended (max 5000 characters)
  - [ ] Links is optional (max 2000 characters)

- [ ] **Response** (200 OK):
```json
{
  "success": true,
  "message": "Project close request created successfully",
  "data": {
    "id": 1,
    "sowId": 53,
    "status": "Pending",
    "message": "Thank you for working with us...",
    "links": "https://docs.example.com/handover\n...",
    "requestedBy": {
      "id": 5,
      "name": "Sale Man"
    },
    "createdAt": "2025-12-08T10:30:35"
  }
}
```

- [ ] **Error Responses**:
  - [ ] `400 Bad Request`: Validation errors (SOW not Active, end_date > today, existing Pending request)
  - [ ] `401 Unauthorized`: User not authenticated
  - [ ] `403 Forbidden`: User doesn't have permission (not SalesRep/SalesManager)
  - [ ] `404 Not Found`: SOW not found
  - [ ] `500 Internal Server Error`: Server error

- [ ] **Service Logic**:
  - [ ] Validate all business rules
  - [ ] Create ProjectCloseRequest entity with status = "Pending"
  - [ ] Save to database
  - [ ] Create audit log entry ("CloseRequestCreated")
  - [ ] Send notification to Client (primary contact)
  - [ ] Return response

### 2.3. API: Get Latest Close Request

#### Endpoint: GET /api/sows/{sowId}/close-requests/latest

- [ ] **Request Headers**:
  - [ ] `Authorization: Bearer {token}` (required)

- [ ] **Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "sowId": 53,
    "sowContractName": "SOW Contract - EC Rewamp",
    "sowPeriod": "2025/12/1-2025/12/31",
    "status": "Pending",
    "message": "Thank you for working with us...",
    "links": "https://docs.example.com/handover\n...",
    "requestedBy": {
      "id": 5,
      "name": "Sale Man",
      "email": "sales@example.com"
    },
    "clientRejectReason": null,
    "createdAt": "2025-12-08T10:30:35",
    "updatedAt": "2025-12-08T10:30:35"
  }
}
```

- [ ] **Error Responses**:
  - [ ] `404 Not Found`: No Close Request found for this SOW
  - [ ] `401 Unauthorized`: User not authenticated

### 2.4. API: Approve Close Request (Client)

#### Endpoint: POST /api/client/close-requests/{id}/approve

- [ ] **Request Headers**:
  - [ ] `Authorization: Bearer {token}` (required)
  - [ ] `Content-Type: application/json`

- [ ] **Request Body** (optional confirmation):
```json
{
  "confirm": true
}
```

- [ ] **Validation**:
  - [ ] User must be authenticated
  - [ ] User role must be CLIENT
  - [ ] Close Request must exist
  - [ ] Close Request status must be "Pending"
  - [ ] Close Request must belong to a SOW owned by the Client

- [ ] **Response** (200 OK):
```json
{
  "success": true,
  "message": "Project close request approved. SOW has been marked as completed.",
  "data": {
    "id": 1,
    "sowId": 53,
    "status": "ClientApproved",
    "sowStatus": "Completed"
  }
}
```

- [ ] **Service Logic**:
  - [ ] Validate all business rules
  - [ ] Update CloseRequest status = "ClientApproved"
  - [ ] Update SOW status = "Completed"
  - [ ] Save both entities
  - [ ] Create audit log entry ("CloseRequestApprovedByClient")
  - [ ] Send notification to SalesRep and SalesManager
  - [ ] Return response

### 2.5. API: Reject Close Request (Client)

#### Endpoint: POST /api/client/close-requests/{id}/reject

- [ ] **Request Headers**:
  - [ ] `Authorization: Bearer {token}` (required)
  - [ ] `Content-Type: application/json`

- [ ] **Request Body**:
```json
{
  "reason": "We need additional features before closing. Please see attached requirements."
}
```

- [ ] **Validation**:
  - [ ] User must be authenticated
  - [ ] User role must be CLIENT
  - [ ] Close Request must exist
  - [ ] Close Request status must be "Pending"
  - [ ] Close Request must belong to a SOW owned by the Client
  - [ ] Reason is required (not empty, max 2000 characters)

- [ ] **Response** (200 OK):
```json
{
  "success": true,
  "message": "Project close request rejected. SOW remains active.",
  "data": {
    "id": 1,
    "sowId": 53,
    "status": "Rejected",
    "clientRejectReason": "We need additional features...",
    "sowStatus": "Active"
  }
}
```

- [ ] **Service Logic**:
  - [ ] Validate all business rules
  - [ ] Update CloseRequest status = "Rejected"
  - [ ] Save client_reject_reason
  - [ ] SOW status remains "Active" (no change)
  - [ ] Save CloseRequest
  - [ ] Create audit log entry ("CloseRequestRejectedByClient")
  - [ ] Send notification to SalesRep and SalesManager (include reason)
  - [ ] Return response

### 2.6. API: Resubmit Close Request (SalesRep)

#### Endpoint: POST /api/sales/close-requests/{id}/resubmit

- [ ] **Request Headers**:
  - [ ] `Authorization: Bearer {token}` (required)
  - [ ] `Content-Type: application/json`

- [ ] **Request Body**:
```json
{
  "message": "Updated message after addressing client feedback...",
  "links": "https://docs.example.com/handover-v2\nhttps://feedback.example.com/form"
}
```

- [ ] **Validation**:
  - [ ] User must be authenticated
  - [ ] User role must be SALES_REP or SALES_MANAGER
  - [ ] Close Request must exist
  - [ ] Close Request status must be "Rejected"
  - [ ] Close Request must have been created by the current user (or SalesManager can resubmit any)

- [ ] **Response** (200 OK):
```json
{
  "success": true,
  "message": "Project close request resubmitted successfully",
  "data": {
    "id": 1,
    "sowId": 53,
    "status": "Pending",
    "message": "Updated message...",
    "links": "https://docs.example.com/handover-v2\n...",
    "updatedAt": "2025-12-09T14:20:10"
  }
}
```

- [ ] **Service Logic**:
  - [ ] Validate all business rules
  - [ ] Update CloseRequest message and links (if provided)
  - [ ] Update CloseRequest status = "Pending"
  - [ ] Clear client_reject_reason (optional, or keep for history)
  - [ ] Save CloseRequest
  - [ ] Create audit log entry ("CloseRequestResubmitted")
  - [ ] Send notification to Client
  - [ ] Return response

---

## Part 3: Frontend - SalesRep UI

### 3.1. SOW Detail Page - Close Request Button

- [ ] **Button Display Logic**:
  - [ ] Button "Project Close Request" is displayed in SOW Detail page (SalesRep view)
  - [ ] Button is only visible when:
    - [ ] SOW status === 'Active'
    - [ ] SOW end_date <= today (current date)
    - [ ] No existing Close Request with status === 'Pending' for this SOW
  - [ ] Button is hidden when conditions are not met
  - [ ] Button has appropriate styling (primary button, blue)

- [ ] **Button Location**:
  - [ ] Button is placed in a logical location (e.g., top-right of SOW Detail page, or in Actions section)
  - [ ] Button is clearly visible and accessible
  - [ ] Button has tooltip: "This button is available when the contract end date has passed and the SOW is still active."

- [ ] **Status Indicator**:
  - [ ] If Close Request exists with status "Pending", show badge/tag "Close Request Pending"
  - [ ] If Close Request exists with status "ClientApproved", show badge/tag "Project Closed"
  - [ ] If Close Request exists with status "Rejected", show badge/tag "Close Request Rejected" with rejection reason

### 3.2. Create Close Request Modal

- [ ] **Modal Trigger**:
  - [ ] Clicking "Project Close Request" button opens the modal
  - [ ] Modal appears as overlay with backdrop
  - [ ] Modal is centered on screen
  - [ ] Modal has white background with rounded corners

- [ ] **Modal Header**:
  - [ ] Title "Create Project Close Request" is displayed
  - [ ] Close button (X icon) is available in top-right
  - [ ] Clicking close or backdrop closes modal

- [ ] **Form Fields**:
  - [ ] **Message Textarea**:
    - [ ] Label "Message to Client" is displayed
    - [ ] Textarea is multi-line (4-6 rows)
    - [ ] Placeholder text: "Thank you for working with us. The project scope has been delivered. Please review and confirm project closure."
    - [ ] Field is optional but recommended
    - [ ] Max length: 5000 characters
    - [ ] Character counter is displayed
    - [ ] Pre-filled with template message (can be edited)

  - [ ] **Links Input**:
    - [ ] Label "Links" is displayed
    - [ ] Sub-label: "Handover documents, repository links, feedback forms, etc. (one per line)"
    - [ ] Textarea is multi-line (3-4 rows)
    - [ ] Placeholder text: "https://docs.example.com/handover\nhttps://feedback.example.com/form"
    - [ ] Field is optional
    - [ ] Max length: 2000 characters
    - [ ] Character counter is displayed
    - [ ] Accepts multiple URLs, one per line

- [ ] **Action Buttons**:
  - [ ] **Submit Button**:
    - [ ] Button "Submit Close Request" is displayed
    - [ ] Button is primary styled (blue)
    - [ ] Clicking button validates form
    - [ ] If valid, calls API POST /api/sales/sows/{sowId}/close-requests
    - [ ] Loading state is shown during submission
    - [ ] Success message is displayed after submission
    - [ ] Modal closes after successful submission
    - [ ] SOW Detail page refreshes to show updated status

  - [ ] **Cancel Button**:
    - [ ] Button "Cancel" is displayed
    - [ ] Button is secondary styled (outline)
    - [ ] Clicking button closes modal without saving

- [ ] **Form Validation**:
  - [ ] Message max length: 5000 characters
  - [ ] Links max length: 2000 characters
  - [ ] Error messages are displayed for validation failures
  - [ ] Error styling (red border) is applied to invalid fields

### 3.3. Rejected Close Request Display

- [ ] **Rejection Information Display**:
  - [ ] If Close Request status is "Rejected", display rejection section
  - [ ] Show rejection reason in a highlighted box
  - [ ] Show rejection date/time
  - [ ] Show who rejected (Client name)

- [ ] **Resubmit Button**:
  - [ ] Button "Update & Resubmit Close Request" is displayed when status is "Rejected"
  - [ ] Button opens the same modal form
  - [ ] Form is pre-filled with existing message and links (can be edited)
  - [ ] Submit button text changes to "Resubmit Close Request"
  - [ ] On submit, calls API POST /api/sales/close-requests/{id}/resubmit
  - [ ] Success message is displayed
  - [ ] Status updates to "Pending"

---

## Part 4: Frontend - Client UI

### 4.1. Contracts/Projects List - Close Request Indicator

- [ ] **Pending Review Indicator**:
  - [ ] For each SOW in the list with CloseRequest.status = "Pending":
    - [ ] Display badge/tag "Close Request Pending Review"
    - [ ] Badge is visually distinct (e.g., orange/yellow)
    - [ ] Badge is clickable and links to Review Close Request page

- [ ] **Filter Option** (optional):
  - [ ] Add filter option to show only SOWs with pending Close Requests
  - [ ] Filter is accessible from list page

### 4.2. Review Close Request Page

- [ ] **Page Access**:
  - [ ] Page is accessible from Contracts list (clicking badge/indicator)
  - [ ] Page is accessible from SOW Detail page (if Close Request exists)
  - [ ] URL: `/client/contracts/sow/{sowId}/close-request/review`

- [ ] **SOW Information Section**:
  - [ ] Display SOW contract name
  - [ ] Display SOW period (start date - end date)
  - [ ] Display SOW status (should be "Active")
  - [ ] Display scope summary (if available)
  - [ ] Display contract value

- [ ] **Close Request Information Section**:
  - [ ] Display message from SalesRep (formatted text)
  - [ ] Display links section:
    - [ ] Each link is displayed as a clickable button/link
    - [ ] Links open in new tab
    - [ ] Link icons are displayed (external link icon)
  - [ ] Display requested by (SalesRep name and email)
  - [ ] Display request date/time

- [ ] **Action Buttons**:
  - [ ] **Approve Button**:
    - [ ] Button "Approve Project Closure" is displayed
    - [ ] Button is primary styled (green/blue)
    - [ ] Clicking button shows confirmation popup:
      - [ ] "Are you sure you want to approve project closure? The SOW will be marked as completed."
      - [ ] "Confirm" and "Cancel" options
    - [ ] On confirm, calls API POST /api/client/close-requests/{id}/approve
    - [ ] Loading state is shown during approval
    - [ ] Success toast: "Project has been marked as completed."
    - [ ] Redirect to Contracts list or SOW Detail page

  - [ ] **Reject Button**:
    - [ ] Button "Reject & Send Reason" is displayed
    - [ ] Button is secondary styled (red/outline)
    - [ ] Clicking button opens rejection modal:
      - [ ] Modal title: "Reject Project Close Request"
      - [ ] Textarea for "Rejection Reason" (required)
      - [ ] Placeholder: "Please provide a reason for rejecting the close request..."
      - [ ] Max length: 2000 characters
      - [ ] Character counter
      - [ ] "Submit Rejection" and "Cancel" buttons
    - [ ] On submit, validates reason is not empty
    - [ ] Calls API POST /api/client/close-requests/{id}/reject with reason
    - [ ] Loading state is shown during rejection
    - [ ] Success toast: "Close request has been rejected and sent back to LandBridge."
    - [ ] Modal closes
    - [ ] Page updates to show rejection status

---

## Part 5: Notifications

### 5.1. Notification: Close Request Created/Resubmitted

- [ ] **Trigger**:
  - [ ] When SalesRep creates a new Close Request
  - [ ] When SalesRep resubmits a rejected Close Request

- [ ] **Recipients**:
  - [ ] Client (primary contact for the SOW)
  - [ ] SalesManager (optional, if configured)

- [ ] **Notification Content**:
  - [ ] Title: "Project Close Request Submitted"
  - [ ] Message: "A project close request has been submitted for [Project Name]. Please review and approve or reject."
  - [ ] Link to Review Close Request page
  - [ ] SOW contract name and period
  - [ ] Request date/time

- [ ] **Delivery Methods**:
  - [ ] In-app notification (notification bell/center)
  - [ ] Email notification (optional, if email service is configured)

### 5.2. Notification: Close Request Approved

- [ ] **Trigger**:
  - [ ] When Client approves a Close Request

- [ ] **Recipients**:
  - [ ] SalesRep (who created the request)
  - [ ] SalesManager (if different from SalesRep)

- [ ] **Notification Content**:
  - [ ] Title: "Project Close Request Approved"
  - [ ] Message: "Client has approved the project close request for [Project Name]. SOW is now completed."
  - [ ] Link to SOW Detail page
  - [ ] SOW contract name
  - [ ] Approval date/time

- [ ] **Delivery Methods**:
  - [ ] In-app notification
  - [ ] Email notification (optional)

### 5.3. Notification: Close Request Rejected

- [ ] **Trigger**:
  - [ ] When Client rejects a Close Request

- [ ] **Recipients**:
  - [ ] SalesRep (who created the request)
  - [ ] SalesManager (if different from SalesRep)

- [ ] **Notification Content**:
  - [ ] Title: "Project Close Request Rejected"
  - [ ] Message: "Client has rejected the project close request for [Project Name]. Reason: [reason]."
  - [ ] Link to SOW Detail page
  - [ ] SOW contract name
  - [ ] Rejection reason (full text)
  - [ ] Rejection date/time

- [ ] **Delivery Methods**:
  - [ ] In-app notification
  - [ ] Email notification (optional)

---

## Part 6: Validation & Business Rules

### 6.1. Close Request Creation Rules

- [ ] **SOW Status Validation**:
  - [ ] SOW must exist
  - [ ] SOW status must be exactly "Active"
  - [ ] Error message if SOW is not Active: "Close request can only be created for Active SOW contracts."

- [ ] **Date Validation**:
  - [ ] SOW end_date must be <= today (current date)
  - [ ] Error message if end_date > today: "Close request can only be created when the contract end date has passed."

- [ ] **Pending Request Validation**:
  - [ ] Only one Close Request with status "Pending" is allowed per SOW
  - [ ] Check is performed before creating new request
  - [ ] Error message if pending request exists: "A pending close request already exists for this SOW. Please wait for client response or resubmit the existing request."

- [ ] **User Role Validation**:
  - [ ] Only SALES_REP or SALES_MANAGER can create Close Requests
  - [ ] Error message if unauthorized: "Only Sales Representatives and Sales Managers can create close requests."

### 6.2. Close Request Approval/Rejection Rules

- [ ] **Status Validation**:
  - [ ] Close Request status must be "Pending" to approve/reject
  - [ ] Error message if status is not Pending: "This close request cannot be approved/rejected. Current status: [status]."

- [ ] **User Role Validation**:
  - [ ] Only CLIENT role can approve/reject
  - [ ] Error message if unauthorized: "Only clients can approve or reject close requests."

- [ ] **Ownership Validation**:
  - [ ] Client must own the SOW contract
  - [ ] Error message if not owner: "You do not have permission to review this close request."

- [ ] **Rejection Reason Validation**:
  - [ ] Reason is required when rejecting
  - [ ] Reason must not be empty (trimmed)
  - [ ] Reason max length: 2000 characters
  - [ ] Error message if reason is missing: "Rejection reason is required."

### 6.3. Close Request Resubmission Rules

- [ ] **Status Validation**:
  - [ ] Close Request status must be "Rejected" to resubmit
  - [ ] Error message if status is not Rejected: "Only rejected close requests can be resubmitted."

- [ ] **User Role Validation**:
  - [ ] Only SALES_REP or SALES_MANAGER can resubmit
  - [ ] Original requester or SalesManager can resubmit
  - [ ] Error message if unauthorized: "You do not have permission to resubmit this close request."

---

## Part 7: Audit Logging

### 7.1. Audit Log Entries

- [ ] **CloseRequestCreated**:
  - [ ] Log entry is created when Close Request is created
  - [ ] Includes: SOW ID, Request ID, Requester ID, Timestamp
  - [ ] Stored in contract_history or audit_log table

- [ ] **CloseRequestApprovedByClient**:
  - [ ] Log entry is created when Client approves
  - [ ] Includes: Close Request ID, SOW ID, Approver ID (Client), Timestamp
  - [ ] Includes note: "Project close request approved. SOW marked as completed."

- [ ] **CloseRequestRejectedByClient**:
  - [ ] Log entry is created when Client rejects
  - [ ] Includes: Close Request ID, SOW ID, Rejector ID (Client), Rejection Reason, Timestamp
  - [ ] Includes note: "Project close request rejected. Reason: [reason]."

- [ ] **CloseRequestResubmitted**:
  - [ ] Log entry is created when SalesRep resubmits
  - [ ] Includes: Close Request ID, SOW ID, Resubmitter ID, Timestamp
  - [ ] Includes note: "Project close request resubmitted after rejection."

---

## Part 8: Testing Requirements

### 8.1. Unit Tests

- [ ] **Service Layer Tests**:
  - [ ] Test Close Request creation with valid data
  - [ ] Test Close Request creation fails when SOW is not Active
  - [ ] Test Close Request creation fails when end_date > today
  - [ ] Test Close Request creation fails when Pending request exists
  - [ ] Test Close Request approval updates SOW to Completed
  - [ ] Test Close Request rejection keeps SOW Active
  - [ ] Test Close Request resubmission updates status to Pending
  - [ ] Test validation methods return correct errors

- [ ] **Repository Tests**:
  - [ ] Test query methods return correct results
  - [ ] Test unique constraint prevents multiple Pending requests

### 8.2. Integration Tests

- [ ] **API Endpoint Tests**:
  - [ ] Test POST /api/sales/sows/{sowId}/close-requests with valid data
  - [ ] Test POST /api/sales/sows/{sowId}/close-requests with invalid data (all validation scenarios)
  - [ ] Test GET /api/sows/{sowId}/close-requests/latest
  - [ ] Test POST /api/client/close-requests/{id}/approve
  - [ ] Test POST /api/client/close-requests/{id}/reject with and without reason
  - [ ] Test POST /api/sales/close-requests/{id}/resubmit

- [ ] **Full Flow Tests**:
  - [ ] Test complete flow: Create → Client Approve → SOW Completed
  - [ ] Test complete flow: Create → Client Reject → Resubmit → Client Approve → SOW Completed
  - [ ] Test notification delivery for each action

### 8.3. UI Tests

- [ ] **Button Visibility Tests**:
  - [ ] Button appears when SOW is Active and end_date <= today
  - [ ] Button is hidden when SOW is not Active
  - [ ] Button is hidden when end_date > today
  - [ ] Button is hidden when Pending request exists

- [ ] **Form Validation Tests**:
  - [ ] Form validates message max length
  - [ ] Form validates links max length
  - [ ] Form shows error messages correctly
  - [ ] Form submits successfully with valid data

- [ ] **Modal Tests**:
  - [ ] Modal opens and closes correctly
  - [ ] Form fields are editable
  - [ ] Submit button works correctly
  - [ ] Cancel button closes modal

- [ ] **Client Review Page Tests**:
  - [ ] Page displays SOW information correctly
  - [ ] Page displays Close Request information correctly
  - [ ] Approve button shows confirmation and works
  - [ ] Reject button opens modal and requires reason
  - [ ] Links are clickable and open in new tab

---

## Part 9: Technical Requirements

### 9.1. Frontend Requirements

#### Component Structure
```typescript
// CreateProjectCloseRequestModal.tsx
interface CreateProjectCloseRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  sowId: number;
  existingCloseRequest?: ProjectCloseRequest | null;
  onSubmit: (data: CloseRequestFormData) => Promise<void>;
  onResubmit?: (id: number, data: CloseRequestFormData) => Promise<void>;
}

interface CloseRequestFormData {
  message: string;
  links: string;
}

// ReviewProjectCloseRequestPage.tsx
interface ReviewProjectCloseRequestPageProps {
  sowId: number;
  closeRequestId: number;
}
```

#### State Management
- [ ] Form state managed with React hooks (useState)
- [ ] Validation state tracked for each field
- [ ] Loading state tracked during API calls
- [ ] Error state tracked and displayed

#### API Integration
- [ ] Service functions for all Close Request APIs
- [ ] Proper error handling for API responses
- [ ] Loading indicators during API calls
- [ ] Success/error toast notifications

### 9.2. Backend Requirements

#### Controller
```java
@RestController
@RequestMapping("/sales/sows/{sowId}/close-requests")
public class SalesProjectCloseRequestController {
    // POST create
    // GET latest (optional)
}

@RestController
@RequestMapping("/client/close-requests")
public class ClientProjectCloseRequestController {
    // GET /{id} or GET /sows/{sowId}/latest
    // POST /{id}/approve
    // POST /{id}/reject
}
```

#### Service
```java
@Service
public class ProjectCloseRequestService {
    // Validation methods
    // Create method
    // Approve method
    // Reject method
    // Resubmit method
    // Get latest method
}
```

#### DTOs
- [ ] CreateProjectCloseRequestRequest
- [ ] ApproveProjectCloseRequestRequest
- [ ] RejectProjectCloseRequestRequest
- [ ] ResubmitProjectCloseRequestRequest
- [ ] ProjectCloseRequestResponse
- [ ] ProjectCloseRequestDetailDTO

### 9.3. Database Migration

- [ ] **Flyway Migration Script**:
  - [ ] Create migration file: `V{version}__Create_project_close_requests_table.sql`
  - [ ] Create table with all required fields
  - [ ] Create indexes
  - [ ] Create foreign key constraints
  - [ ] Add unique constraint for (sow_id, status) where status = 'Pending'

---

## Part 10: Documentation

### 10.1. User Manual Updates

- [ ] **Workflow 6 - Project Close Request**:
  - [ ] Document SalesRep process: How to create Close Request
  - [ ] Document Client process: How to review and approve/reject
  - [ ] Include screenshots of modal and review page
  - [ ] Document button visibility conditions
  - [ ] Document resubmission process

### 10.2. Business Rules Documentation

- [ ] **Close Request Rules Section**:
  - [ ] Document when Close Request button is available
  - [ ] Document one Pending request per SOW rule
  - [ ] Document approval/rejection workflow
  - [ ] Document resubmission loop (Reject → Resubmit → Approve)
  - [ ] Document SOW status transitions

### 10.3. API Documentation

- [ ] **API Endpoints Documentation**:
  - [ ] Document all Close Request API endpoints
  - [ ] Include request/response examples
  - [ ] Document error responses
  - [ ] Document authentication requirements

---

## Definition of Done

- [ ] All acceptance criteria are met
- [ ] Database table and entity are created
- [ ] All backend APIs are implemented and tested
- [ ] All frontend components are implemented
- [ ] Form validation works correctly
- [ ] Business rules are enforced
- [ ] Notifications are sent correctly
- [ ] Audit logging is implemented
- [ ] Unit tests are written and passing
- [ ] Integration tests are written and passing
- [ ] UI tests are written and passing
- [ ] Code is reviewed and approved
- [ ] Documentation is updated
- [ ] User Manual is updated
- [ ] Multi-language support is implemented (if applicable)
- [ ] Accessibility requirements are met
- [ ] Responsive design works on all devices

---

## Dependencies

### Internal Dependencies
- **Story-14**: Client Contract Detail SOW View (for Close Request button location)
- **Story-24**: Sales Contract List (for Close Request indicator)
- **Story-26**: Sales Create SOW (SOW must exist)
- Notification system must be implemented
- Audit logging system must be implemented

### External Dependencies
- Database migration system (Flyway)
- Notification service (email/in-app)
- Authentication/Authorization system (JWT)

---

## Risks and Mitigation

### Risk 1: Multiple Pending Requests
- **Risk**: Database constraint might not prevent race conditions
- **Mitigation**: Use database-level unique constraint and handle constraint violations in application code

### Risk 2: Date Comparison Edge Cases
- **Risk**: Timezone issues or date comparison logic errors
- **Mitigation**: Use consistent date/time handling, compare dates (not datetime) for end_date <= today

### Risk 3: Notification Delivery Failures
- **Risk**: Notifications might not be delivered
- **Mitigation**: Implement retry logic, log notification attempts, provide fallback mechanisms

### Risk 4: SOW Status Transition Conflicts
- **Risk**: SOW status might be changed by other processes while Close Request is being processed
- **Mitigation**: Use database transactions, implement optimistic locking if needed

---

## Success Metrics

- [ ] Sales Representatives can successfully create Close Requests
- [ ] Clients can successfully review and approve/reject Close Requests
- [ ] SOW status correctly transitions to Completed upon approval
- [ ] Rejected Close Requests can be resubmitted
- [ ] Notifications are delivered successfully
- [ ] No duplicate Pending requests are created
- [ ] All business rules are enforced correctly

---

## Future Enhancements

- [ ] Close Request templates for common messages
- [ ] Bulk Close Request creation for multiple SOWs
- [ ] Close Request history and versioning
- [ ] Close Request comments/notes from both sides
- [ ] Close Request attachments (documents, files)
- [ ] Close Request approval workflow (multi-step if needed)
- [ ] Close Request analytics and reporting
- [ ] Email templates customization
- [ ] Close Request reminders (if pending too long)

---

**Document Control**
- **Version**: 1.0
- **Created**: December 2025
- **Last Updated**: December 2025
- **Approved By**: System Management Team
- **Distribution**: Development Team, Product Team, Management

