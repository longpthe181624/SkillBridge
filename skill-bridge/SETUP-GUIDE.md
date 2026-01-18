# 🚀 Hướng dẫn Setup Môi trường SkillBridge

## 📋 Yêu cầu hệ thống

Trước khi chạy dự án, bạn cần cài đặt các công cụ sau:

### 1. Docker Desktop
- **Tải về**: https://www.docker.com/products/docker-desktop/
- **Yêu cầu**: Windows 10/11 với WSL2
- **Lưu ý**: Sau khi cài đặt, **phải khởi động Docker Desktop** trước khi chạy script

### 2. Java 17+
- **Tải về**: https://adoptium.net/
- **Kiểm tra**: Mở Command Prompt và gõ `java --version`
- **Yêu cầu**: Java 17 hoặc cao hơn

### 3. Node.js 18+
- **Tải về**: https://nodejs.org/
- **Kiểm tra**: Mở Command Prompt và gõ `node --version`
- **Yêu cầu**: Node.js 18 hoặc cao hơn

## 🎯 Cách chạy dự án

### Phương pháp 1: Sử dụng Script (Khuyến nghị)

1. **Clone code** từ repository
2. **Khởi động Docker Desktop** (quan trọng!)
3. **Chuột phải** vào file `start-dev.bat`
4. **Chọn "Run as administrator"**
5. **Đợi** script chạy xong (khoảng 2-3 phút)

### Phương pháp 2: Chạy thủ công

```bash
# 1. Khởi động database
docker-compose -f docker-compose.dev.yml up mysql -d

# 2. Chạy backend (terminal riêng)
cd backend
mvnw.cmd spring-boot:run

# 3. Chạy frontend (terminal riêng)
cd frontend
npm install
npm run dev
```

## 🌐 URLs truy cập

Sau khi chạy thành công:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Database**: localhost:3307
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html

## 🗄️ Thông tin Database

- **Host**: localhost:3307
- **Database**: skillbridge_dev
- **Username**: skillbridge_dev
- **Password**: skillbridge_dev_password

## ⚠️ Lưu ý quan trọng

1. **Docker Desktop phải được khởi động** trước khi chạy script
2. **Không cần cài Maven** - dự án sử dụng Maven Wrapper
3. **Port 3000, 8080, 3307** phải trống (không được sử dụng bởi ứng dụng khác)
4. **Đợi 2-3 phút** để tất cả services khởi động hoàn toàn

## 🔧 Troubleshooting

### Lỗi "Docker is not running"
- Khởi động Docker Desktop
- Đợi Docker khởi động hoàn toàn (icon Docker ở system tray)

### Lỗi "Java not found"
- Cài đặt Java 17+ từ https://adoptium.net/
- Restart Command Prompt sau khi cài đặt

### Lỗi "Node.js not found"
- Cài đặt Node.js 18+ từ https://nodejs.org/
- Restart Command Prompt sau khi cài đặt

### Port đã được sử dụng
- Đóng các ứng dụng đang sử dụng port 3000, 8080, 3307
- Hoặc thay đổi port trong file cấu hình

### Script không chạy được
- Chạy Command Prompt as Administrator
- Kiểm tra file `start-dev.bat` có tồn tại không
- Đảm bảo đang ở đúng thư mục gốc của dự án

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy:
1. Kiểm tra tất cả yêu cầu hệ thống
2. Đọc kỹ thông báo lỗi
3. Liên hệ team để được hỗ trợ
