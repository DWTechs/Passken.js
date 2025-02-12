type Options = {
  len: number,
  num: boolean,
  ucase: boolean, 
  lcase: boolean,
  sym: boolean,
  strict: boolean,
  similarChars: boolean,
};

export type { Options };

declare function getSaltRounds(): number;
declare function setSaltRounds(rnds: number): number | false;
declare function getKeyLen(): number;
declare function setKeyLen(len: number): number | false;
declare function getDigest(): string;
declare function setDigest(func: string): string | false;
declare function getDigests(): string[];
declare function encrypt(pwd: string, secret: string): string | false;
declare function compare(pwd: string, hash: string, secret: string): boolean;
declare function randPwd(opts?: Partial<Options>): string;
declare function randSecret(length?: number): string;
declare function sign(iss: number | string, duration: number, b64Secrets: string[]): string | false;
declare function verify(token: string, b64Secrets: string[]): boolean;
declare function decode(str: string): string;
declare function encode(str: string): string;

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
  randPwd,
  randSecret,
  sign,
  verify,
  decode,
  encode,
};
