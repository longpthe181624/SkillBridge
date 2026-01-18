# Hướng Dẫn Deploy Môi Trường STG - SkillBridge

## Thông Tin Môi Trường

- **OS**: Windows Server
- **CPU**: 6 cores
- **Memory**: 8GB RAM
- **SSD**: 128GB
- **Domain**: https://api.skill-bridge.dev.inisoft.vn

## Yêu Cầu Hệ Thống

### Phần Mềm Cần Cài Đặt

1. **Docker Desktop for Windows** hoặc **Docker Engine**
   - Download từ: https://www.docker.com/products/docker-desktop
   - Yêu cầu: Windows 10/11 hoặc Windows Server 2016 trở lên

2. **Docker Compose** (thường đi kèm với Docker Desktop)
   - Kiểm tra: `docker-compose --version`

3. **Git** (nếu chưa có)
   - Download từ: https://git-scm.com/download/win

## Bước 1: Chuẩn Bị Môi Trường

### 1.1. Cài Đặt Docker

```powershell
# Kiểm tra Docker đã cài đặt chưa
docker --version
docker-compose --version

# Nếu chưa có, cài đặt Docker Desktop for Windows
# Sau khi cài đặt, khởi động lại máy nếu cần
```

### 1.2. Clone Repository (nếu chưa có)

```powershell
# Nếu chưa có code, clone repository
git clone <repository-url>
cd skill-bridge-new
```

### 1.3. Cấu Hình Môi Trường

Môi trường STG không sử dụng Nginx reverse proxy, các services sẽ expose trực tiếp:
- Frontend: http://localhost:3000
- Backend API: https://api.skill-bridge.dev.inisoft.vn/

### 1.4. Tạo File Environment Variables (Tùy chọn)

Tạo file `.env.stg` trong thư mục gốc để quản lý các biến môi trường:

```powershell
# .env.stg
MYSQL_ROOT_PASSWORD=your_secure_root_password
MYSQL_PASSWORD=your_secure_db_password
DB_USERNAME=skillbridge_stg
DB_PASSWORD=your_secure_db_password
```

## Bước 2: Cấu Hình

### 2.1. Cập Nhật Mật Khẩu Database

Mở file `docker-compose.stg.yml` và cập nhật các mật khẩu:

```yaml
environment:
  MYSQL_ROOT_PASSWORD: your_secure_root_password
  MYSQL_PASSWORD: your_secure_db_password
```

Hoặc sử dụng file `.env.stg` như đã hướng dẫn ở trên.

### 2.2. Kiểm Tra Cấu Hình Ports

Kiểm tra các ports đã được expose đúng:
- Frontend: Port 3000
- Backend: Port 8082
- phpMyAdmin: Port 8080
- MySQL: Port 3308

### 2.3. Cập Nhật Cấu Hình Backend

File `backend/src/main/resources/application-stg.yml` đã được cấu hình sẵn với:
- Database: `skillbridge_stg`
- Base URL: `https://api.skill-bridge.dev.inisoft.vn`

### 2.4. Cấu Hình Frontend API URL

Frontend sử dụng biến môi trường `NEXT_PUBLIC_API_URL` được set trong `docker-compose.stg.yml`:
- API URL: `https://api.skill-bridge.dev.inisoft.vn/`

**Lưu ý quan trọng**: Biến `NEXT_PUBLIC_API_URL` phải được set trong build args của Dockerfile vì Next.js biên dịch các biến này tại build time, không phải runtime.

## Bước 3: Build và Deploy

### 3.1. Build Docker Images

```powershell
# Build tất cả images (quan trọng: phải build lại để áp dụng NEXT_PUBLIC_API_URL)
docker-compose -f docker-compose.stg.yml build --no-cache frontend

# Hoặc build tất cả
docker-compose -f docker-compose.stg.yml build
```

**⚠️ Lưu ý**: Phải build lại frontend image để biến môi trường `NEXT_PUBLIC_API_URL` được áp dụng vào code. Nếu chỉ restart container, URL sẽ không thay đổi.

### 3.2. Khởi Động Services

```powershell
# Khởi động tất cả services
docker-compose -f docker-compose.stg.yml up -d

# Kiểm tra trạng thái
docker-compose -f docker-compose.stg.yml ps
```

### 3.3. Kiểm Tra Logs

```powershell
# Xem logs của tất cả services
docker-compose -f docker-compose.stg.yml logs -f

# Xem logs của từng service
docker-compose -f docker-compose.stg.yml logs -f backend
docker-compose -f docker-compose.stg.yml logs -f frontend
docker-compose -f docker-compose.stg.yml logs -f mysql
docker-compose -f docker-compose.stg.yml logs -f phpmyadmin
```

## Bước 4: Kiểm Tra Kết Nối

### 4.1. Kiểm Tra Health Check

```powershell
# Health check endpoint
curl http://localhost/health

# Backend health (internal check)
curl http://localhost:8082/api/actuator/health

# Backend health (external URL)
curl https://api.skill-bridge.dev.inisoft.vn/actuator/health

# Frontend
curl http://localhost:3000
```

### 4.2. Kiểm Tra Database

**Cách 1: Sử dụng phpMyAdmin (Khuyến nghị)**
- Truy cập: http://localhost:8080
- Username: `root` hoặc `skillbridge_stg`
- Password: `rootpassword` hoặc `dev_password123`

**Cách 2: Sử dụng MySQL CLI**

```powershell
# Kết nối vào MySQL container
docker exec -it skillbridge-mysql-stg mysql -u skillbridge_stg -p

# Hoặc từ host
mysql -h localhost -P 3308 -u skillbridge_stg -p
```

### 4.3. Kiểm Tra Website

Mở trình duyệt và truy cập:
- Frontend: http://localhost:3000
- Backend API: https://api.skill-bridge.dev.inisoft.vn/
- phpMyAdmin: http://localhost:8080

### 4.4. Kiểm Tra API URL trong Frontend

Để kiểm tra frontend có sử dụng đúng API URL không:

1. Mở trình duyệt và truy cập http://localhost:3000
2. Mở Developer Tools (F12)
3. Vào tab Console
4. Kiểm tra network requests - tất cả API calls phải đến `https://api.skill-bridge.dev.inisoft.vn/api/...`

Hoặc thêm biến môi trường debug:

```yaml
# Trong docker-compose.stg.yml, thêm vào frontend environment:
NEXT_PUBLIC_DEBUG_API_URL: "true"
```

Sau đó rebuild và kiểm tra console logs.

## Bước 5: Cấu Hình Firewall và Network

### 5.1. Mở Ports trên Windows Firewall (Tùy chọn)

Nếu cần truy cập từ máy khác trong mạng, mở các ports:

```powershell
# Mở port 3000 (Frontend)
New-NetFirewallRule -DisplayName "Frontend STG" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow

# Mở port 8082 (Backend)
New-NetFirewallRule -DisplayName "Backend STG" -Direction Inbound -LocalPort 8082 -Protocol TCP -Action Allow

# Mở port 8080 (phpMyAdmin)
New-NetFirewallRule -DisplayName "phpMyAdmin STG" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow
```

**Lưu ý**: Môi trường STG chỉ truy cập localhost, không cần cấu hình DNS.

## Bước 6: Các Lệnh Quản Lý Thường Dùng

### 6.1. Dừng Services

```powershell
# Dừng tất cả services
docker-compose -f docker-compose.stg.yml stop

# Dừng và xóa containers
docker-compose -f docker-compose.stg.yml down
```

### 6.2. Khởi Động Lại Services

```powershell
# Khởi động lại tất cả
docker-compose -f docker-compose.stg.yml restart

# Khởi động lại một service cụ thể
docker-compose -f docker-compose.stg.yml restart backend
```

### 6.3. Cập Nhật Code

```powershell
# Pull code mới nhất
git pull

# Rebuild và restart (QUAN TRỌNG: phải rebuild để áp dụng thay đổi)
docker-compose -f docker-compose.stg.yml up -d --build

# Hoặc rebuild từng service
docker-compose -f docker-compose.stg.yml build --no-cache frontend
docker-compose -f docker-compose.stg.yml up -d frontend
```

### 6.4. Xem Resource Usage

```powershell
# Xem resource usage của containers
docker stats

# Xem chi tiết một container
docker stats skillbridge-backend-stg
```

## Bước 7: Backup và Restore

### 7.1. Backup Database

```powershell
# Backup database
docker exec skillbridge-mysql-stg mysqldump -u skillbridge_stg -p skillbridge_stg > backup_$(Get-Date -Format "yyyyMMdd_HHmmss").sql

# Hoặc với root user
docker exec skillbridge-mysql-stg mysqldump -u root -p skillbridge_stg > backup_$(Get-Date -Format "yyyyMMdd_HHmmss").sql
```

### 7.2. Restore Database

```powershell
# Restore database
docker exec -i skillbridge-mysql-stg mysql -u skillbridge_stg -p skillbridge_stg < backup_file.sql
```

## Bước 8: Monitoring và Troubleshooting

### 8.1. Kiểm Tra Logs Lỗi

```powershell
# Xem logs lỗi của backend
docker-compose -f docker-compose.stg.yml logs backend | Select-String "ERROR"

# Xem logs lỗi của frontend
docker-compose -f docker-compose.stg.yml logs frontend | Select-String "error"
```

### 8.2. Kiểm Tra Resource

```powershell
# Xem disk usage
docker system df

# Xem container resource usage
docker stats --no-stream
```

### 8.3. Cleanup

```powershell
# Xóa unused images và containers
docker system prune -a

# Xóa volumes không sử dụng (CẨN THẬN!)
docker volume prune
```

## Troubleshooting

### Vấn Đề: Container không khởi động

```powershell
# Kiểm tra logs
docker-compose -f docker-compose.stg.yml logs [service_name]

# Kiểm tra trạng thái
docker-compose -f docker-compose.stg.yml ps
```

### Vấn Đề: Database connection failed

```powershell
# Kiểm tra MySQL đã sẵn sàng chưa
docker exec skillbridge-mysql-stg mysqladmin ping -h localhost -u root -p

# Kiểm tra network
docker network inspect skillbridge-stg-network
```

### Vấn Đề: Frontend vẫn kết nối đến localhost:8080

**Nguyên nhân**: Next.js biên dịch `NEXT_PUBLIC_*` variables tại build time. Nếu chỉ restart container, URL sẽ không thay đổi.

**Giải pháp**:
```powershell
# Phải rebuild lại frontend image
docker-compose -f docker-compose.stg.yml build --no-cache frontend
docker-compose -f docker-compose.stg.yml up -d frontend

# Hoặc rebuild tất cả
docker-compose -f docker-compose.stg.yml up -d --build
```

### Vấn Đề: Port đã được sử dụng

```powershell
# Kiểm tra port đang được sử dụng
netstat -ano | findstr :3000
netstat -ano | findstr :8082

# Nếu port đã được sử dụng, thay đổi port trong docker-compose.stg.yml nếu cần
```

### Vấn Đề: API calls bị CORS error

Nếu frontend gọi API đến domain khác (https://api.skill-bridge.dev.inisoft.vn), cần đảm bảo backend đã cấu hình CORS đúng. Kiểm tra backend logs để xem có CORS errors không.

## Tối Ưu Hóa Cho Windows Server

### 1. Cấu Hình Docker Resources

Trong Docker Desktop Settings:
- **CPUs**: 4-5 cores (để lại 1-2 cores cho hệ thống)
- **Memory**: 6GB (để lại 2GB cho hệ thống)
- **Swap**: 2GB

### 2. Cấu Hình Java Heap Size

Đã được cấu hình trong `docker-compose.stg.yml`:
```yaml
JAVA_OPTS: "-Xms512m -Xmx2048m -XX:+UseG1GC"
```

### 3. MySQL Configuration

Đã được tối ưu trong `docker-compose.stg.yml`:
- `max_connections=200`
- `innodb_buffer_pool_size=2G`

## Security Checklist

- [ ] Đã thay đổi tất cả mật khẩu mặc định
- [ ] Firewall đã được cấu hình (nếu cần truy cập từ mạng ngoài)
- [ ] Database không expose ra ngoài (chỉ internal network)
- [ ] Đã cập nhật JWT secret key trong `application-stg.yml`
- [ ] Chỉ truy cập từ localhost (môi trường STG)
- [ ] Đã rebuild frontend sau khi thay đổi `NEXT_PUBLIC_API_URL`

## Liên Hệ Hỗ Trợ

Nếu gặp vấn đề trong quá trình deploy, vui lòng:
1. Kiểm tra logs: `docker-compose -f docker-compose.stg.yml logs`
2. Kiểm tra health checks
3. Review file này để đảm bảo đã làm đúng các bước
4. Đảm bảo đã rebuild frontend nếu thay đổi API URL

---

**Lưu ý**: Đây là môi trường STG, không nên sử dụng dữ liệu production thật. Luôn backup trước khi thực hiện các thay đổi lớn.
