
[![License: MIT](https://img.shields.io/npm/l/@dwtechs/passken.svg?color=brightgreen)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40dwtechs%2Fpassken.svg)](https://www.npmjs.com/package/@dwtechs/passken)
[![last version release date](https://img.shields.io/github/release-date/DWTechs/Passken.js)](https://www.npmjs.com/package/@dwtechs/passken)
![Jest:coverage](https://img.shields.io/badge/Jest:coverage-95%25-brightgreen.svg)

- [Synopsis](#synopsis)
- [Support](#support)
- [Installation](#installation)
- [Usage](#usage)
  - [Configure](#configure)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [options](#options)
- [Express.js](#expressjs)
- [Contributors](#contributors)
- [Stack](#stack)


## Synopsis

**[Passken.js](https://github.com/DWTechs/Passken.js)** is an open source password generation library for Node.js.

- 📦 Only 1 dependency to check inputs variables
- 🪶 Very lightweight
- 🧪 Thoroughly tested
- 🚚 Shipped as EcmaScrypt module
- 📝 Written in Typescript


## Support

- Node.js: 22

This is the oldest targeted versions.  


## Installation

```bash
$ npm i @dwtechs/passken
```


## Usage

Usage example of use with Express.js using ES6 module format

```javascript

import { randomPwd } from "@dwtechs/passken";
import { encrypt } from "@dwtechs/hashitaka";


/**
 * Generates a random password for a user and encrypts it.
 */
function createPwd(req, res, next) {

  const user = req.body.user;
  const options = {
    len: 14,
    num: true,
    ucase: true,
    lcase: true,
    sym: true,
    strict: true,
    similarChars: true,
  };
  user.pwd = randomPwd(options);
  user.pwdHash = encrypt(user.pwd, PWD_SECRET);
  next();

}

export {
  createPwd,
};

```

Usage example for password validation : 

```javascript

import { isValidPassword } from "@dwtechs/passken";

const PwdOptions = {
  lcase: true,
  ucase: true,
  num: true,
  sym: false,
  minLen: 12,
  maxLen: 16,
};
const password = 'teSt1234';

if (isValidPassword(password, PwdOptions)) {
  // check if password is valid compared to PwdOptions
}

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
    similarChars: false,
  };
```

### Environment variables

You can update password default configuration using the following environment variables :  

```bash
  PWD_LENGTH,
  PWD_NUMBERS,
  PWD_UPPERCASE,
  PWD_LOWERCASE,
  PWD_SYMBOLS,
  PWD_STRICT,
  PWD_SIMILAR_CHARS,
```

These environment variables will update the default values of the lib at start up.
With this strategy you do not need to send options parameter in the randomPwd() method anymore.


## API Reference


### Types
---

```javascript

type Options = {
  len: number,
  num: boolean,
  ucase: boolean,
  lcase: boolean,
  sym: boolean,
  strict: boolean,
  similarChars: boolean,
};

type PasswordOptions = {
  lcase: boolean,
  ucase: boolean,
  num: boolean,
  sym: boolean,
  maxLen: number,
  minLen: number
}

```

### Methods
---

#### Password

```javascript

/**
 * Generate a random password.
 * 
 * @param {Partial<Options>} opts - The options to generate the password.
 * @returns {string} The generated password.
 * 
 */
function randomPwd(opts: Partial<Options> = defOpts): string {}


const PwdDefaultOptions = {
  lcase: true,
  ucase: true,
  num: true,
  sym: true,
  minLen: 12,
  maxLen: 64,
};

/**
 * Checks if a given password string meets the specified validation criteria.
 *
 * @param {string} s - The password string to validate.
 * @param {PasswordOptions} [options=defaultOptions] - Optional configuration object to specify password validation criteria.
 * @param {boolean} [throwErr=false] - If true, throws an error when password does not meet criteria. If false, returns false.
 * @returns {boolean} `true` if the password meets all the specified criteria, false if not (when throwErr is false).
 * @throws {Error} Throws an error if the password does not meet the specified criteria and throwErr is true.
 *
 * @example
 * ```typescript
 * const options = {
 *   minLen: 8,
 *   maxLen: 20,
 *   lcase: true,
 *   ucase: true,
 *   num: true,
 *   sym: true
 * };
 * const isValid = isValidPassword('Password123!', options);
 * console.log(isValid); // true
 * ```
 */
function isValidPassword(
  s: string, 
  options: PasswordOptions = defaultOptions, 
  throwErr: boolean = false
): boolean {}


```


## options

**RandomPWD()** :

| Name         | type    |              Description                                     | Default |  
| :----------- | :------ | :----------------------------------------------------------- | :------ |
| len	         | Integer | Minimal length of password                                   | 12      |
| num*	       | Boolean | use numbers in password                                      | true    |
| sym*	       | Boolean | use symbols in password                                      | true    |
| lcase*	     | Boolean | use lowercase in password                                    | true    |
| ucase*	     | Boolean | use uppercase letters in password                            | true    |
| strict	     | Boolean | password must include at least one character from each pool 	| true    |
| similarChars | Boolean | allow close looking chars                                    | false   | 

*At least one of those options must be true.  


**isValidPassword()** :

| Name    | type    |              Description           | Default |  
| :------ | :------ | :--------------------------------- | :------ |
| minLen  | Integer | Minimal length of password         | 12      |
| maxLen  | Integer | Maximal length of password         | 64      |
| num 	  | Boolean | use numbers in password            | true    |
| sym	    | Boolean | use symbols in password            | true    |
| lcase 	| Boolean | use lowercase in password          | true    |
| ucase 	| Boolean | use uppercase letters in password  | true    |

- Symbols used : !@#%*_-+=:?><./()  
- Similar characters : l, I, 1, o, O, 0


## Express.js

You can use Passken directly as Express.js middlewares using [@dwtechs/passken-express library](https://www.npmjs.com/package/@dwtechs/passken-express).
This way you do not have to write express controllers yourself to use **Passken**.  
**@dwtechs/passken-express** brings middleware features for **@dwtechs/passken** and **@dwtechs/hashitaka** libraries. 


## Contributors

**Passken.js** is still in development and we would be glad to get all the help you can provide.
To contribute please read **[contributor.md](https://github.com/DWTechs/Passken.js/blob/main/contributor.md)** for detailed installation guide.


## Stack

| Purpose         |                    Choice                    |                             Motivation |
| :-------------- | :------------------------------------------: | -------------------------------------------------------------: |
| repository      |        [Github](https://github.com/)         |     hosting for software development version control using Git |
| package manager |     [npm](https://www.npmjs.com/get-npm)     |                                default node.js package manager |
| language        | [TypeScript](https://www.typescriptlang.org) | static type checking along with the latest ECMAScript features |
| module bundler  |      [Rollup.js](https://rollupjs.org)       |                        advanced module bundler for ES6 modules |
| unit testing    |          [Jest](https://jestjs.io/)          |                  delightful testing with a focus on simplicity |
