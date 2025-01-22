import { getDigests } from "../dist/passken.js";

describe('getDigests', () => {
  test('returns an array', () => {
    expect(Array.isArray(getDigests())).toBe(true);
  });

  test('returns an array of strings', () => {
    const digests = getDigests();
    expect(digests.every((digest) => typeof digest === 'string')).toBe(true);
  });

  test('returns a non-empty array', () => {
    expect(getDigests().length).toBeGreaterThan(0);
  });

  test('includes the default digest', () => {
    const digests = getDigests();
    expect(digests.includes('sha256')).toBe(true); // default digest
  });
});