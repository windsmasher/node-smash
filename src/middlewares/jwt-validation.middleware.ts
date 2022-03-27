import { Request, Response, NextFunction } from 'express';
import UnathorizedException from '../exceptions/unathorized.exception';
import * as jwt from 'jsonwebtoken';

export default () => (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearerToken = req?.headers?.authorization;
    if (!bearerToken) {
      next(new UnathorizedException('Token was not given.'));
    }
    const token = bearerToken?.split(' ')[1];

    const isTokenValid = jwt.verify(token || '', process.env.JWT_SECRET || '');
    if (!isTokenValid) {
      next(new UnathorizedException('Token is not valid.'));
    }
    const tokenDecoded = jwt.decode(token || '') as any;
    (req as any).user = { email: tokenDecoded.email, id: tokenDecoded.id };
    next();
  } catch (err) {
    next(new UnathorizedException('Error with token validation.'));
  }
};
