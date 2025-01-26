import { createHmac, timingSafeEqual } from "node:crypto";
import { isNumber, isString } from "@dwtechs/checkard";
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
  const nbf = iat + 1;
  const exp = duration && duration > 60 ? iat + duration : iat + 60 * 15;
  const payload: Payload = { iss, iat, nbf, exp };

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

function verify(token: string, secret: string): boolean {

  const segments = token.split('.');
  if (segments.length !== 3)
    return false;

  // Split the token into its parts
  const [ headerB64, payloadB64, signatureB64 ] = segments;
  if (!headerB64 || !payloadB64 || !signatureB64)
    return false;
  
  // Decode and parse the header and payload
  const header = JSON.parse(fromBase64(headerB64));
  const payload = JSON.parse(fromBase64(payloadB64));

  // Ensure the algorithm in the header is what we expect (HS256)
  if (header.alg !== 'HS256')
    return false;

  // Ensure the typ in the header is what we expect (JWT)
  if (header.typ !== 'JWT')
    return false;

  // Ensure the kid in the header is what we expect (string or number)
  if (!isString(header.kid, true) || !isNumber(header.kid, false))
    return false;

  const now = Math.floor(Date.now() / 1000); // Current time in seconds since epoch

  // Validate "nbf" claim
  if (payload.nbf && payload.nbf > now) {
    console.error('JWT cannot be used yet (nbf claim).');
    return false;
  }

  // validate the "exp" claim
  if (payload.exp && payload.exp < now)
    return false;

  // Verify the signature
  const expectedSignature = createHmac('sha256', secret).update(`${headerB64}.${payloadB64}`).digest('base64');
  if (!safeCompare(expectedSignature, signatureB64))
    return false;

  return payload;

}

/**
 * Securely compares two strings to prevent timing attacks.
 * @param {string} a 
 * @param {string} b 
 * @returns {boolean} True if both strings are equal, false otherwise.
 */
function safeCompare(a: string, b: string): boolean {
  const safeA = Buffer.from(a);
  const safeB = Buffer.from(b);
  return timingSafeEqual(safeA, safeB);
}

/**
 * Decodes Base64Url encoded strings.
 * @param {string} str 
 * @returns {string} Decoded string.
 */
function fromBase64(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  return Buffer.from(base64 + padding, "base64").toString();
}

/**
 * Encodes the given data and returns it as a base64 string.
 *
 * @param {string} data - The data to be encrypted.
 * @return {string} The encrypted data in base64 format.
 */
function toBase64(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Example usage:
// const payload = { userId: 123, role: 'admin' };
// const secret = 'your-secret-key';
// const options = { algorithm: 'HS256', expiresIn: '1h' };

// const token = signToken(payload, secret, options);
// console.log('Signed Token:', token);

export {
  sign,
  verify,
};
