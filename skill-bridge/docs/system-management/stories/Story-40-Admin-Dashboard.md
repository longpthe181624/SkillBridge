# User Story: Admin Dashboard

## Story Information
- **Story ID**: Story-40
- **Title**: Admin Dashboard
- **Epic**: Admin Portal - Dashboard
- **Priority**: High
- **Story Points**: 13
- **Sprint**: Sprint 10
- **Status**: Draft

## User Story

**As an** Admin  
**I want to** view a comprehensive dashboard with summary statistics for engineers, system users, skills, and project types  
**So that** I can quickly understand the overall system status, monitor key metrics, and make informed management decisions

## Background & Context

### Dashboard Purpose
The Admin Dashboard provides a centralized view of key system metrics, allowing admins to:
- Monitor the total number of engineers (active and inactive)
- Track system users (active and inactive)
- View total skills and project types in the system
- Get a quick overview of system health and data volume
- Navigate to detailed management pages for each entity type

### Data Sources
The dashboard aggregates data from multiple tables:
- **Engineers**: From `engineers` table, counting by status (AVAILABLE = Active, others = Inactive)
- **System Users**: From `users` table, counting by `is_active` field (true = Active, false = Inactive)
- **Skills**: From `skills` table, counting total skills (parent and sub-skills)
- **Project Types**: From `project_types` table, counting total project types

## Acceptance Criteria

### Primary Acceptance Criteria

#### Page Layout (Based on Wireframe)

- [ ] **Left Sidebar**:
  - [ ] "SKILL BRIDGE" logo/title at the top of sidebar
  - [ ] Navigation menu items:
    - [ ] "Dashboard" with grid icon (highlighted/active state when on this page)
    - [ ] "Contact form" with envelope icon
    - [ ] "Proposal" with document icon
    - [ ] "Contract" with document icon
  - [ ] Sidebar has dark gray background at top, white background below
  - [ ] Active menu item is highlighted

- [ ] **Top Header Bar**:
  - [ ] Header bar has dark gray background
  - [ ] "SKILL BRIDGE" displayed on the left in white text
  - [ ] Page title "Dashboard" displayed in center in white text
  - [ ] User information displayed on the right:
    - [ ] User icon/avatar
    - [ ] User name (e.g., "Yamada Taro") in white text
  - [ ] Header is sticky/static at top

- [ ] **Main Content Area**:
  - [ ] White background area occupying remaining screen space
  - [ ] Content is properly spaced from sidebar and header
  - [ ] Single main section: Summary
  - [ ] Responsive layout for different screen sizes

#### Summary Section

- [ ] **Section Header**:
  - [ ] Label "Summary" displayed at the top of the section in black text
  - [ ] Clear visual separation from other sections
  - [ ] Proper spacing from header

- [ ] **Summary Cards**:
  - [ ] Four rectangular cards arranged horizontally
  - [ ] Each card has clear borders and spacing
  - [ ] Cards are responsive and stack vertically on mobile
  - [ ] Cards have consistent styling and layout

- [ ] **Engineer Card**:
  - [ ] Card title: "Engineer"
  - [ ] Displays two metrics:
    - [ ] "X(Active)" - Count of active engineers (status = 'AVAILABLE')
    - [ ] "Y(Inactive)" - Count of inactive engineers (status != 'AVAILABLE')
  - [ ] Example format: "80(Active)" and "15(Inactive)"
  - [ ] Numbers are clearly visible and formatted
  - [ ] Card is clickable and navigates to Engineer List page (optional enhancement)

- [ ] **System User Card**:
  - [ ] Card title: "System User"
  - [ ] Displays two metrics:
    - [ ] "X(Active)" - Count of active users (is_active = true)
    - [ ] "Y(Inactive)" - Count of inactive users (is_active = false)
  - [ ] Example format: "50(Active)" and "1(Inactive)"
  - [ ] Numbers are clearly visible and formatted
  - [ ] Card is clickable and navigates to User List page (optional enhancement)

- [ ] **Skills Card**:
  - [ ] Card title: "Skills"
  - [ ] Displays one metric:
    - [ ] "X(Total)" - Total count of all skills (parent and sub-skills)
  - [ ] Example format: "50(Total)"
  - [ ] Numbers are clearly visible and formatted
  - [ ] Card is clickable and navigates to Skill Management page (optional enhancement)

- [ ] **Project Type Card**:
  - [ ] Card title: "Project type"
  - [ ] Displays one metric:
    - [ ] "X(Total)" - Total count of project types
  - [ ] Example format: "1(Total)"
  - [ ] Numbers are clearly visible and formatted
  - [ ] Card is clickable and navigates to Project Type Management page (optional enhancement)

### Detailed Acceptance Criteria

#### Data Loading and Refresh

- [ ] **Initial Load**:
  - [ ] Dashboard loads summary statistics when page is accessed
  - [ ] Loading state is displayed while data is being fetched
  - [ ] Error handling if data cannot be loaded

- [ ] **Data Refresh**:
  - [ ] Statistics are calculated from current database state
  - [ ] Data can be refreshed manually (optional: refresh button)
  - [ ] Data updates automatically on page navigation (if user navigates away and returns)

- [ ] **Performance**:
  - [ ] Dashboard loads within 2 seconds
  - [ ] Statistics are calculated efficiently using database queries
  - [ ] No unnecessary API calls on page load

#### Data Accuracy

- [ ] **Engineer Counts**:
  - [ ] Active count includes only engineers with status = 'AVAILABLE'
  - [ ] Inactive count includes engineers with any other status (e.g., 'BUSY', 'UNAVAILABLE')
  - [ ] Counts are accurate and match the Engineer List page

- [ ] **System User Counts**:
  - [ ] Active count includes only users with is_active = true
  - [ ] Inactive count includes users with is_active = false
  - [ ] Counts include all user roles (ADMIN, SALES_MANAGER, SALES_REP, CLIENT)
  - [ ] Counts are accurate and match the User List page

- [ ] **Skills Count**:
  - [ ] Total count includes both parent skills and sub-skills
  - [ ] Count is accurate and matches the Skill Management page

- [ ] **Project Type Count**:
  - [ ] Total count includes all project types in the system
  - [ ] Count is accurate and matches the Project Type Management page

#### Navigation and Interaction

- [ ] **Card Clickability** (Optional Enhancement):
  - [ ] Clicking on Engineer card navigates to `/admin/engineer`
  - [ ] Clicking on System User card navigates to `/admin/user`
  - [ ] Clicking on Skills card navigates to `/admin/master-data/skill`
  - [ ] Clicking on Project Type card navigates to `/admin/master-data/project-type`
  - [ ] Cards have hover effect to indicate clickability

- [ ] **Sidebar Navigation**:
  - [ ] Dashboard menu item is highlighted when on dashboard page
  - [ ] Other menu items (Contact form, Proposal, Contract) are functional (if implemented)
  - [ ] Navigation works correctly

#### Responsive Design

- [ ] **Desktop View**:
  - [ ] Four cards displayed in a single row
  - [ ] Cards are evenly spaced
  - [ ] Content is properly aligned

- [ ] **Tablet View**:
  - [ ] Cards displayed in 2x2 grid layout
  - [ ] Cards maintain proper spacing
  - [ ] Content remains readable

- [ ] **Mobile View**:
  - [ ] Cards stack vertically
  - [ ] Each card takes full width
  - [ ] Content is properly sized for mobile screens

## Technical Requirements

### Frontend Requirements

#### Component Structure

- [ ] **Page Component**: `frontend/src/app/admin/dashboard/page.tsx`
  - [ ] Uses AdminSidebar component for navigation
  - [ ] Uses AdminHeader component for header
  - [ ] Implements Summary section with four cards
  - [ ] Handles data loading and error states

- [ ] **Summary Cards Component**:
  - [ ] Reusable card component for displaying statistics
  - [ ] Props: title, activeCount (optional), inactiveCount (optional), totalCount (optional)
  - [ ] Handles click navigation (optional)

#### State Management

- [ ] **Dashboard State**:
  - [ ] State for summary statistics (engineers, users, skills, project types)
  - [ ] Loading state
  - [ ] Error state

- [ ] **Data Fetching**:
  - [ ] Use `useEffect` to fetch data on component mount
  - [ ] Use `useState` to manage summary data
  - [ ] Handle loading and error states appropriately

#### API Integration

- [ ] **Service Function**: `frontend/src/services/adminDashboardService.ts`
  - [ ] Function: `getDashboardSummary()` - Returns dashboard summary statistics
  - [ ] Returns: `AdminDashboardSummary` interface with counts for engineers, users, skills, project types

- [ ] **Data Interface**:
  ```typescript
  export interface AdminDashboardSummary {
    engineers: {
      active: number;
      inactive: number;
    };
    systemUsers: {
      active: number;
      inactive: number;
    };
    skills: {
      total: number;
    };
    projectTypes: {
      total: number;
    };
  }
  ```

#### Styling

- [ ] **Layout**:
  - [ ] Matches wireframe design exactly
  - [ ] Dark gray header bar with white text
  - [ ] White main content area
  - [ ] Four summary cards with consistent styling

- [ ] **Typography**:
  - [ ] "Summary" heading in black text
  - [ ] Card titles in appropriate font size and weight
  - [ ] Numbers displayed clearly and prominently

- [ ] **Colors**:
  - [ ] Header: Dark gray background (#2C3E50 or similar)
  - [ ] Cards: White background with borders
  - [ ] Text: Black for content, white for header

### Backend Requirements

#### API Endpoint

- [ ] **Controller**: `backend/src/main/java/com/skillbridge/controller/api/admin/AdminDashboardController.java`
  - [ ] Endpoint: `GET /api/admin/dashboard/summary`
  - [ ] Requires ADMIN role authentication
  - [ ] Returns `AdminDashboardSummaryDTO`

- [ ] **Service**: `backend/src/main/java/com/skillbridge/service/admin/AdminDashboardService.java`
  - [ ] Method: `getDashboardSummary()` - Calculates and returns summary statistics
  - [ ] Aggregates data from multiple repositories

#### DTOs

- [ ] **Response DTO**: `backend/src/main/java/com/skillbridge/dto/admin/response/AdminDashboardSummaryDTO.java`
  ```java
  public class AdminDashboardSummaryDTO {
      private EngineerSummary engineers;
      private SystemUserSummary systemUsers;
      private SkillSummary skills;
      private ProjectTypeSummary projectTypes;
      
      // Getters and setters
  }
  
  public class EngineerSummary {
      private Integer active;
      private Integer inactive;
      // Getters and setters
  }
  
  public class SystemUserSummary {
      private Integer active;
      private Integer inactive;
      // Getters and setters
  }
  
  public class SkillSummary {
      private Integer total;
      // Getters and setters
  }
  
  public class ProjectTypeSummary {
      private Integer total;
      // Getters and setters
  }
  ```

#### Repository Queries

- [ ] **EngineerRepository**:
  - [ ] Query to count engineers by status
  - [ ] Count active: `SELECT COUNT(*) FROM engineers WHERE status = 'AVAILABLE'`
  - [ ] Count inactive: `SELECT COUNT(*) FROM engineers WHERE status != 'AVAILABLE'`

- [ ] **UserRepository**:
  - [ ] Query to count users by is_active
  - [ ] Count active: `SELECT COUNT(*) FROM users WHERE is_active = true`
  - [ ] Count inactive: `SELECT COUNT(*) FROM users WHERE is_active = false`

- [ ] **SkillRepository**:
  - [ ] Query to count total skills
  - [ ] Count total: `SELECT COUNT(*) FROM skills`

- [ ] **ProjectTypeRepository**:
  - [ ] Query to count total project types
  - [ ] Count total: `SELECT COUNT(*) FROM project_types`

#### Business Logic

- [ ] **Summary Calculation**:
  - [ ] All counts are calculated from database queries
  - [ ] No hardcoded values
  - [ ] Counts are accurate and reflect current database state
  - [ ] Performance optimized (use COUNT queries, not loading all records)

- [ ] **Error Handling**:
  - [ ] Handle database errors gracefully
  - [ ] Return appropriate error responses
  - [ ] Log errors for debugging

### Database Requirements

#### Existing Tables

- [ ] **engineers** table:
  - [ ] `status` field (VARCHAR 32) - Used to determine active/inactive
  - [ ] Status values: 'AVAILABLE' (active), others (inactive)

- [ ] **users** table:
  - [ ] `is_active` field (BOOLEAN) - Used to determine active/inactive
  - [ ] `is_active = true` (active), `is_active = false` (inactive)

- [ ] **skills** table:
  - [ ] All skills (parent and sub-skills) are counted
  - [ ] No filtering by parent_skill_id

- [ ] **project_types** table:
  - [ ] All project types are counted
  - [ ] No filtering applied

#### Query Performance

- [ ] **Optimization**:
  - [ ] Use COUNT queries instead of loading all records
  - [ ] Indexes on status and is_active fields for fast counting
  - [ ] Queries execute within acceptable time (< 500ms each)

## Testing Requirements

### Unit Tests

- [ ] **Frontend Component Tests**:
  - [ ] Test Summary section renders correctly
  - [ ] Test cards display correct data
  - [ ] Test loading state
  - [ ] Test error state
  - [ ] Test navigation on card click (if implemented)

- [ ] **Backend Service Tests**:
  - [ ] Test `getDashboardSummary()` returns correct counts
  - [ ] Test engineer counts (active and inactive)
  - [ ] Test user counts (active and inactive)
  - [ ] Test skills total count
  - [ ] Test project types total count
  - [ ] Test error handling

### Integration Tests

- [ ] **API Integration Tests**:
  - [ ] Test `GET /api/admin/dashboard/summary` endpoint
  - [ ] Test authentication requirement (ADMIN role)
  - [ ] Test response format matches DTO
  - [ ] Test data accuracy

- [ ] **Database Integration Tests**:
  - [ ] Test counts match actual database records
  - [ ] Test with various data scenarios (empty, single record, multiple records)

### End-to-End Tests

- [ ] **E2E Dashboard Tests**:
  - [ ] Admin logs in and navigates to dashboard
  - [ ] Dashboard displays summary statistics
  - [ ] Statistics are accurate
  - [ ] Cards are clickable and navigate correctly (if implemented)
  - [ ] Dashboard loads within acceptable time

## Performance Requirements

- [ ] **Page Load Time**:
  - [ ] Dashboard loads within 2 seconds
  - [ ] Statistics are displayed immediately after data is fetched

- [ ] **API Response Time**:
  - [ ] API endpoint responds within 500ms
  - [ ] Database queries are optimized

- [ ] **Data Refresh**:
  - [ ] Manual refresh (if implemented) completes within 1 second
  - [ ] No unnecessary re-fetching of data

## Security Considerations

- [ ] **Authentication**:
  - [ ] Dashboard is only accessible to ADMIN role users
  - [ ] Unauthorized access returns 403 Forbidden

- [ ] **Authorization**:
  - [ ] API endpoint requires ADMIN role
  - [ ] No sensitive data exposure

- [ ] **Data Privacy**:
  - [ ] Summary statistics are aggregated counts only
  - [ ] No individual user or engineer data is exposed

## Deployment Requirements

- [ ] **Environment Configuration**:
  - [ ] API endpoint is available in all environments (dev, staging, production)
  - [ ] Database connections are properly configured

- [ ] **Monitoring**:
  - [ ] Dashboard load times are monitored
  - [ ] API endpoint performance is tracked
  - [ ] Error rates are logged

## Definition of Done

- [ ] All acceptance criteria are met
- [ ] Frontend component is implemented and matches wireframe
- [ ] Backend API endpoint is implemented and tested
- [ ] Unit tests are written and passing
- [ ] Integration tests are written and passing
- [ ] E2E tests are written and passing (if applicable)
- [ ] Code is reviewed and approved
- [ ] Documentation is updated
- [ ] Performance requirements are met
- [ ] Security requirements are met
- [ ] No critical bugs or errors
- [ ] Dashboard is accessible and functional in staging environment

## Dependencies

### Internal Dependencies
- [ ] AdminSidebar component (already implemented)
- [ ] AdminHeader component (already implemented)
- [ ] EngineerRepository (already exists)
- [ ] UserRepository (already exists)
- [ ] SkillRepository (already exists)
- [ ] ProjectTypeRepository (already exists)

### External Dependencies
- [ ] None

## Risks and Mitigation

### Risk 1: Performance Issues with Large Data Sets
- **Risk**: Counting large numbers of records may be slow
- **Mitigation**: Use optimized COUNT queries with proper indexes

### Risk 2: Data Inconsistency
- **Risk**: Counts may not match actual list pages
- **Mitigation**: Use same query logic as list pages, test thoroughly

### Risk 3: Missing Data
- **Risk**: Some entities may not be counted correctly
- **Mitigation**: Comprehensive testing with various data scenarios

## Success Metrics

- [ ] Dashboard loads successfully for all admin users
- [ ] Statistics are accurate and match list pages
- [ ] Page load time is under 2 seconds
- [ ] No critical bugs reported
- [ ] Admin users can access dashboard without issues

## Future Enhancements

- [ ] Add clickable cards that navigate to respective list pages
- [ ] Add refresh button for manual data refresh
- [ ] Add date range filters for statistics
- [ ] Add trend indicators (e.g., increase/decrease from previous period)
- [ ] Add charts or graphs for visual representation
- [ ] Add recent activities section
- [ ] Add alerts/notifications section
- [ ] Add export functionality for statistics

---

**Dev Agent Record**

## Implementation Status

- [x] Story created
- [ ] Story reviewed
- [ ] Story approved
- [x] Development started
- [x] Frontend implementation completed
- [x] Backend implementation completed
- [ ] Testing completed
- [ ] Code review completed
- [ ] Story completed

## Implementation Notes

### Backend Implementation
- Created `AdminDashboardSummaryDTO` with nested summary classes (EngineerSummary, SystemUserSummary, SkillSummary, ProjectTypeSummary)
- Created `AdminDashboardService` with `getDashboardSummary()` method that aggregates counts from multiple repositories
- Created `AdminDashboardController` with `GET /api/admin/dashboard/summary` endpoint
- Added `countByIsActive(Boolean isActive)` method to `UserRepository` for counting active/inactive users
- Used existing repository methods: `EngineerRepository.countByStatus()`, `SkillRepository.count()`, `ProjectTypeRepository.count()`

### Frontend Implementation
- Created `adminDashboardService.ts` with `getDashboardSummary()` function
- Created `/admin/dashboard/page.tsx` with summary cards displaying:
  - Engineer: active and inactive counts
  - System User: active and inactive counts
  - Skills: total count
  - Project Type: total count
- Updated `AdminHeader` component to support `darkMode` prop for dark gray background (matching wireframe)
- Implemented loading and error states
- Cards are responsive and display data in format matching wireframe (e.g., "80(Active)", "15(Inactive)")

### File List
**Backend Files:**
- `backend/src/main/java/com/skillbridge/dto/admin/response/AdminDashboardSummaryDTO.java` (new)
- `backend/src/main/java/com/skillbridge/service/admin/AdminDashboardService.java` (new)
- `backend/src/main/java/com/skillbridge/controller/api/admin/AdminDashboardController.java` (new)
- `backend/src/main/java/com/skillbridge/repository/auth/UserRepository.java` (modified - added countByIsActive method)

**Frontend Files:**
- `frontend/src/services/adminDashboardService.ts` (new)
- `frontend/src/app/admin/dashboard/page.tsx` (new)
- `frontend/src/components/design-patterns/admin/AdminHeader.tsx` (modified - added darkMode prop)

### Testing Notes
- Backend API endpoint ready for testing at `GET /api/admin/dashboard/summary`
- Frontend page accessible at `/admin/dashboard`
- Requires ADMIN role authentication
- All counts are calculated from database queries (no hardcoded values)

