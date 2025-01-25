import { createHmac } from "node:crypto";
import type { Header, Payload } from "./types";

const header: Header = {
  alg: "HS256",
  typ: "JWT",
  kid: null,
};

  /**
   * Generate a JWT token
   *
   * @param iss - The issuer of the token, can be a number or a string
   * @param duration - The duration of the token in seconds, if not given, the token will not expire
   * @returns The generated JWT token
   */
function sign(iss: number | string, duration: number, secret: string): string {

  const iat = Math.floor(Date.now() / 1000); // Current time in seconds
  const payload: Payload = { iss, iat };

  if (duration)
    payload.exp = iat + duration;

  header.kid = iss;

  const b64Header = toBase64(JSON.stringify(header));
  const b64Payload = toBase64(JSON.stringify(payload));

  const signature =
    createHmac('sha256', secret)
    .update(`${b64Header}.${b64Payload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${b64Header}.${b64Payload}.${signature}`;

}

/**
 * Encodes the given data and returns it as a base64 string.
 *
 * @param {string} data - The data to be encrypted.
 * @return {string} The encrypted data in base64 format.
 */
function toBase64(data: string): string {
  return Buffer.from(data).toString("base64");
}

// Example usage:
// const payload = { userId: 123, role: 'admin' };
// const secret = 'your-secret-key';
// const options = { algorithm: 'HS256', expiresIn: '1h' };

// const token = signToken(payload, secret, options);
// console.log('Signed Token:', token);

export {
  sign,
};
