# User Story: Sales Change Request Detail View

## Story Information
- **Story ID**: Story-30
- **Title**: Sales Change Request Detail View
- **Epic**: Sales Portal - Contract Management
- **Priority**: High
- **Story Points**: 13
- **Sprint**: Sprint 6
- **Status**: Draft

## User Story
**As a** Sales User (Sales Manager or Sales Man)  
**I want to** view detailed information about a change request in a modal  
**So that** I can review all change request details, engaged engineers, billing details, history, and attachments, edit draft change requests, submit for review, and perform internal review actions based on the change request status

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] I can open the "Change Request Detail" modal by clicking the eye icon in the Change Requests table
- [ ] The modal displays comprehensive change request information organized in sections
- [ ] I can see Overview section with CR ID, CR Title, Type, Created By, Created Date, and Status
- [ ] I can see Change Summary section with description text
- [ ] I can see References section with links/files
- [ ] I can see Engaged Engineer section with engineer details (for MSA Fixed Price and SOW Retainer)
- [ ] I can see Billing Details section with payment information (for MSA Fixed Price and SOW Retainer)
- [ ] I can see History section with timeline of changes
- [ ] I can see Attachments section with uploaded files
- [ ] I can see Approval & Workflow section with Internal Reviewer and Review Notes (when applicable)
- [ ] Input fields are editable only when status is "Draft" and I am the creator
- [ ] Action buttons are displayed conditionally based on change request status and my role
- [ ] I can edit and save draft change requests
- [ ] I can submit draft change requests for internal review
- [ ] I can perform internal review actions (Approve, Request Revision) when I am the assigned reviewer
- [ ] The modal matches the wireframe design
- [ ] I can close the modal by clicking Close button or outside the modal

---

## Part 1: Modal Overview

### 1. Modal Trigger
- [ ] **Button Location**:
  - [ ] Eye icon button is displayed in the "Action" column of the Change Requests table
  - [ ] Button is clickable and opens the modal when clicked
  - [ ] Button is visible for all change requests (both MSA and SOW)

- [ ] **Modal Display**:
  - [ ] Modal appears as an overlay on top of the contract detail page
  - [ ] Modal has a semi-transparent dark background (backdrop)
  - [ ] Modal is centered on the screen
  - [ ] Modal has a white background with rounded corners
  - [ ] Modal has appropriate padding and spacing
  - [ ] Modal is scrollable if content exceeds viewport height
  - [ ] Modal width is appropriate for content (e.g., max-w-4xl or max-w-5xl)

### 2. Modal Header
- [ ] **Title**:
  - [ ] Modal title "Change Request Detail" is displayed at the top center
  - [ ] Title uses appropriate font size and styling
  - [ ] Title is clearly visible and readable

- [ ] **Close Button**:
  - [ ] Close button (X icon) is displayed in the top-right corner
  - [ ] Close button is clickable
  - [ ] Clicking close button closes the modal
  - [ ] Clicking outside the modal (on backdrop) also closes the modal

---

## Part 2: Overview Section

### 1. Section Header
- [ ] **Section Title**:
  - [ ] Section title "Overview" is displayed
  - [ ] Title is clearly visible and readable
  - [ ] Section has clear visual separation from other sections

### 2. CR ID Field
- [ ] **Field Display**:
  - [ ] Label "CR ID" is displayed
  - [ ] Value displays the change request ID (e.g., "CR-2025-01")
  - [ ] Value is displayed as text (read-only)
  - [ ] Value is clearly visible

### 3. CR Title Field
- [ ] **Field Display**:
  - [ ] Label "CR Title" is displayed
  - [ ] Value displays the change request title (e.g., "Add New Features")
  - [ ] Value is editable (text input) when status is "Draft" and current user is the creator
  - [ ] Value is read-only text when status is not "Draft" or user is not the creator
  - [ ] Input field has appropriate styling
  - [ ] Validation: Field is required, max 255 characters

### 4. Type Field
- [ ] **Field Display**:
  - [ ] Label "Type" is displayed
  - [ ] Value displays the CR type (e.g., "Add Scope", "Extend Schedule", "Rate Change")
  - [ ] Value is editable (dropdown) when status is "Draft" and current user is the creator
  - [ ] Value is read-only text when status is not "Draft" or user is not the creator
  - [ ] Dropdown options match contract type:
    - [ ] For MSA Fixed Price: "Add Scope", "Remove Scope", "Other"
    - [ ] For SOW Retainer: "Extend Schedule", "Rate Change", "Increase Resource", "Other"

### 5. Effective from Field
- [ ] **Field Display**:
  - [ ] Label "Effective from" is displayed
  - [ ] Value displays the effective from date (e.g., "2025/12/01")
  - [ ] Value is editable (date picker) when status is "Draft" and current user is the creator
  - [ ] Value is read-only text when status is not "Draft" or user is not the creator
  - [ ] Date format: YYYY/MM/DD or YYYY-MM-DD

### 6. Effective until Field
- [ ] **Field Display**:
  - [ ] Label "Effective until" is displayed
  - [ ] Value displays the effective until date (e.g., "2025/12/31")
  - [ ] Value is editable (date picker) when status is "Draft" and current user is the creator
  - [ ] Value is read-only text when status is not "Draft" or user is not the creator
  - [ ] Date format: YYYY/MM/DD or YYYY-MM-DD
  - [ ] Validation: Effective until must be after Effective from

### 7. Created By Field
- [ ] **Field Display**:
  - [ ] Label "Created By" is displayed
  - [ ] Value displays the creator's name (e.g., "Sale Manager 01")
  - [ ] Value is displayed as text (read-only)

### 8. Created Date Field
- [ ] **Field Display**:
  - [ ] Label "Created Date" is displayed
  - [ ] Value displays the creation date (e.g., "2025/06/12")
  - [ ] Value is displayed as text (read-only)
  - [ ] Date format: YYYY/MM/DD

### 9. Status Field
- [ ] **Field Display**:
  - [ ] Label "Status" is displayed
  - [ ] Value displays the current status (e.g., "Draft", "Under Internal Review", "Client Under Review", "Approved", "Request for Change", "Active", "Terminated")
  - [ ] Status is displayed with appropriate badge styling (color-coded)
  - [ ] Value is displayed as text (read-only)

---

## Part 3: Change Summary Section

### 1. Section Header
- [ ] **Section Title**:
  - [ ] Section title "Change Summary" is displayed
  - [ ] Title is clearly visible and readable
  - [ ] Section has clear visual separation from other sections

### 2. Summary Content
- [ ] **Content Display**:
  - [ ] Summary text is displayed in a textarea or text block
  - [ ] Content is editable (textarea) when status is "Draft" and current user is the creator
  - [ ] Content is read-only text when status is not "Draft" or user is not the creator
  - [ ] Text wraps appropriately
  - [ ] Textarea has appropriate height (e.g., 4-6 rows)
  - [ ] Validation: Field is required, max 2000 characters
  - [ ] Placeholder text: "Enter Change summary of the change request"

---

## Part 4: References Section

### 1. Section Header
- [ ] **Section Title**:
  - [ ] Section title "References" is displayed
  - [ ] Title is clearly visible and readable
  - [ ] Section has clear visual separation from other sections

### 2. References Content
- [ ] **Content Display**:
  - [ ] References text is displayed in a text input or text block
  - [ ] Content is editable (text input) when status is "Draft" and current user is the creator
  - [ ] Content is read-only text when status is not "Draft" or user is not the creator
  - [ ] Field is optional (not required)
  - [ ] Multiple references can be separated by commas or newlines

---

## Part 5: Engaged Engineer Section

### 1. Section Header
- [ ] **Section Title**:
  - [ ] Section title "Engaged Engineer" is displayed
  - [ ] Title is clearly visible and readable
  - [ ] Section has clear visual separation from other sections
  - [ ] Section is only displayed for MSA Fixed Price and SOW Retainer change requests

### 2. Engineer Table
- [ ] **Table Display**:
  - [ ] Table has columns: Engineer Level, Start date, End date, Rating, Salary
  - [ ] Table headers are clearly visible
  - [ ] Multiple engineer rows are displayed
  - [ ] Each row shows engineer details

### 3. Engineer Fields (Per Row)
- [ ] **Engineer Level**:
  - [ ] Value displays engineer level (e.g., "Middle BE")
  - [ ] Value is editable (text input) when status is "Draft" and current user is the creator
  - [ ] Value is read-only text when status is not "Draft" or user is not the creator

- [ ] **Start date**:
  - [ ] Value displays start date (e.g., "2025/12/01")
  - [ ] Value is editable (date picker) when status is "Draft" and current user is the creator
  - [ ] Value is read-only text when status is not "Draft" or user is not the creator

- [ ] **End date**:
  - [ ] Value displays end date (e.g., "2026/02/28")
  - [ ] Value is editable (date picker) when status is "Draft" and current user is the creator
  - [ ] Value is read-only text when status is not "Draft" or user is not the creator

- [ ] **Rating**:
  - [ ] Value displays rating as percentage (e.g., "100%")
  - [ ] Value is editable (text input) when status is "Draft" and current user is the creator
  - [ ] Value is read-only text when status is not "Draft" or user is not the creator
  - [ ] Validation: Rating must be between 0% and 100%

- [ ] **Salary**:
  - [ ] Value displays salary with currency format (e.g., "¥350,000")
  - [ ] Value is editable (text input with currency formatting) when status is "Draft" and current user is the creator
  - [ ] Value is read-only text when status is not "Draft" or user is not the creator
  - [ ] Currency format: ¥ symbol with thousand separators

### 4. Add/Remove Engineer (Draft Only)
- [ ] **Add Engineer Button**:
  - [ ] "+" icon button is displayed below the table when status is "Draft" and current user is the creator
  - [ ] Button is clickable and adds a new engineer row
  - [ ] Button is hidden when status is not "Draft" or user is not the creator

- [ ] **Remove Engineer Button**:
  - [ ] Remove button (X icon) is displayed for each row (except the first one) when status is "Draft" and current user is the creator
  - [ ] Button is clickable and removes the engineer row
  - [ ] Button is hidden when status is not "Draft" or user is not the creator

---

## Part 6: Billing Details Section

### 1. Section Header
- [ ] **Section Title**:
  - [ ] Section title "Billing details" is displayed
  - [ ] Title is clearly visible and readable
  - [ ] Section has clear visual separation from other sections
  - [ ] Section is only displayed for MSA Fixed Price and SOW Retainer change requests

### 2. Billing Details Table
- [ ] **Table Display**:
  - [ ] Table has columns: Payment Date, Delivery note, Amount
  - [ ] Table headers are clearly visible
  - [ ] Multiple billing detail rows are displayed
  - [ ] Each row shows billing information

### 3. Billing Fields (Per Row)
- [ ] **Payment Date**:
  - [ ] Value displays payment date (e.g., "2025/12/31")
  - [ ] Value is editable (date picker) when status is "Draft" and current user is the creator
  - [ ] Value is read-only text when status is not "Draft" or user is not the creator

- [ ] **Delivery note**:
  - [ ] Value displays delivery note (e.g., "1 Middle Backend")
  - [ ] Value is editable (text input) when status is "Draft" and current user is the creator
  - [ ] Value is read-only text when status is not "Draft" or user is not the creator

- [ ] **Amount**:
  - [ ] Value displays amount with currency format (e.g., "¥350,000")
  - [ ] Value is editable (text input with currency formatting) when status is "Draft" and current user is the creator
  - [ ] Value is read-only text when status is not "Draft" or user is not the creator
  - [ ] Currency format: ¥ symbol with thousand separators

### 4. Add/Remove Billing Detail (Draft Only)
- [ ] **Add Billing Detail Button**:
  - [ ] "+" icon button is displayed below the table when status is "Draft" and current user is the creator
  - [ ] Button is clickable and adds a new billing detail row
  - [ ] Button is hidden when status is not "Draft" or user is not the creator

- [ ] **Remove Billing Detail Button**:
  - [ ] Remove button (X icon) is displayed for each row (except the first one) when status is "Draft" and current user is the creator
  - [ ] Button is clickable and removes the billing detail row
  - [ ] Button is hidden when status is not "Draft" or user is not the creator

---

## Part 7: Attachments Section

### 1. Section Header
- [ ] **Section Title**:
  - [ ] Section title "Attachments" is displayed
  - [ ] Title is clearly visible and readable
  - [ ] Section has clear visual separation from other sections

### 2. Attachments List
- [ ] **Attachments Display**:
  - [ ] List of uploaded attachments is displayed
  - [ ] Each attachment shows file name
  - [ ] Each attachment has a "View" button (eye icon) to open/download the file
  - [ ] Each attachment has a "Delete" button (trash icon) when status is "Draft" and current user is the creator
  - [ ] Delete button is hidden when status is not "Draft" or user is not the creator
  - [ ] File names are clearly visible
  - [ ] Empty state message is displayed when no attachments exist

### 3. Upload Attachments (Draft Only)
- [ ] **Upload Area**:
  - [ ] Upload area (drag & drop box) is displayed when status is "Draft" and current user is the creator
  - [ ] Upload area is hidden when status is not "Draft" or user is not the creator
  - [ ] Upload area accepts PDF files only
  - [ ] File size limit: 10MB per file
  - [ ] Multiple files can be uploaded
  - [ ] Uploaded files are displayed immediately

---

## Part 8: Approval & Workflow Section

### 1. Section Header
- [ ] **Section Title**:
  - [ ] Section title "Approval & Workflow" is displayed
  - [ ] Title is clearly visible and readable
  - [ ] Section has clear visual separation from other sections

### 2. Internal Reviewer Field
- [ ] **Field Display**:
  - [ ] Label "Internal Reviewer" is displayed
  - [ ] Value displays the reviewer's name (e.g., "Sale Manager 01")
  - [ ] Value is editable (dropdown) when status is "Draft" and current user is the creator
  - [ ] Value is read-only text when status is not "Draft" or user is not the creator
  - [ ] Dropdown shows list of Sales Managers
  - [ ] Field is required when submitting for review

### 3. Review Notes Field (Under Internal Review)
- [ ] **Field Display**:
  - [ ] Label "Review Notes" is displayed when status is "Under Internal Review" and current user is the assigned reviewer
  - [ ] Textarea is displayed and editable when status is "Under Internal Review" and current user is the assigned reviewer
  - [ ] Field is hidden when status is not "Under Internal Review" or user is not the assigned reviewer
  - [ ] Textarea has appropriate height (e.g., 4-6 rows)
  - [ ] Placeholder text: "Enter review notes"

### 4. Actions Dropdown (Under Internal Review)
- [ ] **Field Display**:
  - [ ] Label "Actions" is displayed when status is "Under Internal Review" and current user is the assigned reviewer
  - [ ] Dropdown is displayed with options: "Approve", "Request Revision"
  - [ ] Dropdown is editable when status is "Under Internal Review" and current user is the assigned reviewer
  - [ ] Field is hidden when status is not "Under Internal Review" or user is not the assigned reviewer
  - [ ] Options are clearly visible

### 5. Review Result (After Review)
- [ ] **Field Display**:
  - [ ] Section "Review Result" is displayed when status is "Client Under Review" or after review
  - [ ] Review action is displayed (e.g., "Approved", "Request Revision")
  - [ ] Review notes are displayed (if any)
  - [ ] Reviewer name is displayed
  - [ ] Review date is displayed
  - [ ] Section is read-only

---

## Part 9: Comment Section

### 1. Section Header
- [ ] **Section Title**:
  - [ ] Section title "Comment" is displayed
  - [ ] Title is clearly visible and readable
  - [ ] Section has clear visual separation from other sections

### 2. Comment Content
- [ ] **Content Display**:
  - [ ] Comment text is displayed in a textarea or text block
  - [ ] Content is editable (textarea) when status is "Draft" and current user is the creator
  - [ ] Content is read-only text when status is not "Draft" or user is not the creator
  - [ ] Textarea has appropriate height (e.g., 4-6 rows)
  - [ ] Field is optional (not required)
  - [ ] Max length: 2000 characters

---

## Part 10: History Section

### 1. Section Header
- [ ] **Section Title**:
  - [ ] Section title "History" is displayed
  - [ ] Title is clearly visible and readable
  - [ ] Section has clear visual separation from other sections

### 2. History Timeline
- [ ] **Timeline Display**:
  - [ ] History entries are displayed in chronological order (newest first or oldest first)
  - [ ] Each entry shows:
    - [ ] Date and time
    - [ ] Description/Activity
    - [ ] User who performed the action
    - [ ] Document link (if applicable)
  - [ ] Timeline is clearly formatted and readable
  - [ ] Empty state message is displayed when no history exists

---

## Part 11: Action Buttons

### 1. Save Button (Draft Only)
- [ ] **Button Display**:
  - [ ] "Save" button is displayed when status is "Draft" and current user is the creator
  - [ ] Button is hidden when status is not "Draft" or user is not the creator
  - [ ] Button has appropriate styling (e.g., outline variant)
  - [ ] Button is clickable
  - [ ] Clicking button validates the form and saves changes
  - [ ] Success message is displayed after saving
  - [ ] Modal remains open after saving

### 2. Submit Button (Draft Only)
- [ ] **Button Display**:
  - [ ] "Submit" button is displayed when status is "Draft" and current user is the creator
  - [ ] Button is hidden when status is not "Draft" or user is not the creator
  - [ ] Button has appropriate styling (e.g., primary/blue variant)
  - [ ] Button is clickable
  - [ ] Clicking button validates the form and submits for internal review
  - [ ] Status changes to "Under Internal Review"
  - [ ] Success message is displayed after submitting
  - [ ] Modal closes after submitting

### 3. Submit Review Button (Under Internal Review)
- [ ] **Button Display**:
  - [ ] "Submit Review" button is displayed when status is "Under Internal Review" and current user is the assigned reviewer
  - [ ] Button is hidden when status is not "Under Internal Review" or user is not the assigned reviewer
  - [ ] Button has appropriate styling (e.g., primary/blue variant)
  - [ ] Button is clickable
  - [ ] Clicking button validates Review Notes and Actions fields
  - [ ] If "Approve" is selected, status changes to "Client Under Review"
  - [ ] If "Request Revision" is selected, status changes to "Draft"
  - [ ] Success message is displayed after submitting review
  - [ ] Modal closes after submitting review

### 4. Cancel Button
- [ ] **Button Display**:
  - [ ] "Cancel" button is displayed at all times
  - [ ] Button has appropriate styling (e.g., outline variant)
  - [ ] Button is clickable
  - [ ] Clicking button closes the modal
  - [ ] Unsaved changes warning is displayed if form has been modified (optional)

---

## Part 12: Form Validation

### 1. Required Fields Validation
- [ ] **Validation Rules**:
  - [ ] All required fields are validated before saving/submitting
  - [ ] Error messages are displayed for empty required fields
  - [ ] Error styling (red border) is applied to invalid fields
  - [ ] Form cannot be saved/submitted if validation fails

### 2. Date Validation
- [ ] **Validation Rules**:
  - [ ] Effective until must be after Effective from
  - [ ] Engineer End date must be after Start date
  - [ ] Error messages are displayed for invalid date ranges

### 3. Number Validation
- [ ] **Validation Rules**:
  - [ ] Rating must be between 0% and 100%
  - [ ] Salary must be a positive number
  - [ ] Amount must be a positive number
  - [ ] Error messages are displayed for invalid numbers

### 4. File Validation
- [ ] **Validation Rules**:
  - [ ] Only PDF files are accepted
  - [ ] File size limit is enforced (10MB)
  - [ ] Error messages are displayed for invalid files

---

## Part 13: Role-Based Access

### 1. Sales Manager
- [ ] **Access Rights**:
  - [ ] Can view all change requests for all contracts
  - [ ] Can edit change requests when status is "Draft" (if creator)
  - [ ] Can submit change requests for internal review (if creator)
  - [ ] Can perform internal review actions when assigned as reviewer
  - [ ] Can view all sections and information

### 2. Sales Man (Sales Rep)
- [ ] **Access Rights**:
  - [ ] Can view change requests only for contracts assigned to themselves
  - [ ] Can edit change requests when status is "Draft" (if creator and assigned to their contract)
  - [ ] Can submit change requests for internal review (if creator and assigned to their contract)
  - [ ] Cannot perform internal review actions (only Sales Managers can be reviewers)
  - [ ] Can view all sections and information for accessible change requests

---

## Technical Requirements

### Backend API Endpoints

- [ ] **GET /api/sales/contracts/msa/{msaContractId}/change-requests/{changeRequestId}**:
  - [ ] Returns detailed change request information for MSA
  - [ ] Includes all sections: Overview, Change Summary, References, Engaged Engineers, Billing Details, Attachments, History
  - [ ] Validates user has access to the contract
  - [ ] Returns 200 OK with change request detail DTO
  - [ ] Returns 403 Forbidden if user doesn't have access
  - [ ] Returns 404 Not Found if change request doesn't exist

- [ ] **GET /api/sales/contracts/sow/{sowContractId}/change-requests/{changeRequestId}**:
  - [ ] Returns detailed change request information for SOW
  - [ ] Includes all sections: Overview, Change Summary, References, Engaged Engineers, Billing Details, Attachments, History
  - [ ] Validates user has access to the contract
  - [ ] Returns 200 OK with change request detail DTO
  - [ ] Returns 403 Forbidden if user doesn't have access
  - [ ] Returns 404 Not Found if change request doesn't exist

- [ ] **PUT /api/sales/contracts/msa/{msaContractId}/change-requests/{changeRequestId}**:
  - [ ] Updates change request (Draft status only)
  - [ ] Validates user is the creator
  - [ ] Validates status is "Draft"
  - [ ] Updates all editable fields
  - [ ] Returns 200 OK on success
  - [ ] Returns 400 Bad Request if validation fails
  - [ ] Returns 403 Forbidden if user is not the creator

- [ ] **PUT /api/sales/contracts/sow/{sowContractId}/change-requests/{changeRequestId}**:
  - [ ] Updates change request (Draft status only)
  - [ ] Validates user is the creator
  - [ ] Validates status is "Draft"
  - [ ] Updates all editable fields
  - [ ] Returns 200 OK on success
  - [ ] Returns 400 Bad Request if validation fails
  - [ ] Returns 403 Forbidden if user is not the creator

- [ ] **POST /api/sales/contracts/msa/{msaContractId}/change-requests/{changeRequestId}/submit**:
  - [ ] Submits change request for internal review
  - [ ] Validates user is the creator
  - [ ] Validates status is "Draft"
  - [ ] Changes status to "Under Internal Review"
  - [ ] Returns 200 OK on success
  - [ ] Returns 400 Bad Request if validation fails

- [ ] **POST /api/sales/contracts/sow/{sowContractId}/change-requests/{changeRequestId}/submit**:
  - [ ] Submits change request for internal review
  - [ ] Validates user is the creator
  - [ ] Validates status is "Draft"
  - [ ] Changes status to "Under Internal Review"
  - [ ] Returns 200 OK on success
  - [ ] Returns 400 Bad Request if validation fails

- [ ] **POST /api/sales/contracts/msa/{msaContractId}/change-requests/{changeRequestId}/review**:
  - [ ] Submits internal review
  - [ ] Validates user is the assigned reviewer
  - [ ] Validates status is "Under Internal Review"
  - [ ] If "Approve": Changes status to "Client Under Review"
  - [ ] If "Request Revision": Changes status to "Draft"
  - [ ] Saves review notes and action
  - [ ] Returns 200 OK on success
  - [ ] Returns 400 Bad Request if validation fails

- [ ] **POST /api/sales/contracts/sow/{sowContractId}/change-requests/{changeRequestId}/review**:
  - [ ] Submits internal review
  - [ ] Validates user is the assigned reviewer
  - [ ] Validates status is "Under Internal Review"
  - [ ] If "Approve": Changes status to "Client Under Review"
  - [ ] If "Request Revision": Changes status to "Draft"
  - [ ] Saves review notes and action
  - [ ] Returns 200 OK on success
  - [ ] Returns 400 Bad Request if validation fails

### Frontend Components

- [ ] **ChangeRequestDetailModal Component**:
  - [ ] Displays modal overlay
  - [ ] Handles form state management
  - [ ] Handles form validation
  - [ ] Handles file uploads
  - [ ] Handles dynamic engineer rows
  - [ ] Handles dynamic billing detail rows
  - [ ] Handles form submission
  - [ ] Handles error display
  - [ ] Handles success/error messages
  - [ ] Conditionally shows/hides editable fields based on status and user role
  - [ ] Conditionally shows/hides action buttons based on status and user role

### Data Models

- [ ] **ChangeRequestDetailDTO Interface**:
  ```typescript
  interface ChangeRequestDetailDTO {
    id: number;
    changeRequestId: string;
    title: string;
    type: string;
    summary: string;
    effectiveFrom: string; // Format: YYYY-MM-DD
    effectiveUntil: string; // Format: YYYY-MM-DD
    references?: string;
    status: string;
    createdBy: string;
    createdDate: string; // Format: YYYY-MM-DD
    engagedEngineers: Array<{
      id?: number;
      engineerLevel: string;
      startDate: string; // Format: YYYY-MM-DD
      endDate: string; // Format: YYYY-MM-DD
      rating: number; // Percentage (0-100)
      salary: number; // Currency amount
    }>;
    billingDetails: Array<{
      id?: number;
      paymentDate: string; // Format: YYYY-MM-DD
      deliveryNote: string;
      amount: number; // Currency amount
    }>;
    attachments: Array<{
      id: number;
      fileName: string;
      filePath: string;
      fileSize?: number;
    }>;
    history: Array<{
      id: number;
      date: string; // Format: YYYY-MM-DD
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
  }
  ```

### Database Schema

- [ ] **change_requests table** (already exists):
  - [ ] All required fields are present
  - [ ] `contract_id` and `sow_contract_id` fields exist
  - [ ] `contract_type` field exists
  - [ ] `effective_from` and `effective_until` fields exist

- [ ] **change_request_engaged_engineers table** (already exists):
  - [ ] All required fields are present
  - [ ] Foreign key to `change_requests` table

- [ ] **change_request_billing_details table** (already exists):
  - [ ] All required fields are present
  - [ ] Foreign key to `change_requests` table

- [ ] **change_request_attachments table** (already exists):
  - [ ] All required fields are present
  - [ ] Foreign key to `change_requests` table

- [ ] **change_request_history table** (if exists):
  - [ ] All required fields are present
  - [ ] Foreign key to `change_requests` table

### Testing Requirements

- [ ] **Unit Tests**:
  - [ ] Test form validation logic
  - [ ] Test date validation
  - [ ] Test number validation
  - [ ] Test file validation
  - [ ] Test conditional field display logic
  - [ ] Test conditional button display logic

- [ ] **Integration Tests**:
  - [ ] Test API endpoint returns change request detail correctly
  - [ ] Test update change request endpoint
  - [ ] Test submit change request endpoint
  - [ ] Test submit review endpoint
  - [ ] Test role-based access control
  - [ ] Test status transitions

- [ ] **E2E Tests**:
  - [ ] Test opening change request detail modal
  - [ ] Test viewing all sections
  - [ ] Test editing draft change request
  - [ ] Test saving draft change request
  - [ ] Test submitting change request for review
  - [ ] Test performing internal review actions
  - [ ] Test form validation
  - [ ] Test file upload and deletion
  - [ ] Test conditional field/button display

## Dependencies

- Story-27: Sales List Change Requests for SOW (Change Requests table structure)
- Story-28: Sales Create Change Request for SOW Retainer (CR structure reference)
- Story-29: Sales Create Change Request for MSA Fixed Price (CR structure reference)
- Story-16: Client Change Request Detail (UI/UX pattern reference)
- Backend API for change requests must be available
- S3 service for file uploads must be configured (optional)

## Notes

- This story focuses on viewing and managing change request details for Sales users
- The modal should support both MSA and SOW change requests
- Editable fields are only available when status is "Draft" and current user is the creator
- Internal review actions are only available when status is "Under Internal Review" and current user is the assigned reviewer
- Engaged Engineers and Billing Details sections are only displayed for MSA Fixed Price and SOW Retainer change requests
- The modal should handle both create and edit scenarios (though editing is only for Draft status)
- Status transitions should be clearly indicated and validated
- Role-based access control should be strictly enforced

