import { IsNotEmpty, IsOptional } from "class-validator";

export class PrivateChatDto {
    @IsNotEmpty()
    idRoom : string ;
    @IsNotEmpty()
    message : string ;
    @IsNotEmpty()
    idUser : string ;
    @IsOptional()
    file : Express.Multer.File ;
}