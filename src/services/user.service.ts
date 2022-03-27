import { Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/http.exception';
import WrongLoginException from '../exceptions/wrong-login.exception';
import User from '../models/user.model';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

export const userRegisterMiddleware =
  () => async (req: Request, res: Response, next: NextFunction) => {
    const existingUser = await User.find({ email: req.body.email });
    if (existingUser.length !== 0) {
      return next(new HttpException(500, 'User exists.'));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      email: req.body.email,
      password: hashedPwd,
    });
    await user.save();
    res.send({ id: user.id, email: user.email });
  };

export const userLoginMiddleware =
  () => async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new WrongLoginException());
    }

    if (!(await bcrypt.compare(req.body.password, user.password))) {
      return next(new WrongLoginException());
    }

    const secret = process.env.JWT_SECRET || 'A0y]]TeAYYt)3VcNeMKdT%zwp2oHH9';
    const token = jwt.sign({ email: user.email, id: user._id }, secret);

    res.send({ token });
  };

export const userDetailsMiddleware =
  () => async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById((req as any)?.user?.id);
    if (!user) {
      return next(new HttpException(500, ''));
    }
    res.send({ id: user.id, email: user.email });
  };
