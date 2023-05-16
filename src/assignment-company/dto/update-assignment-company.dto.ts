import { IsOptional } from 'class-validator';

export class UpdateAssignmentCompanyDto {
  @IsOptional()
  idCompany?: string;
  @IsOptional()
  isActive?: boolean;
}
