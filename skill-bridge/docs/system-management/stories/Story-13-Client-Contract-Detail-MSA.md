# User Story: Client Contract Detail MSA View

## Story Information
- **Story ID**: Story-13
- **Title**: Client Contract Detail MSA View
- **Epic**: Client Portal - Contract Management
- **Priority**: High
- **Story Points**: 13
- **Sprint**: Sprint 4
- **Status**: Ready for Development

## User Story
**As a** Client  
**I want to** view detailed information about my MSA (Master Service Agreement) contract  
**So that** I can review contract terms, commercial details, legal compliance information, and contract history, and take actions such as approving, commenting, or canceling the contract

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] I can view complete MSA contract details in a structured format
- [ ] I can see Overview section with MSA ID, Effective Start, Effective End, and Status
- [ ] I can see Commercial Terms section with currency, payment terms, invoicing cycle, billing day, and tax/withholding
- [ ] I can see Legal/Compliance section with IP ownership and governing law
- [ ] I can see Contacts section with Client and LandBridge contact information
- [ ] I can see History section with contract documents and files
- [ ] I can take actions: Approve, Comment, or Cancel Contract
- [ ] Contract detail page matches the wireframe design

### Detailed Acceptance Criteria

#### 1. Page Layout (Based on Wireframe)
- [ ] **Left Sidebar**:
  - [ ] "SKILL BRIDGE" logo/title at the top of sidebar
  - [ ] Navigation menu items:
    - [ ] "Dashboard" with grid icon (multiple squares)
    - [ ] "Contact form" with envelope icon
    - [ ] "Proposal" with 'P' in a circle icon
    - [ ] "Contract" with document icon (highlighted/active state when on this page)
  - [ ] Sidebar has dark grey background
  - [ ] Sidebar is collapsible on mobile (future enhancement)

- [ ] **Top Header**:
  - [ ] Page title "Contract management" displayed on the left
  - [ ] User information displayed on the right:
    - [ ] User icon/avatar
    - [ ] User name with honorific "様" (e.g., "Yamada Taro様")
  - [ ] Header has dark grey background
  - [ ] Header is sticky/static at top
  - [ ] Language selector (JA/EN) in header

- [ ] **Main Content Area**:
  - [ ] White background for content area
  - [ ] Content is properly spaced from sidebar and header
  - [ ] Responsive layout for different screen sizes

#### 2. Breadcrumb Navigation
- [ ] **Breadcrumbs**:
  - [ ] Breadcrumb displayed at the top of main content area
  - [ ] Format: "Contract Management > Contract detail"
  - [ ] "Contract Management" is clickable and navigates to contract list page
  - [ ] "Contract detail" is current page (not clickable)
  - [ ] Breadcrumbs use appropriate styling (e.g., gray text, arrow separator)

#### 3. Overview Section
- [ ] **Section Header**:
  - [ ] Bold heading "Overview" displayed
  - [ ] Section has clear visual separation

- [ ] **MSA ID**:
  - [ ] Label: "MSA ID"
  - [ ] Value: Format "MSA-YYYY-MM-DD-NN" (e.g., "MSA-2025-07-21-11")
  - [ ] ID is displayed clearly and matches format from contract list

- [ ] **Effective Start**:
  - [ ] Label: "Effective Start"
  - [ ] Value: Date format "YYYY/MM/DD" (e.g., "2025/5/1")
  - [ ] Date is formatted consistently

- [ ] **Effective End**:
  - [ ] Label: "Effective End"
  - [ ] Value: Date format "YYYY/MM/DD" (e.g., "2027/5/31")
  - [ ] Date is formatted consistently

- [ ] **Status**:
  - [ ] Label: "Status"
  - [ ] Value: Status badge (e.g., "Under Review", "Active", "Draft", "Pending", "Completed", "Terminated")
  - [ ] Status badge has appropriate color/styling:
    - [ ] "Under Review" - blue/review styling
    - [ ] "Active" - green/active styling
    - [ ] "Draft" - gray/draft styling
    - [ ] "Pending" - yellow/pending styling
    - [ ] "Completed" - gray/completed styling
    - [ ] "Terminated" - red/terminated styling

#### 4. Commercial Terms Section
- [ ] **Section Header**:
  - [ ] Bold heading "Commercial Terms" displayed
  - [ ] Section has clear visual separation

- [ ] **Currency**:
  - [ ] Label: "Currency"
  - [ ] Value: Currency code (e.g., "JPY", "USD", "EUR")
  - [ ] Currency is displayed in uppercase

- [ ] **Payment Terms**:
  - [ ] Label: "Payment Terms"
  - [ ] Value: Payment terms description (e.g., "Net", "Net 30", "Net 60")
  - [ ] Payment terms are clearly displayed

- [ ] **Invoicing Cycle**:
  - [ ] Label: "Invoicing Cycle"
  - [ ] Value: Invoicing frequency (e.g., "Monthly", "Weekly", "Bi-weekly", "Quarterly")
  - [ ] Invoicing cycle is clearly displayed

- [ ] **Billing Day**:
  - [ ] Label: "Billing Day"
  - [ ] Value: Billing day description (e.g., "Last business day", "1st of month", "15th of month")
  - [ ] Billing day is clearly displayed

- [ ] **Tax / Withholding**:
  - [ ] Label: "Tax / Withholding"
  - [ ] Value: Percentage format (e.g., "10%", "15%", "0%")
  - [ ] Tax/withholding percentage is clearly displayed

#### 5. Legal / Compliance Section
- [ ] **Section Header**:
  - [ ] Bold heading "Legal / Compliance" displayed
  - [ ] Section has clear visual separation

- [ ] **IP Ownership**:
  - [ ] Label: "IP Ownership"
  - [ ] Value: IP ownership description (e.g., "Client", "LandBridge", "Joint", "Work for Hire")
  - [ ] IP ownership is clearly displayed

- [ ] **Governing Law**:
  - [ ] Label: "Governing Law"
  - [ ] Value: Country/jurisdiction code (e.g., "JP", "US", "SG")
  - [ ] Governing law is displayed in uppercase

#### 6. Contacts Section
- [ ] **Section Header**:
  - [ ] Bold heading "Contacts" displayed
  - [ ] Section has clear visual separation

- [ ] **Client Contact**:
  - [ ] Label: "Client"
  - [ ] Value: Client name and email (e.g., "Yamada Taro (yamada_taro@gmail.com)")
  - [ ] Client contact information is clearly displayed
  - [ ] Email is displayed in parentheses

- [ ] **LandBridge Contact**:
  - [ ] Label: "LandBridge"
  - [ ] Value: LandBridge contact name and email (e.g., "Sale 01 (mimori@landbridge.co.jp)")
  - [ ] LandBridge contact information is clearly displayed
  - [ ] Email is displayed in parentheses
  - [ ] Contact name may include role/identifier (e.g., "Sale 01", "Account Manager")

#### 7. History Section
- [ ] **Section Header**:
  - [ ] Bold heading "History" displayed
  - [ ] Section has clear visual separation
  - [ ] History icon/bullet point (square bullet "■") displayed

- [ ] **History List**:
  - [ ] History entries displayed as a list
  - [ ] Each entry has:
    - [ ] Date in format "[YYYY/MM/DD]" (e.g., "[2025/06/05]")
    - [ ] Description (e.g., "Contract Draft v1 sent by LandBridge")
    - [ ] File link if document exists (e.g., "MSA.pdf")
  - [ ] File links are clickable and displayed in blue with underline
  - [ ] Clicking file link downloads or opens the document
  - [ ] History entries are sorted by date (newest first)
  - [ ] Empty state message if no history exists

#### 8. Action Buttons
- [ ] **Button Layout**:
  - [ ] Three action buttons displayed at the bottom of the main content area
  - [ ] Buttons are rectangular with grey borders
  - [ ] Buttons are properly spaced and aligned

- [ ] **Approve Button**:
  - [ ] Button text: "Approve"
  - [ ] Button is clickable
  - [ ] Clicking "Approve" updates contract status to "Approved"
  - [ ] Confirmation dialog/modal appears before approval (optional)
  - [ ] Success message displayed after approval
  - [ ] Button is disabled or hidden for contracts already approved
  - [ ] Button is disabled or hidden for contracts in certain statuses (e.g., "Terminated", "Completed")

- [ ] **Comment Button**:
  - [ ] Button text: "Comment"
  - [ ] Button is clickable
  - [ ] Clicking "Comment" opens a comment modal/dialog
  - [ ] Comment modal allows user to enter comment text
  - [ ] Comment can be submitted and saved
  - [ ] Comment appears in History section after submission
  - [ ] Contract status may change to "Request for change" or "Under Review" after comment

- [ ] **Cancel Contract Button**:
  - [ ] Button text: "Cancel Contract"
  - [ ] Button is clickable
  - [ ] Clicking "Cancel Contract" opens a cancellation confirmation modal
  - [ ] Cancellation modal requires reason/confirmation
  - [ ] Cancellation can be confirmed or cancelled
  - [ ] Contract status changes to "Terminated" or "Cancelled" after cancellation
  - [ ] Success message displayed after cancellation
  - [ ] Button is disabled or hidden for contracts already terminated/cancelled
  - [ ] Button is disabled or hidden for contracts in certain statuses (e.g., "Completed")

#### 9. Navigation
- [ ] **Back Navigation**:
  - [ ] User can navigate back to contract list page
  - [ ] Back button or breadcrumb "Contract Management" link works correctly
  - [ ] Navigation preserves any filters or search from list page (optional)

- [ ] **Direct Navigation**:
  - [ ] User can navigate to contract detail page directly via URL
  - [ ] URL format: `/client/contracts/{contractId}` or `/client/contracts/{contractInternalId}`
  - [ ] Page loads correctly with contract ID from URL
  - [ ] Error message displayed if contract not found or user doesn't have access

#### 10. Data Loading and Error Handling
- [ ] **Loading State**:
  - [ ] Loading indicator displayed while fetching contract data
  - [ ] Skeleton/placeholder content displayed during loading
  - [ ] Loading state clears after data is loaded

- [ ] **Error Handling**:
  - [ ] Error message displayed if contract fetch fails
  - [ ] Error message displayed if contract not found
  - [ ] Error message displayed if user doesn't have access to contract
  - [ ] Error messages are user-friendly and translatable
  - [ ] Retry button available for failed requests

- [ ] **Empty States**:
  - [ ] Appropriate message displayed if contract data is incomplete
  - [ ] "-" or "N/A" displayed for missing optional fields
  - [ ] Empty history message displayed if no history exists

#### 11. Authentication & Authorization
- [ ] **Access Control**:
  - [ ] Only authenticated client users can access contract detail page
  - [ ] Users can only view their own contracts (client_id filter)
  - [ ] Unauthenticated users redirected to login
  - [ ] Users without access to contract see error message
  - [ ] Session validation on page load
  - [ ] Token validation on API calls

#### 12. Internationalization (i18n)
- [ ] **Multi-language Support**:
  - [ ] All text elements are translatable (JP/EN)
  - [ ] Page title: "Contract management" / "契約管理"
  - [ ] Section headers translated
  - [ ] Field labels translated
  - [ ] Status labels translated
  - [ ] Button labels translated
  - [ ] Error messages translated
  - [ ] Empty state messages translated
  - [ ] Date formats localized (if applicable)

## Technical Requirements

### Frontend Requirements
```typescript
// Contract Detail Page Component Structure
interface ContractDetailPageProps {
  params: {
    contractId: string; // Contract internal ID (primary key)
  };
}

interface ContractDetail {
  internalId: number; // Primary key (database ID)
  id: string; // Display ID format: MSA-YYYY-MM-DD-NN (for display only)
  
  // Overview
  contractType: 'MSA' | 'SOW';
  contractName: string;
  effectiveStart: string | null; // Format: YYYY-MM-DD
  effectiveEnd: string | null; // Format: YYYY-MM-DD
  status: 'Draft' | 'Active' | 'Pending' | 'Under Review' | 'Completed' | 'Terminated';
  
  // Commercial Terms
  currency: string | null; // e.g., "JPY", "USD"
  paymentTerms: string | null; // e.g., "Net", "Net 30"
  invoicingCycle: string | null; // e.g., "Monthly", "Weekly"
  billingDay: string | null; // e.g., "Last business day", "1st of month"
  taxWithholding: string | null; // e.g., "10%", "15%"
  
  // Legal / Compliance
  ipOwnership: string | null; // e.g., "Client", "LandBridge"
  governingLaw: string | null; // e.g., "JP", "US"
  
  // Contacts
  clientContact: {
    name: string;
    email: string;
  };
  landbridgeContact: {
    name: string;
    email: string;
  };
  
  // History
  history: ContractHistoryItem[];
  
  createdAt: string; // ISO format
  updatedAt: string; // ISO format
}

interface ContractHistoryItem {
  id: number;
  date: string; // Format: YYYY-MM-DD
  description: string;
  documentLink: string | null; // URL to document
  documentName: string | null; // File name
  createdBy: string | null; // User who created the history entry
}
```

### Backend Requirements
```java
// Contract Detail Controller
@RestController
@RequestMapping("/api/client/contracts")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ClientContractController {
    
    @GetMapping("/{contractId}")
    public ResponseEntity<ContractDetailDTO> getContractDetail(
        @PathVariable Integer contractId,
        Authentication authentication
    );
    
    @PostMapping("/{contractId}/approve")
    public ResponseEntity<?> approveContract(
        @PathVariable Integer contractId,
        Authentication authentication
    );
    
    @PostMapping("/{contractId}/comment")
    public ResponseEntity<?> addComment(
        @PathVariable Integer contractId,
        @RequestBody CommentRequest request,
        Authentication authentication
    );
    
    @PostMapping("/{contractId}/cancel")
    public ResponseEntity<?> cancelContract(
        @PathVariable Integer contractId,
        @RequestBody CancelRequest request,
        Authentication authentication
    );
}

// Contract Detail DTO
public class ContractDetailDTO {
    private Integer internalId; // Primary key (database ID)
    private String id; // Display ID format: MSA-YYYY-MM-DD-NN
    
    // Overview
    private String contractType; // "MSA" or "SOW"
    private String contractName;
    private String effectiveStart; // Format: YYYY/MM/DD
    private String effectiveEnd; // Format: YYYY/MM/DD
    private String status; // "Draft", "Active", "Pending", etc.
    
    // Commercial Terms
    private String currency; // e.g., "JPY", "USD"
    private String paymentTerms; // e.g., "Net", "Net 30"
    private String invoicingCycle; // e.g., "Monthly", "Weekly"
    private String billingDay; // e.g., "Last business day"
    private String taxWithholding; // e.g., "10%"
    
    // Legal / Compliance
    private String ipOwnership; // e.g., "Client", "LandBridge"
    private String governingLaw; // e.g., "JP", "US"
    
    // Contacts
    private ContactInfo clientContact;
    private ContactInfo landbridgeContact;
    
    // History
    private List<ContractHistoryItemDTO> history;
    
    // Getters and setters...
}

public class ContactInfo {
    private String name;
    private String email;
    // Getters and setters...
}

public class ContractHistoryItemDTO {
    private Integer id;
    private String date; // Format: YYYY/MM/DD
    private String description;
    private String documentLink; // URL to document
    private String documentName; // File name
    private String createdBy; // User who created the history entry
    // Getters and setters...
}

// Contract Detail Service
@Service
public class ContractDetailService {
    
    @Autowired
    private ContractRepository contractRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ContractHistoryRepository contractHistoryRepository;
    
    public ContractDetailDTO getContractDetail(Integer contractId, Integer clientUserId) {
        // Implementation:
        // 1. Find contract by ID and client_id (security check)
        // 2. Load client and LandBridge contact information
        // 3. Load contract history
        // 4. Generate display ID (MSA-YYYY-MM-DD-NN)
        // 5. Format dates and values
        // 6. Return DTO
    }
    
    public void approveContract(Integer contractId, Integer clientUserId) {
        // Implementation:
        // 1. Find contract by ID and client_id (security check)
        // 2. Validate contract can be approved (status check)
        // 3. Update contract status to "Approved"
        // 4. Create history entry for approval
        // 5. Save changes
    }
    
    public void addComment(Integer contractId, Integer clientUserId, String comment) {
        // Implementation:
        // 1. Find contract by ID and client_id (security check)
        // 2. Create history entry with comment
        // 3. Update contract status if needed (e.g., "Request for change")
        // 4. Save changes
    }
    
    public void cancelContract(Integer contractId, Integer clientUserId, String reason) {
        // Implementation:
        // 1. Find contract by ID and client_id (security check)
        // 2. Validate contract can be cancelled (status check)
        // 3. Update contract status to "Terminated" or "Cancelled"
        // 4. Create history entry with cancellation reason
        // 5. Save changes
    }
    
    private String generateContractId(Contract contract) {
        // Format: MSA-YYYY-MM-DD-NN or CT-YYYY-MM-DD-NN
        // Where YYYY is year, MM is month, DD is day, NN is sequence number
        String prefix = contract.getContractType() == ContractType.MSA ? "MSA" : "CT";
        LocalDate createdAt = contract.getCreatedAt().toLocalDate();
        int year = createdAt.getYear();
        int month = createdAt.getMonthValue();
        int day = createdAt.getDayOfMonth();
        // Calculate sequence number based on contract creation order
        // Implementation depends on business logic
        return String.format("%s-%d-%02d-%02d-%02d", prefix, year, month, day, sequenceNumber);
    }
    
    private String formatDate(LocalDate date) {
        if (date == null) return null;
        // Format: YYYY/MM/DD
        return String.format("%d/%d/%d", date.getYear(), date.getMonthValue(), date.getDayOfMonth());
    }
}
```

### Database Requirements
```sql
-- Contract Entity (extend existing contracts table or create MSA-specific fields)
-- Note: Current contracts table may need to be extended with additional fields
-- OR create a separate msas table as per architecture documentation

-- Option 1: Extend existing contracts table
ALTER TABLE contracts ADD COLUMN currency VARCHAR(16) NULL;
ALTER TABLE contracts ADD COLUMN payment_terms VARCHAR(128) NULL;
ALTER TABLE contracts ADD COLUMN invoicing_cycle VARCHAR(64) NULL;
ALTER TABLE contracts ADD COLUMN billing_day VARCHAR(64) NULL;
ALTER TABLE contracts ADD COLUMN tax_withholding VARCHAR(16) NULL;
ALTER TABLE contracts ADD COLUMN ip_ownership VARCHAR(128) NULL;
ALTER TABLE contracts ADD COLUMN governing_law VARCHAR(64) NULL;
ALTER TABLE contracts ADD COLUMN client_contact_name VARCHAR(255) NULL;
ALTER TABLE contracts ADD COLUMN client_contact_email VARCHAR(255) NULL;
ALTER TABLE contracts ADD COLUMN landbridge_contact_name VARCHAR(255) NULL;
ALTER TABLE contracts ADD COLUMN landbridge_contact_email VARCHAR(255) NULL;

-- Option 2: Create separate msas table (as per architecture)
CREATE TABLE IF NOT EXISTS msas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Draft',
  effective_date DATE,
  end_date DATE,
  currency VARCHAR(16),
  payment_terms VARCHAR(128),
  invoicing_cycle VARCHAR(64),
  billing_day VARCHAR(64),
  tax_withholding VARCHAR(16),
  ip_ownership VARCHAR(128),
  governing_law VARCHAR(64),
  client_contact_name VARCHAR(255),
  client_contact_email VARCHAR(255),
  landbridge_contact_name VARCHAR(255),
  landbridge_contact_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id),
  INDEX idx_customer_id (customer_id),
  INDEX idx_status (status)
);

-- Contract History Table
CREATE TABLE IF NOT EXISTS contract_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contract_id INT NOT NULL,
  entry_date DATE NOT NULL,
  description TEXT NOT NULL,
  document_link VARCHAR(500) NULL,
  document_name VARCHAR(255) NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_contract_id (contract_id),
  INDEX idx_entry_date (entry_date)
);

-- Contract Detail Query (example)
SELECT 
  c.id as internal_id,
  c.contract_type,
  c.contract_name,
  c.period_start as effective_start,
  c.period_end as effective_end,
  c.status,
  c.currency,
  c.payment_terms,
  c.invoicing_cycle,
  c.billing_day,
  c.tax_withholding,
  c.ip_ownership,
  c.governing_law,
  c.client_contact_name,
  c.client_contact_email,
  c.landbridge_contact_name,
  c.landbridge_contact_email,
  c.created_at,
  c.updated_at
FROM contracts c
WHERE c.id = :contractId
  AND c.client_id = :clientUserId;

-- Contract History Query
SELECT 
  ch.id,
  ch.entry_date,
  ch.description,
  ch.document_link,
  ch.document_name,
  u.full_name as created_by
FROM contract_history ch
LEFT JOIN users u ON ch.created_by = u.id
WHERE ch.contract_id = :contractId
ORDER BY ch.entry_date DESC, ch.created_at DESC;
```

### API Requirements

#### GET /api/client/contracts/{contractId}
**Description**: Get contract detail for the authenticated client

**Path Parameters**:
- `contractId` (required): Contract internal ID (primary key)

**Response**:
```json
{
  "internalId": 1,
  "id": "MSA-2025-07-21-11",
  "contractType": "MSA",
  "contractName": "Master Service Agreement - 2025",
  "effectiveStart": "2025/5/1",
  "effectiveEnd": "2027/5/31",
  "status": "Under Review",
  "currency": "JPY",
  "paymentTerms": "Net",
  "invoicingCycle": "Monthly",
  "billingDay": "Last business day",
  "taxWithholding": "10%",
  "ipOwnership": "Client",
  "governingLaw": "JP",
  "clientContact": {
    "name": "Yamada Taro",
    "email": "yamada_taro@gmail.com"
  },
  "landbridgeContact": {
    "name": "Sale 01",
    "email": "mimori@landbridge.co.jp"
  },
  "history": [
    {
      "id": 1,
      "date": "2025/06/05",
      "description": "Contract Draft v1 sent by LandBridge",
      "documentLink": "https://example.com/documents/MSA.pdf",
      "documentName": "MSA.pdf",
      "createdBy": "Sale 01"
    }
  ]
}
```

**Error Responses**:
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User doesn't have access to contract
- `404 Not Found`: Contract not found
- `500 Internal Server Error`: Server error

#### POST /api/client/contracts/{contractId}/approve
**Description**: Approve a contract

**Path Parameters**:
- `contractId` (required): Contract internal ID

**Response**:
```json
{
  "message": "Contract approved successfully",
  "contractId": 1,
  "status": "Approved"
}
```

**Error Responses**:
- `400 Bad Request`: Contract cannot be approved (invalid status)
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User doesn't have access to contract
- `404 Not Found`: Contract not found

#### POST /api/client/contracts/{contractId}/comment
**Description**: Add a comment to a contract

**Request Body**:
```json
{
  "comment": "Please review the payment terms section"
}
```

**Response**:
```json
{
  "message": "Comment added successfully",
  "contractId": 1,
  "historyId": 2
}
```

#### POST /api/client/contracts/{contractId}/cancel
**Description**: Cancel a contract

**Request Body**:
```json
{
  "reason": "Contract terms no longer suitable"
}
```

**Response**:
```json
{
  "message": "Contract cancelled successfully",
  "contractId": 1,
  "status": "Terminated"
}
```

## Implementation Guidelines

### Frontend Implementation

#### 1. Contract Detail Page Component
```typescript
// frontend/src/app/client/contracts/[contractId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { ClientHeader } from '@/components/design-patterns/client/ClientHeader';
import { ClientSidebar } from '@/components/design-patterns/client/ClientSidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getContractDetail, approveContract, addComment, cancelContract } from '@/services/contractService';
import { useAuth } from '@/contexts/AuthContext';

export default function ContractDetailPage() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const contractId = params.contractId as string;
  
  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContractDetail();
  }, [contractId]);

  const fetchContractDetail = async () => {
    if (!token || !contractId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await getContractDetail(token, parseInt(contractId));
      setContract(data);
    } catch (err) {
      setError(t('client.contractDetail.error.loadFailed'));
      console.error('Failed to fetch contract detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!token || !contractId) return;
    
    try {
      await approveContract(token, parseInt(contractId));
      // Refresh contract detail
      await fetchContractDetail();
      // Show success message
      alert(t('client.contractDetail.success.approved'));
    } catch (err) {
      console.error('Failed to approve contract:', err);
      alert(t('client.contractDetail.error.approveFailed'));
    }
  };

  const handleComment = async () => {
    // Open comment modal
    const comment = prompt(t('client.contractDetail.comment.enter'));
    if (!comment) return;
    
    if (!token || !contractId) return;
    
    try {
      await addComment(token, parseInt(contractId), comment);
      // Refresh contract detail
      await fetchContractDetail();
      // Show success message
      alert(t('client.contractDetail.success.commentAdded'));
    } catch (err) {
      console.error('Failed to add comment:', err);
      alert(t('client.contractDetail.error.commentFailed'));
    }
  };

  const handleCancel = async () => {
    // Open cancellation confirmation modal
    const reason = prompt(t('client.contractDetail.cancel.enterReason'));
    if (!reason) return;
    
    if (!confirm(t('client.contractDetail.cancel.confirm'))) return;
    
    if (!token || !contractId) return;
    
    try {
      await cancelContract(token, parseInt(contractId), reason);
      // Refresh contract detail
      await fetchContractDetail();
      // Show success message
      alert(t('client.contractDetail.success.cancelled'));
    } catch (err) {
      console.error('Failed to cancel contract:', err);
      alert(t('client.contractDetail.error.cancelFailed'));
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <ClientSidebar />
        <div className="flex-1 flex flex-col">
          <ClientHeader titleKey="client.header.title.contractManagement" />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="text-center py-8">{t('client.contractDetail.loading')}</div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="flex h-screen bg-gray-50">
        <ClientSidebar />
        <div className="flex-1 flex flex-col">
          <ClientHeader titleKey="client.header.title.contractManagement" />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="text-center py-8 text-red-600">{error || t('client.contractDetail.error.notFound')}</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ClientSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ClientHeader titleKey="client.header.title.contractManagement" />
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          {/* Breadcrumbs */}
          <div className="mb-6 text-sm text-gray-600">
            <span 
              className="cursor-pointer hover:text-gray-800"
              onClick={() => router.push('/client/contracts')}
            >
              {t('client.contractDetail.breadcrumb.contractManagement')}
            </span>
            <span className="mx-2"> {'>'} </span>
            <span>{t('client.contractDetail.breadcrumb.contractDetail')}</span>
          </div>

          {/* Overview Section */}
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4">{t('client.contractDetail.section.overview')}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">{t('client.contractDetail.field.msaId')}</label>
                <p className="font-medium">{contract.id}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">{t('client.contractDetail.field.effectiveStart')}</label>
                <p className="font-medium">{contract.effectiveStart || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">{t('client.contractDetail.field.effectiveEnd')}</label>
                <p className="font-medium">{contract.effectiveEnd || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">{t('client.contractDetail.field.status')}</label>
                <Badge variant={getStatusVariant(contract.status)}>
                  {t(`client.contractDetail.status.${contract.status.toLowerCase()}`)}
                </Badge>
              </div>
            </div>
          </section>

          {/* Commercial Terms Section */}
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4">{t('client.contractDetail.section.commercialTerms')}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">{t('client.contractDetail.field.currency')}</label>
                <p className="font-medium">{contract.currency || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">{t('client.contractDetail.field.paymentTerms')}</label>
                <p className="font-medium">{contract.paymentTerms || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">{t('client.contractDetail.field.invoicingCycle')}</label>
                <p className="font-medium">{contract.invoicingCycle || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">{t('client.contractDetail.field.billingDay')}</label>
                <p className="font-medium">{contract.billingDay || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">{t('client.contractDetail.field.taxWithholding')}</label>
                <p className="font-medium">{contract.taxWithholding || '-'}</p>
              </div>
            </div>
          </section>

          {/* Legal / Compliance Section */}
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4">{t('client.contractDetail.section.legalCompliance')}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">{t('client.contractDetail.field.ipOwnership')}</label>
                <p className="font-medium">{contract.ipOwnership || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">{t('client.contractDetail.field.governingLaw')}</label>
                <p className="font-medium">{contract.governingLaw || '-'}</p>
              </div>
            </div>
          </section>

          {/* Contacts Section */}
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4">{t('client.contractDetail.section.contacts')}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">{t('client.contractDetail.field.client')}</label>
                <p className="font-medium">
                  {contract.clientContact.name} ({contract.clientContact.email})
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">{t('client.contractDetail.field.landbridge')}</label>
                <p className="font-medium">
                  {contract.landbridgeContact.name} ({contract.landbridgeContact.email})
                </p>
              </div>
            </div>
          </section>

          {/* History Section */}
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4">
              <span className="mr-2">■</span>
              {t('client.contractDetail.section.history')}
            </h2>
            {contract.history.length === 0 ? (
              <p className="text-gray-500">{t('client.contractDetail.history.empty')}</p>
            ) : (
              <ul className="space-y-2">
                {contract.history.map((item) => (
                  <li key={item.id} className="text-sm">
                    <span className="text-gray-600">[{item.date}]</span>{' '}
                    {item.description}
                    {item.documentLink && (
                      <a
                        href={item.documentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline ml-2"
                      >
                        {item.documentName || 'Document'}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Action Buttons */}
          <section className="mt-8 pt-6 border-t">
            <div className="flex gap-4">
              {contract.status !== 'Approved' && contract.status !== 'Terminated' && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleApprove}
                    disabled={contract.status === 'Completed'}
                  >
                    {t('client.contractDetail.action.approve')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleComment}
                  >
                    {t('client.contractDetail.action.comment')}
                  </Button>
                </>
              )}
              {contract.status !== 'Terminated' && contract.status !== 'Completed' && (
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="text-red-600 border-red-600"
                >
                  {t('client.contractDetail.action.cancelContract')}
                </Button>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function getStatusVariant(status: string): string {
  switch (status) {
    case 'Active':
      return 'success';
    case 'Under Review':
      return 'default';
    case 'Draft':
      return 'secondary';
    case 'Pending':
      return 'warning';
    default:
      return 'default';
  }
}
```

#### 2. Contract Service
```typescript
// frontend/src/services/contractService.ts
export interface ContractDetail {
  internalId: number;
  id: string;
  contractType: 'MSA' | 'SOW';
  contractName: string;
  effectiveStart: string | null;
  effectiveEnd: string | null;
  status: string;
  currency: string | null;
  paymentTerms: string | null;
  invoicingCycle: string | null;
  billingDay: string | null;
  taxWithholding: string | null;
  ipOwnership: string | null;
  governingLaw: string | null;
  clientContact: {
    name: string;
    email: string;
  };
  landbridgeContact: {
    name: string;
    email: string;
  };
  history: ContractHistoryItem[];
}

export interface ContractHistoryItem {
  id: number;
  date: string;
  description: string;
  documentLink: string | null;
  documentName: string | null;
  createdBy: string | null;
}

export async function getContractDetail(
  token: string,
  contractId: number
): Promise<ContractDetail> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/client/contracts/${contractId}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch contract detail');
  }

  return response.json();
}

export async function approveContract(
  token: string,
  contractId: number
): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/client/contracts/${contractId}/approve`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to approve contract');
  }
}

export async function addComment(
  token: string,
  contractId: number,
  comment: string
): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/client/contracts/${contractId}/comment`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to add comment');
  }
}

export async function cancelContract(
  token: string,
  contractId: number,
  reason: string
): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/client/contracts/${contractId}/cancel`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to cancel contract');
  }
}
```

### Backend Implementation

#### 1. Contract Detail Service
```java
// backend/src/main/java/com/skillbridge/service/ContractDetailService.java
@Service
public class ContractDetailService {
    
    @Autowired
    private ContractRepository contractRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ContractHistoryRepository contractHistoryRepository;
    
    public ContractDetailDTO getContractDetail(Integer contractId, Integer clientUserId) {
        // Find contract by ID and client_id (security check)
        Contract contract = contractRepository.findByIdAndClientId(contractId, clientUserId)
            .orElseThrow(() -> new EntityNotFoundException("Contract not found"));
        
        // Load client and LandBridge contact information
        User client = userRepository.findById(contract.getClientId())
            .orElseThrow(() -> new EntityNotFoundException("Client not found"));
        
        // Get LandBridge contact (assignee or default)
        String landbridgeContactName = contract.getAssigneeId() != null 
            ? contract.getAssigneeId() 
            : "LandBridge Support";
        String landbridgeContactEmail = "support@landbridge.co.jp"; // Default or from assignee
        
        // Load contract history
        List<ContractHistory> history = contractHistoryRepository.findByContractIdOrderByEntryDateDesc(contractId);
        
        // Convert to DTO
        ContractDetailDTO dto = new ContractDetailDTO();
        dto.setInternalId(contract.getId());
        dto.setId(generateContractId(contract));
        dto.setContractType(contract.getContractType().name());
        dto.setContractName(contract.getContractName());
        dto.setEffectiveStart(formatDate(contract.getPeriodStart()));
        dto.setEffectiveEnd(formatDate(contract.getPeriodEnd()));
        dto.setStatus(contract.getStatus().name().replace("_", " "));
        
        // Commercial Terms (if stored in contract entity)
        // Note: These fields may need to be added to Contract entity
        dto.setCurrency("JPY"); // Default or from contract
        dto.setPaymentTerms("Net"); // Default or from contract
        dto.setInvoicingCycle("Monthly"); // Default or from contract
        dto.setBillingDay("Last business day"); // Default or from contract
        dto.setTaxWithholding("10%"); // Default or from contract
        
        // Legal / Compliance (if stored in contract entity)
        dto.setIpOwnership("Client"); // Default or from contract
        dto.setGoverningLaw("JP"); // Default or from contract
        
        // Contacts
        ContactInfo clientContact = new ContactInfo();
        clientContact.setName(client.getFullName());
        clientContact.setEmail(client.getEmail());
        dto.setClientContact(clientContact);
        
        ContactInfo landbridgeContact = new ContactInfo();
        landbridgeContact.setName(landbridgeContactName);
        landbridgeContact.setEmail(landbridgeContactEmail);
        dto.setLandbridgeContact(landbridgeContact);
        
        // History
        List<ContractHistoryItemDTO> historyDTOs = history.stream()
            .map(this::convertToHistoryDTO)
            .collect(Collectors.toList());
        dto.setHistory(historyDTOs);
        
        return dto;
    }
    
    public void approveContract(Integer contractId, Integer clientUserId) {
        Contract contract = contractRepository.findByIdAndClientId(contractId, clientUserId)
            .orElseThrow(() -> new EntityNotFoundException("Contract not found"));
        
        // Validate contract can be approved
        if (contract.getStatus() == ContractStatus.Approved) {
            throw new IllegalStateException("Contract is already approved");
        }
        if (contract.getStatus() == ContractStatus.Terminated || 
            contract.getStatus() == ContractStatus.Completed) {
            throw new IllegalStateException("Contract cannot be approved in current status");
        }
        
        // Update contract status
        contract.setStatus(ContractStatus.Approved);
        contractRepository.save(contract);
        
        // Create history entry
        ContractHistory history = new ContractHistory();
        history.setContractId(contractId);
        history.setEntryDate(LocalDate.now());
        history.setDescription("Contract approved by client");
        history.setCreatedBy(clientUserId);
        contractHistoryRepository.save(history);
    }
    
    public void addComment(Integer contractId, Integer clientUserId, String comment) {
        Contract contract = contractRepository.findByIdAndClientId(contractId, clientUserId)
            .orElseThrow(() -> new EntityNotFoundException("Contract not found"));
        
        // Create history entry with comment
        ContractHistory history = new ContractHistory();
        history.setContractId(contractId);
        history.setEntryDate(LocalDate.now());
        history.setDescription("Comment: " + comment);
        history.setCreatedBy(clientUserId);
        contractHistoryRepository.save(history);
        
        // Update contract status if needed
        if (contract.getStatus() != ContractStatus.Under_Review) {
            contract.setStatus(ContractStatus.Under_Review);
            contractRepository.save(contract);
        }
    }
    
    public void cancelContract(Integer contractId, Integer clientUserId, String reason) {
        Contract contract = contractRepository.findByIdAndClientId(contractId, clientUserId)
            .orElseThrow(() -> new EntityNotFoundException("Contract not found"));
        
        // Validate contract can be cancelled
        if (contract.getStatus() == ContractStatus.Terminated) {
            throw new IllegalStateException("Contract is already terminated");
        }
        if (contract.getStatus() == ContractStatus.Completed) {
            throw new IllegalStateException("Completed contract cannot be cancelled");
        }
        
        // Update contract status
        contract.setStatus(ContractStatus.Terminated);
        contractRepository.save(contract);
        
        // Create history entry with cancellation reason
        ContractHistory history = new ContractHistory();
        history.setContractId(contractId);
        history.setEntryDate(LocalDate.now());
        history.setDescription("Contract cancelled. Reason: " + reason);
        history.setCreatedBy(clientUserId);
        contractHistoryRepository.save(history);
    }
    
    private String generateContractId(Contract contract) {
        String prefix = contract.getContractType() == ContractType.MSA ? "MSA" : "CT";
        LocalDate createdAt = contract.getCreatedAt().toLocalDate();
        int year = createdAt.getYear();
        int month = createdAt.getMonthValue();
        int day = createdAt.getDayOfMonth();
        // Calculate sequence number based on contract creation order
        // This is a simplified version - in production, use actual sequence logic
        int sequence = contract.getId() % 100;
        return String.format("%s-%d-%02d-%02d-%02d", prefix, year, month, day, sequence);
    }
    
    private String formatDate(LocalDate date) {
        if (date == null) return null;
        return String.format("%d/%d/%d", date.getYear(), date.getMonthValue(), date.getDayOfMonth());
    }
    
    private ContractHistoryItemDTO convertToHistoryDTO(ContractHistory history) {
        ContractHistoryItemDTO dto = new ContractHistoryItemDTO();
        dto.setId(history.getId());
        dto.setDate(formatDate(history.getEntryDate()));
        dto.setDescription(history.getDescription());
        dto.setDocumentLink(history.getDocumentLink());
        dto.setDocumentName(history.getDocumentName());
        if (history.getCreatedBy() != null) {
            User user = userRepository.findById(history.getCreatedBy()).orElse(null);
            dto.setCreatedBy(user != null ? user.getFullName() : null);
        }
        return dto;
    }
}
```

## Testing Requirements

### Unit Tests
- [ ] ContractDetailService: Test contract detail retrieval
- [ ] ContractDetailService: Test contract approval
- [ ] ContractDetailService: Test comment addition
- [ ] ContractDetailService: Test contract cancellation
- [ ] ContractDetailService: Test contract ID generation
- [ ] ContractDetailService: Test date formatting
- [ ] ContractDetailService: Test history conversion

### Integration Tests
- [ ] GET /api/client/contracts/{contractId}: Test successful retrieval
- [ ] GET /api/client/contracts/{contractId}: Test authentication
- [ ] GET /api/client/contracts/{contractId}: Test authorization (only own contracts)
- [ ] GET /api/client/contracts/{contractId}: Test contract not found
- [ ] POST /api/client/contracts/{contractId}/approve: Test successful approval
- [ ] POST /api/client/contracts/{contractId}/approve: Test invalid status
- [ ] POST /api/client/contracts/{contractId}/comment: Test successful comment
- [ ] POST /api/client/contracts/{contractId}/cancel: Test successful cancellation

### End-to-End Tests
- [ ] User can view contract detail page
- [ ] User can see all contract sections
- [ ] User can approve contract
- [ ] User can add comment to contract
- [ ] User can cancel contract
- [ ] User can navigate back to contract list
- [ ] User can download/view contract documents from history
- [ ] Error handling works correctly
- [ ] Loading states display correctly

## Performance Requirements
- [ ] Contract detail page loads within 2 seconds
- [ ] Action buttons respond within 1 second
- [ ] History section loads within 1 second
- [ ] Document downloads start within 2 seconds

## Security Considerations
- [ ] Only authenticated users can access contract detail page
- [ ] Users can only view their own contracts (client_id filter)
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (sanitize user input)
- [ ] CSRF protection (if applicable)
- [ ] API rate limiting (if applicable)

## Deployment Requirements
- [ ] Database migration for contract fields (if extending contracts table)
- [ ] Database migration for contract_history table
- [ ] Environment variables configured
- [ ] API endpoints documented
- [ ] Frontend routes configured
- [ ] Error logging configured
- [ ] Monitoring configured

## Definition of Done
- [ ] All acceptance criteria met
- [ ] Code reviewed and approved
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] E2E tests written and passing
- [ ] Documentation updated
- [ ] Internationalization (i18n) implemented
- [ ] Responsive design verified
- [ ] Performance requirements met
- [ ] Security requirements met
- [ ] Deployed to staging environment
- [ ] User acceptance testing completed

## Dependencies
- **Internal Dependencies**:
  - Story-12: Client Contract List Management (required for navigation)
  - Story-06: Client Login Authentication (required for access)
  - Client Header and Sidebar components (shared components)
  - Language Context (for i18n)
  - Auth Context (for authentication)

- **External Dependencies**:
  - Contracts table in database (may need migration for additional fields)
  - Contract History table in database
  - Contract entities and repositories
  - Authentication/Authorization system

## Risks and Mitigation
- **Risk**: Contract entity may not have all required fields (currency, payment terms, etc.)
  - **Mitigation**: Create database migration to add missing fields or use separate MSA table

- **Risk**: Contract history table may not exist
  - **Mitigation**: Create database migration for contract_history table

- **Risk**: Contract ID generation logic may conflict with existing IDs
  - **Mitigation**: Ensure ID generation is consistent and unique

- **Risk**: Action buttons may not work correctly for all contract statuses
  - **Mitigation**: Implement proper status validation and business logic

## Success Metrics
- [ ] Contract detail page loads successfully for all authenticated clients
- [ ] All contract sections display correctly
- [ ] Action buttons work correctly
- [ ] History section displays correctly
- [ ] All text elements are properly translated (JP/EN)
- [ ] Page matches wireframe design
- [ ] Performance requirements met
- [ ] Zero security vulnerabilities

## Future Enhancements
- [ ] Contract document upload/download functionality
- [ ] Contract version history and comparison
- [ ] Contract amendment workflow
- [ ] Contract notification and reminders
- [ ] Contract analytics and reporting
- [ ] Contract template management
- [ ] Contract approval workflow with multiple approvers
- [ ] Contract export functionality (PDF, DOCX)

---

**Document Control**
- **Version**: 1.0
- **Created**: January 2025
- **Last Updated**: January 2025
- **Next Review**: March 2025
- **Approved By**: System Management Team
- **Distribution**: Development Team, Product Team, Management

