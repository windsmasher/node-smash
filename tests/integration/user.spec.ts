import request from 'supertest';
import userModel from '../../src/models/user.model';
import { Express } from 'express';
import appInit from '../../src';
import mongoose from 'mongoose';

describe('User integration tests', () => {
  let testApp: Express;
  beforeAll(async () => {
    process.env.MONGO_URL = 'mongodb://localhost:27017/node_smash_test';
    process.env.PORT = '3000';
    process.env.JWT_SECRET = 'secret';
    testApp = await appInit();
  });

  afterEach(async () => {
    await userModel.deleteMany();
  });

  afterAll(async () => {
    mongoose.connection.close();
  });

  it('should register new user', async () => {
    const response = await request(testApp)
      .post('/user/register')
      .send({
        email: 'test@test.com',
        password: 'test',
      })
      .set('Accept', 'application/json');

    console.log(response);
    expect(response.status).toBe(200)
  });
});
