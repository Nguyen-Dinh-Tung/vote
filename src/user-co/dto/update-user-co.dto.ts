import { PartialType } from '@nestjs/swagger';
import { CreateUserCoDto } from './create-user-co.dto';

export class UpdateUserCoDto extends PartialType(CreateUserCoDto) {}
