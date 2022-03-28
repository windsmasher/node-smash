import mongoose from 'mongoose';
import { User } from '../interfaces/user.interface';

export default mongoose.model(
  'User',
  new mongoose.Schema<User>({
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  })
);
