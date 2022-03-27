import { IsDefined } from 'class-validator';
import { Expose } from 'class-transformer';

export default class UserLoginDto {
  @IsDefined()
  @Expose()
  email: String;

  @IsDefined()
  @Expose()
  password: String;
}
