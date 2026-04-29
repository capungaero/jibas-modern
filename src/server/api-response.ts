export type ApiResult<T> =
  | {
      ok: true;
      data: T;
      message?: string;
    }
  | {
      ok: false;
      code: "BAD_REQUEST" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "SERVER_ERROR";
      message: string;
      issues?: unknown;
    };

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "SERVER_ERROR";

export function ok<T>(data: T, message?: string): ApiResult<T> {
  return { ok: true, data, message };
}

export function fail(
  code: ApiErrorCode,
  message: string,
  issues?: unknown,
): ApiResult<never> {
  return { ok: false, code, message, issues };
}
