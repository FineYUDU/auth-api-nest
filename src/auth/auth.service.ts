import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';

@Injectable()
export class AuthService {

  create(createUserDto: CreateUserDto) {
    return 'This action create user';
  }
  login(loginUserDto: LoginUserDto) {
    return 'This action login user';
  }

}