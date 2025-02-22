import { randomBytes } from "node:crypto";
import { b64Encode } from "@dwtechs/checkard";

// 32 bytes = 44 characters minimum
function create(length = 32): string {
	return b64Encode(randomBytes(length).toString("utf8"), true);
}

export { create };
