import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  StreamableFile,
  Header,
} from '@nestjs/common';
import { NotifyAppService } from '../services/notify-app.service';
import { CreateNotifyAppDto } from '../dto/create-notify-app.dto';
import { UpdateNotifyAppDto } from '../dto/update-notify-app.dto';
import { Response } from 'express';
import { ParamDto } from 'src/common/dto/param.dto';
import { IdUserInterceptor } from 'src/users/interceptor/IdUserInterceptor';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('notify-app')
export class NotifyAppController {
  constructor(private readonly notifyAppService: NotifyAppService) {}
  @Post()
  async create(@Res() res: Response, @Body() data: CreateNotifyAppDto) {
    try {
      return await this.notifyAppService.create(res, data);
    } catch (e) {
      if (e) console.log(e);
    }
  }

  @Get('')
  async findAll(
    @Res() res: Response,
    @Param() param: ParamDto,
    @IdUserInterceptor() id: string,
  ) {
    try {
      return await this.notifyAppService.findAll(res, param, id);
    } catch (e) {
      if (e) console.log(e);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notifyAppService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotifyAppDto: UpdateNotifyAppDto,
  ) {
    return this.notifyAppService.update(+id, updateNotifyAppDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notifyAppService.remove(+id);
  }
  @Get('fack/file')
  @Header('Content-Type', 'image/pdf')
  @Header('Content-Disposition', 'attachment')
  getFile() {}
}
