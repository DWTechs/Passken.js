const { compare, encrypt } = require("../dist/passken.cjs");

const password = "mySecret!/;6[à}Pwd";
const wrongPassword = "wrongPassword";
const emptyPassword = "";
const secret = "mySuperFancySecret";
const hashedPassword = encrypt(password, secret);

test("returns true when comparing with the right password", () => {
  expect(compare(password, hashedPassword, secret)).toBe(true);
});

test("returns false when comparing with wrong password", () => {
  expect(compare(wrongPassword, hashedPassword, secret)).toBe(false);
});

test("returns false when comparing with an empty password", () => {
  expect(compare(emptyPassword, hashedPassword, secret)).toBe(false);
});

test('returns false when secret is empty', () => {
  expect(compare(password, hashedPassword, '')).toBe(false);
});

test('returns false when hashed password is empty', () => {
  expect(compare(password, '', secret)).toBe(false);
});
