import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

import { env } from '@config/env';
import { ApiError } from '@shared/errors/ApiError';

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details: unknown;

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    details = error.details;
  } else if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    details = error.flatten();
  } else if (error instanceof Error && error.message) {
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(env.NODE_ENV === 'development' && error instanceof Error ? { stack: error.stack } : {}),
  });
};
