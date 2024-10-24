
[![License: MIT](https://img.shields.io/npm/l/@dwtechs/passken.svg?color=brightgreen)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40dwtechs%2Fpassken.svg)](https://www.npmjs.com/package/@dwtechs/passken)
[![last version release date](https://img.shields.io/github/release-date/DWTechs/Passken.js)](https://www.npmjs.com/package/@dwtechs/passken)
![Jest:coverage](https://img.shields.io/badge/Jest:coverage-100%25-brightgreen.svg)
[![minified size](https://img.shields.io/bundlephobia/min/@dwtechs/passken?color=brightgreen)](https://www.npmjs.com/package/@dwtechs/passken)

- [Synopsis](#synopsis)
- [Browsers](#browsers)
- [Installation](#installation)
- [Usage](#usage)
  - [ES6](#es6)
  - [CommonJS](#commonjs)
  - [IIFE](#iife)
- [API Reference](#api-reference)
- [Contributors](#contributors)
- [License](#license)
- [Stack](#stack)


## Synopsis
Safe pass encryption and other useful tools in Javascript


**[Passken.js](https://github.com/DWTechs/Passken.js)** is an open source xx library for Node.js to  (...)

- Only 3 dependencies to check inputs variables, encrypt passwords and generate passwords
- Very lightweight
- Thoroughly tested
- Works in Node.js
- Can be used as CommonJS or EcmaScrypt module
- Written in Typescript


## Support

- node: x.x

This is the oldest targeted versions. The library should work properly on older versions of Node.js but we do not support it officially.  


## Installation

```bash
$ npm i @dwtechs/passken
```


## Usage


### CommonJS

Example of use with Express.js in Javascript using CommonJS format 

```javascript
const pass = require("@dwtechs/passken/dist/passken.cjs");

/**
 * This function checks if a user-provided password matches a stored hashed password in a database.
 * It takes a request object req and a response object res as input, and uses a pass service to compare the password.
 * If the password is correct, it calls the next() function to proceed with the request.
 * If the password is incorrect or missing, it calls next() with an error status and message.
 */
function compare(req, res, next) {
  const pwd = req.body.pwd; // from request
  const dbHash = res.rows[0].password; //from db
  if (pass.compare(pwd, dbHash))
    return next();
  
  return next({ status: 401, msg: "Wrong password" });
}

/**
 * Generates random passwords for multiple users and encrypts them.
 */
function create(req, res, next) {

  for (const u of req.body.rows) {
    u.pwd = passwordGen.generate({
      length: PWD_AUTO_LENGTH,
      numbers: PWD_AUTO_NUMBERS,
      uppercase: PWD_AUTO_UPPERCASE,
      lowercase: PWD_AUTO_LOWERCASE,
      symbols: PWD_AUTO_SYMBOLS,
      strict: PWD_AUTO_STRICT,
      excludeSimilarCharacters: PWD_AUTO_EXCLUDE_SIMILAR_CHARS,
    });
    u.encryptedPwd = pass.encrypt(u.pwd);
  }
  next();
}


module.exports = {
  compare,
  create,
};

```


### ES6 / TypeScript

Import of the Passken.js module into a Typescript file

```javascript

import { encrypt } from "@dwtechs/passken";

```


## API Reference


```javascript

let saltRounds = 12 //Default value

getSaltRounds(): number {}

setSaltRounds(r: number): number {} // between 12 and 100

encrypt(pwd: string, secret: string): string | false {}

compare(pwd: string, dbHash: string, secret: string): boolean {}

```


## Contributors

Passken.js is still in development and we would be glad to get all the help you can provide.
To contribute please read **[contributor.md](https://github.com/DWTechs/Passken.js/blob/main/contributor.md)** for detailed installation guide.


## Stack

| Purpose         |                    Choice                    |                                                     Motivation |
| :-------------- | :------------------------------------------: | -------------------------------------------------------------: |
| repository      |        [Github](https://github.com/)         |     hosting for software development version control using Git |
| package manager |     [npm](https://www.npmjs.com/get-npm)     |                                default node.js package manager |
| language        | [TypeScript](https://www.typescriptlang.org) | static type checking along with the latest ECMAScript features |
| module bundler  |      [Rollup.js](https://rollupjs.org)       |                        advanced module bundler for ES6 modules |
| unit testing    |          [Jest](https://jestjs.io/)          |                  delightful testing with a focus on simplicity |
