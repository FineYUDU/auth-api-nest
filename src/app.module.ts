import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
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
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
