import { IdUserInterceptor } from './../../users/interceptor/IdUserInterceptor';
import { Response } from 'express';
import { FriendsService } from './../services/friends.service';
import {
  Controller,
  Post,
  Res,
  Body,
  Get,
  Param,
  Delete,
  DefaultValuePipe,
  Put,
} from '@nestjs/common';
import { CreateFriendDto } from '../dto/create-friend.dto';
import { ParamGetFriendsDto } from '../dto/param-get-friends.dto';
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}
  @Post()
  async addFriend(@Res() res: Response, @Body() data: CreateFriendDto) {
    try {
      return await this.friendsService.addFriend(res, data);
    } catch (e) {
      if (e) console.log(e);
    }
  }
  @Get(':amount/:page/:search?')
  async getFriends(
    @Res() res: Response,
    @IdUserInterceptor() idUser: string,
    @Param() param: ParamGetFriendsDto,
  ) {
    try {
      return await this.friendsService.getFriends(res, idUser, param);
    } catch (e) {
      if (e) console.log(e);
    }
  }
  @Delete(':id')
  async cancelFriend(
    @Res() res: Response,
    @Param('id') id: string,
    @IdUserInterceptor() idUser: string,
  ) {
    try {
      return await this.friendsService.cancelFriend(res, id, idUser);
    } catch (e) {
      if (e) console.log(e);
    }
  }
  @Get('data/unknow/list/:page')
  async getUnknowPeople(
    @Res() res: Response,
    @IdUserInterceptor() id: string,
    @Param() param: any,
  ) {
    try {
      return await this.friendsService.getUnknowPeoples(res, id, param);
    } catch (e) {
      if (e) console.log(e);
    }
  }
}
