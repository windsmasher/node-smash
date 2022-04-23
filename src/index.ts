import express, { Express } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userController from './controllers/user.controller';2
import errorMiddleware from './middlewares/error.middleware';

const appInit = async () => {
  dotenv.config();
  const app: Express = express();

  app.use(express.json());
  app.use('/user', userController);

  app.use(errorMiddleware);

  mongoose.connect('mongodb://' + process.env.MONGO_URL, {}, () => {
    console.log('Conected to database.');
  });

  app.listen(process.env.PORT, () => {
    console.log(
      `⚡️ Server is running at https://localhost:${process.env.PORT}`
    );
  });

  return app;
};

appInit();

const addon = require('../../build/Release/binding');
const runAddon = () => addon.helloWorld();
runAddon();

export default appInit;
