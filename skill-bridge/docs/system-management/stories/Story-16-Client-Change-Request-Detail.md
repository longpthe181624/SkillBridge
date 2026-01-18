# User Story: Client Change Request Detail View

## Story Information
- **Story ID**: Story-16
- **Title**: Client Change Request Detail View
- **Epic**: Client Portal - Contract Management
- **Priority**: High
- **Story Points**: 13
- **Sprint**: Sprint 4
- **Status**: Ready for Development

## User Story
**As a** Client  
**I want to** view detailed information about a change request in a modal  
**So that** I can review all change request details, impact analysis, history, and attachments, and take appropriate actions based on the change request status

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] I can open the "Change Request Detail" modal by clicking the eye icon in the Change Requests table
- [ ] The modal displays comprehensive change request information organized in sections
- [ ] I can see Overview section with CR ID, CR Title, Type, Created By, Created Date, and Status
- [ ] I can see Change Summary section with description text
- [ ] I can see Evidence section with links/files
- [ ] I can see Desired Impact section with dates and expected extra cost
- [ ] I can see Impact Analysis by Landbridge section (different content for Fixed Price vs Retainer)
- [ ] I can see History section with timeline of changes
- [ ] I can see Attachments section with uploaded files
- [ ] Action buttons are displayed conditionally based on change request status
- [ ] Input fields are editable only when status is "Draft"
- [ ] The modal matches the wireframe design
- [ ] I can close the modal by clicking Close button or outside the modal

---

## Part 1: Modal Overview

### 1. Modal Trigger
- [ ] **Button Location**:
  - [ ] Eye icon button is displayed in the "Action" column of the Change Requests table
  - [ ] Button is clickable and opens the modal when clicked

- [ ] **Modal Display**:
  - [ ] Modal appears as an overlay on top of the contract detail page
  - [ ] Modal has a semi-transparent dark background (backdrop)
  - [ ] Modal is centered on the screen
  - [ ] Modal has a white background with rounded corners
  - [ ] Modal has appropriate padding and spacing
  - [ ] Modal is scrollable if content exceeds viewport height

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

### 3. CR Title Field
- [ ] **Field Display**:
  - [ ] Label "CR Title" is displayed
  - [ ] Value displays the change request title (e.g., "Extend Schedule")
  - [ ] Value is editable when status is "Draft"
  - [ ] Value is read-only text when status is not "Draft"
  - [ ] Input field has appropriate styling

### 4. Type Field
- [ ] **Field Display**:
  - [ ] Label "Type" is displayed
  - [ ] Value displays the CR type (e.g., "Add Scope", "Extend Schedule")
  - [ ] Value is editable (dropdown) when status is "Draft"
  - [ ] Value is read-only text when status is not "Draft"

### 5. Created By Field
- [ ] **Field Display**:
  - [ ] Label "Created By" is displayed
  - [ ] Value displays the creator's name (e.g., "Sale 01")
  - [ ] Value is displayed as text (read-only)

### 6. Created Date Field
- [ ] **Field Display**:
  - [ ] Label "Created Date" is displayed
  - [ ] Value displays the creation date (e.g., "2025/06/12")
  - [ ] Value is displayed as text (read-only)

### 7. Status Field
- [ ] **Field Display**:
  - [ ] Label "Status" is displayed
  - [ ] Value displays the current status (e.g., "Under review", "Draft", "Request for Change", "Active", "Terminated")
  - [ ] Status is displayed with appropriate badge styling
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
  - [ ] Content is editable when status is "Draft"
  - [ ] Content is read-only text when status is not "Draft"
  - [ ] Text wraps appropriately
  - [ ] Textarea has appropriate height (e.g., 4-6 rows)

---

## Part 4: Evidence Section

### 1. Section Header
- [ ] **Section Title**:
  - [ ] Section title "Evidence" is displayed
  - [ ] Title is clearly visible and readable
  - [ ] Section has clear visual separation from other sections

### 2. Evidence Links/Files
- [ ] **Links Display**:
  - [ ] Evidence links/files are displayed as a list
  - [ ] Each link/file is clickable (opens in new tab or downloads)
  - [ ] Links are styled appropriately (e.g., blue, underlined)
  - [ ] File names are displayed clearly
  - [ ] Multiple evidence items can be displayed

---

## Part 5: Desired Impact Section

### 1. Section Header
- [ ] **Section Title**:
  - [ ] Section title "Desired Impact" is displayed
  - [ ] Title is clearly visible and readable
  - [ ] Section has clear visual separation from other sections

### 2. Desired Start Date Field
- [ ] **Field Display**:
  - [ ] Label "Desired Start Date" is displayed
  - [ ] Value displays the desired start date (e.g., "2025/11/1")
  - [ ] Value is editable (date picker) when status is "Draft"
  - [ ] Value is read-only text when status is not "Draft"

### 3. Desired End Date Field
- [ ] **Field Display**:
  - [ ] Label "Desired End Date" is displayed
  - [ ] Value displays the desired end date (e.g., "2025/12/31")
  - [ ] Value is editable (date picker) when status is "Draft"
  - [ ] Value is read-only text when status is not "Draft"

### 4. Expected Extra Cost Field
- [ ] **Field Display**:
  - [ ] Label "Expected Extra Cost" is displayed
  - [ ] Value displays the expected extra cost (e.g., "¥700,000")
  - [ ] Value is editable (currency input) when status is "Draft"
  - [ ] Value is read-only text when status is not "Draft"
  - [ ] Currency format is displayed correctly

---

## Part 6: Impact Analysis by Landbridge Section

### 1. Section Header
- [ ] **Section Title**:
  - [ ] Section title "Impact Analysis by Landbridge" is displayed
  - [ ] Title is clearly visible and readable
  - [ ] Section has clear visual separation from other sections

### 2. Fixed Price Contract Display
- [ ] **For Fixed Price Contracts**:
  - [ ] Section displays fields specific to Fixed Price contracts
  - [ ] **Dev Hours**: Displays development hours (e.g., "40 hour")
  - [ ] **Test Hours**: Displays test hours (e.g., "20 hour")
  - [ ] **New End Date**: Displays the new end date (e.g., "2025/12/31")
  - [ ] **Delay Duration**: Displays delay duration (e.g., "20 days")
  - [ ] **Additional Cost**: Displays additional cost (e.g., "¥350,000")
  - [ ] All fields are displayed as read-only text
  - [ ] Fields are clearly labeled
  - [ ] Values are formatted appropriately

### 3. Retainer Contract Display
- [ ] **For Retainer Contracts**:
  - [ ] Section displays two tables: "Engaged Engineer" and "Billing details"
  
- [ ] **Engaged Engineer Table**:
  - [ ] Table has columns: Engineer Level, Start date, End date, Rating, Salary
  - [ ] Table displays engineer engagement information
  - [ ] Multiple rows can be displayed
  - [ ] Table is properly formatted and readable
  - [ ] All data is read-only
  
- [ ] **Billing Details Table**:
  - [ ] Table has columns: Payment Date, Delivery note, Amount
  - [ ] Table displays billing information
  - [ ] Multiple rows can be displayed
  - [ ] Table is properly formatted and readable
  - [ ] All data is read-only

---

## Part 7: History Section

### 1. Section Header
- [ ] **Section Title**:
  - [ ] Section title "History" is displayed
  - [ ] Title is clearly visible and readable
  - [ ] Section has clear visual separation from other sections

### 2. History Items
- [ ] **History Display**:
  - [ ] History items are displayed as a list
  - [ ] Each item shows: action, user name, and timestamp (e.g., "- Created By: Yamada Taro 2025/10/3 17:00")
  - [ ] History items are ordered chronologically (newest first or oldest first)
  - [ ] Multiple history items can be displayed
  - [ ] Format is consistent and readable

---

## Part 8: Attachments Section

### 1. Section Header
- [ ] **Section Title**:
  - [ ] Section title "Attachments" is displayed
  - [ ] Title is clearly visible and readable
  - [ ] Section has clear visual separation from other sections

### 2. Attachment Files
- [ ] **Files Display**:
  - [ ] Attachment files are displayed as a list
  - [ ] Each file is clickable (downloads or opens)
  - [ ] File names are displayed clearly (e.g., "CRD_2025-01.pdf")
  - [ ] Files are styled appropriately
  - [ ] Multiple attachments can be displayed

---

## Part 9: Action Buttons

### 1. Status: Draft
- [ ] **Button Display**:
  - [ ] When status is "Draft", the following buttons are displayed:
    - [ ] "Submit Change Request" (primary button)
    - [ ] "Save Draft" (secondary button)
    - [ ] "Terminate CR" (secondary button)
    - [ ] "Close" (secondary button)
  - [ ] Buttons are properly styled and positioned
  - [ ] Buttons are clickable

- [ ] **Button Functionality**:
  - [ ] "Submit Change Request": Submits the change request and changes status to "Under Review"
  - [ ] "Save Draft": Saves changes without submitting
  - [ ] "Terminate CR": Terminates the change request and changes status to "Terminated"
  - [ ] "Close": Closes the modal without saving changes

- [ ] **Field Editability**:
  - [ ] All input fields are editable when status is "Draft"
  - [ ] User can modify CR Title, Type, Change Summary, Desired Start Date, Desired End Date, Expected Extra Cost

### 2. Status: Under Review
- [ ] **Button Display**:
  - [ ] When status is "Under Review", the following buttons are displayed:
    - [ ] "Approve" (primary button)
    - [ ] "Request For Change" (secondary button)
    - [ ] "Terminate CR" (secondary button)
    - [ ] "Close" (secondary button)
  - [ ] Buttons are properly styled and positioned
  - [ ] Buttons are clickable

- [ ] **Button Functionality**:
  - [ ] "Approve": Approves the change request and changes status to "Active"
  - [ ] "Request For Change": Changes status to "Request for Change"
  - [ ] "Terminate CR": Terminates the change request and changes status to "Terminated"
  - [ ] "Close": Closes the modal

- [ ] **Field Editability**:
  - [ ] All fields are displayed as read-only text
  - [ ] No input fields are editable

### 3. Status: Request for Change, Active, Terminated
- [ ] **Button Display**:
  - [ ] When status is "Request for Change", "Active", or "Terminated", only the following button is displayed:
    - [ ] "Close" (secondary button)
  - [ ] Button is properly styled and positioned
  - [ ] Button is clickable

- [ ] **Button Functionality**:
  - [ ] "Close": Closes the modal

- [ ] **Field Editability**:
  - [ ] All fields are displayed as read-only text
  - [ ] No input fields are editable

---

## Part 10: Form Validation and Error Handling

### 1. Draft Status Validation
- [ ] **Field Validation**:
  - [ ] When status is "Draft" and user tries to submit:
    - [ ] CR Title is required
    - [ ] Type is required
    - [ ] Change Summary is required
    - [ ] Desired Start Date is required
    - [ ] Desired End Date is required
    - [ ] Expected Extra Cost is required
    - [ ] End date must be after start date
    - [ ] Expected Extra Cost must be positive

- [ ] **Error Display**:
  - [ ] Error messages are displayed for invalid fields
  - [ ] Error messages are clear and helpful
  - [ ] Error styling is applied to invalid fields

### 2. Success/Error Messages
- [ ] **Success Messages**:
  - [ ] Success message is displayed after successful submit
  - [ ] Success message is displayed after successful save draft
  - [ ] Success message is displayed after successful approve
  - [ ] Success message is displayed after successful terminate

- [ ] **Error Messages**:
  - [ ] Error message is displayed if submit fails
  - [ ] Error message is displayed if save draft fails
  - [ ] Error message is displayed if approve fails
  - [ ] Error message is displayed if terminate fails

---

## Part 11: Responsive Design and Accessibility

### 1. Responsive Layout
- [ ] **Desktop View**:
  - [ ] Modal is properly sized and centered on desktop screens
  - [ ] All sections are visible and accessible
  - [ ] Tables are properly formatted

- [ ] **Tablet View**:
  - [ ] Modal adapts to tablet screen sizes
  - [ ] All sections remain accessible
  - [ ] Tables remain readable

- [ ] **Mobile View**:
  - [ ] Modal adapts to mobile screen sizes
  - [ ] Modal takes full screen or appropriate width on mobile
  - [ ] All sections remain accessible
  - [ ] Tables are scrollable horizontally if needed
  - [ ] Buttons are properly sized for touch interaction

### 2. Accessibility
- [ ] **Keyboard Navigation**:
  - [ ] All form fields are keyboard accessible (when editable)
  - [ ] Tab order is logical and intuitive
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
// ChangeRequestDetailModal.tsx
interface ChangeRequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  changeRequestId: number;
  contractId: number;
  contractType: 'Fixed Price' | 'Retainer';
  onStatusChange: () => void; // Callback to refresh data after status change
}
```

#### 2. Data Fetching
- [ ] Fetch change request detail from API endpoint
- [ ] Fetch impact analysis data (different for Fixed Price vs Retainer)
- [ ] Fetch history data
- [ ] Fetch attachments data
- [ ] Handle loading states
- [ ] Handle error states

#### 3. Conditional Rendering
- [ ] Render editable fields when status is "Draft"
- [ ] Render read-only text when status is not "Draft"
- [ ] Render appropriate buttons based on status
- [ ] Render Fixed Price impact analysis for Fixed Price contracts
- [ ] Render Retainer impact analysis (2 tables) for Retainer contracts

#### 4. Form Handling (Draft Status)
- [ ] Form state management for editable fields
- [ ] Form validation
- [ ] Submit change request
- [ ] Save draft
- [ ] Terminate change request

#### 5. Action Handlers
- [ ] Approve change request
- [ ] Request for change
- [ ] Terminate change request
- [ ] Close modal

### Backend Requirements

#### 1. API Endpoints

##### GET /api/client/contracts/{contractId}/change-requests/{changeRequestId}
**Description**: Get change request detail

**Request Headers**:
- `Authorization: Bearer {token}`
- `X-User-Id: {userId}` (optional)

**Response** (200 OK):
```json
{
  "id": 1,
  "changeRequestId": "CR-2025-01",
  "title": "Extend Schedule",
  "type": "Extend Schedule",
  "description": "Change summary text...",
  "reason": "Reason text...",
  "status": "Under Review",
  "createdBy": "Sale 01",
  "createdDate": "2025/06/12",
  "desiredStartDate": "2025/11/1",
  "desiredEndDate": "2025/12/31",
  "expectedExtraCost": 700000,
  "evidence": [
    {
      "type": "link",
      "value": "drive.google.com/abcde"
    },
    {
      "type": "file",
      "value": "chat_evidence.png"
    }
  ],
  "attachments": [
    {
      "id": 1,
      "fileName": "CRD_2025-01.pdf",
      "filePath": "/path/to/file",
      "fileSize": 1024000,
      "uploadedAt": "2025/06/12"
    }
  ],
  "history": [
    {
      "id": 1,
      "action": "Created",
      "userName": "Yamada Taro",
      "timestamp": "2025/10/3 17:00"
    }
  ],
  "impactAnalysis": {
    // For Fixed Price
    "devHours": 40,
    "testHours": 20,
    "newEndDate": "2025/12/31",
    "delayDuration": 20,
    "additionalCost": 350000
    // OR For Retainer
    // "engagedEngineers": [...],
    // "billingDetails": [...]
  }
}
```

##### PUT /api/client/contracts/{contractId}/change-requests/{changeRequestId}
**Description**: Update change request (Draft status only)

**Request Headers**:
- `Authorization: Bearer {token}`
- `X-User-Id: {userId}` (optional)
- `Content-Type: application/json`

**Request Body**:
```json
{
  "title": "Updated Title",
  "type": "Add Scope",
  "description": "Updated description",
  "reason": "Updated reason",
  "desiredStartDate": "2025/11/1",
  "desiredEndDate": "2025/12/31",
  "expectedExtraCost": 700000
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Change request updated successfully"
}
```

##### POST /api/client/contracts/{contractId}/change-requests/{changeRequestId}/submit
**Description**: Submit change request (Draft -> Under Review)

**Request Headers**:
- `Authorization: Bearer {token}`
- `X-User-Id: {userId}` (optional)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Change request submitted successfully"
}
```

##### POST /api/client/contracts/{contractId}/change-requests/{changeRequestId}/approve
**Description**: Approve change request (Under Review -> Active)

**Request Headers**:
- `Authorization: Bearer {token}`
- `X-User-Id: {userId}` (optional)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Change request approved successfully"
}
```

##### POST /api/client/contracts/{contractId}/change-requests/{changeRequestId}/request-for-change
**Description**: Request for change (Under Review -> Request for Change)

**Request Headers**:
- `Authorization: Bearer {token}`
- `X-User-Id: {userId}` (optional)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Change request status updated to Request for Change"
}
```

##### POST /api/client/contracts/{contractId}/change-requests/{changeRequestId}/terminate
**Description**: Terminate change request

**Request Headers**:
- `Authorization: Bearer {token}`
- `X-User-Id: {userId}` (optional)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Change request terminated successfully"
}
```

#### 2. Service Layer

##### ChangeRequestDetailService
```java
@Service
public class ChangeRequestDetailService {
    
    /**
     * Get change request detail
     */
    public ChangeRequestDetailDTO getChangeRequestDetail(
        Integer contractId,
        Integer changeRequestId,
        Integer clientUserId
    ) {
        // Validate change request belongs to contract and user
        // Fetch change request
        // Fetch impact analysis (different for Fixed Price vs Retainer)
        // Fetch history
        // Fetch attachments
        // Convert to DTO
        // Return DTO
    }
    
    /**
     * Update change request (Draft only)
     */
    @Transactional
    public void updateChangeRequest(
        Integer contractId,
        Integer changeRequestId,
        Integer clientUserId,
        UpdateChangeRequestRequest request
    ) {
        // Validate status is Draft
        // Validate change request belongs to user
        // Update fields
        // Save to database
    }
    
    /**
     * Submit change request
     */
    @Transactional
    public void submitChangeRequest(
        Integer contractId,
        Integer changeRequestId,
        Integer clientUserId
    ) {
        // Validate status is Draft
        // Validate change request belongs to user
        // Change status to "Under Review"
        // Log history
        // Save to database
    }
    
    /**
     * Approve change request
     */
    @Transactional
    public void approveChangeRequest(
        Integer contractId,
        Integer changeRequestId,
        Integer clientUserId
    ) {
        // Validate status is "Under Review"
        // Validate change request belongs to user
        // Change status to "Active"
        // Log history
        // Save to database
    }
    
    /**
     * Request for change
     */
    @Transactional
    public void requestForChange(
        Integer contractId,
        Integer changeRequestId,
        Integer clientUserId
    ) {
        // Validate status is "Under Review"
        // Validate change request belongs to user
        // Change status to "Request for Change"
        // Log history
        // Save to database
    }
    
    /**
     * Terminate change request
     */
    @Transactional
    public void terminateChangeRequest(
        Integer contractId,
        Integer changeRequestId,
        Integer clientUserId
    ) {
        // Validate change request belongs to user
        // Change status to "Terminated"
        // Log history
        // Save to database
    }
}
```

#### 3. Impact Analysis Data Structure

##### For Fixed Price Contracts
```java
public class FixedPriceImpactAnalysis {
    private Integer devHours;
    private Integer testHours;
    private LocalDate newEndDate;
    private Integer delayDuration; // in days
    private BigDecimal additionalCost;
}
```

##### For Retainer Contracts
```java
public class RetainerImpactAnalysis {
    private List<EngagedEngineerDTO> engagedEngineers;
    private List<BillingDetailDTO> billingDetails;
}

public class EngagedEngineerDTO {
    private String engineerLevel;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal rating; // percentage
    private BigDecimal salary;
}

public class BillingDetailDTO {
    private LocalDate paymentDate;
    private String deliveryNote;
    private BigDecimal amount;
}
```

### Database Requirements

#### 1. Impact Analysis Tables
```sql
-- For Fixed Price impact analysis
ALTER TABLE change_requests
ADD COLUMN IF NOT EXISTS dev_hours INT NULL,
ADD COLUMN IF NOT EXISTS test_hours INT NULL,
ADD COLUMN IF NOT EXISTS new_end_date DATE NULL,
ADD COLUMN IF NOT EXISTS delay_duration INT NULL; -- in days

-- Additional cost already exists as cost_estimated_by_landbridge

-- For Retainer impact analysis
CREATE TABLE IF NOT EXISTS change_request_engaged_engineers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  change_request_id INT NOT NULL,
  engineer_level VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  rating DECIMAL(5, 2) NOT NULL, -- percentage
  salary DECIMAL(16, 2) NOT NULL,
  FOREIGN KEY (change_request_id) REFERENCES change_requests(id) ON DELETE CASCADE,
  INDEX idx_change_request_engaged_engineers_change_request_id (change_request_id)
);

CREATE TABLE IF NOT EXISTS change_request_billing_details (
  id INT PRIMARY KEY AUTO_INCREMENT,
  change_request_id INT NOT NULL,
  payment_date DATE NOT NULL,
  delivery_note VARCHAR(500) NOT NULL,
  amount DECIMAL(16, 2) NOT NULL,
  FOREIGN KEY (change_request_id) REFERENCES change_requests(id) ON DELETE CASCADE,
  INDEX idx_change_request_billing_details_change_request_id (change_request_id)
);
```

#### 2. Evidence Field
```sql
-- Add evidence field to change_requests table
ALTER TABLE change_requests
ADD COLUMN IF NOT EXISTS evidence TEXT NULL; -- JSON array of evidence links/files
```

#### 3. History Table
```sql
-- Create change request history table
CREATE TABLE IF NOT EXISTS change_request_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  change_request_id INT NOT NULL,
  action VARCHAR(100) NOT NULL, -- "Created", "Submitted", "Approved", etc.
  user_id INT NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (change_request_id) REFERENCES change_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_change_request_history_change_request_id (change_request_id),
  INDEX idx_change_request_history_timestamp (timestamp)
);
```

---

## Implementation Guidelines

### Frontend Implementation

#### 1. Modal Component
```typescript
// components/ChangeRequestDetailModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { getChangeRequestDetail, updateChangeRequest, submitChangeRequest, approveChangeRequest, requestForChange, terminateChangeRequest } from '@/services/contractService';

export default function ChangeRequestDetailModal({
  isOpen,
  onClose,
  changeRequestId,
  contractId,
  contractType,
  onStatusChange,
}: ChangeRequestDetailModalProps) {
  const { t } = useLanguage();
  const [changeRequest, setChangeRequest] = useState<ChangeRequestDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ChangeRequestFormData | null>(null);

  // Fetch change request detail on mount
  useEffect(() => {
    if (isOpen && changeRequestId) {
      fetchChangeRequestDetail();
    }
  }, [isOpen, changeRequestId]);

  // Set editing mode based on status
  useEffect(() => {
    if (changeRequest) {
      setIsEditing(changeRequest.status === 'Draft');
      if (changeRequest.status === 'Draft') {
        setFormData({
          title: changeRequest.title,
          type: changeRequest.type,
          description: changeRequest.description,
          reason: changeRequest.reason,
          desiredStartDate: changeRequest.desiredStartDate,
          desiredEndDate: changeRequest.desiredEndDate,
          expectedExtraCost: changeRequest.expectedExtraCost,
        });
      }
    }
  }, [changeRequest]);

  const fetchChangeRequestDetail = async () => {
    // Implementation
  };

  const handleSubmit = async () => {
    // Implementation
  };

  const handleSaveDraft = async () => {
    // Implementation
  };

  const handleApprove = async () => {
    // Implementation
  };

  const handleRequestForChange = async () => {
    // Implementation
  };

  const handleTerminate = async () => {
    // Implementation
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal content */}
      </div>
    </div>
  );
}
```

#### 2. Conditional Rendering
- [ ] Use `isEditing` state to determine if fields are editable
- [ ] Render Input/Textarea/Select when editable
- [ ] Render text/div when read-only
- [ ] Render appropriate buttons based on status

#### 3. Impact Analysis Rendering
- [ ] Check contract type (Fixed Price vs Retainer)
- [ ] Render Fixed Price fields for Fixed Price contracts
- [ ] Render Retainer tables for Retainer contracts

### Backend Implementation

#### 1. Controller
```java
@RestController
@RequestMapping("/client/contracts/{contractId}/change-requests/{changeRequestId}")
@CrossOrigin(origins = "*")
public class ClientChangeRequestDetailController {
    
    @Autowired
    private ChangeRequestDetailService changeRequestDetailService;
    
    @GetMapping
    public ResponseEntity<?> getChangeRequestDetail(
        @PathVariable Integer contractId,
        @PathVariable Integer changeRequestId,
        @RequestHeader(value = "X-User-Id", required = false) Integer userId
    ) {
        // Implementation
    }
    
    @PutMapping
    public ResponseEntity<?> updateChangeRequest(
        @PathVariable Integer contractId,
        @PathVariable Integer changeRequestId,
        @RequestBody UpdateChangeRequestRequest request,
        @RequestHeader(value = "X-User-Id", required = false) Integer userId
    ) {
        // Implementation
    }
    
    @PostMapping("/submit")
    public ResponseEntity<?> submitChangeRequest(
        @PathVariable Integer contractId,
        @PathVariable Integer changeRequestId,
        @RequestHeader(value = "X-User-Id", required = false) Integer userId
    ) {
        // Implementation
    }
    
    @PostMapping("/approve")
    public ResponseEntity<?> approveChangeRequest(
        @PathVariable Integer contractId,
        @PathVariable Integer changeRequestId,
        @RequestHeader(value = "X-User-Id", required = false) Integer userId
    ) {
        // Implementation
    }
    
    @PostMapping("/request-for-change")
    public ResponseEntity<?> requestForChange(
        @PathVariable Integer contractId,
        @PathVariable Integer changeRequestId,
        @RequestHeader(value = "X-User-Id", required = false) Integer userId
    ) {
        // Implementation
    }
    
    @PostMapping("/terminate")
    public ResponseEntity<?> terminateChangeRequest(
        @PathVariable Integer contractId,
        @PathVariable Integer changeRequestId,
        @RequestHeader(value = "X-User-Id", required = false) Integer userId
    ) {
        // Implementation
    }
}
```

---

## Testing Requirements

### Unit Tests
- [ ] Component rendering tests
- [ ] Form validation tests
- [ ] Conditional rendering tests (status-based)
- [ ] Button visibility tests
- [ ] Field editability tests

### Integration Tests
- [ ] API endpoint tests
- [ ] Database operation tests
- [ ] Service layer tests
- [ ] Status transition tests

### End-to-End Tests
- [ ] Open modal flow
- [ ] View change request detail flow
- [ ] Edit draft change request flow
- [ ] Submit change request flow
- [ ] Approve change request flow
- [ ] Request for change flow
- [ ] Terminate change request flow
- [ ] Close modal flow

---

## Performance Requirements
- [ ] Modal opens within 200ms
- [ ] Change request detail loads within 1 second
- [ ] Form submission completes within 2 seconds
- [ ] Status changes complete within 1 second

---

## Security Considerations
- [ ] User authentication is required
- [ ] User can only view change requests for their own contracts
- [ ] User can only edit change requests with "Draft" status
- [ ] User can only perform actions on change requests they have access to
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
- [ ] Conditional rendering works correctly
- [ ] Status-based button visibility works correctly
- [ ] Field editability works correctly
- [ ] Impact analysis displays correctly for both contract types
- [ ] Error handling is implemented
- [ ] Success messages are displayed
- [ ] Modal is responsive on all devices
- [ ] Accessibility requirements are met
- [ ] Multi-language support is implemented

---

## Dependencies
- **Internal Dependencies**:
  - Story-15: Client Create Change Request (for creating change requests)
  - Story-14: Client Contract Detail SOW View (for Change Requests tab)
  - Contract detail page must be implemented

- **External Dependencies**:
  - File storage service (for attachments)
  - Date picker library (optional)
  - Currency input library (optional)

---

## Risks and Mitigation

### Risk 1: Complex Conditional Rendering
- **Risk**: Conditional rendering based on status and contract type may be complex
- **Mitigation**: Use clear state management, create separate components for different views, test thoroughly

### Risk 2: Impact Analysis Data Structure
- **Risk**: Different data structures for Fixed Price vs Retainer may cause confusion
- **Mitigation**: Use clear type definitions, create separate DTOs, validate contract type before rendering

### Risk 3: Status Transition Logic
- **Risk**: Status transitions may have complex business rules
- **Mitigation**: Implement clear state machine, validate transitions, add comprehensive tests

---

## Success Metrics
- [ ] Users can successfully view change request details
- [ ] Users can successfully edit draft change requests
- [ ] Users can successfully perform actions based on status
- [ ] Impact analysis displays correctly for both contract types
- [ ] Status transitions work correctly
- [ ] Error handling provides clear feedback
- [ ] Modal is responsive and accessible

---

## Future Enhancements
- [ ] Add comments section to change request detail
- [ ] Add notification system for status changes
- [ ] Add email notifications for status changes
- [ ] Add ability to download change request as PDF
- [ ] Add ability to print change request
- [ ] Add version history for change requests
- [ ] Add comparison view (before/after)

---

**Document Control**
- **Version**: 1.0
- **Created**: January 2025
- **Last Updated**: January 2025
- **Approved By**: System Management Team
- **Distribution**: Development Team, Product Team, Management

