import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    AuthModule,
    FilesModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type:'postgres',
      username:process.env.DB_USERNAME,
      password:process.env.DB_PASSWORD,
      host:process.env.DB_HOST,
      database:process.env.DB_NAME,
      port:+(process.env.DB_PORT || 8080),
      autoLoadEntities:true,
      // TODO: Remove synchronize in production 
      synchronize:true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..','public')
    }),
    AuthModule,
    FilesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
