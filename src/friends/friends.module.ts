import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsEntity } from './entities/fiends.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { FriendsService } from './services/friends.service';
import { FriendsController } from './controller/friends.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([FriendsEntity, UserEntity])],
  providers: [FriendsService, JwtService],
  controllers: [FriendsController],
})
export class FriendsModule {}
