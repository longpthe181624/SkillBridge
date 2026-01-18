# User Story: Admin Master Data Project Type Management

## Story Information
- **Story ID**: Story-33
- **Title**: Admin Master Data Project Type Management
- **Epic**: Admin Portal - Master Data Management
- **Priority**: High
- **Story Points**: 8
- **Sprint**: Sprint 9
- **Status**: Draft

## User Story

**As an** Admin  
**I want to** manage project types in the Master Data section  
**So that** I can organize and maintain the project type taxonomy used across the system for categorizing projects and opportunities

## Background & Context

### Project Type Purpose
Project Types are used to categorize projects and opportunities in the system. Examples include:
- Game Development
- Healthcare/Medical
- Mobile app
- AI
- Back-end
- Front-end
- UI/UX Design
- Cloud
- Testing

### Current Database Schema
Based on the system architecture, project types will need a table structure similar to skills:
- `id`: Primary key
- `name`: Project type name (VARCHAR 128)
- `description`: Project type description (TEXT, nullable)

**Note**: The project_types table may not exist yet. This story includes creating the table structure if needed.

## Acceptance Criteria

### Primary Acceptance Criteria

#### Page Layout (Based on Wireframe)

- [ ] **Left Sidebar**:
  - [ ] "SKILL BRIDGE" logo/title at the top of sidebar
  - [ ] Navigation menu items:
    - [ ] "Dashboard" with grid icon
    - [ ] "User" with user icon
    - [ ] "Engineer" with group icon
    - [ ] "Master Data" with folder icon (expandable, currently expanded)
      - [ ] "Skill"
      - [ ] "Project Types" (highlighted/active when on this page)
  - [ ] Sidebar has dark gray background
  - [ ] Active menu item is highlighted in lighter gray

- [ ] **Top Header Bar**:
  - [ ] Header bar has dark gray background
  - [ ] "SKILL BRIDGE" displayed on the left in white text
  - [ ] Page title "Master Data" displayed next to SKILL BRIDGE in white text
  - [ ] User information displayed on the right:
    - [ ] User icon/avatar
    - [ ] "Admin" label
  - [ ] Header is sticky/static at top

- [ ] **Main Content Area**:
  - [ ] White background area occupying remaining screen space
  - [ ] Content is properly spaced from sidebar and header
  - [ ] Single-column layout with Project Types table
  - [ ] Responsive layout for different screen sizes

#### Project Types Table

- [ ] **Table Header**:
  - [ ] Columns: "No", "Name", "Description", "Action"
  - [ ] Headers are styled consistently with dark text

- [ ] **Search Bar**:
  - [ ] Search input field with magnifying glass icon
  - [ ] Placeholder text: "Search"
  - [ ] Located above the table on the left
  - [ ] Real-time filtering as user types
  - [ ] Searches in both project type name and description

- [ ] **Create Button**:
  - [ ] Button labeled "+ Create new" located above the table on the right
  - [ ] Has black border styling
  - [ ] Opens "Create new Project Type" modal when clicked

- [ ] **Table Rows**:
  - [ ] Each row displays: No (sequential number), Name, Description, Action icons
  - [ ] Rows are styled consistently
  - [ ] Rows alternate colors for better readability
  - [ ] Example rows shown in wireframe:
    - [ ] Row 1: "1", "Game Development", "Lorem Ipsum is simply dummy text"
    - [ ] Row 2: "2", "Healthcare/Medical", "Lorem Ipsum is simply dummy text"
    - [ ] Row 3: "3", "Healthcare/Medical", "Lorem Ipsum is simply dummy text"
    - [ ] Row 4: "4", "Healthcare/Medical", "Lorem Ipsum is simply dummy text"

- [ ] **Action Column**:
  - [ ] Edit icon (pencil in square) for each row
  - [ ] Delete icon (trash can) for each row
  - [ ] Icons are clickable and trigger respective actions

- [ ] **Pagination**:
  - [ ] Pagination controls displayed at bottom of table on the right
  - [ ] Shows page numbers (e.g., "1 2 3 4 5")
  - [ ] Current page is highlighted
  - [ ] Default page size: 10-20 items per page

#### Create Project Type Modal

- [ ] **Modal Title**: "Create new Project Type"

- [ ] **Project Type Name Field**:
  - [ ] Label: "Project Type Name"
  - [ ] Input type: Text
  - [ ] Placeholder: "Mobile app" (example)
  - [ ] Required validation
  - [ ] Max length: 128 characters

- [ ] **Description Field**:
  - [ ] Label: "Description"
  - [ ] Input type: Textarea (multi-line)
  - [ ] Placeholder: "Mobile app" (example)
  - [ ] Optional field
  - [ ] Supports multi-line text

- [ ] **Action Buttons**:
  - [ ] "Cancel" button (outlined button) - closes modal without saving
  - [ ] "Save" button (darker, filled button with prominent outline) - saves project type

- [ ] **Validation**:
  - [ ] Project type name is required
  - [ ] Project type name must be unique (cannot duplicate existing project type name)
  - [ ] Error messages displayed for validation failures

#### Edit Project Type Modal

- [ ] **Modal Title**: "Edit Project Type"

- [ ] **Modal Layout**:
  - [ ] Same structure as "Create new Project Type" modal
  - [ ] All fields are pre-filled with existing project type data

- [ ] **Project Type Name Field**:
  - [ ] Pre-filled with current project type name
  - [ ] Editable
  - [ ] Required validation
  - [ ] Max length: 128 characters

- [ ] **Description Field**:
  - [ ] Pre-filled with current description (if exists)
  - [ ] Editable
  - [ ] Optional field
  - [ ] Supports multi-line text

- [ ] **Action Buttons**:
  - [ ] "Cancel" button - closes modal without saving changes
  - [ ] "Save" button - updates project type

- [ ] **Validation**:
  - [ ] Project type name is required
  - [ ] Project type name must be unique (excluding current project type)
  - [ ] Error messages displayed for validation failures

#### Delete Functionality

- [ ] **Delete Project Type**:
  - [ ] Confirmation dialog before deletion
  - [ ] Warning message: "Are you sure you want to delete this project type?"
  - [ ] If project type is used by opportunities/projects, show warning and prevent deletion or require handling
  - [ ] Success message after successful deletion
  - [ ] Table refreshes after deletion

#### Search and Filtering

- [ ] **Search Functionality**:
  - [ ] Search input filters project types in real-time as user types
  - [ ] Searches in project type name (case-insensitive)
  - [ ] Searches in description (case-insensitive) if description field exists
  - [ ] Search is debounced to avoid excessive API calls
  - [ ] Clear search button (X icon) appears when search has text

## Technical Requirements

### Frontend Requirements

- [ ] **Component Structure**:
  - [ ] `AdminMasterDataProjectTypePage` component as main page component at `frontend/src/app/admin/master-data/project-type/page.tsx`
  - [ ] `ProjectTypesTable` component for project types table
  - [ ] `ProjectTypeRow` component for individual project type rows
  - [ ] `CreateProjectTypeModal` component for create project type modal
  - [ ] `EditProjectTypeModal` component for edit project type modal
  - [ ] `DeleteProjectTypeDialog` component for delete confirmation

- [ ] **State Management**:
  - [ ] Use React hooks (useState, useEffect) for data fetching
  - [ ] Manage loading, error, and success states
  - [ ] Manage modal open/close states
  - [ ] Manage form data states for create/edit modals

- [ ] **Styling**:
  - [ ] Use Tailwind CSS for styling
  - [ ] Match wireframe design exactly
  - [ ] Dark gray sidebar (#4B5563 or similar)
  - [ ] White main content area
  - [ ] Consistent spacing and padding
  - [ ] Responsive breakpoints for mobile/tablet

- [ ] **Data Formatting**:
  - [ ] Display project type names and descriptions properly
  - [ ] Handle empty descriptions gracefully
  - [ ] Format table rows with proper alignment

### Backend Requirements

- [ ] **Database Schema**:
  - [ ] Create `project_types` table if it doesn't exist
  - [ ] Columns: `id` (INT PRIMARY KEY AUTO_INCREMENT), `name` (VARCHAR 128 UNIQUE NOT NULL), `description` (TEXT NULL)
  - [ ] Create migration script: `VXX__create_project_types_table.sql`
  - [ ] Create ProjectType entity class

- [ ] **API Endpoints**:
  - [ ] `GET /api/admin/master-data/project-types` - Returns list of project types
    - [ ] Query parameters: `page`, `size`, `search`
    - [ ] Response includes: id, name, description, pagination info
    - [ ] Supports search by name and description
  - [ ] `POST /api/admin/master-data/project-types` - Creates a new project type
    - [ ] Request body: name (required), description (optional)
    - [ ] Response includes: created project type
  - [ ] `PUT /api/admin/master-data/project-types/{id}` - Updates a project type
    - [ ] Request body: name (required), description (optional)
    - [ ] Response includes: updated project type
  - [ ] `DELETE /api/admin/master-data/project-types/{id}` - Deletes a project type
    - [ ] Validates if project type is used by opportunities/projects before deletion
    - [ ] Returns error if project type is in use

- [ ] **Service Layer**:
  - [ ] `AdminProjectTypeService` to handle all project type operations
  - [ ] Methods:
    - [ ] `getAllProjectTypes(pageable, search)` - Get paginated project types with search
    - [ ] `createProjectType(projectTypeRequest)` - Create project type
    - [ ] `updateProjectType(projectTypeId, projectTypeRequest)` - Update project type
    - [ ] `deleteProjectType(projectTypeId)` - Delete project type with validation
    - [ ] `isProjectTypeInUse(projectTypeId)` - Check if project type is used by opportunities/projects

- [ ] **Repository Layer**:
  - [ ] `ProjectTypeRepository` extends JpaRepository<ProjectType, Integer>
  - [ ] Methods:
    - [ ] `findByNameContainingIgnoreCase(search, Pageable)` - Search project types
    - [ ] `findByName(name)` - Find project type by name
    - [ ] `existsByName(name)` - Check if project type name exists

- [ ] **Validation**:
  - [ ] Project type name must be unique
  - [ ] Project type name is required and max 128 characters
  - [ ] Description is optional and can be multi-line text
  - [ ] Validate project type exists before update/delete

### Database Requirements

- [ ] **Schema Creation**:
  - [ ] Create `project_types` table with columns: id, name, description
  - [ ] Make name unique and not null
  - [ ] Make description nullable
  - [ ] Migration script: `VXX__create_project_types_table.sql`

- [ ] **Data Integrity**:
  - [ ] Unique constraint on `name` column
  - [ ] Check if project type is used before allowing deletion

- [ ] **Indexes**:
  - [ ] Index on `name` for efficient search and uniqueness checks
  - [ ] Full-text index on `description` (if supported) for search functionality

### API Response Models

#### Get Project Types Response
```json
{
  "content": [
    {
      "id": 1,
      "name": "Game Development",
      "description": "Lorem Ipsum is simply dummy text"
    },
    {
      "id": 2,
      "name": "Healthcare/Medical",
      "description": "Lorem Ipsum is simply dummy text"
    }
  ],
  "page": {
    "number": 0,
    "size": 20,
    "totalElements": 4,
    "totalPages": 1
  }
}
```

#### Create Project Type Request
```json
{
  "name": "Mobile app",
  "description": "Mobile app"
}
```

#### Update Project Type Request
```json
{
  "name": "Mobile app",
  "description": "Mobile app"
}
```

#### Error Response
```json
{
  "message": "Project type name already exists",
  "field": "name",
  "code": "DUPLICATE_PROJECT_TYPE_NAME"
}
```

## Implementation Guidelines

### Database Migration

1. Create migration script to create project_types table:
```sql
-- VXX__create_project_types_table.sql
CREATE TABLE IF NOT EXISTS project_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(128) UNIQUE NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_project_types_name ON project_types(name);
```

### Entity Creation

1. Create `ProjectType.java` entity:
```java
@Entity
@Table(name = "project_types")
public class ProjectType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 128, unique = true, nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Getters and Setters
}
```

### Frontend Implementation Flow

1. **Page Load**:
   - Fetch project types (first page)
   - Display in table
   - No project type selected initially

2. **Create Project Type**:
   - Open Create Project Type modal
   - Fill form (name, description)
   - On save: POST to create endpoint
   - Refresh table after successful creation
   - Show success message

3. **Edit Project Type**:
   - Open Edit Project Type modal with pre-filled data
   - Allow editing name and description
   - On save: PUT to update endpoint
   - Refresh table after successful update

4. **Delete Project Type**:
   - Show confirmation dialog
   - Check if project type is in use
   - DELETE request
   - Refresh table after successful deletion
   - Show success message

5. **Search**:
   - Debounce search input
   - Filter results in real-time
   - Update pagination based on search results

## Testing Requirements

- [ ] **Unit Tests**:
  - [ ] Service layer tests for all CRUD operations
  - [ ] Repository layer tests for queries
  - [ ] Validation tests for unique names

- [ ] **Integration Tests**:
  - [ ] API endpoint tests for all endpoints
  - [ ] Database transaction tests
  - [ ] Error handling tests

- [ ] **Frontend Tests**:
  - [ ] Component rendering tests
  - [ ] Form validation tests
  - [ ] Modal open/close tests

- [ ] **E2E Tests**:
  - [ ] Complete flow: Create project type → Edit → Delete
  - [ ] Search functionality
  - [ ] Pagination
  - [ ] Error scenarios

## Open Questions / Decisions Needed

1. **Database Table**: Confirm if project_types table needs to be created or already exists
2. **In-Use Validation**: How to handle project types that are in use by opportunities/projects? Prevent deletion or allow with warning?
3. **Relationship**: Should project types be linked to opportunities table? If yes, need foreign key constraint
4. **Default Project Types**: Should we seed initial project types, or start with empty table?

## Dependencies

- Story-31: Admin Login Authentication (must be completed first)
- Story-32: Admin Master Data Skill Management (for reference implementation pattern)
- Admin Portal layout/sidebar (if not already created)
- User authentication and role-based access control

## Notes

- This story focuses on simple CRUD operations for project types (list, create, update, delete)
- Unlike skills, project types do not have sub-types, so the implementation is simpler
- Consider adding audit logging for project type create/update/delete operations for compliance and tracking purposes
- Future enhancements could include project type categories or tags

