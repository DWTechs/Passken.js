export type Options = {
  len: number,
  num: boolean,
  ucase: boolean,
  lcase: boolean,
  sym: boolean,
  strict: boolean,
  exclSimilarChars: boolean,
};

export type Header = {
  alg: string,
  typ: string,
  kid: number | string | null,
};

export type Payload = {
  iss: number | string,
  iat: number,
  exp?: number,
}