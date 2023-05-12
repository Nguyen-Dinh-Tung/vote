import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'admin' })
  @IsNotEmpty()
  username: string;
  @ApiProperty({ example: '999999' })
  @IsNotEmpty()
  password: string;
}
