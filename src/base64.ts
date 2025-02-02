/**
 * Decodes Base64 url encoded strings.
 * @param {string} str
 * @returns {string} Decoded string.
 */
function decode(str: string): string {
	const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
	const padding = "=".repeat((4 - (base64.length % 4)) % 4);
	return Buffer.from(base64 + padding, "base64").toString("utf8");
}

/**
 * Encodes the given data and returns it as a url encoded base64 string.
 *
 * @param {string} data - The data to be encrypted.
 * @return {string} The encrypted data in base64 format.
 */
function encode(str: string): string {
	return Buffer.from(str)
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

export { encode, decode };
