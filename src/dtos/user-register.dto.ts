import { Matches, IsDefined } from 'class-validator';
import { Expose } from 'class-transformer';
import { emailRegex } from '../utils/regex.utils';

export default class UserRegisterDto {
  @IsDefined()
  @Expose()
  @Matches(RegExp(emailRegex))
  email: String;

  @IsDefined()
  @Expose()
  password: String;
}
