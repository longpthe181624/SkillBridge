# User Story: Sales Create MSA (Master Service Agreement)

## Story Information
- **Story ID**: Story-25
- **Title**: Sales Create MSA (Master Service Agreement)
- **Epic**: Sales Portal - Contract Management
- **Priority**: High
- **Story Points**: 21
- **Sprint**: Sprint 6
- **Status**: Draft

## User Story
**As a** Sales User (Sales Manager or Sales Man)  
**I want to** create a new MSA (Master Service Agreement) contract from an opportunity  
**So that** I can convert approved opportunities into formal contracts and manage contract terms, commercial details, and legal compliance information

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] I can create a new MSA contract from an opportunity
- [ ] I can fill in all required MSA information including summary, commercial terms, legal/compliance, and contacts
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
  - [ ] Displays "Contract Management > Add new MSA(Master Service Agreement)"
  - [ ] "Contract Management" is clickable and links back to contract list (`/sales/contracts`)
  - [ ] "Add new MSA(Master Service Agreement)" is the current page (non-clickable)
  - [ ] Breadcrumbs are positioned below header, above form title

#### 3. Form Title

- [ ] **Form Title**:
  - [ ] Displays "Add new MSA (Master Service Agreement)" as the main form title
  - [ ] Positioned below breadcrumbs
  - [ ] Large, bold text for clear visibility

#### 4. MSA Summary Section

- [ ] **Section Header**:
  - [ ] Displays "MSA Summary" as section header
  - [ ] Clear visual separation from other sections

- [ ] **Opportunity ID**:
  - [ ] Label: "Opportunity ID"
  - [ ] Field type: Dropdown/Select
  - [ ] Displays list of opportunities (format: "OP-YYYY-NN", e.g., "OP-2025-07-21")
  - [ ] Only shows opportunities that have approved proposals (client approved)
  - [ ] Pre-selects opportunity if coming from opportunity detail page
  - [ ] Required field
  - [ ] Selecting an opportunity auto-populates Client field

- [ ] **Client**:
  - [ ] Label: "Client"
  - [ ] Field type: Read-only text field
  - [ ] Auto-populated from selected Opportunity (client name, e.g., "yamada taro")
  - [ ] Cannot be edited directly
  - [ ] Displays client's full name

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

- [ ] **Assignee**:
  - [ ] Label: "Assignee"
  - [ ] Field type: Dropdown/Select
  - [ ] Displays list of Sales Men (users with role SALES_REP)
  - [ ] Format: "Sale 01", "Sale 02", etc. (or full name)
  - [ ] Pre-selects current user if they are a Sales Man
  - [ ] Sales Manager can assign to any Sales Man
  - [ ] Required field

- [ ] **Note**:
  - [ ] Label: "Note"
  - [ ] Field type: Large textarea
  - [ ] Placeholder: "Lorem Ipsum is simply dummy text"
  - [ ] Multi-line text input
  - [ ] Optional field
  - [ ] Character limit: 5000 characters (optional)

#### 5. Commercial Terms Section

- [ ] **Section Header**:
  - [ ] Displays "Commercial Terms" as section header
  - [ ] Clear visual separation from other sections

- [ ] **Currency**:
  - [ ] Label: "Currency"
  - [ ] Field type: Dropdown/Select
  - [ ] Options: "JPY", "USD", "EUR", "SGD", etc.
  - [ ] Default value: "JPY"
  - [ ] Required field

- [ ] **Payment Terms**:
  - [ ] Label: "Payment Terms"
  - [ ] Field type: Dropdown/Select
  - [ ] Options: "Net", "Net 30", "Net 60", "Net 90", "Due on Receipt", etc.
  - [ ] Default value: "Net"
  - [ ] Required field

- [ ] **Invoicing Cycle**:
  - [ ] Label: "Invoicing Cycle"
  - [ ] Field type: Dropdown/Select
  - [ ] Options: "Monthly", "Weekly", "Bi-weekly", "Quarterly", "Annually"
  - [ ] Default value: "Monthly"
  - [ ] Required field

- [ ] **Billing Day**:
  - [ ] Label: "Billing Day"
  - [ ] Field type: Dropdown/Select
  - [ ] Options: "Last business day", "1st of month", "15th of month", "End of month", etc.
  - [ ] Default value: "Last business day"
  - [ ] Required field

- [ ] **Tax / Withholding**:
  - [ ] Label: "Tax / Withholding"
  - [ ] Field type: Dropdown/Select
  - [ ] Options: "0%", "10%", "15%", "20%", etc.
  - [ ] Default value: "10%"
  - [ ] Required field

#### 6. Legal / Compliance Section

- [ ] **Section Header**:
  - [ ] Displays "Legal / Compliance" as section header
  - [ ] Clear visual separation from other sections

- [ ] **IP Ownership**:
  - [ ] Label: "IP Ownership"
  - [ ] Field type: Dropdown/Select
  - [ ] Options: "Client", "LandBridge", "Joint", "Work for Hire"
  - [ ] Default value: "Client"
  - [ ] Required field

- [ ] **Governing Law**:
  - [ ] Label: "Governing Law"
  - [ ] Field type: Dropdown/Select
  - [ ] Options: "JP" (Japan), "US" (United States), "SG" (Singapore), etc.
  - [ ] Default value: "JP"
  - [ ] Required field

#### 7. Contacts Section

- [ ] **Section Header**:
  - [ ] Displays "Contacts" as section header
  - [ ] Clear visual separation from other sections

- [ ] **Client**:
  - [ ] Label: "Client"
  - [ ] Field type: Dropdown/Select
  - [ ] Displays list of client users (from users table with role CLIENT_USER)
  - [ ] Format: "Client Name (email@example.com)" (e.g., "Yamada Taro (yamada_taro@gmail.com)")
  - [ ] Auto-populated from selected Opportunity if available
  - [ ] Required field

- [ ] **LandBridge**:
  - [ ] Label: "LandBridge"
  - [ ] Field type: Dropdown/Select
  - [ ] Displays list of Sales users (Sales Manager and Sales Man)
  - [ ] Format: "Name (email@landbridge.co.jp)" (e.g., "Sale 01 (mimori@landbridge.co.jp)")
  - [ ] Pre-selects current user if they are a Sales user
  - [ ] Required field

#### 8. Attachments Section

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

#### 9. Internal Review Workflow Section

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

- [ ] **Review Notes**:
  - [ ] Label: "Review Notes"
  - [ ] Field type: Large textarea
  - [ ] Placeholder: "Lorem ip sum"
  - [ ] Multi-line text input
  - [ ] Only editable by assigned reviewer
  - [ ] Disabled if no reviewer is assigned
  - [ ] Disabled after review is submitted
  - [ ] Optional field

#### 10. Actions Section

- [ ] **Actions Dropdown**:
  - [ ] Label: "Actions"
  - [ ] Field type: Dropdown/Select
  - [ ] Options: "Approve", "Request Revision", "Reject"
  - [ ] Only visible and editable by assigned reviewer
  - [ ] Disabled if no reviewer is assigned
  - [ ] Disabled after review is submitted
  - [ ] Required when submitting review

- [ ] **Submit Review Button**:
  - [ ] Button text: "Submit review"
  - [ ] Button style: Primary button (dark grey background, white text)
  - [ ] Only visible when reviewer is assigned and review is not yet submitted
  - [ ] Clicking button:
    - [ ] Validates that Actions dropdown has a value
    - [ ] Validates that Review Notes are filled (optional, can be empty)
    - [ ] Submits review with selected action and notes
    - [ ] Updates contract status based on action:
      - [ ] "Approve" → Status becomes "Client Under Review"
      - [ ] "Request Revision" → Status becomes "Draft" (or "Internal Review")
      - [ ] "Reject" → Status becomes "Draft" (or "Rejected")
    - [ ] Creates history entry for review submission
    - [ ] Shows success message
    - [ ] Disables review fields after submission

- [ ] **Save as Draft Button**:
  - [ ] Button text: "Save as Draft"
  - [ ] Button style: Secondary button (light grey border, white background, dark grey text)
  - [ ] Always visible
  - [ ] Clicking button:
    - [ ] Saves contract with status "Draft"
    - [ ] Validates required fields (Opportunity ID, Client, Effective Start, Effective End, Assignee, Currency, Payment Terms, Invoicing Cycle, Billing Day, Tax/Withholding, IP Ownership, Governing Law, Client Contact, LandBridge Contact)
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
      - [ ] If action is "Request Revision" or "Reject", saves contract with status "Draft"
    - [ ] If no reviewer assigned or review not submitted:
      - [ ] Saves contract with current status (default: "Draft")
    - [ ] Uploads attachments to S3 (if any)
    - [ ] Creates contract in database
    - [ ] Generates contract ID (format: MSA-YYYY-NN)
    - [ ] Creates initial history entry
    - [ ] Shows success message
    - [ ] Navigates to contract detail page or contract list page

## Technical Requirements

### Frontend Requirements

```typescript
// Sales Create MSA Page Component Structure
interface CreateMSAPageProps {
  opportunityId?: string; // Optional: pre-selected opportunity ID from URL
}

interface CreateMSAFormData {
  opportunityId: string | null;
  clientId: number | null;
  clientName: string;
  effectiveStart: string | null; // Format: YYYY-MM-DD
  effectiveEnd: string | null; // Format: YYYY-MM-DD
  status: 'Draft' | 'Internal Review' | 'Client Under Review' | 'Active' | 'Completed' | 'Terminated';
  assigneeUserId: number | null;
  note: string;
  currency: string;
  paymentTerms: string;
  invoicingCycle: string;
  billingDay: string;
  taxWithholding: string;
  ipOwnership: string;
  governingLaw: string;
  clientContactId: number | null;
  landbridgeContactId: number | null;
  attachments: File[];
  reviewerId: number | null;
  reviewNotes: string;
  reviewAction: 'APPROVE' | 'REQUEST_REVISION' | 'REJECT' | null;
}

interface Opportunity {
  id: number;
  opportunityId: string; // Format: OP-YYYY-NN
  clientName: string;
  clientId: number;
  status: string;
}

interface SalesUser {
  id: number;
  fullName: string;
  email: string;
  role: 'SALES_MANAGER' | 'SALES_REP';
}

interface ClientUser {
  id: number;
  fullName: string;
  email: string;
}
```

### Key Frontend Functions

```typescript
// Fetch opportunities with approved proposals
const fetchApprovedOpportunities = async (token: string): Promise<Opportunity[]> => {
  const response = await fetch(`${API_BASE_URL}/sales/opportunities?status=WON&hasApprovedProposal=true`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch opportunities');
  return response.json();
};

// Fetch opportunity details to auto-populate client
const fetchOpportunityDetails = async (opportunityId: string, token: string): Promise<Opportunity> => {
  const response = await fetch(`${API_BASE_URL}/sales/opportunities/${opportunityId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch opportunity details');
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

// Fetch client users (for Client Contact)
const fetchClientUsers = async (token: string): Promise<ClientUser[]> => {
  const response = await fetch(`${API_BASE_URL}/sales/clients`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch client users');
  return response.json();
};

// Create MSA contract
const createMSAContract = async (formData: CreateMSAFormData, token: string): Promise<{ id: number; contractId: string }> => {
  const formDataToSend = new FormData();
  formDataToSend.append('opportunityId', formData.opportunityId || '');
  formDataToSend.append('clientId', formData.clientId?.toString() || '');
  formDataToSend.append('effectiveStart', formData.effectiveStart || '');
  formDataToSend.append('effectiveEnd', formData.effectiveEnd || '');
  formDataToSend.append('status', formData.status);
  formDataToSend.append('assigneeUserId', formData.assigneeUserId?.toString() || '');
  formDataToSend.append('note', formData.note);
  formDataToSend.append('currency', formData.currency);
  formDataToSend.append('paymentTerms', formData.paymentTerms);
  formDataToSend.append('invoicingCycle', formData.invoicingCycle);
  formDataToSend.append('billingDay', formData.billingDay);
  formDataToSend.append('taxWithholding', formData.taxWithholding);
  formDataToSend.append('ipOwnership', formData.ipOwnership);
  formDataToSend.append('governingLaw', formData.governingLaw);
  formDataToSend.append('clientContactId', formData.clientContactId?.toString() || '');
  formDataToSend.append('landbridgeContactId', formData.landbridgeContactId?.toString() || '');
  formDataToSend.append('reviewerId', formData.reviewerId?.toString() || '');
  formDataToSend.append('reviewNotes', formData.reviewNotes);
  formDataToSend.append('reviewAction', formData.reviewAction || '');
  
  // Append attachments
  formData.attachments.forEach((file) => {
    formDataToSend.append('attachments', file);
  });

  const response = await fetch(`${API_BASE_URL}/sales/contracts/msa`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formDataToSend,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create MSA contract' }));
    throw new Error(error.message || 'Failed to create MSA contract');
  }

  return response.json();
};

// Submit review
const submitReview = async (contractId: number, reviewNotes: string, action: string, token: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/sales/contracts/msa/${contractId}/review`, {
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
// Sales MSA Contract Controller
@RestController
@RequestMapping("/sales/contracts/msa")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:4200"}, 
             allowCredentials = "true",
             maxAge = 3600)
public class SalesMSAContractController {
    
    @Autowired
    private SalesMSAContractService contractService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @PostMapping
    public ResponseEntity<?> createMSAContract(
        @RequestParam(required = false) String opportunityId,
        @RequestParam Integer clientId,
        @RequestParam String effectiveStart,
        @RequestParam String effectiveEnd,
        @RequestParam String status,
        @RequestParam Integer assigneeUserId,
        @RequestParam(required = false) String note,
        @RequestParam String currency,
        @RequestParam String paymentTerms,
        @RequestParam String invoicingCycle,
        @RequestParam String billingDay,
        @RequestParam String taxWithholding,
        @RequestParam String ipOwnership,
        @RequestParam String governingLaw,
        @RequestParam Integer clientContactId,
        @RequestParam Integer landbridgeContactId,
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
        
        CreateMSARequest createRequest = new CreateMSARequest();
        createRequest.setOpportunityId(opportunityId);
        createRequest.setClientId(clientId);
        createRequest.setEffectiveStart(LocalDate.parse(effectiveStart));
        createRequest.setEffectiveEnd(LocalDate.parse(effectiveEnd));
        createRequest.setStatus(status);
        createRequest.setAssigneeUserId(assigneeUserId);
        createRequest.setNote(note);
        createRequest.setCurrency(currency);
        createRequest.setPaymentTerms(paymentTerms);
        createRequest.setInvoicingCycle(invoicingCycle);
        createRequest.setBillingDay(billingDay);
        createRequest.setTaxWithholding(taxWithholding);
        createRequest.setIpOwnership(ipOwnership);
        createRequest.setGoverningLaw(governingLaw);
        createRequest.setClientContactId(clientContactId);
        createRequest.setLandbridgeContactId(landbridgeContactId);
        createRequest.setReviewerId(reviewerId);
        createRequest.setReviewNotes(reviewNotes);
        createRequest.setReviewAction(reviewAction);
        
        try {
            MSAContractDTO contract = contractService.createMSAContract(createRequest, attachments, currentUser);
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
            MSAContractDTO contract = contractService.submitReview(contractId, request.getReviewNotes(), 
                request.getAction(), currentUser);
            return ResponseEntity.ok(contract);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(new ErrorResponse(e.getMessage()));
        }
    }
    
    private User getCurrentUser(Authentication authentication, HttpServletRequest request) {
        // Implementation similar to SalesContactController
        // ...
    }
}

// Sales MSA Contract Service
@Service
@Transactional
public class SalesMSAContractService {
    
    @Autowired
    private ContractRepository contractRepository;
    
    @Autowired
    private OpportunityRepository opportunityRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private S3Service s3Service;
    
    @Autowired
    private ContractHistoryRepository contractHistoryRepository;
    
    public MSAContractDTO createMSAContract(CreateMSARequest request, MultipartFile[] attachments, User currentUser) {
        // Validate opportunity if provided
        if (request.getOpportunityId() != null) {
            Opportunity opportunity = opportunityRepository.findByOpportunityId(request.getOpportunityId())
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));
            
            // Verify opportunity has approved proposal
            List<Proposal> proposals = proposalRepository.findByOpportunityId(opportunity.getId());
            boolean hasApprovedProposal = proposals.stream()
                .anyMatch(p -> "approved".equals(p.getStatus()) && "APPROVE".equals(p.getReviewAction()));
            
            if (!hasApprovedProposal) {
                throw new RuntimeException("Opportunity must have an approved proposal to create MSA");
            }
        }
        
        // Create contract
        Contract contract = new Contract();
        contract.setClientId(request.getClientId());
        contract.setContractName("MSA Contract"); // Or generate from opportunity
        contract.setStatus(ContractStatus.valueOf(request.getStatus().toUpperCase().replace(" ", "_")));
        contract.setPeriodStart(request.getEffectiveStart());
        contract.setPeriodEnd(request.getEffectiveEnd());
        contract.setAssigneeUserId(request.getAssigneeUserId());
        contract.setCurrency(request.getCurrency());
        contract.setPaymentTerms(request.getPaymentTerms());
        contract.setInvoicingCycle(request.getInvoicingCycle());
        contract.setBillingDay(request.getBillingDay());
        contract.setTaxWithholding(request.getTaxWithholding());
        contract.setIpOwnership(request.getIpOwnership());
        contract.setGoverningLaw(request.getGoverningLaw());
        
        // Set contacts
        User clientContact = userRepository.findById(request.getClientContactId())
            .orElseThrow(() -> new RuntimeException("Client contact not found"));
        User landbridgeContact = userRepository.findById(request.getLandbridgeContactId())
            .orElseThrow(() -> new RuntimeException("LandBridge contact not found"));
        
        contract.setLandbridgeContactName(landbridgeContact.getFullName());
        contract.setLandbridgeContactEmail(landbridgeContact.getEmail());
        
        contract = contractRepository.save(contract);
        
        // Generate contract ID
        String contractId = generateContractId(contract.getId(), contract.getCreatedAt());
        
        // Upload attachments
        if (attachments != null && attachments.length > 0) {
            List<String> attachmentUrls = new ArrayList<>();
            for (MultipartFile file : attachments) {
                if (!file.isEmpty() && file.getContentType().equals("application/pdf")) {
                    String url = s3Service.uploadFile(file, "contracts/msa/" + contract.getId());
                    attachmentUrls.add(url);
                }
            }
            // Store attachment URLs in contract history or separate table
        }
        
        // Handle review if reviewer is assigned
        if (request.getReviewerId() != null) {
            // Assign reviewer logic
            // If review is submitted, handle review submission
            if (request.getReviewAction() != null) {
                submitReview(contract.getId(), request.getReviewNotes(), request.getReviewAction(), currentUser);
            }
        }
        
        // Create initial history entry
        createHistoryEntry(contract.getId(), "CREATED", 
            "MSA Contract created by " + currentUser.getFullName(), null, null, currentUser.getId());
        
        return convertToDTO(contract, contractId);
    }
    
    public MSAContractDTO submitReview(Integer contractId, String reviewNotes, String action, User currentUser) {
        Contract contract = contractRepository.findById(contractId)
            .orElseThrow(() -> new RuntimeException("Contract not found"));
        
        // Verify current user is the assigned reviewer
        // Implementation depends on how reviewer is stored
        
        // Update contract status based on action
        if ("APPROVE".equals(action)) {
            contract.setStatus(ContractStatus.CLIENT_UNDER_REVIEW);
        } else if ("REQUEST_REVISION".equals(action) || "REJECT".equals(action)) {
            contract.setStatus(ContractStatus.Draft);
        }
        
        contract = contractRepository.save(contract);
        
        // Create history entry
        createHistoryEntry(contractId, "REVIEWED", 
            "Review submitted by " + currentUser.getFullName() + ": " + action, 
            null, null, currentUser.getId());
        
        return convertToDTO(contract, generateContractId(contract.getId(), contract.getCreatedAt()));
    }
    
    private String generateContractId(Integer id, LocalDateTime createdAt) {
        int year = createdAt.getYear();
        // Calculate sequence number
        int sequenceNumber = calculateSequenceNumber(id, year);
        return String.format("MSA-%d-%02d", year, sequenceNumber);
    }
    
    private void createHistoryEntry(Integer contractId, String activityType, String description, 
                                   String fileLink, String fileUrl, Integer createdBy) {
        ContractHistory history = new ContractHistory();
        history.setContractId(contractId);
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

**Note**: The `contracts` table already exists. This story uses the existing schema with the following fields:

```sql
-- contracts table (existing)
CREATE TABLE contracts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT NOT NULL,
  contract_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Draft',
  period_start DATE,
  period_end DATE,
  value DECIMAL(16,2),
  assignee_id VARCHAR(50),
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assignee_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_client_id (client_id),
  INDEX idx_assignee_user_id (assignee_user_id),
  INDEX idx_status (status)
);

-- contract_history table (existing)
CREATE TABLE contract_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contract_id INT NOT NULL,
  activity_type VARCHAR(50) NOT NULL,
  activity_description TEXT,
  file_link VARCHAR(500),
  file_url VARCHAR(500),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_contract_id (contract_id),
  INDEX idx_created_at (created_at)
);
```

## Testing Requirements

### Unit Tests
- [ ] Test form validation for all required fields
- [ ] Test opportunity selection and client auto-population
- [ ] Test date validation (Effective End after Effective Start)
- [ ] Test file upload validation (PDF only, size limit)
- [ ] Test review workflow (assign reviewer, submit review)
- [ ] Test contract ID generation
- [ ] Test status updates based on review actions

### Integration Tests
- [ ] Test API endpoint `/sales/contracts/msa` with valid data
- [ ] Test API endpoint with missing required fields (400 error)
- [ ] Test API endpoint with invalid opportunity (400 error)
- [ ] Test file upload to S3
- [ ] Test review submission endpoint
- [ ] Test authorization (only Sales users can create contracts)

### E2E Tests
- [ ] Create MSA contract from opportunity
- [ ] Fill all form fields and save as draft
- [ ] Upload PDF attachments
- [ ] Assign reviewer and submit review
- [ ] Save contract and verify creation
- [ ] Cancel form and verify navigation
- [ ] Form validation displays errors correctly

## Performance Requirements
- [ ] Form should load within 1 second
- [ ] File upload should support files up to 10MB
- [ ] Multiple file uploads should be handled efficiently
- [ ] Form submission should complete within 3 seconds

## Security Considerations
- [ ] Only authenticated Sales users can create MSA contracts
- [ ] File uploads are validated (type and size)
- [ ] SQL injection prevention using parameterized queries
- [ ] XSS prevention in all text fields
- [ ] Reviewer assignment validation (only Sales Managers)

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
- [ ] No linter errors
- [ ] No console errors in browser
- [ ] Responsive design works on mobile, tablet, and desktop

