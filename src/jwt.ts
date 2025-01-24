import { createHmac } from "node:crypto";
import type { Header, Payload } from "./types";

const { TOKEN_SECRET } = process.env;
  
let b64Secret: string | null = null;
const header: Header = {
  alg: "HS256",
  typ: "JWT",
  kid: null,
};

if (TOKEN_SECRET)
  setSecret(TOKEN_SECRET);

function setSecret(secret: string): void {
  b64Secret = encodeBase64(secret);
}

/**
 * Create a JSON Web Token.
 *
 * @param {Object} payload - The payload to include in the token.
 * @param {string} secret - The secret key to sign the token.
 * @param {Object} [options] - Optional settings for the token (e.g., algorithm, expiresIn).
 * @return {string} The signed JWT.
 */
function sign(iss: number | string, duration: number): string {

  const iat = Math.floor(Date.now() / 1000); // Current time in seconds
  const payload: Payload = { iss, iat };

  if (duration)
    payload.exp = iat + duration;

  header.kid = iss;

  const encodedHeader = encodeBase64(JSON.stringify(header));
  const encodedPayload = encodeBase64(JSON.stringify(payload));

  const signature =
    createHmac('sha256', b64Secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;

}

/**
 * Encrypts the given data and returns it as a base64 string.
 *
 * @param {string} data - The data to be encrypted.
 * @return {string} The encrypted data in base64 format.
 */
function encodeBase64(data: string): string {
  return Buffer.from(data).toString("base64");
}

// Example usage:
// const payload = { userId: 123, role: 'admin' };
// const secret = 'your-secret-key';
// const options = { algorithm: 'HS256', expiresIn: '1h' };

// const token = signToken(payload, secret, options);
// console.log('Signed Token:', token);

export {
  setSecret,
  sign,
};
