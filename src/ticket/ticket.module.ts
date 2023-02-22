import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TicketController } from './controller/ticket.controller';
import { TicketEntity } from './entities/ticket.entity';
import { TicketService } from './services/ticket.service';
import { UsersModule } from 'src/users/users.module';
import { ContestModule } from 'src/contest/contest.module';
import { CandidateModule } from 'src/candidate/candidate.module';

@Module({
  controllers: [TicketController],
  providers: [TicketService ] ,
  imports : [TypeOrmModule.forFeature([TicketEntity]) , UsersModule , ContestModule , CandidateModule]
})
export class TicketModule {}
