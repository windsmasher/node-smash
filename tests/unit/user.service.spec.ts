import { Request, Response, NextFunction } from 'express';
import { userRegisterMiddleware } from '../../src/services/user.service';
import * as userRepository from '../../src/repositories/user.repository';
import HttpException from '../../src/exceptions/http.exception';

describe('User service', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = { body: { email: 'test@test.pl', password: 'pass' } };
    mockResponse = {
      send: jest.fn(),
    };
  });

  describe('userRegisterMiddleware', () => {
    it('should call correct methods when user exists', async () => {
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

      await userRegisterMiddleware()(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(isUserExistsSpy).toBeCalledTimes(1);
      expect(createAndSaveUserSpy).toBeCalledTimes(1);
    });

    it('should throw exception when user exists', async () => {
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

      await userRegisterMiddleware()(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toBeCalledWith(
        new HttpException(500, 'User exists.')
      );
      expect(isUserExistsSpy).toBeCalledTimes(1);
      expect(createAndSaveUserSpy).toBeCalledTimes(0);
    });
  });
});
