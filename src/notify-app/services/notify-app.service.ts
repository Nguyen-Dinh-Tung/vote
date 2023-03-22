import { Injectable } from '@nestjs/common';
import { CreateNotifyAppDto } from '../dto/create-notify-app.dto';
import { UpdateNotifyAppDto } from '../dto/update-notify-app.dto';

@Injectable()
export class NotifyAppService {
  create(createNotifyAppDto: CreateNotifyAppDto) {
    return 'This action adds a new notifyApp';
  }

  findAll() {
    return `This action returns all notifyApp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notifyApp`;
  }

  update(id: number, updateNotifyAppDto: UpdateNotifyAppDto) {
    return `This action updates a #${id} notifyApp`;
  }

  remove(id: number) {
    return `This action removes a #${id} notifyApp`;
  }
}
