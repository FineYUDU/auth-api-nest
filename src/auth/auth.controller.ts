import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto, LoginUserDto, LoginResponseDto } from './dto';

import { Auth } from './decorators';
import { GetUser } from './decorators/get-user.decorator';

import { User } from './entities/user.entity';


import { ResponseRegisterUser, ResponseLogin } from './interfaces';
import { ValidRoles } from './interfaces/valid-roles.interface';


@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

  constructor( private readonly authService: AuthService,) {}

  @Post('register')
  @Auth(ValidRoles.superUser)
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
  public create(
    @Body() createUserDto: CreateUserDto,
    @GetUser() adminUser:User,
  ):Promise<ResponseRegisterUser | undefined> {
    return this.authService.create( createUserDto, adminUser.id );
  };

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
  public login(
    @Body() loginUserDto: LoginUserDto
  ):Promise<ResponseLogin | undefined> {
    return this.authService.login(loginUserDto);
  };

  @Get('users')
  @ApiResponse({
    status:201,
    description:'GetAllUsers success',
  })
  @ApiResponse({
    status:400,
    description:'Bad request',
    type:User,
  })
  @ApiResponse({
    status:401,
    description:'Unauthorized',
  })
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  public findAll():Promise<User[] | undefined> {
    return this.authService.getAllUsers();
  };

  @Get('users/:id')
  @Auth( ValidRoles.superUser, ValidRoles.admin )
  @ApiParam({ name: 'id', type: 'string', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'GetUserById success' })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 404, description: 'User not found' })
  public findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ):Promise<User | null> {
    return this.authService.getUserById(id);
  }

  @Get('check-status')
  @Auth()
  public checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus( user );
  };

};