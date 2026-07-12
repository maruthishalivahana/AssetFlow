import 'express';

import type { AuthenticatedUser } from './common';

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthenticatedUser;
  }
}

export {};