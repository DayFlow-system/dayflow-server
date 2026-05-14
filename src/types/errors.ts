import type { ErrorCode } from '../errors/errorCodes.js';

export interface ApiErrorBody {
  error: {
    code: ErrorCode;
    message: string;
    details: unknown[];
  };
}
