import { encodeBase64 } from "../dist/passken.js";

describe('encodeBase64', () => {

  test('should encode a simple string to base64 format', () => {
    const input = 'Passken';
    const expectedOutput = 'UGFzc2tlbg==';
    expect(encodeBase64(input)).toBe(expectedOutput);
  });

  test('should encode an empty string to an empty base64 string', () => {
    const input = '';
    const expectedOutput = '';
    expect(encodeBase64(input)).toBe(expectedOutput);
  });

  test('should correctly encode strings with non-ASCII characters', () => {
    const input = 'Hello, 世界!';
    const expectedOutput = 'SGVsbG8sIOS4lueVjCE=';
    expect(encodeBase64(input)).toBe(expectedOutput);
  });

  test('should correctly encode stringified objects', () => {
    const input = {
      alg: "HS256",
      typ: "JWT",
      kid: 335,
    };
    const expectedOutput = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6MzM1fQ==';
    expect(encodeBase64(JSON.stringify(input))).toBe(expectedOutput);
  });

});