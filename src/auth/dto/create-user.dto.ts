import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        example:'example@gmail.com',
        description:'valid email',
        uniqueItems:true,
    })
    @IsString()
    @IsEmail()
    email:string;

    @ApiProperty({
        example:'Gandalf',
        description:'User first name',
    })
    @IsString()
    @MinLength(3)
    firstName:string;

    @ApiProperty({
        example:'The Grey',
        description:'User last name',
    })
    @IsString()
    @MinLength(3)
    lastName:string;

    @ApiProperty({
        example:'Password123*',
        description:'Your password must have a Uppercase, lowercase letter and a number',
    })
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'The password must have a Uppercase, lowercase letter and a number'}
    )
    password:string;
}
