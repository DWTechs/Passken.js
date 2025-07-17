import { parseBearerToken, BEARER_TOKEN_ERROR_MESSAGE } from "../dist/passken.js";

describe("parseBearerToken", () => {
  
  describe("Valid Bearer tokens", () => {
    test("extracts token from valid Bearer authorization header", () => {
      const validHeader = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
      const expectedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
      
      const result = parseBearerToken(validHeader);
      
      expect(result).toBe(expectedToken);
      expect(typeof result).toBe("string");
    });

    test("extracts token with mixed case Bearer", () => {
      const header = "Bearer abc123def456";
      const expectedToken = "abc123def456";
      
      const result = parseBearerToken(header);
      
      expect(result).toBe(expectedToken);
    });

    test("extracts complex token with special characters", () => {
      const complexToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImp0aSI6IjIzNDU2Nzg5IiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjJ9.7V-dJp7J6j7LbJ5r2Q2Q1pQ5yQ6fQ7pQ9rQ3rQ4rQ5r";
      const header = `Bearer ${complexToken}`;
      
      const result = parseBearerToken(header);
      
      expect(result).toBe(complexToken);
    });

    test("extracts token with extra spaces after Bearer", () => {
      const token = "validToken123";
      const header = `Bearer  ${token}`; // Two spaces
      
      const result = parseBearerToken(header);
      
      expect(result).toBe(token);
    });

    test("extracts very long token", () => {
      const longToken = "a".repeat(1000); // Very long token
      const header = `Bearer ${longToken}`;
      
      const result = parseBearerToken(header);
      
      expect(result).toBe(longToken);
    });
  });

  describe("Invalid Bearer tokens - should throw errors", () => {
    test("throws error for empty string", () => {
      expect(() => {
        parseBearerToken("");
      }).toThrow(BEARER_TOKEN_ERROR_MESSAGE);
    });

    test("throws error for Bearer without token", () => {
      expect(() => {
        parseBearerToken("Bearer");
      }).toThrow(BEARER_TOKEN_ERROR_MESSAGE);
    });

    test("throws error for Bearer with only space", () => {
      expect(() => {
        parseBearerToken("Bearer ");
      }).toThrow(BEARER_TOKEN_ERROR_MESSAGE);
    });

    test("throws error for Bearer with multiple spaces but no token", () => {
      expect(() => {
        parseBearerToken("Bearer   ");
      }).toThrow(BEARER_TOKEN_ERROR_MESSAGE);
    });

    test("throws error for Basic authentication", () => {
      expect(() => {
        parseBearerToken("Basic dXNlcjpwYXNzd29yZA==");
      }).toThrow(BEARER_TOKEN_ERROR_MESSAGE);
    });

    test("throws error for lowercase bearer", () => {
      expect(() => {
        parseBearerToken("bearer sometoken123");
      }).toThrow(BEARER_TOKEN_ERROR_MESSAGE);
    });

    test("throws error for uppercase BEARER", () => {
      expect(() => {
        parseBearerToken("BEARER sometoken123");
      }).toThrow(BEARER_TOKEN_ERROR_MESSAGE);
    });

    test("throws error for missing Bearer prefix", () => {
      expect(() => {
        parseBearerToken("sometoken123");
      }).toThrow(BEARER_TOKEN_ERROR_MESSAGE);
    });

    test("throws error for malformed header with Bearer in wrong position", () => {
      expect(() => {
        parseBearerToken("Token Bearer sometoken123");
      }).toThrow(BEARER_TOKEN_ERROR_MESSAGE);
    });

    test("throws error for null input", () => {
      expect(() => {
        parseBearerToken(null);
      }).toThrow();
    });

    test("throws error for undefined input", () => {
      expect(() => {
        parseBearerToken(undefined);
      }).toThrow();
    });

    test("throws error for Bearer with tab character", () => {
      expect(() => {
        parseBearerToken("Bearer\tsometoken");
      }).toThrow(BEARER_TOKEN_ERROR_MESSAGE);
    });

    test("throws error for Bearer with newline", () => {
      expect(() => {
        parseBearerToken("Bearer\nsometoken");
      }).toThrow(BEARER_TOKEN_ERROR_MESSAGE);
    });
  });

  describe("Edge cases", () => {
    test("handles token that looks like Bearer prefix", () => {
      const tokenValue = "Bearer_like_token_123";
      const header = `Bearer ${tokenValue}`;
      
      const result = parseBearerToken(header);
      
      expect(result).toBe(tokenValue);
    });

    test("handles token with spaces in it", () => {
      const header = "Bearer token with spaces";
      
      const result = parseBearerToken(header);
      
      // Should only get the first part after the first space
      expect(result).toBe("token");
    });

    test("handles multiple Bearer-like words in token", () => {
      const header = "Bearer first-part second-Bearer-part";
      
      const result = parseBearerToken(header);
      
      expect(result).toBe("first-part");
    });

    test("returns correct token when authorization has multiple spaces", () => {
      const token = "valid-token-123";
      const header = `Bearer    ${token}    extra-content`;
      
      const result = parseBearerToken(header);
      
      // Should extract the first token part after Bearer
      expect(result).toBe(token);
    });
  });

  describe("Real-world scenarios", () => {

    test("handles various token formats", () => {
      const testCases = [
        { header: "Bearer abc123", expected: "abc123" },
        { header: "Bearer ABC123", expected: "ABC123" },
        { header: "Bearer 123456", expected: "123456" },
        { header: "Bearer token-with-dashes", expected: "token-with-dashes" },
        { header: "Bearer token_with_underscores", expected: "token_with_underscores" },
        { header: "Bearer token.with.dots", expected: "token.with.dots" },
      ];

      testCases.forEach(({ header, expected }) => {
        const result = parseBearerToken(header);
        expect(result).toBe(expected);
      });
    });
  });
});
