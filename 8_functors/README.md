# 8. Functors

Nghe tên có vẻ đáng sợ, nhưng thực ra bạn dùng nó hàng ngày mà không biết.

## Functor là gì?

Đơn giản thôi: **Functor là bất cứ thứ gì có method `.map()`**.

Ví dụ phổ biến:
*   `Array`: `[1, 2, 3].map(x => x * 2)`
*   `Promise`: `.then()` chính là `.map()` của thế giới bất đồng bộ.
*   `Stream` (RxJS): Observable cũng map được.

---

## 1. Tư duy "cái hộp" (The Box Analogy)

Để hiểu Functor, hãy tưởng tượng:
*   **Value:** Một chiếc đồng hồ quý giá.
*   **Functor:** Một cái **Hộp** chứa chiếc đồng hồ đó.

Bạn muốn khắc tên lên chiếc đồng hồ, nhưng bạn không muốn lấy nó ra khỏi hộp (vì sợ rơi vỡ, bụi bẩn).

**Giải pháp Functor:**
Bạn đưa cái hộp vào một cái máy. Cái máy dùng "tay robot" (`.map()`) thò vào trong, khắc tên lên đồng hồ, rồi trả ra cho bạn một **cái hộp mới** chứa đồng hồ đã khắc tên.

```javascript
/* 
  Box là cái hộp. 
  Hàm bên trong map (f) chính là tay robot.
*/
const Box = (x) => ({
  map: (f) => Box(f(x)), // Mấu chốt: Áp dụng f lên x, rồi đóng gói lại
  fold: (f) => f(x),     // Lấy giá trị ra
  toString: () => `Box(${x})`
});

// Sử dụng
const result = Box('  qp  ')
  .map(s => s.trim())        // Máy 1: Cắt khoảng trắng -> Box('qp')
  .map(s => s.toUpperCase()) // Máy 2: Viết hoa -> Box('QP')
  .map(s => s + '!')         // Máy 3: Thêm dấu than -> Box('QP!')
  .fold(s => s);             // Lấy ra dùng: 'QP!'
```

---

## 2. Functor vs Composition: Khác nhau chỗ nào?

Bạn sẽ thắc mắc: *"Tại sao không dùng Composition (gộp hàm) cho lẹ? Sao phải bỏ vào hộp làm gì?"*

### Composition (Kết hợp hàm)
Tập trung vào **HÀM (Functions)**. Bạn nối các ống nước lại với nhau trước khi mở van nước.
*   Tư duy: `h(g(f(x)))`
*   Nguy cơ: Nếu dữ liệu `x` bị lỗi (null/undefined) ở giữa chừng, cả dây chuyền sẽ nổ tung (Error).

### Functor (Ánh xạ ngữ cảnh)
Tập trung vào **NGỮ CẢNH (Context/Safety)**. Cái "Hộp" không chỉ chứa dữ liệu, nó còn chứa **logic bảo vệ**.

**Ví dụ: Vấn đề Null (Cái hộp rỗng)**

Nếu bạn dùng `Maybe Functor` (một loại hộp đặc biệt có thể rỗng):

```javascript
// Composition thường:
const getUpperName = compose(toUpperCase, getName);
getUpperName(null); // 💥 BÙM! Lỗi "Cannot read property of null"

// Functor:
Maybe(null)
  .map(getName)        // Máy thấy hộp rỗng -> Không làm gì cả
  .map(toUpperCase)    // Máy thấy hộp rỗng -> Bỏ qua tiếp
  .map(console.log);   // An toàn tuyệt đối! Không lỗi.
```

Hai cách này phải cho ra kết quả y hệt nhau! Nghĩa là: Bạn có thể chọn ghép hàm trước rồi áp dụng (Composition), hoặc áp dụng từng bước (Functor Chaining).

> **Kết luận:**
> *   Dùng **Composition** để xây dựng logic xử lý (Process), tái sử dụng được (tạo ra một hàm xử lý mới từ các hàm cũ) để dùng cho nhiều nơi.
> *   Dùng **Functor** để xử lý dữ liệu trong một ngữ cảnh an toàn (Safety Context) / xử lý một luồng dữ liệu cụ thể (data flow) như: có thể null, bất đồng bộ (Promise), hoặc danh sách (Array).

---

## 3. Tại sao cần Functor?

1.  **Linear Data Flow:** Code chạy thẳng tuột từ trên xuống dưới (`.map().map().map()`), dễ đọc hơn nhiều so với lồng hàm.
2.  **Abstraction:** Bạn không cần biết bên trong `.map` nó xử lý for-loop hay check null như thế nào, bạn chỉ cần quan tâm logic biến đổi dữ liệu.

---

## TypeScript Perspective: Functor Interface

Trong TypeScript, Functor là một Generic Type `F<T>`, có phương thức `map` nhận hàm biến đổi `T -> U` và trả về `F<U>`.

```typescript
interface Functor<T> {
  map<U>(fn: (value: T) => U): Functor<U>;
}

// Định nghĩa cái hộp Box có kiểu
class Box<T> implements Functor<T> {
  constructor(private value: T) {}

  // map nhận hàm biến đổi T -> U, và trả về Box<U>
  map<U>(fn: (value: T) => U): Box<U> {
    return new Box(fn(this.value));
  }
}

const numBox = new Box(5); // Box<number>
const strBox = numBox.map(n => n.toString()); // Box<string> -> TS tự suy diễn ra kiểu mới!
```

TypeScript cực kỳ hữu ích ở đây vì nó đảm bảo bạn **không thể map sai kiểu**.
Ví dụ: `numBox.map(n => n.toUpperCase())` sẽ báo lỗi ngay vì `n` là number.
