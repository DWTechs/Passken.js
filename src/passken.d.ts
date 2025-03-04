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
};
