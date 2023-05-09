import { IsNotEmpty, IsOptional } from 'class-validator';

export class PrivateChatDto {
  @IsNotEmpty()
  message: string;
  @IsNotEmpty()
  idUser: string; 
  @IsOptional()
  file: Express.Multer.File;
  @IsNotEmpty()
  roomId: string;
}
