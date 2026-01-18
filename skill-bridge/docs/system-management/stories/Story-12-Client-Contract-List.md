# User Story: Client Contract List Management

## Story Information
- **Story ID**: Story-12
- **Title**: Client Contract List Management
- **Epic**: Client Portal - Contract Management
- **Priority**: High
- **Story Points**: 13
- **Sprint**: Sprint 4
- **Status**: Ready for Development

## User Story
**As a** Client  
**I want to** view and manage my contracts in a list  
**So that** I can track the status of my contracts, view contract details, and monitor contract values and periods

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] I can view a list of all my contracts in a table format
- [ ] I can search contracts by keywords
- [ ] I can filter contracts by status or type
- [ ] I can view contract details by clicking the eye icon
- [ ] Contract list matches the wireframe design
- [ ] Contracts are displayed with proper formatting (dates, currency, status)

### Detailed Acceptance Criteria

#### 1. Page Layout (Based on Wireframe)
- [ ] **Left Sidebar**:
  - [ ] "SKILL BRIDGE" logo/title at the top of sidebar
  - [ ] Navigation menu items:
    - [ ] "Dashboard" with grid icon (multiple squares)
    - [ ] "Contact form" with envelope icon
    - [ ] "Proposal" with 'P' in a circle icon
    - [ ] "Contract" with document icon (highlighted/active state when on this page)
  - [ ] Sidebar has dark grey background
  - [ ] Sidebar is collapsible on mobile (future enhancement)

- [ ] **Top Header**:
  - [ ] Page title "Contract management" displayed on the left
  - [ ] User information displayed on the right:
    - [ ] User icon/avatar
    - [ ] User name with honorific "様" (e.g., "Yamada Taro様")
  - [ ] Header has white background
  - [ ] Header is sticky/static at top
  - [ ] Language selector (JA/EN) in header

- [ ] **Main Content Area**:
  - [ ] Gray background (`bg-gray-50`) to highlight content
  - [ ] White content area for search, filter, and table
  - [ ] Content is properly spaced from sidebar and header
  - [ ] Responsive layout for different screen sizes

#### 2. Contract List Controls
- [ ] **Search Bar**:
  - [ ] Search input field with magnifying glass icon on the left
  - [ ] Placeholder text: "Search" (translatable)
  - [ ] Search functionality searches across: Contract ID, Contract Name, Type, Assignee
  - [ ] Real-time search results (as user types)
  - [ ] Search is case-insensitive
  - [ ] Search bar has white background to stand out

- [ ] **Filter Dropdown**:
  - [ ] Filter dropdown with filter icon
  - [ ] Default option: "All" (shows all contracts)
  - [ ] Filter options: "All", "Active", "Draft", "Pending", "Under Review", "Completed", "Terminated"
  - [ ] Filter applies to contract list immediately
  - [ ] Current filter selection is visible
  - [ ] Filter dropdown has white background to stand out

#### 3. Contract List Table
- [ ] **Table Structure**:
  - [ ] Table has clear borders and spacing
  - [ ] Table headers: No, ID, Contract Name, Type, Period, Value, Status, Assignee, Action
  - [ ] All columns are properly aligned
  - [ ] Table is scrollable if content exceeds viewport height
  - [ ] Table has white background to stand out

- [ ] **Table Columns**:
  - [ ] **No**: Sequential number (1, 2, 3, ...)
    - [ ] Numbers are sequential and unique
    - [ ] Resets based on current page and filter
  - [ ] **ID**: Contract ID format (e.g., "CT-2025-01", "CT-2025-02", "MSA-2025-07")
    - [ ] ID is unique for each contract
    - [ ] ID format: CT-YYYY-NN or MSA-YYYY-NN (where YYYY is year, NN is sequence)
    - [ ] ID can be used for navigation to detail page
  - [ ] **Contract Name**: Contract name/title (e.g., "Master Agreement", "EC Revamp - Phase 1")
    - [ ] Full name displayed (may be truncated with ellipsis if too long)
    - [ ] Tooltip shows full name on hover if truncated
  - [ ] **Type**: Contract type badge
    - [ ] "MSA" (Master Service Agreement) displayed
    - [ ] "SOW" (Statement of Work) displayed
    - [ ] Each type has distinct color/styling
  - [ ] **Period**: Contract period date range
    - [ ] Format: "YYYY/MM/DD-YYYY/MM/DD" (e.g., "2025/06/01-2027/06/30")
    - [ ] Single month format: "2025/06/1" (without leading zero for day 1)
    - [ ] Period clearly indicates start and end dates
    - [ ] "-" displayed if period is not set
  - [ ] **Value**: Contract value/amount
    - [ ] Format: "¥X,XXX,XXX" (e.g., "¥8,000,000", "¥1,800,000")
    - [ ] Currency symbol (¥) displayed
    - [ ] Numbers formatted with comma separators
    - [ ] "-" displayed if value is not set
  - [ ] **Status**: Contract status badges
    - [ ] "Active" status displayed with green/active styling
    - [ ] "Draft" status displayed with gray/draft styling
    - [ ] "Pending" status displayed with yellow/pending styling
    - [ ] "Under Review" status displayed with blue/review styling
    - [ ] "Completed" status displayed (if applicable)
    - [ ] "Terminated" status displayed (if applicable)
    - [ ] Each status has distinct color/styling
  - [ ] **Assignee**: Assignee identifier (e.g., "Sale-01", "-")
    - [ ] Assignee ID displayed if assigned
    - [ ] "-" displayed if no assignee
    - [ ] Assignee can be clicked to view details (future enhancement)
  - [ ] **Action**: Eye icon for viewing details
    - [ ] Eye icon is clickable
    - [ ] Hover state indicates clickability
    - [ ] Clicking eye icon navigates to contract detail page

- [ ] **Table Data**:
  - [ ] Table displays contracts belonging to the logged-in client user
  - [ ] Contracts are sorted by creation date (newest first) by default
  - [ ] Empty state message if no contracts exist
  - [ ] Loading state while fetching contracts
  - [ ] Error message if contract fetch fails

#### 4. Contract Details View
- [ ] **View Details Navigation**:
  - [ ] Clicking eye icon navigates to contract detail page
  - [ ] Contract detail page displays full contract information
  - [ ] Contract ID (primary key) is used for navigation
  - [ ] Display ID (CT-YYYY-NN) is shown for user reference
  - [ ] Back button or navigation to return to contract list

#### 5. Pagination
- [ ] **Pagination Controls**:
  - [ ] Pagination displayed at bottom right of table
  - [ ] Page numbers: "1 2 3 4 5" (or more if needed)
  - [ ] Current page is highlighted/active
  - [ ] Clicking page number loads that page
  - [ ] Default: 10-20 contracts per page (configurable)
  - [ ] Total number of contracts/pages displayed (optional)
  - [ ] Previous/Next buttons (optional, for better UX)

#### 6. Authentication & Authorization
- [ ] **Access Control**:
  - [ ] Only authenticated client users can access this page
  - [ ] Users only see their own contracts (client_id filter)
  - [ ] Unauthenticated users redirected to login
  - [ ] Session validation on page load
  - [ ] Token validation on API calls

#### 7. Internationalization (i18n)
- [ ] **Multi-language Support**:
  - [ ] All text elements are translatable (JP/EN)
  - [ ] Page title: "Contract management" / "契約管理"
  - [ ] Table headers translated
  - [ ] Status labels translated
  - [ ] Filter options translated
  - [ ] Search placeholder translated
  - [ ] Empty state messages translated
  - [ ] Error messages translated

## Technical Requirements

### Frontend Requirements
```typescript
// Contract List Page Component Structure
interface ContractListPageProps {
  // Props if needed
}

interface ContractListItem {
  internalId: number; // Primary key (database ID) - used for navigation
  id: string; // Display ID format: CT-YYYY-NN or MSA-YYYY-NN (for display only)
  no: number;
  contractName: string;
  type: 'MSA' | 'SOW';
  periodStart: string | null; // Format: YYYY-MM-DD
  periodEnd: string | null; // Format: YYYY-MM-DD
  value: number | null; // Contract value in JPY
  status: 'Active' | 'Draft' | 'Pending' | 'Under Review' | 'Completed' | 'Terminated';
  assignee: string | null; // Assignee ID (e.g., "Sale-01")
  createdAt: string; // ISO format
}

interface ContractListState {
  contracts: ContractListItem[];
  loading: boolean;
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  error: string | null;
}

// Table Column Structure
const tableColumns = [
  { key: 'no', label: 'No', sortable: true },
  { key: 'id', label: 'ID', sortable: true },
  { key: 'contractName', label: 'Contract Name', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'period', label: 'Period', sortable: true },
  { key: 'value', label: 'Value', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'assignee', label: 'Assignee', sortable: true },
  { key: 'action', label: 'Action', sortable: false }
];
```

### Backend Requirements
```java
// Contract List Controller
@RestController
@RequestMapping("/client/contracts")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ClientContractController {
    
    @GetMapping
    public ResponseEntity<ContractListResponse> getContracts(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String type,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        Authentication authentication
    );
}

// Contract List Response DTO
public class ContractListResponse {
    private List<ContractListItemDTO> contracts;
    private int currentPage;
    private int totalPages;
    private long totalElements;
}

// Contract List Item DTO
public class ContractListItemDTO {
    @JsonProperty("internalId")
    private Integer internalId; // Primary key (database ID) - used for navigation
    
    private String id; // Display ID format: CT-YYYY-NN or MSA-YYYY-NN (for display only)
    
    private Integer no; // Sequential number
    
    private String contractName;
    
    private String type; // "MSA" or "SOW"
    
    private String periodStart; // Format: YYYY/MM/DD or null
    
    private String periodEnd; // Format: YYYY/MM/DD or null
    
    private String period; // Formatted period: "YYYY/MM/DD-YYYY/MM/DD" or "-"
    
    private BigDecimal value; // Contract value in JPY or null
    
    private String formattedValue; // Formatted value: "¥X,XXX,XXX" or "-"
    
    private String status; // "Active", "Draft", "Pending", "Under Review", etc.
    
    private String assignee; // Assignee ID or null
    
    private String createdAt; // ISO format
}

// Contract List Service
@Service
public class ContractListService {
    
    public ContractListResponse getContracts(
        Integer clientUserId,
        String search,
        String status,
        String type,
        int page,
        int size
    ) {
        // Implementation:
        // 1. Build query with filters (search, status, type)
        // 2. Filter by client_user_id (security)
        // 3. Paginate results
        // 4. Generate display IDs (CT-YYYY-NN or MSA-YYYY-NN)
        // 5. Format dates and values
        // 6. Return DTOs
    }
    
    private String generateContractId(Integer contractId, String type, LocalDate createdAt) {
        // Format: CT-YYYY-NN or MSA-YYYY-NN
        // Where YYYY is year, NN is sequence number
        String prefix = "MSA".equals(type) ? "MSA" : "CT";
        int year = createdAt.getYear();
        // Calculate sequence number based on contract creation order
        // Implementation depends on business logic
        return String.format("%s-%d-%02d", prefix, year, sequenceNumber);
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
        return formatDate(start) + "-" + formatDate(end);
    }
    
    private String formatDate(LocalDate date) {
        // Format: YYYY/MM/DD (without leading zero for day 1: YYYY/MM/D)
        int day = date.getDayOfMonth();
        if (day == 1) {
            return String.format("%d/%02d/%d", date.getYear(), date.getMonthValue(), day);
        }
        return String.format("%d/%02d/%02d", date.getYear(), date.getMonthValue(), day);
    }
    
    private String formatValue(BigDecimal value) {
        if (value == null) {
            return "-";
        }
        // Format: ¥X,XXX,XXX
        DecimalFormat formatter = new DecimalFormat("¥#,###");
        return formatter.format(value);
    }
}
```

### Database Requirements
```sql
-- Contract Entity (assuming contracts table exists)
-- If contracts table doesn't exist, create migration:

CREATE TABLE IF NOT EXISTS contracts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT NOT NULL,
  contract_type ENUM('MSA', 'SOW') NOT NULL,
  contract_name VARCHAR(255) NOT NULL,
  status ENUM('Draft', 'Active', 'Pending', 'Under Review', 'Completed', 'Terminated') NOT NULL DEFAULT 'Draft',
  period_start DATE,
  period_end DATE,
  value DECIMAL(16,2), -- Contract value in JPY
  assignee_id VARCHAR(50), -- Assignee identifier (e.g., "Sale-01")
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id),
  INDEX idx_client_id (client_id),
  INDEX idx_status (status),
  INDEX idx_type (contract_type),
  INDEX idx_created_at (created_at)
);

-- Contract List Query (example)
SELECT 
  c.id as internal_id,
  c.contract_name,
  c.contract_type,
  c.period_start,
  c.period_end,
  c.value,
  c.status,
  c.assignee_id as assignee,
  c.created_at
FROM contracts c
WHERE c.client_id = :clientUserId
  AND (:search IS NULL OR 
    c.contract_name LIKE CONCAT('%', :search, '%') OR
    c.id LIKE CONCAT('%', :search, '%') OR
    c.assignee_id LIKE CONCAT('%', :search, '%'))
  AND (:status IS NULL OR c.status = :status)
  AND (:type IS NULL OR c.contract_type = :type)
ORDER BY c.created_at DESC
LIMIT :size OFFSET :offset;
```

### API Requirements

#### GET /api/client/contracts
**Description**: Get paginated list of contracts for the authenticated client

**Query Parameters**:
- `search` (optional): Search query string
- `status` (optional): Filter by status (Active, Draft, Pending, etc.)
- `type` (optional): Filter by type (MSA, SOW)
- `page` (optional, default: 0): Page number (0-indexed)
- `size` (optional, default: 20): Page size

**Response**:
```json
{
  "contracts": [
    {
      "internalId": 1,
      "id": "CT-2025-01",
      "no": 1,
      "contractName": "Master Agreement",
      "type": "MSA",
      "periodStart": "2025/06/01",
      "periodEnd": "2027/06/30",
      "period": "2025/06/01-2027/06/30",
      "value": null,
      "formattedValue": "-",
      "status": "Active",
      "assignee": "Sale-01",
      "createdAt": "2025-01-15T10:00:00Z"
    },
    {
      "internalId": 2,
      "id": "CT-2025-02",
      "no": 2,
      "contractName": "EC Revamp - Phase 1",
      "type": "SOW",
      "periodStart": "2025/06/1",
      "periodEnd": "2025/12/31",
      "period": "2025/06/1-2025/12/31",
      "value": 8000000,
      "formattedValue": "¥8,000,000",
      "status": "Active",
      "assignee": null,
      "createdAt": "2025-01-16T10:00:00Z"
    }
  ],
  "currentPage": 0,
  "totalPages": 1,
  "totalElements": 2
}
```

**Error Responses**:
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User doesn't have access to contracts
- `500 Internal Server Error`: Server error

## Implementation Guidelines

### Frontend Implementation

#### 1. Contract List Page Component
```typescript
// frontend/src/app/client/contracts/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { ClientHeader } from '@/components/design-patterns/client/ClientHeader';
import { ClientSidebar } from '@/components/design-patterns/client/ClientSidebar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { getContractList } from '@/services/contractService';
import { useAuth } from '@/contexts/AuthContext';

export default function ContractListPage() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const router = useRouter();
  
  const [contracts, setContracts] = useState<ContractListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContracts();
  }, [searchQuery, statusFilter, currentPage]);

  const fetchContracts = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getContractList(token, {
        search: searchQuery || undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        page: currentPage,
        size: 20
      });
      
      setContracts(response.contracts);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(t('client.contractList.error.loadFailed'));
      console.error('Failed to fetch contracts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (contract: ContractListItem) => {
    // Use primary key (internalId) for navigation
    router.push(`/client/contracts/${contract.internalId}`);
  };

  const formatPeriod = (start: string | null, end: string | null): string => {
    if (!start && !end) return '-';
    if (!start) return `-${end}`;
    if (!end) return start;
    return `${start}-${end}`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ClientSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ClientHeader 
          titleKey="client.header.title.contractManagement"
        />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder={t('client.contractList.search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">{t('client.contractList.filter.all')}</SelectItem>
                  <SelectItem value="Active">{t('client.contractList.filter.active')}</SelectItem>
                  <SelectItem value="Draft">{t('client.contractList.filter.draft')}</SelectItem>
                  <SelectItem value="Pending">{t('client.contractList.filter.pending')}</SelectItem>
                  <SelectItem value="Under Review">{t('client.contractList.filter.underReview')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contract Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('client.contractList.table.no')}</TableHead>
                    <TableHead>{t('client.contractList.table.id')}</TableHead>
                    <TableHead>{t('client.contractList.table.contractName')}</TableHead>
                    <TableHead>{t('client.contractList.table.type')}</TableHead>
                    <TableHead>{t('client.contractList.table.period')}</TableHead>
                    <TableHead>{t('client.contractList.table.value')}</TableHead>
                    <TableHead>{t('client.contractList.table.status')}</TableHead>
                    <TableHead>{t('client.contractList.table.assignee')}</TableHead>
                    <TableHead>{t('client.contractList.table.action')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        {t('client.contractList.loading')}
                      </TableCell>
                    </TableRow>
                  ) : contracts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        {t('client.contractList.empty')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    contracts.map((contract, index) => (
                      <TableRow key={contract.internalId}>
                        <TableCell>{contract.no}</TableCell>
                        <TableCell>{contract.id}</TableCell>
                        <TableCell>{contract.contractName}</TableCell>
                        <TableCell>
                          <Badge variant={contract.type === 'MSA' ? 'default' : 'secondary'}>
                            {contract.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatPeriod(contract.periodStart, contract.periodEnd)}</TableCell>
                        <TableCell>{contract.formattedValue || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={
                            contract.status === 'Active' ? 'success' :
                            contract.status === 'Draft' ? 'secondary' :
                            contract.status === 'Pending' ? 'warning' : 'default'
                          }>
                            {t(`client.contractList.status.${contract.status.toLowerCase()}`)}
                          </Badge>
                        </TableCell>
                        <TableCell>{contract.assignee || '-'}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(contract)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-end gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i}
                    variant={i === currentPage ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(i)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
```

#### 2. Contract Service
```typescript
// frontend/src/services/contractService.ts
export interface ContractListItem {
  internalId: number;
  id: string;
  no: number;
  contractName: string;
  type: 'MSA' | 'SOW';
  periodStart: string | null;
  periodEnd: string | null;
  period?: string;
  value: number | null;
  formattedValue: string;
  status: string;
  assignee: string | null;
  createdAt: string;
}

export interface ContractListResponse {
  contracts: ContractListItem[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

export async function getContractList(
  token: string,
  params: {
    search?: string;
    status?: string;
    type?: string;
    page?: number;
    size?: number;
  }
): Promise<ContractListResponse> {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.append('search', params.search);
  if (params.status) queryParams.append('status', params.status);
  if (params.type) queryParams.append('type', params.type);
  if (params.page !== undefined) queryParams.append('page', params.page.toString());
  if (params.size !== undefined) queryParams.append('size', params.size.toString());

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/client/contracts?${queryParams}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch contracts');
  }

  return response.json();
}
```

### Backend Implementation

#### 1. Contract Entity
```java
// backend/src/main/java/com/skillbridge/entity/Contract.java
@Entity
@Table(name = "contracts")
public class Contract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "client_id", nullable = false)
    private Integer clientId;

    @Enumerated(EnumType.STRING)
    @Column(name = "contract_type", nullable = false)
    private ContractType contractType;

    @Column(name = "contract_name", nullable = false, length = 255)
    private String contractName;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ContractStatus status = ContractStatus.Draft;

    @Column(name = "period_start")
    private LocalDate periodStart;

    @Column(name = "period_end")
    private LocalDate periodEnd;

    @Column(name = "value", precision = 16, scale = 2)
    private BigDecimal value;

    @Column(name = "assignee_id", length = 50)
    private String assigneeId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Getters and setters...
}

public enum ContractType {
    MSA, SOW
}

public enum ContractStatus {
    Draft, Active, Pending, Under_Review, Completed, Terminated
}
```

#### 2. Contract Repository
```java
// backend/src/main/java/com/skillbridge/repository/ContractRepository.java
@Repository
public interface ContractRepository extends JpaRepository<Contract, Integer> {
    
    @Query("SELECT c FROM Contract c WHERE c.clientId = :clientId " +
           "AND (:search IS NULL OR c.contractName LIKE %:search% OR " +
           "CAST(c.id AS string) LIKE %:search% OR c.assigneeId LIKE %:search%) " +
           "AND (:status IS NULL OR c.status = :status) " +
           "AND (:type IS NULL OR c.contractType = :type) " +
           "ORDER BY c.createdAt DESC")
    Page<Contract> findByClientIdWithFilters(
        @Param("clientId") Integer clientId,
        @Param("search") String search,
        @Param("status") ContractStatus status,
        @Param("type") ContractType type,
        Pageable pageable
    );
    
    @Query("SELECT c FROM Contract c WHERE c.id = :id AND c.clientId = :clientId")
    Optional<Contract> findByIdAndClientId(@Param("id") Integer id, @Param("clientId") Integer clientId);
}
```

#### 3. Contract List Service
```java
// backend/src/main/java/com/skillbridge/service/ContractListService.java
@Service
public class ContractListService {
    
    @Autowired
    private ContractRepository contractRepository;
    
    public ContractListResponse getContracts(
        Integer clientUserId,
        String search,
        String status,
        String type,
        int page,
        int size
    ) {
        ContractStatus statusEnum = status != null ? ContractStatus.valueOf(status.replace(" ", "_")) : null;
        ContractType typeEnum = type != null ? ContractType.valueOf(type) : null;
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Contract> contractPage = contractRepository.findByClientIdWithFilters(
            clientUserId, search, statusEnum, typeEnum, pageable
        );
        
        List<ContractListItemDTO> dtos = contractPage.getContent().stream()
            .map((contract, index) -> convertToListItemDTO(
                contract, 
                page * size + index + 1,
                contractPage.getNumber()
            ))
            .collect(Collectors.toList());
        
        ContractListResponse response = new ContractListResponse();
        response.setContracts(dtos);
        response.setCurrentPage(contractPage.getNumber());
        response.setTotalPages(contractPage.getTotalPages());
        response.setTotalElements(contractPage.getTotalElements());
        
        return response;
    }
    
    private ContractListItemDTO convertToListItemDTO(Contract contract, int no, int pageNumber) {
        ContractListItemDTO dto = new ContractListItemDTO();
        dto.setInternalId(contract.getId()); // Primary key for navigation
        dto.setId(generateContractId(contract)); // Display ID
        dto.setNo(no);
        dto.setContractName(contract.getContractName());
        dto.setType(contract.getContractType().name());
        dto.setPeriodStart(formatDate(contract.getPeriodStart()));
        dto.setPeriodEnd(formatDate(contract.getPeriodEnd()));
        dto.setPeriod(formatPeriod(contract.getPeriodStart(), contract.getPeriodEnd()));
        dto.setValue(contract.getValue());
        dto.setFormattedValue(formatValue(contract.getValue()));
        dto.setStatus(contract.getStatus().name().replace("_", " "));
        dto.setAssignee(contract.getAssigneeId());
        dto.setCreatedAt(contract.getCreatedAt().toString());
        
        return dto;
    }
    
    private String generateContractId(Contract contract) {
        String prefix = contract.getContractType() == ContractType.MSA ? "MSA" : "CT";
        int year = contract.getCreatedAt().getYear();
        // Calculate sequence number - this is a simplified version
        // In production, you might want to query the database for the actual sequence
        int sequence = contract.getId() % 100; // Simplified - use actual sequence logic
        return String.format("%s-%d-%02d", prefix, year, sequence);
    }
    
    private String formatDate(LocalDate date) {
        if (date == null) return null;
        int day = date.getDayOfMonth();
        if (day == 1) {
            return String.format("%d/%02d/%d", date.getYear(), date.getMonthValue(), day);
        }
        return String.format("%d/%02d/%02d", date.getYear(), date.getMonthValue(), day);
    }
    
    private String formatPeriod(LocalDate start, LocalDate end) {
        if (start == null && end == null) return "-";
        if (start == null) return "-" + formatDate(end);
        if (end == null) return formatDate(start);
        return formatDate(start) + "-" + formatDate(end);
    }
    
    private String formatValue(BigDecimal value) {
        if (value == null) return "-";
        DecimalFormat formatter = new DecimalFormat("¥#,###");
        return formatter.format(value);
    }
}
```

#### 4. Contract Controller
```java
// backend/src/main/java/com/skillbridge/controller/ClientContractController.java
@RestController
@RequestMapping("/api/client/contracts")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ClientContractController {
    
    @Autowired
    private ContractListService contractListService;
    
    @GetMapping
    public ResponseEntity<ContractListResponse> getContracts(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String type,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        Authentication authentication
    ) {
        Integer clientUserId = getClientUserId(authentication);
        
        ContractListResponse response = contractListService.getContracts(
            clientUserId, search, status, type, page, size
        );
        
        return ResponseEntity.ok(response);
    }
    
    private Integer getClientUserId(Authentication authentication) {
        // Extract client user ID from authentication
        // Implementation depends on your authentication setup
        return ((UserDetails) authentication.getPrincipal()).getUserId();
    }
}
```

## Testing Requirements

### Unit Tests
- [ ] ContractListService: Test contract ID generation
- [ ] ContractListService: Test date formatting (with and without leading zero for day 1)
- [ ] ContractListService: Test value formatting
- [ ] ContractListService: Test period formatting
- [ ] ContractListService: Test filtering logic
- [ ] ContractListService: Test pagination
- [ ] ContractRepository: Test query with filters

### Integration Tests
- [ ] GET /api/client/contracts: Test successful retrieval
- [ ] GET /api/client/contracts: Test with search filter
- [ ] GET /api/client/contracts: Test with status filter
- [ ] GET /api/client/contracts: Test with type filter
- [ ] GET /api/client/contracts: Test pagination
- [ ] GET /api/client/contracts: Test authentication
- [ ] GET /api/client/contracts: Test authorization (only own contracts)

### End-to-End Tests
- [ ] User can view contract list
- [ ] User can search contracts
- [ ] User can filter contracts by status
- [ ] User can filter contracts by type
- [ ] User can navigate to contract detail page
- [ ] Pagination works correctly
- [ ] Empty state displays when no contracts
- [ ] Loading state displays while fetching
- [ ] Error handling works correctly

## Performance Requirements
- [ ] Contract list loads within 2 seconds
- [ ] Search results display within 500ms
- [ ] Filtering applies within 500ms
- [ ] Pagination loads within 1 second
- [ ] Table supports up to 1000 contracts per page
- [ ] Database queries are optimized with proper indexes

## Security Considerations
- [ ] Only authenticated users can access contract list
- [ ] Users can only see their own contracts (client_id filter)
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (sanitize user input)
- [ ] CSRF protection (if applicable)
- [ ] API rate limiting (if applicable)

## Deployment Requirements
- [ ] Database migration for contracts table (if not exists)
- [ ] Environment variables configured
- [ ] API endpoints documented
- [ ] Frontend routes configured
- [ ] Error logging configured
- [ ] Monitoring configured

## Definition of Done
- [ ] All acceptance criteria met
- [ ] Code reviewed and approved
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] E2E tests written and passing
- [ ] Documentation updated
- [ ] Internationalization (i18n) implemented
- [ ] Responsive design verified
- [ ] Performance requirements met
- [ ] Security requirements met
- [ ] Deployed to staging environment
- [ ] User acceptance testing completed

## Dependencies
- **Internal Dependencies**:
  - Story-06: Client Login Authentication (required for access)
  - Story-08: Client Logout (for logout functionality)
  - Client Header and Sidebar components (shared components)
  - Language Context (for i18n)
  - Auth Context (for authentication)

- **External Dependencies**:
  - Contracts table in database (may need migration)
  - Contract entities and repositories
  - Authentication/Authorization system

## Risks and Mitigation
- **Risk**: Contracts table may not exist in database
  - **Mitigation**: Create database migration to add contracts table if needed

- **Risk**: Contract ID generation logic may conflict with existing IDs
  - **Mitigation**: Ensure ID generation is consistent and unique

- **Risk**: Performance issues with large contract lists
  - **Mitigation**: Implement proper pagination and database indexing

- **Risk**: Date formatting inconsistencies
  - **Mitigation**: Use consistent date formatting utility functions

## Success Metrics
- [ ] Contract list page loads successfully for all authenticated clients
- [ ] Search functionality works correctly
- [ ] Filter functionality works correctly
- [ ] Pagination works correctly
- [ ] Navigation to contract detail page works correctly
- [ ] All text elements are properly translated (JP/EN)
- [ ] Page matches wireframe design
- [ ] Performance requirements met
- [ ] Zero security vulnerabilities

## Future Enhancements
- [ ] Contract creation from list page
- [ ] Contract export functionality (CSV, PDF)
- [ ] Advanced filtering (date range, value range)
- [ ] Sorting by column headers
- [ ] Bulk actions (select multiple contracts)
- [ ] Contract status workflow automation
- [ ] Contract reminders and notifications
- [ ] Contract analytics and reporting

---

**Document Control**
- **Version**: 1.0
- **Created**: January 2025
- **Last Updated**: January 2025
- **Next Review**: March 2025
- **Approved By**: System Management Team
- **Distribution**: Development Team, Product Team, Management

