import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { ShareCandidateInterface } from "src/common/interfaces/Candidate-share.interface";

export class CreateCandidateDto {

    @IsNotEmpty()
    name : string ;

    @IsNotEmpty()
    address : string ;

    @IsNotEmpty()
    @IsEmail()
    email : string ;

    @IsOptional()
    historyCreate : string ;

    @IsOptional()
    historyChange : string ;

    @IsOptional()
    background: string ;

    @IsNotEmpty()
    weight : string ;

    @IsNotEmpty()
    height : string ;
    
    @IsNotEmpty()
    measure : string ;

    @IsOptional()
    slogan? : string ;

    @IsNotEmpty()
    idno : string ;

    
    @IsNotEmpty()
    descs : string


    @IsOptional()
    share : ShareCandidateInterface
}

