import { IsOptional } from 'class-validator';

export class ParamGetFriendsDto {
  @IsOptional()
  page: number;
  @IsOptional()
  search: string;
  @IsOptional()
  take: number;
}
