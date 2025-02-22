import { timingSafeEqual } from "node:crypto";
import { hash } from "./hash.js"; 
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
function sign(
	iss: number | string,
	duration: number,
  type: Type,
	b64Secrets: string[],
): string | false {
	// Check iss is a string or a number
	if (!isString(iss, "!0") && !isNumber(iss, true))
    throw new Error("iss must be a string or a number");

	// Check b64Secrets is an array
	if (!isArray(b64Secrets, ">", 0)) 
    throw new Error("b64Secrets must be an array");

	if (!isNumber(duration, false) || !isPositive(duration, true)) 
    throw new Error("duration must be a positive number");

	header.kid = randomPick(b64Secrets);
	const b64Secret = b64Secrets[header.kid];

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
  const signature = hash(`${b64Header}.${b64Payload}`, secret);
	const b64Signature = b64Encode(signature, true);

	return `${b64Header}.${b64Payload}.${b64Signature}`;
}

function verify(token: string, b64Secrets: string[], ignoreExpiration = false): boolean {
	const segments = token.split(".");
	if (segments.length !== 3)
    throw new Error("Token must have 3 segments");

	// Split the token into its parts
	const [b64Header, b64Payload, b64Signature] = segments;
	if (!b64Header || !b64Payload || !b64Signature) 
    throw new Error("Token Must have header, payload and signature");

	// Check b64Secrets is an array
	if (!isArray(b64Secrets, ">", 0)) 
    throw new Error("b64Secrets must be an array");

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

	const b64Secret = b64Secrets[header.kid];
	if (!isString(b64Secret, ">=", 40) || !isBase64(b64Secret, true))
    throw new Error("Invalid secret");

	const secret = b64Decode(b64Secret);

	// Verify the signature
  const expectedSignature = b64Encode(hash(`${b64Header}.${b64Payload}`, secret), true);
	if (!safeCompare(expectedSignature, b64Signature)) 
    throw new Error("Invalid signature");

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
function randomPick(array: string[]): number {
	return Math.floor(Math.random() * array.length);
}

export { sign, verify };
