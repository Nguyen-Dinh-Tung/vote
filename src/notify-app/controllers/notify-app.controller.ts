import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotifyAppService } from '../services/notify-app.service';
import { CreateNotifyAppDto } from '../dto/create-notify-app.dto';
import { UpdateNotifyAppDto } from '../dto/update-notify-app.dto';

@Controller('notify-app')
export class NotifyAppController {
  constructor(private readonly notifyAppService: NotifyAppService) {}

  @Post()
  create(@Body() createNotifyAppDto: CreateNotifyAppDto) {
    return this.notifyAppService.create(createNotifyAppDto);
  }

  @Get()
  findAll() {
    return this.notifyAppService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notifyAppService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotifyAppDto: UpdateNotifyAppDto) {
    return this.notifyAppService.update(+id, updateNotifyAppDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notifyAppService.remove(+id);
  }
}
