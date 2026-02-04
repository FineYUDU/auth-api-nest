import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';

import { CreateUserDto, LoginUserDto } from './dto';

import { JwTPayload, ResponseRegisterUser, ResponseLogin } from './interfaces';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {} 

  public async create(
    createUserDto: CreateUserDto,
    createdById?:string,
  ):Promise<ResponseRegisterUser | undefined> {

    try {
      const { password, email, firstName, lastName } = createUserDto;

      const user = this.userRepository.create({
        email,
        firstName,
        lastName,
        createdAt: new Date(),
        createdById,
        password:bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user);
      
      const createResponse:ResponseRegisterUser = await {
        id:user.id,
        email:user.email,
        firstName:user.firstName,
        lastName:user.lastName,
      }

      return createResponse;
      
    } catch (error) {
      this.handleDbError(error)
    }
  };


  public async login(loginUserDto: LoginUserDto):Promise<ResponseLogin | undefined> {

    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where:{email},
      select: {
        email:true,
        password:true,
        id:true,
        firstName:true,
        lastName:true,
        roles:true,
        profileImageUrl:true,
      }
    });
    if(!user) 
      throw new UnauthorizedException('Password or email are incorrect');
    if(!bcrypt.compareSync( password, user.password)) 
      throw new UnauthorizedException('Password or email are incorrect');

    const {password:_password, ...userSafe} = user;

    const responseLogin:ResponseLogin = {
      user:{
        id:userSafe.id,
        email:userSafe.email,
        firstName:userSafe.firstName,
        lastName:userSafe.lastName,
        roles:userSafe.roles,
        profileImageUrl:userSafe.profileImageUrl,
      },
      token:this.getJwtToken({id:user.id})
    } 
    
    return  responseLogin;

  };

  async checkAuthStatus( { id, email, firstName, lastName, roles, profileImageUrl }: User ){

    const user = {
      id,
      email,
      firstName,
      lastName,
      roles,
      profileImageUrl,
    }

    return { 
      user,
      token: this.getJwtToken({ id:id })
    };

  };

  public async getAllUsers():Promise<User[] | undefined>  {
    
    const users = await this.userRepository.find();

    return users;

  };

  public async getUserById(id:string):Promise<User | null> {

    const user = await this.userRepository.findOneBy({id});

    if(!user) throw new BadRequestException(`${id} user not found`)

    return user;
  };

  public async setProfileImage(userId:string, profileImageUrl:string) {
    if (!userId) throw new BadRequestException('userId is required');
    if(!profileImageUrl) throw new BadRequestException('image is required');
    
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: {
        id:true,
        email:true,
        firstName:true,
        lastName:true,
        roles:true,
        profileImageUrl:true 
      },
    });

    if (!user) throw new NotFoundException('User not found');

    user.profileImageUrl = profileImageUrl;
    await this.userRepository.save(user);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      profileImageUrl: user.profileImageUrl,
    };

  };

  private getJwtToken(payload:JwTPayload):string {

    const token = this.jwtService.sign( payload );
    return token;
  };


  private handleDbError(error:any):void {
    if(error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  };

}