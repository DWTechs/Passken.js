
/**
 * Creates a standardized type error message.
 * 
 * @param {string} expectedType - The expected type (e.g., 'number', 'string', 'boolean').
 * @param {unknown} actualValue - The actual value that was received.
 * @param {string} [causedBy] - Optional previous error message to chain with "caused by".
 * @returns {string} A formatted error message.
 */
function throwError(expectedType: string, actualValue: unknown, causedBy?: string): string {
  const c = causedBy ? `. ${causedBy}` : '';
  throw new Error(`Checkard: Expected ${expectedType}, but received ${typeof actualValue}: ${String(actualValue)}${c}`);
}


export {
  throwError,
};
