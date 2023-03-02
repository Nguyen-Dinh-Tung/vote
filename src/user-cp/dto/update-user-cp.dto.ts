import { PartialType } from '@nestjs/swagger';
import { CreateUserCpDto } from './create-user-cp.dto';

export class UpdateUserCpDto extends PartialType(CreateUserCpDto) {}
