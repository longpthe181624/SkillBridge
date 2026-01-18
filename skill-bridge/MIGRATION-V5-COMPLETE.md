# Migration V5 - Complete

## ✅ Migration V5 đã được áp dụng thành công!

### Các bảng đã được tạo/cập nhật:

1. **users** - Bảng users mới
2. **contacts** - Đã thêm các cột:
   - `assignee_user_id`
   - `reviewer_id`
   - `title`
   - `description`
   - `request_type`
   - `priority`
   - `internal_note`
   - `online_mtg_link`
   - `online_mtg_date`
   - `communication_progress`
   - `created_by`
   - `updated_at`
3. **contact_status_history** - Bảng lịch sử thay đổi status
4. **contact_communication_logs** - Bảng log giao tiếp
5. **email_templates** - Bảng email templates

### Verify Migration:

Để kiểm tra migration đã hoàn tất:

```bash
# Xem structure của bảng contacts
docker exec -it skillbridge-mysql-dev mysql -uskillbridge_dev -pdev_password123 skillbridge_dev -e "DESCRIBE contacts;"

# Xem các bảng đã được tạo
docker exec -it skillbridge-mysql-dev mysql -uskillbridge_dev -pdev_password123 skillbridge_dev -e "SHOW TABLES;"

# Xem Flyway migration history
docker exec -it skillbridge-mysql-dev mysql -uskillbridge_dev -pdev_password123 skillbridge_dev -e "SELECT version, description, installed_on, success FROM flyway_schema_history ORDER BY installed_rank;"
```

### Cấu trúc bảng contacts hiện tại:

| Column | Type | Null | Default |
|--------|------|------|---------|
| id | INT | NO | AUTO_INCREMENT |
| client_user_id | INT | YES | NULL |
| assignee_user_id | INT | YES | NULL |
| reviewer_id | INT | YES | NULL |
| title | VARCHAR(255) | YES | NULL |
| description | TEXT | YES | NULL |
| status | VARCHAR(32) | YES | 'New' |
| request_type | VARCHAR(32) | YES | NULL |
| priority | VARCHAR(32) | YES | 'Medium' |
| internal_note | TEXT | YES | NULL |
| online_mtg_link | VARCHAR(255) | YES | NULL |
| online_mtg_date | TIMESTAMP | YES | NULL |
| communication_progress | VARCHAR(32) | YES | 'AutoReply' |
| created_by | INT | YES | NULL |
| created_at | TIMESTAMP | YES | CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | YES | CURRENT_TIMESTAMP |

### Email Templates đã được insert:

1. **contact_confirmation** - Template xác nhận contact request
2. **sales_notification** - Template thông báo cho sales manager

### Lưu ý:

- Migration V5 đã được đánh dấu hoàn tất trong Flyway schema history
- Tất cả các cột đã được thêm vào bảng `contacts`
- Các bảng hỗ trợ đã được tạo thành công
- Email templates đã được insert sẵn

### Restart Backend:

Sau khi migration hoàn tất, restart backend để đảm bảo ứng dụng nhận diện được schema mới:

```bash
docker-compose -f docker-compose.dev.yml restart backend
```

Hoặc rebuild nếu cần:

```bash
docker-compose -f docker-compose.dev.yml up --build -d backend
```

