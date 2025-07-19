# 0.4.0 (jul 19th 2025)

- Implement comprehensive error handling architecture with custom error classes
- Add PasskenError as base error class with standardized properties (code, statusCode)
- Create specialized error classes for each error scenario
- Rename parseBearerToken() function to parseBearer() for cleaner API

# 0.3.1 (jul 18th 2025)

- Improve parseBearerToken() function to handle undefined authorization properly in Typescript

# 0.3.0 (jul 17th 2025)

- Add parseBearerToken() function to extract access token from authorization header
- Update Checkard dependency to version 3.2.3
- Update documentation in readme.md

# 0.2.5 (mar 2nd 2025)

- Fix declaration file for JWT verify() function

# 0.2.4 (feb 26th 2025)

- Improve hash method for better compatibility with other JWT tools

# 0.2.3 (feb 25th 2025)

- Improve error handling of PWD compare() method
- Fix declaration file export for Typescript

# 0.2.2 (feb 24th 2025)

- Improve error handling of JWT verify() method

# 0.2.1 (feb 23th 2025)

- Fix JWT verify() method return type

# 0.2.0 (feb 22th 2025)

- Add environment variables support for password options
- Add JWT support with a sign() and verify() method
- Add utility function to generate random secrets
- Update list of symbols used for password generation

# 0.1.0 (Dec 7th 2024)

- initial release
