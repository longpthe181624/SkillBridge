# User Story: Sales Opportunities List Management

## Story Information
- **Story ID**: Story-21
- **Title**: Sales Opportunities List Management
- **Epic**: Sales Portal - Opportunities Management
- **Priority**: High
- **Story Points**: 13
- **Sprint**: Sprint 6
- **Status**: Draft

## User Story
**As a** Sales User (Sales Manager or Sales Man)  
**I want to** view and manage opportunities in a list with search and filter capabilities  
**So that** I can track opportunity status, estimate values, and manage sales pipeline effectively

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] I can view a list of opportunities in a table format matching the wireframe
- [ ] Sales Manager can view all opportunities in the system
- [ ] Sales Man can only view opportunities created by themselves
- [ ] I can search opportunities by keywords
- [ ] I can filter opportunities by status
- [ ] I can view opportunity details by clicking the view icon
- [ ] Opportunities list matches the wireframe design exactly

### Detailed Acceptance Criteria

#### 1. Page Layout (Based on Wireframe)

- [ ] **Left Sidebar**:
  - [ ] "SKILL BRIDGE" logo/title at the top of sidebar in dark gray background
  - [ ] Navigation menu items with icons:
    - [ ] "Dashboard" with grid icon (four squares)
    - [ ] "Contact form" with envelope icon
    - [ ] "Opportunities" with document icon (highlighted/active state when on this page)
    - [ ] "Contract" with document icon
  - [ ] Sidebar has white background with dark gray header
  - [ ] Sidebar is collapsible on mobile (future enhancement)

- [ ] **Top Header Bar**:
  - [ ] Header bar has dark gray background
  - [ ] "SKILL BRIDGE" text on the far left in white
  - [ ] Page title "Opportunities management" displayed in the center in white text
  - [ ] User information displayed on the right:
    - [ ] User icon/avatar
    - [ ] User name (e.g., "Admin")
  - [ ] Header is sticky/static at top
  - [ ] Language selector (JA/EN) in header (optional)

- [ ] **Main Content Area**:
  - [ ] White background area for main content
  - [ ] Content is properly spaced from sidebar and header
  - [ ] Responsive layout for different screen sizes

#### 2. Opportunities List Controls

- [ ] **Search Bar**:
  - [ ] Search input field with magnifying glass icon on the left
  - [ ] Placeholder text: "Search"
  - [ ] Search functionality searches across:
    - [ ] Opportunity ID
    - [ ] Client Name
    - [ ] Client Email
    - [ ] Est. Value
  - [ ] Real-time search results (as user types, debounced)
  - [ ] Search is case-insensitive
  - [ ] Search clears when input is empty

- [ ] **Filter Dropdown**:
  - [ ] Filter dropdown button with filter icon (funnel icon)
  - [ ] Button displays current filter selection (e.g., "New/Proposal Drafting/Proposal Sent/Revision/Won/Lost")
  - [ ] Filter options:
    - [ ] "All" (shows all opportunities based on user role)
    - [ ] "New" (shows only new opportunities)
    - [ ] "Proposal Drafting" (shows opportunities in proposal drafting stage)
    - [ ] "Proposal Sent" (shows opportunities with proposals sent)
    - [ ] "Revision" (shows opportunities requiring revision)
    - [ ] "Won" (shows won opportunities)
    - [ ] "Lost" (shows lost opportunities)
  - [ ] Filter applies to opportunities list immediately
  - [ ] Current filter selection is visually indicated
  - [ ] Multiple status filters can be selected (e.g., "New/Proposal Drafting")

#### 3. Opportunities List Table

- [ ] **Table Structure**:
  - [ ] Table has clear borders and spacing
  - [ ] Table headers: No, ID, Est. Value, Probability, Client Email, Client Name, Status, Assignee, Action
  - [ ] All columns are properly aligned
  - [ ] Table is scrollable horizontally if content exceeds viewport width
  - [ ] Table rows have hover states
  - [ ] Table has alternating row colors for better readability

- [ ] **Table Columns**:
  - [ ] **No**: Sequential number (1, 2, 3, ...) starting from 1
  - [ ] **ID**: Opportunity ID format (e.g., "OP-2025-01")
    - [ ] ID is unique for each opportunity
    - [ ] ID format: OP-YYYY-NN (where YYYY is year, NN is sequence)
  - [ ] **Est. Value**: Estimated value of the opportunity
    - [ ] Displayed in currency format (e.g., "¥5,000,000")
    - [ ] Currency symbol and formatting based on locale
    - [ ] Values are right-aligned for better readability
  - [ ] **Probability**: Probability percentage of winning the opportunity
    - [ ] Displayed as percentage (e.g., "70%")
    - [ ] Values are right-aligned
    - [ ] May have color coding (e.g., green for high probability, red for low)
  - [ ] **Client Email**: Client's email address (e.g., "sato_taro@gmail.com")
    - [ ] Email is displayed in full
    - [ ] Email is clickable to open email client (optional enhancement)
  - [ ] **Client Name**: Client's full name (e.g., "Yamada Taro")
    - [ ] Client name is displayed clearly
    - [ ] Name is clickable to view client details (optional enhancement)
  - [ ] **Status**: Opportunity status badges
    - [ ] "New" status displayed with appropriate color
    - [ ] "In Progress" status displayed with appropriate color
    - [ ] "Proposal Drafting" status displayed with appropriate color
    - [ ] "Proposal Sent" status displayed with appropriate color
    - [ ] "Revision" status displayed with appropriate color
    - [ ] "Won" status displayed with appropriate color (e.g., green)
    - [ ] "Lost" status displayed with appropriate color (e.g., gray/red)
    - [ ] Each status has distinct color/styling for quick identification
  - [ ] **Assignee**: Assigned Sales Man information
    - [ ] Displays Sales Man's identifier or name (e.g., "Sale 01", "Yamada Taro")
    - [ ] Displays "-" (dash) if no assignee is assigned
    - [ ] Sales Manager can see all assignees
    - [ ] Sales Man only sees their own identifier or "-"
    - [ ] Assignee information is retrieved from users table via assignee_user_id foreign key
  - [ ] **Action**: Action icon
    - [ ] View icon (eye) for viewing opportunity details
    - [ ] Icon is clickable with hover states
    - [ ] Clicking view icon redirects to opportunity detail page

- [ ] **Table Data**:
  - [ ] **Sales Manager**: Table displays ALL opportunities in the system
    - [ ] No filtering by creator
    - [ ] Can see opportunities created by any Sales Man
    - [ ] Can see all assignees
  - [ ] **Sales Man**: Table displays ONLY opportunities created by them
    - [ ] Filtered by created_by matching current user's ID
    - [ ] Cannot see opportunities created by other Sales Men
    - [ ] Can see opportunities they created even if assigned to someone else
  - [ ] Opportunities are sorted by creation date (newest first) by default
  - [ ] Sorting can be changed by clicking column headers (optional enhancement)
  - [ ] Empty state message if no opportunities exist: "No opportunities found"
  - [ ] Loading state while fetching opportunities (skeleton loader or spinner)

#### 4. Role-Based Data Access

- [ ] **Sales Manager Permissions**:
  - [ ] Can view ALL opportunities regardless of creator
  - [ ] Can see all assignees
  - [ ] Can view opportunity details for all opportunities
  - [ ] Can view statistics across all opportunities
  - [ ] Can filter by assignee (optional enhancement)
  - [ ] Can filter by creator (optional enhancement)

- [ ] **Sales Man Permissions**:
  - [ ] Can ONLY view opportunities created by them (created_by = current_user_id)
  - [ ] Cannot see opportunities created by other Sales Men
  - [ ] Can see opportunities they created regardless of assignee
  - [ ] Can view opportunity details for opportunities they created

- [ ] **Backend Authorization**:
  - [ ] API endpoint filters data based on user role
  - [ ] Sales Manager: No creator filter applied
  - [ ] Sales Man: Filter by created_by = current_user_id
  - [ ] Authorization check performed on every API request
  - [ ] Unauthorized access attempts return 403 Forbidden

#### 5. Opportunity Actions

- [ ] **View Opportunity Details**:
  - [ ] Clicking view icon (eye) in Action column redirects to opportunity detail page
  - [ ] Redirect URL: `/sales/opportunities/{opportunityId}` or `/sales/opportunities/{id}`
  - [ ] Opportunity detail page shows full opportunity information
  - [ ] User can navigate back to opportunities list from detail page
  - [ ] View action is available for all opportunities based on user's role permissions
  - [ ] Sales Manager can view all opportunities
  - [ ] Sales Man can only view opportunities created by them

#### 6. Pagination

- [ ] **Pagination Controls**:
  - [ ] Pagination displayed at bottom right of table
  - [ ] Page numbers displayed: "1 2 3 4 5" (or more if needed)
  - [ ] Current page is highlighted/active (e.g., bold or different color)
  - [ ] Clicking page number loads that page
  - [ ] Default: 10-20 opportunities per page (configurable)
  - [ ] Total number of opportunities/pages displayed (optional)
  - [ ] Previous/Next buttons for navigation (optional)
  - [ ] Pagination respects current search and filter settings

#### 7. Authentication & Authorization

- [ ] **Access Control**:
  - [ ] Only authenticated sales users (SALES_MANAGER or SALES_REP) can access this page
  - [ ] Unauthenticated users redirected to sales login page
  - [ ] Non-sales users (CLIENT, ADMIN) cannot access this page
  - [ ] Session validation on page load
  - [ ] Token expiration handling

- [ ] **Role-Based Filtering**:
  - [ ] Backend API automatically filters opportunities based on user role
  - [ ] Sales Manager receives all opportunities
  - [ ] Sales Man receives only opportunities they created
  - [ ] Filtering happens at database query level for performance
  - [ ] No client-side filtering that could be bypassed

## Technical Requirements

### Frontend Requirements

```typescript
// Sales Opportunities List Page Component Structure
interface SalesOpportunitiesListPageProps {
  // Props if needed
}

interface Opportunity {
  id: number;
  opportunityId: string; // e.g., "OP-2025-01"
  estValue: number; // Estimated value in base currency
  currency: string; // e.g., "JPY", "USD"
  probability: number; // Percentage (0-100)
  clientEmail: string;
  clientName: string;
  status: 'NEW' | 'IN_PROGRESS' | 'PROPOSAL_DRAFTING' | 'PROPOSAL_SENT' | 'REVISION' | 'WON' | 'LOST';
  assigneeUserId: number | null; // Foreign key to users table
  assigneeName: string | null; // Sales Man's name from users table
  createdBy: number; // User ID who created this opportunity
  createdByName?: string; // Creator's name
  createdAt: string;
  updatedAt: string;
}

interface OpportunitiesListResponse {
  opportunities: Opportunity[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface OpportunitiesListFilters {
  search?: string;
  status?: string[];
  assigneeUserId?: number; // For Sales Manager filtering
  createdBy?: number; // For Sales Manager filtering by creator
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
// Sales Opportunities Controller
@RestController
@RequestMapping("/api/sales/opportunities")
@PreAuthorize("hasAnyRole('SALES_MANAGER', 'SALES_REP')")
public class SalesOpportunitiesController {
    
    @Autowired
    private SalesOpportunitiesService opportunitiesService;
    
    @GetMapping
    public ResponseEntity<OpportunitiesListResponse> getOpportunities(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) List<String> status,
        @RequestParam(required = false) Integer assigneeUserId,
        @RequestParam(required = false) Integer createdBy,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        Authentication authentication
    ) {
        // Get current user from authentication
        User currentUser = getCurrentUser(authentication);
        
        // Build filters
        OpportunitiesListFilters filters = new OpportunitiesListFilters();
        filters.setSearch(search);
        filters.setStatus(status);
        
        // Role-based filtering
        if (currentUser.getRole() == SalesRole.SALES_REP) {
            // Sales Man: only opportunities they created
            filters.setCreatedBy(currentUser.getId());
        } else if (currentUser.getRole() == SalesRole.SALES_MANAGER) {
            // Sales Manager: can filter by assignee or creator if specified
            filters.setAssigneeUserId(assigneeUserId);
            filters.setCreatedBy(createdBy);
        }
        
        OpportunitiesListResponse response = opportunitiesService.getOpportunities(filters, page, size);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OpportunityDTO> getOpportunityById(
        @PathVariable Long id,
        Authentication authentication
    ) {
        User currentUser = getCurrentUser(authentication);
        OpportunityDTO opportunity = opportunitiesService.getOpportunityById(id, currentUser);
        return ResponseEntity.ok(opportunity);
    }
}

// Sales Opportunities Service with Role-Based Logic
@Service
public class SalesOpportunitiesService {
    
    @Autowired
    private OpportunityRepository opportunityRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public OpportunitiesListResponse getOpportunities(OpportunitiesListFilters filters, int page, int size) {
        // Build query based on filters and role
        Specification<Opportunity> spec = buildSpecification(filters);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Opportunity> opportunityPage = opportunityRepository.findAll(spec, pageable);
        
        // Convert to DTO and join with users table to get assignee name
        List<OpportunityDTO> opportunities = opportunityPage.getContent().stream()
            .map(opportunity -> {
                OpportunityDTO dto = convertToDTO(opportunity);
                // Load assignee user to get full name
                if (opportunity.getAssigneeUserId() != null) {
                    User assignee = userRepository.findById(opportunity.getAssigneeUserId())
                        .orElse(null);
                    if (assignee != null) {
                        dto.setAssigneeName(assignee.getFullName());
                    }
                }
                return dto;
            })
            .collect(Collectors.toList());
        
        OpportunitiesListResponse response = new OpportunitiesListResponse();
        response.setOpportunities(opportunities);
        response.setTotal(opportunityPage.getTotalElements());
        response.setPage(page);
        response.setPageSize(size);
        response.setTotalPages(opportunityPage.getTotalPages());
        
        return response;
    }
    
    private Specification<Opportunity> buildSpecification(OpportunitiesListFilters filters) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // Search filter
            if (filters.getSearch() != null && !filters.getSearch().isEmpty()) {
                String searchPattern = "%" + filters.getSearch().toLowerCase() + "%";
                Predicate opportunityId = cb.like(cb.lower(root.get("opportunityId")), searchPattern);
                Predicate clientName = cb.like(cb.lower(root.get("clientName")), searchPattern);
                Predicate clientEmail = cb.like(cb.lower(root.get("clientEmail")), searchPattern);
                
                predicates.add(cb.or(opportunityId, clientName, clientEmail));
            }
            
            // Status filter
            if (filters.getStatus() != null && !filters.getStatus().isEmpty()) {
                predicates.add(root.get("status").in(filters.getStatus()));
            }
            
            // Assignee filter (applied based on role in controller)
            if (filters.getAssigneeUserId() != null) {
                predicates.add(cb.equal(root.get("assigneeUserId"), filters.getAssigneeUserId()));
            }
            
            // Created by filter (applied based on role in controller)
            if (filters.getCreatedBy() != null) {
                predicates.add(cb.equal(root.get("createdBy"), filters.getCreatedBy()));
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
    
    public OpportunityDTO getOpportunityById(Long id, User currentUser) {
        Opportunity opportunity = opportunityRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Opportunity not found"));
        
        // Authorization check
        if (currentUser.getRole() == SalesRole.SALES_REP) {
            if (opportunity.getCreatedBy() == null || 
                !opportunity.getCreatedBy().equals(currentUser.getId())) {
                throw new AccessDeniedException("You can only view opportunities created by you");
            }
        }
        
        OpportunityDTO dto = convertToDTO(opportunity);
        
        // Load assignee user to get full name
        if (opportunity.getAssigneeUserId() != null) {
            User assignee = userRepository.findById(opportunity.getAssigneeUserId())
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
-- Opportunities table
CREATE TABLE opportunities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    opportunity_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., "OP-2025-01"
    contact_id INT, -- Foreign key to contacts table (if converted from contact)
    est_value DECIMAL(15, 2) NOT NULL, -- Estimated value
    currency VARCHAR(10) DEFAULT 'JPY', -- Currency code (JPY, USD, etc.)
    probability INT DEFAULT 0, -- Percentage (0-100)
    client_email VARCHAR(255) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    status VARCHAR(32) DEFAULT 'NEW', -- NEW, IN_PROGRESS, PROPOSAL_DRAFTING, PROPOSAL_SENT, REVISION, WON, LOST
    assignee_user_id INT, -- Foreign key to users table (Sales Man assigned)
    created_by INT NOT NULL, -- Foreign key to users table (Sales Man who created this opportunity)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_opportunity_id (opportunity_id),
    INDEX idx_contact_id (contact_id),
    INDEX idx_status (status),
    INDEX idx_assignee_user_id (assignee_user_id),
    INDEX idx_created_by (created_by),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL,
    FOREIGN KEY (assignee_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
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
// Sales Opportunities List Page Component
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Filter, Eye, Grid, Mail, FileText, User } from 'lucide-react';

export default function SalesOpportunitiesListPage() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
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

  // Fetch opportunities
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchOpportunities();
    }
  }, [search, statusFilter, page, isAuthenticated, token]);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter.length > 0) {
        statusFilter.forEach(status => params.append('status', status));
      }
      params.append('page', (page - 1).toString());
      params.append('size', '20');

      const response = await fetch(`/api/sales/opportunities?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch opportunities');
      }

      const data: OpportunitiesListResponse = await response.json();
      setOpportunities(data.opportunities);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOpportunity = (opportunityId: string) => {
    router.push(`/sales/opportunities/${opportunityId}`);
  };

  const formatCurrency = (value: number, currency: string) => {
    if (currency === 'JPY') {
      return `¥${value.toLocaleString('ja-JP')}`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-orange-100 text-orange-800';
      case 'PROPOSAL_DRAFTING': return 'bg-purple-100 text-purple-800';
      case 'PROPOSAL_SENT': return 'bg-yellow-100 text-yellow-800';
      case 'REVISION': return 'bg-pink-100 text-pink-800';
      case 'WON': return 'bg-green-100 text-green-800';
      case 'LOST': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'NEW': 'New',
      'IN_PROGRESS': 'In Progress',
      'PROPOSAL_DRAFTING': 'Proposal Drafting',
      'PROPOSAL_SENT': 'Proposal Sent',
      'REVISION': 'Revision',
      'WON': 'Won',
      'LOST': 'Lost',
    };
    return statusMap[status] || status;
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
          <a href="/sales/contacts" className="flex items-center gap-2 p-2 hover:bg-gray-100">
            <Mail className="w-5 h-5" />
            <span>Contact form</span>
          </a>
          <a href="/sales/opportunities" className="flex items-center gap-2 p-2 bg-blue-50 text-blue-600 font-medium">
            <FileText className="w-5 h-5" />
            <span>Opportunities</span>
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
          <div className="flex items-center gap-4">
            <span className="text-sm">SKILL BRIDGE</span>
            <span className="text-xl font-semibold">Opportunities management</span>
          </div>
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
              {statusFilter.length > 0 ? statusFilter.map(formatStatus).join('/') : 'All'}
            </Button>
          </div>

          {/* Opportunities Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="text-right">Est. Value</TableHead>
                  <TableHead className="text-right">Probability</TableHead>
                  <TableHead>Client Email</TableHead>
                  <TableHead>Client Name</TableHead>
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
                ) : opportunities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      No opportunities found
                    </TableCell>
                  </TableRow>
                ) : (
                  opportunities.map((opportunity, index) => (
                    <TableRow key={opportunity.id}>
                      <TableCell>{(page - 1) * 20 + index + 1}</TableCell>
                      <TableCell>{opportunity.opportunityId}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(opportunity.estValue, opportunity.currency)}
                      </TableCell>
                      <TableCell className="text-right">{opportunity.probability}%</TableCell>
                      <TableCell>{opportunity.clientEmail}</TableCell>
                      <TableCell>{opportunity.clientName}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(opportunity.status)}>
                          {formatStatus(opportunity.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{opportunity.assigneeName || '-'}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewOpportunity(opportunity.opportunityId)}
                          title="View opportunity details"
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
- [ ] Opportunities list component renders correctly
- [ ] Search functionality filters opportunities
- [ ] Status filter works correctly
- [ ] Pagination controls work
- [ ] Role-based data filtering (Sales Manager vs Sales Man)
- [ ] View icon displays correctly
- [ ] Currency formatting works correctly
- [ ] Probability display works correctly
- [ ] Empty state displays correctly

### Integration Tests
- [ ] API returns all opportunities for Sales Manager
- [ ] API returns only created opportunities for Sales Man
- [ ] Search API works correctly
- [ ] Filter API works correctly
- [ ] Get opportunity by ID API works with authorization check
- [ ] Unauthorized access returns 403

### End-to-End Tests
- [ ] Sales Manager can view all opportunities
- [ ] Sales Man can only view opportunities they created
- [ ] Search functionality works end-to-end
- [ ] Filter functionality works end-to-end
- [ ] View opportunity detail flow with redirect
- [ ] Authorization check on view opportunity detail
- [ ] Pagination works correctly

## Performance Requirements

### Performance Metrics
- **Page Load Time**: < 2 seconds
- **Search Response Time**: < 500ms (debounced)
- **Filter Response Time**: < 500ms
- **Table Render Time**: < 1 second for 20 opportunities
- **Pagination Load Time**: < 500ms

## Security Considerations

### Security Requirements
- [ ] Role-based access control enforced at API level
- [ ] Sales Man cannot access opportunities created by others
- [ ] Authorization checks on all view operations
- [ ] Input validation on search and filter inputs
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection on all user inputs
- [ ] HTTPS required for all API requests

## Definition of Done

### Development Complete
- [ ] Sales opportunities list page implemented matching wireframe
- [ ] Role-based data filtering implemented (Sales Manager vs Sales Man)
- [ ] Search functionality implemented
- [ ] Filter functionality implemented
- [ ] View opportunity detail with redirect implemented
- [ ] Pagination implemented
- [ ] Authorization checks implemented
- [ ] Currency formatting implemented
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
- **Opportunity Entity**: Opportunities table with created_by field
- **AuthContext**: Authentication context for sales users
- **LanguageContext**: Multi-language support (if applicable)

## Risks and Mitigation

### Technical Risks
- **Performance**: Large number of opportunities may slow down queries
  - *Mitigation*: Implement pagination, database indexing, query optimization
- **Authorization Bypass**: Sales Man accessing other opportunities
  - *Mitigation*: Enforce authorization at database query level, not just frontend
- **Data Consistency**: Creator changes not reflected immediately
  - *Mitigation*: Implement real-time updates or refresh mechanism

### Business Risks
- **User Experience**: Complex filtering may confuse users
  - *Mitigation*: Clear UI, tooltips, user testing
- **Data Privacy**: Sales Man seeing wrong opportunities
  - *Mitigation*: Thorough testing, authorization checks at multiple levels

---

**Story Status**: Draft  
**Assigned To**: Backend & Frontend Teams  
**Estimated Effort**: 13 Story Points  
**Target Sprint**: Sprint 6

