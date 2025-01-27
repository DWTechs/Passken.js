import { generateSecret } from "../dist/passken.js";

describe('generateSecret', () => {
  it('should generate a secret of the default length (32 bytes)', () => {
    const secret = generateSecret();
    // Base64 encoding of 32 bytes results in a string of length 44
    expect(secret).toHaveLength(43); // 44 - 1 (due to padding removal)
  });

  it('should generate a secret of the specified length (16 bytes)', () => {
    const secret = generateSecret(16);
    // Base64 encoding of 16 bytes results in a string of length 24
    expect(secret).toHaveLength(22); // 24 - 2 (due to padding removal)
  });

  it('should generate a secret of the specified length (64 bytes)', () => {
    const secret = generateSecret(64);
    // Base64 encoding of 64 bytes results in a string of length 88
    expect(secret).toHaveLength(86); // 88 - 2 (due to padding removal)
  });

  it('should not contain "+" characters', () => {
    const secret = generateSecret();
    expect(secret).not.toContain('+');
  });

  it('should not contain "/" characters', () => {
    const secret = generateSecret();
    expect(secret).not.toContain('/');
  });

  it('should not contain "=" characters', () => {
    const secret = generateSecret();
    expect(secret).not.toContain('=');
  });

  it('should generate unique secrets 1', () => {
    const secret1 = generateSecret();
    const secret2 = generateSecret();
    expect(secret1).not.toEqual(secret2);
  });

  it('should generate unique secrets 2', () => {
    const secret1 = generateSecret(64);
    const secret2 = generateSecret(64);
    expect(secret1).not.toEqual(secret2);
  });

  it('should generate unique secrets 3', () => {
    const secret1 = generateSecret(128);
    const secret2 = generateSecret(128);
    expect(secret1).not.toEqual(secret2);
  });
});