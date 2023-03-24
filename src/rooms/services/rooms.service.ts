import { RoomTypes, ChatTypes } from './../../common/enum/io.room';
import { IoEntity } from './../../io/entities/io.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './../../users/entities/user.entity';
import { RoomEntity } from './../entities/rooms.entity';
import { USER_CREATE_ROOM_NOT_FOUND, USER_CONNECT_ROOM_NOT_FOUND, ADD_NEW_ROOM_SUCCESS } from './../../common/constant/message';
import { Injectable, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { CreateRoomDto } from '../dto/create-room.dto';
import { ConnectIoEntity } from 'src/io/entities/connect-io.entity';
import { Repository, In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class RoomsService {
    constructor(
        @InjectRepository(ConnectIoEntity) private readonly connectEntity : Repository<ConnectIoEntity> ,
        @InjectRepository(RoomEntity) private readonly roomEntity : Repository<RoomEntity> ,
        @InjectRepository(UserEntity) private readonly userEntity : Repository<UserEntity> ,
    ){

    }
    @Transactional()
    async createRoom(res : Response , data : CreateRoomDto){
        
        let checkUserInit : UserEntity = await this.userEntity.findOne({
            where : {
                id : data.idUser
            } ,
            relations : {
                io : true
            }
        })
        let checkUserConnect : UserEntity = await this.userEntity.findOne({
            where : {
                id : data.idConnect
            } ,
            relations : {
                io : true
            }
        })
        
        if(!checkUserConnect)
        return res.status(HttpStatus.NOT_FOUND).json({
            message : USER_CREATE_ROOM_NOT_FOUND
        })

        if(!checkUserInit)
        return res.status(HttpStatus.NOT_FOUND).json({
            message : USER_CONNECT_ROOM_NOT_FOUND
        })  
        let userInitCns : ConnectIoEntity [] = await this.connectEntity.find({
            where : {
                io : checkUserInit.io
            } ,
            relations : {
                room : true
            }
        })
        let userConnectCns : ConnectIoEntity [] = await this.connectEntity.find({
            where : {
                io : checkUserConnect.io
            } ,
            relations : {
                room : true
            }
        })
        console.log(userInitCns , ' userInitCns');
        console.log(userConnectCns , ' userConnectCns');
        
        let roomExist : RoomEntity ;
        for(let e of userInitCns){
            if(e.room.type === RoomTypes.single)
            for(let element of userConnectCns){
                if(element.room.type === RoomTypes.single)
                if(e.room.id === element.room.id ){
                    roomExist = e.room
                    break
                }
            }
        }

        console.log(roomExist , 'roomExist');
        
        if(roomExist)
        return res.status(HttpStatus.OK).json({
            room : roomExist
        })

        let newRoom = await this.roomEntity.save({
            type : RoomTypes.single
        })

        let userInitConnect : ConnectIoEntity = await this.connectEntity.save({
            io : checkUserInit.io ,
            type : ChatTypes.single ,
            room : newRoom
        })
        let connectUser : ConnectIoEntity = await this.connectEntity.save({
            io : checkUserConnect.io ,
            type : ChatTypes.single ,
            room : newRoom
        })
        if(userInitConnect
           && connectUser)
        return res.status(HttpStatus.CREATED).json({
            message : ADD_NEW_ROOM_SUCCESS , 
            room : newRoom
        })
    }               

}

