import { IsOptional } from 'class-validator';

export class ParamDto {
  @IsOptional()
  page: number;
  @IsOptional()
  limit: number;
  @IsOptional()
  search: string;
}
