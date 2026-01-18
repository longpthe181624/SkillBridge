# User Story: Admin Master Data Skill Management

## Story Information
- **Story ID**: Story-32
- **Title**: Admin Master Data Skill Management
- **Epic**: Admin Portal - Master Data Management
- **Priority**: High
- **Story Points**: 13
- **Sprint**: Sprint 9
- **Status**: Draft

## User Story

**As an** Admin  
**I want to** manage skills and sub-skills for engineers in the Master Data section  
**So that** I can organize and maintain the skill taxonomy used for engineer profiles, search, and matching across the system

## Background & Context

### Skill Structure
Skills in the system are organized in a hierarchical structure:
- **Parent Skills**: Top-level skills (e.g., Mobile App, Back-end, Front-end, UI/UX Design, Cloud, Testing, AI)
- **Sub Skills**: Child skills belonging to a parent skill (e.g., iOS (Swift), Android (Kotlin), Flutter, React Native under Mobile App)

### Current Database Schema
The `skills` table currently has:
- `id`: Primary key
- `name`: Skill name (VARCHAR 128)
- `parent_skill_id`: Reference to parent skill (nullable for parent skills, set for sub-skills)

### Note on Description Field
The wireframe shows a "Description" field in the skills table and create/edit modals. The current `skills` table does not have a `description` column. This story includes adding the `description` field to support the wireframe requirements.

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
      - [ ] "Skill" (highlighted/active when on this page)
      - [ ] "Project Types"
  - [ ] Sidebar has dark gray background
  - [ ] Active menu item is highlighted in lighter gray

- [ ] **Top Header Bar**:
  - [ ] Header bar has dark gray background
  - [ ] Page title "Master Data" displayed on the left in white text
  - [ ] User information displayed on the right:
    - [ ] User icon/avatar
    - [ ] "Admin" label
  - [ ] Header is sticky/static at top

- [ ] **Main Content Area**:
  - [ ] White background area occupying remaining screen space
  - [ ] Content is properly spaced from sidebar and header
  - [ ] Two-column layout: Skills table (left) and Sub Skills panel (right)
  - [ ] Responsive layout for different screen sizes

#### Skills Table (Left Panel)

- [ ] **Table Header**:
  - [ ] Columns: "No", "Name", "Description", "Action"
  - [ ] Headers are styled consistently with dark text

- [ ] **Search Bar**:
  - [ ] Search input field labeled "Search skill" with magnifying glass icon
  - [ ] Located above the table on the left
  - [ ] Real-time filtering as user types
  - [ ] Searches in both skill name and description

- [ ] **Create Button**:
  - [ ] Button labeled "+ Create new" located above the table on the right
  - [ ] Opens "Create Skill" modal when clicked

- [ ] **Table Rows**:
  - [ ] Each row displays: No (sequential number), Name, Description, Action icons
  - [ ] Rows are clickable and highlight when selected
  - [ ] When a row is clicked, Sub Skills panel shows sub-skills for that skill
  - [ ] Selected row has visual indication (highlighted background)
  - [ ] Rows alternate colors for better readability

- [ ] **Action Column**:
  - [ ] Edit icon (pencil) for each row
  - [ ] Delete icon (trash can) for each row
  - [ ] Icons are clickable and trigger respective actions

- [ ] **Pagination**:
  - [ ] Pagination controls displayed at bottom of table
  - [ ] Shows page numbers (e.g., "1 2 3 4 5")
  - [ ] Current page is highlighted
  - [ ] Default page size: 10-20 items per page

#### Sub Skills Panel (Right Panel)

- [ ] **Panel Header**:
  - [ ] Title "Sub Skill" displayed at the top
  - [ ] Only visible when a skill row is selected

- [ ] **Sub Skills List**:
  - [ ] Displays list of sub-skills for the selected parent skill
  - [ ] Each sub-skill item shows:
    - [ ] Sub-skill name (e.g., "iOS (Swift)", "Android (Kotlin)", "Flutter", "React Native")
    - [ ] Edit icon (pencil)
    - [ ] Delete icon (trash can)
  - [ ] Empty state when no sub-skills exist for selected skill

- [ ] **Create Sub Skill Button**:
  - [ ] Button labeled "+ Create new Sub Skill" at the bottom of the panel
  - [ ] Opens "Create Sub Skill" modal when clicked
  - [ ] Parent skill is pre-filled in the modal

#### Create Skill Modal

- [ ] **Modal Title**: "Create Skill"

- [ ] **Skill Name Field**:
  - [ ] Label: "Skill Name"
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

- [ ] **Sub Skills Section**:
  - [ ] Initial field labeled "Sub Skill 1"
  - [ ] Input type: Text
  - [ ] Placeholder: "Lorem Ipsum is simply dummy text" (example)
  - [ ] Add button (+) to add more sub-skill fields
  - [ ] Remove button (-) for each additional sub-skill field
  - [ ] Can add multiple sub-skills during creation

- [ ] **Action Buttons**:
  - [ ] "Cancel" button (light gray with dark border) - closes modal without saving
  - [ ] "Save" button (dark gray background with white text) - saves skill and sub-skills

- [ ] **Validation**:
  - [ ] Skill name is required
  - [ ] Skill name must be unique (cannot duplicate existing skill name)
  - [ ] Sub-skill names within same parent must be unique
  - [ ] Error messages displayed for validation failures

#### Create Sub Skill Modal

- [ ] **Modal Title**: "Create Sub Skill"

- [ ] **Parent Skill Field**:
  - [ ] Label: "Parent Skill"
  - [ ] Input type: Text (read-only, pre-filled)
  - [ ] Shows name of parent skill (e.g., "Mobile app")
  - [ ] Cannot be edited in this modal

- [ ] **Skill Name Field**:
  - [ ] Label: "Skill Name"
  - [ ] Input type: Text
  - [ ] Placeholder: "Flutter" (example)
  - [ ] Required validation
  - [ ] Max length: 128 characters

- [ ] **Action Buttons**:
  - [ ] "Cancel" button (light gray with dark border) - closes modal without saving
  - [ ] "Save" button (dark gray background with white text) - saves sub-skill

- [ ] **Validation**:
  - [ ] Skill name is required
  - [ ] Skill name must be unique within the same parent skill
  - [ ] Error messages displayed for validation failures

#### Edit Skill Modal

- [ ] **Modal Title**: "Edit Skill"

- [ ] **Modal Layout**:
  - [ ] Same structure as "Create Skill" modal
  - [ ] All fields are pre-filled with existing skill data

- [ ] **Skill Name Field**:
  - [ ] Pre-filled with current skill name
  - [ ] Editable
  - [ ] Required validation
  - [ ] Max length: 128 characters

- [ ] **Description Field**:
  - [ ] Pre-filled with current description (if exists)
  - [ ] Editable
  - [ ] Optional field
  - [ ] Supports multi-line text

- [ ] **Sub Skills Section**:
  - [ ] Displays all existing sub-skills for this skill
  - [ ] Each sub-skill is editable (can modify name)
  - [ ] Can add new sub-skills using add button (+)
  - [ ] Can remove existing sub-skills using remove button (-)
  - [ ] Sub-skill names within same parent must be unique

- [ ] **Action Buttons**:
  - [ ] "Cancel" button - closes modal without saving changes
  - [ ] "Save" button - updates skill and sub-skills

- [ ] **Validation**:
  - [ ] Skill name is required
  - [ ] Skill name must be unique (excluding current skill)
  - [ ] Sub-skill names within same parent must be unique
  - [ ] Error messages displayed for validation failures

#### Edit Sub Skill Modal

- [ ] **Modal Title**: "Edit Sub Skill"

- [ ] **Modal Layout**:
  - [ ] Same structure as "Create Sub Skill" modal
  - [ ] All fields are pre-filled with existing sub-skill data

- [ ] **Parent Skill Field**:
  - [ ] Pre-filled with parent skill name
  - [ ] Read-only (cannot be changed)

- [ ] **Skill Name Field**:
  - [ ] Pre-filled with current sub-skill name
  - [ ] Editable
  - [ ] Required validation
  - [ ] Max length: 128 characters

- [ ] **Action Buttons**:
  - [ ] "Cancel" button - closes modal without saving changes
  - [ ] "Save" button - updates sub-skill

- [ ] **Validation**:
  - [ ] Skill name is required
  - [ ] Skill name must be unique within the same parent skill (excluding current sub-skill)
  - [ ] Error messages displayed for validation failures

#### Delete Functionality

- [ ] **Delete Skill**:
  - [ ] Confirmation dialog before deletion
  - [ ] Warning message: "Are you sure you want to delete this skill? This will also delete all associated sub-skills."
  - [ ] If skill has sub-skills, all sub-skills are deleted as well (cascade delete)
  - [ ] If skill is used by engineers (referenced in engineer_skills), show warning and prevent deletion or require handling
  - [ ] Success message after successful deletion
  - [ ] Table refreshes after deletion

- [ ] **Delete Sub Skill**:
  - [ ] Confirmation dialog before deletion
  - [ ] Warning message: "Are you sure you want to delete this sub-skill?"
  - [ ] If sub-skill is used by engineers, show warning and prevent deletion or require handling
  - [ ] Success message after successful deletion
  - [ ] Sub Skills panel refreshes after deletion

#### Row Selection and Sub Skills Display

- [ ] **Row Click Behavior**:
  - [ ] Clicking a skill row selects it and highlights the row
  - [ ] Sub Skills panel shows all sub-skills for the selected skill
  - [ ] Only one skill can be selected at a time
  - [ ] If no skill is selected, Sub Skills panel is empty or hidden

- [ ] **Sub Skills Loading**:
  - [ ] Sub-skills load automatically when a skill row is clicked
  - [ ] Loading indicator shown while fetching sub-skills
  - [ ] Empty state shown when no sub-skills exist for selected skill
  - [ ] Error state shown if loading fails

#### Search and Filtering

- [ ] **Search Functionality**:
  - [ ] Search input filters skills in real-time as user types
  - [ ] Searches in skill name (case-insensitive)
  - [ ] Searches in description (case-insensitive) if description field exists
  - [ ] Search is debounced to avoid excessive API calls
  - [ ] Clear search button (X icon) appears when search has text

- [ ] **Filter Behavior**:
  - [ ] Filtering does not affect selected skill
  - [ ] If selected skill is filtered out, selection is cleared and Sub Skills panel is empty

## Technical Requirements

### Frontend Requirements

- [ ] **Component Structure**:
  - [ ] `AdminMasterDataSkillPage` component as main page component at `frontend/src/app/admin/master-data/skill/page.tsx`
  - [ ] `SkillsTable` component for skills table
  - [ ] `SkillRow` component for individual skill rows
  - [ ] `SubSkillsPanel` component for sub-skills panel
  - [ ] `SubSkillItem` component for individual sub-skill items
  - [ ] `CreateSkillModal` component for create skill modal
  - [ ] `CreateSubSkillModal` component for create sub-skill modal
  - [ ] `EditSkillModal` component for edit skill modal
  - [ ] `EditSubSkillModal` component for edit sub-skill modal
  - [ ] `DeleteSkillDialog` component for delete confirmation
  - [ ] `DeleteSubSkillDialog` component for delete confirmation

- [ ] **State Management**:
  - [ ] Use React hooks (useState, useEffect) for data fetching
  - [ ] Manage loading, error, and success states
  - [ ] Manage selected skill state
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
  - [ ] Display skill names and descriptions properly
  - [ ] Handle empty descriptions gracefully
  - [ ] Format sub-skill names with proper display

### Backend Requirements

- [ ] **Database Schema Update**:
  - [ ] Add `description` column to `skills` table (TEXT, nullable)
  - [ ] Create migration script: `VXX__add_description_to_skills.sql`
  - [ ] Update Skill entity to include description field

- [ ] **API Endpoints**:
  - [ ] `GET /api/admin/master-data/skills` - Returns list of parent skills (skills with parent_skill_id IS NULL)
    - [ ] Query parameters: `page`, `size`, `search`
    - [ ] Response includes: id, name, description, pagination info
    - [ ] Supports search by name and description
  - [ ] `GET /api/admin/master-data/skills/{skillId}/sub-skills` - Returns sub-skills for a parent skill
    - [ ] Response includes: id, name, parentSkillId
  - [ ] `POST /api/admin/master-data/skills` - Creates a new skill
    - [ ] Request body: name (required), description (optional), subSkills (optional array)
    - [ ] Creates parent skill and all sub-skills in one transaction
    - [ ] Response includes: created skill with all sub-skills
  - [ ] `POST /api/admin/master-data/skills/{skillId}/sub-skills` - Creates a new sub-skill
    - [ ] Request body: name (required)
    - [ ] Response includes: created sub-skill
  - [ ] `PUT /api/admin/master-data/skills/{skillId}` - Updates a skill
    - [ ] Request body: name (required), description (optional)
    - [ ] Response includes: updated skill
  - [ ] `PUT /api/admin/master-data/skills/sub-skills/{subSkillId}` - Updates a sub-skill
    - [ ] Request body: name (required)
    - [ ] Response includes: updated sub-skill
  - [ ] `DELETE /api/admin/master-data/skills/{skillId}` - Deletes a skill
    - [ ] Validates if skill is used by engineers before deletion
    - [ ] Cascade deletes all sub-skills if allowed
    - [ ] Returns error if skill is in use
  - [ ] `DELETE /api/admin/master-data/skills/sub-skills/{subSkillId}` - Deletes a sub-skill
    - [ ] Validates if sub-skill is used by engineers before deletion
    - [ ] Returns error if sub-skill is in use

- [ ] **Service Layer**:
  - [ ] `AdminSkillService` to handle all skill operations
  - [ ] Methods:
    - [ ] `getAllParentSkills(pageable, search)` - Get paginated parent skills with search
    - [ ] `getSubSkillsByParentId(parentSkillId)` - Get all sub-skills for a parent
    - [ ] `createSkill(skillRequest)` - Create skill with optional sub-skills
    - [ ] `createSubSkill(parentSkillId, subSkillRequest)` - Create sub-skill
    - [ ] `updateSkill(skillId, skillRequest)` - Update skill
    - [ ] `updateSubSkill(subSkillId, subSkillRequest)` - Update sub-skill
    - [ ] `deleteSkill(skillId)` - Delete skill with validation
    - [ ] `deleteSubSkill(subSkillId)` - Delete sub-skill with validation
    - [ ] `isSkillInUse(skillId)` - Check if skill is used by engineers
    - [ ] `isSubSkillInUse(subSkillId)` - Check if sub-skill is used by engineers

- [ ] **Repository Layer**:
  - [ ] `SkillRepository` extends JpaRepository<Skill, Integer>
  - [ ] Methods:
    - [ ] `findByParentSkillIdIsNull(Pageable)` - Find all parent skills
    - [ ] `findByParentSkillId(parentSkillId)` - Find sub-skills by parent
    - [ ] `findByNameContainingIgnoreCaseAndParentSkillIdIsNull(search, Pageable)` - Search parent skills
    - [ ] `findByName(name)` - Find skill by name
    - [ ] `findByNameAndParentSkillId(name, parentSkillId)` - Find sub-skill by name and parent

- [ ] **Validation**:
  - [ ] Skill name must be unique within same parent (parent skills must have unique names, sub-skills must have unique names within same parent)
  - [ ] Skill name is required and max 128 characters
  - [ ] Description is optional and can be multi-line text
  - [ ] Validate skill exists before creating sub-skill
  - [ ] Validate parent skill exists before operations

### Database Requirements

- [ ] **Schema Updates**:
  - [ ] Add `description TEXT` column to `skills` table
  - [ ] Make description nullable
  - [ ] Migration script: `VXX__add_description_to_skills.sql`

- [ ] **Data Integrity**:
  - [ ] Foreign key constraint on `parent_skill_id` references `skills(id)`
  - [ ] Cascade delete option for sub-skills when parent is deleted (if allowed)
  - [ ] Check constraint to prevent circular references in parent_skill_id

- [ ] **Indexes**:
  - [ ] Index on `parent_skill_id` for efficient sub-skill queries
  - [ ] Index on `name` for efficient search and uniqueness checks
  - [ ] Full-text index on `description` (if supported) for search functionality

### API Response Models

#### Get Parent Skills Response
```json
{
  "content": [
    {
      "id": 1,
      "name": "Mobile App",
      "description": "Lorem Ipsum is simply dummy text",
      "parentSkillId": null
    },
    {
      "id": 2,
      "name": "Back-end",
      "description": "Lorem Ipsum is simply dummy text",
      "parentSkillId": null
    }
  ],
  "page": {
    "number": 0,
    "size": 20,
    "totalElements": 7,
    "totalPages": 1
  }
}
```

#### Get Sub Skills Response
```json
[
  {
    "id": 10,
    "name": "iOS (Swift)",
    "parentSkillId": 1
  },
  {
    "id": 11,
    "name": "Android (Kotlin)",
    "parentSkillId": 1
  },
  {
    "id": 12,
    "name": "Flutter",
    "parentSkillId": 1
  },
  {
    "id": 13,
    "name": "React Native",
    "parentSkillId": 1
  }
]
```

#### Create Skill Request
```json
{
  "name": "Mobile app",
  "description": "Mobile app",
  "subSkills": [
    {
      "name": "Lorem Ipsum is simply dummy text"
    }
  ]
}
```

#### Create Sub Skill Request
```json
{
  "name": "Flutter"
}
```

#### Error Response
```json
{
  "message": "Skill name already exists",
  "field": "name",
  "code": "DUPLICATE_SKILL_NAME"
}
```

## Implementation Guidelines

### Database Migration

1. Create migration script to add description column:
```sql
-- VXX__add_description_to_skills.sql
ALTER TABLE skills ADD COLUMN description TEXT NULL;
```

### Entity Update

1. Update `Skill.java` entity:
```java
@Column(name = "description", columnDefinition = "TEXT")
private String description;
```

### Frontend Implementation Flow

1. **Page Load**:
   - Fetch parent skills (first page)
   - Display in table
   - No skill selected initially (Sub Skills panel empty)

2. **Row Click**:
   - Set selected skill state
   - Highlight selected row
   - Fetch sub-skills for selected skill
   - Display sub-skills in right panel

3. **Create Skill**:
   - Open Create Skill modal
   - Fill form (name, description, sub-skills)
   - On save: POST to create endpoint
   - Refresh table after successful creation
   - Show success message

4. **Edit Skill**:
   - Open Edit Skill modal with pre-filled data
   - Fetch existing sub-skills
   - Allow editing name, description, and managing sub-skills
   - On save: PUT to update endpoint
   - Refresh table and sub-skills panel after successful update

5. **Delete Skill**:
   - Show confirmation dialog
   - Check if skill is in use
   - DELETE request
   - Refresh table after successful deletion
   - Clear selection if deleted skill was selected

## Testing Requirements

- [ ] **Unit Tests**:
  - [ ] Service layer tests for all CRUD operations
  - [ ] Repository layer tests for queries
  - [ ] Validation tests for unique names
  - [ ] Cascade delete tests

- [ ] **Integration Tests**:
  - [ ] API endpoint tests for all endpoints
  - [ ] Database transaction tests
  - [ ] Error handling tests

- [ ] **Frontend Tests**:
  - [ ] Component rendering tests
  - [ ] Form validation tests
  - [ ] Modal open/close tests
  - [ ] Row selection tests

- [ ] **E2E Tests**:
  - [ ] Complete flow: Create skill → Create sub-skill → Edit → Delete
  - [ ] Search functionality
  - [ ] Pagination
  - [ ] Error scenarios

## Open Questions / Decisions Needed

1. **Description Field**: Confirm if description field should be added to database schema
2. **Cascade Delete**: Should deleting a parent skill automatically delete all sub-skills? Or require manual deletion first?
3. **In-Use Validation**: How to handle skills/sub-skills that are in use by engineers? Prevent deletion or allow with warning?
4. **Sub-skill Creation**: Should sub-skills be created inline in Create Skill modal, or only through separate Create Sub Skill modal?
5. **Bulk Operations**: Should we support bulk delete or bulk edit in future?

## Dependencies

- Story-31: Admin Login Authentication (must be completed first)
- Admin Portal layout/sidebar (if not already created)
- User authentication and role-based access control

## Notes

- The wireframe shows a description column in the skills table, but the current database schema does not include this field. This story includes adding the description field.
- Consider adding audit logging for skill create/update/delete operations for compliance and tracking purposes.
- Future enhancements could include skill categories, skill tags, or skill hierarchies with multiple levels.

