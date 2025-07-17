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

import { getHashes, timingSafeEqual, createHmac, randomBytes, pbkdf2Sync } from 'node:crypto';
import { isValidInteger, isIn, isString, isBase64, b64Decode, isBoolean, isNumber, isArray, isPositive, b64Encode, isJson } from '@dwtechs/checkard';

const digests = getHashes();
let digest = "sha256";
let keyLen = 64;
let saltRnds = 12;
function tse(a, b) {
    if (a.length !== b.length)
        throw new Error("Hashes must have the same byte length");
    return timingSafeEqual(a, b);
}
function getSaltRounds() {
    return saltRnds;
}
function setSaltRounds(rnds) {
    if (!isValidInteger(rnds, 12, 100, true))
        return false;
    saltRnds = rnds;
    return true;
}
function getKeyLen() {
    return keyLen;
}
function setKeyLen(len) {
    if (!isValidInteger(len, 2, 256, true))
        return false;
    keyLen = len;
    return true;
}
function getDigest() {
    return digest;
}
function setDigest(func) {
    if (!isIn(digests, func))
        return false;
    digest = func;
    return true;
}
function getDigests() {
    return digests;
}
function hash(pwd, secret) {
    return createHmac(digest, secret).update(pwd).digest("base64url");
}
function randomSalt() {
    return randomBytes(16).toString("hex");
}
function pbkdf2(pwd, secret, salt) {
    return pbkdf2Sync(hash(pwd, secret), salt, saltRnds, keyLen, digest);
}
function encrypt(pwd, b64Secret) {
    if (!isString(pwd, "!0"))
        throw new Error("pwd must be a non-empty string");
    if (!isBase64(b64Secret, true))
        throw new Error("b64Secret must be a base64 encoded string");
    const secret = b64Decode(b64Secret, true);
    const salt = randomSalt();
    return salt + pbkdf2(pwd, secret, salt).toString("hex");
}
function compare(pwd, hash, b64Secret) {
    if (!isString(pwd, "!0") || !isString(hash, "!0") || !isBase64(b64Secret, true))
        return false;
    const secret = b64Decode(b64Secret, true);
    const salt = hash.slice(0, 32);
    const hashedPwd = pbkdf2(pwd, secret, salt);
    const storedHash = Buffer.from(hash.slice(32), "hex");
    return tse(storedHash, hashedPwd);
}

const list = {
    lcase: 'abcdefghijklmnopqrstuvwxyz',
    slcase: 'abcdefghijkmnpqrstuvwxyz',
    ucase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    sucase: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
    num: '0123456789',
    snum: '23456789',
    sym: '!@#%*_-+=:?><./()',
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
function create$1(opts = defOpts) {
    const len = opts.len && isValidInteger(opts.len, 12, 64, true) ? opts.len : defOpts.len;
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
    kid: 0,
};
function sign(iss, duration, type, b64Keys) {
    if (!isString(iss, "!0") && !isNumber(iss, true))
        throw new Error("iss must be a string or a number");
    if (!isArray(b64Keys, ">", 0))
        throw new Error("b64Keys must be an array");
    if (!isNumber(duration, false) || !isPositive(duration, true))
        throw new Error("duration must be a positive number");
    header.kid = randomPick(b64Keys);
    const b64Secret = b64Keys[header.kid];
    const secret = b64Decode(b64Secret, true);
    if (!secret)
        throw new Error("could not decode the secret");
    const iat = Math.floor(Date.now() / 1000);
    const nbf = iat + 1;
    const exp = duration > 60 ? iat + duration : iat + 60 * 15;
    const typ = type === "refresh" ? type : "access";
    const payload = { iss, iat, nbf, exp, typ };
    const b64Header = b64Encode(JSON.stringify(header));
    const b64Payload = b64Encode(JSON.stringify(payload));
    const b64Signature = hash(`${b64Header}.${b64Payload}`, secret);
    return `${b64Header}.${b64Payload}.${b64Signature}`;
}
function verify(token, b64Keys, ignoreExpiration = false) {
    const segments = token.split(".");
    if (segments.length !== 3)
        throw new Error("Token must have 3 segments");
    const [b64Header, b64Payload, b64Signature] = segments;
    if (!b64Header || !b64Payload || !b64Signature)
        throw new Error("Token Must have header, payload and signature");
    if (!isArray(b64Keys, ">", 0))
        throw new Error("b64Keys must be an array");
    const headerString = b64Decode(b64Header);
    const payloadString = b64Decode(b64Payload);
    if (!isJson(headerString) || !isJson(payloadString))
        throw new Error("Header and payload must be JSON");
    const header = JSON.parse(headerString);
    const payload = JSON.parse(payloadString);
    if (header.alg !== "HS256")
        throw new Error("Algorithm not supported");
    if (header.typ !== "JWT")
        throw new Error("Token type not supported");
    if (!isString(header.kid, "!0") && !isNumber(header.kid, true))
        throw new Error("Invalid kid in header");
    const now = Math.floor(Date.now() / 1000);
    if (payload.nbf && payload.nbf > now)
        throw new Error("JWT cannot be used yet (nbf claim)");
    if (!ignoreExpiration && payload.exp < now)
        throw new Error("JWT has expired (exp claim)");
    const b64Secret = b64Keys[header.kid];
    if (!isBase64(b64Secret, true))
        throw new Error("Secret must be base64 url-safe encoded");
    const secret = b64Decode(b64Secret);
    const expectedSignature = hash(`${b64Header}.${b64Payload}`, secret);
    const safeA = Buffer.from(expectedSignature);
    const safeB = Buffer.from(b64Signature);
    if (!tse(safeA, safeB))
        throw new Error("Invalid signature");
    return payload;
}
const BEARER_TOKEN_ERROR_MESSAGE = "Authorization header must be in the format 'Bearer <token>'";
function parseBearerToken(authorization) {
    if (!(authorization === null || authorization === void 0 ? void 0 : authorization.startsWith("Bearer ")))
        throw new Error(BEARER_TOKEN_ERROR_MESSAGE);
    const parts = authorization.split(" ").filter(part => part.length > 0);
    if (parts.length < 2 || !parts[1])
        throw new Error(BEARER_TOKEN_ERROR_MESSAGE);
    return parts[1];
}
function randomPick(array) {
    return Math.floor(Math.random() * array.length);
}

function create(length = 32) {
    return b64Encode(randomBytes(length).toString("utf8"), true);
}

export { compare, encrypt, getDigest, getDigests, getKeyLen, getSaltRounds, parseBearerToken, create$1 as randomPwd, create as randomSecret, setDigest, setKeyLen, setSaltRounds, sign, verify };
