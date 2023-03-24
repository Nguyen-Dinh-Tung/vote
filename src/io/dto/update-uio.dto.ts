import { IsNotEmpty } from "class-validator";

export class UpdateUioDto {
    @IsNotEmpty()
    idUser : string ;
    @IsNotEmpty()
    ioId : string ;
}