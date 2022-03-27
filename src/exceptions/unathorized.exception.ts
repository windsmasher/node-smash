import HttpException from './http.exception';

export default class UnathorizedException extends HttpException {
  constructor(msg: string) {
    super(401, msg);
  }
}
