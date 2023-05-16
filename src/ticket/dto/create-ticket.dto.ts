import { ContestShareInterface } from 'src/common/interfaces/Contest-share.interface';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  idcontest: string;

  @IsNotEmpty()
  idcandidates: string[];

  @IsOptional()
  historyCreate?: string;
}
