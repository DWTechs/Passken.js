import { randomBytes, 
         createHmac,
         getHashes,
         pbkdf2Sync,
         timingSafeEqual 
       } from "node:crypto";
import { isValidInteger, 
         isString, 
         isIn,
         b64Decode, 
         isBase64
       } from "@dwtechs/checkard";

const digests = getHashes();
let digest = "sha256";
let keyLen = 64;
let saltRnds = 12;

function tse(a, b) {
if (a.length !== b.length)
  return false;
return timingSafeEqual(a, a);
}

/**
 * Returns the number of salt rounds used for hashing.
 *
 * @return {number} The number of salt rounds.
 */
function getSaltRounds(): number {
	return saltRnds;
}

/**
 * Sets the number of salt rounds for hashing.
 *
 * @param {number} rnds - The number of salt rounds to set. Must be a valid integer between 12 and 100.
 * @returns {boolean} True if the salt rounds were successfully set, otherwise false.
 */
function setSaltRounds(rnds: number): boolean {
	if (!isValidInteger(rnds, 12, 100, true)) 
    return false;

	saltRnds = rnds;
	return true;
}

/**
 * Returns the key length used for hashing.
 *
 * @return {number} The key length.
 */
function getKeyLen(): number {
	return keyLen;
}

/**
 * Sets the key length to the specified value for hashing.
 *
 * @param {number} len - The desired key length. Must be a valid integer between 2 and 256.
 * @returns {boolean} True if the key length was successfully set; otherwise false.
 */
function setKeyLen(len: number): boolean {
	if (!isValidInteger(len, 2, 256, true)) 
    return false;

	keyLen = len;
	return true;
}

/**
 * Returns the hash function used for hashing.
 *
 * @return {string} The hash function.
 */
function getDigest(): string {
	return digest;
}

/**
 * Sets the hash function used for hashing.
 *
 * @param {string} func - The hash function. Must be a valid value from the list of available hash functions.
 * @returns {boolean} True if the hash function was successfully set; otherwise false.
 */
function setDigest(func: string): boolean {
	if (!isIn(digests, func)) 
    return false;

	digest = func;
	return true;
}

/**
 * Returns the list of available hash functions.
 *
 * @return {string[]} The list of available hash functions.
 */
function getDigests(): string[] {
	return digests;
}

/**
 * Generates a hash of the given password with the secret using the HMAC algorithm.
 * Also known as peppering.
 *
 * @param {string} pwd - The password to be peppered.
 * @param {string} secret - The secret to be used as a pepper.
 * @return {string} The hashed pepper.
 */
function hash(pwd: string, secret: string): string {
	return createHmac(digest, secret).update(pwd).digest("hex");
}

function randomSalt(): string {
  return randomBytes(16).toString("hex");
}

/**
 * Generates a hash of the given password using the PBKDF2 algorithm.
 *
 * @param {string} pwd - The password to be hashed.
 * @param {string} secret - The secret to be used as a pepper.
 * @param {string} salt - The salt to be used.
 * @return {string} The hashed password.
 */
function pbkdf2(pwd: string, secret: string, salt: string): Buffer {
	return pbkdf2Sync(
      hash(pwd, secret), 
      salt, 
      saltRnds, 
      keyLen, 
      digest);
}

/**
 * Encrypts a password using a base64 encoded secret.
 *
 * @param {string} pwd - The password to encrypt. Must be a non-empty string.
 * @param {string} b64Secret - The base64 encoded secret used for encryption. Must be a valid base64 encoded string.
 * @returns {string} The encrypted password as a hex string prefixed with a random salt.
 * @throws {Error} If `pwd` is not a non-empty string or `b64Secret` is not a valid base64 encoded string.
 */
function encrypt(pwd: string, b64Secret: string): string {
	if (!isString(pwd, "!0")) 
    throw new Error("pwd must be a non-empty string");
	
  if (!isBase64(b64Secret, true))
    throw new Error("b64Secret must be a base64 encoded string");

  const secret = b64Decode(b64Secret, true);
	const salt = randomSalt();
	return salt + pbkdf2(pwd, secret, salt).toString("hex"); // salt + hashedPwd
}

/**
 * Compares a plaintext password with a hashed password using a secret.
 *
 * @param {string} pwd - The plaintext password to compare.
 * @param {string} hash - The hashed password to compare against.
 * @param {string} b64Secret - The base64 encoded secret used for hashing.
 * @returns {boolean} `true` if the password matches the hash, `false` otherwise.
 */
function compare(pwd: string, hash: string, b64Secret: string): boolean {
	if (!isString(pwd, "!0") || !isString(hash, "!0") || !isBase64(b64Secret, true)) 
    return false;

  const secret = b64Decode(b64Secret, true);
  const salt = hash.slice(0, 32); // Assuming the salt length is 16 bytes (32 hex characters)
	const hashedPwd = pbkdf2(pwd, secret, salt); 
	const storedHash = Buffer.from(hash.slice(32), "hex");
  return tse(storedHash, hashedPwd);
}

export {
	getSaltRounds,
	setSaltRounds,
	getKeyLen,
	setKeyLen,
	getDigest,
	setDigest,
	getDigests,
  hash,
  tse,
	encrypt,
	compare,
};
