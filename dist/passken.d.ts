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

export type Options = {
  len: number;
  num: boolean;
  ucase: boolean;
  lcase: boolean;
  sym: boolean;
  strict: boolean;
  similarChars: boolean;
};
export type Type = "access" | "refresh";
export type Header = {
  alg: string;
  typ: string;
  kid: number;
};
export type Payload = {
  iss: number | string;
  iat: number;
  nbf: number;
  exp: number;
  typ: Type;
};

// Error classes
export abstract class PasskenError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
}

export class MissingAuthorizationError extends PasskenError {
  readonly code: string;
  readonly statusCode: number;
}

export class InvalidBearerFormatError extends PasskenError {
  readonly code: string;
  readonly statusCode: number;
}

export class InvalidTokenError extends PasskenError {
  readonly code: string;
  readonly statusCode: number;
}

export class TokenExpiredError extends PasskenError {
  readonly code: string;
  readonly statusCode: number;
}

export class TokenNotActiveError extends PasskenError {
  readonly code: string;
  readonly statusCode: number;
}

export class InvalidSignatureError extends PasskenError {
  readonly code: string;
  readonly statusCode: number;
}

export class MissingClaimsError extends PasskenError {
  readonly code: string;
  readonly statusCode: number;
}

export class InvalidIssuerError extends PasskenError {
  readonly code: string;
  readonly statusCode: number;
}

export class InvalidSecretsError extends PasskenError {
  readonly code: string;
  readonly statusCode: number;
}

export class InvalidDurationError extends PasskenError {
  readonly code: string;
  readonly statusCode: number;
}

export class SecretDecodingError extends PasskenError {
  readonly code: string;
  readonly statusCode: number;
}

export class HashLengthMismatchError extends PasskenError {
  readonly code: string;
  readonly statusCode: number;
}

export class InvalidPasswordError extends PasskenError {
  readonly code: string;
  readonly statusCode: number;
}

export class InvalidBase64SecretError extends PasskenError {
  readonly code: string;
  readonly statusCode: number;
}

declare function getSaltRounds(): number;
declare function setSaltRounds(rnds: number): boolean;
declare function getKeyLen(): number;
declare function setKeyLen(len: number): boolean;
declare function getDigest(): string;
declare function setDigest(func: string): boolean;
declare function getDigests(): string[];
declare function encrypt(pwd: string, b64Secret: string): string | false;
declare function compare(pwd: string, hash: string, b64Secret: string): boolean;
declare function randomPwd(opts?: Partial<Options>): string;
declare function randomSecret(length?: number): string;
declare function sign(iss: number | string, duration: number, type: Type, b64Keys: string[]): string;
declare function verify(token: string, b64Keys: string[], ignoreExpiration?: boolean): Payload;
declare function parseBearerToken(authorization: string | undefined): string;

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
  randomPwd,
  randomSecret,
  sign,
  verify,
  parseBearerToken,
};
