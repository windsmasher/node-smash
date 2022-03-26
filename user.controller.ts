import express, { Request, Response, NextFunction } from 'express';
import User from './models/user.model';
import validationMiddleware from './middleware/validation.middleware';
import timestampMiddleware from './middleware/timestamp.middleware';
import UserDto from './dtos/user.dto';
const bcrypt = require('bcrypt');

const controller = express.Router();

controller.use(timestampMiddleware());

controller.post(
  '/register',
  validationMiddleware(UserDto),
  async (req: Request, res: Response, next: NextFunction) => {
    const existingUser = await User.find({ email: req.body.email });
    if (existingUser.length !== 0) {
      return next(new Error('User exists.'));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      email: req.body.email,
      password: hashedPwd,
    });
    await user.save();
    res.send(user);
  }
);

controller.post('/login', (req: Request, res: Response) => {});

export default controller;
