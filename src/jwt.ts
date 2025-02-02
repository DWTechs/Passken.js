import { createHmac, timingSafeEqual } from "node:crypto";
import { isNumber, isString, isStringOfLength, isArray, isValidInteger, isBase64 } from "@dwtechs/checkard";
import * as base64 from "./base64";
import type { Header, Payload } from "./types";

const secretMinLength = 32;
const header: Header = {
  alg: "HS256",
  typ: "JWT",
  kid: 0,
};

/**
 * Generate a JWT token
 *
 * @param iss - The issuer of the token, can be a number or a string
 * @param duration - The duration of the token in seconds, if not given, the token will not expire
 * @returns The generated JWT token
 */
function sign(iss: number | string, duration: number, b64Secrets: string[]): string | false {

  // Check iss is a string or a number
  if (!isString(iss, true) || !isNumber(iss, true))
    return false;

  // Check b64Secrets is an array
  if (!isArray(b64Secrets, '>=', 1))
    return false;
    
  header.kid = randomSecret(b64Secrets);
  const b64Secret = b64Secrets[header.kid];

  // Check selected secret is base64
  if (!isBase64(b64Secret, true))
    return false;

  const secret = base64.decode(b64Secret);

  // Check selected secret has the proper length
  if(!isStringOfLength(secret, secretMinLength, undefined))
    return false; 

  const iat = Math.floor(Date.now() / 1000); // Current time in seconds
  const nbf = iat + 1;
  const exp = (duration && duration > 60) ? iat + duration : iat + 60 * 15;
  const payload: Payload = { iss, iat, nbf, exp };

  const b64Header = base64.encode(JSON.stringify(header));
  const b64Payload = base64.encode(JSON.stringify(payload));
  const b64Signature =
    createHmac('sha256', secret)
    .update(`${b64Header}.${b64Payload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${b64Header}.${b64Payload}.${b64Signature}`;

}

function verify(token: string, b64Secrets: string[]): boolean {

  const segments = token.split('.');
  if (segments.length !== 3)
    return false;

  // Split the token into its parts
  const [ B64Header, B64Payload, B64Signature ] = segments;
  if (!B64Header || !B64Payload || !B64Signature)
    return false;
  
  // Check b64Secrets is an array
  if (!isArray(b64Secrets, '>=', 1))
    return false;

  // Decode and parse the header and payload
  const header = JSON.parse(base64.decode(B64Header));
  const payload = JSON.parse(base64.decode(B64Payload));

  // Ensure the algorithm in the header is what we expect (HS256)
  if (header.alg !== 'HS256')
    return false;

  // Ensure the typ in the header is what we expect (JWT)
  if (header.typ !== 'JWT')
    return false;

  const secretsLen = b64Secrets.length;
  // Ensure the kid in the header is what we expect (string or number)
  if (!isValidInteger(header.kid, 0, secretsLen, true))
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

  const b64Secret = b64Secrets[header.kid];
  if (!isStringOfLength(b64Secret, 44, undefined) && !isBase64(b64Secret))
    return false;
  const secret = base64.decode(b64Secret);

  // Verify the signature
  const expectedSignature = createHmac('sha256', secret).update(`${B64Header}.${B64Payload}`).digest('base64');
  if (!safeCompare(expectedSignature, B64Signature))
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

// Generate a random index based on the array length
function randomSecret(array: string[]): number {
  return Math.floor(Math.random() * array.length);
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
