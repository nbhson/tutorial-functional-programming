// Nen clone object va xu li tren object moi (Immutability)
const person = {
  name: "Anonystick",
  profession: "Developer",
  description: ` Bad Developer`,
};

// Tao object moi bang spread, khong sua person goc
const updatedPerson = {
  ...person,
  name: "CR7",
};

const greatestPlayer = {
  ...updatedPerson,
  description: `World's greatest Player`,
};

console.log(person); // goc khong doi
console.log(updatedPerson);
console.log(greatestPlayer);
