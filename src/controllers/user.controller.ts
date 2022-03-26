import express, { Request, Response } from 'express';
import validationMiddleware from '../middlewares/validation.middleware';
import timestampMiddleware from '../middlewares/timestamp.middleware';
import { userRegisterMiddleware } from '../services/user.service';
import UserDto from '../dtos/user.dto';

const controller = express.Router();
controller.use(timestampMiddleware());

controller.post(
  '/register',
  validationMiddleware(UserDto),
  userRegisterMiddleware()
);

controller.post('/login', (req: Request, res: Response) => {});

export default controller;
