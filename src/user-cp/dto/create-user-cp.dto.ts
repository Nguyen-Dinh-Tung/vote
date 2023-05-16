import { ROLE_UCP } from './../contants/role.enum';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserCpDto {
  @IsNotEmpty()
  idCompany: string[];

  @IsNotEmpty()
  idUser: string[];

  @IsOptional()
  role?: ROLE_UCP;
}
