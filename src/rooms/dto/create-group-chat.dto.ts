import { IsNotEmpty } from "class-validator";

export class CreateGroupChatDto {

    @IsNotEmpty()
    idUser : string ;
    @IsNotEmpty()
    name : string ;
    @IsNotEmpty()
    idsConnectRoom : string [] ;

}