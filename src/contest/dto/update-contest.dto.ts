import { PartialType } from '@nestjs/mapped-types';
import { CompanyEntity } from 'src/company/entities/company.entity';
import { CreateContestDto } from './create-contest.dto';

export class UpdateContestDto{

    name? : string ;
    address? : string ;
    email? : string ;
    idcompany? : string ;
    slogan? : string ;
    background? : string ;
    historyCreate?: string ;
}
