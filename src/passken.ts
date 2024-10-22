import { isValidInteger, isString } from "@dwtechs/checkard";
import { createHmac } from "node:crypto";
import bcrypt from "bcrypt";

const hashFunc = "sha256";
let saltRounds = 12;

/**
 * Returns the number of salt rounds used for the bcrypt hash.
 *
 * @return {integer} The number of salt rounds.
 */
function getSaltRounds(): number {
  return saltRounds;
}


/**
 * Sets the number of salt rounds used for the bcrypt hash.
 * If the given value is not a valid integer between 12 and 100, the current value is kept.
 *
 * @param {integer} r - The number of salt rounds.
 * @return {integer} The number of salt rounds.
 */
function setSaltRounds(r: number): number {
  return saltRounds = isValidInteger(r, 12, 100) ? r : saltRounds;
}


/**
 * Generates a hash of the given password using the HMAC algorithm.
 *
 * @param {string} pwd - The password to be hashed.
 * @return {string} The hashed password.
 */
function hash(pwd: string, secret: string): string {
  return createHmac(hashFunc, secret).update(pwd).digest("hex");
}


/**
 * Encrypt password in HmacSHA512 with secret (peppering)
 *
 * @param {type} pwd - The password to encrypt
 * @return {type} The encrypted password hash
 */
function encrypt(pwd: string, secret: string): string {
  return (isString(pwd, true) && isString(secret, true)) ? bcrypt.hashSync(hash(pwd, secret), saltRounds) : false;
}


/**
 * Method to check if the provided password matches the stored hash.
 *
 * @param {type} pwd - The password to be validated
 * @param {type} dbHash - The hash to compare against
 * @return {type} Whether the password matches the stored hash
 */
function compare(pwd: string, dbHash: string, secret: string): boolean {
  return (isString(pwd, true) && isString(secret, true)) ? bcrypt.compareSync(hash(pwd, secret), dbHash) : false;
}

export {
  getSaltRounds,
  setSaltRounds,
  encrypt,
  compare,
};
