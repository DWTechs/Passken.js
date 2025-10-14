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
});