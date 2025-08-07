export type Options = {
  len: number;
  num: boolean;
  ucase: boolean;
  lcase: boolean;
  sym: boolean;
  strict: boolean;
  similarChars: boolean;
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

declare function randomPwd(opts?: Partial<Options>): string;

export { 
  randomPwd,
};
