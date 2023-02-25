import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
    idCompany? : string ;
    @IsOptional()
    @IsString()
    slogan? : string ;
    @IsOptional()
    @IsString()
    descs? : string ;
    @IsOptional()
    @IsString()
    background? : string ;
    @IsOptional()
    isActive? : boolean
}
