import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectIoEntity } from 'src/io/entities/connect-io.entity';
import { RoomsModule } from 'src/rooms/rooms.module';
import { UserEntity } from 'src/users/entities/user.entity';
import { RoomsDataController } from './controller/rooms-data.controller';
import { RoomsDataEntity } from './entities/rooms-data.entity';
import { RoomsDataService } from './services/rooms-data.service';
import { RoomEntity } from 'src/rooms/entities/rooms.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoomsDataEntity,
      ConnectIoEntity,
      UserEntity,
      RoomEntity,
    ]),
    RoomsModule,
    UsersModule,
  ],
  providers: [RoomsDataService],
  controllers: [RoomsDataController],
  exports: [],
})
export class RoomsData {}
