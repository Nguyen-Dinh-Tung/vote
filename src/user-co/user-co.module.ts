import { ContestEntity } from './../contest/entities/contest.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserCoService } from './services/user-co.service';
import { UserCoController } from './controller/user-co.controller';
import { UserCo } from './entities/user-co.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Module({
  controllers: [UserCoController],
  providers: [UserCoService],
  exports: [UserCoService],
  imports: [TypeOrmModule.forFeature([UserCo, ContestEntity, UserEntity])],
})
export class UserCoModule {}
