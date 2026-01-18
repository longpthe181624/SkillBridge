# User Story: Sales Create SOW (Statement of Work)

## Story Information
- **Story ID**: Story-26
- **Title**: Sales Create SOW (Statement of Work)
- **Epic**: Sales Portal - Contract Management
- **Priority**: High
- **Story Points**: 21
- **Sprint**: Sprint 6
- **Status**: Draft

## User Story
**As a** Sales User (Sales Manager or Sales Man)  
**I want to** create a new SOW (Statement of Work) contract from a parent MSA contract  
**So that** I can define project-specific work, deliverables, billing schedules, and manage contract terms for Fixed Price or Retainer engagements

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] I can create a new SOW contract from a parent MSA contract
- [ ] I can select engagement type (Fixed Price or Retainer)
- [ ] I can fill in all required SOW information including summary, scope, deliverables, billing details, and contacts
- [ ] I can add delivery items (for Retainer) or milestone deliverables (for Fixed Price)
- [ ] I can upload contract documents (PDF only)
- [ ] I can assign a reviewer for internal review workflow
- [ ] I can save the contract as draft or submit for review
- [ ] I can cancel the creation process
- [ ] The form matches the wireframe design exactly

### Detailed Acceptance Criteria

#### 1. Page Layout (Based on Wireframe)

- [ ] **Left Sidebar**:
  - [ ] "SKILL BRIDGE" logo/title at the top of sidebar in dark gray background
  - [ ] Navigation menu items with icons:
    - [ ] "Dashboard" with grid icon (four squares)
    - [ ] "Contact form" with envelope icon
    - [ ] "Opportunities" with document icon
    - [ ] "Contract" with document icon (highlighted/active state when on this page)
  - [ ] Sidebar has white background with dark gray header
  - [ ] Sidebar is collapsible on mobile (future enhancement)

- [ ] **Top Header Bar**:
  - [ ] Header bar has dark gray background
  - [ ] "SKILL BRIDGE" text on the far left in white
  - [ ] Page title "Master Data" displayed in the center in white text
  - [ ] User information displayed on the right:
    - [ ] User icon/avatar
    - [ ] User name (e.g., "Admin")
  - [ ] Header is sticky/static at top
  - [ ] Language selector (JA/EN) in header (optional)

- [ ] **Main Content Area**:
  - [ ] White background area for main content
  - [ ] Content is properly spaced from sidebar and header
  - [ ] Responsive layout for different screen sizes

#### 2. Breadcrumbs

- [ ] **Breadcrumb Navigation**:
  - [ ] Displays "Contract Management > Add new SOW(Statement of Work)"
  - [ ] "Contract Management" is clickable and links back to contract list (`/sales/contracts`)
  - [ ] "Add new SOW(Statement of Work)" is the current page (non-clickable)
  - [ ] Breadcrumbs are positioned below header, above form title

#### 3. Tab Navigation

- [ ] **Tabs**:
  - [ ] Two tabs displayed: "MSA" and "SOW"
  - [ ] "SOW" tab is selected by default when creating SOW
  - [ ] "MSA" tab navigates to MSA creation page (`/sales/contracts/new?tab=msa`)
  - [ ] Active tab is highlighted
  - [ ] Tabs are clickable and switch between MSA and SOW creation forms

#### 4. Form Title

- [ ] **Form Title**:
  - [ ] Displays "Add new SOW (Statement of Work)" as the main form title
  - [ ] Positioned below breadcrumbs and tabs
  - [ ] Large, bold text for clear visibility

#### 5. SOW Summary Section

- [ ] **Section Header**:
  - [ ] Displays "SOW Summary" as section header
  - [ ] Clear visual separation from other sections

- [ ] **MSA ID**:
  - [ ] Label: "MSA ID"
  - [ ] Field type: Dropdown/Select
  - [ ] Displays list of active MSA contracts (format: "MSA-YYYY-NN", e.g., "MSA-2025-07")
  - [ ] Only shows MSA contracts with status "Active" or "Client Under Review"
  - [ ] Required field
  - [ ] Selecting an MSA auto-populates Client field

- [ ] **Client**:
  - [ ] Label: "Client"
  - [ ] Field type: Read-only text field
  - [ ] Auto-populated from selected MSA (client name, e.g., "yamada taro")
  - [ ] Cannot be edited directly
  - [ ] Displays client's full name

- [ ] **Engagement Type**:
  - [ ] Label: "Engagement Type"
  - [ ] Field type: Dropdown/Select
  - [ ] Options: "Fixed Price", "Retainer"
  - [ ] Default value: "Retainer" (based on wireframe)
  - [ ] Required field
  - [ ] Changing engagement type shows/hides relevant sections:
    - [ ] "Fixed Price" → Shows Milestone Deliverables section
    - [ ] "Retainer" → Shows Delivery Items section

- [ ] **Assignee**:
  - [ ] Label: "Assignee"
  - [ ] Field type: Dropdown/Select
  - [ ] Displays list of Sales Men (users with role SALES_REP)
  - [ ] Format: "Sale 01", "Sale 02", etc. (or full name)
  - [ ] Pre-selects current user if they are a Sales Man
  - [ ] Sales Manager can assign to any Sales Man
  - [ ] Required field

- [ ] **Effective Start**:
  - [ ] Label: "Effective Start"
  - [ ] Field type: Date input with calendar picker
  - [ ] Placeholder: "yyyy/mm/dd"
  - [ ] Calendar icon displayed next to input field
  - [ ] Clicking calendar icon opens date picker
  - [ ] Date format: YYYY/MM/DD
  - [ ] Required field
  - [ ] Validation: Date must be valid and not in the past (optional business rule)

- [ ] **Effective End**:
  - [ ] Label: "Effective End"
  - [ ] Field type: Date input with calendar picker
  - [ ] Placeholder: "yyyy/mm/dd"
  - [ ] Calendar icon displayed next to input field
  - [ ] Clicking calendar icon opens date picker
  - [ ] Date format: YYYY/MM/DD
  - [ ] Required field
  - [ ] Validation: Date must be after Effective Start date

- [ ] **Status**:
  - [ ] Label: "Status"
  - [ ] Field type: Dropdown/Select
  - [ ] Default value: "Draft"
  - [ ] Options: "Draft", "Internal Review", "Client Under Review", "Active", "Completed", "Terminated"
  - [ ] Status updates based on workflow actions

#### 6. Note Section

- [ ] **Section Header**:
  - [ ] Displays "Note" as section header
  - [ ] Clear visual separation from other sections

- [ ] **Note Field**:
  - [ ] Label: "Note"
  - [ ] Field type: Large textarea
  - [ ] Placeholder: "Lorem Ipsum is simply dummy text"
  - [ ] Multi-line text input
  - [ ] Optional field
  - [ ] Character limit: 5000 characters (optional)

#### 7. Scope Summary Section

- [ ] **Section Header**:
  - [ ] Displays "Scope summary" as section header
  - [ ] Clear visual separation from other sections

- [ ] **Scope Summary Field**:
  - [ ] Label: "Scope summary"
  - [ ] Field type: Large textarea
  - [ ] Placeholder: "Lorem Ipsum is simply dummy text"
  - [ ] Multi-line text input
  - [ ] Optional field
  - [ ] Character limit: 5000 characters (optional)

#### 8. Delivery Items Section (For Retainer Engagement Type)

- [ ] **Section Header**:
  - [ ] Displays "Delivery Items" as section header
  - [ ] Only visible when Engagement Type is "Retainer"
  - [ ] Clear visual separation from other sections

- [ ] **Table Structure**:
  - [ ] Table displayed with columns: "Milestone", "Delivery note", "Amount", "Payment Date"
  - [ ] Table has clear borders and spacing
  - [ ] Table headers are properly aligned
  - [ ] Table is scrollable if content exceeds viewport width

- [ ] **Table Columns**:
  - [ ] **Milestone**: Text input (e.g., "November 2025", "December 2025")
    - [ ] Milestone names are editable
    - [ ] Typically represents monthly or period-based milestones
  - [ ] **Delivery note**: Text input (e.g., "2 Middle Backend(100%)", "2 Middle Backend, 1 Middle Frontend")
    - [ ] Delivery notes are editable
    - [ ] May include resource allocation percentages
  - [ ] **Amount**: Number input with currency format (e.g., "¥800,000", "¥1,200,000")
    - [ ] Currency symbol (¥) displayed
    - [ ] Numbers formatted with comma separators
    - [ ] Validation: Must be positive number
  - [ ] **Payment Date**: Date input (e.g., "2025/11/30", "2025/12/31")
    - [ ] Date format: YYYY/MM/DD
    - [ ] Calendar picker available

- [ ] **Add Delivery Item Button**:
  - [ ] "+" button displayed to add new delivery items
  - [ ] Clicking "+" adds a new empty row to the table
  - [ ] New row is editable immediately

- [ ] **Remove Delivery Item**:
  - [ ] Each row has a delete/remove button (trash icon)
  - [ ] Clicking remove deletes the row
  - [ ] Confirmation dialog before deletion (optional)

- [ ] **Table Data**:
  - [ ] Table can have multiple delivery items
  - [ ] Delivery items are sorted by Payment Date (ascending) by default
  - [ ] Empty state message if no delivery items exist
  - [ ] At least one delivery item required for Retainer type

#### 9. Milestone Deliverables Section (For Fixed Price Engagement Type)

- [ ] **Section Header**:
  - [ ] Displays "Milestone Deliverables" as section header
  - [ ] Only visible when Engagement Type is "Fixed Price"
  - [ ] Clear visual separation from other sections

- [ ] **Table Structure**:
  - [ ] Table displayed with columns: "Milestone", "Delivery note", "Acceptance Criteria", "Planned End", "Payment (%)"
  - [ ] Table has clear borders and spacing
  - [ ] Table headers are properly aligned
  - [ ] Table is scrollable if content exceeds viewport width

- [ ] **Table Columns**:
  - [ ] **Milestone**: Text input (e.g., "Kickoff", "Design Phase", "Development", "UAT", "Go-Live")
    - [ ] Milestone names are editable
  - [ ] **Delivery note**: Text input (e.g., "Setup environment, project plan", "UI/UX Figma + Spec")
    - [ ] Delivery notes are editable
  - [ ] **Acceptance Criteria**: Text input (e.g., "Client sign-off on plan", "Client approves design")
    - [ ] Acceptance criteria are editable
  - [ ] **Planned End**: Date input (e.g., "2025/11/01", "2025/11/30")
    - [ ] Date format: YYYY/MM/DD
    - [ ] Calendar picker available
  - [ ] **Payment (%)**: Number input (e.g., "20%", "30%", "10%")
    - [ ] Percentages are editable
    - [ ] Validation: Must be between 0 and 100
    - [ ] Validation: Sum of all percentages should equal 100% (warning if not)

- [ ] **Add Milestone Button**:
  - [ ] "+" button displayed to add new milestones
  - [ ] Clicking "+" adds a new empty row to the table
  - [ ] New row is editable immediately

- [ ] **Remove Milestone**:
  - [ ] Each row has a delete/remove button (trash icon)
  - [ ] Clicking remove deletes the row
  - [ ] Confirmation dialog before deletion (optional)

- [ ] **Table Data**:
  - [ ] Table can have multiple milestones
  - [ ] Milestones are sorted by Planned End date (ascending) by default
  - [ ] Empty state message if no milestones exist
  - [ ] At least one milestone required for Fixed Price type

#### 10. Billing Details Section

- [ ] **Section Header**:
  - [ ] Displays "Billing details" as section header
  - [ ] Clear visual separation from other sections

- [ ] **Table Structure (For Retainer)**:
  - [ ] When Engagement Type is "Retainer", table displayed with columns: "Payment Date", "Delivery note", "Amount"
  - [ ] Table has clear borders and spacing
  - [ ] Table headers are properly aligned
  - [ ] Table is scrollable if content exceeds viewport width

- [ ] **Table Columns (For Retainer)**:
  - [ ] **Payment Date**: Date format "YYYY/MM/DD" (e.g., "2025/11/30", "2026/1/31", "2026/2/28")
    - [ ] Dates are formatted consistently
  - [ ] **Delivery note**: Description of deliverables (e.g., "2 Middle Backend(100%)", "1 Middle Backend (100%), 1 Middle Front end(100%)")
    - [ ] Delivery notes are clearly displayed
  - [ ] **Amount**: Currency format (e.g., "¥800,000", "¥1,200,000")
    - [ ] Currency symbol (¥) displayed
    - [ ] Numbers formatted with comma separators

- [ ] **Table Structure (For Fixed Price)**:
  - [ ] When Engagement Type is "Fixed Price", table displayed with columns: "Billing name", "Milestone", "Amount", "%", "Invoice Date"
  - [ ] Table has clear borders and spacing
  - [ ] Table headers are properly aligned
  - [ ] Table is scrollable if content exceeds viewport width

- [ ] **Table Columns (For Fixed Price)**:
  - [ ] **Billing name**: Billing item name (e.g., "Kickoff Payment", "Design Payment", "Dev Payment", "UAT Payment", "Final Payment")
    - [ ] Billing names are clearly displayed
  - [ ] **Milestone**: Associated milestone name (e.g., "Kickoff", "Design Complete", "Development Complete")
    - [ ] Milestone names link to milestone deliverables
  - [ ] **Amount**: Currency format (e.g., "¥360,000", "¥480,000", "¥180,000")
    - [ ] Currency symbol (¥) displayed
    - [ ] Numbers formatted with comma separators
  - [ ] **%**: Percentage format (e.g., "20%", "30%", "10%")
    - [ ] Percentages are clearly displayed
  - [ ] **Invoice Date**: Date format "YYYY/MM/DD" (e.g., "2025/11/01", "2025/11/30")
    - [ ] Dates are formatted consistently

- [ ] **Billing Details Auto-generation**:
  - [ ] For Retainer: Billing details are auto-generated from Delivery Items
  - [ ] For Fixed Price: Billing details are auto-generated from Milestone Deliverables
  - [ ] Billing details can be manually edited if needed
  - [ ] Changes to Delivery Items/Milestones update Billing Details accordingly

- [ ] **Table Data**:
  - [ ] Table displays all billing items for the SOW
  - [ ] Billing items are sorted by Payment Date/Invoice Date (ascending)
  - [ ] Empty state message if no billing details exist
  - [ ] Loading state while calculating billing details

#### 11. Attachments Section

- [ ] **Section Header**:
  - [ ] Displays "Attachments" as section header
  - [ ] Clear visual separation from other sections

- [ ] **File Upload Area**:
  - [ ] Large rectangular dashed-border area
  - [ ] Text displayed: "Click or Drag & Drop PDF here"
  - [ ] Supports drag and drop file upload
  - [ ] Supports click to browse and select file
  - [ ] File type restriction: PDF only
  - [ ] File size limit: 10MB per file (configurable)
  - [ ] Multiple files can be uploaded
  - [ ] Uploaded files are displayed in a list below upload area
  - [ ] Each file in list has:
    - [ ] File name
    - [ ] File size
    - [ ] Remove/Delete button
  - [ ] Optional field (can create contract without attachments)

#### 12. Internal Review Workflow Section

- [ ] **Section Header**:
  - [ ] Displays "Internal Review Workflow" as section header
  - [ ] Clear visual separation from other sections

- [ ] **Assign Reviewer**:
  - [ ] Label: "Assign Reviewer"
  - [ ] Field type: Dropdown/Select
  - [ ] Displays list of Sales Managers (users with role SALES_MANAGER)
  - [ ] Format: "Sales Manager Name" (e.g., "Sale Manager 01")
  - [ ] Only Sales Managers can be assigned as reviewers
  - [ ] Optional field (can be assigned later)
  - [ ] Can be changed before review is submitted
  - [ ] If reviewer is not the logged-in user, Actions and Review Notes fields are hidden

- [ ] **Actions**:
  - [ ] Label: "Actions"
  - [ ] Field type: Dropdown/Select
  - [ ] Options: "Approve", "Request Revision"
  - [ ] Only visible and editable by assigned reviewer (when reviewer is the logged-in user)
  - [ ] Disabled if no reviewer is assigned
  - [ ] Disabled if reviewer is not the logged-in user
  - [ ] Disabled after review is submitted
  - [ ] Required when submitting review

- [ ] **Review Notes**:
  - [ ] Label: "Review Notes"
  - [ ] Field type: Large textarea
  - [ ] Placeholder: "Lorem ip sum"
  - [ ] Multi-line text input
  - [ ] Only visible and editable by assigned reviewer (when reviewer is the logged-in user)
  - [ ] Disabled if no reviewer is assigned
  - [ ] Disabled if reviewer is not the logged-in user
  - [ ] Disabled after review is submitted
  - [ ] Optional field

- [ ] **Submit Review Button**:
  - [ ] Button text: "Submit review"
  - [ ] Button style: Primary button (dark grey background, white text)
  - [ ] Only visible when reviewer is assigned, reviewer is the logged-in user, and review is not yet submitted
  - [ ] Clicking button:
    - [ ] Validates that Actions dropdown has a value
    - [ ] Validates that Review Notes are filled (optional, can be empty)
    - [ ] Submits review with selected action and notes
    - [ ] Updates contract status based on action:
      - [ ] "Approve" → Status becomes "Client Under Review"
      - [ ] "Request Revision" → Status becomes "Draft"
    - [ ] Creates history entry for review submission
    - [ ] Shows success message
    - [ ] Disables review fields after submission

#### 13. Actions Section

- [ ] **Save as Draft Button**:
  - [ ] Button text: "Save as Draft"
  - [ ] Button style: Secondary button (light grey border, white background, dark grey text)
  - [ ] Always visible
  - [ ] Clicking button:
    - [ ] Saves contract with status "Draft"
    - [ ] Validates required fields (MSA ID, Client, Engagement Type, Effective Start, Effective End, Assignee, at least one Delivery Item/Milestone)
    - [ ] Shows success message
    - [ ] Stays on the same page (does not navigate away)

- [ ] **Cancel Button**:
  - [ ] Button text: "Cancel"
  - [ ] Button style: Secondary button (light grey border, white background, dark grey text)
  - [ ] Always visible
  - [ ] Clicking button:
    - [ ] Shows confirmation dialog if form has unsaved changes
    - [ ] Navigates back to contract list page (`/sales/contracts`)
    - [ ] Discards all unsaved changes

- [ ] **Save Contract Button**:
  - [ ] Button text: "Save Contract"
  - [ ] Button style: Primary button (dark grey background, white text)
  - [ ] Always visible
  - [ ] Clicking button:
    - [ ] Validates all required fields
    - [ ] If reviewer is assigned and review is submitted:
      - [ ] If action is "Approve", saves contract with status "Client Under Review"
      - [ ] If action is "Request Revision", saves contract with status "Draft"
    - [ ] If no reviewer assigned or review not submitted:
      - [ ] Saves contract with current status (default: "Draft")
    - [ ] Uploads attachments to S3 (if any)
    - [ ] Creates SOW contract in database
    - [ ] Creates delivery items or milestone deliverables
    - [ ] Creates billing details
    - [ ] Generates contract ID (format: SOW-YYYY-MM-DD-NN)
    - [ ] Creates initial history entry
    - [ ] Shows success message
    - [ ] Navigates to contract detail page or contract list page

## Technical Requirements

### Frontend Requirements

```typescript
// Sales Create SOW Page Component Structure
interface CreateSOWPageProps {
  msaId?: string; // Optional: pre-selected MSA ID from URL
  engagementType?: 'Fixed Price' | 'Retainer'; // Optional: pre-selected engagement type
}

interface CreateSOWFormData {
  msaId: string | null;
  clientId: number | null;
  clientName: string;
  engagementType: 'Fixed Price' | 'Retainer';
  effectiveStart: string | null; // Format: YYYY-MM-DD
  effectiveEnd: string | null; // Format: YYYY-MM-DD
  status: 'Draft' | 'Internal Review' | 'Client Under Review' | 'Active' | 'Completed' | 'Terminated';
  assigneeUserId: number | null;
  note: string;
  scopeSummary: string;
  deliveryItems: DeliveryItem[]; // For Retainer
  milestoneDeliverables: MilestoneDeliverable[]; // For Fixed Price
  billingDetails: BillingDetail[]; // Auto-generated or manual
  attachments: File[];
  reviewerId: number | null;
  reviewNotes: string;
  reviewAction: 'APPROVE' | 'REQUEST_REVISION' | null;
}

interface DeliveryItem {
  id?: number; // For existing items
  milestone: string; // e.g., "November 2025"
  deliveryNote: string; // e.g., "2 Middle Backend(100%)"
  amount: number; // JPY amount
  paymentDate: string; // Format: YYYY-MM-DD
}

interface MilestoneDeliverable {
  id?: number; // For existing items
  milestone: string; // e.g., "Kickoff"
  deliveryNote: string; // e.g., "Setup environment, project plan"
  acceptanceCriteria: string; // e.g., "Client sign-off on plan"
  plannedEnd: string; // Format: YYYY-MM-DD
  paymentPercentage: number; // e.g., 20, 30, 10
}

interface BillingDetail {
  id?: number; // For existing items
  billingName?: string; // For Fixed Price
  milestone?: string; // For Fixed Price
  paymentDate: string; // Format: YYYY-MM-DD (for Retainer) or Invoice Date (for Fixed Price)
  deliveryNote: string;
  amount: number; // JPY amount
  percentage?: number | null; // For Fixed Price
}

interface MSAContract {
  id: number;
  contractId: string; // Format: MSA-YYYY-NN
  clientId: number;
  clientName: string;
  status: string;
}

interface SalesUser {
  id: number;
  fullName: string;
  email: string;
  role: 'SALES_MANAGER' | 'SALES_REP';
}
```

### Key Frontend Functions

```typescript
// Fetch active MSA contracts
const fetchActiveMSAContracts = async (token: string): Promise<MSAContract[]> => {
  const response = await fetch(`${API_BASE_URL}/sales/contracts/msa?status=Active,Client Under Review`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch MSA contracts');
  return response.json();
};

// Fetch MSA details to auto-populate client
const fetchMSADetails = async (msaId: string, token: string): Promise<MSAContract> => {
  const response = await fetch(`${API_BASE_URL}/sales/contracts/msa/${msaId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch MSA details');
  return response.json();
};

// Fetch sales users (for Assignee and LandBridge Contact)
const fetchSalesUsers = async (token: string): Promise<SalesUser[]> => {
  const response = await fetch(`${API_BASE_URL}/sales/users`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch sales users');
  return response.json();
};

// Create SOW contract
const createSOWContract = async (formData: CreateSOWFormData, token: string): Promise<{ id: number; contractId: string }> => {
  const formDataToSend = new FormData();
  formDataToSend.append('msaId', formData.msaId || '');
  formDataToSend.append('clientId', formData.clientId?.toString() || '');
  formDataToSend.append('engagementType', formData.engagementType);
  formDataToSend.append('effectiveStart', formData.effectiveStart || '');
  formDataToSend.append('effectiveEnd', formData.effectiveEnd || '');
  formDataToSend.append('status', formData.status);
  formDataToSend.append('assigneeUserId', formData.assigneeUserId?.toString() || '');
  formDataToSend.append('note', formData.note);
  formDataToSend.append('scopeSummary', formData.scopeSummary);
  formDataToSend.append('deliveryItems', JSON.stringify(formData.deliveryItems));
  formDataToSend.append('milestoneDeliverables', JSON.stringify(formData.milestoneDeliverables));
  formDataToSend.append('billingDetails', JSON.stringify(formData.billingDetails));
  formDataToSend.append('reviewerId', formData.reviewerId?.toString() || '');
  formDataToSend.append('reviewNotes', formData.reviewNotes);
  formDataToSend.append('reviewAction', formData.reviewAction || '');
  
  // Append attachments
  formData.attachments.forEach((file) => {
    formDataToSend.append('attachments', file);
  });

  const response = await fetch(`${API_BASE_URL}/sales/contracts/sow`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formDataToSend,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create SOW contract' }));
    throw new Error(error.message || 'Failed to create SOW contract');
  }

  return response.json();
};

// Submit review
const submitReview = async (contractId: number, reviewNotes: string, action: string, token: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/sales/contracts/sow/${contractId}/review`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reviewNotes, action }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to submit review' }));
    throw new Error(error.message || 'Failed to submit review');
  }
};
```

### Backend Requirements

```java
// Sales SOW Contract Controller
@RestController
@RequestMapping("/sales/contracts/sow")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:4200"}, 
             allowCredentials = "true",
             maxAge = 3600)
public class SalesSOWContractController {
    
    @Autowired
    private SalesSOWContractService contractService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @PostMapping
    public ResponseEntity<?> createSOWContract(
        @RequestParam String msaId,
        @RequestParam Integer clientId,
        @RequestParam String engagementType,
        @RequestParam String effectiveStart,
        @RequestParam String effectiveEnd,
        @RequestParam String status,
        @RequestParam Integer assigneeUserId,
        @RequestParam(required = false) String note,
        @RequestParam(required = false) String scopeSummary,
        @RequestParam String deliveryItems, // JSON string
        @RequestParam String milestoneDeliverables, // JSON string
        @RequestParam String billingDetails, // JSON string
        @RequestParam(required = false) Integer reviewerId,
        @RequestParam(required = false) String reviewNotes,
        @RequestParam(required = false) String reviewAction,
        @RequestParam(required = false) MultipartFile[] attachments,
        Authentication authentication,
        HttpServletRequest request
    ) {
        User currentUser = getCurrentUser(authentication, request);
        if (currentUser == null || (!currentUser.getRole().equals("SALES_MANAGER") && !currentUser.getRole().equals("SALES_REP"))) {
            return ResponseEntity.status(403).build();
        }
        
        CreateSOWRequest createRequest = new CreateSOWRequest();
        createRequest.setMsaId(msaId);
        createRequest.setClientId(clientId);
        createRequest.setEngagementType(engagementType);
        createRequest.setEffectiveStart(LocalDate.parse(effectiveStart));
        createRequest.setEffectiveEnd(LocalDate.parse(effectiveEnd));
        createRequest.setStatus(status);
        createRequest.setAssigneeUserId(assigneeUserId);
        createRequest.setNote(note);
        createRequest.setScopeSummary(scopeSummary);
        // Parse JSON strings to objects
        createRequest.setDeliveryItems(parseDeliveryItems(deliveryItems));
        createRequest.setMilestoneDeliverables(parseMilestoneDeliverables(milestoneDeliverables));
        createRequest.setBillingDetails(parseBillingDetails(billingDetails));
        createRequest.setReviewerId(reviewerId);
        createRequest.setReviewNotes(reviewNotes);
        createRequest.setReviewAction(reviewAction);
        
        try {
            SOWContractDTO contract = contractService.createSOWContract(createRequest, attachments, currentUser);
            return ResponseEntity.ok(contract);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @PostMapping("/{contractId}/review")
    public ResponseEntity<?> submitReview(
        @PathVariable Integer contractId,
        @RequestBody SubmitReviewRequest request,
        Authentication authentication,
        HttpServletRequest httpRequest
    ) {
        User currentUser = getCurrentUser(authentication, httpRequest);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        
        try {
            SOWContractDTO contract = contractService.submitReview(contractId, request.getReviewNotes(), 
                request.getAction(), currentUser);
            return ResponseEntity.ok(contract);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(new ErrorResponse(e.getMessage()));
        }
    }
    
    private User getCurrentUser(Authentication authentication, HttpServletRequest request) {
        // Implementation similar to SalesMSAContractController
        // ...
    }
}

// Sales SOW Contract Service
@Service
@Transactional
public class SalesSOWContractService {
    
    @Autowired
    private SOWContractRepository sowContractRepository;
    
    @Autowired
    private ContractRepository contractRepository; // For MSA
    
    @Autowired
    private DeliveryItemRepository deliveryItemRepository;
    
    @Autowired
    private MilestoneDeliverableRepository milestoneDeliverableRepository;
    
    @Autowired
    private RetainerBillingDetailRepository retainerBillingDetailRepository;
    
    @Autowired
    private FixedPriceBillingDetailRepository fixedPriceBillingDetailRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private S3Service s3Service;
    
    @Autowired
    private ContractHistoryRepository contractHistoryRepository;
    
    public SOWContractDTO createSOWContract(CreateSOWRequest request, MultipartFile[] attachments, User currentUser) {
        // Validate MSA
        Contract parentMSA = contractRepository.findByContractId(request.getMsaId())
            .orElseThrow(() -> new RuntimeException("Parent MSA not found"));
        
        if (!"Active".equals(parentMSA.getStatus().name()) && !"Client Under Review".equals(parentMSA.getStatus().name())) {
            throw new RuntimeException("Parent MSA must be Active or Client Under Review");
        }
        
        // Create SOW contract
        SOWContract contract = new SOWContract();
        contract.setClientId(request.getClientId());
        contract.setParentMsaId(parentMSA.getId());
        contract.setEngagementType(request.getEngagementType());
        contract.setContractName("SOW Contract"); // Or generate from project name
        contract.setStatus(SOWContractStatus.valueOf(request.getStatus().toUpperCase().replace(" ", "_")));
        contract.setPeriodStart(request.getEffectiveStart());
        contract.setPeriodEnd(request.getEffectiveEnd());
        contract.setAssigneeUserId(request.getAssigneeUserId());
        contract.setScopeSummary(request.getScopeSummary());
        contract.setNote(request.getNote());
        
        // Set commercial terms from parent MSA (or allow override)
        contract.setCurrency(parentMSA.getCurrency());
        contract.setPaymentTerms(parentMSA.getPaymentTerms());
        contract.setInvoicingCycle(parentMSA.getInvoicingCycle());
        contract.setBillingDay(parentMSA.getBillingDay());
        contract.setTaxWithholding(parentMSA.getTaxWithholding());
        contract.setIpOwnership(parentMSA.getIpOwnership());
        contract.setGoverningLaw(parentMSA.getGoverningLaw());
        
        // Set LandBridge contact
        User landbridgeContact = userRepository.findById(request.getAssigneeUserId())
            .orElseThrow(() -> new RuntimeException("Assignee not found"));
        contract.setLandbridgeContactName(landbridgeContact.getFullName());
        contract.setLandbridgeContactEmail(landbridgeContact.getEmail());
        
        contract = sowContractRepository.save(contract);
        
        // Generate contract ID
        String contractId = generateContractId(contract.getId(), contract.getCreatedAt());
        
        // Create delivery items or milestone deliverables based on engagement type
        if ("Retainer".equals(request.getEngagementType())) {
            createDeliveryItems(contract.getId(), request.getDeliveryItems());
            createRetainerBillingDetails(contract.getId(), request.getBillingDetails());
        } else if ("Fixed Price".equals(request.getEngagementType())) {
            createMilestoneDeliverables(contract.getId(), request.getMilestoneDeliverables());
            createFixedPriceBillingDetails(contract.getId(), request.getBillingDetails());
        }
        
        // Upload attachments
        if (attachments != null && attachments.length > 0) {
            uploadAttachments(contract.getId(), attachments, currentUser.getId());
        }
        
        // Handle review if reviewer is assigned
        if (request.getReviewerId() != null) {
            contract.setReviewerId(request.getReviewerId());
            contract = sowContractRepository.save(contract);
            
            // If review is submitted, handle review submission
            if (request.getReviewAction() != null) {
                submitReview(contract.getId(), request.getReviewNotes(), request.getReviewAction(), currentUser);
            }
        }
        
        // Create initial history entry
        createHistoryEntry(contract.getId(), "CREATED", 
            "SOW Contract created by " + currentUser.getFullName(), null, null, currentUser.getId());
        
        return convertToDTO(contract, contractId);
    }
    
    private void createDeliveryItems(Integer sowContractId, List<DeliveryItemDTO> deliveryItems) {
        for (DeliveryItemDTO item : deliveryItems) {
            DeliveryItem deliveryItem = new DeliveryItem();
            deliveryItem.setSowContractId(sowContractId);
            deliveryItem.setMilestone(item.getMilestone());
            deliveryItem.setDeliveryNote(item.getDeliveryNote());
            deliveryItem.setAmount(new BigDecimal(item.getAmount()));
            deliveryItem.setPaymentDate(LocalDate.parse(item.getPaymentDate()));
            deliveryItemRepository.save(deliveryItem);
        }
    }
    
    private void createMilestoneDeliverables(Integer sowContractId, List<MilestoneDeliverableDTO> milestones) {
        for (MilestoneDeliverableDTO milestone : milestones) {
            MilestoneDeliverable deliverable = new MilestoneDeliverable();
            deliverable.setSowContractId(sowContractId);
            deliverable.setMilestone(milestone.getMilestone());
            deliverable.setDeliveryNote(milestone.getDeliveryNote());
            deliverable.setAcceptanceCriteria(milestone.getAcceptanceCriteria());
            deliverable.setPlannedEnd(LocalDate.parse(milestone.getPlannedEnd()));
            deliverable.setPaymentPercentage(new BigDecimal(milestone.getPaymentPercentage()));
            milestoneDeliverableRepository.save(deliverable);
        }
    }
    
    private void createRetainerBillingDetails(Integer sowContractId, List<BillingDetailDTO> billingDetails) {
        for (BillingDetailDTO detail : billingDetails) {
            RetainerBillingDetail billingDetail = new RetainerBillingDetail();
            billingDetail.setSowContractId(sowContractId);
            billingDetail.setPaymentDate(LocalDate.parse(detail.getPaymentDate()));
            billingDetail.setDeliveryNote(detail.getDeliveryNote());
            billingDetail.setAmount(new BigDecimal(detail.getAmount()));
            retainerBillingDetailRepository.save(billingDetail);
        }
    }
    
    private void createFixedPriceBillingDetails(Integer sowContractId, List<BillingDetailDTO> billingDetails) {
        for (BillingDetailDTO detail : billingDetails) {
            FixedPriceBillingDetail billingDetail = new FixedPriceBillingDetail();
            billingDetail.setSowContractId(sowContractId);
            billingDetail.setBillingName(detail.getBillingName());
            billingDetail.setMilestone(detail.getMilestone());
            billingDetail.setAmount(new BigDecimal(detail.getAmount()));
            billingDetail.setPercentage(detail.getPercentage() != null ? new BigDecimal(detail.getPercentage()) : null);
            billingDetail.setInvoiceDate(LocalDate.parse(detail.getPaymentDate())); // Using paymentDate as invoiceDate
            fixedPriceBillingDetailRepository.save(billingDetail);
        }
    }
    
    public SOWContractDTO submitReview(Integer contractId, String reviewNotes, String action, User currentUser) {
        SOWContract contract = sowContractRepository.findById(contractId)
            .orElseThrow(() -> new RuntimeException("Contract not found"));
        
        // Verify current user is the assigned reviewer
        if (contract.getReviewerId() == null || !contract.getReviewerId().equals(currentUser.getId())) {
            throw new RuntimeException("Only the assigned reviewer can submit review");
        }
        
        // Update contract status based on action
        if ("APPROVE".equals(action)) {
            contract.setStatus(SOWContractStatus.Under_Review); // Maps to "Client Under Review" in display
        } else if ("REQUEST_REVISION".equals(action)) {
            contract.setStatus(SOWContractStatus.Draft);
        }
        
        contract = sowContractRepository.save(contract);
        
        // Save review to contract_internal_review table
        ContractInternalReview review = new ContractInternalReview();
        review.setSowContractId(contractId);
        review.setContractId(null); // SOW contract only
        review.setContractType("SOW");
        review.setReviewerId(currentUser.getId());
        review.setReviewAction(action);
        review.setReviewNotes(reviewNotes);
        contractInternalReviewRepository.save(review);
        
        return convertToDTO(contract, generateContractId(contract.getId(), contract.getCreatedAt()));
    }
    
    private String generateContractId(Integer id, LocalDateTime createdAt) {
        int year = createdAt.getYear();
        int month = createdAt.getMonthValue();
        int day = createdAt.getDayOfMonth();
        // Calculate sequence number for the day
        int sequenceNumber = calculateSequenceNumber(id, year, month, day);
        return String.format("SOW-%d-%02d-%02d-%02d", year, month, day, sequenceNumber);
    }
    
    private void uploadAttachments(Integer contractId, MultipartFile[] attachments, Integer ownerId) {
        // Implementation similar to SalesMSAContractService
        // ...
    }
    
    private void createHistoryEntry(Integer contractId, String activityType, String description, 
                                   String fileLink, String fileUrl, Integer createdBy) {
        ContractHistory history = new ContractHistory();
        history.setContractId(null); // SOW contracts use sow_contract_id
        history.setSowContractId(contractId);
        history.setActivityType(activityType);
        history.setActivityDescription(description);
        history.setFileLink(fileLink);
        history.setFileUrl(fileUrl);
        history.setCreatedBy(createdBy);
        contractHistoryRepository.save(history);
    }
}
```

### Database Schema

**Note**: The `sow_contracts` table already exists. This story uses the existing schema with the following related tables:

```sql
-- sow_contracts table (existing)
CREATE TABLE sow_contracts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT NOT NULL,
  contract_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Draft',
  engagement_type VARCHAR(50) NOT NULL, -- 'Fixed Price' or 'Retainer'
  parent_msa_id INT NOT NULL, -- Reference to parent MSA contract
  project_name VARCHAR(255) NOT NULL,
  scope_summary TEXT,
  period_start DATE,
  period_end DATE,
  value DECIMAL(16,2),
  assignee_user_id INT,
  currency VARCHAR(16),
  payment_terms VARCHAR(128),
  invoicing_cycle VARCHAR(64),
  billing_day VARCHAR(64),
  tax_withholding VARCHAR(16),
  ip_ownership VARCHAR(128),
  governing_law VARCHAR(64),
  landbridge_contact_name VARCHAR(255),
  landbridge_contact_email VARCHAR(255),
  reviewer_id INT NULL,
  link VARCHAR(500) NULL,
  attachments_manifest TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_msa_id) REFERENCES contracts(id) ON DELETE CASCADE,
  FOREIGN KEY (assignee_user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_sow_contracts_client_id (client_id),
  INDEX idx_sow_contracts_parent_msa_id (parent_msa_id),
  INDEX idx_sow_contracts_status (status),
  INDEX idx_sow_contracts_engagement_type (engagement_type)
);

-- delivery_items table (for Retainer SOW)
CREATE TABLE IF NOT EXISTS delivery_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sow_contract_id INT NOT NULL,
  milestone VARCHAR(255) NOT NULL, -- "November 2025", etc.
  delivery_note TEXT NOT NULL,
  amount DECIMAL(16,2) NOT NULL,
  payment_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sow_contract_id) REFERENCES sow_contracts(id) ON DELETE CASCADE,
  INDEX idx_delivery_items_sow_contract_id (sow_contract_id),
  INDEX idx_delivery_items_payment_date (payment_date)
);

-- milestone_deliverables table (for Fixed Price SOW)
CREATE TABLE IF NOT EXISTS milestone_deliverables (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sow_contract_id INT NOT NULL,
  milestone VARCHAR(255) NOT NULL, -- "Kickoff", "Design Phase", etc.
  delivery_note TEXT,
  acceptance_criteria TEXT,
  planned_end DATE NOT NULL,
  payment_percentage DECIMAL(5,2) NOT NULL, -- 20.00, 30.00, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sow_contract_id) REFERENCES sow_contracts(id) ON DELETE CASCADE,
  INDEX idx_milestone_deliverables_sow_contract_id (sow_contract_id),
  INDEX idx_milestone_deliverables_planned_end (planned_end)
);

-- retainer_billing_details table (for Retainer SOW)
CREATE TABLE IF NOT EXISTS retainer_billing_details (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sow_contract_id INT NOT NULL,
  payment_date DATE NOT NULL,
  delivery_note TEXT NOT NULL,
  amount DECIMAL(16,2) NOT NULL,
  delivery_item_id INT NULL, -- Reference to delivery item
  change_request_id INT NULL, -- Reference to change request
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sow_contract_id) REFERENCES sow_contracts(id) ON DELETE CASCADE,
  FOREIGN KEY (delivery_item_id) REFERENCES delivery_items(id) ON DELETE SET NULL,
  INDEX idx_retainer_billing_details_sow_contract_id (sow_contract_id),
  INDEX idx_retainer_billing_details_payment_date (payment_date)
);

-- fixed_price_billing_details table (for Fixed Price SOW)
CREATE TABLE IF NOT EXISTS fixed_price_billing_details (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sow_contract_id INT NOT NULL,
  billing_name VARCHAR(255) NOT NULL, -- "Kickoff Payment", etc.
  milestone VARCHAR(255),
  amount DECIMAL(16,2) NOT NULL,
  percentage DECIMAL(5,2) NULL, -- May be null for change request items
  invoice_date DATE NOT NULL,
  milestone_deliverable_id INT NULL, -- Reference to milestone
  change_request_id INT NULL, -- Reference to change request
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sow_contract_id) REFERENCES sow_contracts(id) ON DELETE CASCADE,
  FOREIGN KEY (milestone_deliverable_id) REFERENCES milestone_deliverables(id) ON DELETE SET NULL,
  INDEX idx_fixed_price_billing_details_sow_contract_id (sow_contract_id),
  INDEX idx_fixed_price_billing_details_invoice_date (invoice_date)
);

-- contract_history table (existing, supports both MSA and SOW)
CREATE TABLE contract_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contract_id INT NULL, -- For MSA contracts
  sow_contract_id INT NULL, -- For SOW contracts
  activity_type VARCHAR(50) NOT NULL,
  activity_description TEXT,
  file_link VARCHAR(500),
  file_url VARCHAR(500),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
  FOREIGN KEY (sow_contract_id) REFERENCES sow_contracts(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_contract_history_contract_id (contract_id),
  INDEX idx_contract_history_sow_contract_id (sow_contract_id),
  INDEX idx_contract_history_created_at (created_at)
);
```

## Testing Requirements

### Unit Tests
- [ ] Test form validation for all required fields
- [ ] Test MSA selection and client auto-population
- [ ] Test engagement type switching (Fixed Price vs Retainer)
- [ ] Test delivery items addition/removal (Retainer)
- [ ] Test milestone deliverables addition/removal (Fixed Price)
- [ ] Test billing details auto-generation
- [ ] Test date validation (Effective End after Effective Start)
- [ ] Test file upload validation (PDF only, size limit)
- [ ] Test review workflow (assign reviewer, submit review)
- [ ] Test contract ID generation
- [ ] Test status updates based on review actions

### Integration Tests
- [ ] Test API endpoint `/sales/contracts/sow` with valid data (Retainer)
- [ ] Test API endpoint `/sales/contracts/sow` with valid data (Fixed Price)
- [ ] Test API endpoint with missing required fields (400 error)
- [ ] Test API endpoint with invalid MSA (400 error)
- [ ] Test file upload to S3
- [ ] Test review submission endpoint
- [ ] Test authorization (only Sales users can create contracts)
- [ ] Test delivery items creation (Retainer)
- [ ] Test milestone deliverables creation (Fixed Price)
- [ ] Test billing details creation

### E2E Tests
- [ ] Create Retainer SOW contract from MSA
- [ ] Create Fixed Price SOW contract from MSA
- [ ] Fill all form fields and save as draft
- [ ] Add/remove delivery items (Retainer)
- [ ] Add/remove milestone deliverables (Fixed Price)
- [ ] Upload PDF attachments
- [ ] Assign reviewer and submit review
- [ ] Save contract and verify creation
- [ ] Cancel form and verify navigation
- [ ] Form validation displays errors correctly
- [ ] Engagement type switching works correctly

## Performance Requirements
- [ ] Form should load within 1 second
- [ ] File upload should support files up to 10MB
- [ ] Multiple file uploads should be handled efficiently
- [ ] Form submission should complete within 3 seconds
- [ ] Billing details auto-generation should be instant

## Security Considerations
- [ ] Only authenticated Sales users can create SOW contracts
- [ ] File uploads are validated (type and size)
- [ ] SQL injection prevention using parameterized queries
- [ ] XSS prevention in all text fields
- [ ] Reviewer assignment validation (only Sales Managers)
- [ ] MSA validation (only Active or Client Under Review MSA can be selected)

## Definition of Done
- [ ] All acceptance criteria are met
- [ ] Code is reviewed and approved
- [ ] Unit tests are written and passing (coverage > 80%)
- [ ] Integration tests are written and passing
- [ ] E2E tests are written and passing
- [ ] Form matches wireframe design exactly
- [ ] Backend API is documented
- [ ] File upload to S3 is working
- [ ] Review workflow is tested and verified
- [ ] Both Retainer and Fixed Price engagement types work correctly
- [ ] Delivery items and milestone deliverables are created correctly
- [ ] Billing details are generated correctly
- [ ] No linter errors
- [ ] No console errors in browser
- [ ] Responsive design works on mobile, tablet, and desktop

## Dependencies
- **Internal Dependencies**:
  - Story-24: Sales Contract List Management (required for navigation)
  - Story-25: Sales Create MSA (shared components and patterns, parent MSA contracts)
  - Story-14: Client Contract Detail SOW View (reference for SOW structure)
  - Sales Header and Sidebar components (shared components)
  - Language Context (for i18n)
  - Auth Context (for authentication)

- **External Dependencies**:
  - `sow_contracts` table in database
  - `delivery_items` table in database
  - `milestone_deliverables` table in database
  - `retainer_billing_details` table in database
  - `fixed_price_billing_details` table in database
  - `contracts` table (for parent MSA)
  - `contract_history` table
  - `contract_internal_review` table
  - S3Service for file uploads
  - Authentication/Authorization system

## Risks and Mitigation
- **Risk**: Engagement type switching may be complex
  - **Mitigation**: Use conditional rendering and separate state management for each type

- **Risk**: Billing details auto-generation logic may be complex
  - **Mitigation**: Implement clear business logic and validation, allow manual override

- **Risk**: Delivery items and milestone deliverables have different structures
  - **Mitigation**: Use separate tables and DTOs for each type

- **Risk**: Contract ID generation format differs from MSA
  - **Mitigation**: Follow existing pattern: SOW-YYYY-MM-DD-NN

## Success Metrics
- [ ] SOW creation form loads successfully for all authenticated Sales users
- [ ] Both Retainer and Fixed Price SOW contracts can be created
- [ ] Delivery items and milestone deliverables are saved correctly
- [ ] Billing details are generated correctly
- [ ] Review workflow works correctly
- [ ] File uploads work correctly
- [ ] Form matches wireframe design
- [ ] Performance requirements met
- [ ] Zero security vulnerabilities

## Future Enhancements
- [ ] Change request creation workflow
- [ ] Milestone tracking and progress updates
- [ ] Delivery item status tracking
- [ ] Billing schedule notifications
- [ ] SOW export functionality (PDF, DOCX)
- [ ] SOW version history and comparison
- [ ] SOW template management
- [ ] Advanced analytics and reporting
- [ ] Bulk delivery items import (CSV)
- [ ] Milestone template library

---

**Document Control**
- **Version**: 1.0
- **Created**: January 2025
- **Last Updated**: January 2025
- **Next Review**: March 2025
- **Approved By**: System Management Team
- **Distribution**: Development Team, Product Team, Management

