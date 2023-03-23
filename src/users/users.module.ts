import { IoEntity } from '../uio/entities/io.entity';
import { CompanyEntity } from './../company/entities/company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UserEntity } from './entities/user.entity';
import { FeatureEntity } from 'src/feature/entities/feature.entity';
import { RtokenEntity } from 'src/common/extra database/entity/Rtoken';
import { UsersService } from './services/users.service';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { MulterModule } from '@nestjs/platform-express';
import { UserCpModule } from 'src/user-cp/user-cp.module';
import { UserCp } from 'src/user-cp/entities/user-cp.entity';
import { UioServices } from 'src/uio/services/uio.services';

@Module({
  imports : [TypeOrmModule.forFeature([
    UserEntity , 
    FeatureEntity , 
    RtokenEntity ,
    UserCp ,
    CompanyEntity ,
    IoEntity 
  ],
    ) ,
    MulterModule.register({
      dest : './files/images'
    }) ,
    forwardRef(() => UserCpModule) ,
    forwardRef(() => CompanyEntity) ,
],
  controllers: [UsersController ],
  providers: [UsersService , JwtStrategy , UioServices ],
  exports : [UsersService ]
})
export class UsersModule {
}
