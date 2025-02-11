import { randomBytes } from "node:crypto";
import * as base64 from "./base64";
import { isString, isBase64 } from "@dwtechs/checkard";

const secretMinLength = 30;

function create(length = 32): string {
	const b64Secret = randomBytes(length).toString("base64");
	// Replace '+' with '-', '/' with '_', and remove '=' padding
	return b64Secret.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decode(b64Secret: string): string {
	
	if (!isBase64(b64Secret, true)) 
    throw new Error("Invalid base64 string.");
	
  const secret = base64.decode(b64Secret);
	// Check selected secret has the proper length
	if (!isString(secret, ">=", secretMinLength))
    throw new Error(`Secret must be at least ${secretMinLength} characters long. Received ${secret.length}.`);
	
  return secret;

}

export { create, decode };
