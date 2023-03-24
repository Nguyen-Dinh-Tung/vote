import { UserEntity } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { IoEntity } from './entities/io.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from "@nestjs/common";
import { IoServices } from "./services/io.service";
import { ConnectIoEntity } from './entities/connect-io.entity';
import { ioController } from './controller/io.controller';
import { forwardRef } from '@nestjs/common/utils';

@Module({
    imports : [
        TypeOrmModule.forFeature([
            IoEntity ,
            UserEntity ,
            ConnectIoEntity
        ]),
        forwardRef(() => UsersModule)
    ] ,
    exports : [IoServices] ,
    controllers : [ioController] ,
    providers : [IoServices] 
})

export class IoModule {

}