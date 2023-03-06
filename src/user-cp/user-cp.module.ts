import { UserEntity } from 'src/users/entities/user.entity';
import { CompanyEntity } from './../company/entities/company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { UserCpService } from './services/user-cp.service';
import { UserCpController } from './controller/user-cp.controller';
import { UserCp } from './entities/user-cp.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports : [
    forwardRef(() =>UsersModule) ,
    forwardRef(() => CompanyEntity),
    TypeOrmModule.forFeature(
      [
        UserCp , 
        CompanyEntity , 
        UserEntity
      ])
    
    ] ,
  controllers: [UserCpController],
  providers: [UserCpService] ,
  exports : [UserCpService]
})
export class UserCpModule {}
