import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class LoginUserDto {
    @IsNotEmpty() 
    @Length(2 ,)
    username? : string ;
    @IsNotEmpty()
    @Length(6,20)
    password : string ;
}