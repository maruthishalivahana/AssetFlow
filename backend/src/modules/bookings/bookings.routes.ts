import { Router } from 'express';
import { bookingsController } from './bookings.controller';
import { requireRole } from '@middlewares/role.middleware';

export const bookingsRoutes = Router();

bookingsRoutes.get('/resources', requireRole(['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE']), bookingsController.listResources);
bookingsRoutes.get('/resources/:id', requireRole(['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE']), bookingsController.getResource);
bookingsRoutes.get('/', requireRole(['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE']), bookingsController.listBookings);
bookingsRoutes.get('/:id', requireRole(['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE']), bookingsController.getBooking);
bookingsRoutes.post('/', requireRole(['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE']), bookingsController.createBooking);
bookingsRoutes.patch('/:id', requireRole(['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE']), bookingsController.updateBooking);
bookingsRoutes.delete('/:id', requireRole(['ADMIN', 'ASSET_MANAGER']), bookingsController.cancelBooking);
