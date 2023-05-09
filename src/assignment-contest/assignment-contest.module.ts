import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AssignmentContestService } from './services/assignment-contest.service';
import { AssmContestEntity } from './entities/assignment-contest.entity';
import { ContestEntity } from 'src/contest/entities/contest.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { AssignmentContestController } from './controller/assignment-contest.controller';
import { CandidateEntity } from 'src/candidate/entities/candidate.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AssmContestEntity,
      ContestEntity,
      CandidateEntity,
    ]),
  ],
  controllers: [AssignmentContestController],
  providers: [AssignmentContestService, AssmContestEntity, JwtService],
  exports: [AssignmentContestService],
})
export class AssignmentContestModule {}
