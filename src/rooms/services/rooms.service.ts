import { ParamGetRoom } from './../dto/param-get-room';
import { USER_NOT_FOUND } from './../../users/contants/message';
import { IoEntity } from './../../io/entities/io.entity';
import { RoomsDataEntity } from './../../rooms-data/entities/rooms-data.entity';
import { RoomTypes, ChatTypes } from './../../common/enum/io.room';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './../../users/entities/user.entity';
import { RoomEntity } from './../entities/rooms.entity';
import {
  USER_CREATE_ROOM_NOT_FOUND,
  USER_CONNECT_ROOM_NOT_FOUND,
  ADD_NEW_ROOM_SUCCESS,
  GET_ROOM_DATA_SUCCESS,
  ROOM_NOT_FOUND,
  DUBLICATE_ID_USER,
  CREATE_GROUP_SUCCESS,
  GET_GROUP_CHAT_SUCCESS,
  GET_ROOM_SUCCESS,
} from './../../common/constant/message';
import { Injectable, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { CreateRoomDto } from '../dto/create-room.dto';
import { ConnectIoEntity } from 'src/io/entities/connect-io.entity';
import { Repository, In, And } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { CreateGroupChatDto } from '../dto/create-group-chat.dto';
import { MessageInterface } from 'src/common/interfaces/message.interface';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(ConnectIoEntity)
    private readonly connectEntity: Repository<ConnectIoEntity>,
    @InjectRepository(RoomEntity)
    private readonly roomEntity: Repository<RoomEntity>,
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    @InjectRepository(RoomsDataEntity)
    private readonly roomsDataEntity: Repository<RoomsDataEntity>,
    @InjectRepository(IoEntity) private readonly ioEntity: Repository<IoEntity>,
  ) {}
  @Transactional()
  async createRoom(res: Response, data: CreateRoomDto) {
    if (data.idConnect === data.idUser)
      return res.status(HttpStatus.CONFLICT).json({
        message: DUBLICATE_ID_USER,
      });

    let checkUserInit: UserEntity = await this.userEntity.findOne({
      where: {
        id: data.idUser,
      },
    });
    let checkUserConnect: UserEntity = await this.userEntity.findOne({
      where: {
        id: data.idConnect,
      },
    });

    if (!checkUserConnect)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: USER_CONNECT_ROOM_NOT_FOUND,
      });

    if (!checkUserInit)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: USER_CREATE_ROOM_NOT_FOUND,
      });

    let checkRoomUserInit = await this.roomEntity
      .createQueryBuilder('rooms')
      .leftJoin(ConnectIoEntity, 'cns', 'cns.roomId = rooms.id')
      .leftJoin('cns.io', 'io')
      .leftJoin(UserEntity, 'user', 'user.ioId = io.id')
      .where('user.id =:id', { id: checkUserInit.id })
      .andWhere('rooms.type =:type', { type: RoomTypes.single })
      .select('rooms.id as id')
      .getRawMany();

    let ids: string[] = [];
    let checkRoomUserConnect: any[];

    if (checkRoomUserInit.length > 0) {
      for (let e of checkRoomUserInit) {
        ids.push(e.id);
      }
      checkRoomUserConnect = await this.roomEntity
        .createQueryBuilder('rooms')
        .leftJoin(ConnectIoEntity, 'cns', 'cns.roomId = rooms.id')
        .leftJoin('cns.io', 'io')
        .leftJoin(UserEntity, 'user', 'user.ioId = io.id')
        .where('user.id =:id', { id: checkUserConnect.id })
        .andWhere('rooms.id IN (:...ids)', { ids: ids })
        .andWhere('rooms.type =:type', { type: RoomTypes.single })
        .select('rooms.id as id')
        .getRawMany();
    }

    if (checkRoomUserConnect[0])
      return res.status(HttpStatus.OK).json({
        room: checkRoomUserConnect[0],
      });

    let newRoom = await this.roomEntity.save({
      type: RoomTypes.single,
    });

    let userInit: ConnectIoEntity = await this.connectEntity.save({
      io: checkUserInit.io,
      type: ChatTypes.single,
      room: newRoom,
    });

    let connectUser: ConnectIoEntity = await this.connectEntity.save({
      io: checkUserConnect.io,
      type: ChatTypes.single,
      room: newRoom,
    });

    if (userInit && connectUser)
      return res.status(HttpStatus.CREATED).json({
        message: ADD_NEW_ROOM_SUCCESS,
        room: newRoom,
      });
  }

  async getRoomData(id: string, res: Response) {
    let checkRooms = await this.roomEntity.findOne({
      where: {
        id: id,
      },
    });

    if (!checkRooms)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: ROOM_NOT_FOUND,
      });
    let data: MessageInterface[] = await this.roomsDataEntity
      .createQueryBuilder('rda')
      .leftJoin('rda.room', 'rooms')
      .leftJoin('rda.user', 'user')
      .where('rooms.id =:id', { id: id })
      .select([
        'rooms.id as idRoom',
        'rda.id as idRda',
        'user.background as background',
        'rda.message as message',
        'rda.timeAt as timeAt',
        'user.id as idUser',
      ])
      .orderBy('rda.timeAt', 'ASC')
      .getRawMany();
    return res.status(HttpStatus.OK).json({
      message: GET_ROOM_DATA_SUCCESS,
      data: data,
    });
  }

  @Transactional()
  async createGroupChat(res: Response, data: CreateGroupChatDto) {
    let checkUser = await this.userEntity.findOne({
      where: {
        id: data.idUser,
      },
    });

    if (!checkUser)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: USER_NOT_FOUND,
      });

    let newRoom = await this.roomEntity.save({
      name: data.name,
      type: RoomTypes.multipe,
    });

    let listIdsConnect = [...data.idsConnectRoom, checkUser.id];

    let listUsersConnect = await this.userEntity.find({
      where: {
        id: In(listIdsConnect),
      },
      relations: {
        io: true,
      },
    });
    let listSuccess: any[] = [];
    let listFail: any[] = [];
    for (let e of listUsersConnect) {
      let newConnect = await this.connectEntity.save({
        io: e.io,
        room: newRoom,
        type: ChatTypes.multipe,
      });

      if (newConnect) listSuccess.push(e);
      else listFail.push(e);
    }

    return res.status(HttpStatus.CREATED).json({
      message: CREATE_GROUP_SUCCESS,
      listConnectSuccess: listSuccess,
      listConnectFail: listFail,
    });
  }

  async getGroupChats(res: Response, id: string) {
    let checkUser = await this.userEntity.findOne({
      where: {
        id: id,
      },
    });

    if (!checkUser)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: USER_NOT_FOUND,
      });

    let groupChats: RoomEntity[] = await this.roomEntity
      .createQueryBuilder('rooms')
      .leftJoin(ConnectIoEntity, 'cns', 'cns.roomId = rooms.id')
      .leftJoin('cns.io', 'io')
      .leftJoin(UserEntity, 'user', 'user.ioId = io.id')
      .where('user.id =:id', { id: checkUser.id })
      .andWhere('rooms.type =:typeRoom', { typeRoom: RoomTypes.multipe })
      .andWhere('cns.type =:typeIo', { typeIo: ChatTypes.multipe })
      .select('rooms')
      .getMany();

    return res.status(HttpStatus.OK).json({
      message: GET_GROUP_CHAT_SUCCESS,
      groupChats: groupChats,
    });
  }

  async getRoomChats(param: ParamGetRoom, res: Response) {
    let checkUser = await this.userEntity.findOne({
      where: {
        id: param.idUser,
      },
    });

    if (!checkUser)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: USER_NOT_FOUND,
      });

    let privateRooms: any = [];
    let groupRooms: any = [];
    if (!param.search) {
      let checkRooms = await this.roomEntity
        .createQueryBuilder('rooms')
        .leftJoin(ConnectIoEntity, 'cns', 'cns.roomId = rooms.id')
        .leftJoin('cns.io', 'io')
        .leftJoin(UserEntity, 'user', 'user.ioId = io.id')
        .where('user.id = :id', { id: checkUser.id })
        .select('rooms')
        .getMany();

      let idsRoom = checkRooms.map((e) => {
        if (e.type === RoomTypes.multipe) groupRooms.push(e);
        else return e.id;
      });

      if (idsRoom.length > 0) {
        privateRooms = [
          ...(await this.roomEntity
            .createQueryBuilder('rooms')
            .select([
              'rooms.id as idRoom',
              'user.username as username',
              'user.id as idUser',
              'user.background as background',
            ])
            .leftJoin(ConnectIoEntity, 'cns', 'cns.roomId = rooms.id')
            .leftJoin('cns.io', 'io')
            .leftJoin(UserEntity, 'user', 'user.ioId = io.id')
            .where('user.id != :id', { id: checkUser.id })
            .andWhere('rooms.id IN(:...ids)', { ids: idsRoom })
            .getRawMany()),
        ];
      }
    } else {
      let checkRooms = await this.roomEntity
        .createQueryBuilder('rooms')
        .leftJoin(ConnectIoEntity, 'cns', 'cns.roomId = rooms.id')
        .leftJoin('cns.io', 'io')
        .leftJoin(UserEntity, 'user', 'user.ioId = io.id')
        .where('user.id = :id', { id: checkUser.id })
        .orWhere('user.username like %:userName%', { userName: param.search })
        .orWhere('rooms.name like %:roomsName%', { roomsName: param.search })
        .select('rooms')
        .getMany();

      let idsRoom = checkRooms.map((e) => {
        if (e.type === RoomTypes.multipe) groupRooms.push(e);
        else return e.id;
      });

      if (idsRoom.length > 0) {
        privateRooms = [
          ...(await this.roomEntity
            .createQueryBuilder('rooms')
            .select([
              'rooms.id as idRoom',
              'user.username as username',
              'user.id as idUser',
              'user.background as background',
            ])
            .leftJoin(ConnectIoEntity, 'cns', 'cns.roomId = rooms.id')
            .leftJoin('cns.io', 'io')
            .leftJoin(UserEntity, 'user', 'user.ioId = io.id')
            .where('user.id != :id', { id: checkUser.id })
            .andWhere('rooms.id IN(:...ids)', { ids: idsRoom })
            .getRawMany()),
        ];
      }
    }
    return res.status(HttpStatus.OK).json({
      message: GET_ROOM_SUCCESS,
      privateRooms: privateRooms,
      groupRooms: groupRooms,
    });
  }
}
