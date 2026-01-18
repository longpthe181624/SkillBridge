# User Story: Client Proposal List Management

## Story Information
- **Story ID**: Story-11
- **Title**: Client Proposal List Management
- **Epic**: Client Portal - Proposal Management
- **Priority**: High
- **Story Points**: 13
- **Sprint**: Sprint 4
- **Status**: Ready for Development

## User Story
**As a** Client  
**I want to** view and manage my proposals in a list  
**So that** I can track the status of my proposals and view proposal details

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] I can view a list of all my proposals in a table format
- [ ] I can search proposals by keywords
- [ ] I can filter proposals by status
- [ ] I can view proposal details by clicking the eye icon
- [ ] Proposal list matches the wireframe design

### Detailed Acceptance Criteria

#### 1. Page Layout (Based on Wireframe)
- [ ] **Left Sidebar**:
  - [ ] "SKILL BRIDGE" logo/title at the top of sidebar
  - [ ] Navigation menu items:
    - [ ] "Dashboard" with dashboard icon
    - [ ] "Contact form" with envelope icon
    - [ ] "Proposal" with 'P' in a circle icon (highlighted/active state when on this page)
    - [ ] "Contract" with document icon
  - [ ] Sidebar has dark grey background
  - [ ] Sidebar is collapsible on mobile (future enhancement)

- [ ] **Top Header**:
  - [ ] Page title "Proposal management" displayed in the center
  - [ ] User information displayed on the right:
    - [ ] User icon
    - [ ] User name with honorific "様" (e.g., "Yamada Taro様")
  - [ ] Header has appropriate background styling
  - [ ] Header is sticky/static at top

- [ ] **Main Content Area**:
  - [ ] White background area occupying remaining screen space
  - [ ] Content is properly spaced from sidebar and header
  - [ ] Responsive layout for different screen sizes

#### 2. Proposal List Controls
- [ ] **Search Bar**:
  - [ ] Search input field with magnifying glass icon on the left
  - [ ] Placeholder text: "Search"
  - [ ] Search functionality searches across: Proposal ID, Contact ID, Contact Description
  - [ ] Real-time search results (as user types)
  - [ ] Search is case-insensitive

- [ ] **Filter Dropdown**:
  - [ ] Filter dropdown with filter icon
  - [ ] Default option: "All" (shows all proposals)
  - [ ] Filter options: "All", "Under review", "Request for change", "Approved"
  - [ ] Filter applies to proposal list immediately
  - [ ] Current filter selection is visible

#### 3. Proposal List Table
- [ ] **Table Structure**:
  - [ ] Table has clear borders and spacing
  - [ ] Table headers: No, ID, Contact ID, Contact Description, Created On, Status, Last Updated, Action
  - [ ] All columns are properly aligned
  - [ ] Table is scrollable if content exceeds viewport height

- [ ] **Table Columns**:
  - [ ] **No**: Sequential number (1, 2, 3, ...)
  - [ ] **ID**: Proposal ID format (e.g., "P-2025-07", "P-2025-06")
    - [ ] ID is unique for each proposal
    - [ ] ID format: P-YYYY-NN (where YYYY is year, NN is sequence)
  - [ ] **Contact ID**: Associated contact identifier (e.g., "CT-2025-07")
    - [ ] Contact ID format: CT-YYYY-NN
    - [ ] Contact ID is clickable and links to contact detail (optional)
  - [ ] **Contact Description**: Brief description of proposal purpose
    - [ ] Description examples: "Hiring", "Consultation"
    - [ ] Description may be truncated if too long (with tooltip or ellipsis)
  - [ ] **Created On**: Date in format YYYY/MM/DD (e.g., "2025/06/01", "2025/05/28")
    - [ ] Dates are sorted newest first by default
  - [ ] **Status**: Proposal status badges
    - [ ] "Under review" status displayed
    - [ ] "Request for change" status displayed
    - [ ] "Approved" status displayed
    - [ ] Each status has distinct color/styling
  - [ ] **Last Updated**: Date in format YYYY/MM/DD (e.g., "2025/06/05", "2025/05/30")
    - [ ] Shows when proposal was last modified
  - [ ] **Action**: Eye icon for viewing details
    - [ ] Eye icon is clickable
    - [ ] Hover state indicates clickability
    - [ ] Clicking eye icon navigates to Contract Details screen with corresponding proposal

- [ ] **Table Data**:
  - [ ] Table displays proposals belonging to the logged-in client user
  - [ ] Proposals are sorted by creation date (newest first) by default
  - [ ] Empty state message if no proposals exist
  - [ ] Loading state while fetching proposals

#### 4. Proposal Details View (Contract Details Screen)
- [ ] **View Details Navigation**:
  - [ ] Clicking eye icon navigates to Contract Details screen
  - [ ] Contract Details screen displays full proposal information
  - [ ] Proposal data is passed correctly to the detail screen
  - [ ] Detail screen shows proposal corresponding to the selected proposal ID
  - [ ] Back button or navigation to return to proposal list

#### 5. Pagination
- [ ] **Pagination Controls**:
  - [ ] Pagination displayed below the table
  - [ ] Page numbers: "1 2 3 4 5" (or more if needed)
  - [ ] Current page is highlighted/active
  - [ ] Clicking page number loads that page
  - [ ] Default: 10-20 proposals per page (configurable)
  - [ ] Total number of proposals/pages displayed (optional)

#### 6. Authentication & Authorization
- [ ] **Access Control**:
  - [ ] Only authenticated client users can access this page
  - [ ] Users only see their own proposals (client_user_id filter)
  - [ ] Unauthenticated users redirected to login
  - [ ] Session validation on page load

## Technical Requirements

### Frontend Requirements
```typescript
// Proposal List Page Component Structure
interface ProposalListPageProps {
  // Props if needed
}

interface Proposal {
  id: string; // Format: P-YYYY-NN
  no: number;
  contactId: string; // Format: CT-YYYY-NN
  contactDescription: string;
  createdOn: string; // Format: YYYY/MM/DD
  status: 'Under review' | 'Request for change' | 'Approved';
  lastUpdated: string; // Format: YYYY/MM/DD
}

interface ProposalListState {
  proposals: Proposal[];
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
  { key: 'contactId', label: 'Contact ID', sortable: true },
  { key: 'contactDescription', label: 'Contact Description', sortable: false },
  { key: 'createdOn', label: 'Created On', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'lastUpdated', label: 'Last Updated', sortable: true },
  { key: 'action', label: 'Action', sortable: false }
];
```

### Backend Requirements
```java
// Proposal List Controller
@RestController
@RequestMapping("/client/proposals")
public class ClientProposalController {
    @GetMapping
    public ResponseEntity<ProposalListResponse> getProposals(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String status,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        Authentication authentication
    );
}

// Proposal List Response DTO
public class ProposalListResponse {
    private List<ProposalListItemDTO> proposals;
    private int currentPage;
    private int totalPages;
    private long totalElements;
}

// Proposal List Item DTO
public class ProposalListItemDTO {
    private String id; // Format: P-YYYY-NN
    private String contactId; // Format: CT-YYYY-NN
    private String contactDescription;
    private String createdOn; // Format: YYYY/MM/DD
    private String status;
    private String lastUpdated; // Format: YYYY/MM/DD
}
```

### Database Schema
```sql
-- Proposals table
CREATE TABLE proposals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    proposal_id VARCHAR(50) UNIQUE, -- Format: P-YYYY-NN
    contact_id INT NOT NULL,
    client_user_id INT NOT NULL,
    contact_description VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Under review',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contacts(id),
    FOREIGN KEY (client_user_id) REFERENCES users(id),
    INDEX idx_client_user_id (client_user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_updated_at (updated_at)
);

-- Proposal ID Generation
-- Format: P-YYYY-NN
-- YYYY = Year (4 digits)
-- NN = Sequential number within that year (2 digits, zero-padded)
```

## Implementation Guidelines

### Frontend Implementation
```typescript
// Proposal List Page Component (simplified structure)
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Eye } from 'lucide-react';

export default function ProposalListPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const handleViewDetails = (proposalId: string) => {
    // Navigate to Contract Details screen with proposal ID
    router.push(`/client/contracts/details?proposalId=${proposalId}`);
  };

  // Component structure matching wireframe
  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <Sidebar currentPage="proposal" />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <Header user={user} title="Proposal management" />
        
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
              options={['All', 'Under review', 'Request for change', 'Approved']}
            />
          </div>

          {/* Proposal Table */}
          <ProposalTable 
            proposals={proposals}
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
// Proposal List Service
@Service
public class ProposalListService {
    
    @Autowired
    private ProposalRepository proposalRepository;
    
    public ProposalListResponse getProposalsForClient(
        Integer clientUserId,
        String search,
        String status,
        int page,
        int size
    ) {
        // Build query with filters
        // Apply search across proposal ID, contact ID, contact description
        // Filter by status if provided
        // Filter by client_user_id (security)
        // Sort by created_at DESC
        // Apply pagination
        
        // Return paginated results
    }
    
    private String generateProposalId(Proposal proposal) {
        // Generate ID format: P-YYYY-NN
        // YYYY = Year from created_at
        // NN = Sequential number for that year
    }
}
```

## Testing Requirements

### Unit Tests
- [ ] Proposal list component renders correctly
- [ ] Search functionality filters proposals
- [ ] Filter dropdown changes displayed proposals
- [ ] Pagination navigation works
- [ ] Table columns display correct data
- [ ] Action button triggers details navigation
- [ ] View details navigation works correctly

### Integration Tests
- [ ] API returns proposals for authenticated client
- [ ] Search query filters results correctly
- [ ] Status filter works correctly
- [ ] Pagination parameters work correctly
- [ ] Proposal ID generation follows format
- [ ] Client can only see their own proposals
- [ ] Navigation to Contract Details screen works with correct proposal ID

### End-to-End Tests
- [ ] Complete flow: Login → Navigate to Proposal List → View proposals
- [ ] Search for proposal by keyword
- [ ] Filter proposals by status
- [ ] Click eye icon to view details
- [ ] Verify Contract Details screen displays correct proposal
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
- [ ] Cache proposal list for better performance
- [ ] Lazy load proposal details when viewing

## Security Considerations

### Security Requirements
- [ ] Only authenticated client users can access
- [ ] Client can only view their own proposals (client_user_id filter)
- [ ] SQL injection prevention (use parameterized queries)
- [ ] XSS prevention (sanitize user input)
- [ ] CSRF protection for form submissions

## Definition of Done

### Development Complete
- [ ] Proposal list page implemented matching wireframe
- [ ] Sidebar navigation implemented
- [ ] Header with user info implemented
- [ ] Search functionality working
- [ ] Filter functionality working
- [ ] Table displays proposals correctly
- [ ] Pagination implemented
- [ ] View details navigation working (navigates to Contract Details screen)
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
- **Proposal Entity**: Proposal table structure
- **User Entity**: Client user information
- **Contact Entity**: Associated contact information
- **Contract Details Screen**: Target screen for proposal details view

## Risks and Mitigation

### Technical Risks
- **Performance**: Large proposal lists may slow down page
  - *Mitigation*: Implement pagination, limit page size, use database indexing
- **Search Performance**: Full-text search may be slow
  - *Mitigation*: Use database full-text search indexes, limit search scope

### Business Risks
- **User Experience**: Complex filters may confuse users
  - *Mitigation*: Simple, intuitive UI, clear labels, help tooltips

## Success Metrics

### Business Metrics
- **Proposal List Page Views**: Track page access
- **Search Usage**: Track search query frequency
- **Filter Usage**: Track filter selection frequency
- **Details View Clicks**: Track engagement with proposal details

### Technical Metrics
- **Page Load Time**: Target < 2 seconds
- **API Response Time**: Target < 500ms
- **Error Rate**: Target < 1%

## Future Enhancements

### Phase 2 Features
- **Advanced Filtering**: Filter by date range, contact ID, etc.
- **Bulk Actions**: Select multiple proposals for bulk operations
- **Export Functionality**: Export proposal list to CSV/Excel
- **Sorting**: Sort by any column (currently default sort only)

### Phase 3 Features
- **Proposal Status Workflow**: Change status from list view
- **Notifications**: Real-time updates when proposal status changes
- **Advanced Search**: Search across multiple fields with operators
- **Saved Searches**: Save frequently used search/filter combinations

---

**Story Status**: Ready for Development  
**Assigned To**: Backend & Frontend Teams  
**Estimated Effort**: 13 Story Points  
**Target Sprint**: Sprint 4

