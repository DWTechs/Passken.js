import { containsLowerCase, containsNumber, containsSpecialCharacter, containsUpperCase } from '@dwtechs/checkard';
import { throwError } from './error';
import type { ValidationOptions } from './types';

// check for env variables
const {   
  PWD_VALID_MINLENGTH,
  PWD_VALID_MAXLENGTH,
  PWD_VALID_NUMBERS,
  PWD_VALID_UPPERCASE,
  PWD_VALID_LOWERCASE,
  PWD_VALID_SYMBOLS,
} = process?.env;


// Env vars are always strings, so they must be parsed before use
function envBool(v: string | undefined, def: boolean): boolean {
  return v === undefined ? def : v === 'true';
}

function envInt(v: string | undefined, def: number): number {
  if (v === undefined) return def;
  const n = parseInt(v, 10);
  return Number.isInteger(n) ? n : def;
}

const defOpts: ValidationOptions = {
  lcase: envBool(PWD_VALID_LOWERCASE, true),
  ucase: envBool(PWD_VALID_UPPERCASE, true),
  num: envBool(PWD_VALID_NUMBERS, true),
  sym: envBool(PWD_VALID_SYMBOLS, true),
  minLen: envInt(PWD_VALID_MINLENGTH, 12),
  maxLen: envInt(PWD_VALID_MAXLENGTH, 64),
};

/**
 * Checks if a given password string meets the specified validation criteria.
 *
 * @param {string} s - The password string to validate.
 * @param {ValidationOptions} [options=defOpts] - Optional configuration object to specify password validation criteria.
 * @param {boolean} [throwErr=false] - If true, throws an error when password does not meet criteria. If false, returns false.
 * @returns {boolean} `true` if the password meets all the specified criteria, false if not (when throwErr is false).
 * @throws {Error} Throws an error if the password does not meet the specified criteria and throwErr is true.
 *
 * @example
 * ```typescript
 * const options = {
 *   minLen: 8,
 *   maxLen: 20,
 *   lcase: true,
 *   ucase: true,
 *   num: true,
 *   sym: true
 * };
 * const isValid = isValidPassword('Password123!', options);
 * console.log(isValid); // true
 * ```
 */
function isValidPassword(
  s: string, 
  opts: Partial<ValidationOptions> = defOpts, 
  throwErr: boolean = false
): boolean {
  const o = { ...defOpts, ...opts };
  const l = s.length;
  
  // Check length
  if (!(l >= o.minLen && l <= o.maxLen)) {
    if (throwErr)
      throwError(`password with length in range [${o.minLen}, ${o.maxLen}] (actual length: ${l})`, s);
    return false;
  }
  
  // Check lowercase requirement
  if (o.lcase && !containsLowerCase(s)) {
    if (throwErr)
      throwError('password containing lowercase letters', s);
    return false;
  }
  
  // Check uppercase requirement
  if (o.ucase && !containsUpperCase(s)) {
    if (throwErr)
      throwError('password containing uppercase letters', s);
    return false;
  }
  
  // Check number requirement
  if (o.num && !containsNumber(s, 1, null)) {
    if (throwErr)
      throwError('password containing numbers', s);
    return false;
  }
  
  // Check special character requirement
  if (o.sym && !containsSpecialCharacter(s)) {
    if (throwErr)
      throwError('password containing special characters', s);
    return false;
  }
  
  return true;
}



export {
  isValidPassword,
};
