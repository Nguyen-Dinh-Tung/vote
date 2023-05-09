import { SERVE_ERROR } from '../../common/constant/message';
import { UpdateUioDto } from '../dto/update-uio.dto';
import { USER_NOT_FOUND } from '../../users/contants/message';
import { HttpStatus, HttpException } from '@nestjs/common';
import { UioDto } from '../dto/uio.dto';
import { UserEntity } from '../../users/entities/user.entity';
import { IoEntity } from '../entities/io.entity';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConnectIoDto } from '../dto/connect-io.dto';
import { DisConnectIo } from '../dto/disConnect-io.dto';
import { Response } from 'express';
import { Transactional } from 'typeorm-transactional';
import { RoomEntity } from 'src/rooms/entities/rooms.entity';
import { RoomTypes } from 'src/common/enum/io.room';
import { ConnectIoEntity } from '../entities/connect-io.entity';

@Injectable()
export class IoServices {
  constructor(
    @InjectRepository(IoEntity)
    private readonly uioEntity: Repository<IoEntity>,
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    @InjectRepository(RoomEntity)
    private readonly roomEntity: Repository<RoomEntity>,
  ) {}
  async createSocketConnect(uioDto: UioDto, res: Response) {
    let checkuser = await this.userEntity.findOne({
      where: {
        id: uioDto.idUser,
      },
    });

    if (!checkuser)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: USER_NOT_FOUND,
      });

    let uio = await this.uioEntity.save({});

    checkuser.io = uio;
    await this.userEntity.save(checkuser);
  }

  async updateUio(updateUioDto: UpdateUioDto, res: Response) {
    let checkUser = await this.userEntity.findOne({
      where: {
        id: updateUioDto.idUser,
      },
      relations: {
        io: true,
      },
    });
    if (!checkUser)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: USER_NOT_FOUND,
      });

    let io = checkUser.io;

    if (!io)
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: SERVE_ERROR,
      });
    io.socketId = updateUioDto.ioId;
    await this.uioEntity.save(io);
  }

  async removeIoId(idUser: string, res: Response) {
    let checkUser = await this.userEntity.findOne({
      where: {
        id: idUser,
      },
      relations: {
        io: true,
      },
    });
    let io = checkUser.io;
    if (!checkUser)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: USER_NOT_FOUND,
      });

    if (!io)
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: SERVE_ERROR,
      });

    io.socketId = '';
    await this.uioEntity.save(io);
  }

  @Transactional()
  async connect(connectIoDto: ConnectIoDto) {
    let checkUser: UserEntity = await this.userEntity.findOne({
      where: {
        id: connectIoDto.idUser,
      },
      relations: {
        io: true,
      },
    });
    let io: IoEntity;

    if (!checkUser)
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);

    io = checkUser.io;

    if (!io)
      throw new HttpException(SERVE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);

    let checkGroup = await this.roomEntity
      .createQueryBuilder('rooms')
      .leftJoin(ConnectIoEntity, 'cns', 'cns.roomId = rooms.id')
      .leftJoin('cns.io', 'io')
      .where('io.id =:id', { id: io.id })
      .andWhere('rooms.type =:type', { type: RoomTypes.multipe })
      .select('rooms')
      .getMany();

    io.isOnline = connectIoDto.isOnline;
    io.socketId = connectIoDto.ioId;

    await this.uioEntity.save(io);
    return checkGroup;
  }

  async disConnect(disConnectIoDto: DisConnectIo) {
    try {
      let checkUser: UserEntity = await this.userEntity.findOne({
        where: {
          id: disConnectIoDto.idUser,
        },
        relations: {
          io: true,
        },
      });
      let io: IoEntity = checkUser.io;

      if (!checkUser)
        throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);

      if (!io)
        throw new HttpException(SERVE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);

      io.isOnline = false;
      io.socketId = '';
      await this.uioEntity.save(io);
      return true;
    } catch (e) {
      if (e) console.log(e);
    }
  }

  async privateChat(idUser: string) {
    let checkIoId = await this.userEntity.findOne({
      where: {
        id: idUser,
      },
      relations: {
        io: true,
      },
      select: ['io'],
    });

    return checkIoId.io;
  }
}
