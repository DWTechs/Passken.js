export type Options = {
  len: number;
  num: boolean;
  ucase: boolean;
  lcase: boolean;
  sym: boolean;
  strict: boolean;
  similarChars: boolean;
};

declare function randomPwd(opts?: Partial<Options>): string;

export { 
  randomPwd,
};
