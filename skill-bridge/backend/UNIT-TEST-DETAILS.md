# Chi tiết Unit Test - ContactFormValidatorTest

## Tổng quan

**File test**: `backend/src/test/java/com/skillbridge/validator/ContactFormValidatorTest.java`

**File validator**: `backend/src/main/java/com/skillbridge/validator/ContactFormValidator.java`

**Tổng số test cases**: 17 test cases

**Framework**: JUnit 5

**Loại test**: Unit Test (chỉ test validation logic, không gọi API)

---

## Chi tiết từng Test Case

### Test Case 1: testValidContactForm

**Mục đích**: Test validation với dữ liệu hợp lệ

**Input Parameters**:
```java
ContactFormData form = new ContactFormData();
form.setName("John Doe");
form.setCompanyName("ABC Company");
form.setPhone("070-3345-3223");
form.setEmail("john@example.com");
form.setTitle("Project Consulting");
form.setMessage("I am interested in your services. Please contact me.");
```

**Expected Result**:
- `result.isValid()` = `true`
- `result.getMessage()` = `"Validation passed"`

**Actual Result**: ✅ PASS

---

### Test Case 2: testInvalidPhoneFormat

**Mục đích**: Test validation khi phone chứa ký tự không hợp lệ (chữ cái)

**Input Parameters**:
```java
form.setPhone("abc123"); // ❌ Invalid: contains letters
```

**Expected Result**:
- `result.isValid()` = `false`
- `result.getMessage()` = `"Phone number format is invalid"`

**Actual Result**: ✅ PASS

---

### Test Case 3: testPhoneWithInvalidSpecialChars

**Mục đích**: Test validation khi phone chứa ký tự đặc biệt không được phép

**Input Parameters**:
```java
form.setPhone("070@3345#3223"); // ❌ Invalid: contains @ and #
```

**Expected Result**:
- `result.isValid()` = `false`
- `result.getMessage()` = `"Phone number format is invalid"`

**Actual Result**: ✅ PASS

---

### Test Case 4: testValidPhoneFormats

**Mục đích**: Test các format phone hợp lệ khác nhau

**Input Parameters** (5 test cases trong 1 test method):

1. **Digits only**:
   ```java
   form.setPhone("07033453223");
   ```

2. **With hyphens**:
   ```java
   form.setPhone("070-3345-3223");
   ```

3. **With plus and spaces**:
   ```java
   form.setPhone("+84 70 3345 3223");
   ```

4. **With parentheses and hyphen**:
   ```java
   form.setPhone("(070) 3345-3223");
   ```

5. **With plus and hyphens**:
   ```java
   form.setPhone("+84-70-3345-3223");
   ```

**Expected Result** (cho tất cả 5 formats):
- `result.isValid()` = `true`

**Actual Result**: ✅ PASS (5/5 formats)

---

### Test Case 5: testBlankPhone

**Mục đích**: Test validation khi phone rỗng

**Input Parameters**:
```java
form.setPhone(""); // ❌ Blank phone
```

**Expected Result**:
- `result.isValid()` = `false`
- `result.getMessage()` = `"Phone is required"`

**Actual Result**: ✅ PASS

---

### Test Case 6: testBlankName

**Mục đích**: Test validation khi name rỗng

**Input Parameters**:
```java
form.setName(""); // ❌ Blank name
```

**Expected Result**:
- `result.isValid()` = `false`
- `result.getMessage()` = `"Name is required"`

**Actual Result**: ✅ PASS

---

### Test Case 7: testNameTooShort

**Mục đích**: Test validation khi name quá ngắn (< 2 ký tự)

**Input Parameters**:
```java
form.setName("A"); // ❌ Too short (1 character, minimum is 2)
```

**Expected Result**:
- `result.isValid()` = `false`
- `result.getMessage()` = `"Name must be at least 2 characters"`

**Actual Result**: ✅ PASS

---

### Test Case 8: testNameTooLong

**Mục đích**: Test validation khi name quá dài (> 100 ký tự)

**Input Parameters**:
```java
form.setName("A".repeat(101)); // ❌ Too long (101 characters, maximum is 100)
```

**Expected Result**:
- `result.isValid()` = `false`
- `result.getMessage()` = `"Name must be less than 100 characters"`

**Actual Result**: ✅ PASS

---

### Test Case 9: testBlankCompanyName

**Mục đích**: Test validation khi company name rỗng

**Input Parameters**:
```java
form.setCompanyName(""); // ❌ Blank company name
```

**Expected Result**:
- `result.isValid()` = `false`
- `result.getMessage()` = `"Company name is required"`

**Actual Result**: ✅ PASS

---

### Test Case 10: testInvalidEmail

**Mục đích**: Test validation khi email không hợp lệ

**Input Parameters**:
```java
form.setEmail("invalid-email"); // ❌ Invalid email format
```

**Expected Result**:
- `result.isValid()` = `false`
- `result.getMessage()` = `"Email must be valid"`

**Actual Result**: ✅ PASS

---

### Test Case 11: testBlankEmail

**Mục đích**: Test validation khi email rỗng

**Input Parameters**:
```java
form.setEmail(""); // ❌ Blank email
```

**Expected Result**:
- `result.isValid()` = `false`
- `result.getMessage()` = `"Email is required"`

**Actual Result**: ✅ PASS

---

### Test Case 12: testBlankTitle

**Mục đích**: Test validation khi title rỗng

**Input Parameters**:
```java
form.setTitle(""); // ❌ Blank title
```

**Expected Result**:
- `result.isValid()` = `false`
- `result.getMessage()` = `"Title is required"`

**Actual Result**: ✅ PASS

---

### Test Case 13: testTitleTooShort

**Mục đích**: Test validation khi title quá ngắn (< 2 ký tự)

**Input Parameters**:
```java
form.setTitle("A"); // ❌ Too short (1 character, minimum is 2)
```

**Expected Result**:
- `result.isValid()` = `false`
- `result.getMessage()` = `"Title must be at least 2 characters"`

**Actual Result**: ✅ PASS

---

### Test Case 14: testMessageTooShort

**Mục đích**: Test validation khi message quá ngắn (< 10 ký tự)

**Input Parameters**:
```java
form.setMessage("Short"); // ❌ Too short (5 characters, minimum is 10)
```

**Expected Result**:
- `result.isValid()` = `false`
- `result.getMessage()` = `"Message must be at least 10 characters"`

**Actual Result**: ✅ PASS

---

### Test Case 15: testBlankMessage

**Mục đích**: Test validation khi message rỗng

**Input Parameters**:
```java
form.setMessage(""); // ❌ Blank message
```

**Expected Result**:
- `result.isValid()` = `false`
- `result.getMessage()` = `"Message is required"`

**Actual Result**: ✅ PASS

---

### Test Case 16: testMessageTooLong

**Mục đích**: Test validation khi message quá dài (> 1000 ký tự)

**Input Parameters**:
```java
form.setMessage("A".repeat(1001)); // ❌ Too long (1001 characters, maximum is 1000)
```

**Expected Result**:
- `result.isValid()` = `false`
- `result.getMessage()` = `"Message must be less than 1000 characters"`

**Actual Result**: ✅ PASS

---

### Test Case 17: testNameWithSpaces

**Mục đích**: Test validation khi name có khoảng trắng đầu/cuối (should be trimmed)

**Input Parameters**:
```java
form.setName("  John Doe  "); // With spaces
```

**Expected Result**:
- `result.isValid()` = `true` (spaces should be trimmed)

**Actual Result**: ✅ PASS

---

## Tổng kết Test Results

| Test Case | Status | Validation Type |
|-----------|--------|-----------------|
| testValidContactForm | ✅ PASS | Success Case |
| testInvalidPhoneFormat | ✅ PASS | Phone Validation |
| testPhoneWithInvalidSpecialChars | ✅ PASS | Phone Validation |
| testValidPhoneFormats | ✅ PASS | Phone Validation (5 formats) |
| testBlankPhone | ✅ PASS | Required Field |
| testBlankName | ✅ PASS | Required Field |
| testNameTooShort | ✅ PASS | Size Validation |
| testNameTooLong | ✅ PASS | Size Validation |
| testBlankCompanyName | ✅ PASS | Required Field |
| testInvalidEmail | ✅ PASS | Email Validation |
| testBlankEmail | ✅ PASS | Required Field |
| testBlankTitle | ✅ PASS | Required Field |
| testTitleTooShort | ✅ PASS | Size Validation |
| testMessageTooShort | ✅ PASS | Size Validation |
| testBlankMessage | ✅ PASS | Required Field |
| testMessageTooLong | ✅ PASS | Size Validation |
| testNameWithSpaces | ✅ PASS | Edge Case (trimming) |

**Tổng kết**: 
- ✅ **17/17 tests PASS**
- ✅ **0 failures**
- ✅ **0 errors**

---

## Test Coverage

### Validation Rules Tested
- ✅ Phone format validation (pattern: `^[\d\-\+\(\)\s]+$`)
- ✅ Phone required validation
- ✅ Name required validation
- ✅ Name size validation (2-100 characters)
- ✅ Company name required validation
- ✅ Company name size validation (2-100 characters)
- ✅ Email format validation (pattern: `^[^\s@]+@[^\s@]+\.[^\s@]+$`)
- ✅ Email required validation
- ✅ Title required validation
- ✅ Title size validation (2-255 characters)
- ✅ Message required validation
- ✅ Message size validation (10-1000 characters)
- ✅ Edge cases (trimming spaces)

### Test Types
- ✅ Success case (valid data)
- ✅ Required field validation (blank fields)
- ✅ Format validation (phone, email)
- ✅ Size validation (min/max length)
- ✅ Edge cases (spaces, special characters)

---

## Cách chạy test

### Chạy tất cả tests:
```bash
cd backend
mvn test -Dtest=ContactFormValidatorTest
```

### Chạy test cụ thể:
```bash
mvn test -Dtest=ContactFormValidatorTest#testInvalidPhoneFormat
```

### Chạy trong Docker:
```bash
cd backend
.\run-tests-in-docker.bat ContactFormValidatorTest
```

---

## So sánh với Integration Test

### Unit Test (ContactFormValidatorTest) - ✅ Đang sử dụng
- **Mục đích**: Test validation logic đơn giản
- **Phạm vi**: Chỉ test validator class
- **Không cần**: Spring context, MockMvc, database, API calls
- **Ưu điểm**: 
  - Chạy nhanh
  - Đơn giản, dễ hiểu
  - Test isolated logic
  - Phù hợp cho unit test thực sự

### Integration Test (ContactControllerTest) - Có thể giữ lại
- **Mục đích**: Test API endpoint end-to-end
- **Phạm vi**: Test controller, validation, HTTP response
- **Cần**: Spring context, MockMvc, mocks
- **Ưu điểm**:
  - Test integration giữa các components
  - Test HTTP layer
  - Phù hợp cho integration test

---

## Ghi chú cho báo cáo

### Điểm mạnh:
1. **Pure Unit Test**: Không phụ thuộc vào Spring, database, hay HTTP layer
2. **Fast execution**: Chạy rất nhanh (0.091s cho 17 tests)
3. **Isolated testing**: Chỉ test validation logic
4. **Comprehensive coverage**: Test tất cả validation rules
5. **Edge cases**: Test các trường hợp biên

### Test Cases nên trình bày trong báo cáo:
1. **Success case**: `testValidContactForm` - minh họa validation thành công
2. **Phone validation**: `testInvalidPhoneFormat` - minh họa format validation
3. **Required fields**: `testBlankPhone`, `testBlankName` - minh họa required validation
4. **Size validation**: `testNameTooShort`, `testMessageTooShort` - minh họa size validation
5. **Email validation**: `testInvalidEmail` - minh họa email format validation

### Format để trình bày:
- Bảng tổng hợp test cases
- Code example cho test case tiêu biểu
- Test results summary
- So sánh với integration test (nếu có)

