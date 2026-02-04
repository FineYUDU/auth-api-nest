import { BadRequestException, Injectable } from '@nestjs/common';

import { existsSync } from 'fs';

import { join } from 'path';

@Injectable()
export class FilesService {

    getStaticProfileImage( imageName:string ) {

        const path = join( __dirname, '../../static/profile-imgs', imageName );

        if( !existsSync( path ) ) 
            throw new BadRequestException(`Not product found with image: ${ imageName }`);

        return path;

    }

}
