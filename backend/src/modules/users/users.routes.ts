import { Router } from 'express';
import { requireAuth, requireRoles, validateRequest } from '@shared/middleware';
import { usersController } from './users.controller';
import { createEmployeeSchema, getUsersQuerySchema, updateEmployeeSchema, updateRoleSchema } from './users.validation';

export const usersRoutes = Router();

// Protect all user/employee directory endpoints to ADMIN only
usersRoutes.use(requireAuth);
usersRoutes.use(requireRoles('ADMIN'));

usersRoutes.get('/dropdown', usersController.getUsersDropdown);

usersRoutes.post(
  '/',
  validateRequest({ body: createEmployeeSchema }),
  usersController.createEmployee,
);

usersRoutes.get('/', validateRequest({ query: getUsersQuerySchema }), usersController.getUsers);

usersRoutes.get('/:id', usersController.getUserById);

// Admin-only updates and deletions
usersRoutes.patch(
  '/:id',
  validateRequest({ body: updateEmployeeSchema }),
  usersController.updateEmployee,
);

usersRoutes.patch(
  '/:id/role',
  validateRequest({ body: updateRoleSchema }),
  usersController.updateRole,
);

usersRoutes.delete('/:id', usersController.deleteEmployee);
