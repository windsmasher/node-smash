import { Request, Response, NextFunction } from 'express';
import { userRegisterMiddleware } from '../../src/services/user.service';
import * as userRepository from '../../src/repositories/user.repository';

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
  });
});
