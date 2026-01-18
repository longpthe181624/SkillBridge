# User Story: Sales Dashboard

## Story Information
- **Story ID**: Story-31
- **Title**: Sales Dashboard
- **Epic**: Sales Portal - Dashboard
- **Priority**: High
- **Story Points**: 13
- **Sprint**: Sprint 8
- **Status**: Draft

## User Story

### For Sales Manager
**As a** Sales Manager  
**I want to** view a comprehensive dashboard with summary statistics, recent activities, and revenue information for all system data  
**So that** I can monitor the overall sales performance, track all contacts, opportunities, proposals, contracts, and change requests across the entire organization, and make informed business decisions

### For Sales Rep
**As a** Sales Rep  
**I want to** view a personalized dashboard with summary statistics and recent activities for only my assigned items  
**So that** I can quickly understand the status of my assigned contacts, opportunities, proposals, contracts, and change requests, and stay informed about important updates without seeing sensitive revenue information

## Background & Context

### User Roles
- **Sales Manager**: Has access to all data in the system, including revenue information
- **Sales Rep**: Has access only to data assigned to them, excluding revenue information

### Dashboard Purpose
The Sales Dashboard provides a centralized view of key metrics and activities, allowing sales users to:
- Quickly assess their workload and priorities
- Monitor status of contacts, opportunities, proposals, contracts, and change requests
- Stay informed about recent activities and approvals waiting from clients
- Track revenue performance (Sales Manager only)

## Acceptance Criteria

### Primary Acceptance Criteria

#### Role-Based Access Control
- [ ] Sales Manager sees all data in the system (all contacts, opportunities, proposals, contracts, change requests)
- [ ] Sales Rep sees only data assigned to them (assigned contacts, opportunities, proposals, contracts, change requests)
- [ ] Sales Manager sees Revenue section with monthly revenue data
- [ ] Sales Rep does NOT see Revenue section
- [ ] Dashboard automatically filters data based on user role
- [ ] All API endpoints respect role-based access control

#### Summary Statistics
- [ ] Summary section displays key metrics in card format
- [ ] Each summary card shows total count and filtered count (e.g., "70(All)" and "15(New)")
- [ ] Summary cards are clickable and navigate to respective list pages
- [ ] Summary statistics update automatically or can be manually refreshed

#### Recent Activities
- [ ] Recent activities section displays timeline of important events
- [ ] Activities are ordered by date (newest first)
- [ ] Activities show date, description, and related entity information
- [ ] Activities are clickable and navigate to relevant detail pages

#### Approvals Waiting from Client
- [ ] Section displays items requiring client approval
- [ ] Shows proposals and contracts waiting for client review/approval
- [ ] Items are ordered by priority or date
- [ ] Items are clickable and navigate to relevant detail pages

### Detailed Acceptance Criteria

#### 1. Page Layout (Based on Wireframe)

- [ ] **Left Sidebar**:
  - [ ] "SKILL BRIDGE" logo/title at the top of sidebar
  - [ ] Navigation menu items:
    - [ ] "Dashboard" with grid icon (highlighted/active state when on this page)
    - [ ] "Contact form" with envelope icon
    - [ ] "Proposal" with document icon
    - [ ] "Contract" with document icon
  - [ ] Sidebar has white background with dark gray header
  - [ ] Sidebar is collapsible on mobile (future enhancement)

- [ ] **Top Header Bar**:
  - [ ] Header bar has dark gray background
  - [ ] Page title "Dashboard" displayed on the left in white text
  - [ ] User information displayed on the right:
    - [ ] User icon/avatar
    - [ ] User name (e.g., "Yamada Taro")
  - [ ] Header is sticky/static at top
  - [ ] Language selector (JA/EN) in header

- [ ] **Main Content Area**:
  - [ ] White background area occupying remaining screen space
  - [ ] Content is properly spaced from sidebar and header
  - [ ] Three main sections: Summary, Approvals Waiting from Client, Recent Client Activity
  - [ ] Responsive layout for different screen sizes

#### 2. Summary Section

- [ ] **Section Header**:
  - [ ] Label "Summary" displayed at the top of the section
  - [ ] Clear visual separation from other sections

- [ ] **Summary Cards**:
  - [ ] Six rectangular cards arranged horizontally (or responsive grid)
  - [ ] Each card has clear borders and spacing
  - [ ] Cards are responsive and stack vertically on mobile

- [ ] **Contacts Card**:
  - [ ] Card title: "Contacts"
  - [ ] Displays two metrics:
    - [ ] "X(All)" - Total contacts (Sales Manager: all contacts, Sales Rep: assigned contacts)
    - [ ] "Y(New)" - New contacts count
  - [ ] Numbers are clearly visible and formatted
  - [ ] Card is clickable and navigates to Contact List page

- [ ] **Opportunities Card**:
  - [ ] Card title: "Opportunities"
  - [ ] Displays two metrics:
    - [ ] "X(All)" - Total opportunities (Sales Manager: all, Sales Rep: assigned)
    - [ ] "Y(Under Review)" - Opportunities under review count
  - [ ] Numbers are clearly visible and formatted
  - [ ] Card is clickable and navigates to Opportunities List page

- [ ] **Proposals Card**:
  - [ ] Card title: "Proposals"
  - [ ] Displays two metrics:
    - [ ] "X(All)" - Total proposals (Sales Manager: all, Sales Rep: assigned)
    - [ ] "Y(Under Review)" - Proposals under review count
  - [ ] Numbers are clearly visible and formatted
  - [ ] Card is clickable and navigates to Proposal List page

- [ ] **Contracts Card**:
  - [ ] Card title: "Contracts"
  - [ ] Displays two metrics:
    - [ ] "X(All)" - Total contracts (Sales Manager: all, Sales Rep: assigned)
    - [ ] "Y Under review" - Contracts under review count
  - [ ] Numbers are clearly visible and formatted
  - [ ] Card is clickable and navigates to Contract List page

- [ ] **Change Requests (CR) Card**:
  - [ ] Card title: "CR"
  - [ ] Displays two metrics:
    - [ ] "X(All)" - Total change requests (Sales Manager: all, Sales Rep: assigned)
    - [ ] "Y Under review" - Change requests under review count
  - [ ] Numbers are clearly visible and formatted
  - [ ] Card is clickable and navigates to Change Requests list (or contract detail with CR tab)

- [ ] **Revenue Card** (Sales Manager ONLY):
  - [ ] Card title: "Revenue"
  - [ ] Displays monthly revenue data:
    - [ ] Format: "YYYY/MM: ¥X,XXX,XXX" (e.g., "2025/12: ¥12,500,000")
    - [ ] Shows multiple months (e.g., "2026/1: ¥14,500,000")
    - [ ] Ellipsis (...) if more months available
  - [ ] Revenue is formatted with Japanese yen symbol (¥) and comma separators
  - [ ] Card is clickable and navigates to Revenue/Financial report page (optional enhancement)
  - [ ] **Sales Rep does NOT see this card**

#### 3. Approvals Waiting from Client Section

- [ ] **Section Header**:
  - [ ] Label "Approvals Waiting from Client" displayed at the top of the section
  - [ ] Clear visual separation from other sections

- [ ] **Approval Items List**:
  - [ ] Items are displayed in a vertical list
  - [ ] Each item shows:
    - [ ] Entity type and number (e.g., "Proposal #P-103", "SOW #SW-021")
    - [ ] Client/Company name (e.g., "ACME JP", "Sakura Tech")
    - [ ] Status or action description (e.g., "(Sent 10 Oct)", "(Client Review)")
  - [ ] Items are ordered by priority or date (newest/highest priority first)
  - [ ] Maximum number of items displayed (e.g., 10 most important)
  - [ ] Items are clickable and navigate to relevant detail pages

- [ ] **Approval Item Examples** (from wireframe):
  - [ ] "Proposal #P-103 - ACME JP (Sent 10 Oct)"
  - [ ] "SOW #SW-021 - Sakura Tech (Client Review)"

- [ ] **Role-Based Filtering**:
  - [ ] Sales Manager sees all approvals waiting from all clients
  - [ ] Sales Rep sees only approvals for their assigned items

- [ ] **Empty State**:
  - [ ] Shows message "No approvals waiting from clients" when no items

#### 4. Recent Client Activity Section

- [ ] **Section Header**:
  - [ ] Label "Recent Client Activity" displayed at the top of the section
  - [ ] Clear visual separation from other sections

- [ ] **Activity List**:
  - [ ] Activities are displayed in a vertical list
  - [ ] Each activity shows:
    - [ ] Activity description (e.g., "CR-020 submitted by Client A")
    - [ ] Time relative to now (e.g., "(2 min ago)", "(1 hour ago)", "(3 days ago)")
  - [ ] Activities are ordered by date (newest first)
  - [ ] Maximum number of activities displayed (e.g., 10 most recent)
  - [ ] Activities are clickable and navigate to relevant detail pages

- [ ] **Activity Examples** (from wireframe):
  - [ ] "CR-020 submitted by Client A (2 min ago)"

- [ ] **Activity Types**:
  - [ ] Change Request submissions by clients
  - [ ] Contract signings by clients
  - [ ] Proposal reviews/comments by clients
  - [ ] Contact form submissions
  - [ ] Other client-initiated actions

- [ ] **Role-Based Filtering**:
  - [ ] Sales Manager sees all recent client activities
  - [ ] Sales Rep sees only activities for their assigned items

- [ ] **Empty State**:
  - [ ] Shows message "No recent client activity" when no activities

#### 5. Data Loading and Refresh

- [ ] **Initial Load**:
  - [ ] Dashboard data loads automatically when page is accessed
  - [ ] Loading state is displayed while data is being fetched
  - [ ] Error state is displayed if data loading fails
  - [ ] Role-based filtering is applied automatically based on logged-in user

- [ ] **Data Refresh**:
  - [ ] Data can be manually refreshed (refresh button or pull-to-refresh)
  - [ ] Data automatically refreshes at regular intervals (e.g., every 5 minutes)
  - [ ] Refresh indicator shows when data is being updated

- [ ] **Empty States**:
  - [ ] Empty state message when no summary data available
  - [ ] Empty state message when no approvals waiting
  - [ ] Empty state message when no recent activities

#### 6. Navigation and Interactions

- [ ] **Navigation Links**:
  - [ ] Summary cards link to respective list pages
  - [ ] Approval items link to relevant detail pages
  - [ ] Activity items link to relevant detail pages
  - [ ] All links open in appropriate pages with proper context

- [ ] **Responsive Design**:
  - [ ] Dashboard is fully responsive for mobile, tablet, and desktop
  - [ ] Summary cards stack vertically on mobile
  - [ ] Sections remain readable on all screen sizes
  - [ ] Sidebar collapses on mobile (future enhancement)

## Technical Requirements

### Frontend Requirements

- [ ] **Component Structure**:
  - [ ] `SalesDashboardPage` component as main page component at `frontend/src/app/sales/dashboard/page.tsx`
  - [ ] `SummaryCards` component for summary section
  - [ ] `SummaryCard` component for individual summary cards
  - [ ] `ApprovalsSection` component for approvals waiting section
  - [ ] `ApprovalItem` component for individual approval items
  - [ ] `RecentActivitySection` component for recent activities
  - [ ] `ActivityItem` component for individual activity items
  - [ ] `RevenueCard` component for revenue (Sales Manager only)

- [ ] **State Management**:
  - [ ] Use React hooks (useState, useEffect) for data fetching
  - [ ] Manage loading, error, and success states
  - [ ] Implement auto-refresh functionality
  - [ ] Store user role and apply role-based filtering

- [ ] **Styling**:
  - [ ] Use Tailwind CSS for styling
  - [ ] Match wireframe design exactly
  - [ ] Implement responsive breakpoints
  - [ ] Use consistent color scheme with sales portal
  - [ ] Hide Revenue card for Sales Rep users

- [ ] **Data Formatting**:
  - [ ] Format dates as relative time (e.g., "2 min ago", "1 hour ago")
  - [ ] Format numbers with proper localization (Japanese format)
  - [ ] Format currency with ¥ symbol and comma separators
  - [ ] Display status badges with appropriate colors

### Backend Requirements

- [ ] **API Endpoints**:
  - [ ] `GET /api/sales/dashboard/summary` - Returns summary statistics
    - [ ] Response includes: contacts (all, new), opportunities (all, underReview), proposals (all, underReview), contracts (all, underReview), changeRequests (all, underReview)
    - [ ] For Sales Manager: Returns all system data
    - [ ] For Sales Rep: Returns only assigned data
    - [ ] Response includes revenue data only for Sales Manager
  - [ ] `GET /api/sales/dashboard/approvals` - Returns approvals waiting from clients
    - [ ] Response includes: entity type, entity number, client name, status, date
    - [ ] For Sales Manager: Returns all approvals
    - [ ] For Sales Rep: Returns only approvals for assigned items
  - [ ] `GET /api/sales/dashboard/activities` - Returns recent client activities
    - [ ] Response includes: description, time relative, entity type, entity ID
    - [ ] For Sales Manager: Returns all activities
    - [ ] For Sales Rep: Returns only activities for assigned items

- [ ] **Service Layer**:
  - [ ] `SalesDashboardService` to aggregate data from multiple sources
  - [ ] Methods: `getSummary(User currentUser)`, `getApprovalsWaiting(User currentUser)`, `getRecentActivities(User currentUser)`
  - [ ] Role-based filtering logic:
    - [ ] Sales Manager: No filtering (all data)
    - [ ] Sales Rep: Filter by `assigneeUserId = currentUser.id`
  - [ ] Proper error handling and logging

- [ ] **Data Aggregation**:
  - [ ] Aggregate data from Contact, Opportunity, Proposal, Contract, and ChangeRequest entities
  - [ ] Calculate summary statistics based on status and assignment
  - [ ] Query approvals waiting from client (status = "Client Under Review", "Under Review", etc.)
  - [ ] Query recent activities from history/audit logs
  - [ ] Calculate revenue from contracts (Sales Manager only)

- [ ] **Performance**:
  - [ ] Optimize queries to minimize database calls
  - [ ] Consider caching for summary statistics
  - [ ] Use efficient queries with proper indexes
  - [ ] Limit data returned (e.g., top 10 approvals, top 10 activities)

### Database Requirements

- [ ] **Queries**:
  - [ ] Query contacts by status and assignee (for Sales Rep)
  - [ ] Query opportunities by status and assignee
  - [ ] Query proposals by status and assignee
  - [ ] Query contracts by status and assignee
  - [ ] Query change requests by status and assignee
  - [ ] Query revenue from contracts (Sales Manager only)
  - [ ] Query approvals waiting from clients
  - [ ] Query recent activities from history tables

- [ ] **Indexes**:
  - [ ] Ensure proper indexes on status fields for efficient queries
  - [ ] Index on `assigneeUserId` for Sales Rep filtering
  - [ ] Index on date fields for activity timeline queries

### API Response Models

#### Summary Response
```json
{
  "contacts": {
    "all": 70,
    "new": 15
  },
  "opportunities": {
    "all": 30,
    "underReview": 7
  },
  "proposals": {
    "all": 50,
    "underReview": 5
  },
  "contracts": {
    "all": 50,
    "underReview": 1
  },
  "changeRequests": {
    "all": 50,
    "underReview": 1
  },
  "revenue": [
    {
      "month": "2025/12",
      "amount": 12500000
    },
    {
      "month": "2026/01",
      "amount": 14500000
    }
  ]
}
```

**Note**: `revenue` field is only included for Sales Manager. Sales Rep will not receive this field.

#### Approvals Waiting Response
```json
{
  "approvals": [
    {
      "id": 1,
      "entityType": "PROPOSAL",
      "entityNumber": "P-103",
      "entityId": 123,
      "clientName": "ACME JP",
      "status": "Sent",
      "sentDate": "2025-10-10",
      "description": "Proposal #P-103 - ACME JP (Sent 10 Oct)"
    },
    {
      "id": 2,
      "entityType": "SOW",
      "entityNumber": "SW-021",
      "entityId": 456,
      "clientName": "Sakura Tech",
      "status": "Client Review",
      "description": "SOW #SW-021 - Sakura Tech (Client Review)"
    }
  ],
  "total": 2
}
```

#### Recent Activities Response
```json
{
  "activities": [
    {
      "id": 1,
      "description": "CR-020 submitted by Client A",
      "timeAgo": "2 min ago",
      "timestamp": "2025-11-22T10:30:00Z",
      "entityType": "CHANGE_REQUEST",
      "entityId": 789,
      "clientName": "Client A"
    }
  ],
  "total": 1
}
```

## Implementation Guidelines

### Frontend Implementation
1. Create dashboard page component at `frontend/src/app/sales/dashboard/page.tsx`
2. Create reusable components for summary cards, approvals section, and activities section
3. Implement data fetching with proper error handling
4. Add loading and empty states
5. Implement auto-refresh functionality
6. Add navigation links to detail pages
7. Implement role-based UI rendering (hide Revenue card for Sales Rep)

### Backend Implementation
1. Create `SalesDashboardController` with three endpoints
2. Create `SalesDashboardService` to aggregate data
3. Implement role-based filtering logic:
   - Sales Manager: No filtering
   - Sales Rep: Filter by `assigneeUserId = currentUser.id`
4. Implement efficient queries with proper joins
5. Add proper error handling and logging
6. Consider caching for performance optimization
7. Exclude revenue data from response for Sales Rep

## Testing Requirements

### Unit Tests
- [ ] Test summary statistics calculation for Sales Manager
- [ ] Test summary statistics calculation for Sales Rep (filtered)
- [ ] Test revenue calculation (Sales Manager only)
- [ ] Test role-based filtering logic
- [ ] Test activity timeline ordering
- [ ] Test approval priority sorting
- [ ] Test date formatting (relative time)
- [ ] Test number and currency formatting

### Integration Tests
- [ ] Test dashboard API endpoints with Sales Manager role
- [ ] Test dashboard API endpoints with Sales Rep role
- [ ] Test role-based data filtering
- [ ] Test revenue data exclusion for Sales Rep
- [ ] Test data aggregation logic
- [ ] Test error handling
- [ ] Test authentication and authorization

### End-to-End Tests
- [ ] Test dashboard page loads correctly for Sales Manager
- [ ] Test dashboard page loads correctly for Sales Rep
- [ ] Test summary cards display correct data (role-based)
- [ ] Test Revenue card is visible for Sales Manager
- [ ] Test Revenue card is hidden for Sales Rep
- [ ] Test approvals section displays items (role-based)
- [ ] Test recent activities section displays activities (role-based)
- [ ] Test navigation links work correctly
- [ ] Test responsive design on different screen sizes

## Performance Requirements
- [ ] Dashboard page loads within 2 seconds
- [ ] API endpoints respond within 500ms
- [ ] Summary statistics are cached for 5 minutes
- [ ] Approvals and activities are limited to reasonable numbers (10-20 items)

## Security Considerations
- [ ] All API endpoints require authentication
- [ ] Role-based access control is enforced at API level
- [ ] Sales Rep cannot access revenue data (even if requested)
- [ ] Sales Rep can only see their assigned data
- [ ] Proper authorization checks for all data queries
- [ ] No sensitive data exposed in API responses

## Definition of Done
- [ ] All acceptance criteria are met
- [ ] Code is reviewed and approved
- [ ] Unit tests are written and passing
- [ ] Integration tests are written and passing
- [ ] E2E tests are written and passing
- [ ] Code follows project coding standards
- [ ] Documentation is updated
- [ ] Dashboard matches wireframe design
- [ ] Responsive design works on all screen sizes
- [ ] Performance requirements are met
- [ ] Security requirements are met
- [ ] Role-based access control is properly implemented

## Dependencies
- **Internal Dependencies**:
  - Story-19: Sales Contact List (for contact data)
  - Story-21: Sales Opportunities List (for opportunity data)
  - Story-22: Sales Opportunity Create (for opportunity data)
  - Story-24: Sales Contract List (for contract data)
  - Story-27: Sales List Change Requests SOW (for change request data)
  - Authentication system (for user context and role)
  - User management system (for role assignment)

- **External Dependencies**:
  - None

## Risks and Mitigation
- **Risk**: Performance issues with data aggregation for Sales Manager (large dataset)
  - **Mitigation**: Implement caching, optimize queries, limit data returned, use pagination

- **Risk**: Role-based filtering complexity
  - **Mitigation**: Clear separation of filtering logic, comprehensive testing, proper indexing

- **Risk**: Revenue data accidentally exposed to Sales Rep
  - **Mitigation**: Strict API-level filtering, comprehensive security testing, code review

- **Risk**: Too many approvals/activities causing UI clutter
  - **Mitigation**: Implement pagination, limit items displayed, add filters

## Success Metrics
- [ ] Dashboard page load time < 2 seconds
- [ ] API response time < 500ms
- [ ] User engagement: Users visit dashboard regularly
- [ ] User satisfaction: Dashboard provides useful overview
- [ ] No security incidents related to role-based access

## Future Enhancements
- [ ] Real-time updates via WebSocket
- [ ] Customizable dashboard widgets
- [ ] Export dashboard data
- [ ] Advanced filtering and search
- [ ] Dashboard analytics
- [ ] Clickable summary cards with drill-down functionality
- [ ] Activity timeline with filters by type
- [ ] Revenue trends and charts (Sales Manager only)
- [ ] Performance metrics and KPIs

