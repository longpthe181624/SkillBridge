# Hướng dẫn xóa dữ liệu SOW Retainer Contract trong Database

## Tổng quan

Tài liệu này hướng dẫn cách xóa dữ liệu của hợp đồng SOW - Retainer trong database theo đúng thứ tự để tránh vi phạm Foreign Key constraints.

## Lưu ý quan trọng

⚠️ **CẢNH BÁO**: 
- Chỉ xóa dữ liệu trong môi trường **TEST/DEVELOPMENT**
- **KHÔNG BAO GIỜ** xóa dữ liệu trong môi trường **PRODUCTION** mà không có backup
- Luôn backup database trước khi xóa dữ liệu
- Kiểm tra kỹ `sow_contract_id` trước khi xóa

## Thứ tự xóa các bảng

### Bước 1: Xóa các bảng con của Change Request (CR)

Các bảng này có Foreign Key đến `change_requests`, cần xóa trước khi xóa `change_requests`.

#### 1.1. Xóa Change Request History
```sql
-- Xóa history của các CR liên quan đến SOW Retainer
DELETE FROM change_request_history 
WHERE change_request_id IN (
    SELECT id FROM change_requests 
    WHERE sow_contract_id = :sow_contract_id
);
```

#### 1.2. Xóa Change Request Attachments
```sql
-- Xóa attachments của các CR liên quan đến SOW Retainer
DELETE FROM change_request_attachments 
WHERE change_request_id IN (
    SELECT id FROM change_requests 
    WHERE sow_contract_id = :sow_contract_id
);
```

#### 1.3. Xóa Change Request Engaged Engineers
```sql
-- Xóa engaged engineers của các CR liên quan đến SOW Retainer
DELETE FROM change_request_engaged_engineers 
WHERE change_request_id IN (
    SELECT id FROM change_requests 
    WHERE sow_contract_id = :sow_contract_id
);
```

#### 1.4. Xóa Change Request Billing Details
```sql
-- Xóa billing details của các CR liên quan đến SOW Retainer
DELETE FROM change_request_billing_details 
WHERE change_request_id IN (
    SELECT id FROM change_requests 
    WHERE sow_contract_id = :sow_contract_id
);
```

### Bước 2: Xóa Change Requests

Sau khi xóa tất cả các bảng con, có thể xóa Change Requests.

```sql
-- Xóa tất cả Change Requests liên quan đến SOW Retainer
DELETE FROM change_requests 
WHERE sow_contract_id = :sow_contract_id;
```

### Bước 3: Xóa các bảng con của SOW Contract

Các bảng này có Foreign Key đến `sow_contracts`, cần xóa trước khi xóa `sow_contracts`.

#### 3.1. Xóa Contract Internal Review
```sql
-- Xóa internal review của SOW Retainer
DELETE FROM contract_internal_review 
WHERE sow_contract_id = :sow_contract_id 
  AND contract_type = 'SOW';
```

#### 3.2. Xóa Contract History
```sql
-- Xóa history của SOW Retainer
DELETE FROM contract_history 
WHERE sow_contract_id = :sow_contract_id;
```

#### 3.3. Xóa SOW Engaged Engineers
```sql
-- Xóa engaged engineers của SOW Retainer
DELETE FROM sow_engaged_engineers 
WHERE sow_contract_id = :sow_contract_id;
```

#### 3.4. Xóa Retainer Billing Details
```sql
-- Xóa billing details của SOW Retainer
DELETE FROM retainer_billing_details 
WHERE sow_contract_id = :sow_contract_id;
```

#### 3.5. Xóa Delivery Items (nếu có)
```sql
-- Xóa delivery items của SOW Retainer (nếu có)
DELETE FROM delivery_items 
WHERE sow_contract_id = :sow_contract_id;
```

**Lưu ý**: 
- `milestone_deliverables` và `fixed_price_billing_details` chỉ dành cho Fixed Price SOW, không cần xóa cho Retainer
- Nếu SOW Retainer có version (V1, V2, V3...), cần xóa tất cả các version

### Bước 4: Xóa SOW Contract versions (nếu có)

Nếu SOW Retainer có versioning, cần xóa tất cả các version theo thứ tự từ version cao nhất đến V1.

```sql
-- Xóa các version con trước (V2, V3, ...)
DELETE FROM sow_contracts 
WHERE parent_version_id = :sow_contract_id;

-- Hoặc xóa tất cả versions cùng lúc
DELETE FROM sow_contracts 
WHERE id = :sow_contract_id 
   OR parent_version_id = :sow_contract_id;
```

### Bước 5: Xóa SOW Contract chính

Cuối cùng, xóa SOW Contract chính.

```sql
-- Xóa SOW Contract chính
DELETE FROM sow_contracts 
WHERE id = :sow_contract_id;
```

## Script xóa hoàn chỉnh (cho một SOW Contract)

Dưới đây là script SQL hoàn chỉnh để xóa tất cả dữ liệu liên quan đến một SOW Retainer contract:

```sql
-- ============================================
-- Script xóa dữ liệu SOW Retainer Contract
-- ============================================
-- Thay :sow_contract_id bằng ID thực tế của SOW contract cần xóa
-- Ví dụ: SET @sow_contract_id = 123;

SET @sow_contract_id = :sow_contract_id; -- Thay bằng ID thực tế

-- Bước 1: Xóa Change Request History
DELETE FROM change_request_history 
WHERE change_request_id IN (
    SELECT id FROM change_requests 
    WHERE sow_contract_id = @sow_contract_id
);

-- Bước 2: Xóa Change Request Attachments
DELETE FROM change_request_attachments 
WHERE change_request_id IN (
    SELECT id FROM change_requests 
    WHERE sow_contract_id = @sow_contract_id
);

-- Bước 3: Xóa Change Request Engaged Engineers
DELETE FROM change_request_engaged_engineers 
WHERE change_request_id IN (
    SELECT id FROM change_requests 
    WHERE sow_contract_id = @sow_contract_id
);

-- Bước 4: Xóa Change Request Billing Details
DELETE FROM change_request_billing_details 
WHERE change_request_id IN (
    SELECT id FROM change_requests 
    WHERE sow_contract_id = @sow_contract_id
);

-- Bước 5: Xóa Change Requests
DELETE FROM change_requests 
WHERE sow_contract_id = @sow_contract_id;

-- Bước 6: Xóa Contract Internal Review
DELETE FROM contract_internal_review 
WHERE sow_contract_id = @sow_contract_id 
  AND contract_type = 'SOW';

-- Bước 7: Xóa Contract History
DELETE FROM contract_history 
WHERE sow_contract_id = @sow_contract_id;

-- Bước 8: Xóa SOW Engaged Engineers
DELETE FROM sow_engaged_engineers 
WHERE sow_contract_id = @sow_contract_id;

-- Bước 9: Xóa Retainer Billing Details
DELETE FROM retainer_billing_details 
WHERE sow_contract_id = @sow_contract_id;

-- Bước 10: Xóa Delivery Items (nếu có)
DELETE FROM delivery_items 
WHERE sow_contract_id = @sow_contract_id;

-- Bước 11: Xóa các SOW Contract versions (nếu có)
-- Xóa các version con trước
DELETE FROM sow_contracts 
WHERE parent_version_id = @sow_contract_id;

-- Bước 12: Xóa SOW Contract chính
DELETE FROM sow_contracts 
WHERE id = @sow_contract_id;

-- ============================================
-- Kiểm tra kết quả
-- ============================================
-- Kiểm tra xem còn dữ liệu nào không
SELECT 'Remaining Change Requests' AS check_type, COUNT(*) AS count
FROM change_requests 
WHERE sow_contract_id = @sow_contract_id
UNION ALL
SELECT 'Remaining Engaged Engineers', COUNT(*)
FROM sow_engaged_engineers 
WHERE sow_contract_id = @sow_contract_id
UNION ALL
SELECT 'Remaining Billing Details', COUNT(*)
FROM retainer_billing_details 
WHERE sow_contract_id = @sow_contract_id
UNION ALL
SELECT 'Remaining SOW Contracts', COUNT(*)
FROM sow_contracts 
WHERE id = @sow_contract_id OR parent_version_id = @sow_contract_id;
```

## Script xóa tất cả SOW Retainer Contracts

Nếu muốn xóa **TẤT CẢ** SOW Retainer contracts (chỉ dùng trong môi trường test):

```sql
-- ============================================
-- Script xóa TẤT CẢ dữ liệu SOW Retainer
-- CHỈ DÙNG TRONG MÔI TRƯỜNG TEST!
-- ============================================

-- Bước 1: Xóa Change Request History
DELETE FROM change_request_history 
WHERE change_request_id IN (
    SELECT id FROM change_requests 
    WHERE sow_contract_id IN (
        SELECT id FROM sow_contracts WHERE engagement_type = 'Retainer'
    )
);

-- Bước 2: Xóa Change Request Attachments
DELETE FROM change_request_attachments 
WHERE change_request_id IN (
    SELECT id FROM change_requests 
    WHERE sow_contract_id IN (
        SELECT id FROM sow_contracts WHERE engagement_type = 'Retainer'
    )
);

-- Bước 3: Xóa Change Request Engaged Engineers
DELETE FROM change_request_engaged_engineers 
WHERE change_request_id IN (
    SELECT id FROM change_requests 
    WHERE sow_contract_id IN (
        SELECT id FROM sow_contracts WHERE engagement_type = 'Retainer'
    )
);

-- Bước 4: Xóa Change Request Billing Details
DELETE FROM change_request_billing_details 
WHERE change_request_id IN (
    SELECT id FROM change_requests 
    WHERE sow_contract_id IN (
        SELECT id FROM sow_contracts WHERE engagement_type = 'Retainer'
    )
);

-- Bước 5: Xóa Change Requests
DELETE FROM change_requests 
WHERE sow_contract_id IN (
    SELECT id FROM sow_contracts WHERE engagement_type = 'Retainer'
);

-- Bước 6: Xóa Contract Internal Review
DELETE FROM contract_internal_review 
WHERE sow_contract_id IN (
    SELECT id FROM sow_contracts WHERE engagement_type = 'Retainer'
)
AND contract_type = 'SOW';

-- Bước 7: Xóa Contract History
DELETE FROM contract_history 
WHERE sow_contract_id IN (
    SELECT id FROM sow_contracts WHERE engagement_type = 'Retainer'
);

-- Bước 8: Xóa SOW Engaged Engineers
DELETE FROM sow_engaged_engineers 
WHERE sow_contract_id IN (
    SELECT id FROM sow_contracts WHERE engagement_type = 'Retainer'
);

-- Bước 9: Xóa Retainer Billing Details
DELETE FROM retainer_billing_details 
WHERE sow_contract_id IN (
    SELECT id FROM sow_contracts WHERE engagement_type = 'Retainer'
);

-- Bước 10: Xóa Delivery Items
DELETE FROM delivery_items 
WHERE sow_contract_id IN (
    SELECT id FROM sow_contracts WHERE engagement_type = 'Retainer'
);

-- Bước 11: Xóa các SOW Contract versions (nếu có)
DELETE FROM sow_contracts 
WHERE parent_version_id IN (
    SELECT id FROM sow_contracts WHERE engagement_type = 'Retainer'
);

-- Bước 12: Xóa SOW Contracts chính
DELETE FROM sow_contracts 
WHERE engagement_type = 'Retainer';
```

## Kiểm tra trước khi xóa

Trước khi xóa, nên kiểm tra xem có bao nhiêu records sẽ bị xóa:

```sql
SET @sow_contract_id = :sow_contract_id;

SELECT 
    'change_request_history' AS table_name,
    COUNT(*) AS record_count
FROM change_request_history 
WHERE change_request_id IN (
    SELECT id FROM change_requests WHERE sow_contract_id = @sow_contract_id
)
UNION ALL
SELECT 'change_request_attachments', COUNT(*)
FROM change_request_attachments 
WHERE change_request_id IN (
    SELECT id FROM change_requests WHERE sow_contract_id = @sow_contract_id
)
UNION ALL
SELECT 'change_request_engaged_engineers', COUNT(*)
FROM change_request_engaged_engineers 
WHERE change_request_id IN (
    SELECT id FROM change_requests WHERE sow_contract_id = @sow_contract_id
)
UNION ALL
SELECT 'change_request_billing_details', COUNT(*)
FROM change_request_billing_details 
WHERE change_request_id IN (
    SELECT id FROM change_requests WHERE sow_contract_id = @sow_contract_id
)
UNION ALL
SELECT 'change_requests', COUNT(*)
FROM change_requests 
WHERE sow_contract_id = @sow_contract_id
UNION ALL
SELECT 'contract_internal_review', COUNT(*)
FROM contract_internal_review 
WHERE sow_contract_id = @sow_contract_id AND contract_type = 'SOW'
UNION ALL
SELECT 'contract_history', COUNT(*)
FROM contract_history 
WHERE sow_contract_id = @sow_contract_id
UNION ALL
SELECT 'sow_engaged_engineers', COUNT(*)
FROM sow_engaged_engineers 
WHERE sow_contract_id = @sow_contract_id
UNION ALL
SELECT 'retainer_billing_details', COUNT(*)
FROM retainer_billing_details 
WHERE sow_contract_id = @sow_contract_id
UNION ALL
SELECT 'delivery_items', COUNT(*)
FROM delivery_items 
WHERE sow_contract_id = @sow_contract_id
UNION ALL
SELECT 'sow_contracts (versions)', COUNT(*)
FROM sow_contracts 
WHERE id = @sow_contract_id OR parent_version_id = @sow_contract_id;
```

## Sơ đồ thứ tự xóa

```
Level 1 (Bảng con của Change Request):
  ├── change_request_history
  ├── change_request_attachments
  ├── change_request_engaged_engineers
  └── change_request_billing_details

Level 2:
  └── change_requests

Level 3 (Bảng con của SOW Contract):
  ├── contract_internal_review
  ├── contract_history
  ├── sow_engaged_engineers
  ├── retainer_billing_details
  └── delivery_items

Level 4:
  └── sow_contracts (versions nếu có)

Level 5:
  └── sow_contracts (chính)
```

## Lỗi thường gặp và cách xử lý

### Lỗi: "Cannot delete or update a parent row: a foreign key constraint fails"

**Nguyên nhân**: Đang cố xóa bảng cha trước khi xóa bảng con.

**Giải pháp**: Xóa theo đúng thứ tự từ bảng con đến bảng cha như hướng dẫn trên.

### Lỗi: "Unknown column 'sow_contract_id'"

**Nguyên nhân**: Bảng chưa có cột `sow_contract_id` (có thể đang dùng tên cột cũ).

**Giải pháp**: Kiểm tra tên cột thực tế trong database:
```sql
SHOW COLUMNS FROM table_name;
```

### Lỗi: "Table doesn't exist"

**Nguyên nhân**: Bảng chưa được tạo hoặc đã bị xóa.

**Giải pháp**: Kiểm tra xem bảng có tồn tại không:
```sql
SHOW TABLES LIKE 'table_name';
```

## Best Practices

1. **Luôn backup trước khi xóa**: 
   ```sql
   mysqldump -u username -p database_name > backup_before_delete.sql
   ```

2. **Sử dụng Transaction**: 
   ```sql
   START TRANSACTION;
   -- Các câu lệnh DELETE
   -- Kiểm tra kết quả
   COMMIT; -- hoặc ROLLBACK nếu có lỗi
   ```

3. **Xóa từng bước và kiểm tra**: Không xóa tất cả cùng lúc, xóa từng bước và kiểm tra kết quả.

4. **Log lại các thao tác**: Ghi lại các câu lệnh đã chạy để có thể rollback nếu cần.

5. **Test trên môi trường test trước**: Luôn test script trên môi trường test trước khi chạy trên môi trường development.

## Tài liệu tham khảo

- Database Schema: `backend/src/main/resources/db/migration/`
- Foreign Key Constraints: Xem các file migration V17, V19, V20, V21, V33, V38

