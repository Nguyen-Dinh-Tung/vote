import { UserEntity } from './../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from "@nestjs/common";
import { UioServices } from "src/uio/services/uio.services";
import { Uio } from "src/uio/uio.module";
import { GateWay } from "./gateway/socket.gateway";
import { IoEntity } from 'src/uio/entity/io.entity';
import { UsersModule } from 'src/users/users.module';


@Module({
    controllers : [] ,
    imports : [Uio ,
    TypeOrmModule.forFeature([
        IoEntity ,
        UserEntity
    ])  ,
    UsersModule
    ] ,
    providers : [GateWay , UioServices]
})

export class  Socket {


}