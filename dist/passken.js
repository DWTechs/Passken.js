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

import { getHashes, randomBytes, pbkdf2Sync, createHmac } from 'node:crypto';
import { isValidInteger, isString, isBoolean } from '@dwtechs/checkard';

const digests = getHashes();
let digest = "sha256";
let keyLen = 64;
let saltRnds = 12;
function getSaltRounds() {
    return saltRnds;
}
function setSaltRounds(rnds) {
    if (!isValidInteger(rnds, 12, 100, true))
        return false;
    saltRnds = rnds;
    return saltRnds;
}
function getKeyLen() {
    return keyLen;
}
function setKeyLen(len) {
    if (!isValidInteger(len, 2, 256, true))
        return false;
    keyLen = len;
    return keyLen;
}
function getDigest() {
    return digest;
}
function setDigest(func) {
    if (!digests.includes(func))
        return false;
    digest = func;
    return digest;
}
function getDigests() {
    return digests;
}
function hash(pwd, secret) {
    return createHmac(digest, secret).update(pwd).digest("hex");
}
function pbkdf2(pwd, secret, salt) {
    return pbkdf2Sync(hash(pwd, secret), salt, saltRnds, keyLen, digest).toString("hex");
}
function encrypt(pwd, secret) {
    if (!isString(pwd, true) || !isString(secret, true))
        return false;
    const salt = randomBytes(16).toString('hex');
    return salt + pbkdf2(pwd, secret, salt);
}
function compare(pwd, hash, secret) {
    if (!isString(pwd, true) || !isString(secret, true))
        return false;
    const hashedPwd = pbkdf2(pwd, secret, hash.slice(0, 32));
    const storedHash = hash.slice(32);
    return hashedPwd === storedHash;
}

const list = {
    lcase: 'abcdefghijklmnopqrstuvwxyz',
    slcase: 'abcdefghijkmnpqrstuvwxyz',
    ucase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    sucase: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
    num: '0123456789',
    snum: '23456789',
    sym: '!@#$%&*_-+:;?><,./',
};
const { PWD_AUTO_LENGTH, PWD_AUTO_NUMBERS, PWD_AUTO_UPPERCASE, PWD_AUTO_LOWERCASE, PWD_AUTO_SYMBOLS, PWD_AUTO_STRICT, PWD_AUTO_SIMILAR_CHARS, } = process === null || process === void 0 ? void 0 : process.env;
const defOpts = {
    len: PWD_AUTO_LENGTH || 12,
    num: PWD_AUTO_NUMBERS || true,
    ucase: PWD_AUTO_UPPERCASE || true,
    lcase: PWD_AUTO_LOWERCASE || true,
    sym: PWD_AUTO_SYMBOLS || false,
    strict: PWD_AUTO_STRICT || true,
    similarChars: PWD_AUTO_SIMILAR_CHARS || false,
};
function create(opts = defOpts) {
    const len = isValidInteger(opts.len, 12, 64, true) ? opts.len : defOpts.len;
    const num = isBoolean(opts.num) ? opts.num : defOpts.num;
    const ucase = isBoolean(opts.ucase) ? opts.ucase : defOpts.ucase;
    const sym = isBoolean(opts.sym) ? opts.sym : defOpts.sym;
    const strict = isBoolean(opts.strict) ? opts.strict : defOpts.strict;
    const similarChars = opts.similarChars ? opts.similarChars : defOpts.similarChars;
    let lcase = isBoolean(opts.lcase) ? opts.lcase : defOpts.lcase;
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

const header = {
    alg: "HS256",
    typ: "JWT",
    kid: null,
};
function sign(iss, duration, secret) {
    const iat = Math.floor(Date.now() / 1000);
    const payload = { iss, iat };
    if (duration)
        payload.exp = iat + duration;
    header.kid = iss;
    const b64Header = toBase64(JSON.stringify(header));
    const b64Payload = toBase64(JSON.stringify(payload));
    const signature = createHmac('sha256', secret)
        .update(`${b64Header}.${b64Payload}`)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    return `${b64Header}.${b64Payload}.${signature}`;
}
function toBase64(data) {
    return Buffer.from(data).toString("base64");
}

export { compare, create, encrypt, getDigest, getDigests, getKeyLen, getSaltRounds, setDigest, setKeyLen, setSaltRounds, sign };
