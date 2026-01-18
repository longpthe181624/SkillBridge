# SkillBridge API - Postman Collection Guide

## 📋 Tổng quan

File `SkillBridge_Complete_API.postman_collection.json` chứa **toàn bộ 100+ API endpoints** của hệ thống SkillBridge, được tổ chức theo 6 module chính:

### Các Module:

1. **Authentication** (4 endpoints) - Login (Client & Sales), Logout, Forgot Password
2. **Public APIs** (9 endpoints) - Engineer Search, Contact Form, Homepage Statistics
3. **Sales - Contacts & Opportunities** (18 endpoints) - Quản lý contacts, opportunities, proposals
4. **Sales - MSA Contracts** (10+ endpoints) - Quản lý MSA contracts và change requests
5. **Sales - SOW Contracts** (15+ endpoints) - Quản lý SOW contracts và change requests (Fixed Price & Retainer)
6. **Client Portal** (50+ endpoints) - Contacts, Contracts, Proposals, Change Requests, Documents

## 🚀 Cách import vào Postman

### Bước 1: Mở Postman
Khởi động ứng dụng Postman trên máy tính của bạn.

### Bước 2: Import Collection
1. Click vào nút **Import** ở góc trên bên trái
2. Chọn tab **File**
3. Click **Choose Files** hoặc kéo thả file `SkillBridge_Complete_API.postman_collection.json`
4. Click **Import**

### Bước 3: Thiết lập Environment Variables (Tùy chọn)
Collection đã có sẵn các biến:
- `baseUrl`: `http://localhost:8080/api` (có thể thay đổi cho staging/production)
- `authToken`: Sẽ tự động được set sau khi login thành công

## 🔐 Cách sử dụng

### 1. Login để lấy Token

**Bước 1:** Mở request **Authentication > Login**

**Bước 2:** Chỉnh sửa body với thông tin đăng nhập:
```json
{
  "email": "sales@skillbridge.com",
  "password": "password123"
}
```

**Bước 3:** Click **Send**

**Bước 4:** Token sẽ tự động được lưu vào biến `authToken` (nhờ vào Pre-request Script)

### 2. Sử dụng các API khác

Sau khi login thành công, các API yêu cầu authentication sẽ tự động sử dụng token từ biến `{{authToken}}`.

## 📝 Các API chính

### Authentication APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login` | POST | Đăng nhập |
| `/auth/logout` | POST | Đăng xuất |
| `/auth/forgot-password` | POST | Quên mật khẩu |
| `/auth/reset-password` | POST | Reset mật khẩu |
| `/auth/change-password` | POST | Đổi mật khẩu |

### Public APIs (Không cần authentication)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/public/engineers/search` | GET | Tìm kiếm kỹ sư |
| `/public/engineers/filters/skills` | GET | Lấy danh sách skills |
| `/public/engineers/filters/locations` | GET | Lấy danh sách locations |
| `/public/engineers/filters/seniorities` | GET | Lấy danh sách seniority levels |
| `/public/contact/submit` | POST | Gửi form liên hệ |

### Sales Portal APIs

#### Contacts Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/sales/contacts` | GET | Lấy danh sách contacts |
| `/sales/contacts/:id` | GET | Lấy chi tiết contact |
| `/sales/contacts/:id` | PUT | Cập nhật contact |
| `/sales/contacts/:id/convert-to-opportunity` | POST | Chuyển contact thành opportunity |
| `/sales/contacts/:id/communication-logs` | POST | Thêm communication log |
| `/sales/contacts/:id/send-mtg-email` | POST | Gửi email lịch họp |
| `/sales/contacts/users` | GET | Lấy danh sách sales users |
| `/sales/contacts/clients` | GET | Lấy danh sách client users |

#### Opportunities Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/sales/opportunities` | GET | Lấy danh sách opportunities |

#### Dashboard
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/sales/dashboard/stats` | GET | Lấy thống kê dashboard |

### Admin Portal APIs

#### User Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/admin/users` | GET | Lấy danh sách users |
| `/admin/users` | POST | Tạo user mới |
| `/admin/users/:id` | PUT | Cập nhật user |
| `/admin/users/:id` | DELETE | Xóa user |

#### Engineer Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/admin/engineers` | GET | Lấy danh sách engineers |
| `/admin/engineers` | POST | Tạo engineer mới |
| `/admin/engineers/:id` | PUT | Cập nhật engineer |
| `/admin/engineers/:id` | DELETE | Xóa engineer |

#### Master Data Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/admin/master-data/skills` | GET | Lấy danh sách skills |
| `/admin/master-data/skills` | POST | Tạo skill mới |
| `/admin/master-data/project-types` | GET | Lấy danh sách project types |
| `/admin/master-data/project-types` | POST | Tạo project type mới |

### Client Portal APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/client/dashboard` | GET | Lấy dashboard data |
| `/client/contracts` | GET | Lấy danh sách contracts |
| `/client/contracts/:id` | GET | Lấy chi tiết contract |
| `/client/documents` | GET | Lấy danh sách documents |
| `/client/documents/:id/download` | GET | Download document |

## 🔧 Thay đổi Base URL

Để test với môi trường khác (staging, production):

1. Click vào Collection **SkillBridge Complete API Collection**
2. Chọn tab **Variables**
3. Thay đổi giá trị của `baseUrl`:
   - Local: `http://localhost:8080/api`
   - Staging: `https://staging.skillbridge.com/api`
   - Production: `https://api.skillbridge.com/api`

## 📊 Sample Request Bodies

### Login
```json
{
  "email": "sales@skillbridge.com",
  "password": "password123"
}
```

### Submit Contact Form
```json
{
  "clientName": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "phone": "090-1234-5678",
  "company": "ABC Corporation",
  "consultationRequest": "Tôi muốn tư vấn về dịch vụ phát triển phần mềm",
  "requestType": "PROJECT"
}
```

### Update Contact
```json
{
  "requestType": "PROJECT",
  "priority": "HIGH",
  "assigneeUserId": 5,
  "status": "INPROGRESS",
  "internalNotes": "Khách hàng quan tâm đến dự án lớn",
  "onlineMtgLink": "https://meet.google.com/abc-defg-hij",
  "onlineMtgDateTime": "2025/12/15 14:30"
}
```

### Send Meeting Email
```json
{
  "onlineMtgLink": "https://meet.google.com/abc-defg-hij",
  "onlineMtgDateTime": "2025/12/15 14:30"
}
```

### Create Engineer
```json
{
  "fullName": "Nguyễn Văn B",
  "email": "engineer@example.com",
  "phone": "090-9876-5432",
  "location": "Tokyo",
  "yearsOfExperience": 5,
  "seniority": "SENIOR",
  "skills": ["Java", "Spring Boot", "MySQL"],
  "languages": ["Japanese", "English"],
  "expectedSalary": 8000000,
  "availability": true,
  "bio": "Experienced Java developer"
}
```

## 🎯 Tips & Best Practices

1. **Luôn login trước** khi test các API yêu cầu authentication
2. **Kiểm tra token** - Token có thể hết hạn, cần login lại
3. **Sử dụng Variables** - Dùng `{{baseUrl}}` và `{{authToken}}` thay vì hard-code
4. **Test theo thứ tự** - Test các API theo flow nghiệp vụ (Login → Get List → Get Detail → Update)
5. **Lưu Response** - Postman cho phép lưu response để so sánh

## 🐛 Troubleshooting

### Lỗi 401 Unauthorized
- Kiểm tra xem đã login chưa
- Token có thể đã hết hạn, cần login lại
- Kiểm tra header Authorization có đúng format không

### Lỗi 403 Forbidden
- User không có quyền truy cập endpoint này
- Kiểm tra role của user (SALES_MANAGER, SALES_REP, ADMIN, CLIENT_USER)

### Lỗi 404 Not Found
- Kiểm tra baseUrl có đúng không
- Kiểm tra ID trong path parameter có tồn tại không

### Lỗi 500 Internal Server Error
- Kiểm tra backend server có đang chạy không
- Xem log backend để biết chi tiết lỗi

## 📞 Support

Nếu có vấn đề hoặc câu hỏi, vui lòng liên hệ team phát triển.

---

**Version:** 1.0.0  
**Last Updated:** 2025-12-03  
**Maintained by:** SkillBridge Development Team
