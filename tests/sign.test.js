import { sign, randSecret } from "../dist/passken.js";
import { isBase64 } from "@dwtechs/checkard"

describe("encodeBase64", () => {
	const secret = [randSecret()];
	test("generates a token string with valid inputs", () => {
		const token = sign("user123", 3600, secret); // Assuming duration is in seconds
		expect(typeof token).toBe("string");
		expect(token.split(".").length).toBe(3); // Basic check for JWT structure
	});

	// test('throws an error with invalid issuer type', () => {
	//   expect(() => sign(undefined, 3600)).toThrow();
	//   expect(() => sign(null, 3600)).toThrow();
	// });

	// More detailed JWT structure and expiration validation can be done
	// using a JWT library to decode and inspect the payload.
	test("correctly sets the expiration based on duration", () => {
		const currentTime = Math.floor(Date.now() / 1000);
		const duration = 3600; // 1 hour
		const token = sign("user123", duration, secret);
		const payload = JSON.parse(
			Buffer.from(token.split(".")[1], "base64").toString(),
		);

		expect(payload.exp).toBeDefined();
		expect(payload.exp).toBeGreaterThan(currentTime);
		expect(payload.exp - currentTime).toBeCloseTo(duration, -1); // Allowing some leeway for execution time
	});

	test("generates a token with numeric issuer", () => {
		const token = sign(12345, 3600, secret);
		expect(typeof token).toBe("string");
	});

	test("returns false with an empty secrets array", () => {
		const token = sign("user123", 3600, []);
		expect(token).toBe(false);
	});

	test("handles a negative duration gracefully", () => {
		const token = sign("user123", -3600, secret);
		expect(token).toBe(false);
	});

	test("returns false if no issuer is provided", () => {
		const token = sign("", 3600, secret);
		expect(token).toBe(false);
	});

	test("ensures the signature is Base64 URL-safe encoded", () => {
		const token = sign("user123", 3600, secret);
		const signature = token.split(".")[2];
		expect(isBase64(signature, true).toBe(true));
	});

	test("handles a very long duration", () => {
		const longDuration = 3600 * 24 * 365; // Un an
		const token = sign("user123", longDuration, secret);
		expect(typeof token).toBe("string");
	});

	test("ensures the generated token contains the correct payload structure", () => {
		const token = sign("user123", 3600, secret);
		const payloadBase64 = token.split(".")[1];
		const payload = JSON.parse(Buffer.from(payloadBase64, "base64").toString());
		expect(payload).toHaveProperty("iss");
		expect(payload).toHaveProperty("iat");
		expect(payload).toHaveProperty("nbf");
		expect(payload).toHaveProperty("exp");
	});

	test("handles issuer with special characters", () => {
		const token = sign("user name with spaces & symbols #@", 3600, secret);
		expect(typeof token).toBe("string");
	});

	test("rejects entirely non-conforming secrets array", () => {
		const badSecrets = ["tooShort", "notBase64Encoded"];
		const token = sign("user123", 3600, badSecrets);
		expect(token).toBe(false);
	});
});
