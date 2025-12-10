import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body, Get, Param } from '@nestjs/common';

import { AuthService } from './auth.service';

import { CreateUserDto, LoginUserDto, LoginResponseDto } from './dto';

import { ResponseRegisterUser, ResponseLogin } from './interfaces';
import { ValidRoles } from './interfaces/valid-roles.interface';
import { Auth } from './decorators';
import { User } from './entities/user.entity';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status:201,
    description:'User created',
  })
  @ApiResponse({
    status:400,
    description:'Bad request',
    type:User,
  })
  @ApiResponse({
    status:401,
    description:'Unauthorized'
  })
  // @Auth(ValidRoles.admin)
  create(
    @Body() createUserDto: CreateUserDto
  ):Promise<ResponseRegisterUser | undefined> {
    return this.authService.create( createUserDto );
  }

  @Post('login')
  @ApiResponse({
    status:201,
    description:'Login success',
    type:LoginResponseDto
  })
  @ApiResponse({
    status:400,
    description:'Bad request'
  })
  @ApiResponse({
    status:401,
    description:'Unauthorized | Password or email are incorrect'
  })
  login(
    @Body() loginUserDto: LoginUserDto
  ):Promise<ResponseLogin | undefined> {
    return this.authService.login(loginUserDto);
  }

  @Get('users')
  @Auth(ValidRoles.superUser)
  getUsers() {
    return this.authService.getAllUsers();
  }

  @Get('users/:id')
  @Auth(ValidRoles.superUser)
  getUserById(
    @Param('id') id:string
  ) {
    return this.authService.getUserById(id);
  }
}
