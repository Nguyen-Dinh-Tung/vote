import { PartialType } from '@nestjs/swagger';
import { CreateNotifyAppDto } from './create-notify-app.dto';

export class UpdateNotifyAppDto extends PartialType(CreateNotifyAppDto) {}
