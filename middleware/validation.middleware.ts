import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export default (dto: any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const user = plainToInstance(dto, req.body);
    const errors = await validate(user, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    if (errors.length > 0) {
      return res.status(400).send();
    }
    next();
  };
