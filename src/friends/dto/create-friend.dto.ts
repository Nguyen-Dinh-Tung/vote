import { IsNotEmpty } from 'class-validator';

export class CreateFriendDto {
  @IsNotEmpty()
  idUser: string;
  @IsNotEmpty()
  idReveice: string;
}
