# Guide: Event-Based Resource Change Flow cho SOW Retainer

## Tổng quan

Khi một Change Request (CR) có type `RESOURCE_CHANGE` được approve cho hợp đồng SOW Retainer, hệ thống sử dụng **Event-Based Architecture** để quản lý thay đổi. Thay vì tạo version mới của contract, hệ thống tạo các **Events** (delta) để ghi lại thay đổi và tính toán trạng thái hiện tại từ Baseline + Events.

---

## 1. Data Flow Tổng Quan

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. CR được Approve (Client hoặc Sales)                          │
│    - Status: "Processing" / "Under Review" / "Client Under Review" │
│    → Status: "Approved"                                         │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. approveChangeRequestForSOW()                                 │
│    - Validate CR status và engagement type                      │
│    - Ensure baseline exists (create if not)                      │
│    - Route to applyResourceChangeEventBased()                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. applyResourceChangeEventBased()                               │
│    - Load CR engineers từ change_request_engaged_engineers      │
│    - Load CR billing từ change_request_billing_details           │
│    - Load baseline engineers từ sow_engaged_engineers_base       │
│    - Compare và tạo Resource Events                            │
│    - Tạo Billing Events                                         │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. Tạo Resource Events (cr_resource_events)                     │
│    - ADD: Engineer mới không có trong baseline                  │
│    - MODIFY: Engineer có trong baseline, thay đổi thuộc tính     │
│    - REMOVE: Engineer bị xóa (end_date được set)                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. Tạo Billing Events (cr_billing_events)                       │
│    - Delta amount cho mỗi tháng                                  │
│    - Description mô tả thay đổi                                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. Generate Contract Appendix                                    │
│    - Tạo contract_appendices record                              │
│    - Generate appendix number (AP-001, AP-002...)                │
│    - Generate title và summary                                   │
│    - Link CR với appendix                                        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. Update CR Status                                              │
│    - Status = "Approved"                                         │
│    - approved_by, approved_at                                    │
│    - appendix_id                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Chi Tiết Logic Code

### 2.1. Entry Point: `approveChangeRequestForSOW()`

**File**: `SalesSOWContractService.java`  
**Method**: `approveChangeRequestForSOW()`

**Logic**:
1. Validate CR status: chỉ approve được CR có status `"Processing"`, `"Under Review"`, hoặc `"Client Under Review"`
2. Validate engagement type: chỉ áp dụng cho `"Retainer"` hoặc `"Retainer_"`
3. Ensure baseline exists: gọi `sowBaselineService.createBaseline()` nếu chưa có
4. Route theo CR type:
   - `RESOURCE_CHANGE` → `applyResourceChangeEventBased()`
   - `SCHEDULE_CHANGE` → `applyScheduleChangeEventBased()`
   - `SCOPE_ADJUSTMENT` → `applyScopeAdjustmentEventBased()`
   - `RATE_ADJUSTMENT` → `applyRateAdjustmentEventBased()`
5. Generate appendix: gọi `contractAppendixService.generateAppendix()`
6. Update CR status: set `"Approved"`, `approved_by`, `approved_at`, `appendix_id`

---

### 2.2. Core Logic: `applyResourceChangeEventBased()`

**File**: `SalesSOWContractService.java`  
**Method**: `applyResourceChangeEventBased()`

**Input**:
- `sowContractId`: ID của SOW contract
- `changeRequest`: Change Request entity
- `effectiveStart`: Ngày bắt đầu hiệu lực (từ CR.effectiveFrom)
- `currentUser`: User approve CR

**Steps**:

#### Step 1: Load Data
```java
// Load engineers từ CR
List<ChangeRequestEngagedEngineer> crEngineers = 
    changeRequestEngagedEngineerRepository.findByChangeRequestId(changeRequest.getId());

// Load billing từ CR
List<ChangeRequestBillingDetail> crBilling = 
    changeRequestBillingDetailRepository.findByChangeRequestId(changeRequest.getId());

// Load baseline engineers để so sánh
List<SOWEngagedEngineerBase> baselineEngineers = 
    sowBaselineService.getBaselineResources(sowContractId);
```

#### Step 2: Parse Engineer Level
Engineer level format: `"Middle Backend Engineer"` → `level="Middle"`, `role="Backend Engineer"`

```java
Function<String, Map<String, String>> parseEngineerLevel = (engineerLevel) -> {
    String[] parts = engineerLevel.trim().split("\\s+", 2);
    if (parts.length >= 2) {
        level = parts[0];  // "Middle"
        role = parts[1];    // "Backend Engineer"
    }
    return {level, role};
};
```

#### Step 3: Compare và Tạo Resource Events

**Với mỗi engineer trong CR**:

**A. Tìm matching baseline engineer**:
- So sánh `level` và `role` (case-insensitive, partial match)
- Nếu tìm thấy → **MODIFY event**
- Nếu không tìm thấy → **ADD event**

**B. Tạo MODIFY Event** (engineer đã có trong baseline):
```java
crEventService.createResourceEvent(
    changeRequest,
    ResourceAction.MODIFY,
    matchingBaseEng.getId(),           // engineerId từ baseline
    matchingBaseEng.getRole(),          // role từ baseline
    matchingBaseEng.getLevel(),         // level từ baseline
    matchingBaseEng.getRating(),        // ratingOld
    crEng.getRating(),                  // ratingNew
    matchingBaseEng.getUnitRate(),      // unitRateOld
    crEng.getSalary(),                  // unitRateNew
    matchingBaseEng.getStartDate(),     // startDateOld
    crEng.getStartDate() ?? effectiveStart, // startDateNew
    matchingBaseEng.getEndDate(),       // endDateOld
    crEng.getEndDate(),                 // endDateNew
    effectiveStart                      // effectiveStart
);
```

**C. Tạo ADD Event** (engineer mới):
```java
crEventService.createResourceEvent(
    changeRequest,
    ResourceAction.ADD,
    null,                               // engineerId = null (engineer mới)
    eventRole,                          // role từ CR
    eventLevel,                         // level từ CR
    null,                               // ratingOld = null
    crEng.getRating(),                  // ratingNew
    null,                               // unitRateOld = null
    crEng.getSalary(),                  // unitRateNew
    null,                               // startDateOld = null
    crEng.getStartDate() ?? effectiveStart, // startDateNew
    null,                               // endDateOld = null
    crEng.getEndDate(),                 // endDateNew
    effectiveStart                      // effectiveStart
);
```

#### Step 4: Tạo Billing Events

**Với mỗi billing detail trong CR**:
```java
for (ChangeRequestBillingDetail crBillingDetail : crBilling) {
    if (crBillingDetail.getPaymentDate() != null && 
        !crBillingDetail.getPaymentDate().isBefore(effectiveStart)) {
        
        LocalDate billingMonth = crBillingDetail.getPaymentDate().withDayOfMonth(1);
        BigDecimal deltaAmount = crBillingDetail.getAmount(); // Có thể là + hoặc -
        
        crEventService.createBillingEvent(
            changeRequest,
            billingMonth,
            deltaAmount,
            crBillingDetail.getDeliveryNote(),
            BillingEventType.RETAINER_ADJUST
        );
    }
}
```

---

### 2.3. Create Resource Event: `createResourceEvent()`

**File**: `CREventService.java`  
**Method**: `createResourceEvent()`

**Logic**:
1. Tạo `CRResourceEvent` entity
2. Set các fields:
   - `changeRequestId`: ID của CR
   - `action`: ADD / MODIFY / REMOVE
   - `engineerId`: ID từ baseline (null nếu ADD)
   - `role`, `level`: Role và level của engineer
   - `ratingOld`, `ratingNew`: Rating cũ và mới
   - `unitRateOld`, `unitRateNew`: Unit rate cũ và mới
   - `startDateOld`, `startDateNew`: Start date cũ và mới
   - `endDateOld`, `endDateNew`: End date cũ và mới
   - `effectiveStart`: Ngày bắt đầu hiệu lực
3. Save vào database: `crResourceEventRepository.save(event)`

---

### 2.4. Generate Appendix: `generateAppendix()`

**File**: `ContractAppendixService.java`  
**Method**: `generateAppendix()`

**Logic**:
1. Check nếu appendix đã tồn tại → return existing
2. Generate appendix number: `AP-001`, `AP-002`, ... (auto-increment)
3. Generate title: `"Appendix AP-001 - Resource Change effective from 2025-04-01"`
4. Generate summary:
   - Lấy summary từ CR (`cr.getSummary()`)
   - Append billing changes từ `cr_billing_events`
5. Create `ContractAppendix` entity và save
6. Update CR: set `appendix_id`

---

## 3. Tính Toán Trạng Thái Hiện Tại (Current State)

### 3.1. Calculate Current Resources: `calculateCurrentResources()`

**File**: `CREventService.java`  
**Method**: `calculateCurrentResources(sowContractId, asOfDate)`

**Logic**:

```
Current Resources = Baseline Engineers + All Approved Events (up to asOfDate)
```

**Steps**:

1. **Load Baseline Engineers** active tại `asOfDate`:
   ```java
   List<SOWEngagedEngineerBase> baselineEngineers = 
       sowEngagedEngineerBaseRepository.findActiveAtDate(sowContractId, asOfDate);
   ```

2. **Load Approved Resource Events** up to `asOfDate`:
   ```java
   List<CRResourceEvent> events = 
       crResourceEventRepository.findApprovedEventsUpToDate(sowContractId, asOfDate);
   ```

3. **Start với Baseline**:
   - Tạo `CurrentEngineerState` cho mỗi baseline engineer

4. **Apply Events** theo thứ tự thời gian:
   - **ADD**: Thêm engineer mới vào current state
   - **MODIFY**: Update thuộc tính của engineer (rating, unitRate, startDate, endDate)
   - **REMOVE**: Set `endDate` của engineer

5. **Filter** engineers active tại `asOfDate`:
   ```java
   filter(e -> e.getStartDate() <= asOfDate && 
               (e.getEndDate() == null || e.getEndDate() >= asOfDate))
   ```

---

### 3.2. Calculate Current Billing: `calculateCurrentBilling()`

**File**: `CREventService.java`  
**Method**: `calculateCurrentBilling(sowContractId, month)`

**Logic**:

```
Current Billing (month) = Baseline Billing (month) + Sum of All Billing Events (month)
```

**Steps**:

1. **Load Baseline Billing** cho tháng:
   ```java
   Optional<RetainerBillingBase> baselineBilling = 
       retainerBillingBaseRepository.findBySowContractIdAndBillingMonth(sowContractId, month);
   BigDecimal baselineAmount = baselineBilling.map(RetainerBillingBase::getAmount)
                                               .orElse(BigDecimal.ZERO);
   ```

2. **Load Billing Events** cho tháng:
   ```java
   List<CRBillingEvent> events = 
       crBillingEventRepository.findApprovedEventsByMonth(sowContractId, month);
   ```

3. **Sum delta amounts**:
   ```java
   BigDecimal eventTotal = events.stream()
       .map(CRBillingEvent::getDeltaAmount)
       .reduce(BigDecimal.ZERO, BigDecimal::add);
   ```

4. **Return total**:
   ```java
   return baselineAmount.add(eventTotal);
   ```

---

## 4. Database Schema

### 4.1. Baseline Tables (Immutable)

**`sow_engaged_engineers_base`**:
- `id`: PK
- `sow_contract_id`: FK → `sow_contracts.id`
- `role`, `level`: Role và level
- `rating`: FTE % (0-100)
- `unit_rate`: Monthly cost
- `start_date`, `end_date`: Thời gian active

**`retainer_billing_base`**:
- `id`: PK
- `sow_contract_id`: FK → `sow_contracts.id`
- `billing_month`: YYYY-MM-01
- `amount`: Số tiền baseline

### 4.2. Event Tables (Deltas)

**`cr_resource_events`**:
- `id`: PK
- `change_request_id`: FK → `change_requests.id`
- `action`: `ADD` / `MODIFY` / `REMOVE`
- `engineer_id`: ID từ baseline (null nếu ADD)
- `role`, `level`: Role và level
- `rating_old`, `rating_new`: Rating cũ và mới
- `unit_rate_old`, `unit_rate_new`: Unit rate cũ và mới
- `start_date_old`, `start_date_new`: Start date cũ và mới
- `end_date_old`, `end_date_new`: End date cũ và mới
- `effective_start`: Ngày bắt đầu hiệu lực

**`cr_billing_events`**:
- `id`: PK
- `change_request_id`: FK → `change_requests.id`
- `billing_month`: YYYY-MM-01
- `delta_amount`: Số tiền delta (+ hoặc -)
- `description`: Mô tả thay đổi
- `type`: `RETAINER_ADJUST` / `SCOPE_ADJUSTMENT` / `CORRECTION`

### 4.3. Appendix Table

**`contract_appendices`**:
- `id`: PK
- `sow_contract_id`: FK → `sow_contracts.id`
- `change_request_id`: FK → `change_requests.id`
- `appendix_number`: `AP-001`, `AP-002`, ...
- `title`: Title của appendix
- `summary`: Summary mô tả thay đổi
- `signed_at`: Ngày ký (nullable)
- `created_at`, `updated_at`

---

## 5. Ví Dụ Thực Tế

### Scenario: Thêm 1 Middle Backend Engineer từ 2025-04-01

**Input CR**:
- Type: `RESOURCE_CHANGE`
- Effective From: `2025-04-01`
- Engaged Engineers:
  - Engineer Level: `"Middle Backend Engineer"`
  - Start Date: `2025-04-01`
  - Rating: `100`
  - Salary: `400,000`
- Billing Adjustments:
  - Payment Date: `2025-04-01`
  - Adjustment Amount: `+400,000`
  - Adjustment Note: `"Add 1 Middle Backend Engineer"`

**Process**:

1. **Load Baseline**: Giả sử baseline có 2 engineers:
   - Senior Frontend (ID: 1)
   - Junior QA (ID: 2)

2. **Compare**: "Middle Backend Engineer" không có trong baseline → **ADD event**

3. **Create Resource Event**:
   ```sql
   INSERT INTO cr_resource_events (
       change_request_id, action, engineer_id, role, level,
       rating_old, rating_new, unit_rate_old, unit_rate_new,
       start_date_old, start_date_new, end_date_old, end_date_new,
       effective_start
   ) VALUES (
       123, 'ADD', NULL, 'Backend Engineer', 'Middle',
       NULL, 100, NULL, 400000,
       NULL, '2025-04-01', NULL, NULL,
       '2025-04-01'
   );
   ```

4. **Create Billing Event**:
   ```sql
   INSERT INTO cr_billing_events (
       change_request_id, billing_month, delta_amount, description, type
   ) VALUES (
       123, '2025-04-01', 400000, 'Add 1 Middle Backend Engineer', 'RETAINER_ADJUST'
   );
   ```

5. **Generate Appendix**:
   - Number: `AP-001`
   - Title: `"Appendix AP-001 - Resource Change effective from 2025-04-01"`
   - Summary: `"[CR Summary]\n\nBilling Changes:\n- Month 2025-04-01: +400000 - Add 1 Middle Backend Engineer"`

6. **Current State Calculation** (as of 2025-04-15):
   - Baseline: 2 engineers (Senior Frontend, Junior QA)
   - Apply ADD event → 3 engineers (Senior Frontend, Junior QA, **Middle Backend Engineer**)
   - Billing April 2025: `Baseline(1,000,000) + Event(+400,000) = 1,400,000`

---

## 6. API Endpoints

### 6.1. Approve CR
```
POST /api/sales/change-requests/{crId}/approve
```

**Request Body**:
```json
{
  "reviewNotes": "Approved",
  "reviewAction": "APPROVE"
}
```

**Response**: Success status

---

### 6.2. Get Contract Detail (Current State)
```
GET /api/sales/contracts/sow/{sowContractId}
```

**Response**:
```json
{
  "id": 140,
  "contractId": "SOW-2025-11-22-40",
  "engagedEngineers": [
    {
      "id": 1,
      "engineerLevel": "Senior Frontend",
      "startDate": "2025-01-01",
      "endDate": null,
      "rating": 100,
      "salary": 500000
    },
    {
      "id": null,
      "engineerLevel": "Middle Backend Engineer",
      "startDate": "2025-04-01",
      "endDate": null,
      "rating": 100,
      "salary": 400000
    }
  ],
  "billingDetails": [
    {
      "paymentDate": "2025-04-01",
      "amount": 1400000,
      "deliveryNote": "Monthly Retainer Apr 2025 + Add 1 Middle Backend Engineer"
    }
  ]
}
```

---

### 6.3. Get Baseline Data
```
GET /api/sales/contracts/sow/{sowContractId}/baseline
```

**Response**: Baseline engineers và billing (immutable snapshot)

---

### 6.4. Get Events History
```
GET /api/sales/contracts/sow/{sowContractId}/events?type=resource&fromDate=2025-01-01&toDate=2025-12-31
```

**Response**: List of resource/billing events

---

## 7. Key Points

1. **Baseline là Immutable**: Không bao giờ sửa baseline sau khi tạo
2. **Events là Deltas**: Mỗi event chỉ ghi lại thay đổi, không ghi lại toàn bộ state
3. **Current State = Baseline + Events**: Luôn tính toán từ baseline + events, không lưu trực tiếp
4. **Appendix cho mỗi CR**: Mỗi CR approved tạo 1 appendix (AP-001, AP-002, ...)
5. **Chronological Order**: Events được apply theo thứ tự thời gian (`effective_start`)
6. **Only Approved Events**: Chỉ events từ CRs có status `"Approved"` mới được tính vào current state

---

## 8. Error Handling

- **Baseline không tồn tại**: Tự động tạo baseline từ current contract data
- **CR status không hợp lệ**: Throw exception "Only Processing, Under Review, or Client Under Review change requests can be approved"
- **Effective start date null**: Throw exception "Effective start date is required"
- **No engineers in CR**: Log warning nhưng vẫn tiếp tục (có thể chỉ có billing changes)

---

## 9. Testing Checklist

- [ ] Approve CR với ADD engineer → Resource event được tạo với action=ADD
- [ ] Approve CR với MODIFY engineer → Resource event được tạo với action=MODIFY
- [ ] Approve CR với billing adjustment → Billing event được tạo với delta_amount
- [ ] Appendix được generate với number, title, summary đúng
- [ ] Current state calculation: Baseline + Events = Current
- [ ] Multiple CRs: Events được apply theo thứ tự thời gian
- [ ] Future events: Không được tính vào current state nếu `effective_start > asOfDate`

---

## 10. References

- **Service Classes**:
  - `SalesSOWContractService.java`: Main approval logic
  - `CREventService.java`: Event creation và current state calculation
  - `ContractAppendixService.java`: Appendix generation
  - `SOWBaselineService.java`: Baseline management

- **Entities**:
  - `CRResourceEvent.java`
  - `CRBillingEvent.java`
  - `ContractAppendix.java`
  - `SOWEngagedEngineerBase.java`
  - `RetainerBillingBase.java`

- **Repositories**:
  - `CRResourceEventRepository.java`
  - `CRBillingEventRepository.java`
  - `ContractAppendixRepository.java`
  - `SOWEngagedEngineerBaseRepository.java`
  - `RetainerBillingBaseRepository.java`

