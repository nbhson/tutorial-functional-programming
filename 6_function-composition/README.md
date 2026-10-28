# 6. Function Composition (kết hợp hàm)

Đây là "trái tim" của lập trình hàm. Composition cho phép chúng ta xây dựng logic phức tạp từ những mảnh ghép đơn giản.

## Composition là gì?

Trong toán học: `(f ∘ g)(x) = f(g(x))`.
Nghĩa là: Output của hàm `g` sẽ là Input của hàm `f`.

```javascript
const trim = str => str.trim();
const toUpper = str => str.toUpperCase();
const exclaim = str => `${str}!`;

// Muốn: trim -> upper -> exclaim
const result = exclaim(toUpper(trim("  hello  "))); // "HELLO!"
```

Vấn đề: Code trên (Nested calls) đọc từ trong ra ngoài (`trim` chạy trước, rồi `toUpper`, rồi `exclaim`), rất khó đọc nếu lồng quá sâu.

## Pipe & Compose

Để code dễ đọc hơn (từ trái qua phải hoặc trên xuống dưới), FP cung cấp 2 tiện ích:

### 1. Pipe (Đường ống)
Dữ liệu chảy từ trái qua phải: `Data -> Fn1 -> Fn2 -> Fn3 -> Result`.

```javascript
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

const shout = pipe(
  trim,
  toUpper,
  exclaim
);

console.log(shout("  fp is cool  ")); // "FP IS COOL!"
```
*(Đọc: Lấy chuỗi, trim nó, upper nó, rồi exclaim nó. Rất tự nhiên!)*

### 2. Compose
Ngược lại với Pipe, dữ liệu chảy từ phải qua trái (đúng chuẩn toán học): `Fn3 <- Fn2 <- Fn1 <- Data`.

```javascript
const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);

const shoutCompose = compose(exclaim, toUpper, trim); 
```

## Vì sao cần Composition?

### 1. Declarative Data Flow
Bạn nhìn vào danh sách các hàm trong `pipe`, bạn hiểu ngay luồng dữ liệu biến đổi như thế nào mà không cần quan tâm chi tiết bên trong từng hàm.

### 2. Single Responsibility (Đơn nhiệm)
Mỗi hàm chỉ làm ĐÚNG một việc (Trim, Upper...). Sau đó ta ghép lại. Nếu logic `Trim` thay đổi, ta chỉ sửa hàm `trim`. Nếu ta muốn thêm bước `validate`, ta chèn thêm hàm `validate` vào đường ống là xong.

## TypeScript Perspective: Typing Pipe/Compose

Viết type cho hàm `pipe` tổng quát trong TS là một thử thách khó (vì số lượng hàm không giới hạn). Tuy nhiên, các thư viện như `fp-ts` hoặc `lodash/fp` cung cấp sẵn các overload cho nó.

Cơ bản về Type Matching: Input của hàm sau PHẢI match với Output của hàm trước.

```typescript
const trim = (s: string): string => s.trim();
const len = (s: string): number => s.length;
const isLong = (n: number): boolean => n > 10;

// Hợp lệ: string -> string -> number -> boolean
// const checkLength = pipe(trim, len, isLong); 

// KHÔNG Hợp lệ:
// const badPipe = pipe(
//   len,  // Trả về number
//   trim  // Nhận vào string -> Lỗi Type Mismatch!
// );
```

TypeScript giúp bạn bắt lỗi logic ghép nối sai "khớp" ngay từ khi code, tránh các lỗi Runtime `undefined is not a function`.