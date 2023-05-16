import { IsNotEmpty } from 'class-validator';
import { ShareCandidateInterface } from 'src/common/interfaces/Candidate-share.interface';
import { AscoInterface } from 'src/common/interfaces/intaerfaces';

export class CreateAssignmentContestDto {
  @IsNotEmpty()
  share: AscoInterface;
}
