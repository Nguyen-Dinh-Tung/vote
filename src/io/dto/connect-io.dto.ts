import { IsNotEmpty } from "class-validator";

export class ConnectIoDto {
    @IsNotEmpty()
    isOnline : boolean  ;
    @IsNotEmpty()   
    idUser : string ; 
    @IsNotEmpty()
    ioId : string ;
}