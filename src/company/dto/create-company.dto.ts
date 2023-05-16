import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;

  @IsNotEmpty()
  @Expose()
  name: string;
  @IsNotEmpty()
  @Expose()
  address: string;

  @IsNotEmpty()
  @Expose()
  bss: string;

  @IsNotEmpty()
  @Expose()
  descs: string;

  @IsNotEmpty()
  slogan: string;

  @IsOptional()
  listIdCompany?: string[];

  historyCreate?: string;
}
