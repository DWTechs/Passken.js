// Regression tests for env var parsing (booleans/numbers arrive as strings from process.env)
describe("env variable options", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  test("PWD_RAND_SYMBOLS='false' should disable symbols", () => {
    process.env.PWD_RAND_SYMBOLS = "false";
    const { randomPwd } = require("../dist/passken.js");
    const password = randomPwd();
    expect(/[^a-zA-Z0-9]/.test(password)).toBe(false);
  });

  test("PWD_RAND_LENGTH string should set the generated password length", () => {
    process.env.PWD_RAND_LENGTH = "20";
    const { randomPwd } = require("../dist/passken.js");
    const password = randomPwd();
    expect(password.length).toBe(20);
  });

  test("PWD_VALID_MINLENGTH string should set the minimum validation length", () => {
    process.env.PWD_VALID_MINLENGTH = "20";
    const { isValidPassword } = require("../dist/passken.js");
    expect(isValidPassword("Short1!aaaa")).toBe(false);
  });
});
