# User Story: Sales Contact List Management

## Story Information
- **Story ID**: Story-19
- **Title**: Sales Contact List Management
- **Epic**: Sales Portal - Contact Management
- **Priority**: High
- **Story Points**: 13
- **Sprint**: Sprint 6
- **Status**: Draft

## User Story
**As a** Sales User (Sales Manager or Sales Man)  
**I want to** view contact requests in a list with search and filter capabilities  
**So that** I can track contact status and view contact details to manage client relationships effectively

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] I can view a list of contacts in a table format matching the wireframe
- [ ] Sales Manager can view all contacts in the system
- [ ] Sales Man can only view contacts assigned to them
- [ ] I can search contacts by keywords
- [ ] I can filter contacts by status
- [ ] I can view contact details by clicking the view icon
- [ ] Contact list matches the wireframe design exactly

### Detailed Acceptance Criteria

#### 1. Page Layout (Based on Wireframe)

- [ ] **Left Sidebar**:
  - [ ] "SKILL BRIDGE" logo/title at the top of sidebar in dark gray background
  - [ ] Navigation menu items with icons:
    - [ ] "Dashboard" with grid icon (four squares)
    - [ ] "Contact form" with envelope icon (highlighted/active state when on this page)
    - [ ] "Contract" with document icon
  - [ ] Sidebar has white background with dark gray header
  - [ ] Sidebar is collapsible on mobile (future enhancement)

- [ ] **Top Header Bar**:
  - [ ] Header bar has dark gray background
  - [ ] Page title "Contact management" displayed on the left in white text
  - [ ] User information displayed on the right:
    - [ ] User icon/avatar
    - [ ] User name (e.g., "Admin", "Yamada Taro")
  - [ ] Header is sticky/static at top
  - [ ] Language selector (JA/EN) in header (optional)

- [ ] **Main Content Area**:
  - [ ] White background area occupying remaining screen space
  - [ ] Content is properly spaced from sidebar and header
  - [ ] Responsive layout for different screen sizes

#### 2. Contact List Controls

- [ ] **Search Bar**:
  - [ ] Search input field with magnifying glass icon on the left
  - [ ] Placeholder text: "Search"
  - [ ] Search functionality searches across:
    - [ ] Client Name
    - [ ] Client Email
    - [ ] Company Name
    - [ ] Title
    - [ ] Contact ID
  - [ ] Real-time search results (as user types, debounced)
  - [ ] Search is case-insensitive
  - [ ] Search clears when input is empty

- [ ] **Filter Dropdown**:
  - [ ] Filter dropdown button with filter icon
  - [ ] Button displays current filter selection (e.g., "New/Inprogress")
  - [ ] Filter options:
    - [ ] "All" (shows all contacts based on user role)
    - [ ] "New" (shows only new contacts)
    - [ ] "Inprogress" (shows only in-progress contacts)
    - [ ] "Completed" (shows only completed contacts)
    - [ ] "Closed" (shows only closed contacts)
  - [ ] Filter applies to contact list immediately
  - [ ] Current filter selection is visually indicated
  - [ ] Multiple status filters can be selected (e.g., "New/Inprogress")


#### 3. Contact List Table

- [ ] **Table Structure**:
  - [ ] Table has clear borders and spacing
  - [ ] Table headers: No, ID, Client Name, Client Email, Company, Title, Status, Assignee, Action
  - [ ] All columns are properly aligned
  - [ ] Table is scrollable horizontally if content exceeds viewport width
  - [ ] Table rows have hover states
  - [ ] Table has alternating row colors for better readability

- [ ] **Table Columns**:
  - [ ] **No**: Sequential number (1, 2, 3, ...) starting from 1
  - [ ] **ID**: Contact ID format (e.g., "CT-2025-01", "CT-2025-02", "MSA-2025-07")
    - [ ] ID is unique for each contact
    - [ ] ID format: CT-YYYY-NN or MSA-YYYY-NN (where YYYY is year, NN is sequence)
  - [ ] **Client Name**: Client's full name (e.g., "Sato Taro", "Yamada Hana")
    - [ ] Client name is bolded for emphasis
    - [ ] Name is clickable to view contact details (optional enhancement)
  - [ ] **Client Email**: Client's email address (e.g., "sato_taro@gmail.com")
    - [ ] Email is displayed in full
    - [ ] Email is clickable to open email client (optional enhancement)
  - [ ] **Company**: Company name (e.g., "ABC Japan Co.", "XYZ Holdings")
  - [ ] **Title**: Contact title/request type (e.g., "Project Request", "General Inquiry")
  - [ ] **Status**: Contact status badges
    - [ ] "New" status displayed with appropriate color (e.g., blue/green)
    - [ ] "In Progress" status displayed with appropriate color (e.g., orange/yellow)
    - [ ] "Completed" status displayed with appropriate color (e.g., green)
    - [ ] "Closed" status displayed with appropriate color (e.g., gray)
    - [ ] Each status has distinct color/styling for quick identification
  - [ ] **Assignee**: Assigned Sales Man information
    - [ ] Displays Sales Man's full name (e.g., "Yamada Taro", "Sato Hana")
    - [ ] Displays "-" (dash) if no Sales Man is assigned
    - [ ] Sales Manager can see all assigned Sales Men
    - [ ] Sales Man only sees their own name or "-"
    - [ ] Assignee information is retrieved from users table via assignee_user_id foreign key
  - [ ] **Action**: Action icon
    - [ ] View icon (eye) for viewing contact details
    - [ ] Icon is clickable with hover states
    - [ ] Clicking view icon redirects to contact detail page

- [ ] **Table Data**:
  - [ ] **Sales Manager**: Table displays ALL contacts in the system
    - [ ] No filtering by assignee
    - [ ] Can see contacts assigned to any sales person
    - [ ] Can see unassigned contacts
  - [ ] **Sales Man**: Table displays ONLY contacts assigned to them
    - [ ] Filtered by assignee_user_id matching current user's ID
    - [ ] Cannot see contacts assigned to other sales people
    - [ ] Cannot see unassigned contacts (unless they are the assignee)
  - [ ] Contacts are sorted by creation date (newest first) by default
  - [ ] Sorting can be changed by clicking column headers (optional enhancement)
  - [ ] Empty state message if no contacts exist: "No contacts found"
  - [ ] Loading state while fetching contacts (skeleton loader or spinner)

#### 4. Role-Based Data Access

- [ ] **Sales Manager Permissions**:
  - [ ] Can view ALL contacts regardless of assignee
  - [ ] Can see assignee information for all contacts
  - [ ] Can view contact details for all contacts
  - [ ] Can view statistics across all contacts
  - [ ] Can filter by assignee (optional enhancement)

- [ ] **Sales Man Permissions**:
  - [ ] Can ONLY view contacts assigned to them (assignee_user_id = current_user_id)
  - [ ] Cannot see contacts assigned to other sales people
  - [ ] Cannot see unassigned contacts (unless they are the assignee)
  - [ ] Can view contact details for contacts assigned to them

- [ ] **Backend Authorization**:
  - [ ] API endpoint filters data based on user role
  - [ ] Sales Manager: No assignee filter applied
  - [ ] Sales Man: Filter by assignee_user_id = current_user_id
  - [ ] Authorization check performed on every API request
  - [ ] Unauthorized access attempts return 403 Forbidden

#### 5. Contact Actions

- [ ] **View Contact Details**:
  - [ ] Clicking view icon (eye) in Action column redirects to contact detail page
  - [ ] Redirect URL: `/sales/contacts/{contactId}` or `/sales/contacts/{id}`
  - [ ] Contact detail page shows full contact information
  - [ ] User can navigate back to contact list from detail page
  - [ ] View action is available for all contacts based on user's role permissions
  - [ ] Sales Manager can view all contacts
  - [ ] Sales Man can only view contacts assigned to them

#### 6. Pagination

- [ ] **Pagination Controls**:
  - [ ] Pagination displayed at bottom right of table
  - [ ] Page numbers displayed: "1 2 3 4 5" (or more if needed)
  - [ ] Current page is highlighted/active (e.g., bold or different color)
  - [ ] Clicking page number loads that page
  - [ ] Default: 10-20 contacts per page (configurable)
  - [ ] Total number of contacts/pages displayed (optional)
  - [ ] Previous/Next buttons for navigation (optional)
  - [ ] Pagination respects current search and filter settings


#### 8. Authentication & Authorization

- [ ] **Access Control**:
  - [ ] Only authenticated sales users (SALES_MANAGER or SALES_REP) can access this page
  - [ ] Unauthenticated users redirected to sales login page
  - [ ] Non-sales users (CLIENT, ADMIN) cannot access this page
  - [ ] Session validation on page load
  - [ ] Token expiration handling

- [ ] **Role-Based Filtering**:
  - [ ] Backend API automatically filters contacts based on user role
  - [ ] Sales Manager receives all contacts
  - [ ] Sales Man receives only assigned contacts
  - [ ] Filtering happens at database query level for performance
  - [ ] No client-side filtering that could be bypassed

## Technical Requirements

### Frontend Requirements

```typescript
// Sales Contact List Page Component Structure
interface SalesContactListPageProps {
  // Props if needed
}

interface Contact {
  id: number;
  contactId: string; // e.g., "CT-2025-01"
  clientName: string;
  clientEmail: string;
  company: string;
  title: string;
  status: 'NEW' | 'INPROGRESS' | 'CONVERTED_TO_OPPOTUNITY' | 'CLOSED';
  assigneeUserId: number | null; // Foreign key to users table
  assigneeName: string | null; // Sales Man's full name from users table
  createdAt: string;
  updatedAt: string;
}

interface ContactListResponse {
  contacts: Contact[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface ContactListFilters {
  search?: string;
  status?: string[];
  assigneeUserId?: number; // For Sales Manager filtering by Sales Man user ID
}

// User role types
type SalesRole = 'SALES_MANAGER' | 'SALES_REP';

interface User {
  id: number;
  email: string;
  fullName: string;
  role: SalesRole;
}
```

### Backend Requirements

```java
// Sales Contact Controller
@RestController
@RequestMapping("/api/sales/contacts")
@PreAuthorize("hasAnyRole('SALES_MANAGER', 'SALES_REP')")
public class SalesContactController {
    
    @Autowired
    private SalesContactService contactService;
    
    @GetMapping
    public ResponseEntity<ContactListResponse> getContacts(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) List<String> status,
        @RequestParam(required = false) Integer assigneeUserId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        Authentication authentication
    ) {
        // Get current user from authentication
        User currentUser = getCurrentUser(authentication);
        
        // Build filters
        ContactListFilters filters = new ContactListFilters();
        filters.setSearch(search);
        filters.setStatus(status);
        
        // Role-based filtering
        if (currentUser.getRole() == SalesRole.SALES_REP) {
            // Sales Man: only their assigned contacts
            filters.setAssigneeUserId(currentUser.getId());
        } else if (currentUser.getRole() == SalesRole.SALES_MANAGER) {
            // Sales Manager: can filter by assignee if specified
            filters.setAssigneeUserId(assigneeUserId);
        }
        
        ContactListResponse response = contactService.getContacts(filters, page, size);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ContactDTO> getContactById(
        @PathVariable Long id,
        Authentication authentication
    ) {
        User currentUser = getCurrentUser(authentication);
        ContactDTO contact = contactService.getContactById(id, currentUser);
        return ResponseEntity.ok(contact);
    }
}

// Sales Contact Service with Role-Based Logic
@Service
public class SalesContactService {
    
    @Autowired
    private ContactRepository contactRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public ContactListResponse getContacts(ContactListFilters filters, int page, int size) {
        // Build query based on filters and role
        Specification<Contact> spec = buildSpecification(filters);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Contact> contactPage = contactRepository.findAll(spec, pageable);
        
        // Convert to DTO and join with users table to get assignee name
        List<ContactDTO> contacts = contactPage.getContent().stream()
            .map(contact -> {
                ContactDTO dto = convertToDTO(contact);
                // Load assignee user to get full name
                if (contact.getAssigneeUserId() != null) {
                    User assignee = userRepository.findById(contact.getAssigneeUserId())
                        .orElse(null);
                    if (assignee != null) {
                        dto.setAssigneeName(assignee.getFullName());
                    }
                }
                return dto;
            })
            .collect(Collectors.toList());
        
        ContactListResponse response = new ContactListResponse();
        response.setContacts(contacts);
        response.setTotal(contactPage.getTotalElements());
        response.setPage(page);
        response.setPageSize(size);
        response.setTotalPages(contactPage.getTotalPages());
        
        return response;
    }
    
    private Specification<Contact> buildSpecification(ContactListFilters filters) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // Search filter
            if (filters.getSearch() != null && !filters.getSearch().isEmpty()) {
                String searchPattern = "%" + filters.getSearch().toLowerCase() + "%";
                Predicate clientName = cb.like(cb.lower(root.get("clientName")), searchPattern);
                Predicate clientEmail = cb.like(cb.lower(root.get("clientEmail")), searchPattern);
                Predicate company = cb.like(cb.lower(root.get("company")), searchPattern);
                Predicate title = cb.like(cb.lower(root.get("title")), searchPattern);
                Predicate contactId = cb.like(cb.lower(root.get("contactId")), searchPattern);
                
                predicates.add(cb.or(clientName, clientEmail, company, title, contactId));
            }
            
            // Status filter
            if (filters.getStatus() != null && !filters.getStatus().isEmpty()) {
                predicates.add(root.get("status").in(filters.getStatus()));
            }
            
            // Assignee filter (applied based on role in controller)
            if (filters.getAssigneeUserId() != null) {
                predicates.add(cb.equal(root.get("assigneeUserId"), filters.getAssigneeUserId()));
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
    
    public ContactDTO getContactById(Long id, User currentUser) {
        Contact contact = contactRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Contact not found"));
        
        // Authorization check
        if (currentUser.getRole() == SalesRole.SALES_REP) {
            if (contact.getAssigneeUserId() == null || 
                !contact.getAssigneeUserId().equals(currentUser.getId())) {
                throw new AccessDeniedException("You can only view contacts assigned to you");
            }
        }
        
        ContactDTO dto = convertToDTO(contact);
        
        // Load assignee user to get full name
        if (contact.getAssigneeUserId() != null) {
            User assignee = userRepository.findById(contact.getAssigneeUserId())
                .orElse(null);
            if (assignee != null) {
                dto.setAssigneeName(assignee.getFullName());
            }
        }
        
        return dto;
    }
}
```

### Database Schema

```sql
-- Contacts table (existing, with assignee_user_id field)
CREATE TABLE contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contact_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., "CT-2025-01"
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(32) DEFAULT 'NEW', -- NEW, INPROGRESS, COMPLETED, CLOSED
    assignee_user_id INT, -- Foreign key to users table (Sales Man assigned to this contact)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_contact_id (contact_id),
    INDEX idx_status (status),
    INDEX idx_assignee_user_id (assignee_user_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (assignee_user_id) REFERENCES users(id) ON DELETE SET NULL
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
```

## Implementation Guidelines

### Frontend Implementation

```typescript
// Sales Contact List Page Component
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Filter, Eye } from 'lucide-react';

export default function SalesContactListPage() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Redirect if not authenticated or not sales user
  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/sales/login');
      return;
    }
    
    if (user.role !== 'SALES_MANAGER' && user.role !== 'SALES_REP') {
      router.push('/sales/login');
      return;
    }
  }, [isAuthenticated, user, router]);

  // Fetch contacts
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchContacts();
    }
  }, [search, statusFilter, page, isAuthenticated, token]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter.length > 0) {
        statusFilter.forEach(status => params.append('status', status));
      }
      params.append('page', (page - 1).toString());
      params.append('size', '20');

      const response = await fetch(`/api/sales/contacts?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }

      const data: ContactListResponse = await response.json();
      setContacts(data.contacts);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewContact = (contactId: string) => {
    router.push(`/sales/contacts/${contactId}`);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800';
      case 'INPROGRESS': return 'bg-orange-100 text-orange-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-4 bg-gray-800 text-white">
          <h1 className="text-xl font-bold">SKILL BRIDGE</h1>
        </div>
        <nav className="p-4 space-y-2">
          <a href="/sales/dashboard" className="flex items-center gap-2 p-2 hover:bg-gray-100">
            <Grid className="w-5 h-5" />
            <span>Dashboard</span>
          </a>
          <a href="/sales/contacts" className="flex items-center gap-2 p-2 bg-blue-50 text-blue-600 font-medium">
            <Mail className="w-5 h-5" />
            <span>Contact form</span>
          </a>
          <a href="/sales/contracts" className="flex items-center gap-2 p-2 hover:bg-gray-100">
            <FileText className="w-5 h-5" />
            <span>Contract</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Contact management</h2>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span>{user?.fullName || 'Admin'}</span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 bg-white">
          {/* Search, Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              {statusFilter.length > 0 ? statusFilter.join('/') : 'All'}
            </Button>
          </div>

          {/* Contact Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Client Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : contacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      No contacts found
                    </TableCell>
                  </TableRow>
                ) : (
                  contacts.map((contact, index) => (
                    <TableRow key={contact.id}>
                      <TableCell>{(page - 1) * 20 + index + 1}</TableCell>
                      <TableCell>{contact.contactId}</TableCell>
                      <TableCell className="font-semibold">{contact.clientName}</TableCell>
                      <TableCell>{contact.clientEmail}</TableCell>
                      <TableCell>{contact.company}</TableCell>
                      <TableCell>{contact.title}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(contact.status)}>
                          {contact.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{contact.assigneeName || '-'}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewContact(contact.contactId)}
                          title="View contact details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex justify-end mt-4 gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === page ? 'default' : 'outline'}
                onClick={() => setPage(pageNum)}
                className="w-10"
              >
                {pageNum}
              </Button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
```

## Testing Requirements

### Unit Tests
- [ ] Contact list component renders correctly
- [ ] Search functionality filters contacts
- [ ] Status filter works correctly
- [ ] Pagination controls work
- [ ] Role-based data filtering (Sales Manager vs Sales Man)
- [ ] View icon displays correctly
- [ ] Empty state displays correctly

### Integration Tests
- [ ] API returns all contacts for Sales Manager
- [ ] API returns only assigned contacts for Sales Man
- [ ] Search API works correctly
- [ ] Filter API works correctly
- [ ] Get contact by ID API works with authorization check
- [ ] Unauthorized access returns 403

### End-to-End Tests
- [ ] Sales Manager can view all contacts
- [ ] Sales Man can only view assigned contacts
- [ ] Search functionality works end-to-end
- [ ] Filter functionality works end-to-end
- [ ] View contact detail flow with redirect
- [ ] Authorization check on view contact detail
- [ ] Pagination works correctly

## Performance Requirements

### Performance Metrics
- **Page Load Time**: < 2 seconds
- **Search Response Time**: < 500ms (debounced)
- **Filter Response Time**: < 500ms
- **Table Render Time**: < 1 second for 20 contacts
- **Pagination Load Time**: < 500ms

## Security Considerations

### Security Requirements
- [ ] Role-based access control enforced at API level
- [ ] Sales Man cannot access other sales people's contacts
- [ ] Authorization checks on view contact detail operation
- [ ] Input validation on search and filter inputs
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection on all user inputs
- [ ] HTTPS required for all API requests

## Definition of Done

### Development Complete
- [ ] Sales contact list page implemented matching wireframe
- [ ] Role-based data filtering implemented (Sales Manager vs Sales Man)
- [ ] Search functionality implemented
- [ ] Filter functionality implemented
- [ ] View contact detail with redirect implemented
- [ ] Pagination implemented
- [ ] Authorization checks implemented
- [ ] Responsive design implemented

### Testing Complete
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] E2E tests written and passing
- [ ] Security tests completed
- [ ] Cross-browser testing completed
- [ ] Role-based access tested thoroughly

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

### Internal Dependencies
- **User Entity**: Existing user table with role field
- **Contact Entity**: Contact table with assignee_user_id field (foreign key to users table)
- **AuthContext**: Authentication context for sales users
- **LanguageContext**: Multi-language support (if applicable)

## Risks and Mitigation

### Technical Risks
- **Performance**: Large number of contacts may slow down queries
  - *Mitigation*: Implement pagination, database indexing, query optimization
- **Authorization Bypass**: Sales Man accessing other contacts
  - *Mitigation*: Enforce authorization at database query level, not just frontend
- **Data Consistency**: Assignee changes not reflected immediately
  - *Mitigation*: Implement real-time updates or refresh mechanism

### Business Risks
- **User Experience**: Complex filtering may confuse users
  - *Mitigation*: Clear UI, tooltips, user testing
- **Data Privacy**: Sales Man seeing wrong contacts
  - *Mitigation*: Thorough testing, authorization checks at multiple levels

---

**Story Status**: Draft  
**Assigned To**: Backend & Frontend Teams  
**Estimated Effort**: 13 Story Points  
**Target Sprint**: Sprint 6

