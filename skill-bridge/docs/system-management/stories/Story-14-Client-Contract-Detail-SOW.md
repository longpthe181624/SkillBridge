# User Story: Client Contract Detail SOW View

## Story Information
- **Story ID**: Story-14
- **Title**: Client Contract Detail SOW View (Fixed Price & Retainer)
- **Epic**: Client Portal - Contract Management
- **Priority**: High
- **Story Points**: 21
- **Sprint**: Sprint 4
- **Status**: Ready for Development

## User Story
**As a** Client  
**I want to** view detailed information about my SOW (Statement of Work) contracts, both Fixed Price and Retainer types  
**So that** I can review contract details, scope, deliverables, billing information, change requests, and contract history, and take actions such as approving, commenting, or canceling the contract

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] I can view complete SOW contract details in a structured format
- [ ] I can view Fixed Price SOW details with milestone deliverables and billing schedule
- [ ] I can view Retainer SOW details with delivery items and monthly billing
- [ ] I can see Overview section with SOW ID, Parent MSA, Project Name, Value, Period, and Engagement type
- [ ] I can see Scope Summary section
- [ ] I can see delivery/milestone information based on SOW type
- [ ] I can see Billing details section
- [ ] I can see Change Request section with history
- [ ] I can see History section with contract documents
- [ ] I can switch between "Contract Info" and "Change Requests" tabs
- [ ] I can take actions: Approve, Comment, or Cancel Contract
- [ ] SOW detail page matches the wireframe design

---

## Part 1: Fixed Price SOW Detail

### Fixed Price SOW Overview

#### 1. Page Layout (Based on Wireframe)
- [ ] **Left Sidebar**:
  - [ ] "SKILL BRIDGE" logo/title at the top of sidebar
  - [ ] Navigation menu items:
    - [ ] "Dashboard" with grid icon
    - [ ] "Contact form" with envelope icon
    - [ ] "Proposal" with 'P' in a circle icon
    - [ ] "Contract" with document icon (highlighted/active state when on this page)
  - [ ] Sidebar has dark grey background

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
  - [ ] Breadcrumbs use appropriate styling

#### 3. Tab Navigation
- [ ] **Tabs**:
  - [ ] Two tabs displayed: "Contract Info" and "Change Requests"
  - [ ] "Contract Info" tab is selected by default
  - [ ] "Contract Info" tab shows contract detail information
  - [ ] "Change Requests" tab shows change request list and details
  - [ ] Active tab is highlighted
  - [ ] Tabs are clickable and switch content accordingly

#### 4. Fixed Price SOW - Overview Section
- [ ] **Section Header**:
  - [ ] Bold heading "Overview" displayed
  - [ ] Section has clear visual separation

- [ ] **SOW ID**:
  - [ ] Label: "SOW ID"
  - [ ] Value: Format "SOW-YYYY-MM-DD-NN" (e.g., "SOW-2025-07-02")
  - [ ] ID is displayed clearly and matches format from contract list

- [ ] **Parent MSA**:
  - [ ] Label: "Parent MSA"
  - [ ] Value: MSA ID format (e.g., "MSA-2025-07") with status badge (e.g., "Active")
  - [ ] MSA ID is clickable and navigates to MSA detail page (optional)
  - [ ] Status badge is displayed next to MSA ID

- [ ] **Project Name**:
  - [ ] Label: "Project Name"
  - [ ] Value: Project name string (e.g., "QA Augmentation")
  - [ ] Project name is clearly displayed

- [ ] **Value**:
  - [ ] Label: "Value"
  - [ ] Value: Currency format (e.g., "¥1,800,000")
  - [ ] Currency symbol (¥) displayed
  - [ ] Numbers formatted with comma separators

- [ ] **Invoicing Cycle**:
  - [ ] Label: "Invoicing Cycle"
  - [ ] Value: Invoicing frequency (e.g., "Monthly", "Weekly", "Bi-weekly", "Quarterly")
  - [ ] Invoicing cycle is clearly displayed

- [ ] **Period**:
  - [ ] Label: "Period"
  - [ ] Value: Date range format "YYYY/MM/DD - YYYY/MM/DD" (e.g., "2025/11/01 - 2026/6/30")
  - [ ] Period clearly indicates start and end dates

- [ ] **Engagement type**:
  - [ ] Label: "Engagement type"
  - [ ] Value: "Fixed Price" badge
  - [ ] Badge has distinct styling for Fixed Price type

- [ ] **Billing Day**:
  - [ ] Label: "Billing Day"
  - [ ] Value: Billing day description (e.g., "Last business day", "1st of month", "15th of month")
  - [ ] Billing day is clearly displayed

#### 5. Fixed Price SOW - Scope Summary Section
- [ ] **Section Header**:
  - [ ] Bold heading "Scope Summary" displayed
  - [ ] Section has clear visual separation

- [ ] **Scope Summary Content**:
  - [ ] Text field displaying scope description
  - [ ] Example: "Create EC site with core functions base on requirement v1"
  - [ ] Text is readable and properly formatted
  - [ ] Multi-line text is supported
  - [ ] Empty state message if no scope summary exists

#### 6. Fixed Price SOW - Milestone Deliverables Section
- [ ] **Section Header**:
  - [ ] Bold heading "Milestone Deliverables" displayed
  - [ ] Section has clear visual separation

- [ ] **Table Structure**:
  - [ ] Table displayed with columns: "Milestone", "Delivery note", "Acceptance Criteria", "Planned End", "Payment (%)"
  - [ ] Table has clear borders and spacing
  - [ ] Table headers are properly aligned
  - [ ] Table is scrollable if content exceeds viewport width

- [ ] **Table Columns**:
  - [ ] **Milestone**: Milestone name (e.g., "Kickoff", "Design Phase", "Development", "UAT", "Go-Live")
    - [ ] Milestone names are clearly displayed
  - [ ] **Delivery note**: Description of deliverables (e.g., "Setup environment, project plan", "UI/UX Figma + Spec")
    - [ ] Delivery notes are clearly displayed
    - [ ] Full text displayed (may be truncated with ellipsis if too long)
  - [ ] **Acceptance Criteria**: Criteria for milestone acceptance (e.g., "Client sign-off on plan", "Client approves design")
    - [ ] Acceptance criteria are clearly displayed
  - [ ] **Planned End**: Date format "YYYY/MM/DD" (e.g., "2025/11/01", "2025/11/30")
    - [ ] Dates are formatted consistently
  - [ ] **Payment (%)**: Percentage format (e.g., "20%", "30%", "10%")
    - [ ] Percentages are clearly displayed
    - [ ] Percentages sum to 100% (validation)

- [ ] **Table Data**:
  - [ ] Table displays all milestones for the SOW
  - [ ] Milestones are sorted by Planned End date (ascending)
  - [ ] Empty state message if no milestones exist
  - [ ] Loading state while fetching milestone data

#### 7. Fixed Price SOW - Billing Details Section
- [ ] **Section Header**:
  - [ ] Bold heading "Billing details" displayed
  - [ ] Section has clear visual separation

- [ ] **Table Structure**:
  - [ ] Table displayed with columns: "Billing name", "Milestone", "Amount", "%", "Invoice Date"
  - [ ] Table has clear borders and spacing
  - [ ] Table headers are properly aligned
  - [ ] Table is scrollable if content exceeds viewport width

- [ ] **Table Columns**:
  - [ ] **Billing name**: Billing item name (e.g., "Kickoff Payment", "Design Payment", "Dev Payment", "UAT Payment", "Final Payment")
    - [ ] Billing names are clearly displayed
  - [ ] **Milestone**: Associated milestone name (e.g., "Kickoff", "Design Complete", "Development Complete")
    - [ ] Milestone names link to milestone deliverables
  - [ ] **Amount**: Currency format (e.g., "¥360,000", "¥480,000", "¥180,000")
    - [ ] Currency symbol (¥) displayed
    - [ ] Numbers formatted with comma separators
  - [ ] **%**: Percentage format (e.g., "20%", "30%", "10%")
    - [ ] Percentages are clearly displayed
    - [ ] May be empty for change request items (e.g., "CR-2026-01")
  - [ ] **Invoice Date**: Date format "YYYY/MM/DD" (e.g., "2025/11/01", "2025/11/30")
    - [ ] Dates are formatted consistently

- [ ] **Table Data**:
  - [ ] Table displays all billing items for the SOW
  - [ ] Billing items include milestone payments and change request payments
  - [ ] Billing items are sorted by Invoice Date (ascending)
  - [ ] Empty state message if no billing details exist
  - [ ] Loading state while fetching billing data

#### 8. Fixed Price SOW - Change Request Section
- [ ] **Section Header**:
  - [ ] Bold heading "Change Request" displayed
  - [ ] Section has clear visual separation

- [ ] **Table Structure**:
  - [ ] Table displayed with columns: "ID", "Type", "Summary", "Planned End", "Amount", "Status"
  - [ ] Table has clear borders and spacing
  - [ ] Table headers are properly aligned
  - [ ] Table is scrollable if content exceeds viewport width

- [ ] **Table Columns**:
  - [ ] **ID**: Change request ID format (e.g., "CR-2026-01")
    - [ ] ID is unique for each change request
    - [ ] ID format: CR-YYYY-NN (where YYYY is year, NN is sequence)
  - [ ] **Type**: Change request type (e.g., "Add Scope", "Extend", "Reduce")
    - [ ] Type is displayed as badge or text
    - [ ] Each type has distinct styling
  - [ ] **Summary**: Change request summary description (e.g., "Add new function X")
    - [ ] Summary is clearly displayed
    - [ ] Full text displayed (may be truncated with ellipsis if too long)
  - [ ] **Planned End**: Date format "YYYY/MM/DD" (e.g., "2026/6/30")
    - [ ] Dates are formatted consistently
  - [ ] **Amount**: Currency format (e.g., "¥200,000")
    - [ ] Currency symbol (¥) displayed
    - [ ] Numbers formatted with comma separators
  - [ ] **Status**: Status badge (e.g., "Approved", "Pending", "Rejected")
    - [ ] Status badge has appropriate color/styling:
      - [ ] "Approved" - green/active styling
      - [ ] "Pending" - yellow/pending styling
      - [ ] "Rejected" - red/rejected styling

- [ ] **Table Data**:
  - [ ] Table displays all change requests for the SOW
  - [ ] Change requests are sorted by ID or date (newest first)
  - [ ] Empty state message if no change requests exist
  - [ ] Loading state while fetching change request data

#### 9. Fixed Price SOW - History Section
- [ ] **Section Header**:
  - [ ] Bold heading "History" displayed
  - [ ] Section has clear visual separation
  - [ ] History icon/bullet point (square bullet "■") displayed

- [ ] **History List**:
  - [ ] History entries displayed as a list
  - [ ] Each entry has:
    - [ ] Date in format "[YYYY/MM/DD]" (e.g., "[2025/06/10]")
    - [ ] Description (e.g., "Contract Draft v2 uploaded by LandBridge")
    - [ ] File link if document exists (e.g., "SOW_v2.pdf")
    - [ ] Status indicator if applicable (e.g., "(Current Draft)")
  - [ ] File links are clickable and displayed in blue with underline
  - [ ] Clicking file link downloads or opens the document
  - [ ] History entries are sorted by date (newest first)
  - [ ] Empty state message if no history exists

#### 10. Fixed Price SOW - Action Buttons
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

---

## Part 2: Retainer SOW Detail

### Retainer SOW Overview

#### 1. Page Layout (Based on Wireframe)
- [ ] **Layout Requirements**:
  - [ ] Same layout structure as Fixed Price SOW
  - [ ] Left sidebar, top header, main content area
  - [ ] Breadcrumb navigation
  - [ ] Tab navigation (Contract Info, Change Requests)

#### 2. Retainer SOW - Overview Section
- [ ] **Section Header**:
  - [ ] Bold heading "Overview" displayed
  - [ ] Section has clear visual separation

- [ ] **SOW ID**:
  - [ ] Label: "SOW ID"
  - [ ] Value: Format "SOW-YYYY-MM-DD-NN" (e.g., "SOW-2025-07-02")
  - [ ] ID is displayed clearly and matches format from contract list

- [ ] **Parent MSA**:
  - [ ] Label: "Parent MSA"
  - [ ] Value: MSA ID format (e.g., "MSA-2025-07") with status badge (e.g., "Active")
  - [ ] MSA ID is clickable and navigates to MSA detail page (optional)
  - [ ] Status badge is displayed next to MSA ID

- [ ] **Project Name**:
  - [ ] Label: "Project Name"
  - [ ] Value: Project name string (e.g., "QA Augmentation")
  - [ ] Project name is clearly displayed

- [ ] **Value**:
  - [ ] Label: "Value"
  - [ ] Value: Currency format (e.g., "¥2,000,000")
  - [ ] Currency symbol (¥) displayed
  - [ ] Numbers formatted with comma separators

- [ ] **Period**:
  - [ ] Label: "Period"
  - [ ] Value: Date range format "YYYY/MM/DD - YYYY/MM/DD" (e.g., "2025/11/01 - 2025/12/31")
  - [ ] Period clearly indicates start and end dates

- [ ] **Engagement type**:
  - [ ] Label: "Engagement type"
  - [ ] Value: "Retainer" badge
  - [ ] Badge has distinct styling for Retainer type

- [ ] **Invoicing Cycle**:
  - [ ] Label: "Invoicing Cycle"
  - [ ] Value: Invoicing frequency (e.g., "Monthly", "Weekly", "Bi-weekly", "Quarterly")
  - [ ] Invoicing cycle is clearly displayed

- [ ] **Billing Day**:
  - [ ] Label: "Billing Day"
  - [ ] Value: Billing day description (e.g., "Last business day", "1st of month", "15th of month")
  - [ ] Billing day is clearly displayed

#### 3. Retainer SOW - Scope Summary Section
- [ ] **Section Header**:
  - [ ] Bold heading "Scope Summary" displayed
  - [ ] Section has clear visual separation

- [ ] **Scope Summary Content**:
  - [ ] Text field displaying scope description
  - [ ] Example: "2 Middle Backend on November 2025" or multi-line description
  - [ ] Text is readable and properly formatted
  - [ ] Multi-line text is supported
  - [ ] Empty state message if no scope summary exists

#### 4. Retainer SOW - Delivery Items Section
- [ ] **Section Header**:
  - [ ] Bold heading "Delivery Items" displayed
  - [ ] Section has clear visual separation

- [ ] **Table Structure**:
  - [ ] Table displayed with columns: "Milestone", "Delivery note", "Amount", "Payment Date"
  - [ ] Table has clear borders and spacing
  - [ ] Table headers are properly aligned
  - [ ] Table is scrollable if content exceeds viewport width

- [ ] **Table Columns**:
  - [ ] **Milestone**: Milestone/period name (e.g., "November 2025", "December 2025")
    - [ ] Milestone names are clearly displayed
    - [ ] Typically represents monthly or period-based milestones
  - [ ] **Delivery note**: Description of deliverables (e.g., "2 Middle Backend(100%)", "2 Middle Backend, 1 Middle Frontend")
    - [ ] Delivery notes are clearly displayed
    - [ ] Full text displayed (may be truncated with ellipsis if too long)
    - [ ] May include resource allocation percentages
  - [ ] **Amount**: Currency format (e.g., "¥800,000", "¥1,200,000")
    - [ ] Currency symbol (¥) displayed
    - [ ] Numbers formatted with comma separators
  - [ ] **Payment Date**: Date format "YYYY/MM/DD" (e.g., "2025/11/30", "2025/12/31")
    - [ ] Dates are formatted consistently
    - [ ] Payment dates correspond to milestone periods

- [ ] **Table Data**:
  - [ ] Table displays all delivery items for the SOW
  - [ ] Delivery items are sorted by Payment Date (ascending)
  - [ ] Empty state message if no delivery items exist
  - [ ] Loading state while fetching delivery item data

#### 5. Retainer SOW - Billing Details Section
- [ ] **Section Header**:
  - [ ] Bold heading "Billing details" displayed
  - [ ] Section has clear visual separation

- [ ] **Table Structure**:
  - [ ] Table displayed with columns: "Payment Date", "Delivery note", "Amount"
  - [ ] Table has clear borders and spacing
  - [ ] Table headers are properly aligned
  - [ ] Table is scrollable if content exceeds viewport width

- [ ] **Table Columns**:
  - [ ] **Payment Date**: Date format "YYYY/MM/DD" (e.g., "2025/11/30", "2026/1/31", "2026/2/28")
    - [ ] Dates are formatted consistently
    - [ ] Payment dates may include extended periods from change requests
  - [ ] **Delivery note**: Description of deliverables (e.g., "2 Middle Backend(100%)", "1 Middle Backend (100%), 1 Middle Front end(100%)")
    - [ ] Delivery notes are clearly displayed
    - [ ] Full text displayed (may be truncated with ellipsis if too long)
    - [ ] May reflect changes from change requests
  - [ ] **Amount**: Currency format (e.g., "¥800,000", "¥1,200,000")
    - [ ] Currency symbol (¥) displayed
    - [ ] Numbers formatted with comma separators
    - [ ] Amounts may vary based on change requests

- [ ] **Table Data**:
  - [ ] Table displays all billing items for the SOW
  - [ ] Billing items include original delivery items and extended periods from change requests
  - [ ] Billing items are sorted by Payment Date (ascending)
  - [ ] Empty state message if no billing details exist
  - [ ] Loading state while fetching billing data

#### 6. Retainer SOW - Change Request Section
- [ ] **Section Header**:
  - [ ] Bold heading "Change Request" displayed
  - [ ] Section has clear visual separation

- [ ] **Table Structure**:
  - [ ] Table displayed with columns: "ID", "Type", "Summary", "Effective from", "Effective until", "Amount", "Status"
  - [ ] Table has clear borders and spacing
  - [ ] Table headers are properly aligned
  - [ ] Table is scrollable if content exceeds viewport width

- [ ] **Table Columns**:
  - [ ] **ID**: Change request ID format (e.g., "CR-2026-01")
    - [ ] ID is unique for each change request
    - [ ] ID format: CR-YYYY-NN (where YYYY is year, NN is sequence)
  - [ ] **Type**: Change request type (e.g., "Extend", "Add Scope", "Reduce")
    - [ ] Type is displayed as badge or text
    - [ ] Each type has distinct styling
  - [ ] **Summary**: Change request summary description (e.g., "Extend to 2026/02/28. 1 Middle Backend (100%), 1 Middle Front end(100%)")
    - [ ] Summary is clearly displayed
    - [ ] Full text displayed (may be truncated with ellipsis if too long)
    - [ ] Summary may include resource allocation details
  - [ ] **Effective from**: Date format "YYYY/MM/DD" (e.g., "2026/2/1")
    - [ ] Dates are formatted consistently
    - [ ] Indicates when the change request becomes effective
  - [ ] **Effective until**: Date format "YYYY/MM/DD" (e.g., "2026/2/28")
    - [ ] Dates are formatted consistently
    - [ ] Indicates when the change request period ends
  - [ ] **Amount**: Currency format (e.g., "¥1,200,000")
    - [ ] Currency symbol (¥) displayed
    - [ ] Numbers formatted with comma separators
  - [ ] **Status**: Status badge (e.g., "Approved", "Pending", "Rejected")
    - [ ] Status badge has appropriate color/styling:
      - [ ] "Approved" - green/active styling
      - [ ] "Pending" - yellow/pending styling
      - [ ] "Rejected" - red/rejected styling

- [ ] **Table Data**:
  - [ ] Table displays all change requests for the SOW
  - [ ] Change requests are sorted by ID or date (newest first)
  - [ ] Empty state message if no change requests exist
  - [ ] Loading state while fetching change request data

#### 7. Retainer SOW - History Section
- [ ] **Section Header**:
  - [ ] Bold heading "History" displayed
  - [ ] Section has clear visual separation
  - [ ] History icon/bullet point (square bullet "■") displayed

- [ ] **History List**:
  - [ ] History entries displayed as a list
  - [ ] Each entry has:
    - [ ] Date in format "[YYYY/MM/DD]" (e.g., "[2025/06/10]")
    - [ ] Description (e.g., "Contract Draft v2 sent by LandBridge")
    - [ ] File link if document exists (e.g., "MSA.pdf")
  - [ ] File links are clickable and displayed in blue with underline
  - [ ] Clicking file link downloads or opens the document
  - [ ] History entries are sorted by date (newest first)
  - [ ] Empty state message if no history exists

#### 8. Retainer SOW - Action Buttons
- [ ] **Button Layout**:
  - [ ] Same button layout as Fixed Price SOW
  - [ ] Three action buttons: Approve, Comment, Cancel Contract
  - [ ] Buttons are rectangular with grey borders
  - [ ] Buttons are properly spaced and aligned

- [ ] **Approve Button**:
  - [ ] Same functionality as Fixed Price SOW
  - [ ] Button text: "Approve"
  - [ ] Button is clickable
  - [ ] Clicking "Approve" updates contract status to "Approved"
  - [ ] Confirmation dialog/modal appears before approval (optional)
  - [ ] Success message displayed after approval

- [ ] **Comment Button**:
  - [ ] Same functionality as Fixed Price SOW
  - [ ] Button text: "Comment"
  - [ ] Button is clickable
  - [ ] Clicking "Comment" opens a comment modal/dialog
  - [ ] Comment modal allows user to enter comment text
  - [ ] Comment can be submitted and saved

- [ ] **Cancel Contract Button**:
  - [ ] Same functionality as Fixed Price SOW
  - [ ] Button text: "Cancel Contract"
  - [ ] Button is clickable
  - [ ] Clicking "Cancel Contract" opens a cancellation confirmation modal
  - [ ] Cancellation modal requires reason/confirmation

#### 9. Common Features for Both SOW Types

##### Navigation
- [ ] **Back Navigation**:
  - [ ] User can navigate back to contract list page
  - [ ] Back button or breadcrumb "Contract Management" link works correctly
  - [ ] Navigation preserves any filters or search from list page (optional)

- [ ] **Direct Navigation**:
  - [ ] User can navigate to SOW detail page directly via URL
  - [ ] URL format: `/client/contracts/{contractId}` or `/client/contracts/{sowId}`
  - [ ] Page loads correctly with contract ID from URL
  - [ ] Page detects SOW type (Fixed Price or Retainer) and displays appropriate sections
  - [ ] Error message displayed if contract not found or user doesn't have access

##### Data Loading and Error Handling
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
  - [ ] Empty milestone/delivery items message displayed if no items exist

##### Authentication & Authorization
- [ ] **Access Control**:
  - [ ] Only authenticated client users can access SOW detail page
  - [ ] Users can only view their own contracts (client_id filter)
  - [ ] Unauthenticated users redirected to login
  - [ ] Users without access to contract see error message
  - [ ] Session validation on page load
  - [ ] Token validation on API calls

##### Internationalization (i18n)
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

##### Tab Functionality
- [ ] **Contract Info Tab**:
  - [ ] Displays Overview, Scope Summary, Deliverables/Milestones, Billing details, Change Request, History sections
  - [ ] Content is specific to SOW type (Fixed Price or Retainer)
  - [ ] Tab is selected by default

- [ ] **Change Requests Tab**:
  - [ ] Displays change request list with detailed information
  - [ ] Shows all change requests for the SOW
  - [ ] Change requests can be filtered or sorted
  - [ ] Clicking a change request shows detailed view (optional)
  - [ ] Empty state message if no change requests exist

## Technical Requirements

### Frontend Requirements

#### Fixed Price SOW Types
```typescript
interface FixedPriceSOWDetail {
  internalId: number;
  id: string; // Display ID format: SOW-YYYY-MM-DD-NN
  parentMSA: {
    id: string; // MSA-YYYY-MM-DD-NN
    status: string; // "Active", "Draft", etc.
  };
  projectName: string;
  value: number; // Contract value in JPY
  invoicingCycle: string; // "Monthly", "Weekly", etc.
  periodStart: string; // Format: YYYY/MM/DD
  periodEnd: string; // Format: YYYY/MM/DD
  engagementType: 'Fixed Price';
  billingDay: string; // "Last business day", etc.
  scopeSummary: string | null;
  milestones: MilestoneDeliverable[];
  billingDetails: BillingDetail[];
  changeRequests: ChangeRequest[];
  history: ContractHistoryItem[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface MilestoneDeliverable {
  id: number;
  milestone: string; // "Kickoff", "Design Phase", etc.
  deliveryNote: string;
  acceptanceCriteria: string;
  plannedEnd: string; // Format: YYYY/MM/DD
  paymentPercentage: number; // 20, 30, 10, etc.
}

interface BillingDetail {
  id: number;
  billingName: string; // "Kickoff Payment", "Design Payment", etc.
  milestone: string; // Associated milestone
  amount: number; // JPY amount
  percentage: number | null; // 20, 30, etc. or null for change requests
  invoiceDate: string; // Format: YYYY/MM/DD
}
```

#### Retainer SOW Types
```typescript
interface RetainerSOWDetail {
  internalId: number;
  id: string; // Display ID format: SOW-YYYY-MM-DD-NN
  parentMSA: {
    id: string; // MSA-YYYY-MM-DD-NN
    status: string; // "Active", "Draft", etc.
  };
  projectName: string;
  value: number; // Contract value in JPY
  periodStart: string; // Format: YYYY/MM/DD
  periodEnd: string; // Format: YYYY/MM/DD
  engagementType: 'Retainer';
  invoicingCycle: string; // "Monthly", "Weekly", etc.
  billingDay: string; // "Last business day", etc.
  scopeSummary: string | null;
  deliveryItems: DeliveryItem[];
  billingDetails: RetainerBillingDetail[];
  changeRequests: RetainerChangeRequest[];
  history: ContractHistoryItem[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface DeliveryItem {
  id: number;
  milestone: string; // "November 2025", "December 2025", etc.
  deliveryNote: string; // "2 Middle Backend(100%)", etc.
  amount: number; // JPY amount
  paymentDate: string; // Format: YYYY/MM/DD
}

interface RetainerBillingDetail {
  id: number;
  paymentDate: string; // Format: YYYY/MM/DD
  deliveryNote: string; // "2 Middle Backend(100%)", etc.
  amount: number; // JPY amount
}

interface RetainerChangeRequest {
  id: number;
  changeRequestId: string; // "CR-2026-01"
  type: string; // "Extend", "Add Scope", etc.
  summary: string;
  effectiveFrom: string; // Format: YYYY/MM/DD
  effectiveUntil: string; // Format: YYYY/MM/DD
  amount: number; // JPY amount
  status: string; // "Approved", "Pending", etc.
}
```

#### Common Types
```typescript
interface ChangeRequest {
  id: number;
  changeRequestId: string; // "CR-2026-01"
  type: string; // "Add Scope", "Extend", "Reduce"
  summary: string;
  plannedEnd?: string; // Format: YYYY/MM/DD (for Fixed Price)
  effectiveFrom?: string; // Format: YYYY/MM/DD (for Retainer)
  effectiveUntil?: string; // Format: YYYY/MM/DD (for Retainer)
  amount: number; // JPY amount
  status: string; // "Approved", "Pending", "Rejected"
}

interface ContractHistoryItem {
  id: number;
  date: string; // Format: YYYY/MM/DD
  description: string;
  documentLink: string | null;
  documentName: string | null;
  createdBy: string | null;
}
```

### Backend Requirements

#### Database Schema

##### Fixed Price SOW Table
```sql
CREATE TABLE IF NOT EXISTS fixed_price_sows (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contract_id INT NOT NULL, -- References contracts table
  parent_msa_id INT NOT NULL, -- References contracts table (MSA type)
  project_name VARCHAR(255) NOT NULL,
  value DECIMAL(16,2) NOT NULL,
  invoicing_cycle VARCHAR(64),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  billing_day VARCHAR(64),
  scope_summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_msa_id) REFERENCES contracts(id) ON DELETE CASCADE,
  INDEX idx_contract_id (contract_id),
  INDEX idx_parent_msa_id (parent_msa_id)
);

-- Milestone Deliverables Table
CREATE TABLE IF NOT EXISTS milestone_deliverables (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fixed_price_sow_id INT NOT NULL,
  milestone VARCHAR(255) NOT NULL,
  delivery_note TEXT,
  acceptance_criteria TEXT,
  planned_end DATE NOT NULL,
  payment_percentage DECIMAL(5,2) NOT NULL, -- 20.00, 30.00, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (fixed_price_sow_id) REFERENCES fixed_price_sows(id) ON DELETE CASCADE,
  INDEX idx_sow_id (fixed_price_sow_id),
  INDEX idx_planned_end (planned_end)
);

-- Fixed Price Billing Details Table
CREATE TABLE IF NOT EXISTS fixed_price_billing_details (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fixed_price_sow_id INT NOT NULL,
  billing_name VARCHAR(255) NOT NULL,
  milestone VARCHAR(255),
  amount DECIMAL(16,2) NOT NULL,
  percentage DECIMAL(5,2) NULL, -- May be null for change request items
  invoice_date DATE NOT NULL,
  milestone_deliverable_id INT NULL, -- Reference to milestone
  change_request_id INT NULL, -- Reference to change request
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (fixed_price_sow_id) REFERENCES fixed_price_sows(id) ON DELETE CASCADE,
  FOREIGN KEY (milestone_deliverable_id) REFERENCES milestone_deliverables(id) ON DELETE SET NULL,
  INDEX idx_sow_id (fixed_price_sow_id),
  INDEX idx_invoice_date (invoice_date)
);
```

##### Retainer SOW Table
```sql
CREATE TABLE IF NOT EXISTS retainer_sows (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contract_id INT NOT NULL, -- References contracts table
  parent_msa_id INT NOT NULL, -- References contracts table (MSA type)
  project_name VARCHAR(255) NOT NULL,
  value DECIMAL(16,2) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  invoicing_cycle VARCHAR(64),
  billing_day VARCHAR(64),
  scope_summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_msa_id) REFERENCES contracts(id) ON DELETE CASCADE,
  INDEX idx_contract_id (contract_id),
  INDEX idx_parent_msa_id (parent_msa_id)
);

-- Delivery Items Table
CREATE TABLE IF NOT EXISTS delivery_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  retainer_sow_id INT NOT NULL,
  milestone VARCHAR(255) NOT NULL, -- "November 2025", etc.
  delivery_note TEXT NOT NULL,
  amount DECIMAL(16,2) NOT NULL,
  payment_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (retainer_sow_id) REFERENCES retainer_sows(id) ON DELETE CASCADE,
  INDEX idx_sow_id (retainer_sow_id),
  INDEX idx_payment_date (payment_date)
);

-- Retainer Billing Details Table
CREATE TABLE IF NOT EXISTS retainer_billing_details (
  id INT PRIMARY KEY AUTO_INCREMENT,
  retainer_sow_id INT NOT NULL,
  payment_date DATE NOT NULL,
  delivery_note TEXT NOT NULL,
  amount DECIMAL(16,2) NOT NULL,
  delivery_item_id INT NULL, -- Reference to delivery item
  change_request_id INT NULL, -- Reference to change request
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (retainer_sow_id) REFERENCES retainer_sows(id) ON DELETE CASCADE,
  FOREIGN KEY (delivery_item_id) REFERENCES delivery_items(id) ON DELETE SET NULL,
  INDEX idx_sow_id (retainer_sow_id),
  INDEX idx_payment_date (payment_date)
);
```

##### Change Requests Table (Common for both types)
```sql
CREATE TABLE IF NOT EXISTS change_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contract_id INT NOT NULL, -- References contracts table (SOW)
  change_request_id VARCHAR(50) NOT NULL UNIQUE, -- "CR-2026-01"
  type VARCHAR(50) NOT NULL, -- "Add Scope", "Extend", "Reduce"
  summary TEXT NOT NULL,
  planned_end DATE NULL, -- For Fixed Price SOW
  effective_from DATE NULL, -- For Retainer SOW
  effective_until DATE NULL, -- For Retainer SOW
  amount DECIMAL(16,2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- "Approved", "Pending", "Rejected"
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
  INDEX idx_contract_id (contract_id),
  INDEX idx_change_request_id (change_request_id),
  INDEX idx_status (status)
);
```

#### API Requirements

##### GET /api/client/contracts/{contractId}
**Description**: Get SOW contract detail for the authenticated client (detects type automatically)

**Path Parameters**:
- `contractId` (required): Contract internal ID (primary key)

**Response**:
```json
{
  "internalId": 1,
  "id": "SOW-2025-07-02",
  "contractType": "SOW",
  "engagementType": "Fixed Price", // or "Retainer"
  "parentMSA": {
    "id": "MSA-2025-07",
    "status": "Active"
  },
  "projectName": "QA Augmentation",
  "value": 1800000,
  "invoicingCycle": "Monthly",
  "periodStart": "2025/11/01",
  "periodEnd": "2026/6/30",
  "billingDay": "Last business day",
  "scopeSummary": "Create EC site with core functions base on requirement v1",
  "status": "Under Review",
  // Fixed Price specific fields
  "milestones": [
    {
      "id": 1,
      "milestone": "Kickoff",
      "deliveryNote": "Setup environment, project plan",
      "acceptanceCriteria": "Client sign-off on plan",
      "plannedEnd": "2025/11/01",
      "paymentPercentage": 20
    }
  ],
  "billingDetails": [
    {
      "id": 1,
      "billingName": "Kickoff Payment",
      "milestone": "Kickoff",
      "amount": 360000,
      "percentage": 20,
      "invoiceDate": "2025/11/01"
    }
  ],
  // OR Retainer specific fields
  "deliveryItems": [
    {
      "id": 1,
      "milestone": "November 2025",
      "deliveryNote": "2 Middle Backend(100%)",
      "amount": 800000,
      "paymentDate": "2025/11/30"
    }
  ],
  "billingDetails": [
    {
      "id": 1,
      "paymentDate": "2025/11/30",
      "deliveryNote": "2 Middle Backend(100%)",
      "amount": 800000
    }
  ],
  "changeRequests": [
    {
      "id": 1,
      "changeRequestId": "CR-2026-01",
      "type": "Add Scope",
      "summary": "Add new function X",
      "plannedEnd": "2026/6/30", // For Fixed Price
      "effectiveFrom": null, // For Retainer
      "effectiveUntil": null, // For Retainer
      "amount": 200000,
      "status": "Approved"
    }
  ],
  "history": [
    {
      "id": 1,
      "date": "2025/06/10",
      "description": "Contract Draft v2 uploaded by LandBridge",
      "documentLink": "https://example.com/documents/SOW_v2.pdf",
      "documentName": "SOW_v2.pdf",
      "createdBy": "Sale 01"
    }
  ]
}
```

## Implementation Guidelines

### Frontend Implementation

#### SOW Detail Page Component Structure
```typescript
// frontend/src/app/client/contracts/[contractId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ClientSidebar } from '@/components/design-patterns/client/ClientSidebar';
import { ClientHeader } from '@/components/design-patterns/client/ClientHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  getContractDetail, 
  approveContract, 
  addComment, 
  cancelContract 
} from '@/services/contractService';
import { ContractDetail } from '@/types/contract';
import CommentModal from '@/components/CommentModal';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function ContractDetailPage() {
  const { contractId } = useParams();
  const { token, isAuthenticated, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  
  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('contract-info');
  const [showCommentModal, setShowCommentModal] = useState(false);
  
  // Detect SOW type
  const isFixedPrice = contract?.engagementType === 'Fixed Price';
  const isRetainer = contract?.engagementType === 'Retainer';
  
  // Render appropriate sections based on SOW type
  // ...
}
```

### Backend Implementation

#### SOW Detail Service
```java
@Service
public class ContractDetailService {
    
    @Autowired
    private ContractRepository contractRepository;
    
    @Autowired
    private FixedPriceSOWRepository fixedPriceSOWRepository;
    
    @Autowired
    private RetainerSOWRepository retainerSOWRepository;
    
    @Autowired
    private MilestoneDeliverableRepository milestoneDeliverableRepository;
    
    @Autowired
    private DeliveryItemRepository deliveryItemRepository;
    
    public ContractDetailDTO getContractDetail(Integer contractId, Integer clientUserId) {
        Contract contract = contractRepository.findByIdAndClientId(contractId, clientUserId)
            .orElseThrow(() -> new EntityNotFoundException("Contract not found"));
        
        // Check if it's a SOW
        if (contract.getContractType() != ContractType.SOW) {
            // Handle MSA or other types
            return getMSADetail(contract, clientUserId);
        }
        
        // Determine SOW type and load appropriate data
        // This could be stored in a separate table or in contract entity
        String engagementType = determineEngagementType(contractId);
        
        if ("Fixed Price".equals(engagementType)) {
            return getFixedPriceSOWDetail(contract, clientUserId);
        } else if ("Retainer".equals(engagementType)) {
            return getRetainerSOWDetail(contract, clientUserId);
        }
        
        throw new IllegalStateException("Unknown SOW engagement type");
    }
    
    private ContractDetailDTO getFixedPriceSOWDetail(Contract contract, Integer clientUserId) {
        // Implementation for Fixed Price SOW
        // Load milestones, billing details, change requests
    }
    
    private ContractDetailDTO getRetainerSOWDetail(Contract contract, Integer clientUserId) {
        // Implementation for Retainer SOW
        // Load delivery items, billing details, change requests
    }
}
```

## Testing Requirements

### Unit Tests
- [ ] ContractDetailService: Test Fixed Price SOW detail retrieval
- [ ] ContractDetailService: Test Retainer SOW detail retrieval
- [ ] ContractDetailService: Test milestone/delivery item loading
- [ ] ContractDetailService: Test billing details loading
- [ ] ContractDetailService: Test change request loading
- [ ] ContractDetailService: Test contract approval
- [ ] ContractDetailService: Test comment addition
- [ ] ContractDetailService: Test contract cancellation

### Integration Tests
- [ ] GET /api/client/contracts/{contractId}: Test Fixed Price SOW retrieval
- [ ] GET /api/client/contracts/{contractId}: Test Retainer SOW retrieval
- [ ] GET /api/client/contracts/{contractId}: Test authentication
- [ ] GET /api/client/contracts/{contractId}: Test authorization (only own contracts)
- [ ] POST /api/client/contracts/{contractId}/approve: Test approval
- [ ] POST /api/client/contracts/{contractId}/comment: Test comment
- [ ] POST /api/client/contracts/{contractId}/cancel: Test cancellation

### End-to-End Tests
- [ ] User can view Fixed Price SOW detail page
- [ ] User can view Retainer SOW detail page
- [ ] User can see all sections for Fixed Price SOW
- [ ] User can see all sections for Retainer SOW
- [ ] User can switch between Contract Info and Change Requests tabs
- [ ] User can approve SOW contract
- [ ] User can add comment to SOW contract
- [ ] User can cancel SOW contract
- [ ] User can navigate back to contract list
- [ ] User can download/view contract documents from history
- [ ] Error handling works correctly
- [ ] Loading states display correctly

## Performance Requirements
- [ ] SOW detail page loads within 2 seconds
- [ ] Action buttons respond within 1 second
- [ ] Tab switching is instant
- [ ] Tables load within 1 second
- [ ] Document downloads start within 2 seconds

## Security Considerations
- [ ] Only authenticated users can access SOW detail page
- [ ] Users can only view their own contracts (client_id filter)
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (sanitize user input)
- [ ] CSRF protection (if applicable)
- [ ] API rate limiting (if applicable)

## Deployment Requirements
- [ ] Database migration for fixed_price_sows table
- [ ] Database migration for retainer_sows table
- [ ] Database migration for milestone_deliverables table
- [ ] Database migration for delivery_items table
- [ ] Database migration for billing details tables
- [ ] Database migration for change_requests table
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
  - Story-13: Client Contract Detail MSA View (shared components and patterns)
  - Story-06: Client Login Authentication (required for access)
  - Client Header and Sidebar components (shared components)
  - Language Context (for i18n)
  - Auth Context (for authentication)

- **External Dependencies**:
  - Contracts table in database (MSA and SOW contracts)
  - SOW-specific tables (fixed_price_sows, retainer_sows)
  - Milestone and delivery item tables
  - Billing details tables
  - Change request tables
  - Contract entities and repositories
  - Authentication/Authorization system

## Risks and Mitigation
- **Risk**: SOW type detection logic may be complex
  - **Mitigation**: Store engagement type in contract entity or separate SOW table

- **Risk**: Billing details calculation may be complex for both types
  - **Mitigation**: Implement clear business logic and validation

- **Risk**: Change request handling differs between Fixed Price and Retainer
  - **Mitigation**: Use flexible schema with nullable fields for different types

- **Risk**: Milestone vs Delivery Items have different structures
  - **Mitigation**: Use separate tables and DTOs for each type

## Success Metrics
- [ ] SOW detail page loads successfully for all authenticated clients
- [ ] All sections display correctly for Fixed Price SOW
- [ ] All sections display correctly for Retainer SOW
- [ ] Tab switching works correctly
- [ ] Action buttons work correctly
- [ ] History section displays correctly
- [ ] All text elements are properly translated (JP/EN)
- [ ] Page matches wireframe design
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

---

**Document Control**
- **Version**: 1.0
- **Created**: January 2025
- **Last Updated**: January 2025
- **Next Review**: March 2025
- **Approved By**: System Management Team
- **Distribution**: Development Team, Product Team, Management

