import { hash, tse } from "./hash.js"; 
import {
	isNumber,
	isString,
	isArray,
	isJson,
	isPositive,
  isBase64, 
  b64Encode,
  b64Decode
} from "@dwtechs/checkard";
import type { Header, Payload, Type } from "./types";

const header: Header = {
  alg: "HS256", // HMAC using SHA-256 hash algorithm
  typ: "JWT", // JSON Web Token
  kid: 0, // Random key ID
};

/**
 * Signs a JWT (JSON Web Token) with the given parameters.
 *
 * @param {number|string} iss - The issuer of the token, which can be a string or a number.
 * @param {number} duration - The duration for which the token is valid, in seconds.
 * @param {Type} type - The type of the token, either "access" or "refresh".
 * @param {string[]} b64Keys - An array of base64 encoded secrets used for signing the token.
 * @returns {string} The signed JWT as a string.
 * @throws Will throw an error if `iss` is not a string or a number.
 * @throws Will throw an error if `b64Keys` is not an array.
 * @throws Will throw an error if `duration` is not a positive number.
 * @throws Will throw an error if the secret cannot be decoded.
 */
function sign(
	iss: number | string,
	duration: number,
  type: Type,
	b64Keys: string[],
): string {
	// Check iss is a string or a number
	if (!isString(iss, "!0") && !isNumber(iss, true))
    throw new Error("iss must be a string or a number");

	// Check b64Keys is an array
	if (!isArray(b64Keys, ">", 0)) 
    throw new Error("b64Keys must be an array");

	if (!isNumber(duration, false) || !isPositive(duration, true)) 
    throw new Error("duration must be a positive number");

	header.kid = randomPick(b64Keys);
	const b64Secret = b64Keys[header.kid];

	const secret = b64Decode(b64Secret, true);
	if (!secret)
    throw new Error("could not decode the secret");

	const iat = Math.floor(Date.now() / 1000); // Current time in seconds
	const nbf = iat + 1;
	const exp = duration > 60 ? iat + duration : iat + 60 * 15;
  const typ = type === "refresh" ? type : "access";
	const payload: Payload = { iss, iat, nbf, exp, typ };

	const b64Header = b64Encode(JSON.stringify(header));
	const b64Payload = b64Encode(JSON.stringify(payload));
  const b64Signature = hash(`${b64Header}.${b64Payload}`, secret);

	return `${b64Header}.${b64Payload}.${b64Signature}`;
}

/**
 * Verifies a JWT token using the provided base64-encoded secrets.
 *
 * @param {string} token - The JWT token to verify.
 * @param {string[]} b64Keys - An array of base64-encoded secrets used for verification.
 * @param {boolean} ignoreExpiration - Optional flag to ignore the expiration time of the token. Defaults to false.
 * @returns {Payload} The decoded payload of the JWT token as a string.
 * @throws Will throw an error if the token does not have 3 segments.
 * @throws Will throw an error if the token does not have a header, payload, and signature.
 * @throws Will throw an error if b64Keys is not an array.
 * @throws Will throw an error if the header or payload are not valid JSON.
 * @throws Will throw an error if the algorithm or token type are not supported.
 * @throws Will throw an error if the kid in the header is invalid.
 * @throws Will throw an error if the token cannot be used yet (nbf claim).
 * @throws Will throw an error if the token has expired (exp claim).
 * @throws Will throw an error if the secret is not valid base64 url-sale encoded.
 * @throws Will throw an error if the signature is invalid.
 */
function verify(token: string, b64Keys: string[], ignoreExpiration = false): Payload {
	const segments = token.split(".");
	if (segments.length !== 3)
    throw new Error("Token must have 3 segments");

	// Split the token into its parts
	const [b64Header, b64Payload, b64Signature] = segments;
	if (!b64Header || !b64Payload || !b64Signature) 
    throw new Error("Token Must have header, payload and signature");

	// Check b64Keys is an array
	if (!isArray(b64Keys, ">", 0)) 
    throw new Error("b64Keys must be an array");

	// Decode and parse the header and payload
	const headerString = b64Decode(b64Header);
	const payloadString = b64Decode(b64Payload);
	if (!isJson(headerString) || !isJson(payloadString))
    throw new Error("Header and payload must be JSON");
	
	const header = JSON.parse(headerString);
	const payload = JSON.parse(payloadString);

	// Ensure the algorithm in the header is what we expect (HS256)
	if (header.alg !== "HS256")
    throw new Error("Algorithm not supported");

	// Ensure the typ in the header is what we expect (JWT)
	if (header.typ !== "JWT")
    throw new Error("Token type not supported");

	// Ensure the kid in the header is what we expect (string or number)
  if (!isString(header.kid, "!0") && !isNumber(header.kid, true))
    throw new Error("Invalid kid in header");

	const now = Math.floor(Date.now() / 1000); // Current time in seconds since epoch

	// Validate "nbf" claim
	if (payload.nbf && payload.nbf > now)
    throw new Error("JWT cannot be used yet (nbf claim)");

	// validate the "exp" claim
	if (!ignoreExpiration && payload.exp < now)
    throw new Error("JWT has expired (exp claim)");

	const b64Secret = b64Keys[header.kid];
	if (!isBase64(b64Secret, true))
    throw new Error("Secret must be base64 url-safe encoded");

	const secret = b64Decode(b64Secret);

	// Verify the signature
  const expectedSignature = hash(`${b64Header}.${b64Payload}`, secret);
  const safeA = Buffer.from(expectedSignature);
  const safeB = Buffer.from(b64Signature);
  // if (safeB.length >= 32)
  //     throw new Error("Hashes must be at least 256 bits long");
	if (!tse(safeA, safeB)) 
    throw new Error("Invalid signature");

	return payload;
}

/**
 * Extracts the JWT token from an HTTP Authorization header with Bearer authentication scheme.
 * 
 * This function validates that the authorization header follows the correct Bearer token format
 * ("Bearer <token>") and extracts the token portion for further processing.
 * 
 * @param {string | undefined} authorization - The Authorization header value from an HTTP request
 * @returns {string} The extracted JWT token as a string
 * @throws {Error} Will throw an error if the authorization parameter is undefined
 * @throws {Error} Will throw an error if the format is invalid
 * 
 * @example
 * ```typescript
 * // Valid Bearer tokens
 * const validHeader = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
 * const token = parseBearerToken(validHeader);
 * // Returns: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * 
 * // Handles multiple spaces
 * const headerWithSpaces = "Bearer    token123";
 * const token2 = parseBearerToken(headerWithSpaces);
 * // Returns: "token123"
 * 
 * // Invalid headers - these will throw specific errors
 * try {
 *   parseBearerToken(undefined); // Throws: "Authorization header is missing"
 *   parseBearerToken(""); // Throws: "Authorization header must be in the format 'Bearer <token>'"
 *   parseBearerToken("Basic dXNlcjpwYXNz"); // Throws: "Authorization header must be in the format 'Bearer <token>'"
 *   parseBearerToken("Bearer"); // Throws: "Authorization header must be in the format 'Bearer <token>'"
 *   parseBearerToken("Bearer "); // Throws: "Authorization header must be in the format 'Bearer <token>'"
 * } catch (error) {
 *   console.error('Authorization error:', error.message);
 * }
 * ```
 * 
 */
const BEARER_TOKEN_ERROR_MESSAGE = "Authorization header must be in the format 'Bearer <token>'";
const MISSING_AUTHORIZATION_ERROR_MESSAGE = "Authorization header is missing";

function parseBearerToken(authorization: string | undefined): string {
  
  if (!authorization)
    throw new Error(MISSING_AUTHORIZATION_ERROR_MESSAGE);
  
  if (!authorization.startsWith("Bearer "))
    throw new Error(BEARER_TOKEN_ERROR_MESSAGE);

  // Split by spaces and filter out empty strings to handle multiple spaces
  const parts = authorization.split(" ").filter(part => part.length > 0);
  
  if (parts.length < 2 || !parts[1])
    throw new Error(BEARER_TOKEN_ERROR_MESSAGE);

  return parts[1];

}

// Generate a random index based on an array length
function randomPick(array: string[]): number {
	return Math.floor(Math.random() * array.length);
}

export { 
  sign, 
  verify,
  parseBearerToken,
  BEARER_TOKEN_ERROR_MESSAGE,
  MISSING_AUTHORIZATION_ERROR_MESSAGE,
};
