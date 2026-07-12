import { Router } from 'express';
import { requireAuth, requireRoles, validateRequest } from '@shared/middleware';
import { usersController } from './users.controller';
import { getUsersQuerySchema, updateRoleSchema } from './users.validation';

export const usersRoutes = Router();

// Protect all routes under /users with authentication and require ADMIN role
usersRoutes.use(requireAuth);
usersRoutes.use(requireRoles('ADMIN'));

usersRoutes.get('/', validateRequest({ query: getUsersQuerySchema }), usersController.getUsers);

usersRoutes.patch(
  '/:id/role',
  validateRequest({ body: updateRoleSchema }),
  usersController.updateRole,
);
