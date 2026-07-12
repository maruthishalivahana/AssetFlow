import { Router } from 'express';
import { organizationService } from './organization.service';
import { requireRole } from '@middlewares/role.middleware';

export const organizationRoutes = Router();

organizationRoutes.get('/departments', requireRole(['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE']), async (req, res, next) => {
    try {
        const items = await organizationService.listDepartments();
        res.json({ success: true, data: items });
    } catch (err) {
        next(err);
    }
});

organizationRoutes.get('/categories', requireRole(['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE']), async (req, res, next) => {
    try {
        const items = await organizationService.listCategories();
        res.json({ success: true, data: items });
    } catch (err) {
        next(err);
    }
});
