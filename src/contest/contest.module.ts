import { AssignmentCompanyModule } from './../assignment-company/assignment-company.module';
import { CandidateEntity } from './../candidate/entities/candidate.entity';
import { CandidateModule } from 'src/common/constant/candidate.module';
import { CompanyEntity } from './../company/entities/company.entity';
import { ContestService } from './services/contest.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { ContestController } from './controller/contest.controller';
import { ContestEntity } from './entities/contest.entity';
import { UsersModule } from 'src/users/users.module';
import { CompanyModule } from 'src/company/company.module';
import { MulterModule } from '@nestjs/platform-express';
import { ContestRecomendEntity } from './entities/ContestRecomend.entity';
import { AssmCompanyEntity } from 'src/assignment-company/entities/assignment-company.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserCp } from 'src/user-cp/entities/user-cp.entity';
import { TicketModule } from 'src/ticket/ticket.module';
import { UserCoModule } from 'src/user-co/user-co.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContestEntity,
      ContestRecomendEntity,
      AssmCompanyEntity,
      CompanyEntity,
      UserCp,
      UserEntity,
      CandidateEntity,
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => CandidateModule),
    forwardRef(() => CompanyModule),
    forwardRef(() => TicketModule),
    forwardRef(() => CandidateModule),
    forwardRef(() => AssignmentCompanyModule),
    forwardRef(() => UserCoModule),
    MulterModule.register({
      dest: '/data/images',
    }),
  ],
  controllers: [ContestController],
  providers: [ContestService, JwtService],
  exports: [ContestService],
})
export class ContestModule {}
