import { Router } from 'express';

import { authMiddleware } from '@shared/middleware/auth.middleware';
import { validateRequest } from '@shared/middleware/validateRequest';

import { authController } from './auth.controller';
import { loginSchema, registerSchema } from './auth.validation';

export const authRoutes = Router();

authRoutes.post('/register', validateRequest({ body: registerSchema }), authController.register);
authRoutes.post('/login', validateRequest({ body: loginSchema }), authController.login);
authRoutes.get('/me', authMiddleware, authController.me);