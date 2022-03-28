import { Request, Response, NextFunction } from 'express';
import dtoValidationMiddleware from '../../src/middlewares/dto-validation.middleware';
import { Matches, IsDefined } from 'class-validator';
import { Expose } from 'class-transformer';
import { emailRegex } from '../../src/utils/regex.utils';
import BadRequestException from '../../src/exceptions/bad-request.exception';

describe('dto-validation.middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();
  class ExampleUserDto {
    @IsDefined()
    @Expose()
    @Matches(RegExp(emailRegex))
    email: String;

    @IsDefined()
    @Expose()
    password: String;
  }

  it('should call next without args once', async () => {
    // given
    mockRequest = { body: { email: 'test@test.pl', password: 'pass' } };

    // when
    await dtoValidationMiddleware(ExampleUserDto)(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    // then
    expect(nextFunction).toBeCalledTimes(1);
  });

  it('should call next with error when property is wrong', async () => {
    // given
    mockRequest = { body: { email: 'testtest.pl', password: 'pass' } };

    // when
    await dtoValidationMiddleware(ExampleUserDto)(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    // then
    expect(nextFunction).toBeCalledTimes(2);
    expect(nextFunction).toBeCalledWith(new BadRequestException('email'));
  });

  it('should call next with error when one property is missing', async () => {
    // given
    mockRequest = { body: { email: 'test@test.pl' } };

    // when
    await dtoValidationMiddleware(ExampleUserDto)(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    // then
    expect(nextFunction).toBeCalledTimes(2);
    expect(nextFunction).toBeCalledWith(new BadRequestException('password'));
  });
});
