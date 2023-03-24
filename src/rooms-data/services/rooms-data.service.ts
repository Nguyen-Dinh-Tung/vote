import { UserEntity } from './../../users/entities/user.entity';
import { ConnectIoEntity } from 'src/io/entities/connect-io.entity';
import { CreateRoomDto } from '../../rooms/dto/create-room.dto';
import { Injectable } from "@nestjs/common";
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RoomEntity } from 'src/rooms/entities/rooms.entity';
import {HttpStatus} from '@nestjs/common'
import { USER_CONNECT_ROOM_NOT_FOUND, USER_CREATE_ROOM_NOT_FOUND } from 'src/common/constant/message';
@Injectable()
export class RoomsDataService {
    
    constructor(
        @InjectRepository(ConnectIoEntity) private readonly connectEntity : Repository<ConnectIoEntity> ,
        @InjectRepository(RoomEntity) private readonly roomEntity : Repository<RoomEntity> ,
        @InjectRepository(UserEntity) private readonly userEntity : Repository<UserEntity> ,
    ){

    }

}