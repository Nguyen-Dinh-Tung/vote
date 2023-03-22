import { UserEntity } from './../users/entities/user.entity';
import { UsersModule } from './../users/users.module';
import { UioEntity } from './entity/uio.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from "@nestjs/common";
import { UioController } from "./controller/uio.controller";
import { UioServices } from "./services/uio.services";

@Module({
    imports : [
        TypeOrmModule.forFeature([
            UioEntity ,
            UserEntity
        ]),
        UsersModule
    
    ] ,
    exports : [] ,
    controllers : [UioController] ,
    providers : [UioServices] 
})

export class Uio {

}