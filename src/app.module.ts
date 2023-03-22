import { ConnectIoEntity } from './uio/entity/connect.io.entity';
import { Uio } from './uio/uio.module';
import { addTransactionalDataSource } from 'typeorm-transactional/dist/common';
import { UserCo } from './user-co/entities/user-co.entity';
import { UserCp } from './user-cp/entities/user-cp.entity';
import { AssmContestEntity } from './assignment-contest/entities/assignment-contest.entity';
import { Roles } from 'src/common/enum/role.enum';
import { UsersService } from './users/services/users.service';
import { Module  ,forwardRef ,OnModuleInit, RequestMethod} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ContestModule } from './contest/contest.module';
import { CompanyModule } from './company/company.module';
import { CandidateModule } from './candidate/candidate.module';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './users/entities/user.entity';
import { CandidateEntity } from './candidate/entities/candidate.entity';
import { ContestEntity } from './contest/entities/contest.entity';
import { CompanyEntity } from './company/entities/company.entity';
import { RtokenEntity } from './common/extra database/entity/Rtoken';
import { FeatureEntity } from './feature/entities/feature.entity';
import { TicketModule } from './ticket/ticket.module';
import { FeatureModule } from './feature/feature.module';
import { TicketEntity } from './ticket/entities/ticket.entity';
import { FeatureService } from './feature/services.ts/feature.service';
import { Feature } from './common/enum/feature.enum';
import { FetureCode } from './common/enum/role.enum';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MiddlewareConsumer, NestModule } from '@nestjs/common/interfaces';
import { AssignmentContestModule } from './assignment-contest/assignment-contest.module';
import { AssignmentCompanyModule } from './assignment-company/assignment-company.module';
import { CandidateRecomendEntity } from './candidate/entities/candidate-recomend.entity';
import { ContestRecomendEntity } from './contest/entities/ContestRecomend.entity';
import { CompanyRecomend } from './company/entities/company-recomend.entity';
import { AssmCompanyEntity } from './assignment-company/entities/assignment-company.entity';
import { UserCoModule } from './user-co/user-co.module';
import { UserCpModule } from './user-cp/user-cp.module';
import { ShareCompanyMiddleWare } from './common/middleware/company.share.middleware';
import { UserCaModule } from './user-ca/user-ca.module';
import { UserCa } from './user-ca/entities/user-ca.entity';
import { DataSource } from 'typeorm';
import { NotifyAppModule } from './notify-app/notify-app.module';
import { AuthShareModule } from './auth-share/auth-share.module';
import { Socket } from './socket/socket.module';
import { IoEntity } from './uio/entity/io.entity';
import { RoomEntity } from './uio/entity/rooms.io.entity';
@Module({
  imports: [ 
    AuthModule,
    ContestModule, 
    CompanyModule, 
    CandidateModule,
    UsersModule,
    TicketModule,
    FeatureModule,
    AssignmentContestModule,
    AssignmentCompanyModule,
    UserCoModule,
    UserCpModule,
    UserCaModule,
    Socket , 
    Uio,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..', '../data/images/'),
      serveRoot: '/data/images/'
    }),
    TypeOrmModule.forRootAsync({
      
      useFactory(){
        return {
          type : 'mysql' ,
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '123123',
          database: 'missgrand',
          synchronize : true ,
          logging : true ,
          entities : [
            TicketEntity , RtokenEntity ,
            FeatureEntity , CompanyEntity,
            ContestEntity , CandidateEntity ,
            UserEntity , AssmContestEntity ,
            AssmCompanyEntity ,CandidateRecomendEntity ,
            ContestRecomendEntity , CompanyRecomend ,
            UserCp , UserCo,
            UserCa, IoEntity ,
            RoomEntity , ConnectIoEntity ,
          ],
        }
      },
      async dataSourceFactory(options){
        if(!options)
        throw new Error('Invalid option passed')
        return addTransactionalDataSource({
          name: 'missgrand',
          dataSource: new DataSource(options)
        })
      }
    } 
    ),
    NotifyAppModule,
    AuthShareModule,
  ],
  controllers: [AppController],
  providers: [AppService  ],
  exports : [
    ContestModule , 
    CompanyModule , 
    TicketModule , 
    CandidateModule
  ]
})
export class AppModule implements OnModuleInit , NestModule {
  constructor(private readonly userService : UsersService ,
    private readonly featureService : FeatureService  
  ){
  }
  configure(consumer : MiddlewareConsumer){
    consumer.apply(ShareCompanyMiddleWare)
    .exclude({path : 'assignment-company' , method : RequestMethod.POST})
  }
  async onModuleInit() {
    await this.userService.createAdminUser(
      {
        name : 'admin',
        email : 'admin@gmail.com' ,
        role : Roles.admin ,
        password : "123123" ,
        address : 'Ha Noi' ,
        code : 'adm',
        username : 'admin' ,
        historyCreate : 'Initial admin account'
      }
    )
    await this.featureService.create({
      code : FetureCode.admin ,
      feature : Feature.admin
    })
    await this.featureService.create({
      code : FetureCode.content ,
      feature : Feature.content
    })
    await this.featureService.create({
      code : FetureCode.default ,
      feature : Feature.default
    })
    await this.featureService.create({
      code : FetureCode.marketing ,
      feature : Feature.marketing
    })
  }
}


// type: 'mysql',
//       host: 'localhost',
//       port: 3306,
//       username: 'root',
//       password: '123123',
//       database: 'missgrand',
//       entities: [
//       TicketEntity , RtokenEntity ,
//       FeatureEntity , CompanyEntity,
//       ContestEntity , CandidateEntity ,
//       UserEntity , AssmContestEntity ,
//       AssmCompanyEntity ,CandidateRecomendEntity ,
//       ContestRecomendEntity , CompanyRecomend ,
//       UserCp , UserCo,
//       UserCa,
//     ],
//       synchronize: true,
//       logging : true
//     } ,