
import type { Options } from "./types";
import { isValidInteger, isBoolean } from "@dwtechs/checkard";

const list = {
  lcase: 'abcdefghijklmnopqrstuvwxyz',
  ucase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  num: '0123456789',
  sym: '!@#$%&*_-+:;?><,./',
};

// check for env variables
const {   
  PWD_AUTO_LENGTH,
  PWD_AUTO_NUMBERS,
  PWD_AUTO_UPPERCASE,
  PWD_AUTO_LOWERCASE,
  PWD_AUTO_SYMBOLS,
  PWD_AUTO_STRICT,
  PWD_AUTO_EXCLUDE_SIMILAR_CHARS,
} = process?.env;

const defOpts: Options = {
  len: PWD_AUTO_LENGTH as unknown as number || 12,
  num: PWD_AUTO_NUMBERS as unknown as boolean || true,
  ucase: PWD_AUTO_UPPERCASE as unknown as boolean || true,
  lcase: PWD_AUTO_LOWERCASE as unknown as boolean || true,
  sym: PWD_AUTO_SYMBOLS as unknown as boolean || false,
  strict: PWD_AUTO_STRICT as unknown as boolean || true,
  exclSimilarChars: PWD_AUTO_EXCLUDE_SIMILAR_CHARS as unknown as boolean || true,
};

/**
 * Generate a random password.
 * 
 * @param {Partial<Options>} opts - The options to generate the password.
 * @return {string} The generated password.
 * 
 */
function create(opts: Partial<Options> = defOpts): string {
  const len = isValidInteger(opts.len, 12, 64, true) ? opts.len : defOpts.len;
  const num = isBoolean(opts.num) ? opts.num : defOpts.num;
  const ucase = isBoolean(opts.ucase) ? opts.ucase : defOpts.ucase;
  const sym = isBoolean(opts.sym) ? opts.sym : defOpts.sym;
  const strict = isBoolean(opts.strict) ? opts.strict : defOpts.strict;
  const exclSimilarChars = opts.exclSimilarChars ? opts.exclSimilarChars : defOpts.exclSimilarChars;
  let lcase = isBoolean(opts.lcase) ? opts.lcase : defOpts.lcase;

  if (!lcase && !num) lcase = true; // At least one of lowercase or numbers must be true. if not, set lowercase to true

  const chars: string[] = [];

  if (lcase) chars.push(...list.lcase);
  if (ucase) chars.push(...list.ucase);
  if (num) chars.push(...list.num);
  if (sym) chars.push(...list.sym);

  if (exclSimilarChars) {
    chars.splice(chars.indexOf('l'), 1);
    chars.splice(chars.indexOf('I'), 1);
    chars.splice(chars.indexOf('1'), 1);
    chars.splice(chars.indexOf('o'), 1);
    chars.splice(chars.indexOf('O'), 1);
    chars.splice(chars.indexOf('0'), 1);
  }

  if (strict) {
    // Ensure password includes at least one of each required character type
    const pwd: string[] = [];
    if (lcase) pwd.push(getRandChar(list.lcase));
    if (ucase) pwd.push(getRandChar(list.ucase));
    if (num) pwd.push(getRandChar(list.num));
    if (sym) pwd.push(getRandChar(list.sym));

    // Fill the rest of the password length with random characters
    for (let i = pwd.length; i < len; i++) {
      pwd.push(getRandChar(chars.join('')));
    }

    return shuffleArray(pwd).join('');
  }
  // Generate a password with random characters
  return Array(len)
    .fill(null)
    .map(() => getRandChar(chars.join('')))
    .join('');
}

// Get a random character from a string
function getRandChar(str: string): string {
  return str.charAt(Math.floor(Math.random() * str.length));
}

/**
* This is a function that shuffles the elements of an input array in place, 
* using the Fisher-Yates shuffle algorithm. It randomly swaps each element 
* with another element at a lower index, effectively rearranging the array 
* in a random order.
*/
function shuffleArray(a: string[]): string[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export {
  create,
};
