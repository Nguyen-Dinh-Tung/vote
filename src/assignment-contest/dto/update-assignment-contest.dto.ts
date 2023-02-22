import { PartialType } from '@nestjs/swagger';
import { CreateAssignmentContestDto } from './create-assignment-contest.dto';

export class UpdateAssignmentContestDto extends PartialType(CreateAssignmentContestDto) {}
