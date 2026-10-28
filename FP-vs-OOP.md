# Functional Programming (FP) vs Object-Oriented Programming (OOP) trong JavaScript

Tài liệu này so sánh chi tiết hai mô hình lập trình phổ biến nhất hiện nay trong hệ sinh thái JavaScript: **Functional Programming (FP)** và **Object-Oriented Programming (OOP)**.

Mục tiêu không phải để tìm ra cái nào "tốt hơn", mà để hiểu rõ đặc điểm của từng loại nhằm áp dụng phù hợp cho từng bài toán.

## 1. Tổng quan

| Đặc điểm | Object-Oriented Programming (OOP) | Functional Programming (FP) |
| :--- | :--- | :--- |
| **Đơn vị chính** | **Object** (Đối tượng) - kết hợp dữ liệu và hành vi. | **Function** (Hàm) - tách biệt dữ liệu và hành vi. |
| **Trạng thái (State)** | **Mutable** (Có thể thay đổi). Thường quản lý bên trong đối tượng. | **Immutable** (Bất biến). Tạo ra dữ liệu mới thay vì sửa cái cũ. |
| **Luồng dữ liệu** | Ít khi thay đổi cấu trúc dữ liệu, thay đổi trạng thái của nó. | Biến đổi dữ liệu qua các hàm (Input -> Output). |
| **Cách tiếp cận** | **Imperative** (Mệnh lệnh) - Làm thế nào để thực hiện. | **Declarative** (Khai báo) - Làm cái gì. |
| **Vòng lặp** | Sử dụng `for`, `while`, `do-while`. | Sử dụng Đệ quy (Recursion) hoặc Higher-Order Functions (`map`, `filter`, `reduce`). |
| **Từ khóa quan trọng** | `class`, `this`, `new`, `extends`, `method`. | `pure function`, `composition`, `currying`, `higher-order function`, `closure`. |

---

## 2. Ví dụ code so sánh

Giả sử chúng ta có một bài toán: **Quản lý lương nhân viên**. Cần tăng lương 10% cho nhân viên xuất sắc.

### Phong cách OOP

Tập trung vào "Đối tượng Nhân viên" (`Employee`) có dữ liệu (`salary`) và hành vi (`promote`). Các hành vi sẽ thay đổi trực tiếp dữ liệu bên trong (`this.salary`).

```javascript
class Employee {
  constructor(name, salary) {
    this.name = name;
    this.salary = salary;
  }

  promote() {
    this.salary = this.salary * 1.1; // Mutable: Thay đổi trực tiếp
    console.log(`${this.name} salary promoted to ${this.salary}`);
  }
}

const bob = new Employee('Bob', 1000);
bob.promote(); // Bob salary promoted to 1100
// Lúc này giá trị lương của bob đã bị thay đổi vĩnh viễn bên trong object.
```

### Phong cách FP

Tách biệt dữ liệu và hành vi. Dữ liệu (`employee`) chỉ là một object thuần túy. Hàm `promote` nhận dữ liệu vào và trả về **dữ liệu mới**, không làm thay đổi dữ liệu cũ.

```javascript
const promote = (employee) => {
  // Immutable: Tạo bản sao mới với lương mới
  return { 
    ...employee, 
    salary: employee.salary * 1.1 
  };
};

const bob = { name: 'Bob', salary: 1000 };
const promotedBob = promote(bob);

console.log(bob.salary); // 1000 (Vẫn giữ nguyên)
console.log(promotedBob.salary); // 1100
```

---

## 3. Đi sâu vào các khái niệm cốt lõi

### 3.1. State Management (Quản lý trạng thái)

*   **OOP**: State được gói gọn (encapsulate) trong đối tượng. Việc thay đổi state được thực hiện qua các phương thức (method). Điều này giúp bảo vệ dữ liệu nhưng nếu không cẩn thận, việc thay đổi state liên tục (side effects) có thể dẫn đến bug khó tracking khi chương trình lớn lên (Shared Mutable State).
*   **FP**: Hạn chế tối đa việc lưu trữ state. Dữ liệu được truyền qua các hàm như một dòng chảy (pipeline). Vì dữ liệu là bất biến (immutable), bạn không bao giờ lo lắng việc một hàm nào đó vô tình làm thay đổi biến số dùng chung.

### 3.2. Side Effects (Tác dụng phụ)

*   **OOP**: Phương thức thường dựa vào `this` (ngữ cảnh hiện tại) và có thể thay đổi properties của `this`. Điều này là bình thường trong OOP.
*   **FP**: Nhấn mạnh **Pure Functions** (Hàm thuần khiết). Cùng một đầu vào luôn trả về cùng một đầu ra và không gây ảnh hưởng gì ra bên ngoài (không sửa file, không đổi biến toàn cục, không gọi DB...). Side effects được cô lập ra các khu vực riêng (như I/O).

### 3.3. Tái sử dụng (Reusability)

*   **OOP**: Tái sử dụng thông qua **Kế thừa (Inheritance)** hoặc **Đa hình (Polymorphism)**. Bạn tạo class cha và cho class con kế thừa.
*   **FP**: Tái sử dụng thông qua **Composition (Kết hợp hàm)**. Bạn viết các hàm nhỏ, đơn giản rồi ghép chúng lại thành hàm lớn hơn.

> *"OOP is like a dog that comes with everything it knows clearly attached to it. FP is like a set of independent tools that you can combine."*

---

## 4. Ưu và nhược điểm

### Object-Oriented Programming (OOP)
*   **Ưu điểm:**
    *   Dễ hiểu với người mới vì mô hình hóa sát với thế giới thực (Class Xe, Class Người...).
    *   Quản lý code tốt cho các hệ thống lớn, phức tạp về mặt nghiệp vụ nhờ tính đóng gói.
    *   Được hỗ trợ tận răng bởi các IDE hiện đại (IntelliSense, Refactoring).
*   **Nhược điểm:**
    *   Dễ gặp vấn đề với "Shared Mutable State" (nhiều nơi cùng sửa 1 biến).
    *   Kế thừa sâu (Deep Inheritance) làm code trở nên cứng nhắc, khó bảo trì (vấn đề "Gorilla-banana": bạn muốn quả chuối nhưng nhận về con khỉ cầm quả chuối và cả cánh rừng).

### Functional Programming (FP)
*   **Ưu điểm:**
    *   Cực kỳ dễ test và debug (vì Pure Function không phụ thuộc môi trường).
    *   Thích hợp cho xử lý đồng thời (Concurrency) vì không tranh chấp dữ liệu (do Immutability).
    *   Code ngắn gọn, súc tích (Declarative).
*   **Nhược điểm:**
    *   Khó học ban đầu (Learning curve cao) với nhiều thuật ngữ toán học (Monad, Functor...).
    *   Có thể gặp vấn đề hiệu năng (Performance) do tạo ra quá nhiều object mới (Garbage Collection phải làm việc nhiều) và đệ quy sâu.
    *   Khó mô hình hóa các vật thể trong game hoặc UI phức tạp (nơi mà OOP tỏa sáng).

---

## 5. Kết luận: Why not both?

JavaScript là ngôn ngữ **Multi-paradigm** (Đa mô hình). Bạn không bắt buộc phải chọn 1 trong 2.

Xu hướng hiện đại (ví dụ React Hooks, Redux) nghiêng nhiều về FP:
*   Dùng Function Component thay vì Class.
*   State là Immutable.
*   Dùng `map`, `filter`, `reduce` thay vì vòng lặp.

Tuy nhiên, các thư viện/framework lớn (như Angular, NestJS) vẫn sử dụng Class và OOP rất mạnh mẽ để tổ chức kiến trúc (Dependency Injection, Decorators).

**Lời khuyên:**
1.  Học kỹ **Pure Functions** và **Immutability** của FP để viết code logic xử lý dữ liệu ít lỗi hơn.
2.  Dùng **Class/Module** của OOP để tổ chức cấu trúc dự án cho gọn gàng.
