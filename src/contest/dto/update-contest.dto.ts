import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { CompanyEntity } from 'src/company/entities/company.entity';
import { CreateContestDto } from './create-contest.dto';

export class UpdateContestDto{
    @IsOptional()
    @IsString()
    name? : string ;
    @IsOptional()
    @IsString()
    address? : string ;
    @IsEmail()
    @IsOptional()
    @IsString()
    email? : string ;
    @IsOptional()
    @IsString()
    idcompany? : string ;
    @IsOptional()
    @IsString()
    slogan? : string ;
    @IsOptional()
    @IsString()
    descs? : string ;
    @IsOptional()
    @IsString()
    background? : string ;
}
