
[![License: MIT](https://img.shields.io/npm/l/@dwtechs/passken.svg?color=brightgreen)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40dwtechs%2Fpassken.svg)](https://www.npmjs.com/package/@dwtechs/passken)
[![last version release date](https://img.shields.io/github/release-date/DWTechs/Passken.js)](https://www.npmjs.com/package/@dwtechs/passken)
![Jest:coverage](https://img.shields.io/badge/Jest:coverage-100%25-brightgreen.svg)
[![minified size](https://img.shields.io/bundlephobia/min/@dwtechs/passken?color=brightgreen)](https://www.npmjs.com/package/@dwtechs/passken)

- [Synopsis](#synopsis)
- [Support](#support)
- [Installation](#installation)
- [Usage](#usage)
  - [ES6](#es6)
  - [CommonJS](#commonjs)
  - [Configure](#configure)
- [API Reference](#api-reference)
- [Express.js](#expressjs)
- [Contributors](#contributors)
- [Stack](#stack)


## Synopsis

**[Passken.js](https://github.com/DWTechs/Passken.js)** is an open source password management library for Node.js to create, encrypt and compare passwords safely.

- Only 1 dependency to check inputs variables
- Very lightweight
- Thoroughly tested
- Works in Node.js
- Can be used as CommonJS or EcmaScrypt module
- Written in Typescript


## Support

- Node.js: 16

This is the oldest targeted versions. The library should not work properly on older versions of Node.js because it uses node:crypto in order to not depend on external dependencies.  


## Installation

```bash
$ npm i @dwtechs/passken
```


## Usage


### ES6 / TypeScript

Example of use with Express.js in Typescript using ES6 module format

```javascript

import { compare, create, encrypt } from "@dwtechs/passken";

const { PWD_SECRET } = process.env;

/**
 * This function checks if a user-provided password matches a stored hashed password in a database.
 * It takes a request object req and a response object res as input, and uses a pass service to compare the password.
 * If the password is correct, it calls the next() function to proceed with the request.
 * If the password is incorrect or missing, it calls next() with an error status and message.
 */
function comparePwd(req, res, next) {
  
  const pwd = req.body.pwd; // from request
  const hash = req.user.hash; //from db
  if (compare(pwd, hash, PWD_SECRET))
    return next();
  
  return next({ status: 401, msg: "Wrong password" });

}

/**
 * Generates random passwords for a user and encrypts it.
 */
function createPwd(req, res, next) {

  const user = req.body.user;
  const pwd = create();
  const encryptedPwd = encrypt(pwd, PWD_SECRET);
  next();

}

export {
  comparePwd,
  createPwd,
};


```


### CommonJS

Example of use with Express.js in Javascript using CommonJS format 

```javascript
const pk = require("@dwtechs/passken");

const { PWD_SECRET } = process.env;
/**
 * This function checks if a user-provided password matches a stored hashed password in a database.
 * If the password is correct, it calls the next() function to proceed with the request.
 * If the password is incorrect or missing, it calls next() with an error status and message.
 */
function compare(req, res, next) {
  
  const pwd = req.body.pwd; // from request
  const hash = req.user.hash; //from db
  if (pk.compare(pwd, hash, PWD_SECRET))
    return next();
  
  return next({ status: 401, msg: "Wrong password" });

}

/**
 * Generates random passwords for a user and encrypts it.
 */
function create(req, res, next) {

  const user = req.body.user;
  const options = {
  len: 12,
  num: true,
  ucase: true,
  lcase: true,
  sym: false,
  strict: true,
  exclSimilarChars: true,
};
  const pwd = pk.create(options);
  const encryptedPwd = pk.encrypt(pwd, PWD_SECRET);
  next();

}


module.exports = {
  compare,
  create,
};

```


### Configure

Passken will start with the following default password configuration : 

```Javascript
  Options = {
    len: 12,
    num: true,
    ucase: true,
    lcase: true,
    sym: false,
    strict: true,
    exclSimilarChars: true,
  };
```

### Environment variables

You can update password configuration using the following environment variables :  

```bash
  PWD_AUTO_LENGTH,
  PWD_AUTO_NUMBERS,
  PWD_AUTO_UPPERCASE,
  PWD_AUTO_LOWERCASE,
  PWD_AUTO_SYMBOLS,
  PWD_AUTO_STRICT,
  PWD_AUTO_EXCLUDE_SIMILAR_CHARS,
  PWD_SECRET,
```

These environment variables will update the default values of the lib at start up.


## API Reference


### Types

```javascript

type Options = {
  len: number,
  num: boolean,
  ucase: boolean,
  lcase: boolean,
  sym: boolean,
  strict: boolean,
  exclSimilarChars: boolean,
};

```


### Methods

```javascript

// Default values
let saltRnds = 12
let digest = "sha256";
let keyLen = 64;

getSaltRounds(): number {}

setSaltRounds(rnds: number): number {} // between 12 and 100

getKeyLen(): number {}

setKeyLen(r: number): number {} // between 2 and 256

getDigest(): string {}

setDigest(d: string): string {} // the list of available digests can be given by getDigests()

getDigests(): string[] {}

encrypt(pwd: string, secret: string): string | false {}

compare(pwd: string, hash: string, secret: string): boolean {}

create(opts: Partial<Options> = defOpts): string {}

```

### Available options for password generation

Any of these can be passed into the options object for each function.

| Name            |               Description                    |  Default value  |  
| :-------------- | :------------------------------------------ | :-------------- |
| len	| Integer, length of password.  |   12 |
| num*	| Boolean, put numbers in password.  |  true |
| sym*	| Boolean, put symbols in password.  |	true |
| lcase*	| Boolean, put lowercase in password   |  true |
| ucase*	| Boolean, use uppercase letters in password.   |	  true |
| exclSimilarChars	| Boolean, exclude similar chars, like 'i' and 'l'.	 |  true | 
| strict	| Boolean, password must include at least one character from each pool.	 |  true |

*At least one should be true.


## Express.js

You can use Passken directly as Express.js middlewares using [@dwtechs/passken-express library](https://www.npmjs.com/package/@dwtechs/passken-express).
This way you do not have to write express controllers yourself to use **Passken**.

How to use : 

```javascript

import pwd from "@dwtechs/passken-express";
import express from "express";
const router = express.Router();

import user from "../controllers/user.js";
import mail from "../controllers/mail.js";
import token from "../controllers/token.js";

// middleware sub-stacks

// add users
const addMany = [
  user.validate,
  pwd.create,
  user.addMany,
  mail.sendRegistration,
];

// Login user
const login = [
  token.validate,
  user.getPwd,
  pwd.compare,
  user.isActive,
];

// Routes

// log a user with his email & password
router.post("/", login);

// Add new users
router.post("/", addMany);

```


## Contributors

Passken.js is still in development and we would be glad to get all the help you can provide.
To contribute please read **[contributor.md](https://github.com/DWTechs/Passken.js/blob/main/contributor.md)** for detailed installation guide.


## Stack

| Purpose         |                    Choice                    |                             Motivation |
| :-------------- | :------------------------------------------: | -------------------------------------------------------------: |
| repository      |        [Github](https://github.com/)         |     hosting for software development version control using Git |
| package manager |     [npm](https://www.npmjs.com/get-npm)     |                                default node.js package manager |
| language        | [TypeScript](https://www.typescriptlang.org) | static type checking along with the latest ECMAScript features |
| module bundler  |      [Rollup.js](https://rollupjs.org)       |                        advanced module bundler for ES6 modules |
| unit testing    |          [Jest](https://jestjs.io/)          |                  delightful testing with a focus on simplicity |
