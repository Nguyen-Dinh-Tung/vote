import { Controller, Get, Post, Res, Param } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { Response } from 'express';
import { CreateGroupChatDto } from '../dto/create-group-chat.dto';
import { CreateRoomDto } from '../dto/create-room.dto';
import { ParamGetRoom } from '../dto/param-get-room';
import { RoomsService } from '../services/rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  async createRoom(@Res() res: Response, @Body() data: CreateRoomDto) {
    try {
      return await this.roomsService.createRoom(res, data);
    } catch (e) {
      if (e) console.log(e);
    }
  }

  @Get('data/:id/:amount?')
  async getRoomData(@Param() param: any, @Res() res: Response) {
    try {
      return await this.roomsService.getRoomData(param.id, res);
    } catch (e) {
      if (e) console.log(e);
    }
  }

  @Post('group')
  async createGroupChat(
    @Res() res: Response,
    @Body() data: CreateGroupChatDto,
  ) {
    try {
      return this.roomsService.createGroupChat(res, data);
    } catch (e) {
      if (e) console.log(e);
    }
  }

  @Get('group-chat/:id')
  async getGroupChats(@Res() res: Response, @Param() param: any) {
    try {
      return await this.roomsService.getGroupChats(res, param.id);
    } catch (e) {
      if (e) console.log(e);
    }
  }
  @Get('/:idUser/:search?')
  async getRoomChats(@Param() param: ParamGetRoom, @Res() res: Response) {
    try {
      return await this.roomsService.getRoomChats(param, res);
    } catch (e) {
      if (e) console.log(e);
    }
  }
}
