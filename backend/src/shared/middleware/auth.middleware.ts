import type { NextFunction, Request, Response } from 'express';

import { prisma } from '@config/prisma';
import { ApiError } from '@shared/errors/ApiError';
import type { AuthenticatedUser } from '@shared/types/common';
import { verifyToken } from '@shared/utils/token';

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
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

export const requireAuth = authMiddleware;

export const requireRoles = (...allowedRoles: string[]): any => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError(401, 'Unauthorized'));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new ApiError(403, 'Forbidden: Insufficient permissions'));
      return;
    }

    next();
  };
};

export const requireRole = (allowedRoles: string[]): any => {
  return requireRoles(...allowedRoles);
};
