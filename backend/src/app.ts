import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from '@config/env';
import { authRoutes } from '@modules/auth/auth.routes';
import { usersRoutes } from '@modules/users/users.routes';
import { organizationRoutes } from '@modules/organization/organization.routes';
import { assetsRoutes } from '@modules/assets/assets.routes';
import { uploadDir } from '@config/multer';
import { errorMiddleware } from '@shared/middleware/error.middleware';
import { notFoundMiddleware } from '@shared/middleware/notFound.middleware';
import { apiRateLimiter } from '@shared/middleware/rateLimiter';

export const createApp = (): Express => {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    }),
  );
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(apiRateLimiter);

  app.get('/', (_req, res) => {
    res.json({
      success: true,
      message: 'AssetFlow Backend Running',
    });
  });

  app.get('/health', (_req, res) => {
    res.json({
      status: 'OK',
      uptime: process.uptime(),
      environment: env.NODE_ENV,
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/organization', organizationRoutes);
  app.use('/api/assets', assetsRoutes);

  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
};

export const app = createApp();
