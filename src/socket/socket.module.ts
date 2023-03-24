import { UserEntity } from './../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from "@nestjs/common";
import { GateWay } from "./gateway/socket.gateway";
import { UsersModule } from 'src/users/users.module';
import { IoEntity } from 'src/io/entities/io.entity';
import { IoServices } from 'src/io/services/io.service';
import { forwardRef } from '@nestjs/common/utils';


@Module({
    controllers : [] ,
    imports : [
    TypeOrmModule.forFeature([
        IoEntity ,
        UserEntity
    ])  ,
    forwardRef(() => UsersModule)
    ] ,
    providers : [GateWay , IoServices]
})

export class  Socket {


}