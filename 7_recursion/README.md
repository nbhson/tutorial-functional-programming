# 7. Recursion (đệ quy)

Trong FP thuần túy (như Haskell), không có vòng lặp (`for`, `while`). Để lặp, ta dùng **Đệ quy**.

## Đệ quy là gì?

Đệ quy là khi một hàm tự gọi lại chính nó cho đến khi gặp một điều kiện dừng (Base Case).

### Ví dụ: Tính giai thừa (Factorial)

*   **Imperative (Vòng lặp `for`):**
```javascript
function factorialLoop(n) {
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= i; // Mutation!
  }
  return result;
}
```

*   **Recursive (FP):**
```javascript
function factorial(n) {
  // 1. Base case (Điều kiện dừng)
  if (n === 0) return 1;
  
  // 2. Recursive step (Gọi lại chính mình với input nhỏ hơn)
  return n * factorial(n - 1);
}
```

## Tại sao dùng Đệ quy?

### 1. Không cần Mutable State
Trong vòng lặp `for`, bạn phải dùng biến `let i`, `let result` và thay đổi chúng liên tục. Đệ quy không cần biến tạm, trạng thái được truyền qua tham số hàm.

### 2. Giải quyết bài toán cấu trúc cây (Tree)
Đệ quy cực mạnh khi làm việc với cây thư mục, DOM, JSON nested... nơi mà bạn không biết trước độ sâu của dữ liệu.

```javascript
// Duyệt cây thư mục
const traverse = (node) => {
  console.log(node.name);
  if (node.children) {
    node.children.forEach(traverse); // Đệ quy tự nhiên
  }
};
```

## Nhược điểm: Performance & Stack Overflow

Mỗi lần gọi hàm, máy tính phải lưu trạng thái vào Stack. Nếu đệ quy quá sâu (ví dụ 10,000 lần), Stack sẽ bị đầy -> Tràn bộ nhớ (Stack Overflow).

### Giải pháp: Tail Call Optimization (TCO)
Là kỹ thuật viết đệ quy sao cho bước cuối cùng của hàm CHỈ LÀ gọi lại chính nó (không làm thêm phép tính nào khác).

```javascript
// Non-TCO: Phải chờ factorial(n-1) về rồi mới nhân n
return n * factorial(n - 1); 

// TCO: Truyền kết quả tích lũy (acc) đi luôn
function factorialTail(n, acc = 1) {
  if (n === 0) return acc;
  return factorialTail(n - 1, n * acc); // Chỉ gọi hàm, không nhân thêm gì ở ngoài
}
```

> **Lưu ý:** Hiện tại chỉ có Safari hỗ trợ chuẩn TCO trong JS. Các trình duyệt khác (Chrome/Node) vẫn có thể bị Stack Overflow. Vì vậy trong JS thực tế, người ta thường dùng `Trampoline` hoặc `vòng lặp` bên trong một hàm wrapper để an toàn, hoặc dùng `reduce` thay thế.