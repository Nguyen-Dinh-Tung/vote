import { ApiProperty } from '@nestjs/swagger';
import { Expose } from "class-transformer";
import { IsNotEmpty, IsOptional, Length } from "class-validator";
import { ContestShareInterface } from 'src/common/interfaces/Contest-share.interface';

export class CreateContestDto {

    @Expose()
    @IsNotEmpty()
    @ApiProperty()
    @Length(2)
    name : string ;

    @Expose() 
    @ApiProperty()
    @IsNotEmpty()
    address : string ;

    @Expose()
    @IsNotEmpty()
    @ApiProperty()
    email : string ;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    idCompany : string ;

    @Expose()
    @ApiProperty()
    @IsOptional()
    historyCreate : string ;

    @Expose()
    @ApiProperty()
    @IsOptional()
    slogan : string ;

    @Expose()
    @ApiProperty()
    @IsOptional()
    description : string ;
    
    @Expose()
    @IsOptional()
    @ApiProperty()
    background : string ;

    @IsOptional()
    @ApiProperty()
    share : ContestShareInterface ;

}
