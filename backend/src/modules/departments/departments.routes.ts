import { Router } from 'express';
import { requireAuth, requireRoles, validateRequest } from '@shared/middleware';
import { departmentsController } from './departments.controller';
import {
  createDepartmentSchema,
  getDepartmentsQuerySchema,
  updateDepartmentSchema,
} from './departments.validation';

export const departmentsRoutes = Router();

// Protect all department routes to ADMIN only
departmentsRoutes.use(requireAuth);
departmentsRoutes.use(requireRoles('ADMIN'));

departmentsRoutes.get('/tree', departmentsController.getDepartmentTree);

departmentsRoutes.get(
  '/',
  validateRequest({ query: getDepartmentsQuerySchema }),
  departmentsController.getDepartments,
);

departmentsRoutes.get('/:id', departmentsController.getDepartmentById);

departmentsRoutes.post(
  '/',
  validateRequest({ body: createDepartmentSchema }),
  departmentsController.createDepartment,
);

departmentsRoutes.patch(
  '/:id',
  validateRequest({ body: updateDepartmentSchema }),
  departmentsController.updateDepartment,
);

departmentsRoutes.delete('/:id', departmentsController.deleteDepartment);
