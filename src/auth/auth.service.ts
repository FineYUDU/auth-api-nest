import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';

import { CreateUserDto, LoginUserDto } from './dto';

import { JwTPayload, ResponseRegisterUser } from './interfaces';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {} 

  public async create(createUserDto: CreateUserDto):Promise<ResponseRegisterUser | undefined> {

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


  public async login(loginUserDto: LoginUserDto) {

    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where:{email},
      select: { email:true, password:true, id:true }
    });

    if(!user) 
      throw new UnauthorizedException('Password or email are incorrect');
    if( !bcrypt.compareSync( password, user.password ) ) 
      throw new UnauthorizedException('Password or email are incorrect');

    return {
      ...user,
      token:this.getJwtToken({id:user.id}),
    }

  };

  private getJwtToken(payload:JwTPayload):string {

    const token = this.jwtService.sign( payload );
    return token;
  }


  private handleDbError(error:any):void {
    if(error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  };

}