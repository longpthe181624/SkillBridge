# User Story: Sales Opportunity Edit/Detail Management

## Story Information
- **Story ID**: Story-23
- **Title**: Sales Opportunity Edit/Detail Management
- **Epic**: Sales Portal - Opportunities Management
- **Priority**: High
- **Story Points**: 21
- **Sprint**: Sprint 6
- **Status**: Draft

## User Story
**As a** Sales User (Sales Manager or Sales Man)  
**I want to** view and edit opportunity details with proposal version history, current proposal management, and review workflow  
**So that** I can track proposal versions, manage the current proposal, conduct internal reviews, convert approved proposals to contracts, and mark opportunities as lost

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] I can view opportunity details matching the wireframe
- [ ] I can view proposal versions history in a table format
- [ ] I can view current proposal details with version number
- [ ] I can edit proposal (same rules as Story-22)
- [ ] I can assign reviewer and submit review (same rules as Story-22)
- [ ] I can view history log of proposal activities
- [ ] I can convert opportunity to contract when client approves a proposal
- [ ] I can mark opportunity as lost
- [ ] Button "+ Convert to Contract" is only enabled when client approves a proposal
- [ ] Opportunity edit page matches the wireframe design exactly

### Detailed Acceptance Criteria

#### 1. Page Layout (Based on Wireframe)

- [ ] **Left Sidebar**:
  - [ ] "SKILL BRIDGE" logo/title at the top of sidebar in dark gray background
  - [ ] Navigation menu items with icons:
    - [ ] "Dashboard" with grid icon (four squares)
    - [ ] "Contact form" with envelope icon
    - [ ] "Opportunities" with document icon (highlighted/active state when on this page)
    - [ ] "Contract" with document icon
  - [ ] Sidebar has white background with dark gray header
  - [ ] Sidebar is collapsible on mobile (future enhancement)

- [ ] **Top Header Bar**:
  - [ ] Header bar has dark gray background
  - [ ] "SKILL BRIDGE" text on the far left in white
  - [ ] Page title "Opportunities management" displayed in the center in white text (or similar)
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
  - [ ] Displays "Opportunity Management > Opportunity detail"
  - [ ] "Opportunity Management" is clickable and links back to opportunities list (`/sales/opportunities`)
  - [ ] "Opportunity detail" is the current page (non-clickable)
  - [ ] Breadcrumbs are positioned below header, above page title

#### 3. Page Title

- [ ] **Page Title**:
  - [ ] Large, bold text displaying "Opportunity Detail"
  - [ ] Positioned below breadcrumbs
  - [ ] Clear visual hierarchy

#### 4. Opportunity Info Section

- [ ] **Section Title**:
  - [ ] Displays "Opportunity Info" as section header
  - [ ] Clear visual separation from other sections

- [ ] **Two-Column Layout**:
  - [ ] Information displayed in two columns (left and right)
  - [ ] Responsive: stacks vertically on mobile devices

- [ ] **Left Column Fields**:
  - [ ] **Client's name**:
    - [ ] Label: "Client's Name"
    - [ ] Value: Client's full name (e.g., "Sato Taro")
    - [ ] Field is editable (text input)
    - [ ] Required field
    - [ ] Validation: Cannot be empty
  
  - [ ] **Sale** (Assignee):
    - [ ] Label: "Sale"
    - [ ] Value: Assigned Sales Man's name or identifier (e.g., "Sale 01")
    - [ ] Field is editable (dropdown/select)
    - [ ] Dropdown shows list of Sales Men (users with role SALES_REP)
    - [ ] Can select any Sales Man from the list
    - [ ] Displays assignee's name from users table
  
  - [ ] **Probability**:
    - [ ] Label: "Probability"
    - [ ] Value: Percentage (0-100) (e.g., "70%")
    - [ ] Field is editable (number input with percentage display)
    - [ ] Input accepts numbers 0-100
    - [ ] Automatically displays "%" symbol
    - [ ] Validation: Must be between 0 and 100

- [ ] **Right Column Fields**:
  - [ ] **Client Company**:
    - [ ] Label: "Client Company"
    - [ ] Value: Company name (e.g., "ABC Japan Co.")
    - [ ] Field is editable (text input)
    - [ ] Optional field (can be empty)
  
  - [ ] **Est. Value**:
    - [ ] Label: "Est. Value"
    - [ ] Value: Estimated value in currency format (e.g., "¥5,000,000")
    - [ ] Field is editable (number input with currency formatting)
    - [ ] Currency symbol displayed (default: JPY "¥")
    - [ ] Input accepts decimal numbers
    - [ ] Formatting: Thousands separator (e.g., 5,000,000)
    - [ ] Validation: Must be positive number
  
  - [ ] **Status**:
    - [ ] Label: "Status"
    - [ ] Value: Current opportunity status
    - [ ] Field is read-only (display only, not editable directly)
    - [ ] Status automatically updates based on proposal state:
      - [ ] **"New"**: When opportunity is first created, no proposal exists
      - [ ] **"Proposal Drafting"**: When opportunity has a proposal with status "draft" or "internal review"
      - [ ] **"Proposal Sent"**: When opportunity has a proposal that has been sent to client
      - [ ] **"Revision"**: When client requests changes to the proposal
      - [ ] **"Won"**: When proposal is converted to contract (opportunity won)
      - [ ] **"Lost"**: When opportunity is marked as lost
    - [ ] Status badge with appropriate color coding
    - [ ] Status updates automatically when proposal state changes

#### 5. Proposal Versions Section

- [ ] **Section Title**:
  - [ ] Displays "Proposal Versions" as section header
  - [ ] Clear visual separation from other sections

- [ ] **Proposal Versions Table**:
  - [ ] Table displays all proposal versions for the opportunity
  - [ ] Table has clear borders and spacing
  - [ ] Table headers: Name, Created By, Date, Status, Reviewer, Internal Feedback, Client's Feedback
  - [ ] All columns are properly aligned
  - [ ] Table is scrollable horizontally if content exceeds viewport width
  - [ ] Table rows have hover states
  - [ ] Table has alternating row colors for better readability
  - [ ] Versions are sorted by version number (newest first) or date (newest first)

- [ ] **Table Columns**:
  - [ ] **Name**: Proposal version identifier
    - [ ] Format: "v1", "v2", "v3", etc.
    - [ ] Version number is auto-incremented for each new proposal version
    - [ ] Current proposal version is highlighted or marked
  
  - [ ] **Created By**: User who created the proposal version
    - [ ] Displays Sales Man's identifier or name (e.g., "Sale-01", "Sale 01")
    - [ ] Retrieved from users table via created_by foreign key
  
  - [ ] **Date**: Date when proposal version was created
    - [ ] Format: "YYYY/MM/DD" (e.g., "2025/06/03")
    - [ ] Date is formatted consistently
  
  - [ ] **Status**: Current status of the proposal version
    - [ ] Status values: "Draft", "Internal Review", "Reviewed", "Sent to Client", "Client requests change", "Client Rejected", "Client Accepted"
    - [ ] Status badges with appropriate color coding:
      - [ ] "Draft": Blue badge
      - [ ] "Internal Review": Purple badge
      - [ ] "Reviewed": Green badge
      - [ ] "Sent to Client": Yellow badge
      - [ ] "Client requests change": Orange badge
      - [ ] "Client Rejected": Red badge
      - [ ] "Client Accepted": Green badge
  
  - [ ] **Reviewer**: Assigned reviewer for the proposal version
    - [ ] Displays Sales Manager's name (e.g., "Sales Manager 01", "Sales Manager 02")
    - [ ] Displays "-" (dash) if no reviewer assigned
    - [ ] Retrieved from users table via reviewer_id foreign key
  
  - [ ] **Internal Feedback**: Review notes from internal reviewer
    - [ ] Displays review notes text (e.g., "Need cost...", "OK terms")
    - [ ] Displays "-" (dash) if no internal feedback
    - [ ] Text may be truncated with ellipsis if too long
    - [ ] Full text available on hover or click (optional enhancement)
  
  - [ ] **Client's Feedback**: Feedback from client
    - [ ] Displays client feedback text if available
    - [ ] Displays empty or "-" if no client feedback
    - [ ] Text may be truncated with ellipsis if too long
    - [ ] Full text available on hover or click (optional enhancement)

- [ ] **Table Data**:
  - [ ] Table displays all proposal versions for the opportunity
  - [ ] Each proposal version is a separate row
  - [ ] Versions are ordered by creation date (newest first) or version number (descending)
  - [ ] Empty state message if no proposals exist: "No proposal versions yet"
  - [ ] Loading state while fetching proposal versions (skeleton loader or spinner)

- [ ] **Proposal Version Details** (optional enhancement):
  - [ ] Clicking on a version row may show version details in a modal or expandable section
  - [ ] Version details may include full proposal content, all feedback, attachments, etc.

#### 6. Current Proposal Section

- [ ] **Section Title**:
  - [ ] Displays "■ Current Proposal (v{versionNumber})" as section header
  - [ ] Version number is dynamically displayed (e.g., "■ Current Proposal (v3)")
  - [ ] Clear visual separation from other sections
  - [ ] Section is only visible when a current proposal exists

- [ ] **Proposal Details**:
  - [ ] **Title**:
    - [ ] Label: "Title" (or displayed directly)
    - [ ] Value: Proposal title (e.g., "Proposal for EC Backend Dev")
    - [ ] Displayed as text (read-only in this section)
    - [ ] Title can be edited via "Edit Proposal" button
  
  - [ ] **File**:
    - [ ] Label: "File" (or displayed directly)
    - [ ] Value: Proposal file name (e.g., "Proposal_v3.pdf")
    - [ ] File name is displayed as clickable link
    - [ ] Clicking file link downloads or opens the proposal PDF
    - [ ] File link points to S3 or cloud storage URL
    - [ ] Multiple files may be supported (if applicable)
  
  - [ ] **Status**:
    - [ ] Label: "Status"
    - [ ] Value: Current proposal status
    - [ ] Field is read-only (display only)
    - [ ] Status values: "Draft", "Internal Review", "Reviewed", "Sent to Client", "Client requests change", "Client Rejected", "Client Accepted"
    - [ ] Status badge with appropriate color coding
    - [ ] Status updates automatically based on workflow state
  
  - [ ] **Reviewer**:
    - [ ] Label: "Reviewer"
    - [ ] Value: Assigned reviewer's name (e.g., "Sale Manager 01")
    - [ ] Displayed as text (read-only in this section)
    - [ ] Displays "-" (dash) if no reviewer assigned
    - [ ] Reviewer can be assigned via "Internal Review Workflow" section
  
  - [ ] **Assignee**:
    - [ ] Label: "Assignee"
    - [ ] Value: Assigned Sales Man's name or identifier (e.g., "Sale 01")
    - [ ] Displayed as text (read-only in this section)
    - [ ] Assignee is typically the Sales Man who created the opportunity/proposal

- [ ] **Edit Proposal Button**:
  - [ ] Button labeled "Edit Proposal"
  - [ ] Positioned below proposal details
  - [ ] **Edit Restrictions** (same as Story-22):
    - [ ] **Can Edit**: Proposal can be edited when:
      - [ ] No reviewer has been assigned yet, OR
      - [ ] Reviewer has been assigned but proposal is still in draft state (not yet submitted)
    - [ ] **Cannot Edit**: Proposal cannot be edited when:
      - [ ] Reviewer has been assigned AND saved (proposal submitted for review)
      - [ ] Proposal status is "under review"
      - [ ] Proposal status is "sent to client"
      - [ ] Proposal has been approved
  - [ ] When proposal cannot be edited:
    - [ ] "Edit Proposal" button is disabled
    - [ ] Tooltip or message: "Proposal cannot be edited after reviewer assignment"
  - [ ] Clicking button opens "Edit Proposal" modal (same as Story-22)

#### 7. Internal Review Workflow Section

- [ ] **Section Title**:
  - [ ] Displays "Internal Review Workflow" as section header
  - [ ] Clear visual separation from other sections
  - [ ] Section is only visible when proposal exists

- [ ] **Assign Reviewer Field**:
  - [ ] Label: "Assign Reviewer"
  - [ ] Dropdown/select field
  - [ ] **Role Restriction**: Only displays users with role **SALES_MANAGER**
    - [ ] Filters users by role = "SALES_MANAGER"
    - [ ] Does not show Sales Men (SALES_REP) or other roles
    - [ ] Dropdown shows Sales Manager's full name (e.g., "Sale Manager 01")
  - [ ] **Current Selection**: Shows currently assigned reviewer (e.g., "Sale Manager 01")
  - [ ] **Editable State**:
    - [ ] Can be edited when proposal exists and no review has been submitted yet
    - [ ] Cannot be edited after review has been submitted
    - [ ] Cannot be edited if proposal has been sent to client
  - [ ] **Default Value**: Empty (no reviewer assigned) when proposal is first created
  - [ ] **Saving Reviewer Assignment**:
    - [ ] When reviewer is selected and saved:
      - [ ] Reviewer assignment is saved to proposal's reviewer_id field
      - [ ] Proposal status may change to "internal_review"
      - [ ] After saving, proposal cannot be edited (edit restrictions apply)
      - [ ] Notification sent to assigned reviewer (optional enhancement)

- [ ] **Review Notes Field**:
  - [ ] Label: "Review Notes"
  - [ ] Large text area/textarea field
  - [ ] Placeholder text: "Lorem ip sum" (or appropriate placeholder)
  - [ ] **Permission**: Only assigned reviewer can input review notes
    - [ ] **Assigned Reviewer**: Field is enabled and editable
      - [ ] Can type review notes
      - [ ] Can save review notes
      - [ ] Notes are saved when "Submit review" is clicked
    - [ ] **Not Assigned Reviewer**: Field is disabled and read-only
      - [ ] Sales Manager who is not the assigned reviewer: Field is disabled
      - [ ] Sales Man: Field is disabled
      - [ ] Shows existing review notes (if any) but cannot edit
  - [ ] **Review Notes Display**:
    - [ ] Shows existing review notes if reviewer has already submitted review
    - [ ] Notes are read-only for non-reviewers
    - [ ] Notes are editable only by the assigned reviewer before submission

- [ ] **Actions Dropdown**:
  - [ ] Label: "Actions"
  - [ ] Dropdown/select field
  - [ ] **Options**:
    - [ ] "Approve / Request Revision" (default/selected option)
    - [ ] "Approve" (approve the proposal)
    - [ ] "Request Revision" (request changes to the proposal)
    - [ ] "Reject" (reject the proposal) - optional
  - [ ] **Permission**: Only assigned reviewer can select action
    - [ ] **Assigned Reviewer**: Dropdown is enabled and selectable
      - [ ] Can select any action option
      - [ ] Selection is saved when "Submit review" is clicked
    - [ ] **Not Assigned Reviewer**: Dropdown is disabled
      - [ ] Sales Manager who is not the assigned reviewer: Dropdown is disabled
      - [ ] Sales Man: Dropdown is disabled
      - [ ] Shows current selection (if any) but cannot change
  - [ ] **Current Selection**: Shows currently selected action (e.g., "Approve / Request Revision")

- [ ] **Submit Review Button**:
  - [ ] Button labeled "Submit review"
  - [ ] Positioned to the right of "Actions" dropdown
  - [ ] **Permission**: Only assigned reviewer can click this button
    - [ ] **Assigned Reviewer**: Button is enabled and clickable
      - [ ] Can click to submit review
      - [ ] Validates that review notes are provided (optional validation)
      - [ ] Validates that action is selected
      - [ ] On click:
        - [ ] Saves review notes
        - [ ] Saves selected action
        - [ ] Updates proposal status based on action:
          - [ ] "Approve" → Proposal status: "approved" or "ready to send"
          - [ ] "Request Revision" → Proposal status: "revision_requested"
          - [ ] "Reject" → Proposal status: "rejected"
        - [ ] Updates opportunity status if needed
        - [ ] Shows success message
        - [ ] After submission, reviewer assignment and review fields become read-only
    - [ ] **Not Assigned Reviewer**: Button is disabled
      - [ ] Sales Manager who is not the assigned reviewer: Button is disabled
      - [ ] Sales Man: Button is disabled
      - [ ] Tooltip or message: "Only assigned reviewer can submit review"
  - [ ] **After Submission**:
    - [ ] Review notes become read-only
    - [ ] Actions dropdown becomes read-only
    - [ ] Submit review button becomes disabled
    - [ ] Review submission timestamp is recorded

- [ ] **Review Status Display**:
  - [ ] Shows current review status (if review has been submitted)
  - [ ] Shows reviewer name
  - [ ] Shows review submission date/time
  - [ ] Shows selected action
  - [ ] All users can view review status (read-only)

- [ ] **Role-Based Permissions Summary** (same as Story-22):
  - [ ] **Assigned Reviewer (Sales Manager)**:
    - [ ] Can view all fields in Internal Review Workflow section
    - [ ] Can input review notes
    - [ ] Can select action from dropdown
    - [ ] Can click "Submit review" button
    - [ ] After submission, all fields become read-only
  - [ ] **Not Assigned Reviewer (Sales Manager)**:
    - [ ] Can view all fields in Internal Review Workflow section
    - [ ] Cannot input review notes (field disabled)
    - [ ] Cannot select action (dropdown disabled)
    - [ ] Cannot click "Submit review" button (button disabled)
    - [ ] Can view existing review notes and action (read-only)
  - [ ] **Sales Man**:
    - [ ] Can view all fields in Internal Review Workflow section
    - [ ] Cannot input review notes (field disabled)
    - [ ] Cannot select action (dropdown disabled)
    - [ ] Cannot click "Submit review" button (button disabled)
    - [ ] Can view existing review notes and action (read-only)

#### 8. History Section

- [ ] **Section Title**:
  - [ ] Displays "■ History" as section header
  - [ ] Clear visual separation from other sections

- [ ] **History Log Display**:
  - [ ] Displays chronological list of proposal activities
  - [ ] Each history entry shows:
    - [ ] **Date**: Date when activity occurred (e.g., "[2025/06/10]")
    - [ ] **Activity Description**: Description of the activity (e.g., "Proposal Draft v2 uploaded by Sale 01")
    - [ ] **File Link**: Clickable link to proposal file (e.g., "- Proposal_v2.pdf")
  - [ ] History entries are ordered by date (newest first or oldest first)
  - [ ] Each entry is displayed as a list item or card
  - [ ] File links are clickable and download/open the proposal PDF
  - [ ] Empty state message if no history exists: "No history yet"

- [ ] **History Entry Format**:
  - [ ] Format: "[YYYY/MM/DD] {Activity Description} {File Link}"
  - [ ] Example: "[2025/06/10] Proposal Draft v2 uploaded by Sale 01 - Proposal_v2.pdf"
  - [ ] Date is formatted consistently
  - [ ] Activity description includes user who performed the action
  - [ ] File link is optional (only shown if file exists)

- [ ] **History Activities Tracked**:
  - [ ] Proposal created
  - [ ] Proposal draft uploaded
  - [ ] Proposal version created
  - [ ] Proposal sent to client
  - [ ] Proposal reviewed
  - [ ] Proposal approved/rejected
  - [ ] Client feedback received
  - [ ] Proposal converted to contract (if applicable)

#### 9. Action Buttons

- [ ] **Bottom Action Buttons**:
  - [ ] Buttons positioned at the bottom of the main content area
  - [ ] Buttons are aligned horizontally
  - [ ] Buttons have consistent styling

- [ ] **Mark Lost Button**:
  - [ ] Button labeled "Mark Lost"
  - [ ] Positioned at bottom left (or first position)
  - [ ] Button is enabled and clickable
  - [ ] Clicking button:
    - [ ] Shows confirmation dialog: "Are you sure you want to mark this opportunity as lost?"
    - [ ] After confirmation:
      - [ ] Opportunity status changes to "Lost"
      - [ ] Opportunity is marked as lost in database
      - [ ] Success message displayed
      - [ ] Opportunity status badge updates to "Lost" (gray badge)
      - [ ] Button may become disabled after marking as lost
  - [ ] **Permission**: Both Sales Manager and Sales Man can mark opportunity as lost
  - [ ] **After Marking Lost**:
    - [ ] Opportunity status is "Lost"
    - [ ] Opportunity cannot be converted to contract
    - [ ] Proposal workflow may be stopped (optional business rule)

- [ ] **Convert to Contract Button**:
  - [ ] Button labeled "+ Convert to Contract"
  - [ ] Positioned after "Mark Lost" button
  - [ ] **Enable Condition**: Button is ONLY enabled when:
    - [ ] At least one proposal exists for the opportunity
    - [ ] At least one proposal has status "Client Accepted" (client approved the proposal)
    - [ ] Opportunity status is NOT "Lost"
  - [ ] **Disable Condition**: Button is disabled when:
    - [ ] No proposal exists
    - [ ] No proposal has been approved by client
    - [ ] All proposals are in other statuses (Draft, Internal Review, Sent to Client, Client Rejected, etc.)
    - [ ] Opportunity is marked as lost
  - [ ] **Button State**:
    - [ ] Enabled: Button is clickable, normal styling
    - [ ] Disabled: Button is grayed out, not clickable
    - [ ] Tooltip when disabled: "Convert to Contract is only available when client approves a proposal"
  - [ ] **Clicking Button**:
    - [ ] Shows confirmation dialog: "Are you sure you want to convert this opportunity to contract?"
    - [ ] After confirmation:
      - [ ] Navigates to contract creation page with opportunity data pre-populated
      - [ ] OR opens contract creation modal
      - [ ] Opportunity status may change to "Won"
      - [ ] Proposal status may change to "Converted to Contract"
      - [ ] Success message displayed
  - [ ] **Permission**: Both Sales Manager and Sales Man can convert to contract (when enabled)

- [ ] **Save Button**:
  - [ ] Button labeled "Save"
  - [ ] Positioned after "Convert to Contract" button
  - [ ] Clicking button:
    - [ ] Saves all opportunity information (Client's name, Client Company, Sale/Assignee, Probability, Est. Value)
    - [ ] Validates required fields (Client's name)
    - [ ] Shows validation errors if any
    - [ ] Shows success message after successful save
    - [ ] Shows error message if save fails
    - [ ] Page refreshes to show updated data
  - [ ] **Permission**: Both Sales Manager and Sales Man can save opportunity changes

- [ ] **Back Button**:
  - [ ] Button labeled "Back"
  - [ ] Positioned at bottom right (or last position)
  - [ ] Clicking button:
    - [ ] Navigates back to opportunities list page (`/sales/opportunities`)
    - [ ] Shows confirmation dialog if there are unsaved changes
    - [ ] Discards unsaved changes if user confirms

## Technical Requirements

### Frontend Requirements

```typescript
// Opportunity Edit/Detail Page Component Structure
interface OpportunityEditPageProps {
  opportunityId: string; // Required for edit mode
}

interface ProposalVersion {
  id: number;
  version: number; // e.g., 1, 2, 3
  name: string; // e.g., "v1", "v2", "v3"
  title: string;
  createdBy: number;
  createdByName: string; // e.g., "Sale-01"
  createdAt: string; // Format: "YYYY/MM/DD"
  status: 'DRAFT' | 'INTERNAL_REVIEW' | 'REVIEWED' | 'SENT_TO_CLIENT' | 'CLIENT_REQUESTS_CHANGE' | 'CLIENT_REJECTED' | 'CLIENT_ACCEPTED';
  reviewerId: number | null;
  reviewerName: string | null; // e.g., "Sales Manager 01"
  internalFeedback: string | null; // Review notes
  clientFeedback: string | null;
  isCurrent: boolean; // True if this is the current proposal version
}

interface HistoryEntry {
  id: number;
  date: string; // Format: "YYYY/MM/DD"
  activity: string; // e.g., "Proposal Draft v2 uploaded by Sale 01"
  fileLink: string | null; // e.g., "Proposal_v2.pdf"
  fileUrl: string | null; // S3 URL
}

interface OpportunityDetailResponse {
  opportunity: Opportunity; // Same as Story-22
  currentProposal: Proposal | null; // Current proposal with version number
  proposalVersions: ProposalVersion[]; // All proposal versions
  history: HistoryEntry[]; // History log
  canConvertToContract: boolean; // True if client approved a proposal
}
```

### Key Frontend Functions

```typescript
// Check if Convert to Contract button should be enabled
const canConvertToContract = (proposalVersions: ProposalVersion[]): boolean => {
  return proposalVersions.some(
    version => version.status === 'CLIENT_ACCEPTED'
  );
};

// Mark opportunity as lost
const markOpportunityAsLost = async (opportunityId: string): Promise<void> => {
  await fetch(`/api/sales/opportunities/${opportunityId}/mark-lost`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

// Convert opportunity to contract
const convertToContract = async (opportunityId: string): Promise<void> => {
  const response = await fetch(`/api/sales/opportunities/${opportunityId}/convert-to-contract`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  // Navigate to contract creation page or open modal
};
```

### Backend Requirements

```java
// Additional endpoints for Opportunity Edit
@RestController
@RequestMapping("/api/sales/opportunities")
@PreAuthorize("hasAnyRole('SALES_MANAGER', 'SALES_REP')")
public class SalesOpportunityController {
    
    // Get opportunity detail with proposal versions and history
    @GetMapping("/{opportunityId}/detail")
    public ResponseEntity<OpportunityDetailResponse> getOpportunityDetail(
        @PathVariable String opportunityId,
        Authentication authentication
    ) {
        User currentUser = getCurrentUser(authentication);
        OpportunityDetailResponse response = opportunityService.getOpportunityDetail(opportunityId, currentUser);
        return ResponseEntity.ok(response);
    }
    
    // Mark opportunity as lost
    @PostMapping("/{opportunityId}/mark-lost")
    public ResponseEntity<OpportunityDTO> markOpportunityAsLost(
        @PathVariable String opportunityId,
        Authentication authentication
    ) {
        User currentUser = getCurrentUser(authentication);
        OpportunityDTO opportunity = opportunityService.markAsLost(opportunityId, currentUser);
        return ResponseEntity.ok(opportunity);
    }
    
    // Convert opportunity to contract
    @PostMapping("/{opportunityId}/convert-to-contract")
    public ResponseEntity<ContractDTO> convertToContract(
        @PathVariable String opportunityId,
        Authentication authentication
    ) {
        User currentUser = getCurrentUser(authentication);
        ContractDTO contract = opportunityService.convertToContract(opportunityId, currentUser);
        return ResponseEntity.ok(contract);
    }
}

// Service methods
@Service
public class SalesOpportunityService {
    
    public OpportunityDetailResponse getOpportunityDetail(String opportunityId, User currentUser) {
        Opportunity opportunity = opportunityRepository.findByOpportunityId(opportunityId)
            .orElseThrow(() -> new EntityNotFoundException("Opportunity not found"));
        
        // Authorization check (same as Story-22)
        
        OpportunityDetailResponse response = new OpportunityDetailResponse();
        response.setOpportunity(convertToDTO(opportunity));
        
        // Get current proposal
        Optional<Proposal> currentProposalOpt = proposalRepository.findByOpportunityIdAndIsCurrent(opportunity.getId(), true);
        if (currentProposalOpt.isPresent()) {
            response.setCurrentProposal(convertProposalToDTO(currentProposalOpt.get()));
        }
        
        // Get all proposal versions
        List<Proposal> proposals = proposalRepository.findByOpportunityIdOrderByVersionDesc(opportunity.getId());
        List<ProposalVersion> versions = proposals.stream()
            .map(this::convertToProposalVersion)
            .collect(Collectors.toList());
        response.setProposalVersions(versions);
        
        // Get history
        List<HistoryEntry> history = historyService.getHistoryByOpportunityId(opportunity.getId());
        response.setHistory(history);
        
        // Check if can convert to contract
        boolean canConvert = proposals.stream()
            .anyMatch(p -> p.getStatus().equals("CLIENT_ACCEPTED"));
        response.setCanConvertToContract(canConvert);
        
        return response;
    }
    
    public OpportunityDTO markAsLost(String opportunityId, User currentUser) {
        Opportunity opportunity = opportunityRepository.findByOpportunityId(opportunityId)
            .orElseThrow(() -> new EntityNotFoundException("Opportunity not found"));
        
        // Authorization check
        
        opportunity.setStatus("LOST");
        opportunity = opportunityRepository.save(opportunity);
        
        return convertToDTO(opportunity);
    }
    
    public ContractDTO convertToContract(String opportunityId, User currentUser) {
        Opportunity opportunity = opportunityRepository.findByOpportunityId(opportunityId)
            .orElseThrow(() -> new EntityNotFoundException("Opportunity not found"));
        
        // Check if client approved a proposal
        List<Proposal> proposals = proposalRepository.findByOpportunityId(opportunity.getId());
        Proposal approvedProposal = proposals.stream()
            .filter(p -> p.getStatus().equals("CLIENT_ACCEPTED"))
            .findFirst()
            .orElseThrow(() -> new IllegalStateException("No approved proposal found"));
        
        // Create contract from opportunity and approved proposal
        Contract contract = contractService.createFromOpportunity(opportunity, approvedProposal, currentUser);
        
        // Update opportunity status to "Won"
        opportunity.setStatus("WON");
        opportunityRepository.save(opportunity);
        
        // Update proposal status
        approvedProposal.setStatus("CONVERTED_TO_CONTRACT");
        proposalRepository.save(approvedProposal);
        
        return convertContractToDTO(contract);
    }
}
```

### Database Schema Updates

```sql
-- Proposals table (add version tracking)
ALTER TABLE proposals ADD COLUMN version INT DEFAULT 1;
ALTER TABLE proposals ADD COLUMN is_current BOOLEAN DEFAULT false;
ALTER TABLE proposals ADD COLUMN client_feedback TEXT;

-- History table for proposal activities
CREATE TABLE proposal_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    opportunity_id INT NOT NULL,
    proposal_id INT,
    activity_type VARCHAR(50) NOT NULL, -- CREATED, UPLOADED, SENT, REVIEWED, APPROVED, REJECTED, CONVERTED
    activity_description TEXT,
    file_link VARCHAR(500),
    file_url VARCHAR(500),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_opportunity_id (opportunity_id),
    INDEX idx_proposal_id (proposal_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE,
    FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);
```

## Testing Requirements

### Unit Tests
- [ ] Opportunity detail page renders correctly
- [ ] Proposal versions table displays correctly
- [ ] Current proposal section displays correctly
- [ ] History section displays correctly
- [ ] Convert to Contract button enable/disable logic
- [ ] Mark Lost functionality
- [ ] Proposal version tracking
- [ ] History log creation

### Integration Tests
- [ ] Get opportunity detail API with proposal versions and history
- [ ] Mark opportunity as lost API
- [ ] Convert to contract API (only when client approved)
- [ ] Proposal version creation and tracking
- [ ] History log creation on proposal activities
- [ ] Convert to Contract button state based on proposal status

### End-to-End Tests
- [ ] View opportunity detail with proposal versions
- [ ] View current proposal details
- [ ] View history log
- [ ] Mark opportunity as lost flow
- [ ] Convert to contract flow (when client approved)
- [ ] Convert to Contract button disabled when no approved proposal
- [ ] Proposal version history tracking

## Performance Requirements

### Performance Metrics
- **Page Load Time**: < 2 seconds
- **Proposal Versions Table Load**: < 1 second
- **History Load**: < 500ms
- **Mark Lost Action**: < 500ms
- **Convert to Contract Action**: < 1 second

## Security Considerations

### Security Requirements
- [ ] Role-based access control enforced at API level
- [ ] Sales Man can only view/edit opportunities they created
- [ ] Convert to Contract only available when client approved proposal
- [ ] Mark Lost permission checks
- [ ] History access control
- [ ] SQL injection prevention
- [ ] XSS protection on all user inputs
- [ ] HTTPS required for all API requests

## Definition of Done

### Development Complete
- [ ] Opportunity edit/detail page implemented matching wireframe
- [ ] Proposal versions table implemented
- [ ] Current proposal section implemented
- [ ] History section implemented
- [ ] Mark Lost functionality implemented
- [ ] Convert to Contract button with enable/disable logic implemented
- [ ] Proposal version tracking implemented
- [ ] History log tracking implemented
- [ ] All sections from wireframe implemented
- [ ] Responsive design implemented

### Testing Complete
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] E2E tests written and passing
- [ ] Security tests completed
- [ ] Cross-browser testing completed
- [ ] Convert to Contract button logic tested thoroughly

### Documentation Complete
- [ ] API documentation updated
- [ ] Technical documentation updated
- [ ] User guide updated (if applicable)
- [ ] Deployment guide updated

## Dependencies

### External Dependencies
- **Next.js 14+**: Frontend framework
- **React 18+**: UI library
- **Spring Boot**: Backend framework
- **Spring Security**: Authentication and authorization
- **JPA/Hibernate**: Database access

### Internal Dependencies
- **Story-21**: Sales Opportunities List Management (for navigation)
- **Story-22**: Sales Opportunity Create/Detail Management (for proposal creation/edit logic)
- **User Entity**: Existing user table with role field
- **Opportunity Entity**: Opportunities table
- **Proposal Entity**: Proposals table with version tracking
- **History Entity**: Proposal history table
- **AuthContext**: Authentication context for sales users

## Risks and Mitigation

### Technical Risks
- **Proposal Version Tracking**: Complex version management may cause data inconsistency
  - *Mitigation*: Clear versioning logic, database constraints, comprehensive tests
- **Convert to Contract Logic**: Button enable/disable logic may be complex
  - *Mitigation*: Clear business rules, frontend and backend validation, thorough testing
- **History Log Performance**: Large history logs may slow down page load
  - *Mitigation*: Pagination, lazy loading, indexing

### Business Risks
- **User Experience**: Complex page with many sections may confuse users
  - *Mitigation*: Clear UI, tooltips, user testing, help documentation
- **Convert to Contract Timing**: Users may try to convert before client approval
  - *Mitigation*: Clear button states, tooltips, validation messages

---

**Story Status**: Draft  
**Assigned To**: Backend & Frontend Teams  
**Estimated Effort**: 21 Story Points  
**Target Sprint**: Sprint 6

