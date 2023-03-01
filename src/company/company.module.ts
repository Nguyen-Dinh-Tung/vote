import { ContestEntity } from 'src/contest/entities/contest.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { CompanyService } from './services/company.service';
import { CompanyController } from './controller/company.controller';
import { CompanyEntity } from './entities/company.entity';
import { UsersModule } from 'src/users/users.module';
import { CompanyRecomend } from './entities/company-recomend.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports : [
    TypeOrmModule.forFeature([CompanyEntity , CompanyRecomend]) , 
    UsersModule  ,forwardRef(() => ContestEntity) ,
    MulterModule.register({
      dest : './files/images'
    }) 
] ,
  controllers: [CompanyController],
  providers: [CompanyService],
  exports : [CompanyService ]
})
export class CompanyModule {}
