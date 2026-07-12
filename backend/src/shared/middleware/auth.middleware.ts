import type { NextFunction, Request, Response } from 'express';

import { ApiError } from '@shared/errors/ApiError';
import type { AuthenticatedUser } from '@shared/types/common';
import { verifyToken } from '@shared/utils/token';

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith('Bearer ')) {
    next(new ApiError(401, 'Unauthorized'));
    return;
  }

  const token = authorizationHeader.slice(7);

  try {
    req.user = verifyToken<AuthenticatedUser>(token);
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};