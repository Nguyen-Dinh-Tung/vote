import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'abc123' })
  @IsNotEmpty()
  @Length(6, 6, { message: 'Otp tối thiểu 6 kí tự' })
  code: string;
  @ApiProperty({ example: 'fack123' })
  @IsNotEmpty()
  username: string;
  @ApiProperty({ example: '123abd' })
  @IsNotEmpty()
  password: string;
  @ApiProperty({ example: '123abd' })
  @IsNotEmpty()
  rePassword: string;
}
