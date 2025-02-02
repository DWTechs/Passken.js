import { randSecret } from "../dist/passken.js";

describe("randSecret", () => {
	it("should generate a secret of the default length (32 bytes)", () => {
		const secret = randSecret();
		// Base64 encoding of 32 bytes results in a string of length 44
		expect(secret).toHaveLength(43); // 44 - 1 (due to padding removal)
	});

	it("should generate a secret of the specified length (16 bytes)", () => {
		const secret = randSecret(16);
		// Base64 encoding of 16 bytes results in a string of length 24
		expect(secret).toHaveLength(22); // 24 - 2 (due to padding removal)
	});

	it("should generate a secret of the specified length (64 bytes)", () => {
		const secret = randSecret(64);
		// Base64 encoding of 64 bytes results in a string of length 88
		expect(secret).toHaveLength(86); // 88 - 2 (due to padding removal)
	});

	it('should not contain "+" characters', () => {
		const secret = randSecret();
		expect(secret).not.toContain("+");
	});

	it('should not contain "/" characters', () => {
		const secret = randSecret();
		expect(secret).not.toContain("/");
	});

	it('should not contain "=" characters', () => {
		const secret = randSecret();
		expect(secret).not.toContain("=");
	});

	it("should generate unique secrets 1", () => {
		const secret1 = randSecret();
		const secret2 = randSecret();
		expect(secret1).not.toEqual(secret2);
	});

	it("should generate unique secrets 2", () => {
		const secret1 = randSecret(64);
		const secret2 = randSecret(64);
		expect(secret1).not.toEqual(secret2);
	});

	it("should generate unique secrets 3", () => {
		const secret1 = randSecret(128);
		const secret2 = randSecret(128);
		expect(secret1).not.toEqual(secret2);
	});

	it("should handle a length of 0 without throwing an error", () => {
		const secret = randSecret(0);
		expect(secret).toHaveLength(0);
	});

	it("should return an empty string or throw an error for negative lengths", () => {
		expect(() => randSecret(-1)).toThrow(
			'The value of "size" is out of range. It must be >= 0 && <= 2147483647. Received -1',
		);
	});

	it("should handle very large lengths", () => {
		const largeLength = 10000;
		const secret = randSecret(largeLength);
		expect(secret.length).toBeGreaterThan(10000);
	});

	it("should only contain URL-friendly characters", () => {
		const secret = randSecret();
		expect(secret).toMatch(/^[A-Za-z0-9_-]*$/);
	});
});
