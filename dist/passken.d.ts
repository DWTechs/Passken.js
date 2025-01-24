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

type Options = {
  len: number,
  num: boolean,
  ucase: boolean, 
  lcase: boolean,
  sym: boolean,
  strict: boolean,
  exclSimilarChars: boolean,
};
type Header = {
  alg: string;
  typ: string;
  kid: number | string | null;
};
type Payload = {
  iss: number | string;
  iat: number;
  exp?: number;
};
export type { Options, Header, Payload };

declare function getSaltRounds(): number;
declare function setSaltRounds(rnds: number): number | false;
declare function getKeyLen(): number;
declare function setKeyLen(len: number): number | false;
declare function getDigest(): string;
declare function setDigest(func: string): string | false;
declare function getDigests(): string[];
declare function encrypt(pwd: string, secret: string): string | false;
declare function compare(pwd: string, hash: string, secret: string): boolean;
declare function create(opts?: Partial<Options>): string;
declare function setSecret(secret: string): void;
declare function sign(iss: number | string, duration: number): string;
declare function encodeBase64(data: string): string;

export { 
  getSaltRounds,
  setSaltRounds,
  getKeyLen,
  setKeyLen,
  getDigest,
  setDigest,
  getDigests,
  encrypt,
  compare,
  create,
  setSecret, 
  sign, 
  encodeBase64,
};
