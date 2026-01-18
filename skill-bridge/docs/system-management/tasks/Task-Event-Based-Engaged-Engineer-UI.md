# Task: Event-based Engaged Engineer UI cho Sales Create/Edit CR (Resource Change)

## Task Information
- **Task ID**: Task-Event-Based-Engaged-Engineer-UI
- **Title**: Event-based Engaged Engineer UI cho Sales Create/Edit CR (Resource Change)
- **Related Story**: Story-29 (Sales Edit Change Request for SOW Retainer)
- **Priority**: High
- **Status**: Draft
- **Estimated Effort**: Medium-Large (Requires backend API + frontend UI implementation)

## Overview

### Mục tiêu & Bối cảnh

**Màn hình**: Sales Create/Edit Change Request cho hợp đồng SOW Retainer.

**CR Type**: `RESOURCE_CHANGE`.

**Yêu cầu**:
- **Lần tạo CR đầu tiên**: Dựa trên Baseline (hợp đồng gốc).
- **Các CR sau**: Dựa trên Current Resources at EffectiveFrom (Baseline + tất cả CR đã Approved trước đó).

**UI Requirements**:
- Hiển thị rõ "Before (tại Effective From)" và "After (sau khi áp dụng CR)".
- Tránh nhầm lẫn với "đang chỉnh hợp đồng gốc".

### User Story

**As a** Sales user  
**I want to** see the current team at the CR's effective date and edit the team after applying this CR  
**So that** I can define resource changes clearly without breaking the contract baseline.

### Relationship với Task-Event-Based-Retainer-SOW-Migration

**Task này là ENHANCEMENT của Task-Event-Based-Retainer-SOW-Migration**, bổ sung:

1. **API Endpoint chuyên biệt** cho resources (khác với `/current-state` endpoint đã có)
2. **Frontend UI chi tiết** cho Create/Edit CR với 2 blocks rõ ràng (Before/After)
3. **Payload format với action field** (ADD/MODIFY/REMOVE) từ frontend
4. **Validation và UX flow chi tiết** cho CR creation/editing

**Những phần đã có trong task cũ (KHÔNG cần implement lại)**:
- ✅ Database schema (baseline, events, appendix tables)
- ✅ Backend services (SOWBaselineService, CREventService, ContractAppendixService)
- ✅ `CREventService.calculateCurrentResources()` method
- ✅ CR approval logic (event-based)
- ✅ Contract detail retrieval (baseline + events)
- ✅ API endpoint `/current-state` (cho full contract detail)
- ✅ Frontend changes chung (remove version tabs, appendix section)

**Những phần MỚI trong task này**:
- ❌ API endpoint `/current-resources` (chuyên biệt cho resources only)
- ❌ Frontend UI Block A (Before) và Block B (After) chi tiết
- ❌ Payload format với `action` field từ frontend
- ❌ Validation logic chi tiết cho CR creation/editing
- ❌ UX flow chi tiết khi change EffectiveFrom

## Objectives

1. **Backend API**: Tạo endpoint để lấy current resources tại một ngày cụ thể
2. **Frontend UI**: Hiển thị 2 blocks rõ ràng: "Before" và "After"
3. **Data Flow**: Đảm bảo CR đầu tiên dựa trên baseline, CR sau dựa trên current state
4. **UX**: Tránh nhầm lẫn giữa baseline và current state
5. **Validation**: Đảm bảo data integrity khi tạo/edit CR

## Implementation Plan

### Phase 1: Backend API Implementation

#### 1.1. API Endpoint: Get Current Resources at Effective Date

**Endpoint**:
```
GET /api/sales/contracts/sow/{sowContractId}/current-resources
```

**Query Parameters**:
- `asOfDate` (required, YYYY-MM-DD) - Thường là `changeRequest.effectiveFrom`

**Response Format**:
```json
{
  "sowContractId": 140,
  "asOfDate": "2026-02-01",
  "resources": [
    {
      "engineerId": 12,                    // ID logical của engineer trong system
      "baseEngineerId": 5,                 // (optional) id ở baseline nếu có
      "level": "Middle",
      "role": "Backend Engineer",
      "engineerLevelLabel": "Middle Backend Engineer",  // string hiển thị
      "startDate": "2026-01-01",
      "endDate": null,
      "rating": 100,
      "unitRate": 400000
    }
  ]
}
```

**Implementation Details**:

**Controller**: `SalesSOWContractController.java`
```java
@GetMapping("/{sowContractId}/current-resources")
public ResponseEntity<?> getCurrentResources(
    @PathVariable Integer sowContractId,
    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate asOfDate,
    Authentication authentication,
    HttpServletRequest request
) {
    // Access control
    // Validate contract type (must be Retainer)
    // Call service
    return ResponseEntity.ok(sowContractService.getCurrentResources(sowContractId, asOfDate, currentUser));
}
```

**Service Method**: `SalesSOWContractService.java`
```java
public CurrentResourcesDTO getCurrentResources(Integer sowContractId, LocalDate asOfDate, User currentUser) {
    // 1. Validate contract exists and is Retainer type
    // 2. Ensure baseline exists (create if not)
    // 3. Call CREventService.calculateCurrentResources(sowContractId, asOfDate)
    // 4. Convert to DTO format
    // 5. Return
}
```

**Logic**:
1. Sử dụng `CREventService.calculateCurrentResources(sowContractId, asOfDate)` (đã có trong task cũ):
   - Load từ `sow_engaged_engineers_base`
   - Apply tất cả `cr_resource_events` của những CR:
     - `status = 'APPROVED'`
     - `effective_start <= asOfDate`
   - Filter resource active tại `asOfDate`
   
**Note**: Method `calculateCurrentResources()` đã được implement trong task cũ. Task này chỉ cần wrap nó trong API endpoint mới với response format chuyên biệt cho resources.

**Error Handling**:
- Nếu contract không phải Retainer → 400 Bad Request
- Nếu `asOfDate` không hợp lệ → 400 Bad Request
- Nếu chưa có baseline → Tự động tạo baseline từ data hiện tại, sau đó tính current

**DTO Class**: `CurrentResourcesDTO.java`
```java
public class CurrentResourcesDTO {
    private Integer sowContractId;
    private LocalDate asOfDate;
    private List<ResourceDTO> resources;
    
    public static class ResourceDTO {
        private Integer engineerId;        // Logical ID
        private Integer baseEngineerId;    // Baseline ID (optional)
        private String level;
        private String role;
        private String engineerLevelLabel; // "Middle Backend Engineer"
        private LocalDate startDate;
        private LocalDate endDate;
        private BigDecimal rating;
        private BigDecimal unitRate;
        // Getters and setters
    }
}
```

#### 1.2. CR Payload Processing (Engaged Engineers "After CR")

**Payload Format từ Frontend**:
```json
{
  "title": "Increase FE capacity",
  "type": "RESOURCE_CHANGE",
  "effectiveFrom": "2026-02-01",
  "effectiveUntil": null,
  "engagedEngineers": [
    {
      "baseEngineerId": 5,            // optional
      "engineerId": 12,                // optional, current logical id
      "action": "MODIFY",              // 'ADD' | 'MODIFY' | 'REMOVE'
      "level": "Middle",
      "role": "Backend Engineer",
      "startDate": "2026-01-01",
      "endDate": null,
      "rating": 100,
      "salary": 450000                 // unitRate sau CR
    },
    {
      "baseEngineerId": null,
      "engineerId": null,
      "action": "ADD",
      "level": "Middle",
      "role": "Frontend Engineer",
      "startDate": "2026-02-01",
      "endDate": "2026-04-30",
      "rating": 100,
      "salary": 300000
    },
    {
      "baseEngineerId": 7,
      "engineerId": 20,
      "action": "REMOVE",
      "level": "Junior",
      "role": "QA Engineer",
      "startDate": "2025-11-01",
      "endDate": "2026-01-31",         // endDate sau khi remove
      "rating": 100,
      "salary": 220000
    }
  ]
}
```

**Backend Processing**:
- Lưu vào `change_request_engaged_engineers` với các fields tương ứng (bao gồm `action` field mới)
- Khi CR được APPROVE, convert payload này → `cr_resource_events` (đã có trong `applyResourceChangeEventBased()` method từ task cũ)

**Note**: 
- Logic convert sang events đã có trong `applyResourceChangeEventBased()` method (task cũ).
- Task này chỉ cần đảm bảo backend nhận và lưu `action` field từ frontend payload.
- Backend sẽ validate và convert `action` field khi approve CR.

---

### Phase 2: Frontend UI Implementation

#### 2.1. Điều kiện hiển thị

**Tab/Block Engaged Engineer chỉ hiển thị khi**:
- `CR.type === 'RESOURCE_CHANGE'`
- `engagementType === 'Retainer'`

**Khi Effective From thay đổi**:

**Nếu đang Create CR**:
- Gọi API `current-resources` với `asOfDate = EffectiveFrom`
- Load data vào Block A (Before) và Block B (After)

**Nếu đang Edit CR Draft**:
- **Mode 1**: CR chưa có `engagedEngineers` draft → Load từ `current-resources`
- **Mode 2**: CR đã có draft → Hiển thị confirm dialog:
  ```
  "Change Effective From will reset your resource changes. Continue?"
  ```
  - Nếu Yes → Reload từ `current-resources`
  - Nếu No → Giữ nguyên draft data

#### 2.2. UI Block A – Current Resources at Effective From (Before)

**Title**:
```
Current Resources at {EffectiveFrom}
```

**Table Columns**:
| Engineer | Level | Role | Start Date | End Date | Rating | Salary |

**Data Source**: API `current-resources`

**UI Styling**:
- Tất cả fields **readonly**:
  - Input style: `disabled` hoặc `readOnly`
  - Màu chữ: `#6B7280` (grey)
  - Background: Light grey (`bg-gray-50`)

**Tooltip Icon (ℹ️)**:
- Text: `"This is the current team at {EffectiveFrom}, calculated from Baseline + all previously approved Change Requests."`
- Position: Next to title

**Implementation**:
```tsx
<section className="border-b pb-6">
  <div className="flex items-center gap-2 mb-4">
    <h3 className="text-lg font-semibold">
      Current Resources at {formatDate(formData.effectiveFrom)}
    </h3>
    <Tooltip>
      <TooltipTrigger>
        <InfoIcon className="w-4 h-4 text-gray-400" />
      </TooltipTrigger>
      <TooltipContent>
        This is the current team at {formatDate(formData.effectiveFrom)}, 
        calculated from Baseline + all previously approved Change Requests.
      </TooltipContent>
    </Tooltip>
  </div>
  
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Engineer</TableHead>
        <TableHead>Level</TableHead>
        <TableHead>Role</TableHead>
        <TableHead>Start Date</TableHead>
        <TableHead>End Date</TableHead>
        <TableHead>Rating</TableHead>
        <TableHead>Salary</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {currentResources.map((resource, index) => (
        <TableRow key={index} className="bg-gray-50">
          <TableCell className="text-gray-600">
            {resource.engineerLevelLabel}
          </TableCell>
          <TableCell className="text-gray-600">{resource.level}</TableCell>
          <TableCell className="text-gray-600">{resource.role}</TableCell>
          <TableCell className="text-gray-600">
            {formatDate(resource.startDate)}
          </TableCell>
          <TableCell className="text-gray-600">
            {resource.endDate ? formatDate(resource.endDate) : '-'}
          </TableCell>
          <TableCell className="text-gray-600">{resource.rating}%</TableCell>
          <TableCell className="text-gray-600">
            ¥{formatCurrency(resource.unitRate)}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</section>
```

#### 2.3. UI Block B – Resources After This Change Request (After)

**Title**:
```
Resources After This Change Request
```

**Cách khởi tạo data**:

**Khi load lần đầu**:
- Clone list từ Block A (Current Resources)
- Mỗi row tương ứng 1 engineer hiện tại
- `action` mặc định = `'MODIFY'` (ngầm định, chưa gửi)
- Map fields:
  - `baseEngineerId` = `resource.baseEngineerId`
  - `engineerId` = `resource.engineerId`
  - `level` = `resource.level`
  - `role` = `resource.role`
  - `startDate` = `resource.startDate`
  - `endDate` = `resource.endDate`
  - `rating` = `resource.rating`
  - `salary` = `resource.unitRate`

**Table Columns**:
| Engineer Level* | Start Date* | End Date | Rating* | Salary* | Action |

**Engineer Level**:
- Combine `level + role` (box kiểu combobox hoặc input)
- Format: `"Middle Backend Engineer"`
- Editable

**Start/End/Rating/Salary**: Editable đối với After

**Actions**:

**1. Modify (ngầm)**:
- Khi user sửa bất kỳ field trên row không phải "new row"
- FE tự động set `action = 'MODIFY'`
- Không cần button riêng

**2. Add Engineer**:
- Button: `+ Add Engineer`
- Khi click → Thêm row mới:
  ```typescript
  {
    engineerId: null,
    baseEngineerId: null,
    action: 'ADD',
    level: '',
    role: '',
    startDate: formData.effectiveFrom,  // Default = EffectiveFrom
    endDate: contractDetail?.effectiveEnd || null,  // Default = contract end date
    rating: 100,
    salary: 0
  }
  ```

**3. Remove Engineer**:
- Icon Trash trên row (chỉ cho những row có `engineerId` / đã tồn tại)
- Khi click:
  - FE không xoá hẳn row khỏi payload
  - Set `action = 'REMOVE'`
  - Set `endDate = EffectiveFrom - 1 day`
  - UI render row này:
    - Text grey + strike-through
    - Hoặc tag "Removed"
  - Có thể có toggle "Show removed resources" (optional)

**Implementation**:
```tsx
<section className="border-b pb-6">
  <h3 className="text-lg font-semibold mb-4">
    Resources After This Change Request
  </h3>
  
  <div className="mb-4">
    <Button
      type="button"
      variant="outline"
      onClick={addEngineer}
      className="flex items-center gap-2"
    >
      <Plus className="w-4 h-4" />
      Add Engineer
    </Button>
  </div>
  
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Engineer Level*</TableHead>
        <TableHead>Start Date*</TableHead>
        <TableHead>End Date</TableHead>
        <TableHead>Rating*</TableHead>
        <TableHead>Salary*</TableHead>
        <TableHead>Action</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {formData.engagedEngineers.map((engineer, index) => {
        const isRemoved = engineer.action === 'REMOVE';
        const isNew = engineer.action === 'ADD' && !engineer.engineerId;
        
        return (
          <TableRow
            key={index}
            className={isRemoved ? 'opacity-50 line-through' : ''}
          >
            <TableCell>
              <div className="flex gap-2">
                <Select
                  value={engineer.level}
                  onValueChange={(value) => updateEngineer(index, 'level', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Junior">Junior</SelectItem>
                    <SelectItem value="Middle">Middle</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={engineer.role}
                  onChange={(e) => updateEngineer(index, 'role', e.target.value)}
                  placeholder="Role (e.g. Backend Engineer)"
                  className={errors[`engineerRole_${index}`] ? 'border-red-500' : ''}
                />
              </div>
            </TableCell>
            <TableCell>
              <Input
                type="date"
                value={engineer.startDate}
                onChange={(e) => {
                  updateEngineer(index, 'startDate', e.target.value);
                  if (!isNew && !isRemoved) {
                    updateEngineer(index, 'action', 'MODIFY');
                  }
                }}
                className={errors[`engineerStartDate_${index}`] ? 'border-red-500' : ''}
              />
            </TableCell>
            <TableCell>
              <Input
                type="date"
                value={engineer.endDate || ''}
                onChange={(e) => {
                  updateEngineer(index, 'endDate', e.target.value || null);
                  if (!isNew && !isRemoved) {
                    updateEngineer(index, 'action', 'MODIFY');
                  }
                }}
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                value={engineer.rating}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  updateEngineer(index, 'rating', value);
                  if (!isNew && !isRemoved) {
                    updateEngineer(index, 'action', 'MODIFY');
                  }
                }}
                min="0"
                max="100"
                step="0.5"
                className={errors[`engineerRating_${index}`] ? 'border-red-500' : ''}
              />
            </TableCell>
            <TableCell>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                <Input
                  type="text"
                  value={formatCurrency(engineer.salary)}
                  onChange={(e) => {
                    const value = parseCurrency(e.target.value);
                    updateEngineer(index, 'salary', value);
                    if (!isNew && !isRemoved) {
                      updateEngineer(index, 'action', 'MODIFY');
                    }
                  }}
                  className={`pl-8 ${errors[`engineerSalary_${index}`] ? 'border-red-500' : ''}`}
                />
              </div>
            </TableCell>
            <TableCell>
              {isRemoved ? (
                <span className="text-gray-500 text-sm">Removed</span>
              ) : engineer.engineerId ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEngineer(index)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEngineer(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
</section>
```

#### 2.4. Validation (Frontend)

**Engineer Level**:
- Required
- Level: Must be one of: `Junior`, `Middle`, `Senior`
- Role: Required, non-empty string

**StartDate**:
- Required
- Must not be `< contract.startDate`
- Must not be `> EndDate` (if EndDate is provided)

**EndDate** (if provided):
- Must be `>= StartDate`
- Optional (can be null)

**Rating**:
- Required
- Range: `0-100`
- Can be integer or `0.5` steps (e.g., `50`, `50.5`, `100`)

**Salary**:
- Required
- Must be `> 0`
- Must be valid number

**Business Rules**:
- (Optional) Không cho remove tất cả engineers (ít nhất 1 engineer phải còn lại)

**Validation Implementation**:
```typescript
const validateEngagedEngineers = (): boolean => {
  let isValid = true;
  const newErrors: { [key: string]: boolean } = {};
  
  if (!formData.engagedEngineers || formData.engagedEngineers.length === 0) {
    newErrors.engagedEngineers = true;
    isValid = false;
  }
  
  formData.engagedEngineers.forEach((engineer, index) => {
    // Skip validation for REMOVED engineers
    if (engineer.action === 'REMOVE') {
      return;
    }
    
    // Engineer Level
    if (!engineer.level || !engineer.role || engineer.role.trim().length === 0) {
      newErrors[`engineerLevel_${index}`] = true;
      isValid = false;
    }
    
    // Start Date
    if (!engineer.startDate) {
      newErrors[`engineerStartDate_${index}`] = true;
      isValid = false;
    } else {
      const startDate = new Date(engineer.startDate);
      const contractStart = contractDetail?.effectiveStart 
        ? new Date(contractDetail.effectiveStart) 
        : null;
      
      if (contractStart && startDate < contractStart) {
        newErrors[`engineerStartDate_${index}`] = true;
        isValid = false;
      }
      
      if (engineer.endDate) {
        const endDate = new Date(engineer.endDate);
        if (endDate < startDate) {
          newErrors[`engineerEndDate_${index}`] = true;
          isValid = false;
        }
      }
    }
    
    // Rating
    if (engineer.rating === null || engineer.rating === undefined || 
        engineer.rating < 0 || engineer.rating > 100) {
      newErrors[`engineerRating_${index}`] = true;
      isValid = false;
    }
    
    // Salary
    if (!engineer.salary || engineer.salary <= 0) {
      newErrors[`engineerSalary_${index}`] = true;
      isValid = false;
    }
  });
  
  // Optional: At least one non-removed engineer
  const activeEngineers = formData.engagedEngineers.filter(
    e => e.action !== 'REMOVE'
  );
  if (activeEngineers.length === 0) {
    newErrors.engagedEngineers = true;
    isValid = false;
  }
  
  setErrors(prev => ({ ...prev, ...newErrors }));
  return isValid;
};
```

#### 2.5. UX Flow

**Step 1**: User chọn CR Type = `RESOURCE_CHANGE`

**Step 2**: User chọn Effective From

**Step 3**: FE gọi API `current-resources` với `asOfDate = EffectiveFrom`

**Step 4**: Fill Block A (Before) và Block B (After)

**Step 5**: User chỉnh Block B (After):
- Modify existing engineers
- Add new engineers
- Remove engineers

**Step 6**: FE gửi payload `engagedEngineers` như spec khi Save/Submit

**State Management**:
```typescript
// State for current resources (Block A)
const [currentResources, setCurrentResources] = useState<CurrentResource[]>([]);
const [loadingResources, setLoadingResources] = useState(false);

// Load current resources when EffectiveFrom changes
useEffect(() => {
  if (isOpen && 
      engagementType === 'Retainer' && 
      formData.type === 'RESOURCE_CHANGE' && 
      formData.effectiveFrom) {
    loadCurrentResources(formData.effectiveFrom);
  }
}, [isOpen, formData.type, formData.effectiveFrom]);

const loadCurrentResources = async (asOfDate: string) => {
  setLoadingResources(true);
  try {
    const response = await fetch(
      `${API_BASE_URL}/sales/contracts/sow/${sowContractId}/current-resources?asOfDate=${asOfDate}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to load current resources');
    }
    
    const data = await response.json();
    setCurrentResources(data.resources);
    
    // Initialize Block B (After) from Block A
    if (formData.engagedEngineers.length === 0 || shouldReset) {
      setFormData(prev => ({
        ...prev,
        engagedEngineers: data.resources.map(resource => ({
          baseEngineerId: resource.baseEngineerId,
          engineerId: resource.engineerId,
          action: 'MODIFY',  // Default action
          level: resource.level,
          role: resource.role,
          startDate: resource.startDate,
          endDate: resource.endDate,
          rating: resource.rating,
          salary: resource.unitRate,
        })),
      }));
    }
  } catch (error) {
    console.error('Error loading current resources:', error);
    setErrorMessage('Failed to load current resources');
  } finally {
    setLoadingResources(false);
  }
};
```

---

## Acceptance Criteria

### ✅ Backend

- [ ] API endpoint `/api/sales/contracts/sow/{sowContractId}/current-resources` được implement
- [ ] API trả về đúng current resources tại `asOfDate` (Baseline + Approved Events)
- [ ] API tự động tạo baseline nếu chưa có
- [ ] API validate contract type (chỉ Retainer)
- [ ] API validate `asOfDate` format
- [ ] Error handling đầy đủ (400, 500, etc.)

### ✅ Frontend

- [ ] Block A (Before) hiển thị đúng current resources tại EffectiveFrom
- [ ] Block A có tooltip giải thích rõ ràng
- [ ] Block A tất cả fields readonly với styling grey
- [ ] Block B (After) được khởi tạo từ Block A khi load lần đầu
- [ ] Block B cho phép Modify/Add/Remove engineers
- [ ] Block B hiển thị removed engineers với strike-through
- [ ] Validation đầy đủ cho tất cả fields
- [ ] EffectiveFrom change trigger reload current resources
- [ ] Confirm dialog khi change EffectiveFrom với existing draft

### ✅ Data Flow

- [ ] CR lần 1 (không có events) → Block A = Baseline
- [ ] CR lần 2, 3... → Block A = Current State (Baseline + Previous CRs)
- [ ] Block B changes → Payload đúng format với `action` field
- [ ] Backend convert payload → `cr_resource_events` khi approve (đã có)

### ✅ UX

- [ ] User hiểu rõ sự khác biệt giữa "Before" và "After"
- [ ] User không nhầm lẫn với "đang chỉnh hợp đồng gốc"
- [ ] UI responsive và dễ sử dụng
- [ ] Loading states được hiển thị khi fetch data
- [ ] Error messages rõ ràng

---

## Testing Checklist

### Backend Testing

- [ ] Test API với contract Retainer → Success
- [ ] Test API với contract Fixed Price → 400 Error
- [ ] Test API với `asOfDate` invalid → 400 Error
- [ ] Test API với contract chưa có baseline → Auto-create baseline
- [ ] Test API với CR đầu tiên → Return baseline only
- [ ] Test API với CR thứ 2, 3... → Return baseline + previous events
- [ ] Test API với `asOfDate` trong tương lai → Return future state

### Frontend Testing

- [ ] Test load Block A khi chọn EffectiveFrom
- [ ] Test Block B initialization từ Block A
- [ ] Test Modify engineer → Action = 'MODIFY'
- [ ] Test Add engineer → Action = 'ADD', default values
- [ ] Test Remove engineer → Action = 'REMOVE', endDate = EffectiveFrom - 1
- [ ] Test validation: Engineer Level required
- [ ] Test validation: StartDate >= contract start
- [ ] Test validation: EndDate >= StartDate
- [ ] Test validation: Rating 0-100
- [ ] Test validation: Salary > 0
- [ ] Test change EffectiveFrom với existing draft → Show confirm dialog
- [ ] Test change EffectiveFrom without draft → Auto reload

### Integration Testing

- [ ] Test full flow: Create CR → Load resources → Modify → Save → Approve → Check events
- [ ] Test CR sequence: CR1 → CR2 → CR3, verify Block A shows correct state
- [ ] Test edge cases: Empty baseline, all engineers removed, etc.

---

## Files to Modify/Create

### Backend

**New Files**:
- `backend/src/main/java/com/skillbridge/dto/sales/response/CurrentResourcesDTO.java`
- `backend/src/main/java/com/skillbridge/dto/sales/response/ResourceDTO.java`

**Modified Files**:
- `backend/src/main/java/com/skillbridge/controller/api/sales/SalesSOWContractController.java`
  - Add endpoint `GET /{sowContractId}/current-resources`
- `backend/src/main/java/com/skillbridge/service/sales/SalesSOWContractService.java`
  - Add method `getCurrentResources()`

**Existing Files (Reuse - từ task cũ)**:
- `backend/src/main/java/com/skillbridge/service/sales/CREventService.java`
  - Method `calculateCurrentResources()` (already implemented in Task-Event-Based-Retainer-SOW-Migration)
- `backend/src/main/java/com/skillbridge/service/sales/SOWBaselineService.java`
  - Method `createBaseline()` (already implemented in Task-Event-Based-Retainer-SOW-Migration)
- `backend/src/main/java/com/skillbridge/service/sales/SalesSOWContractService.java`
  - Method `applyResourceChangeEventBased()` (already implemented in Task-Event-Based-Retainer-SOW-Migration)

### Frontend

**Modified Files**:
- `frontend/src/components/sales/CreateChangeRequestModal.tsx`
  - Add Block A (Before) UI
  - Refactor Block B (After) UI
  - Add state management for current resources
  - Add validation logic
  - Add API call to load current resources

**New Files**:
- `frontend/src/services/salesSOWContractService.ts` (if not exists)
  - Add function `getCurrentResources(sowContractId, asOfDate, token)`

**Type Definitions**:
- `frontend/src/types/contract.ts` (or create new)
  - Add `CurrentResource` interface
  - Add `EngagedEngineerWithAction` interface

---

## Dependencies

### Prerequisites (từ Task-Event-Based-Retainer-SOW-Migration)

- **Backend**: 
  - ✅ `CREventService.calculateCurrentResources()` (already implemented)
  - ✅ `SOWBaselineService.createBaseline()` (already implemented)
  - ✅ `SalesSOWContractService.applyResourceChangeEventBased()` (already implemented)
  - ✅ Database schema (baseline, events, appendix tables)
  
- **Frontend**:
  - ✅ `CreateChangeRequestModal.tsx` (basic structure exists)
  - ✅ UI components: `Table`, `Select`, `Input`, `Button`, `Tooltip`

### New Dependencies (cần implement trong task này)

- **Backend**:
  - ❌ API endpoint `/current-resources` (new)
  - ❌ `CurrentResourcesDTO` class (new)
  - ❌ Support `action` field trong `change_request_engaged_engineers` payload (new)
  
- **Frontend**:
  - ❌ Block A (Before) UI component (new)
  - ❌ Block B (After) UI component với action support (new)
  - ❌ API service function `getCurrentResources()` (new)
  - ❌ Validation logic chi tiết (new)

---

## Notes

1. **Baseline Creation**: Nếu contract chưa có baseline, API sẽ tự động tạo baseline từ data hiện tại trước khi tính current resources (logic này đã có trong `SOWBaselineService.createBaseline()` từ task cũ).

2. **Action Field**: Frontend gửi `action` field trong payload (`ADD`/`MODIFY`/`REMOVE`), backend sẽ validate và convert khi approve CR (logic convert đã có trong `applyResourceChangeEventBased()` từ task cũ).

3. **Engineer ID**: `engineerId` là logical ID trong system, có thể khác với `baseEngineerId` (baseline ID). Task này cần đảm bảo mapping đúng giữa current resources và baseline.

4. **EffectiveFrom Change**: Khi user thay đổi EffectiveFrom, cần reload current resources để đảm bảo Block A hiển thị đúng state tại ngày mới. Đây là logic mới cần implement.

5. **Draft Data**: Nếu CR đã có draft `engagedEngineers`, cần confirm với user trước khi reset khi change EffectiveFrom. Đây là UX flow mới cần implement.

6. **API Difference**: 
   - `/current-state` (task cũ): Trả về full contract detail (baseline + events) cho contract view
   - `/current-resources` (task mới): Trả về chỉ resources tại một ngày cụ thể, format chuyên biệt cho CR creation/editing

---

## Comparison với Task-Event-Based-Retainer-SOW-Migration

### Phần đã có trong Task cũ (KHÔNG cần implement lại)

| Component | Status | Notes |
|-----------|--------|-------|
| Database Schema | ✅ Done | Baseline, events, appendix tables |
| `SOWBaselineService` | ✅ Done | Baseline creation và retrieval |
| `CREventService` | ✅ Done | Event creation và calculation |
| `ContractAppendixService` | ✅ Done | Appendix generation |
| `calculateCurrentResources()` | ✅ Done | Method tính current state |
| `applyResourceChangeEventBased()` | ✅ Done | Convert CR → events khi approve |
| API `/current-state` | ✅ Done | Full contract detail với baseline + events |
| CR Approval Logic | ✅ Done | Event-based approval (không tạo version) |
| Frontend: Remove version tabs | ✅ Done | Đã remove version UI |
| Frontend: Appendix section | ✅ Done | Hiển thị appendices |

### Phần MỚI trong Task này (CẦN implement)

| Component | Status | Notes |
|-----------|--------|-------|
| API `/current-resources` | ❌ New | Endpoint chuyên biệt cho resources only |
| `CurrentResourcesDTO` | ❌ New | DTO format cho resources response |
| Frontend: Block A (Before) | ❌ New | UI hiển thị current resources (readonly) |
| Frontend: Block B (After) | ❌ New | UI cho phép edit với action field |
| Payload với `action` field | ❌ New | Frontend gửi ADD/MODIFY/REMOVE |
| Validation logic chi tiết | ❌ New | Validate cho CR creation/editing |
| UX flow: EffectiveFrom change | ❌ New | Reload resources khi change date |
| UX flow: Draft confirmation | ❌ New | Confirm dialog khi change date với draft |
| API service: `getCurrentResources()` | ❌ New | Frontend service function |

### Sự khác biệt chính

1. **API Endpoint**:
   - Task cũ: `/current-state` → Full contract detail (baseline + events) cho contract view
   - Task mới: `/current-resources` → Chỉ resources tại một ngày, format chuyên biệt cho CR creation

2. **Frontend UI**:
   - Task cũ: General updates cho contract detail view, remove version tabs
   - Task mới: Chi tiết UI cho Create/Edit CR với 2 blocks rõ ràng (Before/After)

3. **Payload Format**:
   - Task cũ: Backend convert CR data → events khi approve
   - Task mới: Frontend gửi `action` field (ADD/MODIFY/REMOVE) trong payload

4. **UX Flow**:
   - Task cũ: General approval flow
   - Task mới: Chi tiết flow khi change EffectiveFrom, draft handling, validation

## Related Documents

- **Guide**: `docs/system-management/guides/Guide-Event-Based-Resource-Change-Flow.md`
- **Task (Prerequisite)**: `docs/system-management/tasks/Task-Event-Based-Retainer-SOW-Migration.md` - **Phải hoàn thành trước task này**
- **Story**: `docs/system-management/stories/Story-29-Sales-Edit-Change-Request-SOW-Retainer.md`

