# SkillBridge API Postman Collection

## Tổng quan

File `SkillBridge_API_Collection.postman_collection.json` chứa toàn bộ API endpoints của hệ thống SkillBridge, được tổ chức theo các nhóm chức năng.

## Base URL

```
https://api.skill-bridge.dev.inisoft.vn/api
```

## Cách import vào Postman

1. Mở Postman
2. Click vào **Import** (góc trên bên trái)
3. Chọn tab **File** hoặc **Link**
4. Chọn file `SkillBridge_API_Collection.postman_collection.json`
5. Click **Import**

## Cấu trúc Collection

Collection được chia thành 6 nhóm chính:

### 1. Authentication APIs
- **Client Auth**: Login, Forgot Password, Reset Password, Change Password, Logout
- **Sales Auth**: Sales Login
- **Admin Auth**: Admin Login

### 2. Client APIs
- **Client Contacts**: Get List, Create, Get Detail, Add Communication Log, Add Proposal Comment, Approve Proposal, Cancel Consultation
- **Client Proposals**: Get List, Get Detail
- **Client Contracts**: Get List, Get Detail
- **Client Dashboard**: Get Dashboard Data
- **Client Documents**: Get Documents List
- **Client Change Requests**: Get List, Get Detail

### 3. Sales APIs
- **Sales Contacts**: Get List, Get Detail, Update, Convert to Opportunity, Add Communication Log, Send Meeting Email
- **Sales Opportunities**: Get List
- **Sales Opportunity Detail**: Get Detail, Create, Update
- **Sales Dashboard**: Get Dashboard Data
- **Sales Contracts**: Get List
- **Sales Documents**: Get List

### 4. Admin APIs
- **Admin Users**: Get List, Get by ID, Create, Update, Delete
- **Admin Engineers**: Get List, Get by ID, Create, Update, Delete
- **Admin Dashboard**: Get Dashboard Data
- **Admin Master Data - Skills**: Get List, Create, Update, Delete
- **Admin Master Data - Project Types**: Get List, Create, Update, Delete

### 5. Engineer APIs
- **Engineer Search**: Search Engineers
- **Engineer Detail**: Get Engineer Detail

### 6. Homepage APIs
- **Get Homepage Data**: Public API

## Variables

Collection sử dụng các biến sau:

- `base_url`: Base URL của API (mặc định: `https://api.skill-bridge.dev.inisoft.vn/api`)
- `client_token`: JWT token cho Client user (được set sau khi login)
- `sales_token`: JWT token cho Sales user (được set sau khi login)
- `admin_token`: JWT token cho Admin user (được set sau khi login)

## Cách sử dụng

### Bước 1: Login để lấy token

1. Chạy request **1. Authentication > Client Auth > Login**
2. Copy `token` từ response
3. Vào **Variables** của collection
4. Set giá trị cho `client_token` (hoặc `sales_token`, `admin_token` tùy theo user type)

### Bước 2: Sử dụng các API khác

Sau khi có token, bạn có thể sử dụng các API khác. Token sẽ tự động được thêm vào header `Authorization: Bearer {{token}}`.

## Lưu ý

1. **Authentication**: Hầu hết các API yêu cầu authentication token trong header `Authorization`
2. **X-User-Id Header**: Một số Client APIs yêu cầu header `X-User-Id` (tạm thời, sẽ được thay thế bằng JWT extraction)
3. **Query Parameters**: Nhiều API hỗ trợ pagination với `page` và `size` parameters
4. **Search & Filter**: Nhiều list APIs hỗ trợ search và filter parameters

## Request Examples

### Login Request
```json
{
  "email": "client@example.com",
  "password": "password123"
}
```

### Create Contact Request
```json
{
  "title": "New Project Inquiry",
  "description": "I need help with a new project"
}
```

### Update Contact Request (Sales)
```json
{
  "status": "In Progress",
  "internalNote": "Updated note",
  "onlineMtgLink": "https://meet.google.com/xxx",
  "onlineMtgDateTime": "2025/12/15 14:30"
}
```

## Response Format

Tất cả các API trả về JSON format với cấu trúc:

- **Success**: `200 OK` với data trong body
- **Error**: `4xx` hoặc `5xx` với error message trong body

## Support

Nếu có vấn đề hoặc câu hỏi, vui lòng liên hệ team phát triển.

