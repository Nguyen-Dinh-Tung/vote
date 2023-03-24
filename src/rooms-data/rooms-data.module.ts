import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomsDataController } from "./controller/rooms-data.controller";
import { RoomsDataEntity } from "./entities/rooms-data.entity";
import { RoomsDataService } from "./services/rooms-data.service";
@Module({
    imports : [
        TypeOrmModule.forFeature([
            RoomsDataEntity
        ])
    ] ,
    providers : [RoomsDataService] ,
    controllers : [RoomsDataController] ,
    exports : []
})

export class RoomsData {

}