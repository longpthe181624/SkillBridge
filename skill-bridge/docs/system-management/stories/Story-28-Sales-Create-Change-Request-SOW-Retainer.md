# User Story: Sales Create Change Request for SOW Retainer

## Story Information
- **Story ID**: Story-28
- **Title**: Sales Create Change Request for SOW Retainer
- **Epic**: Sales Portal - Contract Management
- **Priority**: High
- **Story Points**: 21
- **Sprint**: Sprint 6
- **Status**: Draft

## User Story
**As a** Sales User (Sales Manager or Sales Man)  
**I want to** create a new change request for a Retainer SOW contract through a form  
**So that** I can request modifications to the contract schedule, resources, rates, or other terms, track engaged engineers and billing details, and manage the change request workflow

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] I can open the "Create Change Request" form by clicking the "+ New Change Request" button in the Change Requests tab
- [ ] The form displays all required sections: Overview, Change Summary, References, Attachments, Engaged Engineer, Billing details, Approval & Workflow, and Comment
- [ ] I can fill in all required fields for a Retainer SOW change request
- [ ] I can add multiple engaged engineers with their details
- [ ] I can add multiple billing detail rows
- [ ] I can upload attachments (PDF files)
- [ ] I can assign an internal reviewer
- [ ] I can save the change request as draft or submit for review
- [ ] I can cancel the form without saving
- [ ] The form matches the wireframe design exactly
- [ ] When the change request is approved by the client, billing details are automatically added to the SOW contract's billing details

### Detailed Acceptance Criteria

#### 1. Form Trigger and Display

- [ ] **Button Location**:
  - [ ] "+ New Change Request" button is displayed in the top-right corner of the Change Requests tab header
  - [ ] Button has blue border and text (border-blue-600 text-blue-600)
  - [ ] Button includes a Plus icon on the left
  - [ ] Button is clickable and opens the form when clicked
  - [ ] Button is only visible when viewing a Retainer SOW contract

- [ ] **Form Display**:
  - [ ] Form appears as a modal overlay on top of the SOW contract detail page
  - [ ] Modal has a semi-transparent dark background (backdrop)
  - [ ] Modal is centered on the screen
  - [ ] Modal has a white background with rounded corners
  - [ ] Modal has appropriate padding and spacing
  - [ ] Modal is scrollable if content exceeds viewport height

- [ ] **Form Header**:
  - [ ] Form title "Create Change Request" is displayed at the top center
  - [ ] Close button (X icon) is displayed in the top-right corner
  - [ ] Close button is clickable and closes the form without saving
  - [ ] Clicking outside the modal (on backdrop) also closes the form (optional)

#### 2. Overview Section

- [ ] **CR Title Field**:
  - [ ] Label "CR Title" is displayed above the input field
  - [ ] Text input field is displayed and editable
  - [ ] Field accepts alphanumeric characters and common symbols
  - [ ] Field has appropriate placeholder text (e.g., "Enter change request title")
  - [ ] Field is required (validation required)
  - [ ] Field has maximum length validation (255 characters)
  - [ ] Error message is displayed if field is empty on submit
  - [ ] Error styling (red border) is applied when validation fails

- [ ] **CR Type Field**:
  - [ ] Label "CR Type" is displayed above the select field
  - [ ] Dropdown select field is displayed and clickable
  - [ ] Field is required (validation required)
  - [ ] Options for Retainer SOW contracts:
    - [ ] "Extend Schedule" is available
    - [ ] "Rate Change" is available
    - [ ] "Increase Resource" is available
    - [ ] "Other" is available
  - [ ] Only these four options are shown for Retainer contracts
  - [ ] Error message is displayed if no option is selected on submit
  - [ ] Error styling (red border) is applied when validation fails

- [ ] **Effective from Field**:
  - [ ] Label "Effective from" is displayed above the date input field
  - [ ] Date input field is displayed with calendar icon
  - [ ] Date picker opens when clicking the field or calendar icon
  - [ ] Date format: YYYY/MM/DD or YYYY-MM-DD
  - [ ] Field is required (validation required)
  - [ ] Error message is displayed if field is empty on submit
  - [ ] Error styling (red border) is applied when validation fails

- [ ] **Effective until Field**:
  - [ ] Label "Effective until" is displayed above the date input field
  - [ ] Date input field is displayed with calendar icon
  - [ ] Date picker opens when clicking the field or calendar icon
  - [ ] Date format: YYYY/MM/DD or YYYY-MM-DD
  - [ ] Field is required (validation required)
  - [ ] Validation: Effective until must be after Effective from
  - [ ] Error message is displayed if field is empty or invalid on submit
  - [ ] Error styling (red border) is applied when validation fails

#### 3. Change Summary Section

- [ ] **Change Summary Field**:
  - [ ] Label "Change Summary" is displayed above the textarea
  - [ ] Multi-line textarea is displayed and editable
  - [ ] Textarea accepts multiple lines of text
  - [ ] Textarea has placeholder text: "Enter Change summary of the change request"
  - [ ] Textarea has appropriate height (4-6 rows)
  - [ ] Textarea is required (validation required)
  - [ ] Textarea has maximum length validation (2000 characters)
  - [ ] Error message is displayed if field is empty on submit
  - [ ] Error styling (red border) is applied when validation fails

#### 4. References Section

- [ ] **References Field**:
  - [ ] Label "References" is displayed above the input field
  - [ ] Text input field is displayed and editable
  - [ ] Field accepts URLs or text references
  - [ ] Field has placeholder text (e.g., "Enter reference links or documents")
  - [ ] Field is optional (not required)
  - [ ] Field accepts multiple references separated by commas or newlines (optional)

#### 5. Attachments Section

- [ ] **Attachments Upload Area**:
  - [ ] Label "Attachments" is displayed above the upload area
  - [ ] Large dashed-border box is displayed with text "Click or Drag & Drop file here"
  - [ ] Upload area is clickable and opens file picker
  - [ ] Drag and drop functionality works
  - [ ] Only PDF files are accepted
  - [ ] File size limit: 10MB per file (configurable)
  - [ ] Multiple files can be uploaded
  - [ ] Uploaded files are displayed with file name and remove button
  - [ ] Error message is displayed if file type is invalid
  - [ ] Error message is displayed if file size exceeds limit
  - [ ] Files are uploaded to S3 (if enabled) or local storage

#### 6. Engaged Engineer Section

- [ ] **Section Header**:
  - [ ] Label "Engaged Engineer" is displayed as section header
  - [ ] Section is clearly visible and separated from other sections

- [ ] **Engineer Fields (Per Row)**:
  - [ ] **Engineer Level Field**:
    - [ ] Label "Engineer Level" is displayed above the input field
    - [ ] Text input field is displayed and editable
    - [ ] Field accepts text (e.g., "Middle BE", "Senior FE")
    - [ ] Field is required for each engineer row
    - [ ] Error message is displayed if field is empty on submit

  - [ ] **Start date Field**:
    - [ ] Label "Start date" is displayed above the date input field
    - [ ] Date input field is displayed with calendar icon
    - [ ] Date picker opens when clicking the field or calendar icon
    - [ ] Date format: YYYY/MM/DD or YYYY-MM-DD
    - [ ] Field is required for each engineer row
    - [ ] Error message is displayed if field is empty on submit

  - [ ] **End date Field**:
    - [ ] Label "End date" is displayed above the date input field
    - [ ] Date input field is displayed with calendar icon
    - [ ] Date picker opens when clicking the field or calendar icon
    - [ ] Date format: YYYY/MM/DD or YYYY-MM-DD
    - [ ] Field is required for each engineer row
    - [ ] Validation: End date must be after Start date
    - [ ] Error message is displayed if field is empty or invalid on submit

  - [ ] **Rating Field**:
    - [ ] Label "Rating" is displayed above the input field
    - [ ] Text input field is displayed and editable
    - [ ] Field accepts percentage values (e.g., "100%", "80%")
    - [ ] Field is required for each engineer row
    - [ ] Validation: Rating must be between 0% and 100%
    - [ ] Error message is displayed if field is empty or invalid on submit

  - [ ] **Salary Field**:
    - [ ] Label "Salary" is displayed above the input field
    - [ ] Text input field is displayed and editable
    - [ ] Field accepts currency values (e.g., "¥350,000")
    - [ ] Field is formatted with "¥" symbol and thousand separators
    - [ ] Field is required for each engineer row
    - [ ] Validation: Salary must be a positive number
    - [ ] Error message is displayed if field is empty or invalid on submit

- [ ] **Add Engineer Button**:
  - [ ] "+" icon button is displayed below the engineer rows
  - [ ] Button is clickable and adds a new engineer row
  - [ ] Multiple engineer rows can be added
  - [ ] At least one engineer row is required (validation)

- [ ] **Remove Engineer Button**:
  - [ ] Remove button (X icon) is displayed for each engineer row (except the first one)
  - [ ] Button is clickable and removes the engineer row
  - [ ] Confirmation dialog is shown before removing (optional)

#### 7. Billing Details Section

- [ ] **Section Header**:
  - [ ] Label "Billing details" is displayed as section header
  - [ ] Section is clearly visible and separated from other sections

- [ ] **Billing Details Table**:
  - [ ] Table has three columns: "Payment Date", "Delivery note", "Amount"
  - [ ] Table headers are clearly visible
  - [ ] Table rows are editable
  - [ ] At least one billing detail row is required (validation)

- [ ] **Payment Date Column**:
  - [ ] Date input field is displayed in each row
  - [ ] Date picker opens when clicking the field
  - [ ] Date format: YYYY/MM/DD or YYYY-MM-DD
  - [ ] Field is required for each row
  - [ ] Error message is displayed if field is empty on submit

- [ ] **Delivery note Column**:
  - [ ] Text input field is displayed in each row
  - [ ] Field accepts text (e.g., "1 Middle Backend")
  - [ ] Field is required for each row
  - [ ] Error message is displayed if field is empty on submit

- [ ] **Amount Column**:
  - [ ] Text input field is displayed in each row
  - [ ] Field accepts currency values (e.g., "¥350,000")
  - [ ] Field is formatted with "¥" symbol and thousand separators
  - [ ] Field is required for each row
  - [ ] Validation: Amount must be a positive number
  - [ ] Error message is displayed if field is empty or invalid on submit

- [ ] **Add Billing Detail Button**:
  - [ ] "+" icon button is displayed below the table
  - [ ] Button is clickable and adds a new billing detail row
  - [ ] Multiple billing detail rows can be added

- [ ] **Remove Billing Detail Button**:
  - [ ] Remove button (X icon) is displayed for each row (except the first one)
  - [ ] Button is clickable and removes the billing detail row
  - [ ] Confirmation dialog is shown before removing (optional)

#### 8. Approval & Workflow Section

- [ ] **Internal Reviewer Field**:
  - [ ] Label "Internal Reviewer" is displayed above the select field
  - [ ] Dropdown select field is displayed and clickable
  - [ ] Field shows list of Sales Managers
  - [ ] Field is required (validation required)
  - [ ] Error message is displayed if no reviewer is selected on submit
  - [ ] Error styling (red border) is applied when validation fails

- [ ] **Status Field**:
  - [ ] Label "Status" is displayed above the field
  - [ ] Read-only text field is displayed
  - [ ] Status displays "Under Internal Review" when form is submitted
  - [ ] Status displays "Draft" when form is saved as draft
  - [ ] Field is not editable by user

#### 9. Comment Section

- [ ] **Comment Field**:
  - [ ] Label "Comment" is displayed above the textarea
  - [ ] Multi-line textarea is displayed and editable
  - [ ] Textarea accepts multiple lines of text
  - [ ] Textarea has appropriate height (4-6 rows)
  - [ ] Textarea is optional (not required)
  - [ ] Textarea has maximum length validation (2000 characters)

#### 10. Action Buttons

- [ ] **Cancel Button**:
  - [ ] "Cancel" button is displayed at the bottom of the form
  - [ ] Button has grey/outline styling
  - [ ] Button is clickable
  - [ ] Clicking button closes the form without saving
  - [ ] Confirmation dialog is shown if form has unsaved changes (optional)

- [ ] **Save Button**:
  - [ ] "Save" button is displayed at the bottom of the form
  - [ ] Button has blue/primary styling
  - [ ] Button is clickable
  - [ ] Clicking button validates the form
  - [ ] If validation passes, form is saved as draft
  - [ ] Status is set to "Draft"
  - [ ] Success message is displayed after saving
  - [ ] Form closes and change requests list is refreshed
  - [ ] If validation fails, error messages are displayed

- [ ] **Submit Button (Optional)**:
  - [ ] "Submit" button may be displayed alongside Save button
  - [ ] Clicking button validates the form
  - [ ] If validation passes, form is submitted for review
  - [ ] Status is set to "Under Internal Review"
  - [ ] Internal reviewer is notified (future enhancement)
  - [ ] Success message is displayed after submitting
  - [ ] Form closes and change requests list is refreshed

#### 11. Form Validation

- [ ] **Required Fields Validation**:
  - [ ] All required fields are validated before submission
  - [ ] Error messages are displayed for empty required fields
  - [ ] Error styling (red border) is applied to invalid fields
  - [ ] Form cannot be submitted if validation fails

- [ ] **Date Validation**:
  - [ ] Effective until must be after Effective from
  - [ ] Engineer End date must be after Start date
  - [ ] Error messages are displayed for invalid date ranges

- [ ] **Number Validation**:
  - [ ] Rating must be between 0% and 100%
  - [ ] Salary must be a positive number
  - [ ] Amount must be a positive number
  - [ ] Error messages are displayed for invalid numbers

- [ ] **File Validation**:
  - [ ] Only PDF files are accepted
  - [ ] File size limit is enforced
  - [ ] Error messages are displayed for invalid files

#### 12. Data Persistence

- [ ] **Change Request Creation**:
  - [ ] Change request is saved to `change_requests` table
  - [ ] Change request ID is generated in format "CR-YYYY-NN"
  - [ ] All form fields are saved correctly
  - [ ] `sow_contract_id` is set to the current SOW contract ID
  - [ ] `contract_type` is set to "SOW"
  - [ ] `created_by` is set to the current user ID
  - [ ] `status` is set based on action (Draft or Under Internal Review)

- [ ] **Engaged Engineers**:
  - [ ] Engaged engineers are saved to `change_request_engaged_engineers` table
  - [ ] Each engineer row is saved with `change_request_id` reference
  - [ ] All engineer fields are saved correctly

- [ ] **Billing Details**:
  - [ ] Billing details are saved to `change_request_billing_details` table (if exists) or stored in change request
  - [ ] Each billing detail row is saved with `change_request_id` reference
  - [ ] All billing detail fields are saved correctly
  - [ ] Billing details are NOT automatically added to SOW contract billing details until approved

- [ ] **Attachments**:
  - [ ] Attachments are uploaded to S3 (if enabled) or local storage
  - [ ] Attachment metadata is saved to `change_request_attachments` table (if exists)
  - [ ] Attachment links are stored in change request entity

#### 13. Approval Workflow Integration

- [ ] **When Change Request is Approved by Client**:
  - [ ] System detects when change request status changes to "Approved"
  - [ ] Billing details from the change request are automatically added to SOW contract's `retainer_billing_details` table
  - [ ] Each billing detail row is created with:
    - [ ] `sow_contract_id` set to the SOW contract ID
    - [ ] `payment_date` from change request billing detail
    - [ ] `delivery_note` from change request billing detail
    - [ ] `amount` from change request billing detail
    - [ ] `change_request_id` set to the approved change request ID
    - [ ] `delivery_item_id` set to NULL (as these are from change request, not original delivery items)
  - [ ] SOW contract's total value is updated to include the change request amounts
  - [ ] History entry is created in `contract_history` table documenting the approval and billing details addition
  - [ ] Success notification is sent to relevant stakeholders (future enhancement)

#### 14. Role-Based Access

- [ ] **Sales Manager**:
  - [ ] Can create change requests for any Retainer SOW contract
  - [ ] Can assign any Sales Manager as internal reviewer
  - [ ] Can save as draft or submit for review

- [ ] **Sales Man (Sales Rep)**:
  - [ ] Can create change requests only for Retainer SOW contracts assigned to themselves
  - [ ] Can assign any Sales Manager as internal reviewer
  - [ ] Can save as draft or submit for review

#### 15. Error Handling

- [ ] **API Errors**:
  - [ ] Error messages are displayed if API call fails
  - [ ] Handles 400 Bad Request (validation errors)
  - [ ] Handles 403 Forbidden (access denied)
  - [ ] Handles 404 Not Found (SOW contract not found)
  - [ ] Handles 500 Internal Server Error
  - [ ] Error messages are user-friendly

- [ ] **Network Errors**:
  - [ ] Displays network error message
  - [ ] Provides retry option (optional)

- [ ] **Validation Errors**:
  - [ ] All validation errors are displayed clearly
  - [ ] Error messages are specific to each field
  - [ ] Form scrolls to first error field (optional)

## Technical Requirements

### Backend API Endpoints

- [ ] **POST /api/sales/contracts/sow/{sowContractId}/change-requests**:
  - [ ] Creates a new change request for the specified Retainer SOW contract
  - [ ] Accepts multipart/form-data for file uploads
  - [ ] Request body includes:
    - [ ] `title` (required): CR Title
    - [ ] `type` (required): CR Type (Extend Schedule, Rate Change, Increase Resource, Other)
    - [ ] `summary` (required): Change Summary
    - [ ] `effectiveFrom` (required): Effective from date (YYYY-MM-DD)
    - [ ] `effectiveUntil` (required): Effective until date (YYYY-MM-DD)
    - [ ] `references` (optional): References text
    - [ ] `attachments` (optional): Array of PDF files
    - [ ] `engagedEngineers` (required): JSON array of engineer objects
    - [ ] `billingDetails` (required): JSON array of billing detail objects
    - [ ] `internalReviewerId` (required): Internal reviewer user ID
    - [ ] `comment` (optional): Comment text
    - [ ] `action` (required): "save" or "submit"
  - [ ] Validates that SOW contract is Retainer type
  - [ ] Validates user has access to the SOW contract
  - [ ] Generates change request ID in format "CR-YYYY-NN"
  - [ ] Saves change request with status "Draft" or "Under Internal Review"
  - [ ] Saves engaged engineers
  - [ ] Saves billing details
  - [ ] Uploads attachments to S3
  - [ ] Returns change request DTO with generated ID
  - [ ] Returns 400 Bad Request if validation fails
  - [ ] Returns 403 Forbidden if user doesn't have access
  - [ ] Returns 404 Not Found if SOW contract doesn't exist

- [ ] **PUT /api/sales/contracts/sow/{sowContractId}/change-requests/{changeRequestId}/approve** (Future):
  - [ ] Updates change request status to "Approved"
  - [ ] Adds billing details to SOW contract's `retainer_billing_details` table
  - [ ] Updates SOW contract total value
  - [ ] Creates history entry
  - [ ] Returns success response

### Frontend Components

- [ ] **CreateChangeRequestModal Component**:
  - [ ] Displays modal overlay
  - [ ] Handles form state management
  - [ ] Handles form validation
  - [ ] Handles file uploads
  - [ ] Handles dynamic engineer rows
  - [ ] Handles dynamic billing detail rows
  - [ ] Handles form submission
  - [ ] Handles error display
  - [ ] Handles success/error messages

- [ ] **EngagedEngineerRow Component**:
  - [ ] Displays engineer fields in a row
  - [ ] Handles engineer data
  - [ ] Handles remove functionality
  - [ ] Validates engineer fields

- [ ] **BillingDetailRow Component**:
  - [ ] Displays billing detail fields in a row
  - [ ] Handles billing detail data
  - [ ] Handles remove functionality
  - [ ] Validates billing detail fields

### Data Models

- [ ] **CreateChangeRequestFormData Interface**:
  ```typescript
  interface CreateChangeRequestFormData {
    title: string;
    type: 'Extend Schedule' | 'Rate Change' | 'Increase Resource' | 'Other';
    summary: string;
    effectiveFrom: string; // Format: YYYY-MM-DD
    effectiveUntil: string; // Format: YYYY-MM-DD
    references?: string;
    attachments?: File[];
    engagedEngineers: Array<{
      engineerLevel: string;
      startDate: string; // Format: YYYY-MM-DD
      endDate: string; // Format: YYYY-MM-DD
      rating: number; // Percentage (0-100)
      salary: number; // Currency amount
    }>;
    billingDetails: Array<{
      paymentDate: string; // Format: YYYY-MM-DD
      deliveryNote: string;
      amount: number; // Currency amount
    }>;
    internalReviewerId: number;
    comment?: string;
    action: 'save' | 'submit';
  }
  ```

### Database Schema

- [ ] **change_requests table** (already exists):
  - [ ] All required fields are present
  - [ ] `sow_contract_id` field exists
  - [ ] `contract_type` field exists
  - [ ] `effective_from` and `effective_until` fields exist

- [ ] **change_request_engaged_engineers table** (already exists):
  - [ ] All required fields are present
  - [ ] Foreign key to `change_requests` table

- [ ] **change_request_billing_details table** (if exists):
  - [ ] All required fields are present
  - [ ] Foreign key to `change_requests` table

- [ ] **retainer_billing_details table** (already exists):
  - [ ] `change_request_id` field exists (nullable)
  - [ ] Foreign key to `change_requests` table (optional)

### Testing Requirements

- [ ] **Unit Tests**:
  - [ ] Test form validation logic
  - [ ] Test date validation
  - [ ] Test number validation
  - [ ] Test file validation
  - [ ] Test engineer row add/remove
  - [ ] Test billing detail row add/remove

- [ ] **Integration Tests**:
  - [ ] Test API endpoint creates change request correctly
  - [ ] Test engaged engineers are saved correctly
  - [ ] Test billing details are saved correctly
  - [ ] Test attachments are uploaded correctly
  - [ ] Test role-based access control
  - [ ] Test approval workflow adds billing details to SOW

- [ ] **E2E Tests**:
  - [ ] Test opening create change request form
  - [ ] Test filling in all required fields
  - [ ] Test adding multiple engineers
  - [ ] Test adding multiple billing details
  - [ ] Test uploading attachments
  - [ ] Test saving as draft
  - [ ] Test submitting for review
  - [ ] Test form validation
  - [ ] Test cancel functionality
  - [ ] Test approval workflow integration

## Wireframe Reference

Based on the provided wireframe:
- Form title: "Create Change Request"
- Overview section: CR Title, CR Type, Effective from, Effective until
- Change Summary section: Large textarea
- References section: Text input
- Attachments section: Drag & drop area
- Engaged Engineer section: Table with Engineer Level, Start date, End date, Rating, Salary, and "+" button
- Billing details section: Table with Payment Date, Delivery note, Amount
- Approval & Workflow section: Internal Reviewer dropdown, Status (read-only)
- Comment section: Large textarea
- Action buttons: Cancel (grey), Save (blue)

## Dependencies

- Story-27: Sales List Change Requests for SOW (Change Requests tab must exist)
- Story-26: Sales Create SOW (SOW contract detail page must exist)
- Backend API for change requests must be available
- S3 service for file uploads must be configured (optional)

## Notes

- This story focuses on creating change requests for Retainer SOW contracts only
- Fixed Price SOW change requests will be handled in a separate story
- The approval workflow that adds billing details to SOW is a key requirement
- Engaged engineers and billing details are specific to Retainer change requests
- The form should only be accessible when viewing a Retainer SOW contract
- When change request is approved, billing details are automatically integrated into the SOW contract's billing schedule

