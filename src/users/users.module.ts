import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UserEntity } from './entities/user.entity';
import { FeatureEntity } from 'src/feature/entities/feature.entity';
import { RtokenEntity } from 'src/common/extra database/entity/Rtoken';
import { UsersService } from './services/users.service';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports : [TypeOrmModule.forFeature([UserEntity , FeatureEntity , RtokenEntity],
    ) ,
    MulterModule.register({
      dest : './files/images'
    })
],
  controllers: [UsersController],
  providers: [UsersService , JwtStrategy ],
  exports : [UsersService]
})
export class UsersModule {
}
