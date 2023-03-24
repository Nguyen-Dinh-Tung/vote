import { RoomEntity } from './entities/rooms.io.entity';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports : [
        TypeOrmModule.forFeature([
            RoomEntity
        ])
    ]
})

export class RoomsModule {

}