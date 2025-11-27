import { ApiProperty } from "@nestjs/swagger";
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @ApiProperty({
        example:'fe6a94b6-82e3-46bf-97da-3f062a41efec',
        description:'User ID',
        uniqueItems:true,
    })
    @PrimaryGeneratedColumn('uuid')
    id:string;
    
    @ApiProperty({
        example:'example@gmail.com',
        description:'valid email',
        uniqueItems:true,
    })
    @Column({type:'text', unique:true})
    email:string;
    
    @Column({type:'text', select:false})
    password:string;
    
    @ApiProperty({
        example:'Gandalf',
        description:'User first name',
    })
    @Column({type:'text'})
    firstName:string;
    
    @ApiProperty({
        example:'The Grey',
        description:'User last name',
    })
    @Column({type:'text'})
    lastName:string;
    
    @Column({type:'bool', default:true})
    isActive:boolean;
    
    @Column({type:'text', array:true, default:['user']})
    roles:string[];
    
    @BeforeInsert() 
    checkFieldsBeforeInsert() {
        this.email = this.email.toLocaleLowerCase().trim();
        this.firstName = this.firstName.toLocaleLowerCase().trim();
        this.lastName = this.lastName.toLocaleLowerCase().trim();
    }

    @BeforeUpdate() 
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }

}
