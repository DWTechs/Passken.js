import { encrypt, randomSecret } from "../dist/passken.js";

describe("encrypt", () => {
	const password = "mySecret!/;6(A)Pwd";
	const InvalidSecret = {};
	const validSecret = randomSecret();
  console.log("validSecret", validSecret);

	test("returns a string when password and secret are encrypted", () => {
		expect(typeof encrypt(password, validSecret)).toBe("string");
	});

	test("returns false when password is empty", () => {
		expect(encrypt("", validSecret)).toBe(false);
	});

	test("returns false when secret is empty", () => {
		expect(encrypt(password, "")).toBe(false);
	});

	test("returns false when secret is invalid", () => {
		expect(encrypt(password, InvalidSecret)).toBe(false);
	});

	test("returns false when password is not a string", () => {
		expect(encrypt(123, validSecret)).toBe(false);
	});

	test("returns false when secret is not a string", () => {
		expect(encrypt(password, 123)).toBe(false);
	});

	test("generates different hashes for the same password and secret", () => {
		const hash1 = encrypt(password, validSecret);
		const hash2 = encrypt(password, validSecret);
		expect(hash1).not.toBe(hash2);
	});

	test("returns false for non-string inputs", () => {
		expect(encrypt(null, validSecret)).toBe(false);
		expect(encrypt(password, null)).toBe(false);
		expect(encrypt({}, validSecret)).toBe(false);
		expect(encrypt(password, [])).toBe(false);
	});
});
