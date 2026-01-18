# Hướng dẫn chạy Unit Test - ContactFormValidatorTest

## 📋 Tổng quan

Unit test này test validation logic cho contact form. Test chạy rất nhanh và không cần database hay Spring Boot context.

**File test**: `backend/src/test/java/com/skillbridge/validator/ContactFormValidatorTest.java`

**Số test cases**: 17 tests

---

## 🚀 Cách 1: Chạy trên máy local (Khuyến nghị)

### Bước 1: Kiểm tra Maven đã cài đặt

Mở terminal/command prompt và chạy:
```bash
mvn --version
```

Nếu thấy version của Maven (ví dụ: `Apache Maven 3.9.x`), bạn đã có Maven. Nếu chưa có, cài đặt Maven trước.

### Bước 2: Di chuyển vào thư mục backend

```bash
cd backend
```

### Bước 3: Chạy tất cả unit tests

```bash
mvn test -Dtest=ContactFormValidatorTest
```

### Kết quả mong đợi:

```
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.skillbridge.validator.ContactFormValidatorTest
[INFO] Tests run: 17, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.091 s
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 17, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

✅ **Nếu thấy "BUILD SUCCESS" và "Tests run: 17, Failures: 0"** → Test đã chạy thành công!

---

## 🐳 Cách 2: Chạy trong Docker (Nếu không có Maven trên máy)

### Bước 1: Mở terminal/command prompt

### Bước 2: Di chuyển vào thư mục backend

```bash
cd backend
```

### Bước 3: Chạy test bằng script (Windows)

```bash
.\run-tests-in-docker.bat ContactFormValidatorTest
```

**Lưu ý**: Nếu script không chạy được, xem Cách 3 bên dưới.

### Kết quả mong đợi:

Tương tự như Cách 1, bạn sẽ thấy:
```
[INFO] Tests run: 17, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

---

## 🔧 Cách 3: Chạy trực tiếp với Docker (Nếu script không hoạt động)

### Bước 1: Di chuyển vào thư mục backend

```bash
cd backend
```

### Bước 2: Build Docker image (chỉ cần làm 1 lần)

```bash
docker build --target builder -t skillbridge-backend-builder ./backend
```

### Bước 3: Chạy test

**Trên Windows:**
```bash
docker run --rm -v "C:/Projects/skill-bridge-new/backend/src:/app/src" -v "C:/Projects/skill-bridge-new/backend/pom.xml:/app/pom.xml" skillbridge-backend-builder mvn test -Dtest=ContactFormValidatorTest
```

**Lưu ý**: Thay `C:/Projects/skill-bridge-new` bằng đường dẫn thực tế của project trên máy bạn.

**Trên Linux/Mac:**
```bash
docker run --rm -v "$(pwd)/src:/app/src" -v "$(pwd)/pom.xml:/app/pom.xml" skillbridge-backend-builder mvn test -Dtest=ContactFormValidatorTest
```

---

## 📝 Chạy test cụ thể

### Chạy 1 test case cụ thể

```bash
# Ví dụ: Chạy test cho phone validation
mvn test -Dtest=ContactFormValidatorTest#testInvalidPhoneFormat
```

### Chạy nhiều test cases

```bash
# Chạy tất cả test về phone
mvn test -Dtest=ContactFormValidatorTest#testInvalidPhoneFormat,ContactFormValidatorTest#testBlankPhone,ContactFormValidatorTest#testValidPhoneFormats
```

---

## 🔍 Xem chi tiết output

### Xem output đầy đủ (verbose)

```bash
mvn test -Dtest=ContactFormValidatorTest -X
```

### Xem output với stack trace khi có lỗi

```bash
mvn test -Dtest=ContactFormValidatorTest -e
```

### Xem output với debug mode

```bash
mvn test -Dtest=ContactFormValidatorTest -X -e
```

---

## ✅ Kiểm tra kết quả

### Test thành công khi thấy:

```
[INFO] Tests run: 17, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

### Test thất bại khi thấy:

```
[ERROR] Tests run: 17, Failures: 1, Errors: 0, Skipped: 0
[INFO] BUILD FAILURE
```

Nếu có lỗi, xem phần "Troubleshooting" bên dưới.

---

## 🐛 Troubleshooting (Xử lý lỗi)

### Lỗi 1: "mvn: command not found" hoặc "mvn is not recognized"

**Nguyên nhân**: Maven chưa được cài đặt hoặc chưa được thêm vào PATH.

**Giải pháp**:
1. Cài đặt Maven: https://maven.apache.org/download.cgi
2. Hoặc sử dụng Docker (Cách 2 hoặc Cách 3)

### Lỗi 2: "Test class not found"

**Nguyên nhân**: File test chưa được compile.

**Giải pháp**:
```bash
mvn clean test-compile
mvn test -Dtest=ContactFormValidatorTest
```

### Lỗi 3: "No tests found"

**Nguyên nhân**: Tên test class không đúng.

**Giải pháp**: Kiểm tra tên class phải là `ContactFormValidatorTest` (chính xác, phân biệt hoa thường).

### Lỗi 4: "Compilation failure"

**Nguyên nhân**: Code có lỗi syntax.

**Giải pháp**:
```bash
# Xem lỗi chi tiết
mvn clean compile

# Sửa lỗi trong code, sau đó chạy lại test
mvn test -Dtest=ContactFormValidatorTest
```

### Lỗi 5: Docker không chạy được

**Nguyên nhân**: Docker chưa được cài đặt hoặc chưa khởi động.

**Giải pháp**:
1. Cài đặt Docker Desktop: https://www.docker.com/products/docker-desktop
2. Khởi động Docker Desktop
3. Chạy lại lệnh Docker

### Lỗi 6: "Volume mount path not found" (Docker)

**Nguyên nhân**: Đường dẫn trong lệnh Docker không đúng.

**Giải pháp**: Thay `C:/Projects/skill-bridge-new` bằng đường dẫn thực tế của project trên máy bạn.

**Cách tìm đường dẫn**:
- Windows: Mở File Explorer, click chuột phải vào thư mục project → Properties → Copy đường dẫn
- Linux/Mac: Chạy `pwd` trong terminal khi đang ở thư mục project

---

## 📊 Danh sách tất cả test cases

Để xem danh sách đầy đủ 17 test cases, xem file:
- `backend/UNIT-TEST-DETAILS.md`

Hoặc chạy test với verbose mode:
```bash
mvn test -Dtest=ContactFormValidatorTest -X | grep "test"
```

---

## 🎯 Test cases quan trọng để demo

Nếu bạn muốn demo một vài test cases quan trọng:

1. **Test thành công**:
   ```bash
   mvn test -Dtest=ContactFormValidatorTest#testValidContactForm
   ```

2. **Test phone validation**:
   ```bash
   mvn test -Dtest=ContactFormValidatorTest#testInvalidPhoneFormat
   ```

3. **Test required fields**:
   ```bash
   mvn test -Dtest=ContactFormValidatorTest#testBlankPhone
   ```

4. **Test size validation**:
   ```bash
   mvn test -Dtest=ContactFormValidatorTest#testNameTooShort
   ```

---

## 📚 Tài liệu tham khảo

- **`UNIT-TEST-DETAILS.md`**: Chi tiết từng test case với input/output
- **`TEST-SUMMARY.md`**: Tóm tắt tổng quan về unit tests
- **`TESTING-GUIDE.md`**: Hướng dẫn kỹ thuật chi tiết

---

## 💡 Tips

1. **Chạy test thường xuyên**: Mỗi khi sửa code, chạy test để đảm bảo không bị lỗi
2. **Xem output chi tiết**: Dùng `-X` hoặc `-e` để debug khi có lỗi
3. **Chạy test cụ thể**: Khi đang fix một bug, chỉ chạy test liên quan để tiết kiệm thời gian
4. **Commit code khi test pass**: Chỉ commit code khi tất cả tests đều pass

---

## ❓ Câu hỏi thường gặp

**Q: Test chạy mất bao lâu?**  
A: Rất nhanh, khoảng 0.1 giây cho 17 tests.

**Q: Có cần database không?**  
A: Không, đây là pure unit test, không cần database.

**Q: Có cần Spring Boot không?**  
A: Không, test này không cần Spring Boot context.

**Q: Có thể chạy test trong IDE không?**  
A: Có, bạn có thể chạy trực tiếp trong IntelliJ IDEA hoặc Eclipse bằng cách click chuột phải vào file test → Run.

**Q: Test này test gì?**  
A: Test validation logic cho contact form (phone, email, name, message, title, company name).

---

## ✨ Kết luận

Unit test này rất đơn giản và nhanh. Chỉ cần:
1. Có Maven hoặc Docker
2. Chạy 1 lệnh: `mvn test -Dtest=ContactFormValidatorTest`
3. Xem kết quả: "BUILD SUCCESS" với 17 tests pass

Chúc bạn test thành công! 🎉

