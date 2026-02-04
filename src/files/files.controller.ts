import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';

import type { Response } from 'express';

import { diskStorage } from 'multer';

import { AuthService } from 'src/auth/auth.service';
import { FilesService } from './files.service';

import { fileFilter, fileNamer } from './helpers';

import { Auth } from 'src/auth/decorators';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

import { User } from 'src/auth/entities/user.entity';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService   : FilesService,
    private readonly configService  : ConfigService,
    private readonly authService  : AuthService,
  ) {}

  @Get('profile-img/:imageName') 
  public findProfileImage(
    @Res() res: Response,
    @Param('imageName') imageName:string
  ) {

    const path = this.filesService.getStaticProfileImage( imageName );
    
    res.sendFile( path );
  };

  @Post('profile-img')
  @Auth()
  @UseInterceptors( 
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination:'./static/profile-imgs',
        filename: fileNamer,
      })
    }
    ))
  public uploadProfileImg( 
    @UploadedFile() file: Express.Multer.File ,
    @GetUser() user:User,
  ) {

    if(!file) throw new BadRequestException('Make sure that the file is an image ');

    const secureUrl = `${this.configService.get('HOST_API')}/files/profile-img/${ file.filename }`;
    
    
    return this.authService.setProfileImage(user.id, secureUrl);
  };


}
