import { AuthGuard } from '@nestjs/passport';
import { Controller, Post, Body, Get, UseGuards, Param } from '@nestjs/common';

import { AuthService } from './auth.service';

import { CreateUserDto, LoginUserDto } from './dto';

import { ResponseRegisterUser, ResponseLogin } from './interfaces';
import { ValidRoles } from './interfaces/valid-roles.interface';
import { Auth, RoleProtected } from './decorators';
import { UserRoleGuard } from './guards/user-role.guard';
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
