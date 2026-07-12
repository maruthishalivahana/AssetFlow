import jwt from 'jsonwebtoken';

import { jwtConfig } from '@config/jwt';

export const signToken = <TPayload extends object>(
  payload: TPayload,
  expiresIn: string = jwtConfig.expiresIn,
): string => {
  const tokenExpiresIn = expiresIn as jwt.SignOptions['expiresIn'];

  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: tokenExpiresIn,
  });
};

export const verifyToken = <TPayload extends object>(token: string): TPayload => {
  return jwt.verify(token, jwtConfig.secret) as TPayload;
};
