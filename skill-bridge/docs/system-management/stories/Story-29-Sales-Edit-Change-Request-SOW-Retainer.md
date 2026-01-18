# User Story: Sales Edit Change Request for SOW Retainer

## Story Information
- **Story ID**: Story-29
- **Title**: Sales Edit Change Request for SOW Retainer
- **Epic**: Sales Portal - Contract Management
- **Priority**: High
- **Story Points**: 34
- **Sprint**: Sprint 7
- **Status**: Draft
- **Dependencies**: Story-28 (Sales Create Change Request for SOW Retainer)

## User Story
**As a** Sales User (Sales Manager or Sales Rep)  
**I want to** edit and process change requests created by clients for Retainer SOW contracts  
**So that** I can adjust resources and billing details according to the client's change request requirements, preview changes before approval, and apply changes only to future periods without affecting historical data

## Background & Context

### Existing System
- **Entity Contract (Retainer)**: `sow_contracts` table
- **Engineer/Resource List**: `sow_engaged_engineers` table
- **Billing Details (Monthly Retainer)**: `retainer_billing_details` table
- **Change Request Entity**: `change_requests` table with fields:
  - `contract_id`
  - `type` (enum: RESOURCE_CHANGE, SCHEDULE_CHANGE, SCOPE_ADJUSTMENT)
  - `effective_start` (DATE)
  - `effective_until` (DATE, optional)
  - `client_description` (TEXT)
  - `status` (DRAFT / PENDING / APPROVED / REJECTED)

### Client-Side Flow
- Client creates CR from Client portal
- Client only provides:
  - CR Type
  - Basic description
  - Effective start date
  - Effective until date (optional)

### Sales-Side Flow (This Story)
- Sales receives CR from client
- Sales edits and adjusts:
  - Resources (engineers) for future periods
  - Billing details for future periods
- Sales previews changes before approval
- Sales approves/rejects CR

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] Sales can open the "Edit Change Request" form from the Change Requests list
- [ ] Form displays different sections based on CR type (RESOURCE_CHANGE, SCHEDULE_CHANGE, SCOPE_ADJUSTMENT)
- [ ] Sales can view current resources and billing details
- [ ] Sales can edit only future resources and billing (from effective_start onwards)
- [ ] Past data (before effective_start) is read-only
- [ ] Sales can preview changes before approval (Before/After view)
- [ ] Sales can save changes as draft
- [ ] Sales can approve CR (applies changes to contract)
- [ ] Sales can reject CR (does not apply changes)
- [ ] Changes are properly tracked and linked to CR

### General Rules for All CR Types

#### 1. Past Data Protection
- [ ] **Historical Billing Protection**:
  - [ ] Billing details with `billing_month < effective_start` are read-only
  - [ ] Cannot edit or delete historical billing records
  - [ ] Historical billing is displayed for reference only
  - [ ] Visual indicator (greyed out, lock icon) shows read-only status

- [ ] **Historical Resource Protection**:
  - [ ] Resources with `end_date < effective_start` are read-only
  - [ ] Cannot modify historical resource assignments
  - [ ] Historical resources are displayed for reference only
  - [ ] Visual indicator shows read-only status

#### 2. Future Data Editing
- [ ] **Effective Start Date Rule**:
  - [ ] All changes apply from `effective_start` date onwards
  - [ ] Changes do not affect data before `effective_start`
  - [ ] System validates that effective_start is not in the past (or handles past dates appropriately)

- [ ] **Change Tracking**:
  - [ ] All changes are linked to the CR ID
  - [ ] System maintains audit trail of what was changed
  - [ ] Changes can be traced back to the original CR

#### 3. Preview Before Approval
- [ ] **Before/After View**:
  - [ ] Displays current state (Before) vs proposed state (After)
  - [ ] Shows resource changes (added/removed/modified engineers)
  - [ ] Shows billing changes (modified amounts, new billing entries)
  - [ ] Highlights differences clearly
  - [ ] Summary of total impact (cost changes, resource changes)

#### 4. Approval Actions
- [ ] **Save Draft**:
  - [ ] Saves changes without applying to contract
  - [ ] CR status remains as DRAFT or PENDING
  - [ ] Changes are stored but not committed
  - [ ] Can continue editing later

- [ ] **Approve**:
  - [ ] Validates all required fields are filled
  - [ ] Applies changes to contract (resources and billing)
  - [ ] Updates CR status to APPROVED
  - [ ] Creates audit log entry
  - [ ] Sends notification to client (future enhancement)
  - [ ] Refreshes contract detail view

- [ ] **Reject**:
  - [ ] Updates CR status to REJECTED
  - [ ] Does not apply any changes to contract
  - [ ] Optionally allows adding rejection reason
  - [ ] Sends notification to client (future enhancement)

### Detailed Acceptance Criteria by CR Type

#### 1. TYPE: RESOURCE_CHANGE

##### 1.1. Resource Section
- [ ] **Current Resources Display**:
  - [ ] Shows all engineers currently assigned to the contract
  - [ ] Displays: Engineer Level, Start Date, End Date, Rating (%), Salary
  - [ ] Past engineers (end_date < effective_start) are shown as read-only
  - [ ] Future engineers (start_date >= effective_start) are editable

- [ ] **Add New Engineer**:
  - [ ] "+ Add Engineer" button is available
  - [ ] Clicking button adds new engineer row
  - [ ] New engineer's start_date defaults to effective_start
  - [ ] All fields are editable: Engineer Level, Start Date, End Date, Rating, Salary
  - [ ] Validation: End date > Start date, Rating 0-100%, Salary > 0

- [ ] **Remove Engineer**:
  - [ ] Remove button (X icon) available for engineers with start_date >= effective_start
  - [ ] Clicking remove sets engineer's end_date to effective_start - 1 day
  - [ ] Engineer is not deleted, just marked as ended
  - [ ] Confirmation dialog before removing (optional)

- [ ] **Modify Engineer**:
  - [ ] Can edit Engineer Level for future engineers
  - [ ] Can edit Rating (%) for future engineers
  - [ ] Can edit Salary for future engineers
  - [ ] Can extend end_date for future engineers
  - [ ] Cannot modify start_date if it's before effective_start
  - [ ] Changes only apply from effective_start onwards

##### 1.2. Billing Section
- [ ] **Current Billing Display**:
  - [ ] Shows monthly billing details in table format
  - [ ] Columns: Billing Month, Delivery Note, Amount
  - [ ] Billing months < effective_start are read-only (greyed out)
  - [ ] Billing months >= effective_start are editable

- [ ] **Edit Future Billing**:
  - [ ] Can edit amount for future billing months
  - [ ] Can edit delivery note for future billing months
  - [ ] System can auto-suggest amounts based on new resource configuration (optional)
  - [ ] Manual override is always available
  - [ ] Validation: Amount > 0

- [ ] **Add New Billing**:
  - [ ] Can add new billing entries for future months
  - [ ] New billing entries default to effective_start month
  - [ ] All fields are editable: Billing Month, Delivery Note, Amount

##### 1.3. Preview & Approval
- [ ] **Preview Changes**:
  - [ ] Shows resource changes: Added engineers, Removed engineers, Modified engineers
  - [ ] Shows billing changes: Modified amounts, New billing entries
  - [ ] Calculates total cost impact
  - [ ] Highlights differences clearly

- [ ] **Approve CR**:
  - [ ] Updates `sow_engaged_engineers` table with new/modified engineers
  - [ ] Updates `retainer_billing_details` table with modified billing
  - [ ] Links changes to CR ID (via `change_request_id` field)
  - [ ] Updates CR status to APPROVED
  - [ ] Creates history entry

#### 2. TYPE: SCHEDULE_CHANGE

##### 2.1. Contract Period Adjustment
- [ ] **Current Contract Period**:
  - [ ] Displays current contract start_date and end_date
  - [ ] Displays current effective_start and effective_until from CR

- [ ] **Edit End Date**:
  - [ ] Input field for new_end_date
  - [ ] Validation: new_end_date > effective_start
  - [ ] Validation: new_end_date > current date (or allow past dates with warning)
  - [ ] Can extend or shorten contract period

##### 2.2. Billing Adjustment
- [ ] **Current Billing Display**:
  - [ ] Shows all billing details in chronological order
  - [ ] Billing months < effective_start or < today are read-only
  - [ ] Billing months between effective_start and new_end_date are editable
  - [ ] Billing months > new_end_date are marked for removal

- [ ] **Extend Contract**:
  - [ ] System suggests new billing months from current_end_date to new_end_date
  - [ ] Sales can add billing entries for new months
  - [ ] Sales can set amount for each new month
  - [ ] Sales can edit existing future billing amounts

- [ ] **Shorten Contract**:
  - [ ] Billing months > new_end_date are marked for cancellation
  - [ ] Visual indicator shows which billing entries will be removed
  - [ ] Confirmation dialog before removing billing entries
  - [ ] Billing entries are not deleted, but marked as cancelled or end_date is updated

##### 2.3. Resource Adjustment
- [ ] **Engineer End Dates**:
  - [ ] Engineers with end_date > new_end_date are automatically adjusted
  - [ ] System suggests setting engineer end_date to new_end_date
  - [ ] Sales can review and confirm engineer end date changes
  - [ ] Sales can manually adjust individual engineer end dates

##### 2.4. Preview & Approval
- [ ] **Preview Changes**:
  - [ ] Shows contract period change (Before → After)
  - [ ] Shows billing changes (added/removed/modified months)
  - [ ] Shows resource changes (engineer end date adjustments)
  - [ ] Calculates total impact

- [ ] **Approve CR**:
  - [ ] Updates `sow_contracts.effective_end` to new_end_date
  - [ ] Updates `retainer_billing_details` (adds new, cancels future beyond new_end_date)
  - [ ] Updates `sow_engaged_engineers.end_date` for affected engineers
  - [ ] Links changes to CR ID
  - [ ] Updates CR status to APPROVED

#### 3. TYPE: SCOPE_ADJUSTMENT

##### 3.1. Scope Description
- [ ] **Description Field**:
  - [ ] Textarea for describing scope addition/reduction
  - [ ] Field is pre-filled with client_description from CR
  - [ ] Sales can edit description
  - [ ] Field is required

##### 3.2. Amount & Billing Date
- [ ] **Amount Field**:
  - [ ] Input field for adjustment amount
  - [ ] Positive value: additional charge
  - [ ] Negative value: credit/reduction
  - [ ] Currency format with ¥ symbol
  - [ ] Validation: Amount != 0

- [ ] **Billing Date Field**:
  - [ ] Date picker for billing_date (month/year)
  - [ ] Defaults to effective_start month
  - [ ] Can select any future month
  - [ ] Validation: billing_date >= effective_start

##### 3.3. Resource Section
- [ ] **Resource Display**:
  - [ ] Shows current resources (read-only)
  - [ ] Cannot add/remove/modify engineers
  - [ ] Resources are displayed for reference only

##### 3.4. Preview & Approval
- [ ] **Preview Changes**:
  - [ ] Shows scope description
  - [ ] Shows adjustment amount (positive/negative)
  - [ ] Shows billing date
  - [ ] Shows impact on total contract value

- [ ] **Approve CR**:
  - [ ] Creates new billing detail entry in `retainer_billing_details`:
    - [ ] `billing_month` = selected billing_date
    - [ ] `delivery_note` = "Scope adjustment – {CR_ID}" or custom description
    - [ ] `amount` = adjustment amount (positive or negative)
    - [ ] `change_request_id` = CR ID
    - [ ] `source_type` = 'SCOPE_ADJUSTMENT'
    - [ ] `delivery_item_id` = NULL (not from original delivery items)
  - [ ] Updates CR status to APPROVED
  - [ ] Creates history entry

### UI/UX Requirements

#### 1. Form Layout
- [ ] **Header Section**:
  - [ ] CR ID displayed (e.g., "CR-2025-01")
  - [ ] CR Type badge/indicator
  - [ ] Current status badge
  - [ ] Client description (read-only, from original CR)

- [ ] **Effective Period Section**:
  - [ ] Effective Start Date (read-only, from CR)
  - [ ] Effective Until Date (read-only or editable based on CR type)
  - [ ] Visual indicator showing which periods are editable

- [ ] **Type-Specific Sections**:
  - [ ] Resource section (for RESOURCE_CHANGE)
  - [ ] Billing section (for all types)
  - [ ] Scope adjustment section (for SCOPE_ADJUSTMENT)
  - [ ] Schedule adjustment section (for SCHEDULE_CHANGE)

- [ ] **Preview Section**:
  - [ ] Collapsible "Preview Changes" section
  - [ ] Before/After comparison view
  - [ ] Summary of changes
  - [ ] Total impact calculation

- [ ] **Action Buttons**:
  - [ ] "Save Draft" button (grey/outline)
  - [ ] "Approve" button (blue/primary)
  - [ ] "Reject" button (red/danger)
  - [ ] "Cancel" button (grey/outline)

#### 2. Visual Indicators
- [ ] **Read-Only Fields**:
  - [ ] Greyed out background
  - [ ] Lock icon indicator
  - [ ] Tooltip: "This data is in the past and cannot be modified"

- [ ] **Editable Fields**:
  - [ ] Normal background
  - [ ] Highlight on hover
  - [ ] Clear visual distinction from read-only

- [ ] **Changes Indicator**:
  - [ ] Asterisk (*) or dot indicator for modified fields
  - [ ] Color coding (e.g., green for additions, red for removals, yellow for modifications)

#### 3. Validation & Error Handling
- [ ] **Real-time Validation**:
  - [ ] Field-level validation as user types
  - [ ] Error messages displayed below fields
  - [ ] Red border for invalid fields

- [ ] **Submit Validation**:
  - [ ] Validates all required fields before save/approve
  - [ ] Validates date ranges
  - [ ] Validates numeric ranges
  - [ ] Shows summary of all errors
  - [ ] Scrolls to first error field

- [ ] **Error Messages**:
  - [ ] Clear, user-friendly error messages
  - [ ] Specific to each field
  - [ ] Actionable (tells user how to fix)

#### 4. Loading States
- [ ] **Loading Indicators**:
  - [ ] Spinner when loading contract data
  - [ ] Disable form during save/approve operations
  - [ ] Progress indicator for long operations

- [ ] **Success/Error Messages**:
  - [ ] Toast notification on successful save
  - [ ] Toast notification on successful approve
  - [ ] Error toast on failure
  - [ ] Messages auto-dismiss after 5 seconds

## Technical Requirements

### Backend API Endpoints

#### 1. GET /api/sales/contracts/sow/{sowContractId}/change-requests/{changeRequestId}
- [ ] Returns change request detail with current contract data
- [ ] Includes:
  - [ ] CR information (type, status, effective dates, client description)
  - [ ] Current resources (sow_engaged_engineers)
  - [ ] Current billing details (retainer_billing_details)
  - [ ] Contract period information
- [ ] Returns 404 if CR not found
- [ ] Returns 403 if user doesn't have access

#### 2. PUT /api/sales/contracts/sow/{sowContractId}/change-requests/{changeRequestId}
- [ ] Updates change request with Sales edits
- [ ] Accepts multipart/form-data for file uploads (if needed)
- [ ] Request body structure varies by CR type:
  - [ ] **RESOURCE_CHANGE**: `engagedEngineers`, `billingDetails`
  - [ ] **SCHEDULE_CHANGE**: `newEndDate`, `billingDetails`, `engineerEndDates`
  - [ ] **SCOPE_ADJUSTMENT**: `description`, `amount`, `billingDate`
- [ ] Validates that effective_start is respected (no past data changes)
- [ ] Saves changes as draft (does not apply to contract)
- [ ] Returns updated CR DTO
- [ ] Returns 400 if validation fails
- [ ] Returns 403 if user doesn't have access

#### 3. POST /api/sales/contracts/sow/{sowContractId}/change-requests/{changeRequestId}/approve
- [ ] Approves change request and applies changes to contract
- [ ] Request body: `{ "reviewNotes": "optional notes" }`
- [ ] Validates all required fields are filled
- [ ] Applies changes based on CR type:
  - [ ] **RESOURCE_CHANGE**: Updates sow_engaged_engineers and retainer_billing_details
  - [ ] **SCHEDULE_CHANGE**: Updates contract end_date, billing, and engineer end_dates
  - [ ] **SCOPE_ADJUSTMENT**: Creates new billing detail entry
- [ ] Links all changes to CR ID
- [ ] Updates CR status to APPROVED
- [ ] Creates audit log entry
- [ ] Returns success response
- [ ] Returns 400 if validation fails
- [ ] Returns 403 if user doesn't have access

#### 4. POST /api/sales/contracts/sow/{sowContractId}/change-requests/{changeRequestId}/reject
- [ ] Rejects change request without applying changes
- [ ] Request body: `{ "reason": "rejection reason" }`
- [ ] Updates CR status to REJECTED
- [ ] Does not modify contract data
- [ ] Returns success response
- [ ] Returns 403 if user doesn't have access

#### 5. GET /api/sales/contracts/sow/{sowContractId}/change-requests/{changeRequestId}/preview
- [ ] Returns preview of changes (Before/After comparison)
- [ ] Calculates impact summary
- [ ] Returns structured data for UI rendering
- [ ] Returns 404 if CR not found

### Frontend Components

#### 1. EditChangeRequestModal Component
- [ ] Main modal component for editing CR
- [ ] Handles form state management
- [ ] Handles type-specific form rendering
- [ ] Handles validation
- [ ] Handles save/approve/reject actions
- [ ] Handles error display

#### 2. ResourceEditor Component
- [ ] Displays current resources
- [ ] Handles add/remove/modify engineers
- [ ] Enforces read-only for past data
- [ ] Validates resource fields
- [ ] Used for RESOURCE_CHANGE type

#### 3. BillingEditor Component
- [ ] Displays current billing details
- [ ] Handles edit/add/remove billing entries
- [ ] Enforces read-only for past billing
- [ ] Validates billing fields
- [ ] Used for all CR types

#### 4. ScheduleEditor Component
- [ ] Displays contract period
- [ ] Handles end date editing
- [ ] Handles billing adjustment for schedule changes
- [ ] Used for SCHEDULE_CHANGE type

#### 5. ScopeAdjustmentEditor Component
- [ ] Displays scope description field
- [ ] Handles amount input (positive/negative)
- [ ] Handles billing date selection
- [ ] Used for SCOPE_ADJUSTMENT type

#### 6. PreviewChanges Component
- [ ] Displays Before/After comparison
- [ ] Shows resource changes
- [ ] Shows billing changes
- [ ] Calculates and displays impact summary
- [ ] Collapsible/expandable section

### Data Models

#### 1. EditChangeRequestFormData Interface
```typescript
interface EditChangeRequestFormData {
  // Common fields
  description?: string; // For SCOPE_ADJUSTMENT
  
  // RESOURCE_CHANGE
  engagedEngineers?: Array<{
    id?: number; // Existing engineer ID (if modifying)
    engineerLevel: string;
    startDate: string; // Format: YYYY-MM-DD
    endDate: string; // Format: YYYY-MM-DD
    rating: number; // Percentage (0-100)
    salary: number; // Currency amount
    action?: 'add' | 'modify' | 'remove'; // For tracking changes
  }>;
  
  // SCHEDULE_CHANGE
  newEndDate?: string; // Format: YYYY-MM-DD
  engineerEndDates?: Array<{
    engineerId: number;
    newEndDate: string; // Format: YYYY-MM-DD
  }>;
  
  // SCOPE_ADJUSTMENT
  amount?: number; // Positive or negative
  billingDate?: string; // Format: YYYY-MM-DD
  
  // Common billing
  billingDetails?: Array<{
    id?: number; // Existing billing ID (if modifying)
    billingMonth: string; // Format: YYYY-MM-DD
    deliveryNote: string;
    amount: number; // Currency amount
    action?: 'add' | 'modify' | 'remove'; // For tracking changes
  }>;
}
```

#### 2. PreviewChangesResponse Interface
```typescript
interface PreviewChangesResponse {
  resources: {
    before: Array<Engineer>;
    after: Array<Engineer>;
    changes: Array<{
      type: 'add' | 'remove' | 'modify';
      engineer: Engineer;
      changes?: {
        field: string;
        before: any;
        after: any;
      }[];
    }>;
  };
  billing: {
    before: Array<BillingDetail>;
    after: Array<BillingDetail>;
    changes: Array<{
      type: 'add' | 'remove' | 'modify';
      billing: BillingDetail;
      changes?: {
        field: string;
        before: any;
        after: any;
      }[];
    }>;
  };
  impact: {
    totalCostChange: number;
    resourceCountChange: number;
    billingCountChange: number;
  };
}
```

### Database Schema Updates

#### 1. change_requests table (already exists)
- [ ] Verify all required fields exist
- [ ] `type` field supports new enum values
- [ ] `effective_start` and `effective_until` fields exist

#### 2. sow_engaged_engineers table (already exists)
- [ ] `change_request_id` field exists (nullable, for tracking)
- [ ] Foreign key to `change_requests` table (optional)

#### 3. retainer_billing_details table (already exists)
- [ ] `change_request_id` field exists (nullable, for tracking)
- [ ] `source_type` field exists (enum: 'DELIVERY_ITEM', 'SCOPE_ADJUSTMENT', etc.)
- [ ] Foreign key to `change_requests` table (optional)
- [ ] `cancelled` or `status` field for marking cancelled billing (for SCHEDULE_CHANGE)

#### 4. contract_history table (if exists)
- [ ] Supports logging CR approval events
- [ ] Links to change_request_id

### Business Logic

#### 1. Past Data Protection
- [ ] **Validation Rule**:
  - [ ] Check `billing_month < effective_start` → read-only
  - [ ] Check `engineer.end_date < effective_start` → read-only
  - [ ] Prevent API from accepting changes to past data
  - [ ] Return 400 error if past data modification attempted

#### 2. Change Application Logic
- [ ] **RESOURCE_CHANGE**:
  - [ ] For new engineers: Insert into `sow_engaged_engineers` with `change_request_id`
  - [ ] For modified engineers: Update existing records, set `change_request_id`
  - [ ] For removed engineers: Update `end_date` to `effective_start - 1 day`, set `change_request_id`
  - [ ] Update billing details: Update amounts for future months, set `change_request_id`

- [ ] **SCHEDULE_CHANGE**:
  - [ ] Update `sow_contracts.effective_end` to `new_end_date`
  - [ ] Update `sow_engaged_engineers.end_date` for engineers with `end_date > new_end_date`
  - [ ] Cancel billing entries with `billing_month > new_end_date` (set status or mark cancelled)
  - [ ] Add new billing entries for months between current_end and new_end_date
  - [ ] Set `change_request_id` on all modified/added records

- [ ] **SCOPE_ADJUSTMENT**:
  - [ ] Create new entry in `retainer_billing_details`:
    - [ ] `billing_month` = selected billing_date
    - [ ] `delivery_note` = "Scope adjustment – {CR_ID}"
    - [ ] `amount` = adjustment amount
    - [ ] `change_request_id` = CR ID
    - [ ] `source_type` = 'SCOPE_ADJUSTMENT'
    - [ ] `delivery_item_id` = NULL

#### 3. Preview Calculation
- [ ] **Before State**:
  - [ ] Load current resources and billing from database
  - [ ] Filter to show only data from `effective_start` onwards

- [ ] **After State**:
  - [ ] Apply proposed changes to before state
  - [ ] Calculate new resource list
  - [ ] Calculate new billing list
  - [ ] Calculate total cost impact

- [ ] **Change Detection**:
  - [ ] Compare before and after states
  - [ ] Identify added resources/billing
  - [ ] Identify removed resources/billing
  - [ ] Identify modified resources/billing
  - [ ] Calculate field-level changes

### Testing Requirements

#### 1. Unit Tests
- [ ] Test past data protection logic
- [ ] Test change application logic for each CR type
- [ ] Test preview calculation logic
- [ ] Test validation rules
- [ ] Test date range validation

#### 2. Integration Tests
- [ ] Test GET change request detail endpoint
- [ ] Test PUT update change request endpoint
- [ ] Test POST approve change request endpoint
- [ ] Test POST reject change request endpoint
- [ ] Test GET preview changes endpoint
- [ ] Test past data protection at API level
- [ ] Test change application for each CR type
- [ ] Test role-based access control

#### 3. E2E Tests
- [ ] Test opening edit CR form
- [ ] Test editing resources (add/remove/modify)
- [ ] Test editing billing (add/remove/modify)
- [ ] Test past data is read-only
- [ ] Test preview changes view
- [ ] Test save draft functionality
- [ ] Test approve functionality
- [ ] Test reject functionality
- [ ] Test validation errors
- [ ] Test each CR type flow

## Dependencies
- Story-28: Sales Create Change Request for SOW Retainer (CR creation flow must exist)
- Story-27: Sales List Change Requests for SOW (CR list must exist)
- Story-26: Sales Create SOW (SOW contract must exist)
- Client-side CR creation flow (CRs must be created by clients first)

## Notes
- This story focuses on editing CRs created by clients, not creating new CRs
- All changes must respect the `effective_start` date (no past data modification)
- Preview functionality is critical for Sales to review changes before approval
- Changes are tracked via `change_request_id` for audit purposes
- Future enhancements: Auto-calculation for billing based on resource changes, PDF generation for CR approval

