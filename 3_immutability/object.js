// Sai tinh bat bien: dung let va sua truc tiep object (Mutation)
let person = {
  name: "Anonystick",
  profession: "Developer",
  description: ` Bad Developer`,
};
person.name = "CR7";
person.description = `World's greatest Player`;

console.log(person);
// Object goc da bi thay doi ngam - noi khac cung co the thay doi
// person ma khong ai hay: kho debug, kho doan trang thai.
