import { ContestService } from './services/contest.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { ContestController } from './controller/contest.controller';
import { ContestEntity } from './entities/contest.entity';
import { UsersModule } from 'src/users/users.module';
import { CompanyModule } from 'src/company/company.module';
import { MulterModule } from '@nestjs/platform-express';
import { ContestRecomendEntity } from './entities/ContestRecomend.entity';

@Module({
  imports : [TypeOrmModule.forFeature([ContestEntity , ContestRecomendEntity]) , forwardRef(() => UsersModule) , forwardRef(() => CompanyModule)  , 
  MulterModule.register({
    dest : './files/images'
  }) ] ,
  controllers: [ContestController],
  providers: [ContestService] ,
  exports : [ContestService]
})
export class ContestModule {}