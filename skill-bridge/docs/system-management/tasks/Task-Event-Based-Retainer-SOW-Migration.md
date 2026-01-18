# Task: Event-based Retainer SOW Contracts Implementation

## Task Information
- **Task ID**: Task-Event-Based-Retainer-SOW
- **Title**: Event-based Retainer SOW Contracts Implementation
- **Related Story**: Story-29 (Sales Edit Change Request for SOW Retainer)
- **Priority**: High
- **Status**: Draft
- **Estimated Effort**: Large (Requires comprehensive implementation)

## Overview

### Event-based System Design
- **Single SOW contract** per Retainer agreement (no versioning)
- **Baseline tables** store original contract data (immutable snapshot)
- **Event tables** store deltas/changes from approved Change Requests
- **Current state** = Baseline + Sum of all approved CR events
- **Appendix system** for legal documentation (PL-001, PL-002...)
- Each approved CR generates an Appendix instead of a new contract version

## Objectives

1. **Maintain single SOW contract record** per Retainer agreement
2. **Preserve baseline data** (original contract) without modification
3. **Track all changes as events** linked to Change Requests
4. **Generate Appendices** when CRs are approved
5. **Calculate current state** dynamically from baseline + events
6. **Support legal workflow** (client signs appendices, not full SOW)

## Implementation Plan

### Phase 1: Database Schema Changes

#### 1.1. Create Baseline Tables

**New Table: `sow_engaged_engineers_base`**
```sql
CREATE TABLE sow_engaged_engineers_base (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sow_contract_id INT NOT NULL,
  engineer_id INT NULL,  -- Optional: reference to engineer
  role VARCHAR(100) NOT NULL,
  level VARCHAR(50) NOT NULL,
  rating DECIMAL(5,2) NOT NULL DEFAULT 0,  -- FTE % (0-100)
  unit_rate DECIMAL(16,2) NOT NULL,  -- Monthly cost
  start_date DATE NOT NULL,
  end_date DATE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sow_contract_id) REFERENCES sow_contracts(id) ON DELETE CASCADE,
  INDEX idx_base_sow_contract_id (sow_contract_id),
  INDEX idx_base_dates (start_date, end_date)
);
```

**New Table: `retainer_billing_base`**
```sql
CREATE TABLE retainer_billing_base (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sow_contract_id INT NOT NULL,
  billing_month DATE NOT NULL,  -- YYYY-MM-01 format
  amount DECIMAL(16,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sow_contract_id) REFERENCES sow_contracts(id) ON DELETE CASCADE,
  INDEX idx_base_sow_contract_id (sow_contract_id),
  INDEX idx_base_billing_month (billing_month),
  UNIQUE KEY uk_base_sow_month (sow_contract_id, billing_month)
);
```

#### 1.2. Create Event Tables

**New Table: `cr_resource_events`**
```sql
CREATE TABLE cr_resource_events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  change_request_id INT NOT NULL,
  action ENUM('ADD', 'REMOVE', 'MODIFY') NOT NULL,
  engineer_id INT NULL,  -- For MODIFY/REMOVE: reference to base engineer
  role VARCHAR(100) NULL,
  level VARCHAR(50) NULL,
  rating_old DECIMAL(5,2) NULL,
  rating_new DECIMAL(5,2) NULL,
  unit_rate_old DECIMAL(16,2) NULL,
  unit_rate_new DECIMAL(16,2) NULL,
  start_date_old DATE NULL,
  start_date_new DATE NULL,
  end_date_old DATE NULL,
  end_date_new DATE NULL,
  effective_start DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (change_request_id) REFERENCES change_requests(id) ON DELETE CASCADE,
  INDEX idx_cr_resource_cr_id (change_request_id),
  INDEX idx_cr_resource_effective (effective_start)
);
```

**New Table: `cr_billing_events`**
```sql
CREATE TABLE cr_billing_events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  change_request_id INT NOT NULL,
  billing_month DATE NOT NULL,  -- YYYY-MM-01 format
  delta_amount DECIMAL(16,2) NOT NULL,  -- Positive or negative
  description TEXT,
  type ENUM('RETAINER_ADJUST', 'SCOPE_ADJUSTMENT', 'CORRECTION') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (change_request_id) REFERENCES change_requests(id) ON DELETE CASCADE,
  INDEX idx_cr_billing_cr_id (change_request_id),
  INDEX idx_cr_billing_month (billing_month),
  INDEX idx_cr_billing_type (type)
);
```

#### 1.3. Create Appendix Table

**New Table: `contract_appendices`**
```sql
CREATE TABLE contract_appendices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sow_contract_id INT NOT NULL,
  change_request_id INT NOT NULL,
  appendix_number VARCHAR(50) NOT NULL,  -- PL-001, PL-002...
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  pdf_path VARCHAR(500) NULL,
  signed_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sow_contract_id) REFERENCES sow_contracts(id) ON DELETE CASCADE,
  FOREIGN KEY (change_request_id) REFERENCES change_requests(id) ON DELETE CASCADE,
  UNIQUE KEY uk_appendix_number (sow_contract_id, appendix_number),
  INDEX idx_appendix_sow (sow_contract_id),
  INDEX idx_appendix_cr (change_request_id)
);
```

#### 1.4. Update Existing Tables

**Update `sow_contracts` table:**
- Add `base_total_amount` DECIMAL(16,2) - Original contract value
- Remove or deprecate `version` and `parent_version_id` columns (no longer needed for Retainer contracts)

**Update `change_requests` table:**
- Add `appendix_id` INT NULL - FK to contract_appendices.id
- Add `sales_internal_note` TEXT NULL
- Add `approved_by` INT NULL - FK to users.id
- Add `approved_at` DATETIME NULL

**Note on `sow_engaged_engineers` and `retainer_billing_details`:**
- These tables will continue to exist for Fixed Price SOW contracts
- For Retainer SOW contracts, use baseline tables and event tables instead
- Consider adding `contract_type` or `engagement_type` flag to distinguish usage

### Phase 2: Backend Service Refactoring

#### 2.1. Create Baseline Service

**New Service: `SOWBaselineService.java`**
- Methods:
  - `createBaseline(Integer sowContractId)` - Create baseline from current contract
  - `getBaselineResources(Integer sowContractId)` - Get baseline engineers
  - `getBaselineBilling(Integer sowContractId)` - Get baseline billing
  - `isBaselineLocked(Integer sowContractId)` - Check if baseline can be modified

#### 2.2. Create Event Service

**New Service: `CREventService.java`**
- Methods:
  - `createResourceEvent(ChangeRequest cr, ResourceEventDTO event)` - Create resource event
  - `createBillingEvent(ChangeRequest cr, BillingEventDTO event)` - Create billing event
  - `getResourceEvents(Integer sowContractId, LocalDate asOfDate)` - Get events up to date
  - `getBillingEvents(Integer sowContractId, LocalDate month)` - Get events for month
  - `calculateCurrentResources(Integer sowContractId, LocalDate asOfDate)` - Calculate current state
  - `calculateCurrentBilling(Integer sowContractId, LocalDate month)` - Calculate billing for month

#### 2.3. Create Appendix Service

**New Service: `ContractAppendixService.java`**
- Methods:
  - `generateAppendix(ChangeRequest cr)` - Generate appendix from CR
  - `getAppendices(Integer sowContractId)` - Get all appendices for contract
  - `updateAppendixStatus(Integer appendixId, String status)` - Update signing status
  - `generateAppendixPDF(Integer appendixId)` - Generate PDF document

#### 2.4. Implement CR Approval Logic

**Update: `SalesSOWContractService.approveChangeRequestForSOW()`**
- **Event-based Logic:**
  - Validate CR status
  - Create `cr_resource_events` for resource changes
  - Create `cr_billing_events` for billing changes
  - Generate `contract_appendices` record
  - Link CR to appendix
  - Update CR status to APPROVED
  - **DO NOT** create new contract version

#### 2.5. Refactor Contract Detail Retrieval

**Update: `SalesSOWContractService.getSOWContractDetail()`**
- **NEW Logic:**
  - Load baseline contract (original SOW)
  - Load baseline engineers and billing from baseline tables
  - Load all approved CR events
  - Calculate current state = baseline + events
  - Return combined view

#### 2.6. Refactor Contract List

**Update: `SalesContractService.buildSOWSpecification()`**
- **NEW Logic:**
  - For Retainer SOW contracts: Show only original contracts (no version filtering needed)
  - For Fixed Price SOW contracts: Keep existing logic (if applicable)

### Phase 3: API Endpoints

#### 3.1. New Endpoints

**GET `/api/sales/contracts/sow/{id}/baseline`**
- Returns baseline contract data (original SOW)
- Includes baseline engineers and billing
- Read-only reference

**GET `/api/sales/contracts/sow/{id}/current-state?asOfDate={date}`**
- Returns current state calculated from baseline + events
- Optional `asOfDate` parameter for historical view
- Includes current engineers and billing

**GET `/api/sales/contracts/sow/{id}/appendices`**
- Returns list of all appendices for contract
- Includes CR information and signing status

**GET `/api/sales/contracts/sow/{id}/appendices/{appendixId}`**
- Returns appendix detail
- Includes PDF download link if available

**POST `/api/sales/contracts/sow/{id}/appendices/{appendixId}/sign`**
- Mark appendix as signed
- Update `signed_at` timestamp

**GET `/api/sales/contracts/sow/{id}/events?type={resource|billing}&fromDate={date}&toDate={date}`**
- Returns events for contract
- Filterable by type and date range
- Used for audit and reporting

#### 3.2. Updated Endpoints

**GET `/api/sales/contracts/sow/{id}`**
- Returns contract detail with current state (baseline + events)
- For Retainer contracts: Always use event-based calculation

**PUT `/api/sales/contracts/sow/{id}`**
- Update contract details
- For Retainer contracts: only allow updates if no approved CRs exist (or handle appropriately)

**POST `/api/sales/contracts/sow/{id}/change-requests/{crId}/approve`**
- **NEW Logic:**
  - Create events instead of cloning contract
  - Generate appendix
  - Link CR to appendix
  - Update CR status

### Phase 4: Frontend Changes

#### 4.1. Implement Single Contract View

**Update: `frontend/src/app/sales/contracts/sow/[id]/page.tsx`**
- Remove version selection UI (if exists)
- Remove version tabs component (if exists)
- Show single contract view with current state (baseline + events)

#### 4.2. Add Appendix Section

**New Component: `AppendixList.tsx`**
- Display list of appendices
- Show appendix number, title, status, signing date
- Link to appendix detail/download

**New Component: `AppendixDetail.tsx`**
- Display appendix content
- Show related CR information
- PDF viewer/download

#### 4.3. Update Contract Detail View

**Update: `frontend/src/app/sales/contracts/sow/[id]/page.tsx`**
- Add "Baseline" tab (read-only, shows original contract)
- Add "Appendices" tab (shows all appendices)
- Update "Contract Info" tab to show current state (baseline + events)
- Remove version switching logic

#### 4.4. Update CR Approval Flow

**Update: `CreateChangeRequestModal.tsx` and `SalesChangeRequestDetailModal.tsx`**
- Implement event-based approval logic (no version creation)
- Add event preview before approval
- Show appendix generation preview
- Update approval confirmation message

#### 4.5. Update Billing Display

**Update: Billing components**
- Show baseline billing + event deltas
- Display formula: `Total = Baseline + Σ(Events)`
- Color-code baseline vs. event adjustments

### Phase 5: Testing

#### 6.1. Unit Tests

- Test baseline creation
- Test event creation (ADD, REMOVE, MODIFY)
- Test current state calculation
- Test appendix generation
- Test CR approval flow (event-based)

#### 6.2. Integration Tests

- Test contract detail retrieval (baseline + events)
- Test CR approval creates events and appendix
- Test billing calculation for specific month
- Test resource calculation for specific date
- Test baseline creation when contract is created/approved

#### 6.3. E2E Tests

- Test Sales creates CR
- Test Sales edits CR
- Test Sales approves CR (creates events + appendix)
- Test Contract detail shows current state
- Test Appendix list and detail views
- Test Billing display (baseline + events)

### Phase 6: Documentation

#### 6.1. Technical Documentation

- Event-based architecture overview
- Data model documentation
- API documentation updates
- Implementation guide

#### 6.2. User Documentation

- Sales user guide (new CR approval flow)
- Client user guide (viewing appendices)
- Appendix signing workflow

## Acceptance Criteria

### Database
- [ ] Baseline tables created
- [ ] Event tables created
- [ ] Appendix table created
- [ ] Existing tables updated with new columns
- [ ] Flyway migration scripts created and tested

### Backend
- [ ] Baseline service implemented
- [ ] Event service implemented
- [ ] Appendix service implemented
- [ ] CR approval creates events (not versions)
- [ ] Contract detail returns current state (baseline + events)
- [ ] Billing calculation uses baseline + events
- [ ] Resource calculation uses baseline + events
- [ ] All APIs updated and tested

### Frontend
- [ ] Version tabs removed
- [ ] Appendix list component implemented
- [ ] Appendix detail component implemented
- [ ] Contract detail shows current state
- [ ] Baseline tab (read-only) implemented
- [ ] Billing display shows baseline + events
- [ ] CR approval flow updated

### Business Logic
- [ ] Single SOW contract per Retainer agreement
- [ ] Baseline data is immutable
- [ ] Current state = Baseline + Σ(Approved CR Events)
- [ ] Each approved CR generates an appendix
- [ ] Appendix numbering (PL-001, PL-002...) works correctly
- [ ] Billing for month M = Baseline(M) + Σ(Events(M))

### Legal/Compliance
- [ ] Appendix generation works
- [ ] Appendix PDF generation (if implemented)
- [ ] Appendix signing workflow
- [ ] Audit trail maintained (events table)

## Risks & Mitigation

### Risk 1: Performance Impact (Calculating Current State)
- **Mitigation**:
  - Index all event tables properly
  - Consider caching current state
  - Optimize queries with proper joins
  - Monitor query performance

### Risk 2: Complex Event Calculations
- **Mitigation**:
  - Comprehensive unit tests for event calculations
  - Clear business rules documentation
  - Validation queries to verify correctness

## Timeline Estimate

- **Phase 1 (Database)**: 3-5 days
- **Phase 2 (Backend Services)**: 8-10 days
- **Phase 3 (API)**: 3-4 days
- **Phase 4 (Frontend)**: 5-7 days
- **Phase 5 (Testing)**: 5-7 days
- **Phase 6 (Documentation)**: 2-3 days

**Total Estimated Effort**: 28-36 days (5.5-7 weeks)

## Dependencies

- Story-29: Sales Edit Change Request for SOW Retainer (current implementation)
- Story-28: Sales Create Change Request for SOW Retainer
- Database migration tools (Flyway)
- PDF generation library (if implementing appendix PDFs)

## Notes

- This is a **major architectural change** that affects core contract management for Retainer SOW contracts
- **Test thoroughly** before production deployment
- **Document all business rules** for event calculations clearly
- Baseline data should be created when SOW contract is first approved/activated
- Baseline is immutable once first CR is approved

## Open Questions

1. Should baseline be editable before first CR approval?
2. How to handle CR rejection? (Delete events? Keep as draft?)
3. PDF generation: Use template engine? Which library?
4. Appendix numbering: Per contract or global?
5. Should we calculate current state on-the-fly or cache it?
6. When should baseline be created? (On contract creation, approval, or first CR?)
7. How to handle baseline updates if contract details change before first CR?

