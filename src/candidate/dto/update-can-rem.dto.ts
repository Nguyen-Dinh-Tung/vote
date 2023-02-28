import { PartialType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { CreateCandidateDto } from './create-candidate.dto';

export class UpdateCaRem extends PartialType(CreateCandidateDto) {


    @IsOptional()
    slogan? : string ;
    @IsOptional()
    descs? : string ;
    
}
