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
