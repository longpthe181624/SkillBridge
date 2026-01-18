# Fix Frontend Dependencies trong Docker

## Vấn đề:
Khi thêm package mới vào `package.json`, Docker container frontend có thể không có package đó vì `node_modules` được mount riêng.

## Giải pháp:

### Cách 1: Rebuild container (Khuyến nghị)
```powershell
docker-compose -f docker-compose.dev.yml up -d --build frontend
```

### Cách 2: Install trong container đang chạy
```powershell
# Vào container
docker exec -it skillbridge-frontend-dev sh

# Install package
npm install

# Thoát container
exit
```

### Cách 3: Restart container
```powershell
docker-compose -f docker-compose.dev.yml restart frontend
```

## Lưu ý:
- Volume mount `/app/node_modules` giữ node_modules trong container riêng
- Khi thêm package mới, luôn rebuild container để đảm bảo dependencies được cài đúng

