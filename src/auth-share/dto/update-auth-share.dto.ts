import { PartialType } from '@nestjs/swagger';
import { CreateAuthShareDto } from './create-auth-share.dto';

export class UpdateAuthShareDto extends PartialType(CreateAuthShareDto) {}
