# 3. Immutability (tính bất biến)

> "Nếu muốn sửa đổi dữ liệu, hãy tạo ra một bản sao mới thay vì sửa trực tiếp bản gốc."

## Immutability là gì?

Một dữ liệu được coi là **Immutable** nếu trạng thái của nó không bao giờ thay đổi sau khi được tạo ra.

Trong JavaScript, các kiểu dữ liệu nguyên thủy (Primitive: number, string, boolean...) là Immutable. Nhưng Object và Array là Mutable (có thể thay đổi).

```javascript
// Mutable (Mặc định trong JS)
const person = { name: 'Son', age: 25 };
person.age = 26; // Thay đổi trực tiếp -> Nguy hiểm!

// Immutable (Phong cách FP)
const updatedPerson = { ...person, age: 26 }; // Tạo object mới
```

## Tại sao cần Immutability?

### 1. Predictability (Dễ đoán)
Nếu bạn truyền một object vào hàm A, và hàm A không thay đổi object đó (Immutability), bạn có thể yên tâm dùng object đó ở hàm B, C, D... mà không sợ nó bị biến đổi ngầm.

### 2. Time-Travel Debugging (Redux)
Nếu mỗi lần thay đổi state ta đều tạo ra một object mới, ta có thể lưu lại lịch sử các object cũ đó. Điều này cho phép "quay ngược thời gian" (Undo/Redo) cực kỳ dễ dàng. Đây là nguyên lý cốt lõi của **Redux**.

### 3. Thread Safety (An toàn đa luồng)
Trong môi trường đa luồng (như Java, C#), việc nhiều luồng cùng sửa 1 object gây ra Race Condition. Với Immutable Object, bạn không cần lock hay synchronize vì không ai sửa được nó cả. (JS đơn luồng nên ít lo việc này hơn, nhưng tư duy vẫn đúng).

## Làm thế nào trong JavaScript?

### 1. Dùng `const` (Chưa đủ!)
`const` chỉ ngăn gán lại biến (`variable reassignment`), không ngăn sửa nội dung object (`value mutation`).

```javascript
const arr = [1, 2];
arr.push(3); // Vẫn được! -> Mutable
arr = [4, 5]; // Lỗi! -> Immutability của biến binding
```

### 2. Dùng Spread Operator (`...`)
Đây là cách phổ biến nhất trong Modern JS.

```javascript
// Array
const numbers = [1, 2, 3];
const newNumbers = [...numbers, 4]; // [1, 2, 3, 4]

// Object
const user = { id: 1, name: 'A' };
const updatedUser = { ...user, name: 'B' }; // { id: 1, name: 'B' }
```

### 3. `Object.freeze()`
Ngăn chặn mọi thay đổi trên object (nhưng chỉ ở level 1 - Shallow Freeze).

```javascript
const config = Object.freeze({ port: 3000 });
config.port = 4000; // Không có tác dụng (hoặc lỗi ở strict mode)
```

## TypeScript Perspective: Compile-time Immutability

TypeScript cung cấp các công cụ cực mạnh để đảm bảo Immutability ngay từ lúc code (không tốn chi phí lúc chạy).

### 1. `Readonly<T>` và `ReadonlyArray<T>`

```typescript
type User = {
  readonly id: number; // Không thể sửa id
  name: string;
};

const user: User = { id: 1, name: "Son" };
// user.id = 2; // Lỗi Compile ngay lập tức!
```

Với mảng, ta dùng `ReadonlyArray<number>` hoặc `readonly number[]`. Nó sẽ loại bỏ các method gây đột biến như `push`, `pop`, `splice`...

```typescript
const nums: ReadonlyArray<number> = [1, 2, 3];
// nums.push(4); // Lỗi: Property 'push' does not exist on type 'readonly number[]'.
const newNums = [...nums, 4]; // OK
```

### 2. `as const` (Deep Readonly) - Vũ khí bí mật

Đây là tính năng mạnh mẽ nhất của TS. Nó biến toàn bộ object và các property con bên trong thành `readonly` (Đệ quy).

So sánh `Object.freeze` vs `as const`:

*   **Object.freeze:** Shallow (chỉ cấp 1). Runtime check (JS).
*   **as const:** Deep (tất cả các cấp). Compile-time check (TS).

```typescript
const config = {
  db: {
    host: "localhost",
    port: 5432
  }
} as const; // <--- Magic here

// config.db.host = "1.1.1.1"; // Lỗi: Cannot assign to 'host' because it is a read-only property.
```

> **Lời khuyên:** Trong dự án TypeScript, hãy ưu tiên dùng **`Readonly`** types và **`as const`** để đảm bảo Immutability một cách chặt chẽ nhất mà không làm chậm ứng dụng.