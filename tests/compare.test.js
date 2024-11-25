const { compare } = require("../dist/passken.cjs");

const password = "mySecret!/;6[à}Pwd";
const wrongPassword = "wrongPassword";
const emptyPassword = "";
const secret = "mySuperFancySecret";
// const objectPassword = { password };
// const regexPassword = /mySecret!\/;6\[à}Pwd/;
// const booleanPassword = true;
const hashedPassword = encrypt(password, secret);

test("compare the right password", () => {
  expect(compare(password, hashedPassword, secret)).toBe(true);
});

test("compare a wrong password", () => {
  expect(compare(wrongPassword, hashedPassword, secret)).toBe(false);
});

test("compare an empty password", () => {
  expect(compare(emptyPassword, hashedPassword, secret)).toBe(false);
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
