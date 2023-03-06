import { Roles } from 'src/common/enum/role.enum';
import { Expose } from "class-transformer";
import { IsNotEmpty ,IsEmail, Length, IsString, IsOptional} from "class-validator";
import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @Length(2, 20)
    @Expose()
    username : string ;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(2,255)
    @Expose()
    name : string ;
    @ApiProperty()

    @IsNotEmpty()
    @IsString()
    @Length(2,255)
    @Expose()
    address : string ;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Expose()
    email : string ;

    @ApiProperty()
    @Expose()
    background ?: string ;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(6,20)
    password : string ;

    @ApiProperty()
    @IsOptional()
    role ? : Roles
    
    @ApiProperty()

    code ? : string
    @ApiProperty()

    historyCreate ? : string 
}


