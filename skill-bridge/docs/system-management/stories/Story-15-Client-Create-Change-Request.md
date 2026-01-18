# User Story: Client Create Change Request

## Story Information
- **Story ID**: Story-15
- **Title**: Client Create Change Request
- **Epic**: Client Portal - Contract Management
- **Priority**: High
- **Story Points**: 13
- **Sprint**: Sprint 4
- **Status**: Ready for Development

## User Story
**As a** Client  
**I want to** create a new change request for my SOW contract through a modal form  
**So that** I can request modifications to the contract scope, schedule, resources, or other terms, and track the status of my change requests

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] I can open the "Create Change Request" modal by clicking the "+New Change Request" button in the Change Requests tab
- [ ] The modal displays a form with three sections: Overview, Attachments, and Desired Impact
- [ ] I can fill in all required fields in the Overview section
- [ ] I can upload attachments in the Attachments section
- [ ] I can specify desired impact details in the Desired Impact section
- [ ] CR Type options differ based on contract engagement type (Fixed Price vs Retainer)
- [ ] I can submit the change request, save as draft, or cancel the form
- [ ] The modal matches the wireframe design
- [ ] Form validation prevents submission of invalid data
- [ ] Success/error messages are displayed appropriately

---

## Part 1: Modal Overview

### 1. Modal Trigger
- [ ] **Button Location**:
  - [ ] "+New Change Request" button is displayed in the top-right corner of the Change Requests tab header
  - [ ] Button has blue border and text (border-blue-600 text-blue-600)
  - [ ] Button includes a Plus icon on the left
  - [ ] Button is clickable and opens the modal when clicked

- [ ] **Modal Display**:
  - [ ] Modal appears as an overlay on top of the contract detail page
  - [ ] Modal has a semi-transparent dark background (backdrop)
  - [ ] Modal is centered on the screen
  - [ ] Modal has a white background with rounded corners
  - [ ] Modal has appropriate padding and spacing

### 2. Modal Header
- [ ] **Title**:
  - [ ] Modal title "Create Change Request" is displayed at the top center
  - [ ] Title uses appropriate font size and styling
  - [ ] Title is clearly visible and readable

- [ ] **Close Button**:
  - [ ] Close button (X icon) is displayed in the top-right corner
  - [ ] Close button is clickable
  - [ ] Clicking close button closes the modal without saving
  - [ ] Clicking outside the modal (on backdrop) also closes the modal (optional)

---

## Part 2: Overview Section

### 1. CR Title Field
- [ ] **Field Label**:
  - [ ] Label "CR Title" is displayed above the input field
  - [ ] Label is clearly visible and readable

- [ ] **Input Field**:
  - [ ] Text input field is displayed
  - [ ] Field is editable
  - [ ] Field accepts alphanumeric characters and common symbols
  - [ ] Field has appropriate placeholder text (e.g., "Enter change request title")
  - [ ] Field is required (validation required)
  - [ ] Field has maximum length validation (e.g., 255 characters)

- [ ] **Validation**:
  - [ ] Error message is displayed if field is empty on submit
  - [ ] Error message is displayed if field exceeds maximum length
  - [ ] Error styling (red border) is applied when validation fails

### 2. CR Type Field
- [ ] **Field Label**:
  - [ ] Label "CR Type" is displayed above the select field
  - [ ] Label is clearly visible and readable

- [ ] **Select Field**:
  - [ ] Dropdown select field is displayed
  - [ ] Field is clickable and opens dropdown options
  - [ ] Field is required (validation required)

- [ ] **Options for Fixed Price Contracts**:
  - [ ] Option "Add Scope" is available
  - [ ] Option "Remove Scope" is available
  - [ ] Option "Other" is available
  - [ ] Only these three options are shown for Fixed Price contracts

- [ ] **Options for Retainer Contracts**:
  - [ ] Option "Extend Schedule" is available
  - [ ] Option "Increase Resource" is available
  - [ ] Option "Rate Change" is available
  - [ ] Option "Other" is available
  - [ ] Only these four options are shown for Retainer contracts

- [ ] **Contract Type Detection**:
  - [ ] System correctly identifies contract engagement type (Fixed Price or Retainer)
  - [ ] Appropriate CR Type options are displayed based on contract type
  - [ ] Options are dynamically loaded based on contract type

- [ ] **Validation**:
  - [ ] Error message is displayed if no option is selected on submit
  - [ ] Error styling (red border) is applied when validation fails

### 3. Description Field
- [ ] **Field Label**:
  - [ ] Label "Description" is displayed above the textarea
  - [ ] Label is clearly visible and readable

- [ ] **Textarea Field**:
  - [ ] Multi-line textarea is displayed
  - [ ] Textarea is editable
  - [ ] Textarea accepts multiple lines of text
  - [ ] Textarea has appropriate placeholder text (e.g., "Enter description of the change request")
  - [ ] Textarea has appropriate height (e.g., 4-6 rows)
  - [ ] Textarea is required (validation required)
  - [ ] Textarea has maximum length validation (e.g., 2000 characters)

- [ ] **Validation**:
  - [ ] Error message is displayed if field is empty on submit
  - [ ] Error message is displayed if field exceeds maximum length
  - [ ] Error styling (red border) is applied when validation fails

### 4. Reason Field
- [ ] **Field Label**:
  - [ ] Label "Reason" is displayed above the textarea
  - [ ] Label is clearly visible and readable

- [ ] **Textarea Field**:
  - [ ] Multi-line textarea is displayed
  - [ ] Textarea is editable
  - [ ] Textarea accepts multiple lines of text
  - [ ] Textarea has appropriate placeholder text (e.g., "Enter reason for the change request")
  - [ ] Textarea has appropriate height (e.g., 4-6 rows)
  - [ ] Textarea is required (validation required)
  - [ ] Textarea has maximum length validation (e.g., 2000 characters)

- [ ] **Validation**:
  - [ ] Error message is displayed if field is empty on submit
  - [ ] Error message is displayed if field exceeds maximum length
  - [ ] Error styling (red border) is applied when validation fails

---

## Part 3: Attachments Section

### 1. Section Header
- [ ] **Section Title**:
  - [ ] Section title "Attachments" is displayed
  - [ ] Title is clearly visible and readable
  - [ ] Section has clear visual separation from other sections

### 2. File Upload Area
- [ ] **Upload Zone**:
  - [ ] Large rectangular area with dashed border is displayed
  - [ ] Area has appropriate padding and spacing
  - [ ] Area has text "Click or Drag & Drop file here" (or similar)
  - [ ] Area is clickable and opens file picker when clicked
  - [ ] Area accepts drag and drop of files

- [ ] **File Types**:
  - [ ] System accepts common file types (PDF, DOC, DOCX, XLS, XLSX, images, etc.)
  - [ ] File type validation is performed
  - [ ] Error message is displayed for unsupported file types

- [ ] **File Size**:
  - [ ] Maximum file size limit is enforced (e.g., 10MB per file)
  - [ ] Error message is displayed if file exceeds size limit
  - [ ] Multiple files can be uploaded (optional)

- [ ] **File Display**:
  - [ ] Uploaded files are displayed in a list below the upload area
  - [ ] Each file shows filename and file size
  - [ ] Remove button (X icon) is available for each uploaded file
  - [ ] Files can be removed before submission

- [ ] **Validation**:
  - [ ] Attachments are optional (no validation required)
  - [ ] If files are uploaded, they are validated for type and size

---

## Part 4: Desired Impact Section

### 1. Section Header
- [ ] **Section Title**:
  - [ ] Section title "Desired Impact" is displayed
  - [ ] Title is clearly visible and readable
  - [ ] Section has clear visual separation from other sections

### 2. Desired Start Date Field
- [ ] **Field Label**:
  - [ ] Label "Desired Start Date" is displayed above the input field
  - [ ] Label is clearly visible and readable

- [ ] **Date Input Field**:
  - [ ] Date input field is displayed
  - [ ] Field accepts date input
  - [ ] Date picker is available (calendar icon or native date picker)
  - [ ] Date format is displayed as YYYY/MM/DD (e.g., "2025/11/1")
  - [ ] Field is required (validation required)
  - [ ] Field validates that date is not in the past (optional)
  - [ ] Field validates that date is a valid date format

- [ ] **Validation**:
  - [ ] Error message is displayed if field is empty on submit
  - [ ] Error message is displayed if date is invalid
  - [ ] Error styling (red border) is applied when validation fails

### 3. Desired End Date Field
- [ ] **Field Label**:
  - [ ] Label "Desired End Date" is displayed above the input field
  - [ ] Label is clearly visible and readable

- [ ] **Date Input Field**:
  - [ ] Date input field is displayed
  - [ ] Field accepts date input
  - [ ] Date picker is available (calendar icon or native date picker)
  - [ ] Date format is displayed as YYYY/MM/DD (e.g., "2025/12/31")
  - [ ] Field is required (validation required)
  - [ ] Field validates that end date is after start date
  - [ ] Field validates that date is a valid date format

- [ ] **Validation**:
  - [ ] Error message is displayed if field is empty on submit
  - [ ] Error message is displayed if date is invalid
  - [ ] Error message is displayed if end date is before start date
  - [ ] Error styling (red border) is applied when validation fails

### 4. Expected Extra Cost Field
- [ ] **Field Label**:
  - [ ] Label "Expected Extra Cost" is displayed above the input field
  - [ ] Label is clearly visible and readable

- [ ] **Currency Input Field**:
  - [ ] Number input field is displayed
  - [ ] Field accepts numeric input
  - [ ] Field displays currency format with ¥ symbol (e.g., "¥700,000")
  - [ ] Field formats numbers with thousand separators
  - [ ] Field is required (validation required)
  - [ ] Field validates that value is a positive number
  - [ ] Field has maximum value validation (optional)

- [ ] **Validation**:
  - [ ] Error message is displayed if field is empty on submit
  - [ ] Error message is displayed if value is not a valid number
  - [ ] Error message is displayed if value is negative
  - [ ] Error styling (red border) is applied when validation fails

---

## Part 5: Action Buttons

### 1. Submit Change Request Button
- [ ] **Button Display**:
  - [ ] Button "Submit Change Request" is displayed at the bottom of the modal
  - [ ] Button is a primary button (default/primary styling)
  - [ ] Button is clickable

- [ ] **Button Functionality**:
  - [ ] Clicking button validates all required fields
  - [ ] If validation passes, change request is submitted to backend
  - [ ] Loading state is displayed while submitting
  - [ ] Success message is displayed after successful submission
  - [ ] Modal closes after successful submission
  - [ ] Change Requests list is refreshed to show new change request
  - [ ] If validation fails, error messages are displayed

- [ ] **Backend Integration**:
  - [ ] POST request is sent to `/api/client/contracts/{contractId}/change-requests`
  - [ ] Request includes all form data
  - [ ] Request includes uploaded files (if any)
  - [ ] Request includes contract ID and user ID
  - [ ] Response is handled appropriately (success/error)

### 2. Save Draft Button
- [ ] **Button Display**:
  - [ ] Button "Save Draft" is displayed at the bottom of the modal
  - [ ] Button is a secondary button (outline styling)
  - [ ] Button is clickable

- [ ] **Button Functionality**:
  - [ ] Clicking button saves change request as draft
  - [ ] Draft can be saved even if some required fields are empty
  - [ ] Loading state is displayed while saving
  - [ ] Success message is displayed after successful save
  - [ ] Modal closes after successful save
  - [ ] Change Requests list is refreshed to show draft change request
  - [ ] Draft can be edited later (future enhancement)

- [ ] **Backend Integration**:
  - [ ] POST request is sent to `/api/client/contracts/{contractId}/change-requests/draft`
  - [ ] Request includes all form data (including empty fields)
  - [ ] Request includes uploaded files (if any)
  - [ ] Request includes contract ID and user ID
  - [ ] Response is handled appropriately (success/error)

### 3. Cancel Button
- [ ] **Button Display**:
  - [ ] Button "Cancel" is displayed at the bottom of the modal
  - [ ] Button is a secondary button (outline styling)
  - [ ] Button is clickable

- [ ] **Button Functionality**:
  - [ ] Clicking button closes the modal without saving
  - [ ] If form has unsaved changes, confirmation dialog is shown (optional)
  - [ ] Modal closes after confirmation (or directly if no changes)
  - [ ] Form data is cleared when modal is closed

---

## Part 6: Form Validation and Error Handling

### 1. Field Validation
- [ ] **Required Fields**:
  - [ ] CR Title is required
  - [ ] CR Type is required
  - [ ] Description is required
  - [ ] Reason is required
  - [ ] Desired Start Date is required
  - [ ] Desired End Date is required
  - [ ] Expected Extra Cost is required
  - [ ] Attachments are optional

- [ ] **Format Validation**:
  - [ ] Date fields validate date format (YYYY/MM/DD)
  - [ ] Date fields validate that dates are valid calendar dates
  - [ ] Expected Extra Cost validates numeric format
  - [ ] File uploads validate file type and size

- [ ] **Business Logic Validation**:
  - [ ] End date must be after start date
  - [ ] Start date should not be in the past (optional)
  - [ ] Expected Extra Cost must be positive

### 2. Error Display
- [ ] **Error Messages**:
  - [ ] Error messages are displayed below or next to invalid fields
  - [ ] Error messages are clear and helpful
  - [ ] Error messages are displayed in the appropriate language (EN/JP)
  - [ ] Multiple errors can be displayed simultaneously

- [ ] **Error Styling**:
  - [ ] Invalid fields have red border
  - [ ] Error messages are displayed in red text
  - [ ] Error styling is removed when field becomes valid

### 3. Success Handling
- [ ] **Success Messages**:
  - [ ] Success message is displayed after successful submission
  - [ ] Success message is displayed after successful draft save
  - [ ] Success messages are clear and informative
  - [ ] Success messages are displayed in the appropriate language (EN/JP)

---

## Part 7: Responsive Design and Accessibility

### 1. Responsive Layout
- [ ] **Desktop View**:
  - [ ] Modal is properly sized and centered on desktop screens
  - [ ] All fields are visible and accessible
  - [ ] Form sections are properly laid out

- [ ] **Tablet View**:
  - [ ] Modal adapts to tablet screen sizes
  - [ ] All fields remain accessible
  - [ ] Form sections remain properly organized

- [ ] **Mobile View**:
  - [ ] Modal adapts to mobile screen sizes
  - [ ] Modal takes full screen or appropriate width on mobile
  - [ ] All fields remain accessible and usable
  - [ ] Form sections stack appropriately
  - [ ] Buttons are properly sized for touch interaction

### 2. Accessibility
- [ ] **Keyboard Navigation**:
  - [ ] All form fields are keyboard accessible
  - [ ] Tab order is logical and intuitive
  - [ ] Enter key submits form when appropriate
  - [ ] Escape key closes modal

- [ ] **Screen Reader Support**:
  - [ ] All form fields have appropriate labels
  - [ ] Error messages are announced to screen readers
  - [ ] Success messages are announced to screen readers
  - [ ] Modal title is announced when modal opens

- [ ] **Visual Accessibility**:
  - [ ] Sufficient color contrast for all text
  - [ ] Error states are indicated by more than just color
  - [ ] Focus indicators are visible and clear

---

## Technical Requirements

### Frontend Requirements

#### 1. Component Structure
```typescript
// CreateChangeRequestModal.tsx
interface CreateChangeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: number;
  contractType: 'Fixed Price' | 'Retainer';
  onSubmit: (data: ChangeRequestFormData) => Promise<void>;
  onSaveDraft: (data: ChangeRequestFormData) => Promise<void>;
}

interface ChangeRequestFormData {
  title: string;
  type: string;
  description: string;
  reason: string;
  attachments: File[];
  desiredStartDate: string; // YYYY/MM/DD
  desiredEndDate: string; // YYYY/MM/DD
  expectedExtraCost: number;
}
```

#### 2. Form Fields
- [ ] CR Title: Text input with validation
- [ ] CR Type: Select dropdown with dynamic options based on contract type
- [ ] Description: Textarea with validation
- [ ] Reason: Textarea with validation
- [ ] Attachments: File upload with drag & drop support
- [ ] Desired Start Date: Date picker with validation
- [ ] Desired End Date: Date picker with validation
- [ ] Expected Extra Cost: Number input with currency formatting

#### 3. State Management
- [ ] Form state is managed using React hooks (useState)
- [ ] Validation state is tracked for each field
- [ ] Loading state is tracked during submission
- [ ] Error state is tracked and displayed

#### 4. Validation Logic
- [ ] Client-side validation is performed before submission
- [ ] Validation rules match backend requirements
- [ ] Real-time validation feedback is provided
- [ ] Validation errors are displayed clearly

#### 5. File Upload
- [ ] File upload component supports drag & drop
- [ ] File upload component supports click to select
- [ ] Multiple files can be uploaded
- [ ] File type and size validation is performed
- [ ] Uploaded files are displayed with remove option

#### 6. Date Picker
- [ ] Date picker component is used for date fields
- [ ] Date format is YYYY/MM/DD
- [ ] Date validation ensures end date is after start date
- [ ] Calendar icon is displayed next to date fields

#### 7. Currency Input
- [ ] Currency input formats numbers with ¥ symbol
- [ ] Currency input formats numbers with thousand separators
- [ ] Currency input validates numeric input
- [ ] Currency input handles decimal values appropriately

### Backend Requirements

#### 1. API Endpoints

##### POST /api/client/contracts/{contractId}/change-requests
**Description**: Create a new change request for a contract

**Request Headers**:
- `Authorization: Bearer {token}`
- `X-User-Id: {userId}` (optional, can be extracted from token)
- `Content-Type: multipart/form-data` (for file uploads)

**Request Body** (multipart/form-data):
```json
{
  "title": "Add New Features",
  "type": "Add Scope", // or "Remove Scope", "Other" for Fixed Price
                      // or "Extend Schedule", "Increase Resource", "Rate Change", "Other" for Retainer
  "description": "Description text",
  "reason": "Reason text",
  "desiredStartDate": "2025/11/01",
  "desiredEndDate": "2025/12/31",
  "expectedExtraCost": 700000,
  "attachments": [File, File, ...] // Optional
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Change request created successfully",
  "changeRequestId": 1,
  "changeRequestDisplayId": "CR-2025-01"
}
```

**Error Responses**:
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User doesn't have access to contract
- `404 Not Found`: Contract not found
- `500 Internal Server Error`: Server error

##### POST /api/client/contracts/{contractId}/change-requests/draft
**Description**: Save a change request as draft

**Request Headers**:
- `Authorization: Bearer {token}`
- `X-User-Id: {userId}` (optional)
- `Content-Type: multipart/form-data`

**Request Body**: Same as above, but all fields are optional

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Change request saved as draft",
  "changeRequestId": 1,
  "changeRequestDisplayId": "CR-2025-01"
}
```

#### 2. Service Layer

##### ChangeRequestService
```java
@Service
public class ChangeRequestService {
    
    /**
     * Create change request
     */
    @Transactional
    public ChangeRequestResponse createChangeRequest(
        Integer contractId,
        Integer clientUserId,
        CreateChangeRequestRequest request,
        List<MultipartFile> attachments
    ) {
        // Validate contract belongs to user
        // Validate contract type and CR type compatibility
        // Create change request entity
        // Save attachments to S3 or file system
        // Generate change request display ID (CR-YYYY-NN)
        // Set status to "Draft" or "Pending" based on business logic
        // Save to database
        // Return response
    }
    
    /**
     * Save change request as draft
     */
    @Transactional
    public ChangeRequestResponse saveChangeRequestDraft(
        Integer contractId,
        Integer clientUserId,
        CreateChangeRequestRequest request,
        List<MultipartFile> attachments
    ) {
        // Similar to createChangeRequest but with status "Draft"
        // All fields are optional
    }
}
```

#### 3. Validation Rules
- [ ] CR Title: Required, max 255 characters
- [ ] CR Type: Required, must be valid for contract type
- [ ] Description: Required, max 2000 characters
- [ ] Reason: Required, max 2000 characters
- [ ] Desired Start Date: Required, valid date format
- [ ] Desired End Date: Required, valid date format, must be after start date
- [ ] Expected Extra Cost: Required, positive number
- [ ] Attachments: Optional, max file size 10MB per file, allowed file types

#### 4. Business Logic
- [ ] CR Type options are filtered based on contract engagement type
- [ ] Change request display ID is generated in format CR-YYYY-NN
- [ ] Status is set to "Draft" when saved as draft
- [ ] Status is set to "Pending" or "Under Review" when submitted
- [ ] Attachments are stored in S3 or file system
- [ ] Attachment metadata is stored in database

### Database Requirements

#### 1. Change Request Table
The `change_requests` table already exists. Additional fields may be needed:

```sql
-- If not already present, add these columns:
ALTER TABLE change_requests
ADD COLUMN IF NOT EXISTS title VARCHAR(255) NOT NULL,
ADD COLUMN IF NOT EXISTS description TEXT NOT NULL,
ADD COLUMN IF NOT EXISTS reason TEXT NOT NULL,
ADD COLUMN IF NOT EXISTS desired_start_date DATE,
ADD COLUMN IF NOT EXISTS desired_end_date DATE,
ADD COLUMN IF NOT EXISTS expected_extra_cost DECIMAL(16, 2),
ADD COLUMN IF NOT EXISTS cost_estimated_by_landbridge DECIMAL(16, 2) NULL;
```

#### 2. Change Request Attachments Table
```sql
CREATE TABLE IF NOT EXISTS change_request_attachments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  change_request_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT NOT NULL,
  file_type VARCHAR(100),
  uploaded_by INT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (change_request_id) REFERENCES change_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id),
  INDEX idx_change_request_attachments_change_request_id (change_request_id)
);
```

#### 3. Data Relationships
- [ ] Change request belongs to a contract (MSA or SOW)
- [ ] Change request has multiple attachments (one-to-many)
- [ ] Change request is created by a client user
- [ ] Change request has a status (Draft, Pending, Under Review, Approved, Rejected)

---

## Implementation Guidelines

### Frontend Implementation

#### 1. Modal Component
```typescript
// components/CreateChangeRequestModal.tsx
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

interface CreateChangeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: number;
  contractType: 'Fixed Price' | 'Retainer';
  onSubmit: (data: ChangeRequestFormData) => Promise<void>;
  onSaveDraft: (data: ChangeRequestFormData) => Promise<void>;
}

export default function CreateChangeRequestModal({
  isOpen,
  onClose,
  contractId,
  contractType,
  onSubmit,
  onSaveDraft,
}: CreateChangeRequestModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<ChangeRequestFormData>({
    title: '',
    type: '',
    description: '',
    reason: '',
    attachments: [],
    desiredStartDate: '',
    desiredEndDate: '',
    expectedExtraCost: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // CR Type options based on contract type
  const crTypeOptions = contractType === 'Fixed Price'
    ? ['Add Scope', 'Remove Scope', 'Other']
    : ['Extend Schedule', 'Increase Resource', 'Rate Change', 'Other'];

  // Validation logic
  // Form submission handlers
  // File upload handlers
  // Date picker handlers
  // Currency input handlers

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Modal header */}
        {/* Form sections */}
        {/* Action buttons */}
      </div>
    </div>
  );
}
```

#### 2. Form Validation
- [ ] Use a validation library (e.g., zod, yup) or custom validation
- [ ] Validate all required fields
- [ ] Validate date formats and relationships
- [ ] Validate numeric inputs
- [ ] Validate file uploads

#### 3. File Upload Component
- [ ] Implement drag & drop functionality
- [ ] Implement file selection on click
- [ ] Display uploaded files with remove option
- [ ] Validate file type and size
- [ ] Show upload progress (optional)

#### 4. Date Picker Component
- [ ] Use a date picker library (e.g., react-datepicker) or native HTML5 date input
- [ ] Format dates as YYYY/MM/DD
- [ ] Validate date relationships
- [ ] Display calendar icon

#### 5. Currency Input Component
- [ ] Format numbers with ¥ symbol
- [ ] Format numbers with thousand separators
- [ ] Handle numeric input validation
- [ ] Convert formatted display to numeric value for submission

### Backend Implementation

#### 1. Controller
```java
@RestController
@RequestMapping("/client/contracts/{contractId}/change-requests")
@CrossOrigin(origins = "*")
public class ClientChangeRequestController {
    
    @Autowired
    private ChangeRequestService changeRequestService;
    
    @PostMapping
    public ResponseEntity<?> createChangeRequest(
        @PathVariable Integer contractId,
        @RequestParam("title") String title,
        @RequestParam("type") String type,
        @RequestParam("description") String description,
        @RequestParam("reason") String reason,
        @RequestParam("desiredStartDate") String desiredStartDate,
        @RequestParam("desiredEndDate") String desiredEndDate,
        @RequestParam("expectedExtraCost") BigDecimal expectedExtraCost,
        @RequestParam(value = "attachments", required = false) List<MultipartFile> attachments,
        @RequestHeader(value = "X-User-Id", required = false) Integer userId
    ) {
        // Validate input
        // Call service
        // Return response
    }
    
    @PostMapping("/draft")
    public ResponseEntity<?> saveChangeRequestDraft(
        // Similar parameters, all optional
    ) {
        // Similar implementation
    }
}
```

#### 2. Service Implementation
- [ ] Validate contract belongs to user
- [ ] Validate CR type is valid for contract type
- [ ] Generate change request display ID
- [ ] Save change request to database
- [ ] Upload attachments to S3 or file system
- [ ] Save attachment metadata to database
- [ ] Set appropriate status

#### 3. Entity Updates
- [ ] Update ChangeRequest entity with new fields if needed
- [ ] Create ChangeRequestAttachment entity
- [ ] Update repositories if needed

---

## Testing Requirements

### Unit Tests
- [ ] Form validation tests
- [ ] Date validation tests
- [ ] Currency formatting tests
- [ ] File upload validation tests
- [ ] CR type option filtering tests

### Integration Tests
- [ ] API endpoint tests
- [ ] Database operation tests
- [ ] File upload tests
- [ ] Service layer tests

### End-to-End Tests
- [ ] Complete form submission flow
- [ ] Draft save flow
- [ ] Cancel flow
- [ ] Error handling flow
- [ ] File upload flow

---

## Performance Requirements
- [ ] Modal opens within 100ms
- [ ] Form validation responds within 50ms
- [ ] File uploads handle files up to 10MB
- [ ] Multiple file uploads are handled efficiently
- [ ] Form submission completes within 2 seconds

---

## Security Considerations
- [ ] User authentication is required
- [ ] User can only create change requests for their own contracts
- [ ] File uploads are validated for type and size
- [ ] File uploads are scanned for malware (optional)
- [ ] Sensitive data is not exposed in error messages

---

## Definition of Done
- [ ] All acceptance criteria are met
- [ ] Code is reviewed and approved
- [ ] Unit tests are written and passing
- [ ] Integration tests are written and passing
- [ ] E2E tests are written and passing
- [ ] Documentation is updated
- [ ] UI matches wireframe design
- [ ] Form validation works correctly
- [ ] File upload works correctly
- [ ] Date picker works correctly
- [ ] Currency input works correctly
- [ ] CR type options are filtered correctly
- [ ] Error handling is implemented
- [ ] Success messages are displayed
- [ ] Modal is responsive on all devices
- [ ] Accessibility requirements are met
- [ ] Multi-language support is implemented

---

## Dependencies
- **Internal Dependencies**:
  - Story-14: Client Contract Detail SOW View (for Change Requests tab)
  - Contract detail page must be implemented
  - Change request list must be implemented

- **External Dependencies**:
  - File storage service (S3 or local file system)
  - Date picker library (optional)
  - File upload library (optional)

---

## Risks and Mitigation

### Risk 1: File Upload Size and Performance
- **Risk**: Large file uploads may cause performance issues
- **Mitigation**: Implement file size limits, show upload progress, use async uploads

### Risk 2: Date Validation Complexity
- **Risk**: Date validation logic may be complex
- **Mitigation**: Use a date library, implement clear validation rules, test thoroughly

### Risk 3: CR Type Options Mismatch
- **Risk**: CR type options may not match contract type correctly
- **Mitigation**: Implement proper contract type detection, add validation, test all scenarios

---

## Success Metrics
- [ ] Users can successfully create change requests
- [ ] Form validation prevents invalid submissions
- [ ] File uploads work correctly
- [ ] Draft saving works correctly
- [ ] Error handling provides clear feedback
- [ ] Modal is responsive and accessible

---

## Future Enhancements
- [ ] Edit existing change requests (draft or pending)
- [ ] Delete change requests (draft only)
- [ ] View change request detail in a separate page/modal
- [ ] Add comments to change requests
- [ ] Track change request status changes
- [ ] Email notifications for change request status updates
- [ ] Change request templates
- [ ] Bulk change request creation

---

**Document Control**
- **Version**: 1.0
- **Created**: January 2025
- **Last Updated**: January 2025
- **Approved By**: System Management Team
- **Distribution**: Development Team, Product Team, Management

