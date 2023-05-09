import { UserCpModule } from './../user-cp/user-cp.module';
import { ContestEntity } from 'src/contest/entities/contest.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { CompanyService } from './services/company.service';
import { CompanyController } from './controller/company.controller';
import { CompanyEntity } from './entities/company.entity';
import { UsersModule } from 'src/users/users.module';
import { CompanyRecomend } from './entities/company-recomend.entity';
import { MulterModule } from '@nestjs/platform-express';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserCp } from 'src/user-cp/entities/user-cp.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompanyEntity,
      CompanyRecomend,
      UserEntity,
      UserCp,
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => ContestEntity),
    forwardRef(() => UserCpModule),
    MulterModule.register({
      dest: './files/images',
    }),
  ],
  controllers: [CompanyController],
  providers: [CompanyService, JwtService],
  exports: [CompanyService],
})
export class CompanyModule {}
