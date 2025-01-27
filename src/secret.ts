import { randomBytes } from "node:crypto";

function create(length = 32): string {
  const b64Secret =  randomBytes(length).toString('base64');
  // Replace '+' with '-', '/' with '_', and remove '=' padding
  return b64Secret.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export {
  create
}