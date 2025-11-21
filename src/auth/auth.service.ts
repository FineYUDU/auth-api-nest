import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

import { CreateUserDto, LoginUserDto } from './dto';

import { ResponseRegisterUser } from './interfaces';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {} 

  async create(createUserDto: CreateUserDto):Promise<ResponseRegisterUser | undefined> {

    try {
      const { password, email, firstName, lastName } = createUserDto;

      const user = this.userRepository.create({
        email,
        firstName,
        lastName,
        password:bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user);
      const createResponse = await {
        email:user.email,
        firstName:user.firstName,
        lastName:user.lastName,
      }

      return createResponse;
      
    } catch (error) {
      this.handleDbError(error)
    }
  };


  login(loginUserDto: LoginUserDto) {
    return 'This action login user';
  };


  private handleDbError(error:any):void {
    if(error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  };

}