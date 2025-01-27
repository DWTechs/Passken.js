import { sign } from "../dist/passken.js";

describe('encodeBase64', () => {
  const secret = ["fjkldmfq4543REfndjkldrGtfvCgbGhNhgFdCvFdSERD"];
  test('generates a token string with valid inputs', () => {
    const token = sign('user123', 3600, secret); // Assuming duration is in seconds
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // Basic check for JWT structure
  });

  // test('throws an error with invalid issuer type', () => {
  //   expect(() => sign(undefined, 3600)).toThrow();
  //   expect(() => sign(null, 3600)).toThrow();
  // });

  // More detailed JWT structure and expiration validation can be done
  // using a JWT library to decode and inspect the payload.
  test('correctly sets the expiration based on duration', () => {
    const currentTime = Math.floor(Date.now() / 1000);
    const duration = 3600; // 1 hour
    const token = sign('user123', duration, secret);
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    
    expect(payload.exp).toBeDefined();
    expect(payload.exp).toBeGreaterThan(currentTime);
    expect(payload.exp - currentTime).toBeCloseTo(duration, -1); // Allowing some leeway for execution time
  });

});