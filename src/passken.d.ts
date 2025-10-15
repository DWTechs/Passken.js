export type RandomOptions = {
    len: number;
    num: boolean;
    ucase: boolean;
    lcase: boolean;
    sym: boolean;
    strict: boolean;
    similarChars: boolean;
};
export type ValidationOptions = {
    lcase: boolean;
    ucase: boolean;
    num: boolean;
    sym: boolean;
    maxLen: number;
    minLen: number;
};

declare function randomPwd(opts?: Partial<RandomOptions>): string;
declare function isValidPassword(s: string, opts?: Partial<ValidationOptions>, throwErr?: boolean): boolean;

export { 
  randomPwd,
  isValidPassword,
};
