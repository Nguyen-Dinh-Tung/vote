import { SERVE_ERROR } from './../../common/constant/message';
import { UpdateUioDto } from './../dto/update-uio.dto';
import { USER_NOT_FOUND } from './../../users/contants/message';
import { HttpStatus } from '@nestjs/common';
import { UioDto } from './../dto/uio.dto';
import { UserEntity } from './../../users/entities/user.entity';
import { UioEntity } from './../entity/uio.entity';
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Response } from 'express';


@Injectable()
export class UioServices {

    constructor(
        @InjectRepository(UioEntity) private readonly uioEntity : Repository<UioEntity> ,
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

        checkuser.uio = uio
        await this.userEntity.save(checkuser)
    }       

    async updateUio(updateUioDto : UpdateUioDto , res : Response){

        let checkUser = await this.userEntity.findOne({
            where : {
                id : updateUioDto.idUser
            } ,
            relations : {
                uio : true
            }
        })
        if(!checkUser)
        return res.status(HttpStatus.NOT_FOUND).json({
            message : USER_NOT_FOUND
        })

        let uio = checkUser.uio ;

        if(!uio)
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message : SERVE_ERROR
        })
        uio.ioId = updateUioDto.ioId
        await this.uioEntity.save(uio)
    }

    async removeIoId (idUser : string , res : Response){

        let checkUser = await this.userEntity.findOne({
            where : {
                id : idUser
            } ,
            relations : {
                uio : true
            }
        })
        let uio = checkUser.uio
        if(!checkUser)
        return   res.status(HttpStatus.NOT_FOUND).json({
            message : USER_NOT_FOUND
        })

        if(!uio)
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message : SERVE_ERROR
        })

        
        uio.ioId = ''
        await this.uioEntity.save(uio)
    }
}
