import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PassportStrategy } from "@nestjs/passport";

import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";

import { User } from "../entities/user.entity";

import { JwTPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService
    ) {
        const secret = configService.getOrThrow<string>('JWT_SECRET');

        super({
        secretOrKey: secret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });

    }

    async validate(payload:JwTPayload):Promise<User> {

        const { id } = payload;

        const user = await this.userRepository.findOneBy({id});

        if(!user)
            throw new UnauthorizedException('Token No valid')
        
        if(!user.isActive)
            throw new UnauthorizedException('This user is inactive, contact an admin')

        return user;

    }

}