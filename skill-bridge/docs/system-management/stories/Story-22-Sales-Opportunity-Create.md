# User Story: Sales Opportunity Create/Detail Management

## Story Information
- **Story ID**: Story-22
- **Title**: Sales Opportunity Create/Detail Management
- **Epic**: Sales Portal - Opportunities Management
- **Priority**: High
- **Story Points**: 21
- **Sprint**: Sprint 6
- **Status**: Draft

## User Story
**As a** Sales User (Sales Manager or Sales Man)  
**I want to** create and manage opportunity details with proposal creation and review workflow  
**So that** I can convert contacts to opportunities, create proposals, and manage the sales pipeline through internal review processes

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] I can create a new opportunity from a contact by clicking "Convert to Opportunity" button
- [ ] Contact information (Client's name, Client Company, Assignee) is automatically copied to the new opportunity
- [ ] I can view and edit opportunity details matching the wireframe
- [ ] I can create a proposal for the opportunity (only one proposal per opportunity)
- [ ] I can edit proposal before reviewer is assigned and saved
- [ ] I cannot edit proposal after reviewer is assigned and saved
- [ ] Only Sales Managers can be assigned as reviewers
- [ ] Only assigned reviewers can submit reviews with notes and actions
- [ ] Opportunity status automatically updates based on proposal status
- [ ] Opportunity detail page matches the wireframe design exactly

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
  - [ ] Page title "Opportunities management" displayed in the center in white text
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

#### 3. Page Title and Stage

- [ ] **Page Title**:
  - [ ] Large, bold text displaying "Opportunity Detail"
  - [ ] Positioned below breadcrumbs
  - [ ] Clear visual hierarchy

- [ ] **Stage Display**:
  - [ ] Displays "Stage: Proposal" below the page title
  - [ ] Stage indicates current workflow stage of the opportunity
  - [ ] Stage updates based on proposal status:
    - [ ] "Stage: New" when no proposal exists
    - [ ] "Stage: Proposal" when proposal exists (draft, under review, sent, etc.)
    - [ ] "Stage: Won" when opportunity is won
    - [ ] "Stage: Lost" when opportunity is lost

#### 4. Opportunity Info Section

- [ ] **Section Title**:
  - [ ] Displays "Opportunity Info" as section header
  - [ ] Clear visual separation from other sections

- [ ] **Two-Column Layout**:
  - [ ] Information displayed in two columns (left and right)
  - [ ] Responsive: stacks vertically on mobile devices

- [ ] **Left Column Fields**:
  - [ ] **Client's name**:
    - [ ] Label: "Client's name"
    - [ ] Value: Client's full name (e.g., "Sato Taro")
    - [ ] **Auto-populated from contact** when converting from contact detail
    - [ ] Field is editable (text input)
    - [ ] Required field
    - [ ] Validation: Cannot be empty
  
  - [ ] **Assignee**:
    - [ ] Label: "Assignee"
    - [ ] Value: Assigned Sales Man's name or identifier (e.g., "Sale 01")
    - [ ] **Auto-populated from contact** when converting from contact detail
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
    - [ ] **Auto-populated from contact** when converting from contact detail
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
      - [ ] **"New"** (default): When opportunity is first created, no proposal exists
      - [ ] **"Proposal Drafting"**: When opportunity has a proposal with status "draft" or "internal review"
      - [ ] **"Proposal Sent"**: When opportunity has a proposal that has been sent to client
      - [ ] **"Revision"**: When client requests changes to the proposal
      - [ ] **"Won"**: When proposal is converted to contract (opportunity won)
      - [ ] **"Lost"**: When opportunity is marked as lost
    - [ ] Status badge with appropriate color coding:
      - [ ] "New": Blue badge
      - [ ] "Proposal Drafting": Purple badge
      - [ ] "Proposal Sent": Yellow badge
      - [ ] "Revision": Pink badge
      - [ ] "Won": Green badge
      - [ ] "Lost": Gray badge
    - [ ] Status updates automatically when:
      - [ ] Proposal is created → "Proposal Drafting"
      - [ ] Proposal status changes to "sent to client" → "Proposal Sent"
      - [ ] Client requests revision → "Revision"
      - [ ] Proposal converted to contract → "Won"
      - [ ] Opportunity marked as lost → "Lost"

- [ ] **Data Pre-population from Contact**:
  - [ ] When user clicks "Convert to Opportunity" button from contact detail page (Story-20):
    - [ ] Navigate to opportunity create page: `/sales/opportunities/new?contactId={contactId}`
    - [ ] System fetches contact data by contactId
    - [ ] **Client's name**: Copied from contact's client name field
    - [ ] **Client Company**: Copied from contact's company name field
    - [ ] **Assignee**: Copied from contact's assignee_user_id (Sales Man assigned to contact)
    - [ ] **Probability**: Default value 0% (user must set)
    - [ ] **Est. Value**: Default value 0 (user must set)
    - [ ] **Status**: Default "New"
    - [ ] Contact ID is stored in opportunity's contact_id field for reference

#### 5. Proposal Versions Section

- [ ] **Section Title**:
  - [ ] Displays "Proposal Versions" as section header
  - [ ] Clear visual separation from other sections

- [ ] **Create/Edit Proposal Button**:
  - [ ] **When no proposal exists**:
    - [ ] Button displays "+ Create Proposal"
    - [ ] Button is enabled and clickable
    - [ ] Clicking button opens "Create Proposal" modal
  - [ ] **When proposal exists and can be edited**:
    - [ ] Button displays "Edit Proposal" (replaces "+ Create Proposal")
    - [ ] Button is enabled and clickable
    - [ ] Proposal can be edited only if:
      - [ ] Proposal exists
      - [ ] No reviewer has been assigned yet, OR
      - [ ] Reviewer has been assigned but not yet saved (draft state)
    - [ ] Clicking button opens "Edit Proposal" modal with existing proposal data
  - [ ] **When proposal exists but cannot be edited**:
    - [ ] Button displays "Edit Proposal" but is disabled
    - [ ] Proposal cannot be edited if:
      - [ ] Reviewer has been assigned AND saved
      - [ ] Proposal has been submitted for review
      - [ ] Proposal has been sent to client
  - [ ] **One Proposal Per Opportunity Rule**:
    - [ ] Only one proposal can exist per opportunity
    - [ ] System prevents creating multiple proposals
    - [ ] If proposal exists, "Create Proposal" button is replaced with "Edit Proposal"

- [ ] **Proposal Display** (if proposal exists):
  - [ ] Shows proposal title
  - [ ] Shows proposal status
  - [ ] Shows proposal creation date
  - [ ] Shows proposal version (if versioning is implemented)

#### 6. Create/Edit Proposal Modal

- [ ] **Modal Display**:
  - [ ] Modal appears as overlay on top of main content
  - [ ] Modal has white background
  - [ ] Modal is centered on screen
  - [ ] Modal has close button (X) in top right corner
  - [ ] Clicking outside modal or pressing ESC closes modal (if no unsaved changes)

- [ ] **Modal Title**:
  - [ ] Displays "Create Proposal" when creating new proposal
  - [ ] Displays "Edit Proposal" when editing existing proposal

- [ ] **Title Field**:
  - [ ] Label: "Title"
  - [ ] Text input field
  - [ ] Pre-filled with existing title when editing (e.g., "EC Rewamp v0")
  - [ ] Required field
  - [ ] Validation: Cannot be empty
  - [ ] Placeholder: "Enter proposal title"

- [ ] **Documents Section**:
  - [ ] Section header: "■ Documents"
  - [ ] Large rectangular area with dashed border
  - [ ] Text displayed: "Click or Drag & Drop PDF here"
  - [ ] **File Upload Functionality**:
    - [ ] Clicking area opens file picker
    - [ ] Drag and drop PDF files into the area
    - [ ] Accepts only PDF files
    - [ ] File size validation (e.g., max 10MB)
    - [ ] Multiple files can be uploaded (if supported)
    - [ ] Uploaded files displayed as list with file names
    - [ ] Delete button for each uploaded file
    - [ ] File preview (optional enhancement)
  - [ ] **File Storage**:
    - [ ] Files uploaded to S3 or cloud storage
    - [ ] File links stored in proposal's attachments_manifest or link field
    - [ ] Files are associated with the proposal

- [ ] **Modal Action Buttons** (at bottom of modal):
  - [ ] **Cancel Button**:
    - [ ] Button labeled "Cancel"
    - [ ] Outlined button style
    - [ ] Clicking closes modal without saving
    - [ ] Shows confirmation if there are unsaved changes
  
  - [ ] **Draft Button**:
    - [ ] Button labeled "Draft"
    - [ ] Outlined button style
    - [ ] Clicking saves proposal as draft
    - [ ] Proposal status set to "draft"
    - [ ] Modal closes after saving
    - [ ] Success message displayed
    - [ ] Opportunity status updates to "Proposal Drafting" (if not already)
  
  - [ ] **Save Button**:
    - [ ] Button labeled "Save"
    - [ ] Outlined button style
    - [ ] Clicking saves proposal
    - [ ] If title is empty, shows validation error
    - [ ] Proposal is saved with current data
    - [ ] Modal closes after saving
    - [ ] Success message displayed
    - [ ] Opportunity status updates to "Proposal Drafting" (if not already)

- [ ] **Edit Restrictions**:
  - [ ] **Can Edit**: Proposal can be edited when:
    - [ ] No reviewer has been assigned yet
    - [ ] Reviewer has been assigned but proposal is still in draft state (not yet submitted)
  - [ ] **Cannot Edit**: Proposal cannot be edited when:
    - [ ] Reviewer has been assigned AND saved (proposal submitted for review)
    - [ ] Proposal status is "under review"
    - [ ] Proposal status is "sent to client"
    - [ ] Proposal has been approved
  - [ ] When proposal cannot be edited:
    - [ ] "Edit Proposal" button is disabled
    - [ ] Modal cannot be opened
    - [ ] User sees message: "Proposal cannot be edited after reviewer assignment"

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
    - [ ] Dropdown shows Sales Manager's email or identifier (optional)
  - [ ] **Current Selection**: Shows currently assigned reviewer (e.g., "Sale Manager 01")
  - [ ] **Editable State**:
    - [ ] Can be edited when proposal exists and no review has been submitted yet
    - [ ] Cannot be edited after review has been submitted
    - [ ] Cannot be edited if proposal has been sent to client
  - [ ] **Default Value**: Empty (no reviewer assigned) when proposal is first created
  - [ ] **Saving Reviewer Assignment**:
    - [ ] When reviewer is selected and saved:
      - [ ] Reviewer assignment is saved to proposal's reviewer_id field
      - [ ] Proposal status may change to "under review" (if applicable)
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
      - [ ] Other users: Field is disabled
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
      - [ ] Other users: Dropdown is disabled
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
          - [ ] "Request Revision" → Proposal status: "revision requested"
          - [ ] "Reject" → Proposal status: "rejected"
        - [ ] Updates opportunity status if needed
        - [ ] Shows success message
        - [ ] After submission, reviewer assignment and review fields become read-only
    - [ ] **Not Assigned Reviewer**: Button is disabled
      - [ ] Sales Manager who is not the assigned reviewer: Button is disabled
      - [ ] Sales Man: Button is disabled
      - [ ] Other users: Button is disabled
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

- [ ] **Role-Based Permissions Summary**:
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
    - [ ] Cannot assign reviewer (if that functionality is available)

#### 8. Action Buttons

- [ ] **Bottom Action Buttons**:
  - [ ] Buttons positioned at the bottom of the main content area
  - [ ] Buttons are aligned horizontally
  - [ ] Buttons have consistent styling (light grey with thin border)

- [ ] **Back Button**:
  - [ ] Button labeled "Back"
  - [ ] Positioned at bottom left
  - [ ] Light grey button with thin border
  - [ ] Clicking button:
    - [ ] Navigates back to opportunities list page (`/sales/opportunities`)
    - [ ] Shows confirmation dialog if there are unsaved changes
    - [ ] Discards unsaved changes if user confirms

- [ ] **Save Button**:
  - [ ] Button labeled "Save"
  - [ ] Positioned at bottom right (or center)
  - [ ] Light grey button with thin border
  - [ ] Clicking button:
    - [ ] Saves all opportunity information (Client's name, Client Company, Assignee, Probability, Est. Value)
    - [ ] Validates required fields (Client's name)
    - [ ] Shows validation errors if any
    - [ ] Shows success message after successful save
    - [ ] Shows error message if save fails
    - [ ] Page refreshes to show updated data
    - [ ] If creating new opportunity, redirects to opportunity detail page with opportunity ID

#### 9. Opportunity Status Logic

- [ ] **Status Update Rules**:
  - [ ] Status is automatically calculated and updated based on proposal state
  - [ ] Status cannot be manually edited by users (read-only field)
  - [ ] Status updates occur when:
    - [ ] Opportunity is created → Status: "New"
    - [ ] Proposal is created → Status: "Proposal Drafting"
    - [ ] Proposal status changes to "draft" or "internal review" → Status: "Proposal Drafting"
    - [ ] Proposal is sent to client → Status: "Proposal Sent"
    - [ ] Client requests revision → Status: "Revision"
    - [ ] Proposal is converted to contract → Status: "Won"
    - [ ] Opportunity is marked as lost → Status: "Lost"

- [ ] **Status Calculation Logic**:
  ```javascript
  // Pseudo-code for status calculation
  if (opportunity.markedAsLost) {
    status = "Lost";
  } else if (proposal && proposal.convertedToContract) {
    status = "Won";
  } else if (proposal && proposal.clientRequestedRevision) {
    status = "Revision";
  } else if (proposal && proposal.sentToClient) {
    status = "Proposal Sent";
  } else if (proposal && (proposal.status === "draft" || proposal.status === "internal review")) {
    status = "Proposal Drafting";
  } else {
    status = "New";
  }
  ```

- [ ] **Status Badge Colors**:
  - [ ] "New": Blue badge (`bg-blue-100 text-blue-800`)
  - [ ] "Proposal Drafting": Purple badge (`bg-purple-100 text-purple-800`)
  - [ ] "Proposal Sent": Yellow badge (`bg-yellow-100 text-yellow-800`)
  - [ ] "Revision": Pink badge (`bg-pink-100 text-pink-800`)
  - [ ] "Won": Green badge (`bg-green-100 text-green-800`)
  - [ ] "Lost": Gray badge (`bg-gray-100 text-gray-800`)

#### 10. Navigation Flow

- [ ] **From Contact Detail to Opportunity Create**:
  - [ ] User is on contact detail page (Story-20)
  - [ ] User clicks "Convert to Opportunity" button
  - [ ] System navigates to: `/sales/opportunities/new?contactId={contactId}`
  - [ ] Contact data is fetched and pre-populated
  - [ ] User can edit and save opportunity

- [ ] **From Opportunity List to Opportunity Detail**:
  - [ ] User is on opportunities list page (Story-21)
  - [ ] User clicks view icon (eye) on an opportunity
  - [ ] System navigates to: `/sales/opportunities/{opportunityId}`
  - [ ] Opportunity detail page loads with existing data

- [ ] **From Opportunity Detail to Opportunity List**:
  - [ ] User clicks "Back" button
  - [ ] System navigates to: `/sales/opportunities`
  - [ ] Opportunities list page loads

## Technical Requirements

### Frontend Requirements

```typescript
// Opportunity Detail Page Component Structure
interface OpportunityDetailPageProps {
  opportunityId?: string; // For edit mode
  contactId?: string; // For create mode from contact
}

interface Opportunity {
  id: number;
  opportunityId: string; // e.g., "OP-2025-01"
  contactId: number | null;
  clientName: string;
  clientCompany: string | null;
  clientEmail: string;
  assigneeUserId: number | null;
  assigneeName: string | null;
  probability: number; // 0-100
  estValue: number;
  currency: string; // e.g., "JPY"
  status: 'NEW' | 'PROPOSAL_DRAFTING' | 'PROPOSAL_SENT' | 'REVISION' | 'WON' | 'LOST';
  stage: 'New' | 'Proposal' | 'Won' | 'Lost';
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

interface Proposal {
  id: number;
  opportunityId: number;
  title: string;
  status: 'draft' | 'internal_review' | 'approved' | 'sent_to_client' | 'revision_requested' | 'rejected';
  reviewerId: number | null;
  reviewerName: string | null;
  reviewNotes: string | null;
  reviewAction: 'APPROVE' | 'REQUEST_REVISION' | 'REJECT' | null;
  reviewSubmittedAt: string | null;
  link: string | null; // S3 link to PDF
  attachmentsManifest: string | null; // JSON string of file metadata
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  canEdit: boolean; // Calculated: true if no reviewer assigned or reviewer not saved yet
}

interface CreateOpportunityRequest {
  contactId?: number;
  clientName: string;
  clientCompany?: string;
  clientEmail: string;
  assigneeUserId: number | null;
  probability: number;
  estValue: number;
  currency?: string;
}

interface UpdateOpportunityRequest {
  clientName?: string;
  clientCompany?: string;
  clientEmail?: string;
  assigneeUserId?: number | null;
  probability?: number;
  estValue?: number;
  currency?: string;
}

interface CreateProposalRequest {
  opportunityId: number;
  title: string;
  files?: File[]; // PDF files
}

interface UpdateProposalRequest {
  title?: string;
  files?: File[];
}

interface AssignReviewerRequest {
  proposalId: number;
  reviewerId: number; // Must be SALES_MANAGER role
}

interface SubmitReviewRequest {
  proposalId: number;
  reviewNotes: string;
  action: 'APPROVE' | 'REQUEST_REVISION' | 'REJECT';
}

interface SalesManager {
  id: number;
  fullName: string;
  email: string;
  role: 'SALES_MANAGER';
}

interface SalesMan {
  id: number;
  fullName: string;
  email: string;
  role: 'SALES_REP';
}
```

### Frontend Service Functions

```typescript
// Opportunity Service
export const opportunityService = {
  // Create opportunity from contact
  async createFromContact(contactId: number, data: CreateOpportunityRequest): Promise<Opportunity> {
    const response = await fetch(`/api/sales/opportunities/create-from-contact/${contactId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create opportunity');
    return response.json();
  },

  // Get opportunity by ID
  async getById(opportunityId: string): Promise<Opportunity & { proposal?: Proposal }> {
    const response = await fetch(`/api/sales/opportunities/${opportunityId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch opportunity');
    return response.json();
  },

  // Update opportunity
  async update(opportunityId: string, data: UpdateOpportunityRequest): Promise<Opportunity> {
    const response = await fetch(`/api/sales/opportunities/${opportunityId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update opportunity');
    return response.json();
  },

  // Get contact data for pre-population
  async getContactData(contactId: number): Promise<{
    clientName: string;
    clientCompany: string | null;
    assigneeUserId: number | null;
    assigneeName: string | null;
    clientEmail: string;
  }> {
    const response = await fetch(`/api/sales/contacts/${contactId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch contact data');
    const contact = await response.json();
    return {
      clientName: contact.clientName,
      clientCompany: contact.companyName,
      assigneeUserId: contact.assigneeUserId,
      assigneeName: contact.assigneeName,
      clientEmail: contact.email,
    };
  },
};

// Proposal Service
export const proposalService = {
  // Create proposal
  async create(opportunityId: number, data: CreateProposalRequest): Promise<Proposal> {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.files) {
      data.files.forEach((file) => {
        formData.append('files', file);
      });
    }

    const response = await fetch(`/api/sales/opportunities/${opportunityId}/proposals`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create proposal');
    return response.json();
  },

  // Update proposal
  async update(proposalId: number, data: UpdateProposalRequest): Promise<Proposal> {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.files) {
      data.files.forEach((file) => {
        formData.append('files', file);
      });
    }

    const response = await fetch(`/api/sales/proposals/${proposalId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update proposal');
    return response.json();
  },

  // Assign reviewer
  async assignReviewer(proposalId: number, reviewerId: number): Promise<Proposal> {
    const response = await fetch(`/api/sales/proposals/${proposalId}/assign-reviewer`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reviewerId }),
    });
    if (!response.ok) throw new Error('Failed to assign reviewer');
    return response.json();
  },

  // Submit review
  async submitReview(proposalId: number, data: SubmitReviewRequest): Promise<Proposal> {
    const response = await fetch(`/api/sales/proposals/${proposalId}/submit-review`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to submit review');
    return response.json();
  },
};

// User Service (for dropdowns)
export const userService = {
  // Get Sales Managers for reviewer dropdown
  async getSalesManagers(): Promise<SalesManager[]> {
    const response = await fetch('/api/sales/users?role=SALES_MANAGER', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch sales managers');
    return response.json();
  },

  // Get Sales Men for assignee dropdown
  async getSalesMen(): Promise<SalesMan[]> {
    const response = await fetch('/api/sales/users?role=SALES_REP', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch sales men');
    return response.json();
  },
};
```

### Backend Requirements

```java
// Sales Opportunity Controller
@RestController
@RequestMapping("/api/sales/opportunities")
@PreAuthorize("hasAnyRole('SALES_MANAGER', 'SALES_REP')")
public class SalesOpportunityController {
    
    @Autowired
    private SalesOpportunityService opportunityService;
    
    // Create opportunity from contact
    @PostMapping("/create-from-contact/{contactId}")
    public ResponseEntity<OpportunityDTO> createFromContact(
        @PathVariable Integer contactId,
        @RequestBody CreateOpportunityRequest request,
        Authentication authentication
    ) {
        User currentUser = getCurrentUser(authentication);
        OpportunityDTO opportunity = opportunityService.createFromContact(contactId, request, currentUser);
        return ResponseEntity.ok(opportunity);
    }
    
    // Get opportunity by ID
    @GetMapping("/{opportunityId}")
    public ResponseEntity<OpportunityDetailDTO> getOpportunityById(
        @PathVariable String opportunityId,
        Authentication authentication
    ) {
        User currentUser = getCurrentUser(authentication);
        OpportunityDetailDTO opportunity = opportunityService.getOpportunityById(opportunityId, currentUser);
        return ResponseEntity.ok(opportunity);
    }
    
    // Update opportunity
    @PutMapping("/{opportunityId}")
    public ResponseEntity<OpportunityDTO> updateOpportunity(
        @PathVariable String opportunityId,
        @RequestBody UpdateOpportunityRequest request,
        Authentication authentication
    ) {
        User currentUser = getCurrentUser(authentication);
        OpportunityDTO opportunity = opportunityService.updateOpportunity(opportunityId, request, currentUser);
        return ResponseEntity.ok(opportunity);
    }
    
    // Create proposal for opportunity
    @PostMapping("/{opportunityId}/proposals")
    public ResponseEntity<ProposalDTO> createProposal(
        @PathVariable String opportunityId,
        @RequestParam("title") String title,
        @RequestParam(value = "files", required = false) MultipartFile[] files,
        Authentication authentication
    ) {
        User currentUser = getCurrentUser(authentication);
        ProposalDTO proposal = opportunityService.createProposal(opportunityId, title, files, currentUser);
        return ResponseEntity.ok(proposal);
    }
}

// Sales Proposal Controller
@RestController
@RequestMapping("/api/sales/proposals")
@PreAuthorize("hasAnyRole('SALES_MANAGER', 'SALES_REP')")
public class SalesProposalController {
    
    @Autowired
    private ProposalService proposalService;
    
    // Update proposal
    @PutMapping("/{proposalId}")
    public ResponseEntity<ProposalDTO> updateProposal(
        @PathVariable Integer proposalId,
        @RequestParam(value = "title", required = false) String title,
        @RequestParam(value = "files", required = false) MultipartFile[] files,
        Authentication authentication
    ) {
        User currentUser = getCurrentUser(authentication);
        ProposalDTO proposal = proposalService.updateProposal(proposalId, title, files, currentUser);
        return ResponseEntity.ok(proposal);
    }
    
    // Assign reviewer
    @PostMapping("/{proposalId}/assign-reviewer")
    public ResponseEntity<ProposalDTO> assignReviewer(
        @PathVariable Integer proposalId,
        @RequestBody AssignReviewerRequest request,
        Authentication authentication
    ) {
        User currentUser = getCurrentUser(authentication);
        ProposalDTO proposal = proposalService.assignReviewer(proposalId, request.getReviewerId(), currentUser);
        return ResponseEntity.ok(proposal);
    }
    
    // Submit review
    @PostMapping("/{proposalId}/submit-review")
    public ResponseEntity<ProposalDTO> submitReview(
        @PathVariable Integer proposalId,
        @RequestBody SubmitReviewRequest request,
        Authentication authentication
    ) {
        User currentUser = getCurrentUser(authentication);
        ProposalDTO proposal = proposalService.submitReview(proposalId, request, currentUser);
        return ResponseEntity.ok(proposal);
    }
}

// Sales Opportunity Service
@Service
@Transactional
public class SalesOpportunityService {
    
    @Autowired
    private OpportunityRepository opportunityRepository;
    
    @Autowired
    private ContactRepository contactRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProposalRepository proposalRepository;
    
    @Autowired
    private S3Service s3Service;
    
    public OpportunityDTO createFromContact(Integer contactId, CreateOpportunityRequest request, User currentUser) {
        // Fetch contact data
        Contact contact = contactRepository.findById(contactId)
            .orElseThrow(() -> new EntityNotFoundException("Contact not found"));
        
        // Check authorization: Only assigned Sales Man can convert contact to opportunity
        if (currentUser.getRole() == SalesRole.SALES_REP) {
            if (contact.getAssigneeUserId() == null || 
                !contact.getAssigneeUserId().equals(currentUser.getId())) {
                throw new AccessDeniedException("Only assigned Sales Man can convert contact to opportunity");
            }
        }
        
        // Generate opportunity ID
        String opportunityId = generateOpportunityId();
        
        // Create opportunity entity
        Opportunity opportunity = new Opportunity();
        opportunity.setOpportunityId(opportunityId);
        opportunity.setContactId(contactId);
        opportunity.setClientName(request.getClientName());
        opportunity.setClientCompany(request.getClientCompany());
        opportunity.setClientEmail(request.getClientEmail());
        opportunity.setAssigneeUserId(request.getAssigneeUserId());
        opportunity.setProbability(request.getProbability());
        opportunity.setEstValue(request.getEstValue());
        opportunity.setCurrency(request.getCurrency() != null ? request.getCurrency() : "JPY");
        opportunity.setStatus("NEW");
        opportunity.setCreatedBy(currentUser.getId());
        
        opportunity = opportunityRepository.save(opportunity);
        
        // Update contact status to "Converted to Opportunity"
        contact.setStatus("ConvertedToOpportunity");
        contactRepository.save(contact);
        
        return convertToDTO(opportunity);
    }
    
    public OpportunityDetailDTO getOpportunityById(String opportunityId, User currentUser) {
        Opportunity opportunity = opportunityRepository.findByOpportunityId(opportunityId)
            .orElseThrow(() -> new EntityNotFoundException("Opportunity not found"));
        
        // Authorization check
        if (currentUser.getRole() == SalesRole.SALES_REP) {
            if (opportunity.getCreatedBy() == null || 
                !opportunity.getCreatedBy().equals(currentUser.getId())) {
                throw new AccessDeniedException("You can only view opportunities created by you");
            }
        }
        
        OpportunityDetailDTO dto = convertToDetailDTO(opportunity);
        
        // Load proposal if exists
        Optional<Proposal> proposalOpt = proposalRepository.findByOpportunityId(opportunity.getId());
        if (proposalOpt.isPresent()) {
            Proposal proposal = proposalOpt.get();
            ProposalDTO proposalDTO = convertProposalToDTO(proposal);
            
            // Calculate if proposal can be edited
            proposalDTO.setCanEdit(canEditProposal(proposal));
            
            dto.setProposal(proposalDTO);
        }
        
        return dto;
    }
    
    public OpportunityDTO updateOpportunity(String opportunityId, UpdateOpportunityRequest request, User currentUser) {
        Opportunity opportunity = opportunityRepository.findByOpportunityId(opportunityId)
            .orElseThrow(() -> new EntityNotFoundException("Opportunity not found"));
        
        // Authorization check
        if (currentUser.getRole() == SalesRole.SALES_REP) {
            if (opportunity.getCreatedBy() == null || 
                !opportunity.getCreatedBy().equals(currentUser.getId())) {
                throw new AccessDeniedException("You can only update opportunities created by you");
            }
        }
        
        // Update fields
        if (request.getClientName() != null) opportunity.setClientName(request.getClientName());
        if (request.getClientCompany() != null) opportunity.setClientCompany(request.getClientCompany());
        if (request.getClientEmail() != null) opportunity.setClientEmail(request.getClientEmail());
        if (request.getAssigneeUserId() != null) opportunity.setAssigneeUserId(request.getAssigneeUserId());
        if (request.getProbability() != null) opportunity.setProbability(request.getProbability());
        if (request.getEstValue() != null) opportunity.setEstValue(request.getEstValue());
        if (request.getCurrency() != null) opportunity.setCurrency(request.getCurrency());
        
        // Recalculate status based on proposal state
        opportunity.setStatus(calculateOpportunityStatus(opportunity));
        
        opportunity = opportunityRepository.save(opportunity);
        
        return convertToDTO(opportunity);
    }
    
    public ProposalDTO createProposal(String opportunityId, String title, MultipartFile[] files, User currentUser) {
        Opportunity opportunity = opportunityRepository.findByOpportunityId(opportunityId)
            .orElseThrow(() -> new EntityNotFoundException("Opportunity not found"));
        
        // Check if proposal already exists (only one proposal per opportunity)
        Optional<Proposal> existingProposal = proposalRepository.findByOpportunityId(opportunity.getId());
        if (existingProposal.isPresent()) {
            throw new IllegalStateException("Proposal already exists for this opportunity");
        }
        
        // Authorization check
        if (currentUser.getRole() == SalesRole.SALES_REP) {
            if (opportunity.getCreatedBy() == null || 
                !opportunity.getCreatedBy().equals(currentUser.getId())) {
                throw new AccessDeniedException("You can only create proposals for opportunities created by you");
            }
        }
        
        // Create proposal
        Proposal proposal = new Proposal();
        proposal.setOpportunityId(opportunity.getId());
        proposal.setTitle(title);
        proposal.setStatus("draft");
        proposal.setCreatedBy(currentUser.getId());
        
        // Upload files to S3
        if (files != null && files.length > 0) {
            List<String> fileLinks = new ArrayList<>();
            for (MultipartFile file : files) {
                if (!file.isEmpty() && file.getContentType().equals("application/pdf")) {
                    String fileLink = s3Service.uploadFile(file, "proposals");
                    fileLinks.add(fileLink);
                }
            }
            if (!fileLinks.isEmpty()) {
                proposal.setLink(fileLinks.get(0)); // Store first file link
                // Store all file links in attachments_manifest as JSON
                proposal.setAttachmentsManifest(new Gson().toJson(fileLinks));
            }
        }
        
        proposal = proposalRepository.save(proposal);
        
        // Update opportunity status
        opportunity.setStatus(calculateOpportunityStatus(opportunity));
        opportunityRepository.save(opportunity);
        
        ProposalDTO dto = convertProposalToDTO(proposal);
        dto.setCanEdit(true); // New proposal can be edited
        return dto;
    }
    
    private String calculateOpportunityStatus(Opportunity opportunity) {
        Optional<Proposal> proposalOpt = proposalRepository.findByOpportunityId(opportunity.getId());
        
        if (!proposalOpt.isPresent()) {
            return "NEW";
        }
        
        Proposal proposal = proposalOpt.get();
        String proposalStatus = proposal.getStatus();
        
        if (proposalStatus.equals("sent_to_client")) {
            return "PROPOSAL_SENT";
        } else if (proposalStatus.equals("revision_requested")) {
            return "REVISION";
        } else if (proposalStatus.equals("draft") || proposalStatus.equals("internal_review")) {
            return "PROPOSAL_DRAFTING";
        } else if (proposalStatus.equals("approved") && proposal.getConvertedToContract()) {
            return "WON";
        }
        
        return "NEW";
    }
    
    private String generateOpportunityId() {
        int year = LocalDate.now().getYear();
        long count = opportunityRepository.countByYear(year) + 1;
        return String.format("OP-%d-%02d", year, count);
    }
}

// Proposal Service
@Service
@Transactional
public class ProposalService {
    
    @Autowired
    private ProposalRepository proposalRepository;
    
    @Autowired
    private OpportunityRepository opportunityRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private S3Service s3Service;
    
    public ProposalDTO updateProposal(Integer proposalId, String title, MultipartFile[] files, User currentUser) {
        Proposal proposal = proposalRepository.findById(proposalId)
            .orElseThrow(() -> new EntityNotFoundException("Proposal not found"));
        
        // Check if proposal can be edited
        if (!canEditProposal(proposal)) {
            throw new IllegalStateException("Proposal cannot be edited after reviewer assignment");
        }
        
        // Authorization check
        Opportunity opportunity = opportunityRepository.findById(proposal.getOpportunityId())
            .orElseThrow(() -> new EntityNotFoundException("Opportunity not found"));
        
        if (currentUser.getRole() == SalesRole.SALES_REP) {
            if (opportunity.getCreatedBy() == null || 
                !opportunity.getCreatedBy().equals(currentUser.getId())) {
                throw new AccessDeniedException("You can only update proposals for opportunities created by you");
            }
        }
        
        // Update title
        if (title != null && !title.isEmpty()) {
            proposal.setTitle(title);
        }
        
        // Update files
        if (files != null && files.length > 0) {
            List<String> fileLinks = new ArrayList<>();
            for (MultipartFile file : files) {
                if (!file.isEmpty() && file.getContentType().equals("application/pdf")) {
                    String fileLink = s3Service.uploadFile(file, "proposals");
                    fileLinks.add(fileLink);
                }
            }
            if (!fileLinks.isEmpty()) {
                proposal.setLink(fileLinks.get(0));
                proposal.setAttachmentsManifest(new Gson().toJson(fileLinks));
            }
        }
        
        proposal = proposalRepository.save(proposal);
        
        // Update opportunity status
        opportunity.setStatus(calculateOpportunityStatus(opportunity));
        opportunityRepository.save(opportunity);
        
        ProposalDTO dto = convertProposalToDTO(proposal);
        dto.setCanEdit(canEditProposal(proposal));
        return dto;
    }
    
    public ProposalDTO assignReviewer(Integer proposalId, Integer reviewerId, User currentUser) {
        Proposal proposal = proposalRepository.findById(proposalId)
            .orElseThrow(() -> new EntityNotFoundException("Proposal not found"));
        
        // Verify reviewer is Sales Manager
        User reviewer = userRepository.findById(reviewerId)
            .orElseThrow(() -> new EntityNotFoundException("Reviewer not found"));
        
        if (reviewer.getRole() != SalesRole.SALES_MANAGER) {
            throw new IllegalArgumentException("Reviewer must be a Sales Manager");
        }
        
        // Assign reviewer
        proposal.setReviewerId(reviewerId);
        proposal.setStatus("internal_review");
        proposal = proposalRepository.save(proposal);
        
        // Update opportunity status
        Opportunity opportunity = opportunityRepository.findById(proposal.getOpportunityId())
            .orElseThrow(() -> new EntityNotFoundException("Opportunity not found"));
        opportunity.setStatus(calculateOpportunityStatus(opportunity));
        opportunityRepository.save(opportunity);
        
        ProposalDTO dto = convertProposalToDTO(proposal);
        dto.setCanEdit(false); // Cannot edit after reviewer assignment
        return dto;
    }
    
    public ProposalDTO submitReview(Integer proposalId, SubmitReviewRequest request, User currentUser) {
        Proposal proposal = proposalRepository.findById(proposalId)
            .orElseThrow(() -> new EntityNotFoundException("Proposal not found"));
        
        // Authorization: Only assigned reviewer can submit review
        if (proposal.getReviewerId() == null || 
            !proposal.getReviewerId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Only assigned reviewer can submit review");
        }
        
        // Update proposal with review
        proposal.setReviewNotes(request.getReviewNotes());
        proposal.setReviewAction(request.getAction().name());
        proposal.setReviewSubmittedAt(LocalDateTime.now());
        
        // Update proposal status based on action
        if (request.getAction() == ReviewAction.APPROVE) {
            proposal.setStatus("approved");
        } else if (request.getAction() == ReviewAction.REQUEST_REVISION) {
            proposal.setStatus("revision_requested");
        } else if (request.getAction() == ReviewAction.REJECT) {
            proposal.setStatus("rejected");
        }
        
        proposal = proposalRepository.save(proposal);
        
        // Update opportunity status
        Opportunity opportunity = opportunityRepository.findById(proposal.getOpportunityId())
            .orElseThrow(() -> new EntityNotFoundException("Opportunity not found"));
        opportunity.setStatus(calculateOpportunityStatus(opportunity));
        opportunityRepository.save(opportunity);
        
        ProposalDTO dto = convertProposalToDTO(proposal);
        dto.setCanEdit(false); // Cannot edit after review submission
        return dto;
    }
    
    private boolean canEditProposal(Proposal proposal) {
        // Can edit if no reviewer assigned, or reviewer assigned but not yet saved (draft state)
        return proposal.getReviewerId() == null || 
               (proposal.getStatus().equals("draft") && proposal.getReviewSubmittedAt() == null);
    }
    
    private String calculateOpportunityStatus(Opportunity opportunity) {
        // Same logic as in SalesOpportunityService
        // ... (implementation)
        return "NEW";
    }
}
```

### Database Schema

```sql
-- Opportunities table (updated from Story-21)
CREATE TABLE opportunities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    opportunity_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., "OP-2025-01"
    contact_id INT, -- Foreign key to contacts table (if converted from contact)
    est_value DECIMAL(15, 2) NOT NULL, -- Estimated value
    currency VARCHAR(10) DEFAULT 'JPY', -- Currency code (JPY, USD, etc.)
    probability INT DEFAULT 0, -- Percentage (0-100)
    client_email VARCHAR(255) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_company VARCHAR(255), -- Client company name
    status VARCHAR(32) DEFAULT 'NEW', -- NEW, PROPOSAL_DRAFTING, PROPOSAL_SENT, REVISION, WON, LOST
    assignee_user_id INT, -- Foreign key to users table (Sales Man assigned)
    created_by INT NOT NULL, -- Foreign key to users table (Sales Man who created this opportunity)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_opportunity_id (opportunity_id),
    INDEX idx_contact_id (contact_id),
    INDEX idx_status (status),
    INDEX idx_assignee_user_id (assignee_user_id),
    INDEX idx_created_by (created_by),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL,
    FOREIGN KEY (assignee_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Proposals table (updated)
CREATE TABLE proposals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    opportunity_id INT NOT NULL, -- Foreign key to opportunities table
    title VARCHAR(255) NOT NULL,
    status VARCHAR(32) DEFAULT 'draft', -- draft, internal_review, approved, sent_to_client, revision_requested, rejected
    reviewer_id INT, -- Foreign key to users table (Sales Manager assigned as reviewer)
    review_notes TEXT, -- Review notes from assigned reviewer
    review_action VARCHAR(32), -- APPROVE, REQUEST_REVISION, REJECT
    review_submitted_at TIMESTAMP, -- When review was submitted
    link VARCHAR(500), -- S3 link to PDF file (first file)
    attachments_manifest TEXT, -- JSON string containing array of file links
    created_by INT NOT NULL, -- Foreign key to users table (who created the proposal)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_opportunity_id (opportunity_id),
    INDEX idx_reviewer_id (reviewer_id),
    INDEX idx_status (status),
    INDEX idx_created_by (created_by),
    UNIQUE KEY unique_opportunity_proposal (opportunity_id), -- Only one proposal per opportunity
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Users table (existing, with role)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    full_name VARCHAR(255),
    role VARCHAR(32) DEFAULT 'CLIENT', -- CLIENT, SALES_MANAGER, SALES_REP, ADMIN
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role (role),
    INDEX idx_email (email)
);

-- Contacts table (existing, referenced in Story-20)
CREATE TABLE contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_name VARCHAR(255),
    company_name VARCHAR(255),
    email VARCHAR(255),
    assignee_user_id INT, -- Foreign key to users table
    status VARCHAR(32),
    -- ... other contact fields
    FOREIGN KEY (assignee_user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

## Implementation Guidelines

### Key Implementation Points

1. **Opportunity Status Calculation**:
   - Status is automatically calculated based on proposal state
   - Status updates occur when proposal is created, updated, or reviewed
   - Status is read-only in the UI

2. **One Proposal Per Opportunity**:
   - Database constraint: `UNIQUE KEY unique_opportunity_proposal (opportunity_id)`
   - Backend validation: Check if proposal exists before creating new one
   - Frontend: Replace "Create Proposal" button with "Edit Proposal" when proposal exists

3. **Proposal Edit Restrictions**:
   - Proposal can be edited if: `reviewer_id IS NULL` OR (`status = 'draft'` AND `review_submitted_at IS NULL`)
   - After reviewer is assigned and saved, proposal cannot be edited
   - Backend validates edit permissions before allowing updates

4. **Reviewer Assignment**:
   - Only users with role `SALES_MANAGER` can be assigned as reviewers
   - Backend validates reviewer role before assignment
   - Frontend filters dropdown to show only Sales Managers

5. **Review Submission**:
   - Only assigned reviewer can submit review
   - Backend validates that current user is the assigned reviewer
   - Review notes and action are saved together
   - Proposal status updates based on review action

6. **File Upload**:
   - Files are uploaded to S3 or cloud storage
   - Only PDF files are accepted
   - File links are stored in `link` (first file) and `attachments_manifest` (all files as JSON)
   - File size validation (e.g., max 10MB per file)

7. **Contact to Opportunity Conversion**:
   - Contact data is pre-populated when creating opportunity from contact
   - Contact status is updated to "ConvertedToOpportunity"
   - Authorization: Only assigned Sales Man can convert contact to opportunity

## Testing Requirements

### Unit Tests
- [ ] Opportunity creation from contact with data pre-population
- [ ] Opportunity update with field validation
- [ ] Opportunity status calculation based on proposal state
- [ ] Proposal creation (only one per opportunity)
- [ ] Proposal update with edit restrictions
- [ ] Reviewer assignment (only Sales Managers)
- [ ] Review submission (only assigned reviewer)
- [ ] File upload validation (PDF only, size limits)
- [ ] Role-based permission checks

### Integration Tests
- [ ] Create opportunity from contact API
- [ ] Get opportunity detail API with proposal
- [ ] Update opportunity API
- [ ] Create proposal API
- [ ] Update proposal API with edit restrictions
- [ ] Assign reviewer API with role validation
- [ ] Submit review API with authorization check
- [ ] File upload to S3 integration
- [ ] Opportunity status auto-update on proposal changes

### End-to-End Tests
- [ ] Convert contact to opportunity flow
- [ ] Create and edit proposal flow
- [ ] Assign reviewer and submit review flow
- [ ] Proposal edit restrictions after reviewer assignment
- [ ] Role-based access control (Sales Manager vs Sales Man)
- [ ] Opportunity status updates based on proposal state
- [ ] File upload and download flow
- [ ] Navigation between contact detail, opportunity list, and opportunity detail

## Performance Requirements

### Performance Metrics
- **Page Load Time**: < 2 seconds
- **Opportunity Creation**: < 1 second
- **Proposal Creation**: < 2 seconds (including file upload)
- **File Upload**: < 5 seconds per file (depending on file size)
- **Status Calculation**: < 100ms
- **Review Submission**: < 500ms

## Security Considerations

### Security Requirements
- [ ] Role-based access control enforced at API level
- [ ] Sales Man can only create/update opportunities they created
- [ ] Only assigned Sales Man can convert contact to opportunity
- [ ] Only assigned reviewer can submit review
- [ ] Reviewer must be Sales Manager (validated at backend)
- [ ] File upload validation (PDF only, size limits)
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection on all user inputs
- [ ] HTTPS required for all API requests
- [ ] File access control (S3 signed URLs or access control)

## Definition of Done

### Development Complete
- [ ] Opportunity create/detail page implemented matching wireframe
- [ ] Contact to opportunity conversion with data pre-population
- [ ] Proposal creation and edit functionality
- [ ] One proposal per opportunity enforced
- [ ] Proposal edit restrictions after reviewer assignment
- [ ] Reviewer assignment (only Sales Managers)
- [ ] Review submission (only assigned reviewer)
- [ ] Opportunity status auto-calculation based on proposal state
- [ ] File upload functionality (PDF only)
- [ ] Role-based permissions implemented
- [ ] Authorization checks on all operations
- [ ] Responsive design implemented

### Testing Complete
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] E2E tests written and passing
- [ ] Security tests completed
- [ ] Cross-browser testing completed
- [ ] Role-based access tested thoroughly
- [ ] File upload/download tested

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
- **AWS S3**: File storage (or alternative cloud storage)

### Internal Dependencies
- **Story-20**: Sales Contact Detail Management (for "Convert to Opportunity" button)
- **Story-21**: Sales Opportunities List Management (for navigation)
- **User Entity**: Existing user table with role field
- **Contact Entity**: Existing contact table
- **Opportunity Entity**: Opportunities table (from Story-21)
- **Proposal Entity**: Proposals table
- **AuthContext**: Authentication context for sales users

## Risks and Mitigation

### Technical Risks
- **File Upload Performance**: Large PDF files may slow down upload
  - *Mitigation*: Implement file size limits, progress indicators, async upload
- **Status Calculation Complexity**: Multiple proposal states may cause status calculation errors
  - *Mitigation*: Comprehensive unit tests, clear status calculation logic, logging
- **Edit Restriction Bypass**: Users may try to edit proposals after reviewer assignment
  - *Mitigation*: Enforce restrictions at both frontend and backend, database constraints
- **Concurrent Updates**: Multiple users editing same opportunity/proposal
  - *Mitigation*: Optimistic locking, version control, conflict resolution

### Business Risks
- **User Experience**: Complex workflow may confuse users
  - *Mitigation*: Clear UI, tooltips, user testing, help documentation
- **Data Integrity**: Proposal edit restrictions may be too strict or too lenient
  - *Mitigation*: User feedback, iterative improvements, clear business rules
- **Review Process Delays**: Reviewers may not submit reviews promptly
  - *Mitigation*: Notification system, reminders, escalation process (future enhancement)

---

**Story Status**: Draft  
**Assigned To**: Backend & Frontend Teams  
**Estimated Effort**: 21 Story Points  
**Target Sprint**: Sprint 6

