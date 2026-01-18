# DataGrip MySQL Setup Guide

## Vấn đề: User không có quyền truy cập MySQL trong DataGrip

### Giải pháp nhanh:

#### Cách 1: Chạy script tự động (Khuyên dùng)

```bash
# Windows (Git Bash hoặc WSL)
chmod +x database/grant_permissions.sh
bash database/grant_permissions.sh

# Hoặc trên Windows PowerShell
docker exec -i skillbridge-mysql-dev mysql -uroot -prootpassword -e "GRANT ALL PRIVILEGES ON skillbridge_dev.* TO 'skillbridge_dev'@'%'; GRANT ALL PRIVILEGES ON skillbridge_dev.* TO 'skillbridge_dev'@'localhost'; FLUSH PRIVILEGES;"
```

#### Cách 2: Chạy SQL thủ công

1. **Kết nối vào MySQL container:**
   ```bash
   docker exec -it skillbridge-mysql-dev mysql -uroot -prootpassword
   ```

2. **Chạy các lệnh SQL sau:**
   ```sql
   -- Grant permissions cho skillbridge_dev user
   GRANT ALL PRIVILEGES ON skillbridge_dev.* TO 'skillbridge_dev'@'%';
   GRANT ALL PRIVILEGES ON skillbridge_dev.* TO 'skillbridge_dev'@'localhost';
   
   -- Grant permissions cho root user (nếu muốn dùng root)
   GRANT ALL PRIVILEGES ON skillbridge_dev.* TO 'root'@'%' IDENTIFIED BY 'rootpassword';
   
   -- Apply changes
   FLUSH PRIVILEGES;
   
   -- Verify
   SHOW GRANTS FOR 'skillbridge_dev'@'%';
   ```

3. **Thoát khỏi MySQL:**
   ```sql
   EXIT;
   ```

### Cấu hình DataGrip:

1. **Tạo Data Source mới:**
   - Click **+** → **Data Source** → **MySQL**
   
2. **Nhập thông tin kết nối:**
   ```
   Host: localhost
   Port: 3307
   Database: skillbridge_dev
   User: skillbridge_dev
   Password: skillbridge_dev_password
   ```

3. **Hoặc dùng root user:**
   ```
   Host: localhost
   Port: 3307
   Database: skillbridge_dev
   User: root
   Password: rootpassword
   ```

4. **Test Connection:**
   - Click **Test Connection** để kiểm tra
   - Nếu thành công, bạn sẽ thấy thông báo "Successful"
   - Click **OK** để lưu

### Thông tin kết nối:

| Thông tin | Giá trị |
|-----------|---------|
| **Host** | `localhost` |
| **Port** | `3307` |
| **Database** | `skillbridge_dev` |
| **User** | `skillbridge_dev` hoặc `root` |
| **Password** | `skillbridge_dev_password` hoặc `rootpassword` |

### Troubleshooting:

#### Lỗi: "Access denied for user"
- **Giải pháp:** Chạy lại script grant permissions ở trên
- Đảm bảo user đã được grant quyền từ `'%'` (any host)

#### Lỗi: "Connection refused"
- **Kiểm tra:** Container MySQL có đang chạy không
  ```bash
  docker ps | grep mysql
  ```
- **Restart container nếu cần:**
  ```bash
  docker-compose -f docker-compose.dev.yml restart mysql
  ```

#### Lỗi: "Unknown database"
- **Kiểm tra:** Database có tồn tại không
  ```bash
  docker exec -it skillbridge-mysql-dev mysql -uroot -prootpassword -e "SHOW DATABASES;"
  ```
- **Tạo database nếu cần:**
  ```bash
  docker exec -it skillbridge-mysql-dev mysql -uroot -prootpassword -e "CREATE DATABASE IF NOT EXISTS skillbridge_dev;"
  ```

### Verify Permissions:

Sau khi chạy script, verify permissions bằng:

```bash
docker exec -it skillbridge-mysql-dev mysql -uroot -prootpassword -e "SHOW GRANTS FOR 'skillbridge_dev'@'%';"
```

Bạn sẽ thấy output tương tự:
```
+---------------------------------------------------------------------------+
| Grants for skillbridge_dev@%                                             |
+---------------------------------------------------------------------------+
| GRANT USAGE ON *.* TO `skillbridge_dev`@`%`                              |
| GRANT ALL PRIVILEGES ON `skillbridge_dev`.* TO `skillbridge_dev`@`%`    |
+---------------------------------------------------------------------------+
```

### Lưu ý:

- Port **3307** là port mapping từ container (3306) ra host
- User `skillbridge_dev` chỉ có quyền trên database `skillbridge_dev`
- User `root` có toàn quyền trên tất cả databases
- Sau khi grant permissions, cần `FLUSH PRIVILEGES` để apply changes

