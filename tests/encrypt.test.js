import { encrypt } from "../dist/passken.js";

describe("encrypt", () => {
	const password = "mySecret!/;6[à}Pwd";
	const InvalidSecret = "mySuperFancySecret";
	const validSecret = "8zYSoxUV36qy8tiIGytsA7qPdFecywiQs0sHBze_Skg";

	test("returns a string when password and secret are valid", () => {
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

	test("returns false because secret is not long enough", () => {
		const specialPassword = "p@$$w0rd! 特别";
		const specialSecret = "secrét$ 特别";
		expect(encrypt(specialPassword, specialSecret)).toBe(false);
	});

	test("returns false because secret is not in base64", () => {
		const specialPassword = "p@$$w0rd! 特别";
		const specialSecret = "secrét$ 特别aaaaaaaaaaaaaaaaaaaaa";
		expect(encrypt(specialPassword, specialSecret)).toBe(false);
	});

	test("returns false for non-string inputs", () => {
		expect(encrypt(null, validSecret)).toBe(false);
		expect(encrypt(password, null)).toBe(false);
		expect(encrypt({}, validSecret)).toBe(false);
		expect(encrypt(password, [])).toBe(false);
	});
});
