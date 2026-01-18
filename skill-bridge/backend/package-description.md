
# 🧭 Cấu trúc backend Spring Boot – Hướng dẫn cho nhóm phát triển

Dự án được xây dựng theo mô hình **layered architecture (kiến trúc phân tầng)**, giúp mã nguồn dễ bảo trì, dễ mở rộng và tách biệt rõ ràng giữa các tầng xử lý.

---

## 📁 1. Cấu trúc thư mục

```
src/
 └── main/
     └── java/com/skillbridge/
         ├── config/          # Cấu hình ứng dụng (Security, Database, ... )
         ├── controller/      # Nhận request từ frontend và trả response
         ├── service/         # Xử lý logic nghiệp vụ
         ├── repository/      # Giao tiếp với database
         ├── entity/          # Định nghĩa bảng dữ liệu (ORM)
         └── dto/             # Đối tượng truyền dữ liệu giữa backend và frontend
     └── resources/
         ├── application.yml  # Cấu hình môi trường (DB, port, API key,…)
         └── data.sql         # Dữ liệu mẫu khi khởi tạo
```

---

## 🧩 2. Vai trò của từng tầng

### 🔹 **1. Entity (Tầng dữ liệu)**

* Đại diện cho **các bảng trong cơ sở dữ liệu**.
* Mỗi class tương ứng với một bảng (`@Entity` + `@Table`).
* Mỗi field tương ứng với một cột (`@Column`).
* Không chứa logic xử lý, chỉ chứa dữ liệu.

📘 **Ví dụ:**

```java
@Entity
@Table(name = "engineers")
public class Engineer {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String location;
    private Integer yearsOfExp;
    private String status;
}
```

---

### 🔹 **2. DTO (Data Transfer Object)**

* Là **đối tượng trung gian** dùng để truyền dữ liệu giữa backend và frontend.
* Giúp ẩn bớt thông tin không cần thiết, tránh lộ dữ liệu nhạy cảm từ `Entity`.
* Có thể chia thành:

  * `RequestDto`: dữ liệu nhận từ FE.
  * `ResponseDto`: dữ liệu trả lại cho FE.

📘 **Ví dụ:**

```java
public class EngineerDto {
    public Long id;
    public String name;
    public String email;
    public String location;
    public Integer yearsOfExp;
    public String status;
}
```

---

### 🔹 **3. Repository**

* Là **tầng giao tiếp trực tiếp với database**.
* Kế thừa `JpaRepository` hoặc `CrudRepository` để thao tác CRUD tự động.
* Không chứa logic nghiệp vụ.
* Có thể mở rộng bằng `JpaSpecificationExecutor` để lọc/search nâng cao.

📘 **Ví dụ:**

```java
public interface EngineerRepository
        extends JpaRepository<Engineer, Long>, JpaSpecificationExecutor<Engineer> {
}
```

---

### 🔹 **4. Service**

* Là tầng **xử lý logic nghiệp vụ** (Business Logic Layer).
* Gọi đến Repository để lấy dữ liệu, xử lý hoặc validate trước khi trả về Controller.
* Thực hiện chuyển đổi giữa `Entity` và `DTO`.

📘 **Ví dụ:**

```java
@Service
public class EngineerService {

    private final EngineerRepository engineerRepository;

    public EngineerService(EngineerRepository engineerRepository) {
        this.engineerRepository = engineerRepository;
    }

    public List<EngineerDto> findAll() {
        return engineerRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    private EngineerDto toDto(Engineer e) {
        EngineerDto dto = new EngineerDto();
        dto.id = e.getId();
        dto.name = e.getName();
        dto.email = e.getEmail();
        dto.location = e.getLocation();
        dto.status = e.getStatus();
        return dto;
    }
}
```

---

### 🔹 **5. Controller**

* Là tầng **giao tiếp với frontend** (REST API).
* Nhận request từ client, gọi Service để xử lý, rồi trả kết quả dưới dạng JSON.
* Không viết logic nghiệp vụ trực tiếp tại đây.

📘 **Ví dụ:**

```java
@RestController
@RequestMapping("/api/engineers")
public class EngineerController {

    private final EngineerService engineerService;

    public EngineerController(EngineerService engineerService) {
        this.engineerService = engineerService;
    }

    @GetMapping
    public List<EngineerDto> list() {
        return engineerService.findAll();
    }
}
```

---

## 🔄 3. Luồng xử lý dữ liệu (Request Flow)

```text
Frontend (NextJS)
        ↓ (HTTP Request)
Controller (nhận request, gọi Service)
        ↓
Service (xử lý logic, gọi Repository)
        ↓
Repository (thao tác DB qua JPA)
        ↓
Database (MySQL, PostgreSQL, v.v.)
        ↑
Trả về dữ liệu → DTO → Controller → JSON Response
```

---

## 🧠 4. Lưu ý khi nhóm cùng phát triển

| Mục tiêu                                  | Cách làm                                                                                      |
| ----------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Thêm tính năng mới**                    | Tạo thêm Controller + Service + Repository riêng cho feature đó                               |
| **Không để logic xử lý trong Controller** | Đưa vào Service để dễ test và tái sử dụng                                                     |
| **Đặt tên file rõ ràng, nhất quán**       | `EngineerController`, `EngineerService`, `EngineerRepository`, `EngineerDto`, `Engineer.java` |
| **Khi cần search/filter phức tạp**        | Dùng `JpaSpecificationExecutor` và `Specification` trong package `repository/spec`            |
| **Giữ code gọn, tránh lặp**               | Dùng `@Service`, `@Component`, hoặc `@Transactional` đúng chỗ                                 |
| **Khi cần thêm API**                      | Ưu tiên `GET`, `POST`, `PUT`, `DELETE` theo RESTful convention                                |

---

## ✅ 5. Tóm tắt nhanh

| Tầng           | Vai trò chính            | Input        | Output        |
| -------------- | ------------------------ | ------------ | ------------- |
| **Entity**     | Đại diện bảng DB         | –            | Dữ liệu gốc   |
| **Repository** | Giao tiếp DB             | Entity       | Entity        |
| **Service**    | Xử lý logic              | Entity/DTO   | DTO           |
| **Controller** | Giao tiếp FE             | HTTP Request | JSON Response |
| **DTO**        | Định dạng dữ liệu FE cần | –            | –             |

---

Nếu bạn muốn, mình có thể viết thêm **mẫu mô tả feature cụ thể (vd: màn list engineer có search/filter)** để nhóm copy vào guide làm template khi thêm API mới.
Bạn có muốn mình viết thêm phần đó không?
