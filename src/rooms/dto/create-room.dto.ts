import { IsNotEmpty } from "class-validator";

export class CreateRoomDto {
    
    @IsNotEmpty()
    idUser : string ;
    @IsNotEmpty()
    idConnect : string ;
}