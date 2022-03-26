import HttpException from './http.exception';

export default class BadRequestException extends HttpException {
  constructor(property: string) {
    super(400, `Property ${property} has wrong format or does not exist.`);
  }
}