import { IsNotEmpty } from 'class-validator';

export class UioDto {
  @IsNotEmpty()
  idUser: string;
}
