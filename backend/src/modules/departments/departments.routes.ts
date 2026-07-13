import { Router } from 'express';
import { requireAuth, requireRoles, validateRequest } from '@shared/middleware';
import { departmentsController } from './departments.controller';
import {
  createDepartmentSchema,
  getDepartmentsQuerySchema,
  updateDepartmentSchema,
} from './departments.validation';

export const departmentsRoutes = Router();

departmentsRoutes.use(requireAuth);

departmentsRoutes.get('/tree', requireRoles('ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE'), departmentsController.getDepartmentTree);

departmentsRoutes.get(
  '/',
  requireRoles('ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE'),
  validateRequest({ query: getDepartmentsQuerySchema }),
  departmentsController.getDepartments,
);

departmentsRoutes.get('/:id', requireRoles('ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE'), departmentsController.getDepartmentById);

// Protect mutation routes to ADMIN only
departmentsRoutes.use(requireRoles('ADMIN'));

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
