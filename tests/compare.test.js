import { compare } from "../dist/passken";

const password = "mySecret!/;6[à}Pwd";
const wrongPassword = "wrongPassword";
const emptyPassword = "";
// const objectPassword = { password };
// const regexPassword = /mySecret!\/;6\[à}Pwd/;
// const booleanPassword = true;
const hashedPassword = encrypt(password, getSaltRounds()); // Using the same saltRounds as in the encrypt function

test("compare the right password", () => {
  expect(compare(password, hashedPassword)).toBe(true);
});

test("compare a wrong password", () => {
  expect(compare(wrongPassword, hashedPassword)).toBe(false);
});

test("compare an empty password", () => {
  expect(compare(emptyPassword, hashedPassword)).toBe(false);
});

// test("compare an object password", () => {
//   expect(compare(objectPassword, hashedPassword)).toBe(false);
// });

// test("compare a regex password", () => {
//   expect(compare(regexPassword, hashedPassword)).toBe(false);
// });

// test("compare a boolean password", () => {
//   expect(compare(booleanPassword, hashedPassword)).toBe(false);
// });
