import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import { IsNotEmpty } from 'class-validator';
export class Test {
    @ApiProperty()
    @IsNotEmpty()
    isActive : boolean ;
}