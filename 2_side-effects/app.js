// Side effects: co lap IO ra ria ung dung, core logic van la pure function.
// Ky thuat: IO injection - truyen IO qua tham so thay vi goi truc tiep.

// ---- Impure: logic va IO dan len nhau ----
// function createGreeting(name) {
//   console.log(`Hello, ${name}!`); // side effect ngoai y muon
//   return `Hello, ${name}!`;
// }

// ---- Pure core: chi tinh toan, khong IO ----
const createGreeting = (name) => `Hello, ${name}!`;

const buildMessage = (greeting, time, random) => {
  // time va random duoc inject - cung tham so cung ket qua (determinism)
  return `${greeting} (gui luc ${time}, so may man: ${random})`;
};

// ---- Impure shell: moi cho chua side effects ----
const effects = {
  log: (msg) => console.log(msg),
  now: () => new Date().toLocaleTimeString(),
  random: () => Math.floor(Math.random() * 100),
  write: (msg, sink) => sink.push(msg), // "file/db" gia lap
};

// ---- Glue: ket noi core va shell ----
const sendMessage = (name, io, sink) => {
  const greeting = createGreeting(name); // pure
  const message = buildMessage(greeting, io.now(), io.random()); // pure
  io.write(message, sink); // side effect duy nhat, nam o ria
  io.log(message);
  return message;
};

// ---- Chay thu ----
const sink = [];
sendMessage("Son", effects, sink);
sendMessage("Anonystick", effects, sink);

// Cung 1 output khi truyen cung input -> de test
const testRun = sendMessage("Test", effects, sink);
console.log("So ban ghi da ghi:", sink.length);
console.log(testRun);
