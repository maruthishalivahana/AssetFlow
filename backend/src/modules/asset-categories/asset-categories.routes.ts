import { Router } from 'express';
import { requireAuth, requireRoles, validateRequest } from '@shared/middleware';
import { assetCategoriesController } from './asset-categories.controller';
import {
  createCategorySchema,
  getCategoriesQuerySchema,
  updateCategorySchema,
} from './asset-categories.validation';

export const assetCategoriesRoutes = Router();

// Protect all category endpoints to ADMIN only
assetCategoriesRoutes.use(requireAuth);
assetCategoriesRoutes.use(requireRoles('ADMIN'));

assetCategoriesRoutes.get('/tree', assetCategoriesController.getCategoryTree);

assetCategoriesRoutes.get(
  '/',
  validateRequest({ query: getCategoriesQuerySchema }),
  assetCategoriesController.getCategories,
);

assetCategoriesRoutes.get('/:id', assetCategoriesController.getCategoryById);

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
