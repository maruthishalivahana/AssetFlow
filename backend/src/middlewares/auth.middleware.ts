import type { NextFunction, Request, RequestHandler, Response } from 'express';

import { prisma } from '@config/prisma';
import { ApiError } from '@shared/errors/ApiError';
import type { AuthenticatedUser } from '@shared/types/common';
import { verifyToken } from '@shared/utils/token';

export const requireAuth = (): RequestHandler => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader?.startsWith('Bearer ')) {
      next(new ApiError(401, 'Unauthorized'));
      return;
    }

    const token = authorizationHeader.slice(7);

    try {
      const decodedToken = verifyToken<AuthenticatedUser>(token);

      const user = await prisma.user.findUnique({
        where: { id: decodedToken.id },
        select: {
          id: true,
          email: true,
          role: true,
          departmentId: true,
          tokenVersion: true,
          status: true,
          deletedAt: true,
        },
      });

      if (
        !user ||
        user.deletedAt ||
        user.status !== 'ACTIVE' ||
        user.tokenVersion !== decodedToken.tokenVersion
      ) {
        next(new ApiError(401, 'Session expired, please login again'));
        return;
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        departmentId: user.departmentId,
        tokenVersion: user.tokenVersion,
      };

      next();
    } catch {
      next(new ApiError(401, 'Invalid or expired token'));
    }
  };
};

export const authMiddleware = requireAuth();
