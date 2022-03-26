import { Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/http.exception';
import User from '../models/user.model';
const bcrypt = require('bcrypt');

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
    res.send(user);
  };
