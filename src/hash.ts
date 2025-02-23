import { randomBytes, 
         createHmac,
         getHashes,
         pbkdf2Sync,
         timingSafeEqual 
       } from "node:crypto";
import { isValidInteger, 
         isString, 
         isIn,
         b64Decode 
       } from "@dwtechs/checkard";

const digests = getHashes();
let digest = "sha256";
let keyLen = 64;
let saltRnds = 12;

/**
 * Returns the number of salt rounds used for the bcrypt hash.
 *
 * @return {integer} The number of salt rounds.
 */
function getSaltRounds(): number {
	return saltRnds;
}

/**
 * Sets the number of salt rounds used for the bcrypt hash.
 * If the given value is not a valid integer between 12 and 100, the current value is kept.
 *
 * @param {integer} rounds - The number of salt rounds.
 * @return {integer} The number of salt rounds.
 */
function setSaltRounds(rnds: number): boolean {
	if (!isValidInteger(rnds, 12, 100, true)) 
    return false;

	saltRnds = rnds;
	return true;
}

/**
 * Returns the key length used for the PBKDF2 hash.
 *
 * @return {integer} The key length.
 */
function getKeyLen(): number {
	return keyLen;
}

/**
 * Sets the key length used for the PBKDF2 hash.
 * If the given value is not a valid integer between 12 and 100, the current value is kept.
 *
 * @param {integer} len - The key length.
 * @return {integer} The key length.
 */
function setKeyLen(len: number): boolean {
	if (!isValidInteger(len, 2, 256, true)) 
    return false;

	keyLen = len;
	return true;
}

/**
 * Returns the hash function used for the HMAC hash.
 *
 * @return {string} The hash function.
 */
function getDigest(): string {
	return digest;
}

/**
 * Sets the hash function used for the HMAC hash.
 * If the given value is not in the list of available hash functions, the current value is kept.
 *
 * @param {string} func - The hash function.
 * @return {string|false} The current hash function or `false` if the given value is not valid.
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
 * @return {Array} The list of available hash functions.
 */
function getDigests(): string[] {
	return digests;
}

/**
 * Generates a hash of the given password with the secret using the HMAC algorithm.
 * Also known as peppering.
 *
 * @param {string} pwd - The password to be peppered.
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
 * Encrypt password in HmacSHA512 with secret (pepper)
 *
 * @param {type} pwd - The password to encrypt
 * @return {type} The encrypted password hash
 */
function encrypt(pwd: string, b64Secret: string): string | false {
	if (!isString(pwd, "!0") || !isString(b64Secret, "!0")) 
    return false;
	
  const secret = b64Decode(b64Secret, true);
	if (!secret) 
    return false;

	const salt = randomSalt(); // random salt
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
	if (!isString(pwd, "!0") || !isString(hash, "!0") || !isString(b64Secret, "!0")) 
    return false;

  const secret = b64Decode(b64Secret, true);
	if (!secret) 
    return false;

  const salt = hash.slice(0, 32); // Assuming the salt length is 16 bytes (32 hex characters)
	const hashedPwd = pbkdf2(pwd, secret, salt); 
	const storedHash = Buffer.from(hash.slice(32), "hex");
	return timingSafeEqual(storedHash, hashedPwd);
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
	encrypt,
	compare,
};
