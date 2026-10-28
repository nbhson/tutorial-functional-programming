# 2. Side Effects (tác dụng phụ)

Nếu Pure Function là "thiên thần" thì Side Effect thường bị xem là "ác quỷ". Nhưng thực tế, phần mềm không thể thiếu Side Effect.

## Side Effect là gì?
Side Effect là bất kỳ thay đổi nào về trạng thái (state) xảy ra bên ngoài hàm đang được thực thi.

Các loại Side Effect phổ biến:
*   Thay đổi biến toàn cục (Global variable) hoặc biến ở scope cha.
*   Ghi log ra console (`console.log`).
*   Thao tác với DOM (Document Object Model).
*   Ghi/Đọc file (`fs.writeFile`).
*   Gọi API/Mạng (`fetch`, `axios`).
*   Lấy ngày giờ hiện tại (`new Date()`) hoặc Random (`Math.random()`) -> *Vì nó làm hàm mất tính Determinism*.

### Tại sao `console.log()` là Side Effect?

Việc `console.log()` được coi là Side Effect (Tác dụng phụ) vì nó vi phạm nguyên tắc cơ bản của một "Pure Function" (Hàm thuần khiết): **Không làm thay đổi bất kỳ thứ gì bên ngoài phạm vi của hàm.**

Cụ thể hơn:

1.  **Thay đổi trạng thái bên ngoài (IO Operation):**
    *   Hàm của bạn không chỉ đơn thuần tính toán và trả về kết quả (như `Input -> Output`).
    *   Nó đang tương tác với môi trường chạy (Runtime Environment), cụ thể là ghi một dòng chữ vào bộ đệm đầu ra chuẩn (Standard Output - `stdout`) hoặc cửa sổ Developer Tools của trình duyệt.
    *   Việc làm thay đổi màn hình console chính là một "thay đổi trạng thái bên ngoài".

2.  **Không thể thay thế (Referential Transparency):**
    *   Một hàm thuần túy có thể được thay thế bằng giá trị trả về của nó mà chương trình không đổi.
    *   Ví dụ: Hàm `add(1, 2)` luôn trả về `3`. Bạn có thể thay tất cả chỗ nào gọi `add(1, 2)` bằng số `3`.
    *   Nhưng với `console.log("Hello")`, hàm này trả về `undefined`. Nếu bạn thay thế dòng lệnh `console.log("Hello")` bằng `undefined`, chương trình của bạn sẽ chạy khác đi (không còn dòng chữ in ra nữa). Sự khác biệt đó chính là Side Effect.

3.  **Khó kiểm soát trong Testing:**
    *   Khi bạn chạy unit test, bạn chỉ muốn kiểm tra `Input` và `Output`.
    *   Nếu hàm có `console.log`, nó làm bẩn output của test runner. Bạn không thể dễ dàng assert (khẳng định) là "Hàm này đã in ra dòng chữ gì" trừ khi bạn đi **Mock** lại object `console`.

> **Tóm lại:** Mặc dù `console.log` có vẻ vô hại và rất hữu ích để debug, nhưng xét về mặt lý thuyết FP nghiêm ngặt, nó là một hành động làm thay đổi thế giới bên ngoài hàm, nên nó là **Side Effect**.

## TypeScript Perspective: Void Return Type

Trong TypeScript, kiểu dữ liệu `void` thường là dấu hiệu nhận biết một hành động có Side Effect (bởi vì nếu hàm không trả về gì, thì chắc chắn nó phải làm gì đó "bên ngoài" thì mới có ý nghĩa).

```typescript
// Pure: Trả về giá trị mới
function add(a: number, b: number): number {
  return a + b;
}

// Impure: Trả về void -> Cảnh báo có Side Effect!
function logData(data: string): void {
  console.log(data); // Side effect: IO
}

function saveUser(user: User): void {
  db.save(user); // Side effect: Database IO
}
```
Nhìn vào `void`, ta biết ngay cần cẩn trọng khi sử dụng hàm này.

## Triết lý của FP: "Controlled Side Effects"

FP không cấm Side Effects (vì nếu không có Side Effect, chương trình sẽ không làm được gì cả: không hiện lên màn hình, không lưu được dữ liệu).

FP chủ trương: **Cô lập (Isolate) và Kiểm soát (Control)** Side Effects.

*   **OOP:** Side Effect thường nằm rải rác trong các method của object (`user.save()`, `ui.render()`).
*   **FP:** Đẩy hết Side Effect ra rìa của ứng dụng (Boundaries). Core logic sẽ hoàn toàn Pure, chỉ có lớp vỏ bên ngoài mới thực hiện Side Effect.

### Ví dụ minh họa

**Cách làm thông thường (Impure):**
```javascript
// Trộn lẫn logic tính toán và việc in ra màn hình
function greet(name) {
  const message = `Hello, ${name}!`;
  document.getElementById('output').innerText = message; // Side Effect!
}
```

**Cách làm FP (Pure core + Side effect shell):**
```javascript
// 1. Pure Function: Chỉ tính toán, không làm gì khác
function createGreeting(name) {
  return `Hello, ${name}!`;
}

// 2. Impure Function: Chỉ làm nhiệm vụ render
function render(message) {
  document.getElementById('output').innerText = message;
}

// 3. Glue code: Kết nối
const message = createGreeting('Son');
render(message);
```

> **Bài học:** Hãy viết càng nhiều Code Pure càng tốt. Hãy để Side Effect ở những nơi dễ nhìn thấy và dễ kiểm soát nhất.
