import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
  name?: string;
  address?: string;
  background?: string;
  email?: string;
  oldPassword?: string;
  newPassword?: string;
  historyChange?: string;
  historyCreate?: string;
}
