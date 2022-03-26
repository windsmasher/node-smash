import express, { Express } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userController from './user.controller';

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use('/user', userController);

mongoose.connect('mongodb://' + process.env.MONGO_URL, {}, () => {
  console.log('Conected to database.');
});

app.listen(process.env.PORT, () => {
  console.log(`⚡️ Server is running at https://localhost:${process.env.PORT}`);
});
