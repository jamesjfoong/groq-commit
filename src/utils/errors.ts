export type ErrorCode = keyof typeof ERROR_CODES;

export class CommitError extends Error {
  code: ErrorCode;

  constructor(message: string, code: ErrorCode) {
    super(message);
    this.code = code;
  }
}

export const ERROR_CODES = {
  NO_API_KEY: 'API key not configured. Run `groq-commit setup` first.',
  NO_CHANGES: 'No staged changes detected. Stage your changes using git add first.',
  API_ERROR: 'Failed to generate commit message. Check your API key and try again.',
  INVALID_TEMPLATE: 'Invalid template configuration.',
  CONFIG_ERROR: 'Configuration error.',
} as const;

export function createError(code: ErrorCode, additionalMessage: string = ''): CommitError {
  const message = ERROR_CODES[code] + (additionalMessage ? ` ${additionalMessage}` : '');

  return new CommitError(message, code);
}
