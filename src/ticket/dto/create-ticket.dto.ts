import { IsNotEmpty } from "class-validator";

export class CreateTicketDto {
    namecontest : string ;
    @IsNotEmpty()
    idcontest : string ;
    @IsNotEmpty()
    idcadidate : string ;
    historyCreate  : string ;
}
