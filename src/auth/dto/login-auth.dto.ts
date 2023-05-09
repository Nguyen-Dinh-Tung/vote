import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  username?: string;
  @IsNotEmpty()
  password: string;
}
