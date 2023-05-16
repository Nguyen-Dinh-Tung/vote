import { UserCaModule } from '../../user-ca/user-ca.module';
import { CompanyEntity } from '../../company/entities/company.entity';
import { CompanyModule } from 'src/company/company.module';
import { ContestEntity } from '../../contest/entities/contest.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { CandidateService } from '../../candidate/services/candidate.service';
import { CandidateController } from '../../candidate/controller/candidate.controller';
import { CandidateEntity } from '../../candidate/entities/candidate.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { UsersModule } from 'src/users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { CandidateRecomendEntity } from '../../candidate/entities/candidate-recomend.entity';
import { AssmContestEntity } from 'src/assignment-contest/entities/assignment-contest.entity';
import { UserCp } from 'src/user-cp/entities/user-cp.entity';
import { UserCpModule } from 'src/user-cp/user-cp.module';
import { UserEntity } from 'src/users/entities/user.entity';
import { AssignmentContestModule } from 'src/assignment-contest/assignment-contest.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CandidateEntity,
      TicketEntity,
      CandidateRecomendEntity,
      ContestEntity,
      AssmContestEntity,
      UserCp,
      UserEntity,
      CompanyEntity,
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => CompanyModule),
    forwardRef(() => UserCpModule),
    forwardRef(() => AssignmentContestModule),
    forwardRef(() => UserCaModule),
    MulterModule.register({
      dest: './data/images',
    }),
  ],
  controllers: [CandidateController],
  providers: [CandidateService, JwtService],
  exports: [CandidateService],
})
export class CandidateModule {}
