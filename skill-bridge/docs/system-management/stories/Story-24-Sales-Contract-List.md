# User Story: Sales Contract List Management

## Story Information
- **Story ID**: Story-24
- **Title**: Sales Contract List Management
- **Epic**: Sales Portal - Contract Management
- **Priority**: High
- **Story Points**: 13
- **Sprint**: Sprint 6
- **Status**: Draft

## User Story
**As a** Sales User (Sales Manager or Sales Man)  
**I want to** view and manage contracts in a list with search and filter capabilities  
**So that** I can track contract status, monitor contract values and periods, and manage client relationships effectively

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] I can view a list of contracts in a table format matching the wireframe
- [ ] Sales Manager can view all contracts in the system
- [ ] Sales Man can only view contracts assigned to themselves
- [ ] I can search contracts by keywords
- [ ] I can filter contracts by status
- [ ] I can view contract details by clicking the view icon
- [ ] Contracts list matches the wireframe design exactly

### Detailed Acceptance Criteria

#### 1. Page Layout (Based on Wireframe)

- [ ] **Left Sidebar**:
  - [ ] "SKILL BRIDGE" logo/title at the top of sidebar in dark gray background
  - [ ] Navigation menu items with icons:
    - [ ] "Dashboard" with grid icon (four squares)
    - [ ] "Contact form" with envelope icon
    - [ ] "Opportunities" with document icon
    - [ ] "Contract" with document icon (highlighted/active state when on this page)
  - [ ] Sidebar has white background with dark gray header
  - [ ] Sidebar is collapsible on mobile (future enhancement)

- [ ] **Top Header Bar**:
  - [ ] Header bar has dark gray background
  - [ ] "SKILL BRIDGE" text on the far left in white
  - [ ] Page title "Contract Management" displayed in the center in white text
  - [ ] User information displayed on the right:
    - [ ] User icon/avatar
    - [ ] User name (e.g., "Admin")
  - [ ] Header is sticky/static at top
  - [ ] Language selector (JA/EN) in header (optional)

- [ ] **Main Content Area**:
  - [ ] White background area for main content
  - [ ] Content is properly spaced from sidebar and header
  - [ ] Responsive layout for different screen sizes

#### 2. Contract List Controls

- [ ] **Search Bar**:
  - [ ] Search input field with magnifying glass icon on the left
  - [ ] Placeholder text: "Search"
  - [ ] Search functionality searches across:
    - [ ] Contract ID (e.g., "MSA-2025-07", "SOW-2025-07")
    - [ ] Contract Name
    - [ ] Client Name
    - [ ] Client Email
  - [ ] Real-time search results (as user types, debounced)
  - [ ] Search is case-insensitive
  - [ ] Search clears when input is empty

- [ ] **Filter Dropdown**:
  - [ ] Filter dropdown button with filter icon (funnel icon)
  - [ ] Button displays current filter selection (e.g., "All")
  - [ ] Filter options:
    - [ ] "All" (shows all contracts based on user role)
    - [ ] "Request for Change" (shows contracts with change requests)
    - [ ] "Internal Review" (shows contracts under internal review)
    - [ ] "Client Under Review" (shows contracts under client review)
    - [ ] "Completed" (shows completed contracts)
    - [ ] "Terminated" (shows terminated contracts)
  - [ ] Filter applies to contracts list immediately
  - [ ] Current filter selection is visually indicated
  - [ ] Single status filter selection (dropdown select)

- [ ] **Create New Button**:
  - [ ] Button labeled "+ Create new" positioned on the right side of search/filter bar
  - [ ] Button is clickable and navigates to contract creation page
  - [ ] Button is visible to both Sales Manager and Sales Man
  - [ ] Button has appropriate styling (outline or primary button style)

#### 3. Contract List Table

- [ ] **Table Structure**:
  - [ ] Table has clear borders and spacing
  - [ ] Table headers: No, ID, Contract Name, Client, Type, Period, Value, Status, Action
  - [ ] All columns are properly aligned
  - [ ] Table is scrollable horizontally if content exceeds viewport width
  - [ ] Table rows have hover states
  - [ ] Table has alternating row colors for better readability

- [ ] **Table Columns**:
  - [ ] **No**: Sequential number (1, 2, 3, ...) starting from 1
    - [ ] Numbers are sequential and unique per page
    - [ ] Resets based on current page and filter
  - [ ] **ID**: Contract ID format (e.g., "MSA-2025-07", "SOW-2025-07")
    - [ ] ID is unique for each contract
    - [ ] ID format: MSA-YYYY-NN or SOW-YYYY-NN (where YYYY is year, NN is sequence)
    - [ ] ID can be used for navigation to detail page
  - [ ] **Contract Name**: Contract name/title (e.g., "SOW - Request for Change Retainer Project")
    - [ ] Full name displayed (may be truncated with ellipsis if too long)
    - [ ] Tooltip shows full name on hover if truncated
  - [ ] **Client**: Client's full name (e.g., "Yamada Taro")
    - [ ] Client name is displayed in bold
    - [ ] Client name is clearly visible
    - [ ] Name is clickable to view client details (optional enhancement)
  - [ ] **Type**: Contract type badge
    - [ ] "MSA" (Master Service Agreement) displayed
    - [ ] "SOW" (Statement of Work) displayed
    - [ ] Each type has distinct color/styling
  - [ ] **Period**: Contract period date range
    - [ ] Format: "YYYY/MM/D-YYYY/MM/DD" (e.g., "2025/05/1-2026/04/30")
    - [ ] Single digit day without leading zero (e.g., "1" not "01")
    - [ ] Period clearly indicates start and end dates
    - [ ] "-" displayed if period is not set
  - [ ] **Value**: Contract value/amount
    - [ ] Format: "¥X,XXX,XXX" (e.g., "¥900,000")
    - [ ] Currency symbol (¥) displayed
    - [ ] Numbers formatted with comma separators
    - [ ] "-" displayed if value is not set (for MSA contracts typically)
    - [ ] Values are right-aligned for better readability
  - [ ] **Status**: Contract status badges
    - [ ] "Request for Change" status displayed with appropriate color
    - [ ] "Internal Review" status displayed with appropriate color
    - [ ] "Client Under Review" status displayed with appropriate color
    - [ ] "Completed" status displayed with appropriate color (e.g., green)
    - [ ] "Terminated" status displayed with appropriate color (e.g., gray/red)
    - [ ] Each status has distinct color/styling for quick identification
  - [ ] **Action**: Eye icon for viewing details
    - [ ] Eye icon is clickable
    - [ ] Hover state indicates clickability
    - [ ] Clicking eye icon navigates to contract detail page
    - [ ] Icon is clearly visible and accessible

- [ ] **Table Data**:
  - [ ] Table displays contracts based on user role:
    - [ ] Sales Manager: All contracts in the system
    - [ ] Sales Man: Only contracts assigned to themselves
  - [ ] Contracts are sorted by creation date (newest first) by default
  - [ ] Empty state message if no contracts exist: "No contracts found"
  - [ ] Loading state while fetching contracts (skeleton loader or spinner)
  - [ ] Error message if contract fetch fails

#### 4. Role-Based Data Access

- [ ] **Sales Manager Permissions**:
  - [ ] Can view all contracts in the system
  - [ ] Can see contracts assigned to any Sales Man
  - [ ] Can see unassigned contracts
  - [ ] Can search and filter all contracts
  - [ ] Can view details of any contract

- [ ] **Sales Man Permissions**:
  - [ ] Can only view contracts assigned to themselves
  - [ ] Cannot see contracts assigned to other Sales Men
  - [ ] Cannot see unassigned contracts (unless assigned to them)
  - [ ] Can search and filter only their assigned contracts
  - [ ] Can view details of only their assigned contracts

#### 5. Pagination

- [ ] **Pagination Controls**:
  - [ ] Pagination displayed at bottom right of table
  - [ ] Page numbers: "1 2 3 4 5" (or more if needed)
  - [ ] Current page is highlighted/active (e.g., number "1" is highlighted)
  - [ ] Clicking page number loads that page
  - [ ] Default: 20 contracts per page (configurable)
  - [ ] Total number of contracts/pages displayed (optional)
  - [ ] Previous/Next buttons (optional, for better UX)

## Technical Requirements

### Frontend Requirements

```typescript
// Sales Contract List Page Component Structure
interface SalesContractListPageProps {
  // Props if needed
}

interface Contract {
  id: number;
  contractId: string; // e.g., "MSA-2025-07", "SOW-2025-07"
  contractName: string; // e.g., "SOW - Request for Change Retainer Project"
  clientName: string; // e.g., "Yamada Taro"
  clientEmail: string;
  type: 'MSA' | 'SOW';
  periodStart: string | null; // Format: "YYYY/MM/DD"
  periodEnd: string | null; // Format: "YYYY/MM/DD"
  value: number | null; // Contract value in base currency
  currency: string; // e.g., "JPY"
  status: 'REQUEST_FOR_CHANGE' | 'INTERNAL_REVIEW' | 'CLIENT_UNDER_REVIEW' | 'COMPLETED' | 'TERMINATED';
  assigneeUserId: number | null; // Foreign key to users table (Sales Man)
  assigneeName: string | null; // Sales Man's name from users table
  createdAt: string;
  updatedAt: string;
}

interface ContractsListResponse {
  contracts: Contract[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface ContractsListFilters {
  search?: string;
  status?: string;
  assigneeUserId?: number; // For Sales Manager filtering
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

### Key Frontend Functions

```typescript
// Fetch contracts list with filters
const fetchContracts = async (
  search?: string,
  status?: string,
  page: number = 0,
  pageSize: number = 20,
  token: string
): Promise<ContractsListResponse> => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (status && status !== 'All') params.append('status', status);
  params.append('page', page.toString());
  params.append('size', pageSize.toString());

  const response = await fetch(`${API_BASE_URL}/sales/contracts?${params}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch contracts');
  }

  return response.json();
};

// Format contract period
const formatPeriod = (start: string | null, end: string | null): string => {
  if (!start || !end) return '-';
  // Format: "YYYY/MM/D-YYYY/MM/DD"
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = date.getDate(); // No leading zero for day
    return `${year}/${month}/${day}`;
  };
  return `${formatDate(start)}-${formatDate(end)}`;
};

// Format contract value
const formatValue = (value: number | null, currency: string = 'JPY'): string => {
  if (value === null || value === undefined) return '-';
  return `¥${value.toLocaleString('ja-JP')}`;
};

// Get status badge color
const getStatusBadgeColor = (status: string): string => {
  switch (status) {
    case 'REQUEST_FOR_CHANGE': return 'bg-orange-100 text-orange-800';
    case 'INTERNAL_REVIEW': return 'bg-blue-100 text-blue-800';
    case 'CLIENT_UNDER_REVIEW': return 'bg-yellow-100 text-yellow-800';
    case 'COMPLETED': return 'bg-green-100 text-green-800';
    case 'TERMINATED': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
```

### Backend Requirements

```java
// Sales Contract List Controller
@RestController
@RequestMapping("/sales/contracts")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:4200"}, 
             allowCredentials = "true",
             maxAge = 3600)
// Note: @PreAuthorize disabled in dev mode, role check done manually in controller
// @PreAuthorize("hasAnyRole('SALES_MANAGER', 'SALES_REP')")
public class SalesContractController {
    
    @Autowired
    private SalesContractService contractService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @GetMapping
    public ResponseEntity<?> getContracts(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String status,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        Authentication authentication,
        HttpServletRequest request
    ) {
        User currentUser = getCurrentUser(authentication, request);
        
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        
        String role = currentUser.getRole();
        if (role == null || (!role.equals("SALES_MANAGER") && !role.equals("SALES_REP"))) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            ContractsListResponse response = contractService.getContracts(
                search, status, page, size, currentUser
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(new ErrorResponse(e.getMessage()));
        }
    }
    
    private User getCurrentUser(Authentication authentication, HttpServletRequest request) {
        // Try to get user from authentication (works in production with Spring Security)
        if (authentication != null && authentication.isAuthenticated() && 
            authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails) {
            org.springframework.security.core.userdetails.UserDetails userDetails = 
                (org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal();
            return userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        }
        
        // Fallback: Try to get user from JWT token in Authorization header (for dev mode)
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);
                String email = jwtTokenProvider.getEmailFromToken(token);
                return userRepository.findByEmail(email).orElse(null);
            } catch (Exception e) {
                return null;
            }
        }
        
        return null;
    }
}

// Sales Contract List Service with Role-Based Logic
@Service
public class SalesContractService {
    
    @Autowired
    private ContractRepository contractRepository;
    
    @Autowired
    private SOWContractRepository sowContractRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public ContractsListResponse getContracts(
        String search, 
        String status, 
        int page, 
        int size, 
        User currentUser
    ) {
        // Role-based filtering
        Integer assigneeUserId = null;
        if ("SALES_REP".equals(currentUser.getRole())) {
            // Sales Man: only contracts assigned to themselves
            assigneeUserId = currentUser.getId();
        }
        // Sales Manager: assigneeUserId remains null (sees all contracts)
        
        // Build query for both MSA and SOW contracts
        Specification<Contract> msaSpec = buildMSASpecification(search, status, assigneeUserId);
        Specification<SOWContract> sowSpec = buildSOWSpecification(search, status, assigneeUserId);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        // Query both MSA and SOW contracts
        Page<Contract> msaPage = contractRepository.findAll(msaSpec, pageable);
        Page<SOWContract> sowPage = sowContractRepository.findAll(sowSpec, pageable);
        
        // Combine and convert to unified DTOs
        List<ContractListItemDTO> contracts = new ArrayList<>();
        
        // Convert MSA contracts
        for (Contract contract : msaPage.getContent()) {
            ContractListItemDTO dto = convertMSAToDTO(contract);
            contracts.add(dto);
        }
        
        // Convert SOW contracts
        for (SOWContract sowContract : sowPage.getContent()) {
            ContractListItemDTO dto = convertSOWToDTO(sowContract);
            contracts.add(dto);
        }
        
        // Sort combined list by creation date (newest first)
        contracts.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        
        // Calculate pagination for combined results
        int totalElements = (int) (msaPage.getTotalElements() + sowPage.getTotalElements());
        int totalPages = (int) Math.ceil((double) totalElements / size);
        
        // Apply pagination to combined list
        int start = page * size;
        int end = Math.min(start + size, contracts.size());
        List<ContractListItemDTO> paginatedContracts = contracts.subList(start, end);
        
        ContractsListResponse response = new ContractsListResponse();
        response.setContracts(paginatedContracts);
        response.setTotal(totalElements);
        response.setPage(page);
        response.setPageSize(size);
        response.setTotalPages(totalPages);
        
        return response;
    }
    
    private Specification<Contract> buildMSASpecification(String search, String status, Integer assigneeUserId) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // Role-based filtering: assignee_user_id
            if (assigneeUserId != null) {
                predicates.add(cb.equal(root.get("assigneeUserId"), assigneeUserId));
            }
            
            // Search filter
            if (search != null && !search.isEmpty()) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                Predicate contractId = cb.like(cb.lower(root.get("contractId")), searchPattern);
                Predicate contractName = cb.like(cb.lower(root.get("contractName")), searchPattern);
                // Join with users table to search by client name/email
                Join<Contract, User> clientJoin = root.join("client", JoinType.LEFT);
                Predicate clientName = cb.like(cb.lower(clientJoin.get("fullName")), searchPattern);
                Predicate clientEmail = cb.like(cb.lower(clientJoin.get("email")), searchPattern);
                
                predicates.add(cb.or(contractId, contractName, clientName, clientEmail));
            }
            
            // Status filter
            if (status != null && !status.isEmpty() && !status.equals("All")) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
    
    private Specification<SOWContract> buildSOWSpecification(String search, String status, Integer assigneeUserId) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // Role-based filtering: assignee_user_id
            if (assigneeUserId != null) {
                predicates.add(cb.equal(root.get("assigneeUserId"), assigneeUserId));
            }
            
            // Search filter
            if (search != null && !search.isEmpty()) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                Predicate contractId = cb.like(cb.lower(root.get("contractId")), searchPattern);
                Predicate contractName = cb.like(cb.lower(root.get("contractName")), searchPattern);
                // Join with users table to search by client name/email
                Join<SOWContract, User> clientJoin = root.join("client", JoinType.LEFT);
                Predicate clientName = cb.like(cb.lower(clientJoin.get("fullName")), searchPattern);
                Predicate clientEmail = cb.like(cb.lower(clientJoin.get("email")), searchPattern);
                
                predicates.add(cb.or(contractId, contractName, clientName, clientEmail));
            }
            
            // Status filter
            if (status != null && !status.isEmpty() && !status.equals("All")) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
    
    private ContractListItemDTO convertMSAToDTO(Contract contract) {
        ContractListItemDTO dto = new ContractListItemDTO();
        dto.setInternalId(contract.getId());
        dto.setContractId(generateContractId(contract.getId(), "MSA", contract.getCreatedAt()));
        dto.setContractName(contract.getContractName());
        dto.setType("MSA");
        dto.setPeriodStart(contract.getPeriodStart() != null ? 
            contract.getPeriodStart().format(DateTimeFormatter.ofPattern("yyyy/MM/d")) : null);
        dto.setPeriodEnd(contract.getPeriodEnd() != null ? 
            contract.getPeriodEnd().format(DateTimeFormatter.ofPattern("yyyy/MM/dd")) : null);
        dto.setPeriod(formatPeriod(contract.getPeriodStart(), contract.getPeriodEnd()));
        dto.setValue(contract.getValue());
        dto.setFormattedValue(formatValue(contract.getValue()));
        dto.setStatus(contract.getStatus().toString());
        
        // Load client name from users table
        if (contract.getClientId() != null) {
            userRepository.findById(contract.getClientId()).ifPresent(user -> {
                dto.setClientName(user.getFullName());
                dto.setClientEmail(user.getEmail());
            });
        }
        
        // Load assignee name from users table
        if (contract.getAssigneeUserId() != null) {
            userRepository.findById(contract.getAssigneeUserId()).ifPresent(user -> {
                dto.setAssigneeName(user.getFullName());
            });
        }
        
        dto.setCreatedAt(contract.getCreatedAt());
        return dto;
    }
    
    private ContractListItemDTO convertSOWToDTO(SOWContract sowContract) {
        ContractListItemDTO dto = new ContractListItemDTO();
        dto.setInternalId(sowContract.getId());
        dto.setContractId(generateContractId(sowContract.getId(), "SOW", sowContract.getCreatedAt()));
        dto.setContractName(sowContract.getContractName());
        dto.setType("SOW");
        dto.setPeriodStart(sowContract.getPeriodStart() != null ? 
            sowContract.getPeriodStart().format(DateTimeFormatter.ofPattern("yyyy/MM/d")) : null);
        dto.setPeriodEnd(sowContract.getPeriodEnd() != null ? 
            sowContract.getPeriodEnd().format(DateTimeFormatter.ofPattern("yyyy/MM/dd")) : null);
        dto.setPeriod(formatPeriod(sowContract.getPeriodStart(), sowContract.getPeriodEnd()));
        dto.setValue(sowContract.getValue());
        dto.setFormattedValue(formatValue(sowContract.getValue()));
        dto.setStatus(sowContract.getStatus().toString());
        
        // Load client name from users table
        if (sowContract.getClientId() != null) {
            userRepository.findById(sowContract.getClientId()).ifPresent(user -> {
                dto.setClientName(user.getFullName());
                dto.setClientEmail(user.getEmail());
            });
        }
        
        // Load assignee name from users table
        if (sowContract.getAssigneeUserId() != null) {
            userRepository.findById(sowContract.getAssigneeUserId()).ifPresent(user -> {
                dto.setAssigneeName(user.getFullName());
            });
        }
        
        dto.setCreatedAt(sowContract.getCreatedAt());
        return dto;
    }
    
    private String generateContractId(Integer id, String type, LocalDateTime createdAt) {
        // Format: MSA-YYYY-NN or SOW-YYYY-NN
        int year = createdAt.getYear();
        // Calculate sequence number based on contract creation order in the year
        // This is a simplified version - actual implementation may need to query database
        int sequenceNumber = calculateSequenceNumber(id, type, year);
        return String.format("%s-%d-%02d", type, year, sequenceNumber);
    }
    
    private String formatPeriod(LocalDate start, LocalDate end) {
        if (start == null && end == null) {
            return "-";
        }
        if (start == null) {
            return "-" + formatDate(end);
        }
        if (end == null) {
            return formatDate(start);
        }
        // Format: "YYYY/MM/D-YYYY/MM/DD" (single digit day without leading zero for start date)
        return formatDate(start) + "-" + formatDateWithLeadingZero(end);
    }
    
    private String formatDate(LocalDate date) {
        // Format: YYYY/MM/D (without leading zero for day)
        return String.format("%d/%02d/%d", date.getYear(), date.getMonthValue(), date.getDayOfMonth());
    }
    
    private String formatDateWithLeadingZero(LocalDate date) {
        // Format: YYYY/MM/DD (with leading zero for day)
        return String.format("%d/%02d/%02d", date.getYear(), date.getMonthValue(), date.getDayOfMonth());
    }
    
    private String formatValue(BigDecimal value) {
        if (value == null) {
            return "-";
        }
        // Format: ¥X,XXX,XXX
        DecimalFormat formatter = new DecimalFormat("¥#,###");
        return formatter.format(value);
    }
    
    private int calculateSequenceNumber(Integer id, String type, int year) {
        // This is a simplified version
        // Actual implementation should query database to count contracts of same type in the year
        // and determine sequence number based on creation order
        return id % 100; // Placeholder - replace with actual logic
    }
}

// Contract List Item DTO
public class ContractListItemDTO {
    private Integer internalId; // Primary key (database ID) - used for navigation
    private String contractId; // Display ID format: MSA-YYYY-NN or SOW-YYYY-NN
    private String contractName;
    private String clientName;
    private String clientEmail;
    private String type; // "MSA" or "SOW"
    private String periodStart; // Format: "YYYY/MM/D"
    private String periodEnd; // Format: "YYYY/MM/DD"
    private String period; // Formatted period: "YYYY/MM/D-YYYY/MM/DD" or "-"
    private BigDecimal value; // Contract value in JPY or null
    private String formattedValue; // Formatted value: "¥X,XXX,XXX" or "-"
    private String status; // Contract status
    private Integer assigneeUserId; // Foreign key to users table
    private String assigneeName; // Sales Man's name from users table
    private LocalDateTime createdAt;
    
    // Getters and setters...
}

// Contracts List Response DTO
public class ContractsListResponse {
    private List<ContractListItemDTO> contracts;
    private int total;
    private int page;
    private int pageSize;
    private int totalPages;
    
    // Getters and setters...
}
```

### Database Schema

**Note**: The contracts and sow_contracts tables already exist. However, to support role-based filtering by Sales Man assignment, we need to ensure there is an `assignee_user_id` field (INT) that references the `users` table. If this field doesn't exist, a migration should be created.

```sql
-- Migration: Add assignee_user_id to contracts and sow_contracts tables (if not exists)
-- VXX__add_assignee_user_id_to_contracts.sql

-- Add assignee_user_id to contracts table (if not exists)
ALTER TABLE contracts
ADD COLUMN IF NOT EXISTS assignee_user_id INT NULL AFTER assignee_id,
ADD INDEX IF NOT EXISTS idx_assignee_user_id (assignee_user_id),
ADD FOREIGN KEY IF NOT EXISTS fk_contracts_assignee_user 
    (assignee_user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Add assignee_user_id to sow_contracts table (if not exists)
ALTER TABLE sow_contracts
ADD COLUMN IF NOT EXISTS assignee_user_id INT NULL AFTER assignee_id,
ADD INDEX IF NOT EXISTS idx_assignee_user_id (assignee_user_id),
ADD FOREIGN KEY IF NOT EXISTS fk_sow_contracts_assignee_user 
    (assignee_user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Note: assignee_id (VARCHAR) is kept for backward compatibility
-- assignee_user_id (INT) is used for role-based filtering and joins with users table
```

**Existing Tables** (for reference):

```sql
-- contracts table structure (simplified)
CREATE TABLE contracts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT NOT NULL,
  contract_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Draft',
  period_start DATE,
  period_end DATE,
  value DECIMAL(16,2),
  assignee_id VARCHAR(50), -- Legacy field
  assignee_user_id INT, -- New field for role-based filtering
  currency VARCHAR(16),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assignee_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_client_id (client_id),
  INDEX idx_assignee_user_id (assignee_user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- sow_contracts table structure (simplified)
CREATE TABLE sow_contracts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT NOT NULL,
  contract_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Draft',
  engagement_type VARCHAR(50) NOT NULL, -- "Fixed Price" or "Retainer"
  parent_msa_id INT NOT NULL,
  period_start DATE,
  period_end DATE,
  value DECIMAL(16,2),
  assignee_id VARCHAR(50), -- Legacy field
  assignee_user_id INT, -- New field for role-based filtering
  currency VARCHAR(16),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_msa_id) REFERENCES contracts(id) ON DELETE CASCADE,
  FOREIGN KEY (assignee_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_client_id (client_id),
  INDEX idx_parent_msa_id (parent_msa_id),
  INDEX idx_assignee_user_id (assignee_user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);
```

## Testing Requirements

### Unit Tests

- [ ] Test `SalesContractService.getContracts()` with Sales Manager role (should return all contracts)
- [ ] Test `SalesContractService.getContracts()` with Sales Man role (should return only assigned contracts)
- [ ] Test search functionality across contract ID, contract name, client name, client email
- [ ] Test status filtering
- [ ] Test pagination
- [ ] Test contract ID generation (MSA-YYYY-NN, SOW-YYYY-NN)
- [ ] Test period formatting (YYYY/MM/D-YYYY/MM/DD)
- [ ] Test value formatting (¥X,XXX,XXX or "-")
- [ ] Test DTO conversion for both MSA and SOW contracts

### Integration Tests

- [ ] Test API endpoint `/sales/contracts` with valid authentication
- [ ] Test API endpoint with Sales Manager role
- [ ] Test API endpoint with Sales Man role
- [ ] Test API endpoint with invalid authentication (401)
- [ ] Test API endpoint with unauthorized role (403)
- [ ] Test search parameter
- [ ] Test status filter parameter
- [ ] Test pagination parameters
- [ ] Test response format matches DTO structure

### E2E Tests

- [ ] Sales Manager can view all contracts
- [ ] Sales Man can only view assigned contracts
- [ ] Search functionality works correctly
- [ ] Status filter works correctly
- [ ] Pagination works correctly
- [ ] Clicking eye icon navigates to contract detail page
- [ ] Contract list matches wireframe design
- [ ] Empty state displays when no contracts found
- [ ] Loading state displays while fetching contracts
- [ ] Error message displays on API failure

## Performance Requirements

- [ ] Contract list should load within 2 seconds for up to 1000 contracts
- [ ] Search should be debounced (300ms delay) to reduce API calls
- [ ] Pagination should limit results to 20 contracts per page
- [ ] Database queries should use indexes on `assignee_user_id`, `status`, `client_id`, `created_at`
- [ ] Consider caching contract list for frequently accessed data (optional)

## Security Considerations

- [ ] Only authenticated Sales users (SALES_MANAGER, SALES_REP) can access the contract list
- [ ] Role-based filtering is enforced at the database query level (not just frontend)
- [ ] Sales Man cannot access contracts assigned to other Sales Men
- [ ] JWT token validation on every API request
- [ ] SQL injection prevention using parameterized queries
- [ ] XSS prevention in contract name and client name display

## Definition of Done

- [ ] All acceptance criteria are met
- [ ] Code is reviewed and approved
- [ ] Unit tests are written and passing (coverage > 80%)
- [ ] Integration tests are written and passing
- [ ] E2E tests are written and passing
- [ ] Frontend matches wireframe design exactly
- [ ] Backend API is documented
- [ ] Role-based access control is tested and verified
- [ ] Performance requirements are met
- [ ] Security requirements are met
- [ ] No linter errors
- [ ] No console errors in browser
- [ ] Responsive design works on mobile, tablet, and desktop
- [ ] Multi-language support (JA/EN) is implemented (if applicable)

