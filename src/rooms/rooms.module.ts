import { IoEntity } from './../io/entities/io.entity';
import { UserEntity } from './../users/entities/user.entity';
import { RoomsDataEntity } from './../rooms-data/entities/rooms-data.entity';
import { RoomEntity } from './entities/rooms.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsService } from './services/rooms.service';
import { RoomsController } from './controller/rooms.controller';
import { ConnectIoEntity } from 'src/io/entities/connect-io.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoomsDataEntity,
      ConnectIoEntity,
      UserEntity,
      RoomEntity,
      IoEntity,
    ]),
  ],
  providers: [RoomsService, JwtService],
  controllers: [RoomsController],
})
export class RoomsModule {}
