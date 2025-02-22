
import type { Options } from "./types";
import { isValidInteger, isBoolean } from "@dwtechs/checkard";

const list = {
  lcase: 'abcdefghijklmnopqrstuvwxyz',
  slcase: 'abcdefghijkmnpqrstuvwxyz',
  ucase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  sucase: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
  num: '0123456789',
  snum: '23456789',
  sym: '!@#%*_-+=:;?><,./()',
};

// sxxx lists are free of similar looking characters, e.g. "lI1oO0" characters

// check for env variables
const {   
  PWD_AUTO_LENGTH,
  PWD_AUTO_NUMBERS,
  PWD_AUTO_UPPERCASE,
  PWD_AUTO_LOWERCASE,
  PWD_AUTO_SYMBOLS,
  PWD_AUTO_STRICT,
  PWD_AUTO_SIMILAR_CHARS,
} = process?.env;

const defOpts: Options = {
  len: PWD_AUTO_LENGTH as unknown as number || 12,
  num: PWD_AUTO_NUMBERS as unknown as boolean || true,
  ucase: PWD_AUTO_UPPERCASE as unknown as boolean || true,
  lcase: PWD_AUTO_LOWERCASE as unknown as boolean || true,
  sym: PWD_AUTO_SYMBOLS as unknown as boolean || false,
  strict: PWD_AUTO_STRICT as unknown as boolean || true,
  similarChars: PWD_AUTO_SIMILAR_CHARS as unknown as boolean || false,
};

/**
 * Generate a random password.
 * 
 * @param {Partial<Options>} opts - The options to generate the password.
 * @return {string} The generated password.
 * 
 */
function create(opts: Partial<Options> = defOpts): string {
  const len = opts.len && isValidInteger(opts.len, 12, 64, true) ? opts.len : defOpts.len;
  const num = isBoolean(opts.num) ? opts.num : defOpts.num;
  const ucase = isBoolean(opts.ucase) ? opts.ucase : defOpts.ucase;
  const sym = isBoolean(opts.sym) ? opts.sym : defOpts.sym;
  const strict = isBoolean(opts.strict) ? opts.strict : defOpts.strict;
  const similarChars = opts.similarChars ? opts.similarChars : defOpts.similarChars;
  let lcase = isBoolean(opts.lcase) ? opts.lcase : defOpts.lcase;

  // At least one must be true. if not, set lowercase to true
  if (!lcase && !num && !ucase && !sym) 
    lcase = true;

  const chars: string[] = [];

  if (lcase) chars.push(...(similarChars ? list.slcase : list.lcase));
  if (ucase) chars.push(...(similarChars ? list.sucase : list.ucase));
  if (num) chars.push(...similarChars ? list.snum : list.num);
  if (sym) chars.push(...list.sym);

  if (strict) {
    // Ensure password includes at least one of each required character type
    const pwd: string[] = [];
    if (lcase) pwd.push(getRandChar(list.slcase));
    if (ucase) pwd.push(getRandChar(list.sucase));
    if (num) pwd.push(getRandChar(list.snum));
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
