import { Router } from 'express';
import { requireAuth, requireRoles, validateRequest } from '@shared/middleware';
import { assetCategoriesController } from './asset-categories.controller';
import {
  createCategorySchema,
  getCategoriesQuerySchema,
  updateCategorySchema,
} from './asset-categories.validation';

export const assetCategoriesRoutes = Router();

assetCategoriesRoutes.use(requireAuth);

assetCategoriesRoutes.get('/tree', requireRoles('ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE'), assetCategoriesController.getCategoryTree);

assetCategoriesRoutes.get(
  '/',
  requireRoles('ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE'),
  validateRequest({ query: getCategoriesQuerySchema }),
  assetCategoriesController.getCategories,
);

assetCategoriesRoutes.get('/:id', requireRoles('ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE'), assetCategoriesController.getCategoryById);

// Protect mutation endpoints to ADMIN only
assetCategoriesRoutes.use(requireRoles('ADMIN'));

assetCategoriesRoutes.post(
  '/',
  validateRequest({ body: createCategorySchema }),
  assetCategoriesController.createCategory,
);

assetCategoriesRoutes.patch(
  '/:id',
  validateRequest({ body: updateCategorySchema }),
  assetCategoriesController.updateCategory,
);

assetCategoriesRoutes.delete('/:id', assetCategoriesController.deleteCategory);
