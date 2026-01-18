# User Story: Sales List Change Requests for SOW

## Story Information
- **Story ID**: Story-27
- **Title**: Sales List Change Requests for SOW
- **Epic**: Sales Portal - Contract Management
- **Priority**: High
- **Story Points**: 8
- **Sprint**: Sprint 6
- **Status**: Draft

## User Story
**As a** Sales User (Sales Manager or Sales Man)  
**I want to** view a list of change requests for a specific SOW contract in the Change Requests tab  
**So that** I can track all change requests, monitor their status, costs, and effective dates, and manage change request workflows effectively

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] I can view a list of change requests in the "Change Requests" tab of the SOW contract detail page
- [ ] The list displays all change requests associated with the current SOW contract
- [ ] I can see key information for each change request in a table format
- [ ] I can click the view icon to navigate to change request detail page
- [ ] I can see a "+ New Change Request" button to create new change requests
- [ ] The table matches the wireframe design exactly
- [ ] Pagination is implemented for large lists

### Detailed Acceptance Criteria

#### 1. Change Requests Tab Location

- [ ] **Tab Navigation**:
  - [ ] "Change Requests" tab is displayed alongside "Contract Info" tab in the SOW contract detail page
  - [ ] Tab is clickable and switches content when clicked
  - [ ] Tab is visually distinct when active (highlighted state)
  - [ ] Tab maintains state when switching between tabs

#### 2. Change Requests Tab Header

- [ ] **Header Section**:
  - [ ] Tab header displays "Change Requests" title
  - [ ] "+ New Change Request" button is displayed in the top-right corner of the tab header
  - [ ] Button has blue border and text (border-blue-600 text-blue-600)
  - [ ] Button includes a Plus icon on the left
  - [ ] Button is clickable and opens the create change request modal/page (future story)
  - [ ] Button is visible to both Sales Manager and Sales Man

#### 3. Change Requests Table

- [ ] **Table Structure**:
  - [ ] Table has clear borders and spacing
  - [ ] Table headers: CR ID, Type, Summary, Effective from, Effective until, Expected Extra Cost, Cost Estimated by Landbridge, Status, Action
  - [ ] All columns are properly aligned
  - [ ] Table is scrollable horizontally if content exceeds viewport width
  - [ ] Table rows have hover states
  - [ ] Table has alternating row colors for better readability
  - [ ] Table displays empty state message when no change requests exist

- [ ] **CR ID Column**:
  - [ ] Displays change request ID in format "CR-YYYY-NN" (e.g., "CR-2025-01")
  - [ ] Text is left-aligned
  - [ ] ID is clickable and navigates to change request detail page (future story)

- [ ] **Type Column**:
  - [ ] Displays change request type (e.g., "Extend Schedule", "Rate Change", "Add Scope", "Remove Scope", "Other")
  - [ ] Text is left-aligned
  - [ ] Type values match the contract engagement type (Fixed Price vs Retainer)

- [ ] **Summary Column**:
  - [ ] Displays change request summary/title
  - [ ] Text is left-aligned
  - [ ] Long summaries are truncated with ellipsis (...) and show full text on hover (optional)
  - [ ] Maximum display length: 50 characters (truncated)

- [ ] **Effective from Column**:
  - [ ] Displays effective start date in format "YYYY-MM-DD" or "MM/DD/YYYY"
  - [ ] Shows "-" (dash) if date is not set
  - [ ] Text is left-aligned
  - [ ] Date is formatted consistently

- [ ] **Effective until Column**:
  - [ ] Displays effective end date in format "YYYY-MM-DD" or "MM/DD/YYYY"
  - [ ] Shows "-" (dash) if date is not set
  - [ ] Text is left-aligned
  - [ ] Date is formatted consistently

- [ ] **Expected Extra Cost Column**:
  - [ ] Displays expected extra cost in currency format with "¥" symbol
  - [ ] Format: "¥XXX,XXX" (e.g., "¥300,000")
  - [ ] Shows "-" (dash) if cost is not set or zero
  - [ ] Text is right-aligned
  - [ ] Numbers are formatted with thousand separators

- [ ] **Cost Estimated by Landbridge Column**:
  - [ ] Displays cost estimated by LandBridge in currency format with "¥" symbol
  - [ ] Format: "¥XXX,XXX" (e.g., "¥320,000")
  - [ ] Shows "-" (dash) if cost is not set or zero
  - [ ] Text is right-aligned
  - [ ] Numbers are formatted with thousand separators

- [ ] **Status Column**:
  - [ ] Displays change request status with colored badge
  - [ ] Status values: "Draft", "Pending", "Processing", "Under Review", "Approved", "Request for Change", "Active", "Terminated", "Rejected"
  - [ ] Status badge colors:
    - [ ] "Draft": Gray background (bg-gray-100 text-gray-800)
    - [ ] "Pending": Yellow background (bg-yellow-100 text-yellow-800)
    - [ ] "Processing": Blue background (bg-blue-100 text-blue-800)
    - [ ] "Under Review": Blue background (bg-blue-100 text-blue-800)
    - [ ] "Approved": Green background (bg-green-100 text-green-800)
    - [ ] "Request for Change": Orange background (bg-orange-100 text-orange-800)
    - [ ] "Active": Green background (bg-green-100 text-green-800)
    - [ ] "Terminated": Gray background (bg-gray-100 text-gray-800)
    - [ ] "Rejected": Red background (bg-red-100 text-red-800)
  - [ ] Badge has rounded corners and appropriate padding
  - [ ] Status text is centered within badge

- [ ] **Action Column**:
  - [ ] Displays an eye icon (view icon) for each row
  - [ ] Icon is clickable
  - [ ] Clicking icon navigates to change request detail page (future story)
  - [ ] Icon has hover state (changes color or shows tooltip)
  - [ ] Icon is centered in the column

#### 4. Table Data Loading

- [ ] **Data Fetching**:
  - [ ] Change requests are loaded when the "Change Requests" tab is opened
  - [ ] Only change requests for the current SOW contract are displayed
  - [ ] Data is fetched from the backend API endpoint
  - [ ] Loading state is displayed while fetching data
  - [ ] Error message is displayed if data fetch fails

- [ ] **Data Filtering**:
  - [ ] Change requests are filtered by `sow_contract_id` matching the current SOW contract ID
  - [ ] Only change requests with `contract_type = "SOW"` are displayed
  - [ ] Filtering is done on the backend

- [ ] **Data Sorting**:
  - [ ] Change requests are sorted by creation date (newest first) by default
  - [ ] Sorting can be changed by clicking column headers (optional, future enhancement)

#### 5. Pagination

- [ ] **Pagination Controls**:
  - [ ] Pagination is displayed below the table when there are more than 10 change requests
  - [ ] Default page size: 10 change requests per page
  - [ ] Pagination shows page numbers (e.g., "1 2 3 4 5")
  - [ ] Current page is highlighted/selected
  - [ ] Previous/Next buttons are available (optional)
  - [ ] Clicking a page number loads that page's data
  - [ ] Pagination state is maintained when switching tabs

- [ ] **Pagination Display**:
  - [ ] Page numbers are displayed as clickable buttons
  - [ ] Current page has distinct styling (e.g., blue background)
  - [ ] Disabled state for Previous button on first page
  - [ ] Disabled state for Next button on last page
  - [ ] Total number of pages is calculated correctly

#### 6. Empty State

- [ ] **No Change Requests**:
  - [ ] When no change requests exist, display a message: "No change requests found for this SOW contract"
  - [ ] Message is centered in the table area
  - [ ] "+ New Change Request" button is still visible and functional
  - [ ] Empty state has appropriate styling (gray text, centered)

#### 7. Role-Based Access

- [ ] **Sales Manager**:
  - [ ] Can view all change requests for any SOW contract
  - [ ] Can see all columns and actions
  - [ ] Can create new change requests

- [ ] **Sales Man (Sales Rep)**:
  - [ ] Can view change requests only for SOW contracts assigned to themselves
  - [ ] Can see all columns and actions
  - [ ] Can create new change requests for assigned SOW contracts

#### 8. Responsive Design

- [ ] **Mobile View**:
  - [ ] Table is scrollable horizontally on small screens
  - [ ] Columns are appropriately sized for mobile
  - [ ] Pagination controls are accessible on mobile
  - [ ] "+ New Change Request" button is visible and accessible on mobile

- [ ] **Tablet View**:
  - [ ] Table displays all columns with appropriate spacing
  - [ ] Pagination is fully functional
  - [ ] Layout adapts to tablet screen size

#### 9. Performance

- [ ] **Loading Performance**:
  - [ ] Change requests list loads within 2 seconds
  - [ ] Pagination loads data efficiently (only current page data)
  - [ ] No unnecessary API calls when switching tabs

- [ ] **Data Caching**:
  - [ ] Change requests data is cached when tab is first loaded
  - [ ] Data is refreshed when returning to the tab (optional)
  - [ ] Cache is invalidated when a new change request is created (future story)

## Technical Requirements

### Backend API Endpoints

- [ ] **GET /api/sales/contracts/sow/{sowContractId}/change-requests**:
  - [ ] Returns list of change requests for the specified SOW contract
  - [ ] Supports pagination with query parameters: `page` (default: 0), `size` (default: 10)
  - [ ] Returns data in format:
    ```json
    {
      "content": [
        {
          "id": 1,
          "changeRequestId": "CR-2025-01",
          "type": "Extend Schedule",
          "summary": "Extend Retainer Period",
          "effectiveFrom": "2025-02-01",
          "effectiveUntil": "2025-03-31",
          "expectedExtraCost": 300000.00,
          "costEstimatedByLandbridge": 320000.00,
          "status": "Draft"
        }
      ],
      "totalElements": 2,
      "totalPages": 1,
      "currentPage": 0,
      "pageSize": 10
    }
    ```
  - [ ] Implements role-based filtering (Sales Rep sees only assigned contracts)
  - [ ] Returns 403 Forbidden if user doesn't have access to the SOW contract
  - [ ] Returns 404 Not Found if SOW contract doesn't exist

### Frontend Components

- [ ] **ChangeRequestsList Component**:
  - [ ] Displays table with change requests data
  - [ ] Handles pagination
  - [ ] Handles empty state
  - [ ] Handles loading state
  - [ ] Handles error state
  - [ ] Implements view navigation

- [ ] **ChangeRequestTable Component**:
  - [ ] Renders table with all columns
  - [ ] Formats currency values
  - [ ] Formats dates
  - [ ] Displays status badges
  - [ ] Handles row click/view action

- [ ] **Pagination Component**:
  - [ ] Reusable pagination component
  - [ ] Handles page navigation
  - [ ] Displays current page
  - [ ] Shows total pages

### Data Models

- [ ] **ChangeRequestListItem Interface**:
  ```typescript
  interface ChangeRequestListItem {
    id: number;
    changeRequestId: string;
    type: string;
    summary: string;
    effectiveFrom: string | null;
    effectiveUntil: string | null;
    expectedExtraCost: number | null;
    costEstimatedByLandbridge: number | null;
    status: string;
  }
  ```

- [ ] **ChangeRequestsListResponse Interface**:
  ```typescript
  interface ChangeRequestsListResponse {
    content: ChangeRequestListItem[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }
  ```

### Error Handling

- [ ] **API Errors**:
  - [ ] Displays error message if API call fails
  - [ ] Handles 403 Forbidden (access denied)
  - [ ] Handles 404 Not Found (SOW contract not found)
  - [ ] Handles 500 Internal Server Error
  - [ ] Error messages are user-friendly

- [ ] **Network Errors**:
  - [ ] Displays network error message
  - [ ] Provides retry option (optional)

### Testing Requirements

- [ ] **Unit Tests**:
  - [ ] Test ChangeRequestsList component rendering
  - [ ] Test pagination logic
  - [ ] Test empty state display
  - [ ] Test error state display
  - [ ] Test currency formatting
  - [ ] Test date formatting
  - [ ] Test status badge rendering

- [ ] **Integration Tests**:
  - [ ] Test API endpoint returns correct data
  - [ ] Test role-based filtering
  - [ ] Test pagination API calls
  - [ ] Test error responses

- [ ] **E2E Tests**:
  - [ ] Test navigating to Change Requests tab
  - [ ] Test viewing change requests list
  - [ ] Test pagination navigation
  - [ ] Test clicking view icon
  - [ ] Test empty state display
  - [ ] Test "+ New Change Request" button

## Wireframe Reference

Based on the provided wireframe:
- Tab "Change Request" is active
- "+ New Change Request" button in top-right
- Table with columns: CR ID, Type, Summary, Effective from, Effective until, Expected Extra Cost, Cost Estimated by Landbridge, Status, Action
- Example data:
  - Row 1: CR-2025-01, Extend Schedule, Extend Retainer Period, -, -, ¥300,000, ¥320,000, Draft, View icon
  - Row 2: CR-2025-01, Rate Change, Extend Retainer Period, -, -, ¥300,000, ¥300,000, Active, View icon
- Pagination: "1 2 3 4 5" with "1" selected

## Dependencies

- Story-26: Sales Create SOW (SOW contract detail page must exist)
- Story-15: Client Create Change Request (Change request entity and structure)
- Backend API for change requests must be available

## Notes

- This story focuses on listing change requests only
- Creating new change requests will be handled in a separate story
- Viewing change request details will be handled in a separate story
- Editing change requests will be handled in a separate story
- The "+ New Change Request" button functionality will be implemented in a future story

