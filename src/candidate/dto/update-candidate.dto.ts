import { PartialType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { CreateCandidateDto } from './create-candidate.dto';

export class UpdateCandidateDto extends PartialType(CreateCandidateDto) {
  @IsOptional()
  idno?: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  historyChane?: string;

  @IsOptional()
  weight?: string;

  @IsOptional()
  height?: string;

  @IsOptional()
  measure?: string;

  @IsOptional()
  background: Express.Multer.File;

  @IsOptional()
  slogan?: string;
  @IsOptional()
  descs?: string;
}
