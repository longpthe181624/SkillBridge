# User Story: Client Contact List Management

## Story Information
- **Story ID**: Story-09
- **Title**: Client Contact List Management
- **Epic**: Client Portal - Contact Management
- **Priority**: High
- **Story Points**: 13
- **Sprint**: Sprint 3
- **Status**: Ready for Development

## User Story
**As a** Client  
**I want to** view and manage my contact submissions in a list  
**So that** I can track the status of my requests and view contact details

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] I can view a list of all my contact submissions in a table format
- [ ] I can search contacts by keywords
- [ ] I can filter contacts by status
- [ ] I can view contact details by clicking the eye icon
- [ ] I can create a new contact submission
- [ ] Contact list matches the wireframe design

### Detailed Acceptance Criteria

#### 1. Page Layout (Based on Wireframe)
- [ ] **Left Sidebar**:
  - [ ] "SKILL BRIDGE" logo/title at the top of sidebar
  - [ ] Navigation menu items:
    - [ ] "Dashboard" with grid icon
    - [ ] "Contact form" with envelope icon (highlighted/active state when on this page)
    - [ ] "Proposal" with document icon
    - [ ] "Contract" with document icon
  - [ ] Sidebar has dark grey background
  - [ ] Sidebar is collapsible on mobile (future enhancement)

- [ ] **Top Header**:
  - [ ] Page title "Contact management" displayed on the left
  - [ ] User information displayed on the right:
    - [ ] User icon
    - [ ] User name with honorific "様" (e.g., "Yamada Taro様")
  - [ ] Header has dark grey background
  - [ ] Header is sticky/static at top

- [ ] **Main Content Area**:
  - [ ] White background area occupying remaining screen space
  - [ ] Content is properly spaced from sidebar and header
  - [ ] Responsive layout for different screen sizes

#### 2. Contact List Controls
- [ ] **Search Bar**:
  - [ ] Search input field with magnifying glass icon on the left
  - [ ] Placeholder text: "Search"
  - [ ] Search functionality searches across: Title, Description, ID
  - [ ] Real-time search results (as user types)
  - [ ] Search is case-insensitive

- [ ] **Filter Dropdown**:
  - [ ] Filter dropdown with filter icon
  - [ ] Default option: "All" (shows all contacts)
  - [ ] Filter options: "All", "New", "Converted to Opportunity", "Closed"
  - [ ] Filter applies to contact list immediately
  - [ ] Current filter selection is visible

- [ ] **Create New Button**:
  - [ ] "+ Create new" button on the far right
  - [ ] Button is prominent and clearly visible
  - [ ] Clicking button opens contact creation form/modal
  - [ ] Button follows client portal blue color scheme

#### 3. Contact List Table
- [ ] **Table Structure**:
  - [ ] Table has clear borders and spacing
  - [ ] Table headers: No, ID, Title, Description, Created On, Status, Action
  - [ ] All columns are properly aligned
  - [ ] Table is scrollable if content exceeds viewport height

- [ ] **Table Columns**:
  - [ ] **No**: Sequential number (1, 2, 3, ...)
  - [ ] **ID**: Contact ID format (e.g., "CT-2025-07", "CT-2025-06")
    - [ ] ID is unique for each contact
    - [ ] ID format: CT-YYYY-NN (where YYYY is year, NN is sequence)
  - [ ] **Title**: Contact title/name (e.g., "Hiring BE", "Consultation EC")
  - [ ] **Description**: Brief description (e.g., "Hiring", "Consultation")
    - [ ] Description may be truncated if too long (with tooltip or ellipsis)
  - [ ] **Created On**: Date in format YYYY/MM/DD (e.g., "2025/06/01", "2025/05/28")
    - [ ] Dates are sorted newest first by default
  - [ ] **Status**: Contact status badges
    - [ ] "New" status displayed
    - [ ] "Converted to Opportunity" status displayed
    - [ ] "Closed" status displayed
    - [ ] Each status has distinct color/styling
  - [ ] **Action**: Eye icon for viewing details
    - [ ] Eye icon is clickable
    - [ ] Hover state indicates clickability

- [ ] **Table Data**:
  - [ ] Table displays contacts belonging to the logged-in client user
  - [ ] Contacts are sorted by creation date (newest first) by default
  - [ ] Empty state message if no contacts exist
  - [ ] Loading state while fetching contacts

#### 4. Contact Details View
- [ ] **View Details**:
  - [ ] Clicking eye icon opens contact details view
  - [ ] Details view shows full contact information:
    - [ ] Contact ID
    - [ ] Title
    - [ ] Full Description
    - [ ] Created Date
    - [ ] Status with history
    - [ ] Company information
    - [ ] User information
  - [ ] Details view can be a modal or separate page
  - [ ] Close/back button to return to list

#### 5. Pagination
- [ ] **Pagination Controls**:
  - [ ] Pagination displayed at bottom right of table
  - [ ] Page numbers: "1 2 3 4 5" (or more if needed)
  - [ ] Current page is highlighted/active
  - [ ] Clicking page number loads that page
  - [ ] Default: 10-20 contacts per page (configurable)
  - [ ] Total number of contacts/pages displayed (optional)

#### 6. Create New Contact
- [ ] **Create New Functionality**:
  - [ ] "+ Create new" button opens contact creation form
  - [ ] Form matches existing contact form design
  - [ ] After submission, new contact appears in list
  - [ ] List refreshes to show new contact

#### 7. Authentication & Authorization
- [ ] **Access Control**:
  - [ ] Only authenticated client users can access this page
  - [ ] Users only see their own contacts (client_user_id filter)
  - [ ] Unauthenticated users redirected to login
  - [ ] Session validation on page load

## Technical Requirements

### Frontend Requirements
```typescript
// Contact List Page Component Structure
interface ContactListPageProps {
  // Props if needed
}

interface Contact {
  id: string; // Format: CT-YYYY-NN
  no: number;
  title: string;
  description: string;
  createdOn: string; // Format: YYYY/MM/DD
  status: 'New' | 'Converted to Opportunity' | 'Closed';
}

interface ContactListState {
  contacts: Contact[];
  loading: boolean;
  searchQuery: string;
  statusFilter: string;
  currentPage: number;
  totalPages: number;
}

// Table Column Structure
const tableColumns = [
  { key: 'no', label: 'No', sortable: true },
  { key: 'id', label: 'ID', sortable: true },
  { key: 'title', label: 'Title', sortable: true },
  { key: 'description', label: 'Description', sortable: false },
  { key: 'createdOn', label: 'Created On', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'action', label: 'Action', sortable: false }
];
```

### Backend Requirements
```java
// Contact List Controller
@RestController
@RequestMapping("/client/contacts")
public class ClientContactController {
    @GetMapping
    public ResponseEntity<ContactListResponse> getContacts(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String status,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        Authentication authentication
    );
}

// Contact List Response DTO
public class ContactListResponse {
    private List<ContactListItemDTO> contacts;
    private int currentPage;
    private int totalPages;
    private long totalElements;
}

// Contact List Item DTO
public class ContactListItemDTO {
    private String id; // Format: CT-YYYY-NN
    private String title;
    private String description;
    private String createdOn; // Format: YYYY/MM/DD
    private String status;
}
```

### Database Schema
```sql
-- Contacts table (existing)
CREATE TABLE contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contact_id VARCHAR(50) UNIQUE, -- Format: CT-YYYY-NN
    client_user_id INT NOT NULL,
    title VARCHAR(255),
    description TEXT,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_user_id) REFERENCES users(id),
    INDEX idx_client_user_id (client_user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Contact ID Generation
-- Format: CT-YYYY-NN
-- YYYY = Year (4 digits)
-- NN = Sequential number within that year (2 digits, zero-padded)
```

## Implementation Guidelines

### Frontend Implementation
```typescript
// Contact List Page Component (simplified structure)
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Eye } from 'lucide-react';

export default function ContactListPage() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Component structure matching wireframe
  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <Sidebar currentPage="contact-form" />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <Header user={user} title="Contact management" />
        
        {/* Main Content Area */}
        <div className="p-6 bg-white">
          {/* Search and Filter Controls */}
          <div className="flex gap-4 mb-6">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search"
            />
            <FilterDropdown 
              value={statusFilter}
              onChange={setStatusFilter}
              options={['All', 'New', 'Converted to Opportunity', 'Closed']}
            />
            <Button onClick={handleCreateNew}>
              + Create new
            </Button>
          </div>

          {/* Contact Table */}
          <ContactTable 
            contacts={contacts}
            onViewDetails={handleViewDetails}
          />

          {/* Pagination */}
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
```

### Backend Implementation
```java
// Contact List Service
@Service
public class ContactListService {
    
    @Autowired
    private ContactRepository contactRepository;
    
    public ContactListResponse getContactsForClient(
        Integer clientUserId,
        String search,
        String status,
        int page,
        int size
    ) {
        // Build query with filters
        // Apply search across title, description, ID
        // Filter by status if provided
        // Filter by client_user_id (security)
        // Sort by created_at DESC
        // Apply pagination
        
        // Return paginated results
    }
    
    private String generateContactId(Contact contact) {
        // Generate ID format: CT-YYYY-NN
        // YYYY = Year from created_at
        // NN = Sequential number for that year
    }
}
```

## Testing Requirements

### Unit Tests
- [ ] Contact list component renders correctly
- [ ] Search functionality filters contacts
- [ ] Filter dropdown changes displayed contacts
- [ ] Pagination navigation works
- [ ] Table columns display correct data
- [ ] Action button triggers details view

### Integration Tests
- [ ] API returns contacts for authenticated client
- [ ] Search query filters results correctly
- [ ] Status filter works correctly
- [ ] Pagination parameters work correctly
- [ ] Contact ID generation follows format
- [ ] Client can only see their own contacts

### End-to-End Tests
- [ ] Complete flow: Login → Navigate to Contact List → View contacts
- [ ] Search for contact by keyword
- [ ] Filter contacts by status
- [ ] Click eye icon to view details
- [ ] Create new contact from list page
- [ ] Navigate through pagination

## Performance Requirements

### Performance Metrics
- **Page Load Time**: < 2 seconds
- **Table Render Time**: < 500ms
- **Search Response Time**: < 300ms (debounced)
- **Filter Response Time**: < 200ms

### Optimization Strategies
- [ ] Implement pagination to limit data load
- [ ] Debounce search input (300ms delay)
- [ ] Cache contact list for better performance
- [ ] Lazy load contact details when viewing

## Security Considerations

### Security Requirements
- [ ] Only authenticated client users can access
- [ ] Client can only view their own contacts (client_user_id filter)
- [ ] SQL injection prevention (use parameterized queries)
- [ ] XSS prevention (sanitize user input)
- [ ] CSRF protection for form submissions

## Definition of Done

### Development Complete
- [ ] Contact list page implemented matching wireframe
- [ ] Sidebar navigation implemented
- [ ] Header with user info implemented
- [ ] Search functionality working
- [ ] Filter functionality working
- [ ] Table displays contacts correctly
- [ ] Pagination implemented
- [ ] View details functionality working
- [ ] Create new contact functionality working
- [ ] Responsive design implemented

### Testing Complete
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] E2E tests written and passing
- [ ] Security tests completed

### Documentation Complete
- [ ] API documentation updated
- [ ] Technical documentation updated
- [ ] User guide updated

## Dependencies

### External Dependencies
- **Next.js 14+**: Frontend framework
- **React 18+**: UI library
- **Spring Boot**: Backend framework
- **MySQL**: Database

### Internal Dependencies
- **AuthContext**: User authentication
- **Contact Entity**: Existing contact table structure
- **User Entity**: Client user information
- **ContactService**: Existing contact management service

## Risks and Mitigation

### Technical Risks
- **Performance**: Large contact lists may slow down page
  - *Mitigation*: Implement pagination, limit page size, use database indexing
- **Search Performance**: Full-text search may be slow
  - *Mitigation*: Use database full-text search indexes, limit search scope

### Business Risks
- **User Experience**: Complex filters may confuse users
  - *Mitigation*: Simple, intuitive UI, clear labels, help tooltips

## Success Metrics

### Business Metrics
- **Contact List Page Views**: Track page access
- **Search Usage**: Track search query frequency
- **Filter Usage**: Track filter selection frequency
- **Details View Clicks**: Track engagement with contact details

### Technical Metrics
- **Page Load Time**: Target < 2 seconds
- **API Response Time**: Target < 500ms
- **Error Rate**: Target < 1%

## Future Enhancements

### Phase 2 Features
- **Advanced Filtering**: Filter by date range, company, etc.
- **Bulk Actions**: Select multiple contacts for bulk operations
- **Export Functionality**: Export contact list to CSV/Excel
- **Sorting**: Sort by any column (currently default sort only)

### Phase 3 Features
- **Contact Status Workflow**: Change status from list view
- **Notifications**: Real-time updates when contact status changes
- **Advanced Search**: Search across multiple fields with operators
- **Saved Searches**: Save frequently used search/filter combinations

---

**Story Status**: Ready for Development  
**Assigned To**: Backend & Frontend Teams  
**Estimated Effort**: 13 Story Points  
**Target Sprint**: Sprint 3

