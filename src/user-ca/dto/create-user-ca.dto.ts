import { IsNotEmpty } from 'class-validator';
import { ShareUserInterface } from 'src/common/interfaces/intaerfaces';

export class CreateUserCaDto {
  @IsNotEmpty()
  share: ShareUserInterface;
}
