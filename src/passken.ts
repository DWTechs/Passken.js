import type { Options } from "./types";
import { isValidInteger, isBoolean,isString } from "@dwtechs/checkard";
import { createHmac } from "node:crypto";
import * as bcrypt from "bcrypt";

const hashFunc = "sha256";
let saltRounds = 12;
const defaultOptions: Options = {
  length: 12,
  numbers: true,
  uppercase: true,
  lowercase: true,
  symbols: false,
  strict: true,
  excludeSimilarCharacters: true,
};
const list = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%&*_-+:;?><,./',
};
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
  saltRounds = isValidInteger(r, 12, 100) ? r : saltRounds;
  return saltRounds;
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
function encrypt(pwd: string, secret: string): string | false {
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

/**
 * Generates random passwords for multiple users and encrypts them.
 */
function create(options: Partial<Options> = defaultOptions): string {
  const length = isValidInteger(options.length, 12, 64, true) ? options.length : defaultOptions.length;
  const numbers = isBoolean(options.numbers) ? options.numbers : defaultOptions.numbers;
  const uppercase = isBoolean(options.uppercase) ? options.uppercase : defaultOptions.uppercase;
  const symbols = isBoolean(options.symbols) ? options.symbols : defaultOptions.symbols;
  const strict = isBoolean(options.strict) ? options.strict : defaultOptions.strict;
  const excludeSimilarCharacters = options.excludeSimilarCharacters ? options.excludeSimilarCharacters : defaultOptions.excludeSimilarCharacters;
  let lowercase = isBoolean(options.lowercase) ? options.lowercase : defaultOptions.lowercase;

  if (!lowercase && !numbers) lowercase = true;

  const chars: string[] = [];

  if (lowercase) chars.push(...list.lowercase);
  if (uppercase) chars.push(...list.uppercase);
  if (numbers) chars.push(...list.numbers);
  if (symbols) chars.push(...list.symbols);

  if (excludeSimilarCharacters) {
    chars.splice(chars.indexOf('l'), 1);
    chars.splice(chars.indexOf('I'), 1);
    chars.splice(chars.indexOf('1'), 1);
    chars.splice(chars.indexOf('o'), 1);
    chars.splice(chars.indexOf('O'), 1);
    chars.splice(chars.indexOf('0'), 1);
  }

  if (strict) {
    // Ensure password includes at least one of each required character type
    const password: string[] = [];
    if (lowercase) password.push(getRandomChar(list.lowercase));
    if (uppercase) password.push(getRandomChar(list.uppercase));
    if (numbers) password.push(getRandomChar(list.numbers));
    if (symbols) password.push(getRandomChar(list.symbols));

    // Fill the rest of the password length with random characters
    for (let i = password.length; i < length; i++) {
      password.push(getRandomChar(chars.join('')));
    }

    return shuffleArray(password).join('');
  }
  // Generate a password with random characters
  return Array(length)
    .fill(null)
    .map(() => getRandomChar(chars.join('')))
    .join('');
}

// Helper functions
function getRandomChar(str: string) {
  return str.charAt(Math.floor(Math.random() * str.length));
}

/**
* This is a function that shuffles the elements of an input array in place, 
* using the Fisher-Yates shuffle algorithm. It randomly swaps each element 
* with another element at a lower index, effectively rearranging the array 
* in a random order.
*/
function shuffleArray(arr: string[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export {
  getSaltRounds,
  setSaltRounds,
  encrypt,
  compare,
  create,
};
