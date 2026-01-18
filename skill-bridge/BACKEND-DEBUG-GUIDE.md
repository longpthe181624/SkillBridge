# Backend Debug Guide

## Vấn đề: Backend không hoạt động

### Các bước kiểm tra và sửa lỗi:

#### 1. Kiểm tra Docker Logs
```bash
# Xem logs của backend container
docker logs skillbridge-backend-dev

# Xem logs real-time
docker logs -f skillbridge-backend-dev
```

#### 2. Kiểm tra Migration Status
```bash
# Vào container backend
docker exec -it skillbridge-backend-dev bash

# Kiểm tra Flyway status (nếu có Flyway CLI)
# Hoặc kiểm tra logs để xem migration errors
```

#### 3. Vấn đề thường gặp với Migration V5

**Lỗi:** Foreign key constraint fails
**Nguyên nhân:** Bảng `contacts` có dữ liệu nhưng bảng `users` chưa có dữ liệu tương ứng

**Giải pháp:**
```sql
-- Kết nối vào MySQL
mysql -h localhost -P 3307 -u skillbridge_dev -pskillbridge_dev_password skillbridge_dev

-- Xóa dữ liệu cũ trong contacts nếu cần
DELETE FROM contacts;

-- Hoặc set NULL cho các foreign key columns
UPDATE contacts SET client_user_id = NULL WHERE client_user_id IS NOT NULL;
```

#### 4. Sửa lỗi Migration nếu cần

Nếu migration V5 fail, có thể cần repair:
```bash
# Vào MySQL và repair Flyway
docker exec -it skillbridge-mysql-dev mysql -u skillbridge_dev -pskillbridge_dev_password skillbridge_dev

# Xem Flyway schema history
SELECT * FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 5;

# Nếu cần, xóa migration V5 failed
DELETE FROM flyway_schema_history WHERE version = '5';
```

#### 5. Restart Backend
```bash
# Restart backend container
docker-compose -f docker-compose.dev.yml restart backend

# Hoặc rebuild nếu cần
docker-compose -f docker-compose.dev.yml up --build backend
```

#### 6. Kiểm tra Database Connection

**Lỗi:** Cannot connect to database
**Kiểm tra:**
- Database container đang chạy: `docker ps | grep mysql`
- Database credentials đúng trong `application-dev.yml`
- Port mapping đúng: `3307:3306`

#### 7. Kiểm tra Health Endpoint

```bash
# Test health endpoint
curl http://localhost:8081/api/actuator/health

# Expected response: {"status":"UP"}
```

#### 8. Kiểm tra Application Logs

Tìm các lỗi trong logs:
- `FlywayException`: Migration errors
- `SQLException`: Database connection errors
- `BeanCreationException`: Spring Bean errors
- `ClassNotFoundException`: Missing dependencies

### Common Issues & Solutions

#### Issue 1: Migration V5 fails with foreign key error
**Solution:** Migration đã được sửa để clean up orphaned data trước khi add foreign keys. Nếu vẫn lỗi, xóa dữ liệu cũ:
```sql
DELETE FROM contacts;
```

#### Issue 2: Backend starts but API not responding
**Check:**
- Port mapping: Backend chạy ở port 8080 trong container, mapped ra 8081
- Context path: `/api` - URL phải là `http://localhost:8081/api/...`
- Security config: Đảm bảo `/public/**` và `/actuator/**` được permit

#### Issue 3: Database connection timeout
**Solution:**
- Đảm bảo MySQL container đã start xong trước khi backend start
- Kiểm tra `depends_on` trong docker-compose
- Wait for database: Có thể cần thêm health check

#### Issue 4: JPA validation fails
**Solution:**
- Check `ddl-auto: validate` - entities phải match với database schema
- Xem migration V5 đã chạy thành công chưa
- Kiểm tra entity mappings với `@Column` annotations

### Quick Fix Commands

```bash
# Stop all containers
docker-compose -f docker-compose.dev.yml down

# Remove volumes (⚠️ CAUTION: This deletes database data)
docker-compose -f docker-compose.dev.yml down -v

# Rebuild and start
docker-compose -f docker-compose.dev.yml up --build

# Check backend logs specifically
docker logs -f skillbridge-backend-dev 2>&1 | grep -i error
```

### Verify Backend is Working

```bash
# Test health endpoint
curl http://localhost:8081/api/actuator/health

# Test public homepage endpoint
curl http://localhost:8081/api/public/homepage/statistics

# Test engineers endpoint
curl http://localhost:8081/api/public/engineers/search
```

Nếu các endpoint trên trả về dữ liệu, backend đã hoạt động đúng!

