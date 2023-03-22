import { SERVE_ERROR } from './../../common/constant/message';
import { UpdateUioDto } from './../dto/update-uio.dto';
import { USER_NOT_FOUND } from './../../users/contants/message';
import { HttpStatus } from '@nestjs/common';
import { UioDto } from './../dto/uio.dto';
import { UserEntity } from './../../users/entities/user.entity';
import { IoEntity } from '../entity/io.entity';
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { ConnectIoDto } from '../dto/connect-io.dto';
import { DisConnectIo } from '../dto/disConnect-io.dto';
import { Response } from 'express';

@Injectable()
export class UioServices {

    constructor(
        @InjectRepository(IoEntity) private readonly uioEntity : Repository<IoEntity> ,
        @InjectRepository(UserEntity) private readonly userEntity : Repository<UserEntity>

    ){

    }
    async createSocketConnect(uioDto : UioDto , res : Response){
        
        let checkuser = await this.userEntity.findOne({
            where : {
                id : uioDto.idUser
            }
        })

        if(!checkuser)
        return res.status(HttpStatus.NOT_FOUND).json({
            message : USER_NOT_FOUND
        })

        let uio = await this.uioEntity.save({})

        checkuser.io = uio
        await this.userEntity.save(checkuser)
    }       

    async updateUio(updateUioDto : UpdateUioDto , res : Response){

        let checkUser = await this.userEntity.findOne({
            where : {
                id : updateUioDto.idUser
            } ,
            relations : {
                io : true
            }
        })
        if(!checkUser)
        return res.status(HttpStatus.NOT_FOUND).json({
            message : USER_NOT_FOUND
        })

        let io = checkUser.io ;

        if(!io)
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message : SERVE_ERROR
        })
        io.ioId = updateUioDto.ioId
        await this.uioEntity.save(io)
    }

    async removeIoId (idUser : string , res : Response){

        let checkUser = await this.userEntity.findOne({
            where : {
                id : idUser
            } ,
            relations : {
                io : true
            }
        })
        let io = checkUser.io
        if(!checkUser)
        return  res.status(HttpStatus.NOT_FOUND).json({
            message : USER_NOT_FOUND
        })

        if(!io)
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message : SERVE_ERROR
        })
        
        io.ioId = ''
        await this.uioEntity.save(io)
    }

    async connect(connectIoDto : ConnectIoDto){
        let checkUser : UserEntity = await this.userEntity.findOne({
            where : {
                id : connectIoDto.idUser
            } ,
            relations : {
                io : true
            }
        })
        let io : IoEntity ;
        

        if(!checkUser)
        return false
        io = checkUser.io
        if(!io)
        return false

        io.isOnline = connectIoDto.isOnline 
        io.ioId = connectIoDto.ioId
        return true
    }   

    async disConnect(disConnectIoDto : DisConnectIo , res : Response){
        let checkUser : UserEntity = await this.userEntity.findOne({
            where : {
                id : disConnectIoDto.idUser
            } ,
            relations : {
                io : true
            }
        })
        let io : IoEntity  = checkUser.io

        if(!checkUser)
        return res.status(HttpStatus.NOT_FOUND).json({
            message : USER_NOT_FOUND
        })

        if(!io)
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message : SERVE_ERROR
        })

        io.isOnline = disConnectIoDto.isOnline
    }
}
