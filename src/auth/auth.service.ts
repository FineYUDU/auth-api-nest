import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {

  create(createAuthDto: CreateAuthDto) {
    return 'This action create user';
  }
  login(createAuthDto: CreateAuthDto) {
    return 'This action login user';
  }

}