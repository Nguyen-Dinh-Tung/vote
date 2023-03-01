import { PartialType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { CreateCompanyDto } from './create-company.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {

    @IsOptional()
    name : string ;
    @IsOptional()
    address : string ;
    @IsOptional()
    descs : string ;
    @IsOptional()
    email : string ;
    @IsOptional()
    bss : string ;
    @IsOptional()
    slogan: string; 
    @IsOptional()
    isActive : boolean
}
