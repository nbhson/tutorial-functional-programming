// Functor: bat cu thu gi co method .map() - ap dung ham ben trong hop
// ma khong phai lay gia tri ra khoi hop.

const Box = (x) => ({
  map: (f) => Box(f(x)), // ap dung f len x, roi dong goi lai thanh hop moi
  fold: (f) => f(x),     // mo hop, lay gia tri ra
  toString: () => `Box(${x})`,
});

// 1. Data flow tuyen tinh voi Box
const result = Box("  fp is cool  ")
  .map((s) => s.trim())
  .map((s) => s.toUpperCase())
  .map((s) => `${s}!`)
  .fold((s) => s);
console.log(result); // "FP IS COOL!"

// 2. Maybe: hop dac biet co the rong (null/undefined safety)
const Maybe = (x) => ({
  map: (f) => (x == null ? Maybe(x) : Maybe(f(x))), // hop rong thi bo qua
  fold: (f) => (x == null ? f(null) : f(x)),
  toString: () => `Maybe(${x})`,
});

const getName = (user) => user?.name;
const toUpper = (s) => s.toUpperCase();

// Composition thuong: null lam no ca day truyen
// toUpper(getName(null)); // TypeError!

// Functor: an toan tuyet doi
Maybe(null)
  .map(getName)
  .map(toUpper)
  .map((s) => console.log("khong bao gio in dong nay", s)); // bo qua het

console.log(
  Maybe({ name: "anonystick" }).map(getName).map(toUpper).fold((s) => s)
); // "ANONYSTICK"

// 3. map het suc manh nhung van giu duoc cau truc hop
const priceBox = Box(100)
  .map((p) => p * 0.9)  // giam 10%
  .map((p) => p + 20);  // cong phi van chuyen
console.log(priceBox.toString());
console.log(priceBox.fold((p) => p));
