import { Router } from 'express';
import { assetsController } from './assets.controller';
import { upload } from '@config/multer';
import { requireRole } from '@middlewares/role.middleware';

export const assetsRoutes = Router();

// Public listing and details (requires authenticated user)
assetsRoutes.get('/', requireRole(['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE']), assetsController.list);
assetsRoutes.get('/:id', requireRole(['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE']), assetsController.getOne);

// Create (ADMIN, ASSET_MANAGER)
assetsRoutes.post('/', requireRole(['ADMIN', 'ASSET_MANAGER']), upload.array('files'), assetsController.create);

// Update
assetsRoutes.patch('/:id', requireRole(['ADMIN', 'ASSET_MANAGER']), upload.array('files'), assetsController.update);

// Soft delete (ADMIN only)
assetsRoutes.delete('/:id', requireRole(['ADMIN']), assetsController.remove);
