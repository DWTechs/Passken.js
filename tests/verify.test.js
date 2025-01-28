const { verify, sign } = require("../dist/passken.js");
// Mock data
const expiredToken =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6MH0.eyJpc3MiOiJ1c2VyMTIzIiwiaWF0IjoxNzM4MDgzODU2LCJuYmYiOjE3MzgwODM4NTcsImV4cCI6MTczODA4NzQ1Nn0.HycIDXjl_5BWM1Wx4xFWg1MHWCLGa97RCn57srPLKNk";
const invalidToken = "invalid.token.signature";
const b64Secrets = ["8zYSoxUV36qy8tiIGytsA7qPdFecywiQs0sHBze_Skg"];
const validToken = sign("user123", 3600, b64Secrets);

describe("verify", () => {
	it("should return false for a token with invalid segments", () => {
		const result = verify("invalid.token", b64Secrets);
		expect(result).toBe(false);
	});

	it("should return false for a token with invalid header", () => {
		const payload = verify(invalidToken, b64Secrets);
		expect(payload).toBe(false);
	});

	it("should return false for a token with invalid payload", () => {
		const result = verify("valid.token.invalidPayload", b64Secrets);
		expect(result).toBe(false);
	});

	it("should return false for a token with invalid algorithm", () => {
		const invalidAlgToken = "invalidAlg.token.signature";
		const result = verify(invalidAlgToken, b64Secrets);
		expect(result).toBe(false);
	});

	it("should return false for a token with invalid typ", () => {
		const invalidTypToken = "invalidTyp.token.signature";
		const result = verify(invalidTypToken, b64Secrets);
		expect(result).toBe(false);
	});

	it("should return false for a token with invalid kid", () => {
		const invalidKidToken = "invalidKid.token.signature";
		const result = verify(invalidKidToken, b64Secrets);
		expect(result).toBe(false);
	});

	it("should return false for a token with nbf claim in the future", () => {
		const futureNbfToken = "futureNbf.token.signature";
		const result = verify(futureNbfToken, b64Secrets);
		expect(result).toBe(false);
	});

	it("should return false for a token with exp claim in the past", () => {
		const pastExpToken = "pastExp.token.signature";
		const result = verify(pastExpToken, b64Secrets);
		expect(result).toBe(false);
	});

	it("should return the decoded token for a valid token", () => {
		const result = verify(validToken, b64Secrets);
		expect(result).toBe(true);
	});
});
