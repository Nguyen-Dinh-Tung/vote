import { CompanyEntity } from 'src/company/entities/company.entity';
import { ContestEntity } from 'src/contest/entities/contest.entity';
import { AssmCompanyEntity } from './entities/assignment-company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { AssignmentCompanyService } from './service/assignment-company.service';
import { AssignmentCompanyController } from './controller/assignment-company.controller';
import { ContestModule } from 'src/contest/contest.module';
import { CompanyModule } from 'src/company/company.module';

@Module({
  controllers: [AssignmentCompanyController],
  providers: [AssignmentCompanyService],
  imports : [TypeOrmModule.forFeature([AssmCompanyEntity , ContestEntity ,CompanyEntity]) , forwardRef(() =>ContestModule) , forwardRef(()=>CompanyModule)]
})
export class AssignmentCompanyModule {}
