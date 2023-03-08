import { CandidateEntity } from './../candidate/entities/candidate.entity';
import { ContestEntity } from 'src/contest/entities/contest.entity';
import { CompanyEntity } from 'src/company/entities/company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { TicketController } from './controller/ticket.controller';
import { TicketEntity } from './entities/ticket.entity';
import { TicketService } from './services/ticket.service';
import { UsersModule } from 'src/users/users.module';
import { ContestModule } from 'src/contest/contest.module';
import { CandidateModule } from 'src/candidate/candidate.module';
import { UserCp } from 'src/user-cp/entities/user-cp.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Module({
  controllers: [TicketController],
  providers: [TicketService ] ,
  imports : [TypeOrmModule.forFeature([
    TicketEntity,
    UserCp ,
    UserEntity ,
    CompanyEntity ,
    ContestEntity ,
    CandidateEntity
  ]) , 
  UsersModule , 
  forwardRef(() => ContestModule) , 
  forwardRef(() =>CandidateModule)],
  exports : [ TicketService]
})
export class TicketModule {}
