import { PartialType } from '@nestjs/swagger';
import { CreateAssignmentCompanyDto } from './create-assignment-company.dto';

export class UpdateAssignmentCompanyDto extends PartialType(CreateAssignmentCompanyDto) {}
