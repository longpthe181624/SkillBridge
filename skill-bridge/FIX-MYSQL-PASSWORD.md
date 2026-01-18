# Fix MySQL Password - dev_password123

## Vấn đề
Bạn đang cố kết nối DataGrip với password `dev_password123` nhưng MySQL user đang được cấu hình với password cũ `skillbridge_dev_password`.

## Giải pháp

### Bước 1: Update password trong MySQL (Nếu container đã chạy)

Chạy script sau để update password cho user `skillbridge_dev`:

```bash
# Chạy script tự động
bash database/update_password.sh

# Hoặc chạy thủ công
docker exec -i skillbridge-mysql-dev mysql -uroot -prootpassword <<EOF
ALTER USER 'skillbridge_dev'@'%' IDENTIFIED BY 'dev_password123';
ALTER USER 'skillbridge_dev'@'localhost' IDENTIFIED BY 'dev_password123';
GRANT ALL PRIVILEGES ON skillbridge_dev.* TO 'skillbridge_dev'@'%';
GRANT ALL PRIVILEGES ON skillbridge_dev.* TO 'skillbridge_dev'@'localhost';
FLUSH PRIVILEGES;
EOF
```

### Bước 2: Restart containers (Nếu cần)

Nếu bạn muốn đảm bảo mọi thứ đồng bộ, restart MySQL container:

```bash
# Restart MySQL container
docker-compose -f docker-compose.dev.yml restart mysql

# Hoặc restart tất cả
docker-compose -f docker-compose.dev.yml restart
```

### Bước 3: Test connection trong DataGrip

Sau khi chạy script, test lại connection trong DataGrip:

1. **Data Source:** SkillBridgeLocal
2. **Host:** localhost
3. **Port:** 3307
4. **Database:** skillbridge_dev
5. **User:** skillbridge_dev
6. **Password:** dev_password123

Click **Test Connection** - Nếu thành công, bạn sẽ thấy "Successful".

## Files đã được cập nhật

Các file sau đã được cập nhật để dùng password `dev_password123`:

- ✅ `docker-compose.dev.yml` - MYSQL_PASSWORD và SPRING_DATASOURCE_PASSWORD
- ✅ `backend/src/main/resources/application-dev.yml` - datasource password
- ✅ `database/grant_permissions.sh` - script grant permissions
- ✅ `database/update_password.sh` - script update password mới
- ✅ `database/fix_mysql_permissions.sql` - SQL file

## Verify Password Update

Để verify password đã được update:

```bash
# Test connection với password mới
docker exec -it skillbridge-mysql-dev mysql -uskillbridge_dev -pdev_password123 skillbridge_dev -e "SELECT 'Connection successful!' as Status;"
```

Nếu command trên thành công (không có lỗi), password đã được update đúng.

## Troubleshooting

### Lỗi: "Access denied" sau khi update password

1. **Kiểm tra user có tồn tại:**
   ```bash
   docker exec -it skillbridge-mysql-dev mysql -uroot -prootpassword -e "SELECT user, host FROM mysql.user WHERE user='skillbridge_dev';"
   ```

2. **Kiểm tra grants:**
   ```bash
   docker exec -it skillbridge-mysql-dev mysql -uroot -prootpassword -e "SHOW GRANTS FOR 'skillbridge_dev'@'%';"
   ```

3. **Re-run update script nếu cần:**
   ```bash
   bash database/update_password.sh
   ```

### Lỗi: Backend không kết nối được database

Nếu backend không kết nối được sau khi đổi password:

1. **Restart backend:**
   ```bash
   docker-compose -f docker-compose.dev.yml restart backend
   ```

2. **Check backend logs:**
   ```bash
   docker logs -f skillbridge-backend-dev
   ```

3. **Verify backend config:** Đảm bảo `application-dev.yml` có password đúng: `dev_password123`

## Lưu ý

- Password mới: `dev_password123`
- User: `skillbridge_dev`
- Database: `skillbridge_dev`
- Port: `3307` (host) / `3306` (container)
- Root password vẫn là: `rootpassword` (không đổi)

