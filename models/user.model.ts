import mongoose from 'mongoose';

interface User {
  email: string;
  password: string;
}

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
