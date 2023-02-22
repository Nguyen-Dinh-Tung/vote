import { PartialType } from '@nestjs/mapped-types';
import { CreateCandidateDto } from './create-candidate.dto';

export class UpdateCandidateDto extends PartialType(CreateCandidateDto) {

    name? : string ;
    address? : string ;
    email? : string ;
    historyChane? : string ; 
    weight? : string ; 
    height? : string ;
    measure? : string ;
    slogan? : string ;
    idno? : string ;
}
