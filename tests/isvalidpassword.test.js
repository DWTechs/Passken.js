import { isValidPassword } from "../dist/passken";
import { containsNumber } from '@dwtechs/checkard';

const options = {
  lcase: true,
  ucase: true,
  num: true,
  sym: true,
  minLen: 12,
  maxLen: 64,
};
const valid = "Coco!astic0t";
const missingSpecialChar = "Cocolastic0t";
const missingNumber = "Coco!asticot";
const missingUpperCase = "coco!astic0t";
const missingLowerCase = "COCO!ASTIC0T";
const short = "Coco!astic0";
const long = "Coco!astic0tCoco!astic0tCoco!astic0tCoco!astic0tCoco!astic0tCoco!";

describe('isValidPassword', () => {

  test("sends valid to isValidPassword", () => {
    expect(isValidPassword(valid, options)).toBe(true);
  });

  test("sends missingSpecialChar to isValidPassword", () => {
    expect(isValidPassword(missingSpecialChar, options)).toBe(false);
  });

  test("sends missingNumber to isValidPassword", () => {
    expect(isValidPassword(missingNumber, options)).toBe(false);
  });

  test("sends missingUpperCase to isValidPassword", () => {
    expect(isValidPassword(missingUpperCase, options)).toBe(false);
  });

  test("sends missingLowerCase to isValidPassword", () => {
    expect(isValidPassword(missingLowerCase, options)).toBe(false);
  });

  test("sends short to isValidPassword", () => {
    expect(isValidPassword(short, options)).toBe(false);
  });

  test("sends long to isValidPassword", () => {
    expect(isValidPassword(long, options)).toBe(false);
  });

  test("sends valid to isValidPassword with default options", () => {
    expect(isValidPassword(valid)).toBe(true);
  });

  test("sends missingSpecialChar to isValidPassword with default options", () => {
    expect(isValidPassword(missingSpecialChar)).toBe(false);
  });

  test("sends missingNumber to isValidPassword with default options", () => {
    expect(isValidPassword(missingNumber)).toBe(false);
  });

  test("sends missingUpperCase to isValidPassword with default options", () => {
    expect(isValidPassword(missingUpperCase)).toBe(false);
  });

  test("sends missingLowerCase to isValidPassword with default options", () => {
    expect(isValidPassword(missingLowerCase)).toBe(false);
  });

  test("sends short to isValidPassword with default options", () => {
    expect(isValidPassword(short)).toBe(false);
  });

  test("sends long to isValidPassword with default options", () => {
    expect(isValidPassword(long)).toBe(false);
  });

  test("sends empty string to isValidPassword", () => {
    expect(isValidPassword("")).toBe(false);
  });

  test("sends empty string to isValidPassword with empty check", () => {
    expect(isValidPassword("", true)).toBe(false);
  });

  test("sends string to isValidPassword", () => {
    expect(isValidPassword("string")).toBe(false);
  });

  test("sends string to isValidPassword with empty check", () => {
    expect(isValidPassword("string", true)).toBe(false);
  });

  const json = `{
    "actor": {
      "name": "Tom Cruise",
      "age": 56,
      "Born At": "Syracuse, NY",
      "Birthdate": "July 3 1962",
      "photo": "https://jsonformatter.org/img/tom-cruise.jpg"
    }
  }`;

  test("sends json to isValidPassword", () => {
    expect(isValidPassword(json)).toBe(false);
  });

  test("sends json to isValidPassword with empty check", () => {
    expect(isValidPassword(json, true)).toBe(false);
  });

  const invalidjson = `{;
    "actor: {
      "name": "Tom Cruise",
      "age": 56
      "Born At": "Syracuse, NY",
      "Birthdate": "July 3 1962",
      "photo": "https://jsonformatter.org/img/tom-cruise.jpg"
    }
  }`;

  test("sends invalid json to isValidPassword", () => {
    expect(isValidPassword(invalidjson)).toBe(false);
  });

  test("sends invalid json to isValidPassword with empty check", () => {
    expect(isValidPassword(invalidjson, false)).toBe(false);
  });

  describe('containsNumber function edge cases', () => {
    test('should handle minimum number count requirements', () => {
      // Test with min parameter
      expect(containsNumber('abc123def', 2)).toBe(true); // has 3 numbers, min 2 ✓
      expect(containsNumber('abc1def', 2)).toBe(false);  // has 1 number, min 2 ✗
      expect(containsNumber('abcdef', 1)).toBe(false);   // has 0 numbers, min 1 ✗
    });

    test('should handle maximum number count requirements', () => {
      // Test with min and max parameters
      expect(containsNumber('abc123def', 2, 4)).toBe(true);  // has 3 numbers, between 2-4 ✓
      expect(containsNumber('abc12345def', 2, 4)).toBe(false); // has 5 numbers, max 4 ✗
      expect(containsNumber('abc1def', 2, 4)).toBe(false);   // has 1 number, min 2 ✗
    });

    it('should throw detailed errors for number requirements with throwErr=true', () => {
      expect(() => {
        containsNumber('abc', 1, null, true);
      }).toThrow('string containing [1, ∞) digits');
      
      expect(() => {
        containsNumber('abc1', 2, null, true);
      }).toThrow('string containing [2, ∞) digits (actual: 1)');
      
      expect(() => {
        containsNumber('123456', 1, 3, true);
      }).toThrow('string containing [1, 3] digits (actual: 6)');
    });

    test('should handle edge cases with consecutive numbers', () => {
      expect(containsNumber('abc123456def', 3, 6)).toBe(true);
      expect(containsNumber('1234567890', 5, 15)).toBe(true);
      expect(containsNumber('11111', 3, 7)).toBe(true); // repeated digits count separately
    });

    test('should handle numbers at string boundaries', () => {
      expect(containsNumber('1abc', 1)).toBe(true);     // number at start
      expect(containsNumber('abc1', 1)).toBe(true);     // number at end
      expect(containsNumber('1', 1)).toBe(true);        // only number
      expect(containsNumber('a1a', 1)).toBe(true);      // number in middle
    });
  });

  describe('isValidPassword comprehensive edge cases', () => {
    test('should handle all validation failures with specific error messages', () => {
    const strictOptions = {
      minLen: 12,
      maxLen: 20,
      lcase: true,
      ucase: true,
      num: true,
      sym: true
    };      // Test each specific failure case
      expect(() => {
        isValidPassword('short', strictOptions, true);
      }).toThrow('password with length in range [12, 20] (actual length: 5)');

      expect(() => {
        isValidPassword('ThisIsAVeryLongPasswordThatExceedsTheLimit', strictOptions, true);
      }).toThrow('password with length in range [12, 20] (actual length: 42)');

      expect(() => {
        isValidPassword('NOLOWERCASE123!', strictOptions, true);
      }).toThrow('password containing lowercase letters');

      expect(() => {
        isValidPassword('nouppercase123!', strictOptions, true);
      }).toThrow('password containing uppercase letters');

      // Missing numbers - need to meet length requirement first
      expect(() => {
        isValidPassword('NoNumbersButLong!', strictOptions, true);
      }).toThrow('password containing numbers');

      expect(() => {
        isValidPassword('NoSpecialChars123', strictOptions, true);
      }).toThrow('password containing special characters');
    });

    test('should handle boundary cases for password length', () => {
    const options = { 
      minLen: 8, 
      maxLen: 12,
      lcase: false,
      ucase: false,
      num: false,
      sym: false
    };      // Exactly at boundaries
      expect(isValidPassword('12345678', options)).toBe(true);     // exactly min length
      expect(isValidPassword('123456789012', options)).toBe(true); // exactly max length
      
      // Just outside boundaries
      expect(isValidPassword('1234567', options)).toBe(false);     // one less than min
      expect(isValidPassword('1234567890123', options)).toBe(false); // one more than max
    });

    test('should handle complex password validation combinations', () => {
    const complexOptions = {
      minLen: 10,
      maxLen: 15,
      lcase: true,
      ucase: true,
      num: true,
      sym: true
    };      // Valid complex password
      expect(isValidPassword('MyPass123!', complexOptions)).toBe(true);
      
      // Invalid - missing one requirement each
      expect(isValidPassword('MYPASS123!', complexOptions)).toBe(false); // no lowercase
      expect(isValidPassword('mypass123!', complexOptions)).toBe(false); // no uppercase  
      expect(isValidPassword('MyPassword!', complexOptions)).toBe(false); // no numbers
      expect(isValidPassword('MyPass123', complexOptions)).toBe(false);   // no special chars
    });

    test('should handle edge cases with special character detection', () => {
    const options = { 
      sym: true,
      lcase: false,
      ucase: false,
      num: false,
      minLen: 1,
      maxLen: 64
    };      // Various special characters
      expect(isValidPassword('test!', options)).toBe(true);
      expect(isValidPassword('test@', options)).toBe(true);
      expect(isValidPassword('test#', options)).toBe(true);
      expect(isValidPassword('test$', options)).toBe(true);
      expect(isValidPassword('test%', options)).toBe(true);
      expect(isValidPassword('test^', options)).toBe(true);
      expect(isValidPassword('test&', options)).toBe(true);
      expect(isValidPassword('test*', options)).toBe(true);
      expect(isValidPassword('test(', options)).toBe(true);
      expect(isValidPassword('test)', options)).toBe(true);
      expect(isValidPassword('test-', options)).toBe(true);
      expect(isValidPassword('test_', options)).toBe(true);
      expect(isValidPassword('test+', options)).toBe(true);
      expect(isValidPassword('test=', options)).toBe(true);
      expect(isValidPassword('test[', options)).toBe(true);
      expect(isValidPassword('test]', options)).toBe(true);
      expect(isValidPassword('test{', options)).toBe(true);
      expect(isValidPassword('test}', options)).toBe(true);
      expect(isValidPassword('test|', options)).toBe(true);
      expect(isValidPassword('test\\', options)).toBe(true);
      expect(isValidPassword('test:', options)).toBe(true);
      expect(isValidPassword('test;', options)).toBe(true);
      expect(isValidPassword('test"', options)).toBe(true);
      expect(isValidPassword("test'", options)).toBe(true);
      expect(isValidPassword('test<', options)).toBe(true);
      expect(isValidPassword('test>', options)).toBe(true);
      expect(isValidPassword('test,', options)).toBe(true);
      expect(isValidPassword('test.', options)).toBe(true);
      expect(isValidPassword('test?', options)).toBe(true);
      expect(isValidPassword('test/', options)).toBe(true);
      expect(isValidPassword('test`', options)).toBe(true);
      expect(isValidPassword('test~', options)).toBe(false);  // ~ might not be considered special
    });

    test('should handle all disabled options', () => {
    const noRequirements = {
      minLen: 1,
      maxLen: 100,
      lcase: false,
      ucase: false,
      num: false,
      sym: false
    };      // Should pass with minimal requirements
      expect(isValidPassword('a', noRequirements)).toBe(true);
      expect(isValidPassword('A', noRequirements)).toBe(true);
      expect(isValidPassword('1', noRequirements)).toBe(true);
      expect(isValidPassword('!', noRequirements)).toBe(true);
      expect(isValidPassword('abcABC123!@#', noRequirements)).toBe(true);
    });

    test('should handle Unicode and international characters', () => {
    const options = { 
      minLen: 5, 
      maxLen: 64,
      lcase: true, 
      ucase: true,
      num: false,
      sym: false
    };      // Unicode characters
      expect(isValidPassword('testÄ', options)).toBe(false); // Ä is uppercase but not ASCII
      expect(isValidPassword('Testä', options)).toBe(true); // ä is lowercase and function accepts international chars
      expect(isValidPassword('Testa', options)).toBe(true);  // ASCII lowercase
      expect(isValidPassword('testA', options)).toBe(true);  // ASCII uppercase
    });
  });

  describe('Error path coverage for password validation', () => {
    test('should trigger all specific error conditions in sequence', () => {
      // This test ensures we hit all the error paths in the isValidPassword function
      
      // Length error (first check)
      expect(() => isValidPassword('', {}, true)).toThrow('password with length');
      
      // After passing length, check lowercase error
      expect(() => isValidPassword('UPPERCASE123!', { lowerCase: true }, true)).toThrow('lowercase letters');
      
      // After passing length + lowercase, check uppercase error  
      expect(() => isValidPassword('lowercase123!', { upperCase: true }, true)).toThrow('uppercase letters');
      
      // After passing length + case, check number error
      expect(() => isValidPassword('ValidPassWithNumberRequirement!', { minLength: 12, maxLength: 64, number: true }, true)).toThrow('password containing numbers');
      
      // After passing all previous, check special character error
      expect(() => isValidPassword('ValidPass123', { specialCharacter: true }, true)).toThrow('special characters');
    });
  });

  describe('Partial options validation', () => {
    test('should validate password with only length requirements', () => {
    const lengthOnlyOptions = {
      minLen: 8,
      maxLen: 16,
      lcase: false,
      ucase: false,
      num: false,
      sym: false
    };      expect(isValidPassword('password', lengthOnlyOptions)).toBe(true);
      expect(isValidPassword('short', lengthOnlyOptions)).toBe(false);
      expect(isValidPassword('verylongpasswordthatexceedslimit', lengthOnlyOptions)).toBe(false);
    });

    test('should validate password with only lowercase requirement', () => {
    const lowerCaseOnlyOptions = {
      lcase: true,
      ucase: false,
      num: false,
      sym: false,
      minLen: 1,
      maxLen: 100
    };      expect(isValidPassword('HasLowerCase', lowerCaseOnlyOptions)).toBe(true);
      expect(isValidPassword('NOLOWERCASE', lowerCaseOnlyOptions)).toBe(false);
      expect(isValidPassword('alllowercase', lowerCaseOnlyOptions)).toBe(true);
    });

    test('should validate password with only uppercase requirement', () => {
    const upperCaseOnlyOptions = {
      ucase: true,
      lcase: false,
      num: false,
      sym: false,
      minLen: 1,
      maxLen: 100
    };      expect(isValidPassword('HasUpperCase', upperCaseOnlyOptions)).toBe(true);
      expect(isValidPassword('nouppercase', upperCaseOnlyOptions)).toBe(false);
      expect(isValidPassword('ALLUPPERCASE', upperCaseOnlyOptions)).toBe(true);
    });

    test('should validate password with only number requirement', () => {
    const numberOnlyOptions = {
      num: true,
      lcase: false,
      ucase: false,
      sym: false,
      minLen: 1,
      maxLen: 100
    };      expect(isValidPassword('Password123', numberOnlyOptions)).toBe(true);
      expect(isValidPassword('NoNumbers', numberOnlyOptions)).toBe(false);
      expect(isValidPassword('123456', numberOnlyOptions)).toBe(true);
    });

    test('should validate password with only special character requirement', () => {
    const specialCharOnlyOptions = {
      sym: true,
      lcase: false,
      ucase: false,
      num: false,
      minLen: 1,
      maxLen: 100
    };      expect(isValidPassword('Password!', specialCharOnlyOptions)).toBe(true);
      expect(isValidPassword('NoSpecialChars', specialCharOnlyOptions)).toBe(false);
      expect(isValidPassword('!@#$%', specialCharOnlyOptions)).toBe(true);
    });

    test('should validate password with mixed partial requirements', () => {
      // Only length and lowercase
    const lengthAndLowerOptions = {
      minLen: 10,
      lcase: true,
      ucase: false,
      num: false,
      sym: false,
      maxLen: 100
    };      expect(isValidPassword('LONGPASSWORD', lengthAndLowerOptions)).toBe(false); // no lowercase
      expect(isValidPassword('longpassword', lengthAndLowerOptions)).toBe(true);
      expect(isValidPassword('short', lengthAndLowerOptions)).toBe(false); // too short
      
      // Only uppercase and numbers
    const upperAndNumberOptions = {
      ucase: true,
      num: true,
      lcase: false,
      sym: false,
      minLen: 1,
      maxLen: 100
    };      expect(isValidPassword('PASSWORD123', upperAndNumberOptions)).toBe(true);
      expect(isValidPassword('password123', upperAndNumberOptions)).toBe(false); // no uppercase
      expect(isValidPassword('PASSWORD', upperAndNumberOptions)).toBe(false); // no numbers
      
      // Only special chars and length
    const specialAndLengthOptions = {
      sym: true,
      maxLen: 15,
      lcase: false,
      ucase: false,
      num: false,
      minLen: 1
    };      expect(isValidPassword('password!', specialAndLengthOptions)).toBe(true);
      expect(isValidPassword('password', specialAndLengthOptions)).toBe(false); // no special chars
      expect(isValidPassword('verylongpassword!', specialAndLengthOptions)).toBe(false); // too long
    });

    test('should validate password with minimal options (empty object)', () => {
      const emptyOptions = {};
      
      // Should use default behavior - typically requiring basic validation
      expect(isValidPassword('password', emptyOptions)).toBe(false);
      expect(isValidPassword('Password123!', emptyOptions)).toBe(true);
      expect(isValidPassword('', emptyOptions)).toBe(false);
    });

    test('should validate password with single false option', () => {
    const singleFalseOption = {
      lcase: false,
      ucase: true,
      num: true,
      sym: true,
      minLen: 12,
      maxLen: 64
    };
    
    // Should validate other default requirements
    expect(isValidPassword('PASSWORD123!', singleFalseOption)).toBe(true);
    expect(isValidPassword('Password123!', singleFalseOption)).toBe(true);
    });
  });
  
});