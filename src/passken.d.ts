type Options = {
  length: number,
  numbers: boolean,
  uppercase: boolean, 
  lowercase: boolean,
  symbols: boolean,
  strict: boolean,
  excludeSimilarCharacters: boolean,
};
export type { Options };


declare function getSaltRounds(): number;
declare function setSaltRounds(rounds: number): number;
declare function getKeyLen(): number;
declare function setKeyLen(len: number): number;
declare function getDigest(): string;
declare function setDigest(func: string): string;
declare function getDigests(): string[];
declare function encrypt(pwd: string, secret: string): string;
declare function compare(pwd: string, dbHash: string, secret: string): boolean;
declare function create(options?: Partial<Options>): string;

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
};
