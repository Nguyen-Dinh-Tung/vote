import { UserEntity } from './../users/entities/user.entity';
import { UsersModule } from './../users/users.module';
import { IoEntity } from './entity/io.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from "@nestjs/common";
import { UioController } from "./controller/uio.controller";
import { UioServices } from "./services/uio.services";

@Module({
    imports : [
        TypeOrmModule.forFeature([
            IoEntity ,
            UserEntity
        ]),
        UsersModule
    
    ] ,
    exports : [UioServices] ,
    controllers : [UioController] ,
    providers : [UioServices] 
})

export class Uio {

}