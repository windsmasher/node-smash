import express from 'express';
import dtoValidationMiddleware from '../middlewares/dto-validation.middleware';
import timestampMiddleware from '../middlewares/timestamp.middleware';
import {
  userDetailsMiddleware,
  userLoginMiddleware,
  userRegisterMiddleware,
} from '../services/user.service';
import UserRegisterDto from '../dtos/user-register.dto';
import UserLoginDto from '../dtos/user-login.dto';
import jwtValidationMiddleware from '../middlewares/jwt-validation.middleware';

const controller = express.Router();
const userRegisterPath = '/register';
const userLoginPath = '/login';
const userDetailsPath = '/details';

controller.use(timestampMiddleware());

controller.post(
  userRegisterPath,
  dtoValidationMiddleware(UserRegisterDto),
  userRegisterMiddleware()
);

controller.post(
  userLoginPath,
  dtoValidationMiddleware(UserLoginDto),
  userLoginMiddleware()
);

controller.get(
  userDetailsPath,
  jwtValidationMiddleware(),
  userDetailsMiddleware()
);

export default controller;
