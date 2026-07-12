import type { NextFunction, Request, RequestHandler, Response } from 'express';

import { ApiError } from '@shared/errors/ApiError';
import type { AuthenticatedUser } from '@shared/types/common';

import { requireAuth } from './auth.middleware';

export const requireRole = (allowedRoles: readonly AuthenticatedUser['role'][]): RequestHandler => {
  const authGuard = requireAuth();

  return (req: Request, res: Response, next: NextFunction): void => {
    authGuard(req, res, (error?: unknown) => {
      if (error) {
        next(error);
        return;
      }

      if (!req.user || !allowedRoles.includes(req.user.role)) {
        next(new ApiError(403, 'Forbidden'));
        return;
      }

      next();
    });
  };
};
