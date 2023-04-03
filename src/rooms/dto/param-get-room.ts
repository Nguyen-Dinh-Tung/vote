import { IsNotEmpty, IsOptional } from 'class-validator';

export class ParamGetRoom {
  @IsNotEmpty()
  idUser: string;
  @IsOptional()
  search: string;
}
