import { isValidPassword } from "../dist/passken";

describe("isValidPassword throwErr behavior", () => {
  const defaultOptions = {
    lcase: true,
    ucase: true,
    num: true,
    sym: true,
    minLen: 12,
    maxLen: 64,
  };

  it("throws error when password is too short", () => {
    expect(() => isValidPassword("Short1!", defaultOptions, true)).toThrow();
  });

  it("throws error when password is too long", () => {
    const longPassword = "a".repeat(65) + "1A!";
    expect(() => isValidPassword(longPassword, defaultOptions, true)).toThrow();
  });

  it("throws error when password lacks lowercase letters", () => {
    const options = { ...defaultOptions, lcase: true };
    expect(() => isValidPassword("PASSWORD123!", options, true)).toThrow();
  });

  it("throws error when password lacks uppercase letters", () => {
    const options = { ...defaultOptions, ucase: true };
    expect(() => isValidPassword("password123!", options, true)).toThrow();
  });

  it("throws error when password lacks numbers", () => {
    const options = { ...defaultOptions, num: true };
    expect(() => isValidPassword("PasswordABC!", options, true)).toThrow();
  });

  it("throws error when password lacks special characters", () => {
    const options = { ...defaultOptions, sym: true };
    expect(() => isValidPassword("Password123", options, true)).toThrow();
  });

  it("throws error when password is exactly at minimum length but missing requirements", () => {
    const shortOptions = { ...defaultOptions, minLen: 8 };
    expect(() => isValidPassword("password", shortOptions, true)).toThrow();
  });

  it("throws error when password has insufficient length", () => {
    const options = { ...defaultOptions, minLen: 15 };
    expect(() => isValidPassword("Pass123!", options, true)).toThrow();
  });

  it("throws error when password exceeds maximum length", () => {
    const options = { ...defaultOptions, maxLen: 10 };
    expect(() => isValidPassword("Password123!", options, true)).toThrow();
  });

  it("throws error when password violates multiple requirements", () => {
    expect(() => isValidPassword("pass", defaultOptions, true)).toThrow();
  });

  describe("Partial options throw behavior", () => {
    it("throws error with only length requirement", () => {
      const lengthOnlyOptions = {
        minLen: 10,
        maxLen: 20
      };
      
      expect(() => isValidPassword("short", lengthOnlyOptions, true)).toThrow();
      expect(() => isValidPassword("verylongpasswordthatexceedslimit", lengthOnlyOptions, true)).toThrow();
    });

    it("throws error with only lowercase requirement", () => {
      const lowerCaseOnlyOptions = {
        lcase: true
      };
      
      expect(() => isValidPassword("NOLOWERCASE", lowerCaseOnlyOptions, true)).toThrow();
    });

    it("throws error with only uppercase requirement", () => {
      const upperCaseOnlyOptions = {
        ucase: true
      };
      
      expect(() => isValidPassword("nouppercase", upperCaseOnlyOptions, true)).toThrow();
    });

    it("throws error with only number requirement", () => {
      const numberOnlyOptions = {
        num: true
      };
      
      expect(() => isValidPassword("NoNumbers", numberOnlyOptions, true)).toThrow();
    });

    it("throws error with only special character requirement", () => {
      const specialCharOnlyOptions = {
        sym: true
      };
      
      expect(() => isValidPassword("NoSpecialChars", specialCharOnlyOptions, true)).toThrow();
    });

    it("throws error with mixed partial requirements", () => {
      // Length and lowercase only
      const lengthAndLowerOptions = {
        minLen: 12,
        lcase: true
      };
      
      expect(() => isValidPassword("LONGPASSWORD", lengthAndLowerOptions, true)).toThrow(); // no lowercase
      expect(() => isValidPassword("short", lengthAndLowerOptions, true)).toThrow(); // too short
      
      // Uppercase and numbers only
      const upperAndNumberOptions = {
        ucase: true,
        num: true
      };
      
      expect(() => isValidPassword("password123", upperAndNumberOptions, true)).toThrow(); // no uppercase
      expect(() => isValidPassword("PASSWORD", upperAndNumberOptions, true)).toThrow(); // no numbers
      
      // Special chars and length only
      const specialAndLengthOptions = {
        sym: true,
        maxLen: 10
      };
      
      expect(() => isValidPassword("password", specialAndLengthOptions, true)).toThrow(); // no special chars
      expect(() => isValidPassword("verylongpassword!", specialAndLengthOptions, true)).toThrow(); // too long
    });

    it("throws error with empty options object", () => {
      const emptyOptions = {};
      
      // Should use default behavior and throw for invalid passwords
      expect(() => isValidPassword("weak", emptyOptions, true)).toThrow();
      expect(() => isValidPassword("", emptyOptions, true)).toThrow();
    });

    it("throws error with single requirement violation", () => {
      // Test individual requirements in isolation
      expect(() => isValidPassword("UPPERCASE123!", { lcase: true }, true)).toThrow();
      expect(() => isValidPassword("lowercase123!", { ucase: true }, true)).toThrow();
      expect(() => isValidPassword("Password!", { num: true }, true)).toThrow();
      expect(() => isValidPassword("Password123", { sym: true }, true)).toThrow();
      expect(() => isValidPassword("short", { minLen: 10 }, true)).toThrow();
      expect(() => isValidPassword("toolongpassword", { maxLen: 8 }, true)).toThrow();
    });

    it("throws specific error messages for partial options", () => {
      // Verify specific error messages are thrown for each requirement
      expect(() => isValidPassword("NOLOWERCASE123456789", { lcase: true, ucase: false, num: false, sym: false, minLen: 1, maxLen: 100 }, true)).toThrow(/lowercase/);
      expect(() => isValidPassword("nouppercase123456789", { ucase: true, lcase: false, num: false, sym: false, minLen: 1, maxLen: 100 }, true)).toThrow(/uppercase/);
      expect(() => isValidPassword("NoNumbersHereAtAll", { num: true, lcase: false, ucase: false, sym: false, minLen: 1, maxLen: 100 }, true)).toThrow(/numbers/);
      expect(() => isValidPassword("NoSpecialCharsHere", { sym: true, lcase: false, ucase: false, num: false, minLen: 1, maxLen: 100 }, true)).toThrow(/special/);
      expect(() => isValidPassword("short", { minLen: 10 }, true)).toThrow(/length/);
    });
  });
});