/*
MIT License

Copyright (c) 2022 DWTechs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

https://github.com/DWTechs/Passken.js
*/

import { isValidInteger, isBoolean, containsLowerCase, containsUpperCase, containsNumber, containsSpecialCharacter } from '@dwtechs/checkard';

const list = {
    lcase: 'abcdefghijklmnopqrstuvwxyz',
    slcase: 'abcdefghijkmnpqrstuvwxyz',
    ucase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    sucase: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
    num: '0123456789',
    snum: '23456789',
    sym: '!@#%*_-+=:?><./()',
};
const { PWD_RAND_LENGTH, PWD_RAND_NUMBERS, PWD_RAND_UPPERCASE, PWD_RAND_LOWERCASE, PWD_RAND_SYMBOLS, PWD_RAND_STRICT, PWD_RAND_SIMILAR_CHARS, } = process === null || process === void 0 ? void 0 : process.env;
const defOpts$1 = {
    len: PWD_RAND_LENGTH || 12,
    num: PWD_RAND_NUMBERS || true,
    ucase: PWD_RAND_UPPERCASE || true,
    lcase: PWD_RAND_LOWERCASE || true,
    sym: PWD_RAND_SYMBOLS || false,
    strict: PWD_RAND_STRICT || true,
    similarChars: PWD_RAND_SIMILAR_CHARS || false,
};
function create(opts = defOpts$1) {
    const len = opts.len && isValidInteger(opts.len, 12, 64, true) ? opts.len : defOpts$1.len;
    const num = isBoolean(opts.num) ? opts.num : defOpts$1.num;
    const ucase = isBoolean(opts.ucase) ? opts.ucase : defOpts$1.ucase;
    const sym = isBoolean(opts.sym) ? opts.sym : defOpts$1.sym;
    const strict = isBoolean(opts.strict) ? opts.strict : defOpts$1.strict;
    const similarChars = opts.similarChars ? opts.similarChars : defOpts$1.similarChars;
    let lcase = isBoolean(opts.lcase) ? opts.lcase : defOpts$1.lcase;
    if (!lcase && !num && !ucase && !sym)
        lcase = true;
    const chars = [];
    if (lcase)
        chars.push(...(similarChars ? list.slcase : list.lcase));
    if (ucase)
        chars.push(...(similarChars ? list.sucase : list.ucase));
    if (num)
        chars.push(...similarChars ? list.snum : list.num);
    if (sym)
        chars.push(...list.sym);
    if (strict) {
        const pwd = [];
        if (lcase)
            pwd.push(getRandChar(list.slcase));
        if (ucase)
            pwd.push(getRandChar(list.sucase));
        if (num)
            pwd.push(getRandChar(list.snum));
        if (sym)
            pwd.push(getRandChar(list.sym));
        for (let i = pwd.length; i < len; i++) {
            pwd.push(getRandChar(chars.join('')));
        }
        return shuffleArray(pwd).join('');
    }
    return Array(len)
        .fill(null)
        .map(() => getRandChar(chars.join('')))
        .join('');
}
function getRandChar(str) {
    return str.charAt(Math.floor(Math.random() * str.length));
}
function shuffleArray(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function throwError(expectedType, actualValue, causedBy) {
    const c = '';
    throw new Error(`Passken: Expected ${expectedType}, but received ${typeof actualValue}: ${String(actualValue)}${c}`);
}

const { PWD_VALID_MINLENGTH, PWD_VALID_MAXLENGTH, PWD_VALID_NUMBERS, PWD_VALID_UPPERCASE, PWD_VALID_LOWERCASE, PWD_VALID_SYMBOLS, } = process === null || process === void 0 ? void 0 : process.env;
const defOpts = {
    lcase: PWD_VALID_LOWERCASE || true,
    ucase: PWD_VALID_UPPERCASE || true,
    num: PWD_VALID_NUMBERS || true,
    sym: PWD_VALID_SYMBOLS || true,
    minLen: PWD_VALID_MINLENGTH || 12,
    maxLen: PWD_VALID_MAXLENGTH || 64,
};
function isValidPassword(s, opts = defOpts, throwErr = false) {
    const o = Object.assign(Object.assign({}, defOpts), opts);
    const l = s.length;
    if (!(l >= o.minLen && l <= o.maxLen)) {
        if (throwErr)
            throwError(`password with length in range [${o.minLen}, ${o.maxLen}] (actual length: ${l})`, s);
        return false;
    }
    if (o.lcase && !containsLowerCase(s)) {
        if (throwErr)
            throwError('password containing lowercase letters', s);
        return false;
    }
    if (o.ucase && !containsUpperCase(s)) {
        if (throwErr)
            throwError('password containing uppercase letters', s);
        return false;
    }
    if (o.num && !containsNumber(s, 1, null)) {
        if (throwErr)
            throwError('password containing numbers', s);
        return false;
    }
    if (o.sym && !containsSpecialCharacter(s)) {
        if (throwErr)
            throwError('password containing special characters', s);
        return false;
    }
    return true;
}

export { isValidPassword, create as randomPwd };
