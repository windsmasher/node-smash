import { Request, Response, NextFunction } from 'express';
import { RequestWithUser } from '../interfaces/request-with-user.interface';
import HttpException from '../exceptions/http.exception';
import WrongLoginException from '../exceptions/wrong-login.exception';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as userRepository from '../repositories/user.repository';

export const userRegisterMiddleware =
  () => async (req: Request, res: Response, next: NextFunction) => {
    if (await userRepository.isUserExists(req.body.email)) {
      return next(new HttpException(500, 'User exists.'));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(req.body.password, salt);

    const savedUser = await userRepository.createAndSaveUser({
      email: req.body.email,
      password: hashedPwd,
    });
    res.send({ id: savedUser.id, email: savedUser.email });
  };

export const userLoginMiddleware =
  () => async (req: Request, res: Response, next: NextFunction) => {
    const user = await userRepository.findUserByEmail(req.body.email);
    if (!user) {
      return next(new WrongLoginException());
    }

    if (!(await bcrypt.compare(req.body.password, user.password))) {
      return next(new WrongLoginException());
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next(new HttpException(500, 'There is no secret for jwt.'));
    }
    const token = jwt.sign({ email: user.email, id: user._id }, secret);

    res.send({ token });
  };

export const userDetailsMiddleware =
  () => async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user = await userRepository.findUserById(req?.user?.id);
    if (!user) {
      return next(new HttpException(500, ''));
    }
    res.send({ id: user.id, email: user.email });
  };
