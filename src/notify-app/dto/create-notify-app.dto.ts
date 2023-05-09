import { IsNotEmpty } from 'class-validator';
import { NotifiTypes } from 'src/common/enum/type.notify';

export class CreateNotifyAppDto {
  @IsNotEmpty()
  idUser: string;
  @IsNotEmpty()
  idsReveice: string[];
  @IsNotEmpty()
  typeNotify: NotifiTypes;
}
