import { USER_NOT_FOUND } from './../../users/contants/message';
import { ROOM_NOT_FOUND, CREATE_ROOM_DATA_SUCCESS } from './../../common/constant/message';
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
import { PrivateChatDto } from 'src/socket/dto/private-chat.dto';
import { RoomsDataEntity } from '../entities/rooms-data.entity';
@Injectable()
export class RoomsDataService {
    
    constructor(
        @InjectRepository(ConnectIoEntity) private readonly connectEntity : Repository<ConnectIoEntity> ,
        @InjectRepository(RoomEntity) private readonly roomEntity : Repository<RoomEntity> ,
        @InjectRepository(UserEntity) private readonly userEntity : Repository<UserEntity> ,
        @InjectRepository(RoomsDataEntity) private readonly roomsDataEntity : Repository<RoomsDataEntity> ,
    ){

    }


    async createNewRoomData(
        data : PrivateChatDto  ,
        res : Response ,
        id : string
    ){

        let checkRoom = await this.roomEntity.findOne({
            where : {
                id : id
            }
        })
        let checkUser = await this.userEntity.findOne({
            where : {
                id : data.idUser
            }
        })
        if(!checkRoom)
        return res.status(HttpStatus.NOT_FOUND).json({
            message : ROOM_NOT_FOUND
        })

        if(!checkUser)
        return res.status(HttpStatus.NOT_FOUND).json({
            message : USER_NOT_FOUND
        })

        let newData = await this.roomsDataEntity.save({
            ...data , 
            room : checkRoom ,
            user : checkUser
        })
        return res.status(HttpStatus.CREATED).json({
            message : CREATE_ROOM_DATA_SUCCESS , 
            data : newData
        })
    }
}