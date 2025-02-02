import { randomBytes } from "node:crypto";
import { isBase64 } from "./jwt";
import * as base64 from "./base64";
import { isStringOfLength } from "@dwtechs/checkard";

const secretMinLength = 30;

function create(length = 32): string {
	const b64Secret = randomBytes(length).toString("base64");
	// Replace '+' with '-', '/' with '_', and remove '=' padding
	return b64Secret.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function checkSecret(b64Secret: string): string | false {
	// Check selected secret is base64
	if (!isBase64(b64Secret, true)) return false;
	const secret = base64.decode(b64Secret);
	// Check selected secret has the proper length
	if (!isStringOfLength(secret, secretMinLength, undefined)) return false;
	return secret;
}

export { create, checkSecret };
