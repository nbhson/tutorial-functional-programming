// Monad = Functor co them .chain() (flatMap, bind).
// .chain() nhan ham tra ve mot HOP moi, roi lam phang ket qua
// tranh tinh trang hop long nhau: Box(Box(value)).

const Right = (x) => ({
  map: (f) => Right(f(x)),
  chain: (f) => f(x),        // f tra ve hop moi - ta khong dong them hop nua
  fold: (onError, onSuccess) => onSuccess(x),
  toString: () => `Right(${x})`,
});

const Left = (x) => ({
  map: (f) => Left(x),        // loi: bo qua moi bien doi
  chain: (f) => Left(x),      // loi: truyen thang xuong cuoi
  fold: (onError, onSuccess) => onError(x),
  toString: () => `Left(${x})`,
});

const Either = {
  of: (x) => Right(x),
  fromNullable: (x, error) => (x == null ? Left(error) : Right(x)),
};

// 1. Van de: .map() voi ham tra ve hop -> hop long hop
const Box = (x) => ({
  map: (f) => Box(f(x)),
  fold: (f) => f(x),
});
const toBoxOfLength = (s) => Box(s.length);
console.log(Box("hello").map(toBoxOfLength).toString()); // Box(Box(5))
console.log(Box("hello").map(toBoxOfLength).fold((box) => box.fold((n) => n))); // phai mo 2 lan

// 2. Either + chain: xu ly loi khong can try/catch
const findUser = (id) =>
  id === 1 ? Either.of({ id: 1, name: "anonystick" }) : Left("khong tim thay user");

const getAge = (user) =>
  user.age != null ? Right(user.age) : Left("user chua co tuoi");

const classifyAge = (age) =>
  age >= 18 ? Right("nguoi lon") : Left("chua du 18 tuoi");

// Chuoi chain: dieu khien loi theo dai truyen
const result1 = findUser(1)
  .chain(getAge)         // Right -> getAge -> Left("user chua co tuoi")
  .chain(classifyAge)
  .fold(
    (error) => `LOI: ${error}`,
    (ok) => `OK: ${ok}`
  );
console.log(result1); // "LOI: user chua co tuoi"

const result2 = findUser(999)
  .chain(getAge)
  .chain(classifyAge)
  .fold(
    (error) => `LOI: ${error}`,
    (ok) => `OK: ${ok}`
  );
console.log(result2); // "LOI: khong tim thay user"

// 3. So sanh voi Promise: .then() chinh la .chain() cua the gioi async
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getUser = async (id) => {
  await sleep(10);
  return { id, bestFriendId: id === 1 ? 2 : null };
};

// then tra ve Promise -> Promise tu lam phang, khong con Promise { Promise }
getUser(1)
  .then((user) => getUser(user.bestFriendId))
  .then((bestFriend) => console.log("bestFriend nhan truc tiep:", bestFriend));
