import { Request, Response, NextFunction } from 'express';
import {
  userDetailsMiddleware,
  userLoginMiddleware,
  userRegisterMiddleware,
} from '../../src/services/user.service';
import * as userRepository from '../../src/repositories/user.repository';
import HttpException from '../../src/exceptions/http.exception';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import WrongLoginException from '../../src/exceptions/wrong-login.exception';

describe('User service', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  describe('userRegisterMiddleware', () => {
    it('should call correct methods when user exists', async () => {
      // given
      mockRequest = { body: { email: 'test@test.pl', password: 'pass' } };
      mockResponse = {
        send: jest.fn(),
      };
      const isUserExistsSpy = jest
        .spyOn(userRepository, 'isUserExists')
        .mockResolvedValue(false);
      const createAndSaveUserSpy = jest
        .spyOn(userRepository, 'createAndSaveUser')
        .mockResolvedValue({
          email: 'test@test.pl',
          id: '123',
          password: 'hashed-pass',
        });

      // when
      await userRegisterMiddleware()(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      // then
      expect(mockResponse.send).toBeCalledTimes(1);
      expect(nextFunction).toBeCalledTimes(0);
      expect(mockResponse.send).toBeCalledWith({
        email: 'test@test.pl',
        id: '123',
      });
      expect(isUserExistsSpy).toBeCalledTimes(1);
      expect(createAndSaveUserSpy).toBeCalledTimes(1);
    });

    it('should throw exception when user exists', async () => {
      // given
      mockRequest = { body: { email: 'test@test.pl', password: 'pass' } };
      mockResponse = {
        send: jest.fn(),
      };
      const isUserExistsSpy = jest
        .spyOn(userRepository, 'isUserExists')
        .mockResolvedValue(true);
      const createAndSaveUserSpy = jest
        .spyOn(userRepository, 'createAndSaveUser')
        .mockResolvedValue({
          email: 'test@test.pl',
          id: '123',
          password: 'hashed-pass',
        });

      // when
      await userRegisterMiddleware()(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      // then
      expect(mockResponse.send).toBeCalledTimes(0);
      expect(nextFunction).toBeCalledTimes(1);
      expect(nextFunction).toBeCalledWith(
        new HttpException(500, 'User exists.')
      );
      expect(isUserExistsSpy).toBeCalledTimes(1);
      expect(createAndSaveUserSpy).toBeCalledTimes(0);
    });
  });

  describe('userLoginMiddleware', () => {
    it('should call corect methods and give jwt token', async () => {
      // given
      mockRequest = { body: { email: 'test@test.pl', password: 'pass' } };
      mockResponse = {
        send: jest.fn(),
      };
      process.env.JWT_SECRET = 'secret';
      const findUserByEmailSpy = jest
        .spyOn(userRepository, 'findUserByEmail')
        .mockResolvedValue({
          _id: '1',
          email: 'test@test.pl',
          password: await bcrypt.hash('pass', await bcrypt.genSalt(10)),
        } as any);
      const resSendSpy = jest.spyOn(mockResponse, 'send');

      // when
      await userLoginMiddleware()(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      // then
      expect(
        jwt.verify(resSendSpy.mock.calls[0][0].token, 'secret')
      ).toBeTruthy();
      expect(findUserByEmailSpy).toBeCalledTimes(1);
      expect(nextFunction).toBeCalledTimes(0);
      expect(mockResponse.send).toBeCalledTimes(1);
    });

    it('should throw exception when user does not exist', async () => {
      // given
      mockRequest = { body: { email: 'test@test.pl', password: 'pass' } };
      mockResponse = {
        send: jest.fn(),
      };
      process.env.JWT_SECRET = 'secret';
      const findUserByEmailSpy = jest
        .spyOn(userRepository, 'findUserByEmail')
        .mockResolvedValue(null);

      // when
      await userLoginMiddleware()(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      // then
      expect(nextFunction).toBeCalledWith(new WrongLoginException());
      expect(findUserByEmailSpy).toBeCalledTimes(1);
      expect(nextFunction).toBeCalledTimes(1);
      expect(mockResponse.send).toBeCalledTimes(0);
    });

    it('should throw exception when password is wrong', async () => {
      // given
      mockRequest = { body: { email: 'test@test.pl', password: 'pass' } };
      mockResponse = {
        send: jest.fn(),
      };
      process.env.JWT_SECRET = 'secret';
      const findUserByEmailSpy = jest
        .spyOn(userRepository, 'findUserByEmail')
        .mockResolvedValue({
          _id: '1',
          email: 'test@test.pl',
          password: 'some_another_hashed_password',
        } as any);

      // when
      await userLoginMiddleware()(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      // then
      expect(nextFunction).toBeCalledWith(new WrongLoginException());
      expect(findUserByEmailSpy).toBeCalledTimes(1);
      expect(nextFunction).toBeCalledTimes(1);
      expect(mockResponse.send).toBeCalledTimes(0);
    });

    it('should throw exception when there is no secret given', async () => {
      // given
      mockRequest = { body: { email: 'test@test.pl', password: 'pass' } };
      mockResponse = {
        send: jest.fn(),
      };
      const findUserByEmailSpy = jest
        .spyOn(userRepository, 'findUserByEmail')
        .mockResolvedValue({
          _id: '1',
          email: 'test@test.pl',
          password: await bcrypt.hash('pass', await bcrypt.genSalt(10)),
        } as any);
      process.env.JWT_SECRET = '';

      // when
      await userLoginMiddleware()(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      // then
      expect(nextFunction).toBeCalledWith(
        new HttpException(500, 'There is no secret for jwt.')
      );
      expect(findUserByEmailSpy).toBeCalledTimes(1);
      expect(nextFunction).toBeCalledTimes(1);
      expect(mockResponse.send).toBeCalledTimes(0);
    });
  });

  describe('userDetailsMiddleware', () => {
    it('should call correct methods and return user', async () => {
      // given
      mockRequest = { body: { email: 'test@test.pl', id: '1' } };
      mockResponse = {
        send: jest.fn(),
      };
      const findUserByIdSpy = jest
        .spyOn(userRepository, 'findUserById')
        .mockResolvedValue({
          id: '1',
          email: 'test@test.pl',
          password: 'some_hashed_password',
        } as any);

      // when
      await userDetailsMiddleware()(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      // given
      expect(findUserByIdSpy).toBeCalledTimes(1);
      expect(nextFunction).toBeCalledTimes(0);
      expect(mockResponse.send).toBeCalledTimes(1);
      expect(mockResponse.send).toBeCalledWith({
        id: '1',
        email: 'test@test.pl',
      });
    });

    it('should throw exception when user does not exist', async () => {
      // given
      mockRequest = { body: { email: 'test@test.pl', id: '1' } };
      mockResponse = {
        send: jest.fn(),
      };
      const findUserByIdSpy = jest
        .spyOn(userRepository, 'findUserById')
        .mockResolvedValue(null);

      // when
      await userDetailsMiddleware()(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      // given
      expect(findUserByIdSpy).toBeCalledTimes(1);
      expect(mockResponse.send).toBeCalledTimes(0);
      expect(nextFunction).toBeCalledTimes(1);
      expect(nextFunction).toBeCalledWith(
        new HttpException(500, 'User does not exists.')
      );
    });
  });
});
