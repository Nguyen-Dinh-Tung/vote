import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateNotifyAppDto } from '../dto/create-notify-app.dto';
import { UpdateNotifyAppDto } from '../dto/update-notify-app.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NotifyAppEntity } from '../entities/notify-app.entity';
import { In, Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { DetailNotifyEntity } from '../entities/notify-detail.entity';
import { Response } from 'express';
import { USER_NOT_FOUND } from 'src/users/contants/message';
import {
  GET_NOTIFY_SUCESS,
  USER_REVEICE_NOT_FOUND,
} from 'src/common/constant/message';
import { ParamDto } from 'src/common/dto/param.dto';

@Injectable()
export class NotifyAppService {
  constructor(
    @InjectRepository(NotifyAppEntity)
    private readonly notifyEntity: Repository<NotifyAppEntity>,
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    @InjectRepository(DetailNotifyEntity)
    private readonly detailNotifyEntity: Repository<DetailNotifyEntity>,
  ) {}
  async create(res: Response, data: CreateNotifyAppDto) {
    const checkUser = await this.userEntity.findOne({
      where: {
        id: data.idUser,
      },
    });
    if (!checkUser)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: USER_NOT_FOUND,
      });

    const checkReveiceUsers = await this.userEntity.find({
      where: {
        id: In(data.idsReveice),
      },
    });
    if (checkReveiceUsers.length < 1)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: USER_REVEICE_NOT_FOUND,
      });
  }

  async findAll(
    res: Response,
    { page = 1, limit = 10, search }: ParamDto,
    idUser: string,
  ) {
    const skip = page * limit - limit;
    const checkUser = await this.userEntity.findOne({
      where: {
        id: idUser,
      },
    });
    if (!checkUser)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: USER_NOT_FOUND,
      });
    const checkNotifies = await this.detailNotifyEntity.find({
      where: {
        reveice: checkUser,
        read: false,
      },
      take: limit,
      skip: skip,
    });
    return res.status(HttpStatus.OK).json({
      message: GET_NOTIFY_SUCESS,
      notify: checkNotifies,
    });
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
