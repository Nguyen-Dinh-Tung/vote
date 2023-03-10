import { CandidateEntity } from './../candidate/entities/candidate.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserCaService } from './services/user-ca.service';
import { UserCaController } from './controller/user-ca.controller';
import { UserCa } from './entities/user-ca.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Module({
  controllers: [UserCaController],
  providers: [UserCaService] ,
  imports : [TypeOrmModule.forFeature([
    UserCa ,
    UserEntity ,
    CandidateEntity
  ])] ,
  exports : [UserCaService]
})
export class UserCaModule {}
