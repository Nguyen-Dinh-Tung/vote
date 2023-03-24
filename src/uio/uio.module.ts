import { UserEntity } from './../users/entities/user.entity';
import { UsersModule } from './../users/users.module';
import { IoEntity } from './entities/io.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from "@nestjs/common";
import { UioController } from "./controller/uio.controller";
import { UioServices } from "./services/uio.services";
import { ConnectIoEntity } from './entities/connect-io.entity';

@Module({
    imports : [
        TypeOrmModule.forFeature([
            IoEntity ,
            UserEntity ,
            ConnectIoEntity
        ]),
        UsersModule
    
    ] ,
    exports : [UioServices] ,
    controllers : [UioController] ,
    providers : [UioServices] 
})

export class Uio {

}