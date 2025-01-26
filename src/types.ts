export type Options = {
  len: number,
  num: boolean,
  ucase: boolean,
  lcase: boolean,
  sym: boolean,
  strict: boolean,
  similarChars: boolean,
};

export type Header = {
  alg: string,
  typ: string,
  kid: number,
};

export type Payload = {
  iss: number | string,
  iat: number,
  nbf: number,
  exp: number,
}