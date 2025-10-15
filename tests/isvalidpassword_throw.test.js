import { isValidPassword } from "../../dist/passken";

describe("isValidPassword throwErr behavior", () => {
  const defaultOptions = {
    lowerCase: true,
    upperCase: true,
    number: true,
    specialCharacter: true,
    minLength: 12,
    maxLength: 64,
  };

  it("throws error when password is too short", () => {
    expect(() => isValidPassword("Short1!", defaultOptions, true)).toThrow();
  });

  it("throws error when password is too long", () => {
    const longPassword = "a".repeat(65) + "1A!";
    expect(() => isValidPassword(longPassword, defaultOptions, true)).toThrow();
  });

  it("throws error when password lacks lowercase letters", () => {
    const options = { ...defaultOptions, lowerCase: true };
    expect(() => isValidPassword("PASSWORD123!", options, true)).toThrow();
  });

  it("throws error when password lacks uppercase letters", () => {
    const options = { ...defaultOptions, upperCase: true };
    expect(() => isValidPassword("password123!", options, true)).toThrow();
  });

  it("throws error when password lacks numbers", () => {
    const options = { ...defaultOptions, number: true };
    expect(() => isValidPassword("PasswordABC!", options, true)).toThrow();
  });

  it("throws error when password lacks special characters", () => {
    const options = { ...defaultOptions, specialCharacter: true };
    expect(() => isValidPassword("Password123", options, true)).toThrow();
  });

  it("throws error when password is exactly at minimum length but missing requirements", () => {
    const shortOptions = { ...defaultOptions, minLength: 8 };
    expect(() => isValidPassword("password", shortOptions, true)).toThrow();
  });

  it("throws error when password has insufficient length", () => {
    const options = { ...defaultOptions, minLength: 15 };
    expect(() => isValidPassword("Pass123!", options, true)).toThrow();
  });

  it("throws error when password exceeds maximum length", () => {
    const options = { ...defaultOptions, maxLength: 10 };
    expect(() => isValidPassword("Password123!", options, true)).toThrow();
  });

  it("throws error when password violates multiple requirements", () => {
    expect(() => isValidPassword("pass", defaultOptions, true)).toThrow();
  });

  describe("Partial options throw behavior", () => {
    it("throws error with only length requirement", () => {
      const lengthOnlyOptions = {
        minLength: 10,
        maxLength: 20
      };
      
      expect(() => isValidPassword("short", lengthOnlyOptions, true)).toThrow();
      expect(() => isValidPassword("verylongpasswordthatexceedslimit", lengthOnlyOptions, true)).toThrow();
    });

    it("throws error with only lowercase requirement", () => {
      const lowerCaseOnlyOptions = {
        lowerCase: true
      };
      
      expect(() => isValidPassword("NOLOWERCASE", lowerCaseOnlyOptions, true)).toThrow();
    });

    it("throws error with only uppercase requirement", () => {
      const upperCaseOnlyOptions = {
        upperCase: true
      };
      
      expect(() => isValidPassword("nouppercase", upperCaseOnlyOptions, true)).toThrow();
    });

    it("throws error with only number requirement", () => {
      const numberOnlyOptions = {
        number: true
      };
      
      expect(() => isValidPassword("NoNumbers", numberOnlyOptions, true)).toThrow();
    });

    it("throws error with only special character requirement", () => {
      const specialCharOnlyOptions = {
        specialCharacter: true
      };
      
      expect(() => isValidPassword("NoSpecialChars", specialCharOnlyOptions, true)).toThrow();
    });

    it("throws error with mixed partial requirements", () => {
      // Length and lowercase only
      const lengthAndLowerOptions = {
        minLength: 12,
        lowerCase: true
      };
      
      expect(() => isValidPassword("LONGPASSWORD", lengthAndLowerOptions, true)).toThrow(); // no lowercase
      expect(() => isValidPassword("short", lengthAndLowerOptions, true)).toThrow(); // too short
      
      // Uppercase and numbers only
      const upperAndNumberOptions = {
        upperCase: true,
        number: true
      };
      
      expect(() => isValidPassword("password123", upperAndNumberOptions, true)).toThrow(); // no uppercase
      expect(() => isValidPassword("PASSWORD", upperAndNumberOptions, true)).toThrow(); // no numbers
      
      // Special chars and length only
      const specialAndLengthOptions = {
        specialCharacter: true,
        maxLength: 10
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
      expect(() => isValidPassword("UPPERCASE123!", { lowerCase: true }, true)).toThrow();
      expect(() => isValidPassword("lowercase123!", { upperCase: true }, true)).toThrow();
      expect(() => isValidPassword("Password!", { number: true }, true)).toThrow();
      expect(() => isValidPassword("Password123", { specialCharacter: true }, true)).toThrow();
      expect(() => isValidPassword("short", { minLength: 10 }, true)).toThrow();
      expect(() => isValidPassword("toolongpassword", { maxLength: 8 }, true)).toThrow();
    });

    it("throws specific error messages for partial options", () => {
      // Verify specific error messages are thrown for each requirement
      expect(() => isValidPassword("NOLOWER", { lowerCase: true }, true)).toThrow(/lowercase/);
      expect(() => isValidPassword("noupper", { upperCase: true }, true)).toThrow(/uppercase/);
      expect(() => isValidPassword("NoNumbers", { number: true }, true)).toThrow(/numbers/);
      expect(() => isValidPassword("NoSpecial", { specialCharacter: true }, true)).toThrow(/special/);
      expect(() => isValidPassword("short", { minLength: 10 }, true)).toThrow(/length/);
    });
  });
});