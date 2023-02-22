import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AssignmentContestService } from './services/assignment-contest.service';
import { AssmContestEntity } from './entities/assignment-contest.entity';
import { ContestEntity } from 'src/contest/entities/contest.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { AssignmentContestController } from './controller/assignment-contest.controller';

@Module({
  imports : [TypeOrmModule.forFeature([AssmContestEntity ,ContestEntity , TicketEntity])],
  controllers: [AssignmentContestController],
  providers: [AssignmentContestService , AssmContestEntity]
})
export class AssignmentContestModule {}