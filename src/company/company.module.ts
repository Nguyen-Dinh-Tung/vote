import { ContestEntity } from 'src/contest/entities/contest.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { CompanyService } from './services/company.service';
import { CompanyController } from './controller/company.controller';
import { CompanyEntity } from './entities/company.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports : [TypeOrmModule.forFeature([CompanyEntity]) , UsersModule  ,forwardRef(() => ContestEntity)] ,
  controllers: [CompanyController],
  providers: [CompanyService],
  exports : [CompanyService ]
})
export class CompanyModule {}
