import UserRegisterDto from '../dtos/user-register.dto';
import { User } from '../interfaces/user.interface';
import UserModel from '../models/user.model';

export function createAndSaveUser(userDto: UserRegisterDto): Promise<User> {
  const user = new UserModel({
    email: userDto.email,
    password: userDto.password,
  });
  return user.save();
}

export async function isUserExists(email: string): Promise<boolean> {
  const existingUser = await UserModel.find({ email });
  return existingUser.length !== 0;
}

export function findUserByEmail(email: string) {
  return UserModel.findOne({ email });
}

export function findUserById(id: string) {
  return UserModel.findById(id);
}
