import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class QueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  page?: number = 1;
  @ApiPropertyOptional({ example: 'fack' })
  @IsOptional()
  search?: string;
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  isActive?: boolean;
}
