import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateCandidateDto {

    @IsNotEmpty()
    name : string ;

    @IsNotEmpty()
    address : string ;

    @IsNotEmpty()
    @IsEmail()
    email : string ;

    historyCreate : string ;

    historyChange : string ;

    @IsOptional()
    background: string ;

    @IsNotEmpty()
    weight : string ;

    @IsNotEmpty()
    height : string ;
    
    @IsNotEmpty()
    measure : string ;

    slogan? : string ;
    @IsNotEmpty()
    idno : string ;
}
