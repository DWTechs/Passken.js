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

var digests = getHashes();
var digest = "sha256";
var keyLen = 64;
var saltRnds = 12;
function getSaltRounds() {
  return saltRnds;
}
function setSaltRounds(rnds) {
  if (!isValidInteger(rnds, 12, 100, true)) return false;
  saltRnds = rnds;
  return saltRnds;
}
function getKeyLen() {
  return keyLen;
}
function setKeyLen(len) {
  if (!isValidInteger(len, 2, 256, true)) return false;
  keyLen = len;
  return keyLen;
}
function getDigest() {
  return digest;
}
function setDigest(func) {
  if (!digests.includes(func)) return false;
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
  if (!isString(pwd, true) || !isString(secret, true)) return false;
  var salt = randomBytes(16).toString('hex');
  return salt + pbkdf2(pwd, secret, salt);
}
function compare(pwd, hash, secret) {
  if (!isString(pwd, true) || !isString(secret, true)) return false;
  var hashedPwd = pbkdf2(pwd, secret, hash.slice(0, 32));
  var storedHash = hash.slice(32);
  return hashedPwd === storedHash;
}

var defOpts = {
  len: 12,
  num: true,
  ucase: true,
  lcase: true,
  sym: false,
  strict: true,
  exclSimilarChars: true
};
var list = {
  lcase: 'abcdefghijklmnopqrstuvwxyz',
  ucase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  num: '0123456789',
  sym: '!@#$%&*_-+:;?><,./'
};
function create(opts) {
  if (opts === void 0) {
    opts = defOpts;
  }
  var len = isValidInteger(opts.len, 12, 64, true) ? opts.len : defOpts.len;
  var num = isBoolean(opts.num) ? opts.num : defOpts.num;
  var ucase = isBoolean(opts.ucase) ? opts.ucase : defOpts.ucase;
  var sym = isBoolean(opts.sym) ? opts.sym : defOpts.sym;
  var strict = isBoolean(opts.strict) ? opts.strict : defOpts.strict;
  var exclSimilarChars = opts.exclSimilarChars ? opts.exclSimilarChars : defOpts.exclSimilarChars;
  var lcase = isBoolean(opts.lcase) ? opts.lcase : defOpts.lcase;
  if (!lcase && !num) lcase = true;
  var chars = [];
  if (lcase) chars.push.apply(chars, list.lcase);
  if (ucase) chars.push.apply(chars, list.ucase);
  if (num) chars.push.apply(chars, list.num);
  if (sym) chars.push.apply(chars, list.sym);
  if (exclSimilarChars) {
    chars.splice(chars.indexOf('l'), 1);
    chars.splice(chars.indexOf('I'), 1);
    chars.splice(chars.indexOf('1'), 1);
    chars.splice(chars.indexOf('o'), 1);
    chars.splice(chars.indexOf('O'), 1);
    chars.splice(chars.indexOf('0'), 1);
  }
  if (strict) {
    var pwd = [];
    if (lcase) pwd.push(getRandChar(list.lcase));
    if (ucase) pwd.push(getRandChar(list.ucase));
    if (num) pwd.push(getRandChar(list.num));
    if (sym) pwd.push(getRandChar(list.sym));
    for (var i = pwd.length; i < len; i++) {
      pwd.push(getRandChar(chars.join('')));
    }
    return shuffleArray(pwd).join('');
  }
  return Array(len).fill(null).map(function () {
    return getRandChar(chars.join(''));
  }).join('');
}
function getRandChar(str) {
  return str.charAt(Math.floor(Math.random() * str.length));
}
function shuffleArray(a) {
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var _ref = [a[j], a[i]];
    a[i] = _ref[0];
    a[j] = _ref[1];
  }
  return a;
}

export { compare, create, encrypt, getDigest, getDigests, getKeyLen, getSaltRounds, setDigest, setKeyLen, setSaltRounds };
