# User Story: Admin Engineer List Management

## Story Information
- **Story ID**: Story-34
- **Title**: Admin Engineer List Management
- **Epic**: Admin Portal - Engineer Management
- **Priority**: High
- **Story Points**: 13
- **Sprint**: Sprint 9
- **Status**: Draft

## User Story

**As an** Admin  
**I want to** view and manage engineers in a list with search, pagination, and CRUD operations  
**So that** I can efficiently manage engineer profiles, skills, experience, and salary expectations across the system

## Background & Context

### Engineer Management Purpose
Engineers are core resources in the SkillBridge platform. The Admin portal needs comprehensive engineer management capabilities to:
- View all engineers in the system
- Search and filter engineers by name, skills, experience, and salary
- Create new engineer profiles
- Edit existing engineer information
- Delete engineers (with appropriate validation)
- Monitor engineer availability and status

### Current Database Schema
The `engineers` table has the following structure:
- `id`: Primary key (INT)
- `full_name`: Engineer full name (VARCHAR 255)
- `years_experience`: Years of experience (INT)
- `seniority`: Seniority level (VARCHAR 32) - e.g., Junior, Mid-level, Senior, Lead
- `summary`: Engineer summary (TEXT, nullable)
- `introduction`: Engineer introduction (TEXT, nullable)
- `location`: Location (VARCHAR 128, nullable)
- `language_summary`: Language summary (VARCHAR 64, nullable)
- `status`: Engineer status (VARCHAR 32) - e.g., AVAILABLE, BUSY, UNAVAILABLE
- `profile_image_url`: Profile image URL (VARCHAR 500, nullable)
- `salary_expectation`: Salary expectation (DECIMAL 10,2, nullable)
- `primary_skill`: Primary skill (VARCHAR 128, nullable)
- `created_at`: Creation timestamp (TIMESTAMP)
- `updated_at`: Last update timestamp (TIMESTAMP)

### Engineer Skills Relationship
Engineers have a many-to-many relationship with skills through the `engineer_skills` table:
- `engineer_id`: Reference to engineer (INT)
- `skill_id`: Reference to skill (INT)
- `level`: Skill level (VARCHAR 32) - e.g., Beginner, Intermediate, Advanced
- `years`: Years of experience with this skill (INT)

For the list view, the "Main Skill" column should display the primary skill or a comma-separated list of main skills from the engineer_skills relationship.

## Acceptance Criteria

### Primary Acceptance Criteria

#### Page Layout (Based on Wireframe)

- [ ] **Left Sidebar**:
  - [ ] "SKILL BRIDGE" logo/title at the top of sidebar
  - [ ] Navigation menu items:
    - [ ] "Dashboard" with grid icon
    - [ ] "User" with user icon
    - [ ] "Engineer" with group icon (highlighted/active when on this page)
    - [ ] "Master Data" with folder icon (expandable)
      - [ ] "Skill"
      - [ ] "Project Types"
  - [ ] Sidebar has dark gray background
  - [ ] Active menu item is highlighted in blue

- [ ] **Top Header Bar**:
  - [ ] Header bar has white background with border
  - [ ] Page title "Engineer" or appropriate title displayed on the left
  - [ ] User information displayed on the right:
    - [ ] User icon
    - [ ] User name ("Admin" or actual admin name)
  - [ ] Language switcher in header

- [ ] **Main Content Area**:
  - [ ] White background area occupying remaining screen space
  - [ ] Content is properly spaced from sidebar and header
  - [ ] Single-column layout with Engineers table
  - [ ] Responsive layout for different screen sizes

#### Engineers Table

- [ ] **Table Header**:
  - [ ] Columns: "No", "Name", "Main Skill", "Experience", "Salary Expectation", "Action"
  - [ ] Headers are styled consistently with dark text
  - [ ] Table is responsive and scrollable if needed

- [ ] **Search Bar**:
  - [ ] Search input field with magnifying glass icon
  - [ ] Placeholder text: "Search"
  - [ ] Located above the table on the left
  - [ ] Real-time filtering as user types (debounced search)
  - [ ] Searches across engineer name, main skill, and other relevant fields

- [ ] **Create Button**:
  - [ ] Button labeled "+ Create new" located above the table on the right
  - [ ] Has black/outline border styling
  - [ ] Opens "Create Engineer" modal when clicked

- [ ] **Table Rows**:
  - [ ] Each row displays:
    - [ ] **No**: Sequential number starting from 1 (based on current page)
    - [ ] **Name**: Engineer full name (e.g., "Nguyen Van A")
    - [ ] **Main Skill**: Primary skill or comma-separated list of main skills (e.g., "Backend, Java" or "Mobile, iOS")
    - [ ] **Experience**: Years of experience with format "X yrs" (e.g., "5 yrs")
    - [ ] **Salary Expectation**: Salary with currency format (e.g., "¥ 35,0000" or "¥ 3,500,000")
    - [ ] **Action**: Edit icon (pencil) and Delete icon (trash can)
  - [ ] Rows are styled consistently
  - [ ] Rows alternate colors for better readability (striped table)
  - [ ] Rows are hoverable with visual feedback

- [ ] **Action Column**:
  - [ ] Edit icon (pencil) for each row
  - [ ] Delete icon (trash can) for each row
  - [ ] Icons are clickable and trigger respective actions
  - [ ] Icons have hover effects

- [ ] **Pagination**:
  - [ ] Pagination controls displayed at bottom right of table
  - [ ] Shows page numbers (e.g., "1 2 3 4 5")
  - [ ] Current page is highlighted
  - [ ] Previous/Next buttons if needed
  - [ ] Default page size: 10-20 items per page
  - [ ] Total number of engineers displayed if applicable

#### Create Engineer Modal

- [ ] **Modal Structure**:
  - [ ] Modal title: "Create new Engineer"
  - [ ] Modal has standard dialog structure (header, body, footer)
  - [ ] Modal is centered on screen
  - [ ] Modal can be closed by clicking outside or close button

- [ ] **Form Fields** (detailed in separate story for create/edit):
  - [ ] Full Name (required)
  - [ ] Years of Experience (required)
  - [ ] Seniority (dropdown: Junior, Mid-level, Senior, Lead)
  - [ ] Primary Skill (dropdown/autocomplete from skills table)
  - [ ] Salary Expectation (optional)
  - [ ] Location (optional)
  - [ ] Status (dropdown: AVAILABLE, BUSY, UNAVAILABLE)
  - [ ] Summary (textarea, optional)
  - [ ] Introduction (textarea, optional)
  - [ ] Profile Image URL (optional)

- [ ] **Form Actions**:
  - [ ] "Cancel" button to close modal
  - [ ] "Save" button to create engineer
  - [ ] Form validation with error messages
  - [ ] Loading state during save

**Note**: The detailed Create/Edit Engineer modal design will be covered in a separate story. This story focuses on the list view and basic CRUD operations.

#### Edit Engineer Modal

- [ ] **Modal Structure**:
  - [ ] Modal title: "Edit Engineer"
  - [ ] Modal has same structure as Create modal
  - [ ] All form fields are pre-filled with existing engineer data

- [ ] **Form Fields**:
  - [ ] Same fields as Create modal, pre-filled with current values

- [ ] **Form Actions**:
  - [ ] "Cancel" button to close modal without saving
  - [ ] "Save" button to update engineer
  - [ ] Form validation with error messages
  - [ ] Loading state during save

**Note**: Detailed edit functionality will be covered in a separate story.

#### Delete Engineer Confirmation

- [ ] **Delete Dialog**:
  - [ ] Confirmation dialog appears when Delete icon is clicked
  - [ ] Dialog shows engineer name in confirmation message
  - [ ] Message: "Are you sure you want to delete [Engineer Name]?"
  - [ ] "Cancel" button to close dialog
  - [ ] "Delete" button to confirm deletion
  - [ ] Loading state during deletion

- [ ] **Delete Validation**:
  - [ ] Check if engineer is associated with any contracts or active engagements
  - [ ] If associated, show error message and prevent deletion
  - [ ] Error message: "Cannot delete engineer. Engineer is associated with active contracts or engagements."

### Detailed Acceptance Criteria

#### Search Functionality

- [ ] **Search Implementation**:
  - [ ] Search is case-insensitive
  - [ ] Search debounce: 500ms delay after user stops typing
  - [ ] Search queries name field (full_name)
  - [ ] Search queries primary skill field
  - [ ] Search can be extended to query skills through engineer_skills relationship
  - [ ] Empty search shows all engineers
  - [ ] Search results update table in real-time
  - [ ] Search state persists during pagination

#### Pagination Functionality

- [ ] **Pagination Implementation**:
  - [ ] Default page size: 10-20 engineers per page
  - [ ] Page numbers are clickable
  - [ ] Current page is visually highlighted
  - [ ] Pagination resets to page 1 when search query changes
  - [ ] Pagination shows total number of pages
  - [ ] "No results" message when search returns no engineers
  - [ ] Pagination controls are disabled when loading

#### Data Display

- [ ] **No Column**:
  - [ ] Sequential numbering starting from 1 on each page
  - [ ] Formula: (page - 1) * pageSize + rowIndex + 1

- [ ] **Name Column**:
  - [ ] Displays full_name from engineers table
  - [ ] Truncated with ellipsis if too long (with tooltip showing full name)

- [ ] **Main Skill Column**:
  - [ ] Displays primary_skill if available
  - [ ] Or displays comma-separated list of top skills from engineer_skills
  - [ ] Format: "Skill1, Skill2, Skill3"
  - [ ] Shows "N/A" if no skills assigned
  - [ ] Truncated with ellipsis if too long (with tooltip)

- [ ] **Experience Column**:
  - [ ] Displays years_experience from engineers table
  - [ ] Format: "X yrs" (e.g., "5 yrs", "10 yrs")
  - [ ] Shows "0 yrs" if years_experience is null or 0

- [ ] **Salary Expectation Column**:
  - [ ] Displays salary_expectation from engineers table
  - [ ] Format: "¥ X,XXX,XXX" (Japanese Yen format with thousand separators)
  - [ ] Shows "N/A" if salary_expectation is null
  - [ ] Currency symbol can be configurable (default: ¥)

- [ ] **Action Column**:
  - [ ] Edit icon: Pencil icon from lucide-react or similar
  - [ ] Delete icon: Trash icon from lucide-react or similar
  - [ ] Icons are properly sized (e.g., w-4 h-4 or w-5 h-5)
  - [ ] Icons have hover effects (color change or background highlight)

#### Loading States

- [ ] **Loading Indicators**:
  - [ ] Loading spinner or skeleton loader while fetching engineers
  - [ ] Loading state during create operation
  - [ ] Loading state during update operation
  - [ ] Loading state during delete operation
  - [ ] Loading state during search
  - [ ] Disable actions during loading states

#### Error Handling

- [ ] **Error Messages**:
  - [ ] Display user-friendly error messages for API failures
  - [ ] Network error: "Network error. Please try again."
  - [ ] Server error: "An error occurred. Please try again later."
  - [ ] Validation errors shown inline in forms
  - [ ] Error messages are dismissible

#### Success Feedback

- [ ] **Success Messages**:
  - [ ] Success toast/notification after creating engineer: "Engineer created successfully"
  - [ ] Success toast/notification after updating engineer: "Engineer updated successfully"
  - [ ] Success toast/notification after deleting engineer: "Engineer deleted successfully"
  - [ ] Table refreshes automatically after successful operations

## Technical Requirements

### Frontend Requirements

#### Component Structure

- [ ] **Main Page Component**: `frontend/src/app/admin/engineer/page.tsx`
  - [ ] Imports AdminSidebar and AdminHeader components
  - [ ] Implements table, search, pagination logic
  - [ ] Manages modal states (create, edit, delete)
  - [ ] Handles data fetching and state management

- [ ] **Create Engineer Modal**: `frontend/src/components/admin/CreateEngineerModal.tsx`
  - [ ] Form component for creating new engineers
  - [ ] Form validation
  - [ ] API integration for create operation

- [ ] **Edit Engineer Modal**: `frontend/src/components/admin/EditEngineerModal.tsx`
  - [ ] Form component for editing engineers
  - [ ] Pre-fills form with existing data
  - [ ] API integration for update operation

- [ ] **Delete Confirmation Dialog**: Reuse existing `DeleteConfirmDialog.tsx` component
  - [ ] Confirmation dialog for delete operations

#### State Management

- [ ] **React Hooks**:
  - [ ] `useState` for engineers list, pagination, search, modal states
  - [ ] `useEffect` for fetching engineers on mount and search changes
  - [ ] `useCallback` for memoized functions (fetch, handleSearch, etc.)
  - [ ] `useDebounce` hook for search input debouncing

#### API Integration

- [ ] **Service File**: `frontend/src/services/adminEngineerService.ts`
  - [ ] `getAllEngineers(page: number, size: number, search?: string): Promise<EngineerListResponse>`
  - [ ] `getEngineerById(id: number): Promise<EngineerResponse>`
  - [ ] `createEngineer(request: CreateEngineerRequest): Promise<EngineerResponse>`
  - [ ] `updateEngineer(id: number, request: UpdateEngineerRequest): Promise<EngineerResponse>`
  - [ ] `deleteEngineer(id: number): Promise<void>`

#### Type Definitions

- [ ] **TypeScript Interfaces**:
  ```typescript
  interface Engineer {
    id: number;
    fullName: string;
    yearsExperience: number;
    seniority: string;
    primarySkill?: string;
    salaryExpectation?: number;
    location?: string;
    status: string;
    summary?: string;
    introduction?: string;
    profileImageUrl?: string;
    createdAt: string;
    updatedAt: string;
  }

  interface EngineerListResponse {
    content: Engineer[];
    page: {
      totalElements: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
    };
  }

  interface CreateEngineerRequest {
    fullName: string;
    yearsExperience: number;
    seniority: string;
    primarySkill?: string;
    salaryExpectation?: number;
    location?: string;
    status: string;
    summary?: string;
    introduction?: string;
    profileImageUrl?: string;
  }

  interface UpdateEngineerRequest extends CreateEngineerRequest {}
  ```

#### UI Components

- [ ] **Table Component**: Use existing Table components from `@/components/ui/table`
- [ ] **Input Component**: Use existing Input components from `@/components/ui/input`
- [ ] **Button Component**: Use existing Button components from `@/components/ui/button`
- [ ] **Dialog Component**: Use existing Dialog components from `@/components/ui/dialog`
- [ ] **Pagination**: Custom pagination component or use existing pagination library

#### Styling

- [ ] **Tailwind CSS**: Use Tailwind utility classes for styling
- [ ] **Color Scheme**: Match existing Admin portal color scheme (gray sidebar, white header/content)
- [ ] **Icons**: Use lucide-react icons (Pencil, Trash2, Search, Plus, etc.)
- [ ] **Responsive Design**: Mobile-friendly layout with responsive breakpoints

### Backend Requirements

#### REST API Endpoints

- [ ] **GET `/api/admin/engineers`** - List engineers with pagination and search
  - [ ] Query parameters:
    - [ ] `page`: Page number (default: 0)
    - [ ] `size`: Page size (default: 20)
    - [ ] `search`: Search query (optional, searches name and primary skill)
  - [ ] Response: `EngineerListResponse` with paginated engineers
  - [ ] Authentication: Requires ADMIN role
  - [ ] Authorization: Only ADMIN users can access

- [ ] **GET `/api/admin/engineers/{id}`** - Get engineer by ID
  - [ ] Path parameter: `id` (engineer ID)
  - [ ] Response: `EngineerResponse` with engineer details
  - [ ] Authentication: Requires ADMIN role
  - [ ] Authorization: Only ADMIN users can access

- [ ] **POST `/api/admin/engineers`** - Create new engineer
  - [ ] Request body: `CreateEngineerRequest`
  - [ ] Response: `EngineerResponse` with created engineer
  - [ ] Validation: Validate all required fields
  - [ ] Authentication: Requires ADMIN role
  - [ ] Authorization: Only ADMIN users can access

- [ ] **PUT `/api/admin/engineers/{id}`** - Update engineer
  - [ ] Path parameter: `id` (engineer ID)
  - [ ] Request body: `UpdateEngineerRequest`
  - [ ] Response: `EngineerResponse` with updated engineer
  - [ ] Validation: Validate all required fields
  - [ ] Authentication: Requires ADMIN role
  - [ ] Authorization: Only ADMIN users can access

- [ ] **DELETE `/api/admin/engineers/{id}`** - Delete engineer
  - [ ] Path parameter: `id` (engineer ID)
  - [ ] Response: 204 No Content on success
  - [ ] Validation: Check if engineer is associated with contracts/engagements
  - [ ] Error: 400 Bad Request if engineer cannot be deleted
  - [ ] Authentication: Requires ADMIN role
  - [ ] Authorization: Only ADMIN users can access

#### Controller

- [ ] **Controller Class**: `AdminEngineerController.java`
  - [ ] Package: `com.skillbridge.controller.api.admin`
  - [ ] Annotation: `@RestController`, `@RequestMapping("/api/admin/engineers")`
  - [ ] CORS: `@CrossOrigin(origins = "*")`
  - [ ] Methods:
    - [ ] `listEngineers(Pageable pageable, @RequestParam(required = false) String search)`
    - [ ] `getEngineer(@PathVariable Integer id)`
    - [ ] `createEngineer(@RequestBody @Valid CreateEngineerRequest request)`
    - [ ] `updateEngineer(@PathVariable Integer id, @RequestBody @Valid UpdateEngineerRequest request)`
    - [ ] `deleteEngineer(@PathVariable Integer id)`

#### Service

- [ ] **Service Class**: `AdminEngineerService.java`
  - [ ] Package: `com.skillbridge.service.admin`
  - [ ] Annotation: `@Service`
  - [ ] Methods:
    - [ ] `getAllEngineers(Pageable pageable, String search): Page<Engineer>`
    - [ ] `getEngineerById(Integer id): Engineer`
    - [ ] `createEngineer(CreateEngineerRequest request): Engineer`
    - [ ] `updateEngineer(Integer id, UpdateEngineerRequest request): Engineer`
    - [ ] `deleteEngineer(Integer id): void`

#### Repository

- [ ] **Repository Interface**: `EngineerRepository.java` (may already exist)
  - [ ] Package: `com.skillbridge.repository.engineer`
  - [ ] Extends: `JpaRepository<Engineer, Integer>`
  - [ ] Custom query methods:
    - [ ] Search by name and primary skill: `Page<Engineer> findByFullNameContainingIgnoreCaseOrPrimarySkillContainingIgnoreCase(String name, String skill, Pageable pageable)`

#### DTOs

- [ ] **Request DTOs**:
  - [ ] `CreateEngineerRequest.java`
    - [ ] Package: `com.skillbridge.dto.admin.request`
    - [ ] Fields: fullName, yearsExperience, seniority, primarySkill, salaryExpectation, location, status, summary, introduction, profileImageUrl
    - [ ] Validation annotations: `@NotBlank`, `@NotNull`, `@Min`, `@Max`, etc.

  - [ ] `UpdateEngineerRequest.java`
    - [ ] Same structure as CreateEngineerRequest

- [ ] **Response DTOs**:
  - [ ] `EngineerResponseDTO.java`
    - [ ] Package: `com.skillbridge.dto.admin.response`
    - [ ] Fields: id, fullName, yearsExperience, seniority, primarySkill, salaryExpectation, location, status, summary, introduction, profileImageUrl, createdAt, updatedAt

  - [ ] `EngineerListResponse.java`
    - [ ] Package: `com.skillbridge.dto.admin.response`
    - [ ] Fields: content (List<EngineerResponseDTO>), page (PageInfo)

#### Validation

- [ ] **Field Validation**:
  - [ ] `fullName`: Required, not blank, max 255 characters
  - [ ] `yearsExperience`: Required, not null, min 0, max 100
  - [ ] `seniority`: Required, must be one of: Junior, Mid-level, Senior, Lead
  - [ ] `primarySkill`: Optional, max 128 characters
  - [ ] `salaryExpectation`: Optional, min 0, max 999999999.99
  - [ ] `location`: Optional, max 128 characters
  - [ ] `status`: Required, must be one of: AVAILABLE, BUSY, UNAVAILABLE
  - [ ] `summary`: Optional, text field
  - [ ] `introduction`: Optional, text field
  - [ ] `profileImageUrl`: Optional, max 500 characters, URL format validation

#### Security

- [ ] **Authentication & Authorization**:
  - [ ] All endpoints require JWT authentication
  - [ ] Only users with ADMIN role can access endpoints
  - [ ] Use Spring Security configuration to protect routes
  - [ ] Add to SecurityConfig: `.requestMatchers("/api/admin/engineers/**").hasRole("ADMIN")`

### Database Requirements

#### Existing Schema

- [ ] **engineers Table**:
  - [ ] Already exists with required columns
  - [ ] No schema changes needed for list functionality

- [ ] **engineer_skills Table**:
  - [ ] Already exists for many-to-many relationship
  - [ ] Used for fetching main skills for display

#### Query Optimization

- [ ] **Indexes**:
  - [ ] Ensure indexes exist on:
    - [ ] `engineers.full_name` for search performance
    - [ ] `engineers.primary_skill` for search performance
    - [ ] `engineers.status` for filtering
  - [ ] Index on `engineer_skills.engineer_id` for join performance

#### Data Integrity

- [ ] **Delete Constraints**:
  - [ ] Check `sow_engaged_engineers` table for active engagements
  - [ ] Check `change_request_engaged_engineers` table for change request associations
  - [ ] Check `sow_engaged_engineers_base` table for base engineer associations
  - [ ] Prevent deletion if engineer is associated with any contracts or engagements
  - [ ] Return appropriate error message if deletion is not allowed

## Implementation Guidelines

### Frontend Implementation

#### Page Component Structure

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/design-patterns/admin/AdminSidebar';
import AdminHeader from '@/components/design-patterns/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { getAllEngineers, deleteEngineer, Engineer } from '@/services/adminEngineerService';
import { useDebounce } from '@/hooks/useDebounce';
import CreateEngineerModal from '@/components/admin/CreateEngineerModal';
import EditEngineerModal from '@/components/admin/EditEngineerModal';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';

export default function AdminEngineerListPage() {
  // State management
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingEngineer, setEditingEngineer] = useState<Engineer | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  
  const debouncedSearch = useDebounce(search, 500);
  
  // Fetch engineers
  const fetchEngineers = useCallback(async () => {
    // Implementation
  }, [page, debouncedSearch]);
  
  // Handle create, edit, delete operations
  // Render table and modals
}
```

#### Service Implementation

```typescript
// frontend/src/services/adminEngineerService.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export interface Engineer {
  id: number;
  fullName: string;
  yearsExperience: number;
  seniority: string;
  primarySkill?: string;
  salaryExpectation?: number;
  location?: string;
  status: string;
  summary?: string;
  introduction?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EngineerListResponse {
  content: Engineer[];
  page: {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export async function getAllEngineers(
  page: number = 0,
  size: number = 20,
  search?: string
): Promise<EngineerListResponse> {
  const token = localStorage.getItem('token');
  const params: any = { page, size };
  if (search) params.search = search;
  
  const response = await axios.get(`${API_BASE_URL}/api/admin/engineers`, {
    headers: { Authorization: `Bearer ${token}` },
    params
  });
  
  return response.data;
}

// Other CRUD functions...
```

### Backend Implementation

#### Controller Example

```java
@RestController
@RequestMapping("/api/admin/engineers")
@CrossOrigin(origins = "*")
public class AdminEngineerController {
    
    @Autowired
    private AdminEngineerService adminEngineerService;
    
    @GetMapping
    public ResponseEntity<EngineerListResponse> listEngineers(
            Pageable pageable,
            @RequestParam(required = false) String search) {
        Page<Engineer> engineers = adminEngineerService.getAllEngineers(pageable, search);
        EngineerListResponse response = convertToResponse(engineers);
        return ResponseEntity.ok(response);
    }
    
    // Other methods...
}
```

#### Service Example

```java
@Service
public class AdminEngineerService {
    
    @Autowired
    private EngineerRepository engineerRepository;
    
    public Page<Engineer> getAllEngineers(Pageable pageable, String search) {
        if (search != null && !search.trim().isEmpty()) {
            return engineerRepository.findByFullNameContainingIgnoreCaseOrPrimarySkillContainingIgnoreCase(
                search, search, pageable);
        }
        return engineerRepository.findAll(pageable);
    }
    
    // Other methods...
}
```

## Testing Requirements

### Unit Tests

- [ ] **Frontend Unit Tests**:
  - [ ] Test page component rendering
  - [ ] Test search functionality
  - [ ] Test pagination logic
  - [ ] Test modal open/close states
  - [ ] Test form validation

- [ ] **Backend Unit Tests**:
  - [ ] Test service methods
  - [ ] Test repository queries
  - [ ] Test DTO validation
  - [ ] Test delete validation logic

### Integration Tests

- [ ] **API Integration Tests**:
  - [ ] Test GET /api/admin/engineers with pagination
  - [ ] Test GET /api/admin/engineers with search
  - [ ] Test POST /api/admin/engineers (create)
  - [ ] Test PUT /api/admin/engineers/{id} (update)
  - [ ] Test DELETE /api/admin/engineers/{id} (delete)
  - [ ] Test authentication and authorization

### End-to-End Tests

- [ ] **E2E Test Scenarios**:
  - [ ] User can view engineers list
  - [ ] User can search engineers
  - [ ] User can paginate through engineers
  - [ ] User can create new engineer
  - [ ] User can edit engineer
  - [ ] User can delete engineer
  - [ ] User cannot delete engineer with active contracts

## Performance Requirements

- [ ] **Page Load Time**: Engineers list should load within 2 seconds
- [ ] **Search Response Time**: Search results should appear within 500ms after typing stops
- [ ] **Pagination**: Should handle up to 10,000 engineers efficiently
- [ ] **Table Rendering**: Should render up to 100 rows without performance issues
- [ ] **API Response Time**: Backend API should respond within 500ms for list queries

## Security Considerations

- [ ] **Authentication**: All endpoints require valid JWT token
- [ ] **Authorization**: Only ADMIN role can access endpoints
- [ ] **Input Validation**: All inputs are validated on both frontend and backend
- [ ] **SQL Injection Prevention**: Use parameterized queries and JPA methods
- [ ] **XSS Prevention**: Sanitize user inputs before displaying
- [ ] **CSRF Protection**: Use CSRF tokens for state-changing operations

## Deployment Requirements

- [ ] **Environment Variables**: Configure API base URL
- [ ] **Database Migration**: No new migrations needed (using existing tables)
- [ ] **Build Configuration**: Ensure frontend and backend build successfully
- [ ] **Error Logging**: Implement proper error logging and monitoring

## Definition of Done

- [ ] All acceptance criteria are met
- [ ] Code is reviewed and approved
- [ ] Unit tests are written and passing
- [ ] Integration tests are written and passing
- [ ] E2E tests are written and passing
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] Responsive design works on mobile devices
- [ ] Multi-language support is implemented (if required)
- [ ] Performance requirements are met
- [ ] Security requirements are met

## Dependencies

### Internal Dependencies

- [ ] Admin authentication system (already implemented)
- [ ] AdminSidebar component (already implemented)
- [ ] AdminHeader component (already implemented)
- [ ] DeleteConfirmDialog component (already implemented)
- [ ] Engineer entity and repository (already exists)

### External Dependencies

- [ ] React/Next.js for frontend
- [ ] Spring Boot for backend
- [ ] MySQL database
- [ ] JWT authentication library

## Risks and Mitigation

### Risks

1. **Performance Issues with Large Datasets**: 
   - Risk: Table may slow down with 10,000+ engineers
   - Mitigation: Implement pagination, virtual scrolling, and database indexing

2. **Complex Delete Validation**:
   - Risk: Engineer deletion requires checking multiple tables
   - Mitigation: Create reusable service method for delete validation

3. **Search Performance**:
   - Risk: Full-text search across multiple fields may be slow
   - Mitigation: Add database indexes and optimize queries

### Mitigation Strategies

- [ ] Implement database indexing on searchable fields
- [ ] Use pagination to limit data fetched at once
- [ ] Implement debounced search to reduce API calls
- [ ] Add caching for frequently accessed data
- [ ] Monitor API response times and optimize queries

## Success Metrics

### Business Metrics

- [ ] Admin can view all engineers in under 2 seconds
- [ ] Admin can search and find engineers quickly
- [ ] Admin can create/edit/delete engineers without errors
- [ ] Zero data loss during CRUD operations

### Technical Metrics

- [ ] API response time < 500ms for list queries
- [ ] Page load time < 2 seconds
- [ ] Zero critical bugs in production
- [ ] 100% test coverage for critical paths

## Future Enhancements

### Planned Improvements

- [ ] Advanced filtering (by status, seniority, salary range, location)
- [ ] Bulk operations (bulk delete, bulk status update)
- [ ] Export functionality (CSV, Excel)
- [ ] Engineer detail view page
- [ ] Skills management per engineer
- [ ] Profile image upload functionality
- [ ] Activity history/audit log
- [ ] Advanced search with multiple criteria

### Notes

- Detailed Create/Edit Engineer modals will be covered in separate stories (Story-35)
- Engineer detail view will be covered in a separate story
- Skills management for engineers will be covered in a separate story

---

**Document Control**
- **Version**: 1.0
- **Last Updated**: December 2024
- **Next Review**: January 2025
- **Approved By**: System Management Team
- **Distribution**: Development Team, Product Team, Management

