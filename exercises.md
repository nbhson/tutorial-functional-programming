# Exercises (Bài tập thực hành)

> Mỗi chương có 2-3 bài tập. Hãy tự làm trước, rồi mở phần đáp án để đối chiếu.
> Chạy code bằng `node <ten-file>.js` (repo đã bật `"type": "module"`).

---

## Chương 0 — Introduction

### Bài 0.1
Viết lại đoạn code imperative sau theo phong cách declarative (không dùng `for`):

```javascript
const words = ["apple", "banana", "avocado", "cherry"];
let aWords = [];
for (let i = 0; i < words.length; i++) {
  if (words[i][0] === "a") {
    aWords.push(words[i].toUpperCase());
  }
}
```

### Bài 0.2
Giải thích tại sao `console.log()` được coi là side effect trong khi `1 + 1` thì không.

<details>
<summary>Đáp án 0.1</summary>

```javascript
const aWords = words
  .filter((w) => w.startsWith("a"))
  .map((w) => w.toUpperCase());
```

</details>

<details>
<summary>Đáp án 0.2</summary>

`console.log()` tương tác với thế giới bên ngoài hàm (ghi ra stdout), trả về
`undefined`, và không thể thay thế bằng giá trị trả về mà chương trình vẫn giữ
nguyên hành vi (vi phạm referential transparency). `1 + 1` chỉ tính toán thuần,
luôn cho ra `2` với mọi lần chạy — determinism, không đụng vào trạng thái ngoài.

</details>

---

## Chương 1 — Pure Functions

### Bài 1.1
Trong các hàm sau, hàm nào pure, hàm nào impure? Vì sao?

```javascript
const f1 = (a, b) => a * b;
const f2 = (arr) => arr.sort();          // gợi ý: sort của Array
const f3 = () => Math.random();
```

### Bài 1.2
Sửa hàm `calculateTax` trong README để nó pure (hiện đang phụ thuộc biến ngoài `taxRate`), rồi viết một test case chứng minh nó determinism.

<details>
<summary>Đáp án 1.1</summary>

- `f1`: pure — chỉ dựa vào tham số, không side effect.
- `f2`: impure — `sort()` **sửa mảng gốc** (mutation), side effect cho caller.
- `f3`: impure — cùng lời gọi cho kết quả khác nhau, mất determinism.

</details>

<details>
<summary>Đáp án 1.2</summary>

```javascript
const calculateTax = (amount, rate) => amount * rate;

// Test: cùng input luôn cùng output
console.log(calculateTax(100, 0.1)); // 10
console.log(calculateTax(100, 0.1)); // 10 — chạy bao nhiêu lần cũng vậy
```

</details>

---

## Chương 2 — Side Effects

### Bài 2.1
Tách hàm impure sau thành: 1 pure core + 1 impure shell (theo mẫu IO injection trong `app.js`):

```javascript
function printDouble(n) {
  const result = n * 2;
  console.log(`Kết quả: ${result}`);
}
```

### Bài 2.2
Vì sao FP chủ trương "cô lập side effect ra rìa ứng dụng" thay vì cấm hoàn toàn?

<details>
<summary>Đáp án 2.1</summary>

```javascript
// Pure core
const double = (n) => n * 2;

// Impure shell: chỉ làm IO
const print = (msg) => console.log(msg);

// Glue
print(`Kết quả: ${double(21)}`);
```

</details>

<details>
<summary>Đáp án 2.2</summary>

Vì không có side effect thì chương trình không tạo ra giá trị nào (không hiện
màn hình, không lưu file, không gọi API). FP cấm side effect nằm rải rác trong
logic vì chúng khiến code khó test, khó đoán; nhưng chấp nhận chúng ở biên
(boundary) — nơi dễ nhìn thấy, dễ thay thế, dễ mock — còn core logic giữ 100% pure.

</details>

---

## Chương 3 — Immutability

### Bài 3.1
Không sửa mảng gốc, tạo mảng mới thỏa: (a) thêm `4` vào cuối, (b) xóa phần tử đầu, (c) thay phần tử ở index 1.

```javascript
const numbers = [1, 2, 3];
```

### Bài 3.2
Vì sao `const arr = [1, 2]` chưa đủ để đảm bảo immutability? Làm gì thêm ở runtime và ở compile-time (TypeScript)?

<details>
<summary>Đáp án 3.1</summary>

```javascript
const appended = [...numbers, 4];           // [1, 2, 3, 4]
const removedFirst = numbers.slice(1);      // [2, 3]
const replaced = numbers.map((n, i) => (i === 1 ? 99 : n)); // [1, 99, 3]
```

</details>

<details>
<summary>Đáp án 3.2</summary>

`const` chỉ chặn gán lại biến (`arr = ...`), không chặn sửa nội dung
(`arr.push(3)` vẫn chạy). Runtime: dùng `Object.freeze()` (chỉ shallow) hoặc
luôn tạo bản sao bằng spread. Compile-time: dùng `Readonly<T>` /
`ReadonlyArray<T>` hoặc `as const` (deep readonly) để TS báo lỗi ngay khi code.

</details>

---

## Chương 4 — Higher-Order Functions

### Bài 4.1
Dùng một dòng kết hợp `map`/`filter`/`reduce` để tính tổng bình phương các số lẻ:

```javascript
const numbers = [1, 2, 3, 4, 5];
// kết quả mong đợi: 1 + 9 + 25 = 35
```

### Bài 4.2
Tự viết HOF `retry(times, fn)` — trả về hàm mới mà khi gọi sẽ thử `fn` tối đa `times` lần. (Chỉ cần triển khai với hàm đồng bộ.)

<details>
<summary>Đáp án 4.1</summary>

```javascript
const sum = numbers
  .filter((n) => n % 2 !== 0)
  .map((n) => n * n)
  .reduce((acc, n) => acc + n, 0);
// 35
```

</details>

<details>
<summary>Đáp án 4.2</summary>

```javascript
const retry = (times, fn) => (...args) => {
  let lastError;
  for (let i = 0; i < times; i++) {
    try {
      return fn(...args);
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
};

const risky = retry(3, (x) => {
  if (Math.random() < 0.5) throw new Error("thất bại");
  return x;
});
```

</details>

---

## Chương 5 — Currying

### Bài 5.1
Curry hóa hàm `format(type, currency, amount)` thành `format(type)(currency)(amount)`, rồi dùng nó tạo `formatVnd`.

### Bài 5.2
Currying khác Partial Application chỗ nào? Cho một ví dụ mỗi loại.

<details>
<summary>Đáp án 5.1</summary>

```javascript
const format = (type) => (currency) => (amount) =>
  `${type} ${amount.toLocaleString("vi-VN")} ${currency}`;

const formatVnd = format("Tiền")( "VNĐ");
console.log(formatVnd(1500000)); // Tiền 1.500.000 VNĐ
```

</details>

<details>
<summary>Đáp án 5.2</summary>

- **Currying:** biến `f(a, b, c)` thành chuỗi hàm 1 tham số `f(a)(b)(c)` — luôn
  đi từng bước một.
  Ví dụ: `add = a => b => a + b`.
- **Partial application:** "ghim" sẵn một (hoặc nhiều) tham số, hàm trả về nhận
  phần còn lại (có thể nhiều tham số cùng lúc).
  Ví dụ: `const double = multiply.bind(null, 2)` — `double(5)` nhận cả 5 một lần.

</details>

---

## Chương 6 — Function Composition

### Bài 6.1
Viết `pipe(...fns)` (dữ liệu chảy trái → phải), rồi dựng pipeline `clean -> upper -> exclaim` xử lý chuỗi `"  hello  "` thành `"HELLO!"`.

### Bài 6.2
Trong `app.js` của chương này, vì sao thứ tự hàm trong `compose(lap, cha, khoan, bao, boQua, cua)` là "ngược" so với thứ tự thực hiện công đoạn?

<details>
<summary>Đáp án 6.1</summary>

```javascript
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

const clean = (s) => s.trim();
const upper = (s) => s.toUpperCase();
const exclaim = (s) => `${s}!`;

const shout = pipe(clean, upper, exclaim);
console.log(shout("  hello  ")); // HELLO!
```

</details>

<details>
<summary>Đáp án 6.2</summary>

Vì `compose` chạy từ **phải qua trái** (đúng chuẩn toán học
`f(g(x))`): hàm ngoài cùng bên phải chạy trước. Muốn công đoạn cưa chạy trước
thì `cua` phải đứng cuối danh sách. Nếu muốn đọc trái → phải theo thứ tự công
việc, dùng `pipe` thay thế.

</details>

---

## Chương 7 — Recursion

### Bài 7.1
Viết hàm đệ quy `sum(n)` tính tổng 1 + 2 + ... + n (không dùng vòng lặp, không mutation).

### Bài 7.2
Viết phiên bản tail-recursive của `sum` ở trên và giải thích khác biệt so với bản thường.

<details>
<summary>Đáp án 7.1</summary>

```javascript
const sum = (n) => (n === 0 ? 0 : n + sum(n - 1));
console.log(sum(5)); // 15
```

</details>

<details>
<summary>Đáp án 7.2</summary>

```javascript
const sumTail = (n, acc = 0) => (n === 0 ? acc : sumTail(n - 1, acc + n));
```

Bản thường phải chờ `sum(n - 1)` trả về rồi mới cộng `n` (stack giữ khung gọi);
bản tail-recursive bước cuối chỉ là gọi chính nó, kết quả dồn vào `acc`, nên
engine có TCO (Safari) có thể chạy mà không phình stack. Chrome/Node chưa TCO —
thực tế JS vẫn dễ Stack Overflow với n lớn.

</details>

---

## Chương 8 — Functors

### Bài 8.1
Dùng `Box` (trong `8_functors/app.js`) biến chuỗi `"  son  "` thành độ dài chuỗi đã trim, giữ kết quả trong hộp cho đến khi `fold`.

### Bài 8.2
`Maybe(null).map(f)` không chạy `f` — cơ chế này thay thế được pattern nào của code mệnh lệnh?

<details>
<summary>Đáp án 8.1</summary>

```javascript
const length = Box("  son  ")
  .map((s) => s.trim())
  .map((s) => s.length)
  .fold((n) => n);
console.log(length); // 3
```

</details>

<details>
<summary>Đáp án 8.2</summary>

Thay thế chuỗi `if (x != null) { ... }` kiểm tra null lặp đi lặp lại. Logic
"nếu rỗng thì bỏ qua" được đóng gói trong `map` của hộp; người viết chỉ mô tả
biến đổi dữ liệu, hộp tự lo safety — không còn `if` lồng, không lỗi
"Cannot read property of null".

</details>

---

## Chương 9 — Monads

### Bài 9.1
Với `Either` trong `9_monads/app.js`, viết chuỗi `chain` xử lý: parse số từ chuỗi → chia 100 → in kết quả hoặc lỗi. Input: `"abc"` và `"200"`.

### Bài 9.2
Vì sao `.then()` của Promise được coi là `chain` (flatMap) chứ không phải `map`?

<details>
<summary>Đáp án 9.1</summary>

```javascript
const parse = (s) =>
  isNaN(Number(s)) ? Left(`không parse được "${s}"`) : Right(Number(s));

const divide100 = (n) => (n === 0 ? Left("chia cho 0") : Right(100 / n));

const run = (s) =>
  parse(s)
    .chain(divide100)
    .fold(
      (error) => `LOI: ${error}`,
      (ok) => `KET QUA: ${ok}`
    );

console.log(run("abc")); // LOI: không parse được "abc"
console.log(run("200")); // KET QUA: 0.5
```

</details>

<details>
<summary>Đáp án 9.2</summary>

Vì callback truyền vào `.then()` thường **trả về một Promise mới**. Nếu `.then()`
chỉ `map` như Functor, ta sẽ nhận `Promise { Promise { ... } }` (nested Promise
Hell). `.then()` tự động làm phẳng hai lớp hộp thành một — chính là ngữ nghĩa
`chain/flatMap` của Monad.

</details>
