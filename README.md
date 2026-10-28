# Functional Programming (FP)

> "Functional programming is a programming paradigm where programs are constructed by applying and composing functions."

Tài liệu này cung cấp cái nhìn tổng quan và chi tiết về **Lập trình hàm (Functional Programming)**, một trong những mô hình quan trọng nhất để viết code sạch, dễ bảo trì và ít lỗi hơn.

---

## 1. Functional Programming là gì?

Functional programming (FP) là một mô hình lập trình (paradigm) dựa trên tư tưởng của Toán học:
*   **Declarative (Khai báo):** Tập trung vào việc mô tả **Cái gì (What)** cần làm thay vì **Làm thế nào (How)** để thực hiện nó (từng bước).
*   **Pure Functions (Hàm thuần khiết):** Tránh thay đổi trạng thái và dữ liệu bên ngoài (No Side Effects).
*   **Immutability (Bất biến):** Dữ liệu không bao giờ bị thay đổi sau khi tạo ra.

Nó khác biệt hoàn toàn với **Imperative Programming** (Lập trình mệnh lệnh) và **Object-Oriented Programming** (OOP).

---

## 2. Các khái niệm cốt lõi (Core Concepts)

Để thành thạo FP, bạn cần nắm vững các khái niệm sau:

### 2.1 Pure Functions (hàm thuần khiết)
Một hàm được gọi là Pure Function nếu thỏa mãn 2 điều kiện:
1.  **Determinism:** Với cùng một đầu vào, luôn trả về cùng một đầu ra.
2.  **No Side Effects:** Không làm thay đổi bất kỳ thứ gì bên ngoài hàm (không sửa biến global, không sửa file, không gọi API, không `console.log`...).

```javascript
// Impure Function
let result = 0;
function addImpure(x) {
  result += x; // Thay đổi biến bên ngoài (Side Effect)
  return result;
}

// Pure Function
function addPure(x, y) {
  return x + y; // Luôn trả về x + y, không ảnh hưởng bên ngoài
}
```

### 2.2 Immutability (tính bất biến)
Khi một dữ liệu được tạo ra, nó không bao giờ được thay đổi. Nếu muốn sửa đổi, bạn phải tạo ra một bản sao mới với dữ liệu đã sửa.

**Lợi ích:** Tránh lỗi do nhiều nơi cùng sửa một dữ liệu (Race condition, Concurrency issues).

```javascript
// Mutable (Nên tránh trong FP)
const arr = [1, 2, 3];
arr.push(4); // Thay đổi trực tiếp mảng gốc

// Immutable (Đúng chuẩn FP)
const newArr = [...arr, 4]; // Tạo mảng mới
```

### 2.3 First-Class Functions & Higher-Order Functions
*   **First-Class Functions:** Hàm được coi là "công dân hạng nhất". Có thể gán hàm cho biến, truyền hàm làm tham số, hoặc return một hàm khác.
*   **Higher-Order Functions (HOF):** Là hàm nhận một hàm khác làm tham số hoặc trả về một hàm. Các ví dụ phổ biến đắc lực nhất: `map`, `filter`, `reduce`.

### 2.4 Composition (kết hợp hàm)
Là kỹ thuật ghép nhiều hàm nhỏ lại với nhau để giải quyết bài toán lớn. Output của hàm này là Input của hàm tiếp theo.
`h(x) = f(g(x))`

### 2.5 Currying
Là kỹ thuật chuyển đổi một hàm nhận nhiều tham số thành chuỗi các hàm nhận từng tham số một.
`f(a, b, c) -> f(a)(b)(c)`

---

## 3. Functional Programming KHÔNG PHẢI LÀ gì?

Để thực hành FP triệt để, chúng ta cố gắng **tránh/hạn chế tối đa** các cấu trúc mệnh lệnh (Imperative) sau:

*   **Loops (Vòng lặp):** `for`, `while`, `do...while`. (Thay thế bằng `map`, `filter`, `reduce`, `recursion`).
*   **Variable mutation (Thay đổi biến):** `let`, `var` (Dùng `const` bất cứ khi nào có thể).
*   **Void functions:** Hàm không trả về gì thường là hàm gây Side Effect.
*   **Mutator methods:** Các method thay đổi trực tiếp mảng/đối tượng:
    *   Array: `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`...
    *   Map/Set: `clear`, `delete`, `add`...

> "Làm thế nào để lập trình mà không dùng vòng lặp hay gán biến? Đó chính là thử thách thú vị của FP!"

---

## 4. Tại sao nên dùng Functional Programming? (Lợi ích)

1.  **Dễ đoán (Predictability):** Pure Functions luôn trả về kết quả giống nhau, giúp code dễ hiểu logic.
2.  **Dễ kiểm thử (Testability):** Không cần mock database hay state phức tạp, chỉ cần truyền input và check output.
3.  **Dễ debug:** Ít trạng thái (state) thay đổi ngầm định, dễ truy vết lỗi.
4.  **Concurrency (Đồng thời):** Do dữ liệu là Immutable, bạn có thể chạy code trên nhiều luồng (threads) mà không sợ xung đột dữ liệu (Thread-safe).
5.  **Tái sử dụng (Reusability):** Các hàm nhỏ (pure) dễ dàng được tái sử dụng ở nhiều nơi khác nhau.

---

## 5. Những hạn chế (Nhược điểm)

1.  **Khó học (Learning Curve):** Nhiều thuật ngữ toán học trừu tượng (Monad, Functor, Applicative) có thể gây nản lòng cho người mới.
2.  **Hiệu năng (Performance):**
    *   Việc tạo ra nhiều object mới (Immutability) khiến bộ nhớ (RAM) và Garbage Collection hoạt động nhiều hơn.
    *   Đệ quy (Recursion) nếu không được tối ưu (Tail Call Optimization) có thể gây tràn stack (Stack Overflow).
3.  **Khó áp dụng 100%:** Trong thực tế (đặc biệt là JS/Frontend), chúng ta vẫn cần Side Effects (gọi API, DOM events). Bí quyết là **cô lập** các Side Effects ra rìa ứng dụng.

---

## Tài liệu tham khảo
*   [Functional Programming - Con đường sáng (Kipalog)](https://kipalog.com/posts/Functional-Programming---Phan-1---Con-duong-sang)
*   [Professor Frisby's Mostly Adequate Guide to Functional Programming](https://mostly-adequate.gitbook.io/mostly-adequate-guide/)
