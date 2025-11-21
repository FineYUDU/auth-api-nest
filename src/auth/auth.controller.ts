import { Controller, Post, Body, Get } from '@nestjs/common';

import { AuthService } from './auth.service';

import { CreateUserDto, LoginUserDto } from './dto';

import { ResponseRegisterUser, ResponseLogin } from './interfaces';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(
    @Body() createUserDto: CreateUserDto
  ):Promise<ResponseRegisterUser | undefined> {
    return this.authService.create( createUserDto );
  }

  @Post('login')
  login(
    @Body() loginUserDto: LoginUserDto
  ):Promise<ResponseLogin | undefined> {
    return this.authService.login(loginUserDto);
  }

  @Get('users')
  getUsers() {
    return 'This method return all the users'
  }
}
