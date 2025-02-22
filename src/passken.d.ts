export type Options = {
  len: number;
  num: boolean;
  ucase: boolean;
  lcase: boolean;
  sym: boolean;
  strict: boolean;
  similarChars: boolean;
};
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
};

declare function getSaltRounds(): number;
declare function setSaltRounds(rnds: number): number | false;
declare function getKeyLen(): number;
declare function setKeyLen(len: number): number | false;
declare function getDigest(): string;
declare function setDigest(func: string): string | false;
declare function getDigests(): string[];
declare function hash(pwd: string, secret: string): string;
declare function encrypt(pwd: string, b64Secret: string): string | false;
declare function compare(pwd: string, hash: string, b64Secret: string): boolean;
declare function randomPwd(opts?: Partial<Options>): string;
declare function randomSecret(length?: number): string;
declare function sign(iss: number | string, duration: number, b64Secrets: string[]): string | false;
declare function verify(token: string, b64Secrets: string[]): boolean;

export { 
  getSaltRounds,
  setSaltRounds,
  getKeyLen,
  setKeyLen,
  getDigest,
  setDigest,
  getDigests,
  hash,
  encrypt,
  compare,
  randomPwd,
  randomSecret,
  sign,
  verify,
};
