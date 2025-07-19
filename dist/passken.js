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

class PasskenError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
class MissingAuthorizationError extends PasskenError {
    constructor(message = "Authorization header is missing") {
        super(message);
        this.code = "MISSING_AUTHORIZATION";
        this.statusCode = 401;
    }
}
class InvalidBearerFormatError extends PasskenError {
    constructor(message = "Authorization header must be in the format 'Bearer <token>'") {
        super(message);
        this.code = "INVALID_BEARER_FORMAT";
        this.statusCode = 401;
    }
}
class InvalidTokenError extends PasskenError {
    constructor(message = "Invalid or malformed JWT token") {
        super(message);
        this.code = "INVALID_TOKEN";
        this.statusCode = 401;
    }
}
class TokenExpiredError extends PasskenError {
    constructor(message = "JWT token has expired") {
        super(message);
        this.code = "TOKEN_EXPIRED";
        this.statusCode = 401;
    }
}
class TokenNotActiveError extends PasskenError {
    constructor(message = "JWT token cannot be used yet (nbf claim)") {
        super(message);
        this.code = "TOKEN_NOT_ACTIVE";
        this.statusCode = 401;
    }
}
class InvalidSignatureError extends PasskenError {
    constructor(message = "JWT token signature is invalid") {
        super(message);
        this.code = "INVALID_SIGNATURE";
        this.statusCode = 401;
    }
}
class MissingClaimsError extends PasskenError {
    constructor(message = "JWT token is missing required claims") {
        super(message);
        this.code = "MISSING_CLAIMS";
        this.statusCode = 400;
    }
}
class InvalidIssuerError extends PasskenError {
    constructor(message = "iss must be a string or a number") {
        super(message);
        this.code = "INVALID_ISSUER";
        this.statusCode = 400;
    }
}
class InvalidSecretsError extends PasskenError {
    constructor(message = "b64Keys must be an array") {
        super(message);
        this.code = "INVALID_SECRETS";
        this.statusCode = 500;
    }
}
class InvalidDurationError extends PasskenError {
    constructor(message = "duration must be a positive number") {
        super(message);
        this.code = "INVALID_DURATION";
        this.statusCode = 400;
    }
}
class SecretDecodingError extends PasskenError {
    constructor(message = "could not decode the secret") {
        super(message);
        this.code = "SECRET_DECODING_ERROR";
        this.statusCode = 500;
    }
}
class HashLengthMismatchError extends PasskenError {
    constructor(message = "Hashes must have the same byte length") {
        super(message);
        this.code = "HASH_LENGTH_MISMATCH";
        this.statusCode = 400;
    }
}
class InvalidPasswordError extends PasskenError {
    constructor(message = "pwd must be a non-empty string") {
        super(message);
        this.code = "INVALID_PASSWORD";
        this.statusCode = 400;
    }
}
class InvalidBase64SecretError extends PasskenError {
    constructor(message = "b64Secret must be a base64 encoded string") {
        super(message);
        this.code = "INVALID_BASE64_SECRET";
        this.statusCode = 400;
    }
}

const digests = getHashes();
let digest = "sha256";
let keyLen = 64;
let saltRnds = 12;
function tse(a, b) {
    if (a.length !== b.length)
        throw new HashLengthMismatchError();
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
        throw new InvalidPasswordError();
    if (!isBase64(b64Secret, true))
        throw new InvalidBase64SecretError();
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
        throw new InvalidIssuerError();
    if (!isArray(b64Keys, ">", 0))
        throw new InvalidSecretsError();
    if (!isNumber(duration, false) || !isPositive(duration, true))
        throw new InvalidDurationError();
    header.kid = randomPick(b64Keys);
    const b64Secret = b64Keys[header.kid];
    const secret = b64Decode(b64Secret, true);
    if (!secret)
        throw new SecretDecodingError();
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
        throw new InvalidTokenError();
    const [b64Header, b64Payload, b64Signature] = segments;
    if (!b64Header || !b64Payload || !b64Signature)
        throw new InvalidTokenError();
    if (!isArray(b64Keys, ">", 0))
        throw new InvalidSecretsError();
    const headerString = b64Decode(b64Header);
    const payloadString = b64Decode(b64Payload);
    if (!isJson(headerString) || !isJson(payloadString))
        throw new InvalidTokenError();
    const header = JSON.parse(headerString);
    const payload = JSON.parse(payloadString);
    if (header.alg !== "HS256")
        throw new InvalidTokenError();
    if (header.typ !== "JWT")
        throw new InvalidTokenError();
    if (!isString(header.kid, "!0") && !isNumber(header.kid, true))
        throw new InvalidTokenError();
    const now = Math.floor(Date.now() / 1000);
    if (payload.nbf && payload.nbf > now)
        throw new TokenNotActiveError();
    if (!ignoreExpiration && payload.exp < now)
        throw new TokenExpiredError();
    const b64Secret = b64Keys[header.kid];
    if (!isBase64(b64Secret, true))
        throw new SecretDecodingError();
    const secret = b64Decode(b64Secret);
    const expectedSignature = hash(`${b64Header}.${b64Payload}`, secret);
    const safeA = Buffer.from(expectedSignature);
    const safeB = Buffer.from(b64Signature);
    if (!tse(safeA, safeB))
        throw new InvalidSignatureError();
    return payload;
}
function parseBearer(authorization) {
    if (!authorization)
        throw new MissingAuthorizationError();
    if (!authorization.startsWith("Bearer "))
        throw new InvalidBearerFormatError();
    const parts = authorization.split(" ").filter(part => part.length > 0);
    if (parts.length < 2 || !parts[1])
        throw new InvalidBearerFormatError();
    return parts[1];
}
function randomPick(array) {
    return Math.floor(Math.random() * array.length);
}

function create(length = 32) {
    return b64Encode(randomBytes(length).toString("utf8"), true);
}

export { InvalidBearerFormatError, InvalidDurationError, InvalidIssuerError, InvalidSecretsError, InvalidSignatureError, InvalidTokenError, MissingAuthorizationError, MissingClaimsError, PasskenError, SecretDecodingError, TokenExpiredError, TokenNotActiveError, compare, encrypt, getDigest, getDigests, getKeyLen, getSaltRounds, parseBearer, create$1 as randomPwd, create as randomSecret, setDigest, setKeyLen, setSaltRounds, sign, verify };
