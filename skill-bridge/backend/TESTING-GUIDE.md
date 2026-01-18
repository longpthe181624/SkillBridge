# Hướng dẫn chạy Unit Test cho Contact Form Validation

## Tổng quan

File test `ContactFormValidatorTest.java` đã được tạo tại:
```
backend/src/test/java/com/skillbridge/validator/ContactFormValidatorTest.java
```

**Loại test**: Pure Unit Test (chỉ test validation logic, không gọi API)

## Các test case đã được implement

### 1. Test thành công
- ✅ `testValidContactForm`: Test validation với dữ liệu hợp lệ

### 2. Test validation phone number
- ✅ `testInvalidPhoneFormat`: Test phone chứa ký tự không hợp lệ (abc123)
- ✅ `testPhoneWithInvalidSpecialChars`: Test phone chứa ký tự đặc biệt không được phép (@, #)
- ✅ `testValidPhoneFormats`: Test các format phone hợp lệ:
  - `07033453223` (chỉ số)
  - `070-3345-3223` (có dấu gạch ngang)
  - `+84 70 3345 3223` (có dấu + và khoảng trắng)
  - `(070) 3345-3223` (có dấu ngoặc đơn)
  - `+84-70-3345-3223` (có dấu + và gạch ngang)
- ✅ `testBlankPhone`: Test phone rỗng

### 3. Test validation name
- ✅ `testBlankName`: Test name rỗng
- ✅ `testNameTooShort`: Test name quá ngắn (< 2 ký tự)
- ✅ `testNameTooLong`: Test name quá dài (> 100 ký tự)
- ✅ `testNameWithSpaces`: Test name có khoảng trắng (should be trimmed)

### 4. Test validation company name
- ✅ `testBlankCompanyName`: Test company name rỗng

### 5. Test validation email
- ✅ `testInvalidEmail`: Test email không hợp lệ
- ✅ `testBlankEmail`: Test email rỗng

### 6. Test validation title
- ✅ `testBlankTitle`: Test title rỗng
- ✅ `testTitleTooShort`: Test title quá ngắn (< 2 ký tự)

### 7. Test validation message
- ✅ `testMessageTooShort`: Test message quá ngắn (< 10 ký tự)
- ✅ `testBlankMessage`: Test message rỗng
- ✅ `testMessageTooLong`: Test message quá dài (> 1000 ký tự)

**Tổng cộng: 17 test cases**

## Cách chạy test

### Yêu cầu trước khi chạy test

1. **Đảm bảo đã build project** (không bắt buộc nhưng nên làm):
   ```bash
   cd backend
   mvn clean compile
   ```

2. **Kiểm tra Maven đã cài đặt** (nếu chạy trên máy local):
   ```bash
   mvn --version
   ```

### Chạy test trên máy local (không dùng Docker)

#### Chạy tất cả tests
```bash
cd backend
mvn test -Dtest=ContactFormValidatorTest
```

#### Chạy test cụ thể
```bash
# Chạy test cho phone validation
mvn test -Dtest=ContactFormValidatorTest#testInvalidPhoneFormat

# Chạy test cho name validation
mvn test -Dtest=ContactFormValidatorTest#testBlankName
```

#### Chạy test với verbose output
```bash
mvn test -Dtest=ContactFormValidatorTest -X
```

### Chạy test trong Docker

#### Cách 1: Sử dụng script có sẵn (Windows)
```bash
cd backend
.\run-tests-in-docker.bat ContactFormValidatorTest
```

#### Cách 2: Chạy trực tiếp với docker run
```bash
cd backend

# Build builder image (nếu chưa có)
docker build --target builder -t skillbridge-backend-builder ./backend

# Chạy test
docker run --rm \
  -v "C:/Projects/skill-bridge-new/backend/src:/app/src" \
  -v "C:/Projects/skill-bridge-new/backend/pom.xml:/app/pom.xml" \
  skillbridge-backend-builder \
  mvn test -Dtest=ContactFormValidatorTest
```

#### Cách 3: Sử dụng docker-compose (nếu có container đang chạy)
```bash
cd ..
docker-compose -f docker-compose.dev.yml run --rm backend mvn test -Dtest=ContactFormValidatorTest
```

## Kết quả mong đợi

Khi chạy thành công, bạn sẽ thấy output tương tự:

```
[INFO] Tests run: 17, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

## Troubleshooting

### Lỗi: "Test class not found"
**Nguyên nhân**: File test chưa được compile
**Giải pháp**: 
```bash
mvn clean test-compile
mvn test -Dtest=ContactFormValidatorTest
```

### Lỗi: "No tests found"
**Nguyên nhân**: Tên test class không đúng hoặc không có test methods
**Giải pháp**: 
- Kiểm tra tên class: `ContactFormValidatorTest`
- Kiểm tra các methods có annotation `@Test`

### Lỗi: "Compilation failure"
**Nguyên nhân**: Code có lỗi syntax hoặc thiếu dependencies
**Giải pháp**: 
```bash
mvn clean compile
# Xem lỗi chi tiết và sửa
```

## So sánh với Integration Test

### Unit Test (ContactFormValidatorTest) - ✅ Đang sử dụng
- **Loại**: Pure Unit Test
- **Phạm vi**: Chỉ test validation logic
- **Phụ thuộc**: Không cần Spring, database, HTTP
- **Tốc độ**: Rất nhanh (~0.1s)
- **Số tests**: 17 tests
- **Phù hợp**: Unit test thực sự, phù hợp cho báo cáo đồ án

### Integration Test (đã xóa)
- **Loại**: Integration Test
- **Phạm vi**: Test API endpoint end-to-end
- **Phụ thuộc**: Cần Spring context, MockMvc, mocks
- **Tốc độ**: Chậm hơn
- **Số tests**: 11 tests
- **Phù hợp**: API testing

## Tài liệu tham khảo

- **`UNIT-TEST-DETAILS.md`**: Chi tiết từng test case với input/output
- **`TEST-SUMMARY.md`**: Tóm tắt tổng quan về unit tests

## Ghi chú

- Unit test này **không cần** Spring Boot context
- Unit test này **không cần** database connection
- Unit test này **không cần** MockMvc hoặc HTTP layer
- Chỉ test validation logic thuần túy
- Chạy rất nhanh và đơn giản
