import { IsNotEmpty } from 'class-validator';

export class CreateUserCoDto {
  @IsNotEmpty()
  idContest: string;
  @IsNotEmpty()
  idUsers: string[];
}
