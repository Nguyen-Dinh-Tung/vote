import { RoomsDataService } from './../rooms-data/services/rooms-data.service';
import { RoomsDataEntity } from './../rooms-data/entities/rooms-data.entity';
import { RoomEntity } from './../rooms/entities/rooms.entity';
import { UserEntity } from './../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { GateWay } from './gateway/socket.gateway';
import { UsersModule } from 'src/users/users.module';
import { IoEntity } from 'src/io/entities/io.entity';
import { IoServices } from 'src/io/services/io.service';
import { forwardRef } from '@nestjs/common/utils';
import { ConnectIoEntity } from 'src/io/entities/connect-io.entity';
import { RoomsData } from 'src/rooms-data/rooms-data.module';

@Module({
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([
      IoEntity,
      UserEntity,
      RoomEntity,
      RoomsDataEntity,
      ConnectIoEntity,
    ]),
    forwardRef(() => UsersModule),
    RoomsData,
  ],
  providers: [GateWay, IoServices, RoomsDataService],
})
export class Socket {}
