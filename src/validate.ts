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


const defOpts: ValidationOptions = {
  lcase: PWD_VALID_LOWERCASE as unknown as boolean || true,
  ucase: PWD_VALID_UPPERCASE as unknown as boolean || true,
  num: PWD_VALID_NUMBERS as unknown as boolean || true,
  sym: PWD_VALID_SYMBOLS as unknown as boolean || true,
  minLen: PWD_VALID_MINLENGTH as unknown as number || 12,
  maxLen: PWD_VALID_MAXLENGTH as unknown as number || 64,
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
 *   minLength: 8,
 *   maxLength: 20,
 *   lowerCase: true,
 *   upperCase: true,
 *   number: true,
 *   specialCharacter: true
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
