import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodTypeAny } from 'zod';

type RequestSchemas = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

export const validateRequest = (schemas: RequestSchemas): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (schemas.body) {
      req.body = schemas.body.parse(req.body);
    }

    if (schemas.query) {
      const parsedQuery = schemas.query.parse(req.query);

      Object.defineProperty(req, 'query', {
        value: parsedQuery,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }

    if (schemas.params) {
      req.params = schemas.params.parse(req.params) as Request['params'];
    }

    next();
  };
};
