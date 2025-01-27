import { verify } from "../dist/passken.js";

// Mock data
const validToken = 'valid.token.signature';
const invalidToken = 'invalid.token.signature';
const b64Secrets = ['your-base64-secret'];

jest.mock('./base64', () => ({
  decode: jest.fn((str) => {
    if (str === 'valid.token') {
      return JSON.stringify({ alg: 'HS256', typ: 'JWT', kid: 0 });
    }
    if (str === 'valid.payload') {
      return JSON.stringify({ iss: 'issuer', iat: 1610000000, exp: 1610003600 });
    }
    return '';
  }),
}));

describe('verify', () => {
  it('should return false for a token with invalid segments', () => {
    const result = verify('invalid.token', b64Secrets);
    expect(result).toBe(false);
  });

  it('should return false for a token with invalid header', () => {
    const result = verify(invalidToken, b64Secrets);
    expect(result).toBe(false);
  });

  it('should return false for a token with invalid payload', () => {
    const result = verify('valid.token.invalidPayload', b64Secrets);
    expect(result).toBe(false);
  });

  it('should return false for a token with invalid algorithm', () => {
    const invalidAlgToken = 'invalidAlg.token.signature';
    const result = verify(invalidAlgToken, b64Secrets);
    expect(result).toBe(false);
  });

  it('should return false for a token with invalid typ', () => {
    const invalidTypToken = 'invalidTyp.token.signature';
    const result = verify(invalidTypToken, b64Secrets);
    expect(result).toBe(false);
  });

  it('should return false for a token with invalid kid', () => {
    const invalidKidToken = 'invalidKid.token.signature';
    const result = verify(invalidKidToken, b64Secrets);
    expect(result).toBe(false);
  });

  it('should return false for a token with nbf claim in the future', () => {
    const futureNbfToken = 'futureNbf.token.signature';
    const result = verify(futureNbfToken, b64Secrets);
    expect(result).toBe(false);
  });

  it('should return false for a token with exp claim in the past', () => {
    const pastExpToken = 'pastExp.token.signature';
    const result = verify(pastExpToken, b64Secrets);
    expect(result).toBe(false);
  });

  it('should return true for a valid token', () => {
    const result = verify(validToken, b64Secrets);
    expect(result).toBe(true);
  });

});