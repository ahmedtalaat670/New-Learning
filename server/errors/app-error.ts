export interface AppError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, unknown>;
  value?: string | number;
  errors?: Record<string, { message: string }>;
}
