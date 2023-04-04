import { CompanyEntity } from './../company/entities/company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UserEntity } from './entities/user.entity';
import { FeatureEntity } from 'src/feature/entities/feature.entity';
import { RtokenEntity } from 'src/common/extra database/entity/Rtoken';
import { UsersService } from './services/users.service';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { MulterModule } from '@nestjs/platform-express';
import { UserCpModule } from 'src/user-cp/user-cp.module';
import { UserCp } from 'src/user-cp/entities/user-cp.entity';
import { IoEntity } from 'src/io/entities/io.entity';
import { IoServices } from 'src/io/services/io.service';
import { IoModule } from 'src/io/io.module';
import { RoomEntity } from 'src/rooms/entities/rooms.entity';
import { ConnectIoEntity } from 'src/io/entities/connect-io.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      FeatureEntity,
      RtokenEntity,
      UserCp,
      CompanyEntity,
      IoEntity,
      RoomEntity,
      ConnectIoEntity,
    ]),
    MulterModule.register({
      dest: './files/images',
    }),
    forwardRef(() => UserCpModule),
    forwardRef(() => CompanyEntity),
    forwardRef(() => IoModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, IoServices],
  exports: [UsersService],
})
export class UsersModule {}
