# Môi Trường STG - SkillBridge

## Tổng Quan

Môi trường STG (Staging) được cấu hình để test trước khi deploy lên production.

**Domain**: https://dev-skillbridge.inisoft.vn

## Cấu Trúc Files

```
├── docker-compose.stg.yml          # Docker Compose config cho STG
├── backend/src/main/resources/
│   └── application-stg.yml         # Backend config cho STG
├── nginx/
│   └── nginx.stg.conf              # Nginx reverse proxy config
├── scripts/
│   ├── deploy-stg.ps1              # Script deploy tự động
│   ├── stop-stg.ps1                # Script dừng services
│   ├── restart-stg.ps1              # Script restart services
│   └── generate-ssl-cert.ps1       # Script tạo SSL certificate
└── DEPLOY-STG-GUIDE.md             # Hướng dẫn chi tiết deploy
```

## Quick Start

### 1. Cấu hình Environment Variables

Tạo file `.env.stg`:
```powershell
MYSQL_ROOT_PASSWORD=your_secure_root_password
MYSQL_PASSWORD=your_secure_db_password
DB_USERNAME=skillbridge_stg
DB_PASSWORD=your_secure_db_password
```

### 3. Deploy

**Cách 1: Sử dụng script tự động**
```powershell
.\scripts\deploy-stg.ps1
```

**Cách 2: Deploy thủ công**
```powershell
# Build images
docker-compose -f docker-compose.stg.yml build

# Start services
docker-compose -f docker-compose.stg.yml up -d

# Check status
docker-compose -f docker-compose.stg.yml ps
```

## Services

- **Frontend**: http://localhost:3000
- **Backend API**: https://api.skill-bridge.dev.inisoft.vn/
- **phpMyAdmin**: http://localhost:8080
- **MySQL**: localhost:3308

## Quản Lý Services

```powershell
# Xem logs
docker-compose -f docker-compose.stg.yml logs -f

# Dừng services
.\scripts\stop-stg.ps1
# hoặc
docker-compose -f docker-compose.stg.yml down

# Restart services
.\scripts\restart-stg.ps1
# hoặc
docker-compose -f docker-compose.stg.yml restart

# Rebuild và restart
docker-compose -f docker-compose.stg.yml up -d --build
```

## Health Checks

```powershell
# Nginx health
curl http://localhost/health

# Backend health (external URL)
curl https://api.skill-bridge.dev.inisoft.vn/actuator/health

# Backend health (internal check)
curl http://localhost:8082/api/actuator/health

# Frontend
curl http://localhost:3002
```

## Backup Database

```powershell
# Backup
docker exec skillbridge-mysql-stg mysqldump -u skillbridge_stg -p skillbridge_stg > backup_$(Get-Date -Format "yyyyMMdd_HHmmss").sql

# Restore
docker exec -i skillbridge-mysql-stg mysql -u skillbridge_stg -p skillbridge_stg < backup_file.sql
```

## Troubleshooting

Xem file [DEPLOY-STG-GUIDE.md](./DEPLOY-STG-GUIDE.md) để biết hướng dẫn chi tiết và troubleshooting.

## Lưu Ý

- ⚠️ Đây là môi trường STG, không sử dụng dữ liệu production thật
- 🔒 Luôn thay đổi mật khẩu mặc định
- 📋 Backup database trước khi thực hiện thay đổi lớn
- 🌐 Môi trường STG chỉ truy cập từ localhost, không có Nginx reverse proxy

