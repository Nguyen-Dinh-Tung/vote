import { IsNotEmpty } from 'class-validator';

export class CreateAssignmentCompanyDto {
  @IsNotEmpty()
  idCompanies: string[];
  @IsNotEmpty()
  idContest: string;
}
