export {  getSaltRounds,
          setSaltRounds,
          getKeyLen,
          setKeyLen,
          getDigest,
          setDigest,
          getDigests,
          encrypt,
          compare } from './hash';
export {  create as randPwd } from './pwd';
export {  sign, verify } from './jwt';
export {  create as randSecret } from './secret';