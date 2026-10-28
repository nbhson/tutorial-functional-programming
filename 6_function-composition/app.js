// Vi du: ket hop ham theo cong doan go muc (carpentry pipeline)
// cac ham deu la pure function: nhan vao 1 chuoi, tra ve chuoi moi

const cua = (x) => {
  return `${x} đã cưa`;
};

const boQua = (x) => {
  return `${x} đã sấy`;
};

const bao = (x) => {
  return `${x} đã bào`;
};

const khoan = (x) => {
  return `${x} đã khoan`;
};

const cha = (x) => {
  return `${x} đã chà`;
};

const lap = (x) => {
  return `${x} đã gắn móc`;
};

// Buoc 1: chay tuan tu, gan lai bien (chua FP lam)
var sanPham1 = cua("khúc gỗ");
sanPham1 = boQua(sanPham1);
sanPham1 = bao(sanPham1);
sanPham1 = khoan(sanPham1);
sanPham1 = cha(sanPham1);
sanPham1 = lap(sanPham1);
console.log(sanPham1);

// Buoc 2: long ham (nested calls) - kho doc khi qua sau
var sanPham2 = lap(cha(khoan(bao(boQua(cua("khúc gỗ"))))));
console.log(sanPham2);

// Buoc 3: compose - gom thanh mot cong doan duy nhat
const compose = (...fns) => {
  return fns.reduce((f, g) => (x) => f(g(x)));
};

const quyTrinhGoMuc = compose(lap, cha, khoan, bao, boQua, cua);
console.log(quyTrinhGoMuc("khúc gỗ"));

/** Them buoc dan nhan vao cuoi day truyen */
const danNhan = (x) => {
  return `${x} đã dán nhãn`;
};

const lamSanPhamBan = compose(danNhan, lap, cha, khoan, bao, boQua, cua);

const sanPhamBan = lamSanPhamBan("khúc gỗ");
console.log(sanPhamBan);
