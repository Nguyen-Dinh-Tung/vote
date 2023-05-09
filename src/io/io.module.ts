import { UserEntity } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { IoEntity } from './entities/io.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { IoServices } from './services/io.service';
import { ConnectIoEntity } from './entities/connect-io.entity';
import { ioController } from './controller/io.controller';
import { forwardRef } from '@nestjs/common/utils';
import { RoomEntity } from 'src/rooms/entities/rooms.entity';
import { RoomsModule } from 'src/rooms/rooms.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IoEntity,
      UserEntity,
      ConnectIoEntity,
      RoomEntity,
    ]),
    forwardRef(() => UsersModule),
    RoomsModule,
  ],
  exports: [IoServices],
  controllers: [ioController],
  providers: [IoServices, JwtService],
})
export class IoModule {}
