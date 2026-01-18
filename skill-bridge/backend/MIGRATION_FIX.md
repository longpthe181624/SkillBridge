# Fix Migration V10 - Proposals Table

## Vấn đề
Migration V10 không chạy trong Docker, bảng `proposals` không được tạo.

## Giải pháp

### 1. Rebuild Docker Image
Vì migration file mới được thêm vào, cần rebuild Docker image để include file mới:

```bash
# Stop containers
docker-compose down

# Rebuild backend image (force rebuild)
docker-compose build --no-cache backend

# Start containers
docker-compose up -d

# Check logs
docker-compose logs backend | grep -i flyway
```

### 2. Kiểm tra Flyway Logs
Kiểm tra xem migration có được chạy không:

```bash
# Check backend logs
docker-compose logs backend | grep -i "V10"

# Hoặc check Flyway schema history trong database
docker exec -it skillbridge-mysql mysql -uroot -prootpassword -e "USE skillbridge_db; SELECT * FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 5;"
```

### 3. Manual Migration (nếu cần)
Nếu migration vẫn không chạy, có thể chạy manual:

```bash
# Connect to MySQL
docker exec -it skillbridge-mysql mysql -uroot -prootpassword skillbridge_db

# Run migration manually
SOURCE /path/to/V10__create_proposals_table.sql;

# Hoặc copy SQL và paste vào MySQL console
```

### 4. Kiểm tra bảng đã được tạo
```bash
docker exec -it skillbridge-mysql mysql -uroot -prootpassword -e "USE skillbridge_db; SHOW TABLES LIKE 'proposals';"
```

## Notes
- Flyway tự quản lý việc chạy migrations, không cần check table exists
- Migration file đã được đơn giản hóa, chỉ dùng CREATE TABLE
- Đảm bảo rebuild Docker image sau khi thêm migration mới

