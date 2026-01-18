# User Story: Client Dashboard

## Story Information
- **Story ID**: Story-17
- **Title**: Client Dashboard
- **Epic**: Client Portal - Dashboard
- **Priority**: High
- **Story Points**: 13
- **Sprint**: Sprint 5
- **Status**: Draft

## User Story
**As a** Client  
**I want to** view a comprehensive dashboard with summary statistics, recent activities, and notifications  
**So that** I can quickly understand the status of my contacts, proposals, contracts, and change requests, and stay informed about important updates

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] I can view summary statistics for Contacts, Proposals, Contracts, and Change Requests
- [ ] I can view a timeline of recent activities with dates and descriptions
- [ ] I can view alerts and notifications that require my attention
- [ ] Dashboard matches the wireframe design
- [ ] All data is displayed with proper formatting (dates, numbers, status badges)
- [ ] Dashboard data is automatically refreshed or can be manually refreshed

### Detailed Acceptance Criteria

#### 1. Page Layout (Based on Wireframe)
- [ ] **Left Sidebar**:
  - [ ] "SKILL BRIDGE" logo/title at the top of sidebar
  - [ ] Navigation menu items:
    - [ ] "Dashboard" with grid icon (highlighted/active state when on this page)
    - [ ] "Contact form" with envelope icon
    - [ ] "Proposal" with document icon
    - [ ] "Contract" with document icon
  - [ ] Sidebar has dark grey background
  - [ ] Sidebar is collapsible on mobile (future enhancement)

- [ ] **Top Header**:
  - [ ] Page title "Dashboard" displayed on the left
  - [ ] User information displayed on the right:
    - [ ] User icon/avatar
    - [ ] User name (e.g., "Yamada Taro")
  - [ ] Header has white background
  - [ ] Header is sticky/static at top
  - [ ] Language selector (JA/EN) in header

- [ ] **Main Content Area**:
  - [ ] White background area occupying remaining screen space
  - [ ] Content is properly spaced from sidebar and header
  - [ ] Three main sections: Summary, Recent Activity Timeline, Alerts / Notifications
  - [ ] Responsive layout for different screen sizes

#### 2. Summary Section
- [ ] **Section Header**:
  - [ ] Label "Summary" displayed at the top of the section
  - [ ] Clear visual separation from other sections

- [ ] **Summary Cards**:
  - [ ] Four rectangular cards arranged horizontally
  - [ ] Each card has clear borders and spacing
  - [ ] Cards are responsive and stack vertically on mobile

- [ ] **Contacts Card**:
  - [ ] Card title: "Contacts"
  - [ ] Displays two metrics:
    - [ ] "X Inprogress" (e.g., "3 Inprogress")
    - [ ] "Y new" (e.g., "1 new")
  - [ ] Numbers are clearly visible and formatted
  - [ ] Card is clickable and navigates to Contact List page (optional enhancement)

- [ ] **Proposals Card**:
  - [ ] Card title: "Proposals"
  - [ ] Displays two metrics:
    - [ ] "X Under review" (e.g., "1 Under review")
    - [ ] "Y Reviewed" (e.g., "2 Reviewed")
  - [ ] Numbers are clearly visible and formatted
  - [ ] Card is clickable and navigates to Proposal List page (optional enhancement)

- [ ] **Contracts Card**:
  - [ ] Card title: "Contracts"
  - [ ] Displays two metrics:
    - [ ] "X Active" (e.g., "2 Active")
    - [ ] "Y Draft" (e.g., "1 Draft")
  - [ ] Numbers are clearly visible and formatted
  - [ ] Card is clickable and navigates to Contract List page (optional enhancement)

- [ ] **Change Requests Card**:
  - [ ] Card title: "Change Requests"
  - [ ] Displays two metrics:
    - [ ] "X Under review" (e.g., "1 Under review")
    - [ ] "Y Approved" (e.g., "2 Approved")
  - [ ] Numbers are clearly visible and formatted
  - [ ] Card is clickable and navigates to relevant change requests (optional enhancement)

#### 3. Recent Activity Timeline Section
- [ ] **Section Header**:
  - [ ] Label "Recent Activity Timeline" displayed at the top of the section
  - [ ] Clear visual separation from other sections

- [ ] **Activity List**:
  - [ ] Activities are displayed in a vertical list
  - [ ] Each activity item shows:
    - [ ] Date in format [YYYY/MM/DD] (e.g., "[2025/06/05]")
    - [ ] Activity description text
  - [ ] Activities are ordered by date (newest first)
  - [ ] Maximum number of activities displayed (e.g., 10 most recent)
  - [ ] Activities are clickable and navigate to relevant detail pages (optional enhancement)

- [ ] **Activity Examples** (from wireframe):
  - [ ] "[2025/06/05] Proposal v3 sent for EC Revamp Project."
  - [ ] "[2025/06/01] Contract SOW-2025-07-01 (EC Revamp) signed by client."
  - [ ] "[2025/05/28] CR-2025-01 created (Extend 2 months) - Under Review."

- [ ] **Activity Types**:
  - [ ] Proposal activities (sent, reviewed, approved, etc.)
  - [ ] Contract activities (signed, created, updated, etc.)
  - [ ] Change Request activities (created, submitted, approved, etc.)
  - [ ] Contact activities (created, updated, converted, etc.)

#### 4. Alerts / Notifications Section
- [ ] **Section Header**:
  - [ ] Label "■ Alerts / Notifications" displayed at the top of the section
  - [ ] Clear visual separation from other sections
  - [ ] Alert icon (■) or notification icon displayed

- [ ] **Alert List**:
  - [ ] Alerts are displayed in a vertical list
  - [ ] Each alert shows:
    - [ ] Alert icon (e.g., "!")
    - [ ] Alert message text
  - [ ] Alerts are ordered by priority or date (newest/highest priority first)
  - [ ] Maximum number of alerts displayed (e.g., 10 most important)
  - [ ] Alerts are clickable and navigate to relevant detail pages

- [ ] **Alert Examples** (from wireframe):
  - [ ] "! CR-2025-01 needs client decision."

- [ ] **Alert Types**:
  - [ ] Change Requests requiring client decision/approval
  - [ ] Contracts pending signature
  - [ ] Proposals requiring review
  - [ ] Important updates or deadlines

- [ ] **Alert Styling**:
  - [ ] High-priority alerts have distinct visual styling (e.g., red/orange color)
  - [ ] Alert icon is clearly visible
  - [ ] Alert text is readable and not truncated unnecessarily

#### 5. Data Loading and Refresh
- [ ] **Initial Load**:
  - [ ] Dashboard data loads automatically when page is accessed
  - [ ] Loading state is displayed while data is being fetched
  - [ ] Error state is displayed if data loading fails

- [ ] **Data Refresh**:
  - [ ] Data can be manually refreshed (refresh button or pull-to-refresh)
  - [ ] Data automatically refreshes at regular intervals (e.g., every 5 minutes)
  - [ ] Refresh indicator shows when data is being updated

- [ ] **Empty States**:
  - [ ] Empty state message when no summary data available
  - [ ] Empty state message when no recent activities
  - [ ] Empty state message when no alerts/notifications

#### 6. Navigation and Interactions
- [ ] **Navigation Links**:
  - [ ] Summary cards can optionally link to respective list pages
  - [ ] Activity items can optionally link to relevant detail pages
  - [ ] Alert items can optionally link to relevant detail pages
  - [ ] All links open in appropriate pages with proper context

- [ ] **Responsive Design**:
  - [ ] Dashboard is fully responsive for mobile, tablet, and desktop
  - [ ] Summary cards stack vertically on mobile
  - [ ] Timeline and alerts remain readable on all screen sizes
  - [ ] Sidebar collapses on mobile (future enhancement)

## Technical Requirements

### Frontend Requirements
- [ ] **Component Structure**:
  - [ ] `DashboardPage` component as main page component
  - [ ] `SummaryCards` component for summary section
  - [ ] `SummaryCard` component for individual summary cards
  - [ ] `ActivityTimeline` component for recent activities
  - [ ] `ActivityItem` component for individual activity items
  - [ ] `AlertsSection` component for alerts/notifications
  - [ ] `AlertItem` component for individual alert items

- [ ] **State Management**:
  - [ ] Use React hooks (useState, useEffect) for data fetching
  - [ ] Manage loading, error, and success states
  - [ ] Implement auto-refresh functionality

- [ ] **Styling**:
  - [ ] Use Tailwind CSS for styling
  - [ ] Match wireframe design exactly
  - [ ] Implement responsive breakpoints
  - [ ] Use consistent color scheme with client portal

- [ ] **Data Formatting**:
  - [ ] Format dates as YYYY/MM/DD
  - [ ] Format numbers with proper localization
  - [ ] Display status badges with appropriate colors

### Backend Requirements
- [ ] **API Endpoints**:
  - [ ] `GET /api/client/dashboard/summary` - Returns summary statistics
    - [ ] Response includes: contacts (inprogress, new), proposals (under review, reviewed), contracts (active, draft), change requests (under review, approved)
  - [ ] `GET /api/client/dashboard/activities` - Returns recent activities
    - [ ] Response includes: date, description, type, related entity ID
    - [ ] Supports pagination (limit to 10-20 most recent)
  - [ ] `GET /api/client/dashboard/alerts` - Returns alerts/notifications
    - [ ] Response includes: alert message, priority, type, related entity ID
    - [ ] Supports pagination (limit to 10 most important)

- [ ] **Service Layer**:
  - [ ] `DashboardService` to aggregate data from multiple sources
  - [ ] Methods: `getSummary()`, `getRecentActivities()`, `getAlerts()`
  - [ ] Proper error handling and logging

- [ ] **Data Aggregation**:
  - [ ] Aggregate data from Contact, Proposal, Contract, and ChangeRequest entities
  - [ ] Calculate summary statistics based on status
  - [ ] Query recent activities from history/audit logs
  - [ ] Determine alerts based on business rules

- [ ] **Performance**:
  - [ ] Optimize queries to minimize database calls
  - [ ] Consider caching for summary statistics
  - [ ] Use efficient queries with proper indexes

### Database Requirements
- [ ] **Queries**:
  - [ ] Query contacts by status (inprogress, new)
  - [ ] Query proposals by status (under review, reviewed)
  - [ ] Query contracts by status (active, draft)
  - [ ] Query change requests by status (under review, approved)
  - [ ] Query recent activities from history tables
  - [ ] Query alerts based on business rules

- [ ] **Indexes**:
  - [ ] Ensure proper indexes on status fields for efficient queries
  - [ ] Index on date fields for activity timeline queries

### API Response Models

#### Summary Response
```json
{
  "contacts": {
    "inprogress": 3,
    "new": 1
  },
  "proposals": {
    "underReview": 1,
    "reviewed": 2
  },
  "contracts": {
    "active": 2,
    "draft": 1
  },
  "changeRequests": {
    "underReview": 1,
    "approved": 2
  }
}
```

#### Activities Response
```json
{
  "activities": [
    {
      "id": 1,
      "date": "2025/06/05",
      "description": "Proposal v3 sent for EC Revamp Project.",
      "type": "PROPOSAL",
      "entityId": 123,
      "entityType": "proposal"
    },
    {
      "id": 2,
      "date": "2025/06/01",
      "description": "Contract SOW-2025-07-01 (EC Revamp) signed by client.",
      "type": "CONTRACT",
      "entityId": 456,
      "entityType": "contract"
    },
    {
      "id": 3,
      "date": "2025/05/28",
      "description": "CR-2025-01 created (Extend 2 months) - Under Review.",
      "type": "CHANGE_REQUEST",
      "entityId": 789,
      "entityType": "changeRequest"
    }
  ],
  "total": 3
}
```

#### Alerts Response
```json
{
  "alerts": [
    {
      "id": 1,
      "message": "CR-2025-01 needs client decision.",
      "priority": "HIGH",
      "type": "CHANGE_REQUEST_DECISION",
      "entityId": 789,
      "entityType": "changeRequest"
    }
  ],
  "total": 1
}
```

## Implementation Guidelines

### Frontend Implementation
1. Create dashboard page component at `frontend/src/app/client/dashboard/page.tsx`
2. Create reusable components for summary cards, activity timeline, and alerts
3. Implement data fetching with proper error handling
4. Add loading and empty states
5. Implement auto-refresh functionality
6. Add navigation links to detail pages

### Backend Implementation
1. Create `DashboardController` with three endpoints
2. Create `DashboardService` to aggregate data
3. Implement efficient queries with proper joins
4. Add proper error handling and logging
5. Consider caching for performance optimization

## Testing Requirements

### Unit Tests
- [ ] Test summary statistics calculation
- [ ] Test activity timeline ordering
- [ ] Test alert priority sorting
- [ ] Test date formatting
- [ ] Test number formatting

### Integration Tests
- [ ] Test dashboard API endpoints
- [ ] Test data aggregation logic
- [ ] Test error handling
- [ ] Test authentication and authorization

### End-to-End Tests
- [ ] Test dashboard page loads correctly
- [ ] Test summary cards display correct data
- [ ] Test activity timeline displays recent activities
- [ ] Test alerts section displays notifications
- [ ] Test navigation links work correctly
- [ ] Test responsive design on different screen sizes

## Performance Requirements
- [ ] Dashboard page loads within 2 seconds
- [ ] API endpoints respond within 500ms
- [ ] Summary statistics are cached for 5 minutes
- [ ] Activities and alerts are limited to reasonable numbers (10-20 items)

## Security Considerations
- [ ] All API endpoints require authentication
- [ ] User can only see their own data
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

## Dependencies
- **Internal Dependencies**:
  - Story-09: Client Contact List (for contact data)
  - Story-11: Client Proposal List (for proposal data)
  - Story-12: Client Contract List (for contract data)
  - Story-15: Client Create Change Request (for change request data)
  - Authentication system (for user context)

- **External Dependencies**:
  - None

## Risks and Mitigation
- **Risk**: Performance issues with data aggregation
  - **Mitigation**: Implement caching, optimize queries, limit data returned

- **Risk**: Too many activities/alerts causing UI clutter
  - **Mitigation**: Implement pagination, limit items displayed, add filters

- **Risk**: Real-time updates may be complex
  - **Mitigation**: Start with periodic refresh, add real-time updates in future enhancement

## Success Metrics
- [ ] Dashboard page load time < 2 seconds
- [ ] API response time < 500ms
- [ ] User engagement: Users visit dashboard regularly
- [ ] User satisfaction: Dashboard provides useful overview

## Future Enhancements
- [ ] Real-time updates via WebSocket
- [ ] Customizable dashboard widgets
- [ ] Export dashboard data
- [ ] Advanced filtering and search
- [ ] Dashboard analytics
- [ ] Clickable summary cards with drill-down functionality
- [ ] Activity timeline with filters by type
- [ ] Alert management (mark as read, dismiss)

