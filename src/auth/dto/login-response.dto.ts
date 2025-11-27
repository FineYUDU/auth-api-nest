import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseDto {
    @ApiProperty({
        example:'fe6a94b6-82e3-46bf-97da-3f062a41efec',
        description:'User ID',
        uniqueItems:true,
    })
    id:string;

    @ApiProperty({
        example:'example@gmail.com',
        description:'valid email',
        uniqueItems:true,
    })
    email:string;
    @ApiProperty({
        example:'Gandalf',
        description:'User first name',
    })
    firstName:string;

    @ApiProperty({
        example:'The Grey',
        description:'User last name',
    })
    lastName:string;

    @ApiProperty({
        description: 'JWT token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMTliYmFiLTRiYTktNDljZS1hMTFiLTFiOWYwZmYzZDM0YSIsImlhdCI6MTc2NDIwOTExMiwiZXhwIjoxNzY0MjE2MzEyfQ._tOC5RyAy7jO3VUKXLJLn53GNtvQkKdkuBF8iRiTXsA',
    })
    token: string;
}