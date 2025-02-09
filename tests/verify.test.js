const { verify, sign } = require("../dist/passken.js");
// Mock data
const expiredToken =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6MH0.eyJpc3MiOiJ1c2VyMTIzIiwiaWF0IjoxNzM4MDgzODU2LCJuYmYiOjE3MzgwODM4NTcsImV4cCI6MTczODA4NzQ1Nn0.HycIDXjl_5BWM1Wx4xFWg1MHWCLGa97RCn57srPLKNk";
const invalidAlgToken =
	"eyJhbGciOiJpbnZhbGlkIiwidHlwIjoiSldUIiwia2lkIjowfQ.eyJpc3MiOiJ1c2VyMTIzIiwiaWF0IjoxNzM4MjMxNTQ0LCJuYmYiOjE3MzgyMzE1NDUsImV4cCI6MTczODIzNTE0NH0.bFhIP9c9oNf2kAk2usDBWFI57Xt3IK_BhonaTMGB5Ew";
const invalidTypToken =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IklOVkFMSUQiLCJraWQiOjB9.eyJpc3MiOiJ1c2VyMTIzIiwiaWF0IjoxNzM4MjMxNTk0LCJuYmYiOjE3MzgyMzE1OTUsImV4cCI6MTczODIzNTE5NH0.OX2EdvtBv5bQwblpmx0rmLZXWnn-zoGdClYPccRTQ80";
const invalidToken = "invalid.token.signature";
const b64Secrets = ["8zYSoxUV36qy8tiIGytsA7qPdFecywiQs0sHBze_Skg"];
const validToken = sign("user123", 3600, b64Secrets);

function wait(duration = 1000) {
	return new Promise((resolve) => setTimeout(resolve, duration));
}

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
		const result = verify(invalidAlgToken, b64Secrets);
		expect(result).toBe(false);
	});

	it("should return false for a token with invalid typ", () => {
		const result = verify(invalidTypToken, b64Secrets);
		expect(result).toBe(false);
	});

	it("should return false for a token with invalid kid", () => {
		const invalidKidToken = "invalidKid.token.signature";
		const result = verify(invalidKidToken, b64Secrets);
		expect(result).toBe(false);
	});

	it("should return false for a token with nbf claim in the future", () => {
		const result = verify(validToken, b64Secrets);
		expect(result).toBe(false);
	});

	it("should return false for a token with exp claim in the past", () => {
		const pastExpToken = expiredToken;
		const result = verify(pastExpToken, b64Secrets);
		expect(result).toBe(false);
	});

	it("should return the decoded token for a valid token", async () => {
		await wait(1000); // Wait to not throw nbf error
		const result = verify(validToken, b64Secrets);
		expect(result).toBe(true);
	});
});
