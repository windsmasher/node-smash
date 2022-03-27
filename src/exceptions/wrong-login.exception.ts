import HttpException from './http.exception';

export default class WrongLoginException extends HttpException {
  constructor() {
    super(400, `Wrong email or password.`);
  }
}
