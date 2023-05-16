import { InitModule } from './init/init.module';
import { addTransactionalDataSource } from 'typeorm-transactional/dist/common';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ContestModule } from './contest/contest.module';
import { CompanyModule } from './company/company.module';
import { CandidateModule } from './common/constant/candidate.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketModule } from './ticket/ticket.module';
import { FeatureModule } from './feature/feature.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AssignmentContestModule } from './assignment-contest/assignment-contest.module';
import { AssignmentCompanyModule } from './assignment-company/assignment-company.module';
import { UserCoModule } from './user-co/user-co.module';
import { UserCpModule } from './user-cp/user-cp.module';
import { UserCaModule } from './user-ca/user-ca.module';
import { DataSource } from 'typeorm';
import { NotifyAppModule } from './notify-app/notify-app.module';
import { AuthShareModule } from './auth-share/auth-share.module';
import { Socket } from './socket/socket.module';
import { RoomsData } from './rooms-data/rooms-data.module';
import { RoomsModule } from './rooms/rooms.module';
import { IoModule } from './io/io.module';
import { FriendsModule } from './friends/friends.module';
import { TokenModule } from './token/token.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '123123',
          database: 'missgrand',
          synchronize: true,
          logging: true,
          autoLoadEntities: true,
          entities: [join(__dirname, 'dist/src/**/*.entity.{ts,js}')],
        };
      },
      async dataSourceFactory(options) {
        if (!options) throw new Error('Invalid option passed');
        const datasource = new DataSource(options);
        return addTransactionalDataSource({
          dataSource: datasource,
        });
      },
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    RoomsData,
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
    Socket,
    IoModule,
    RoomsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../data/images/'),
      serveRoot: '/data/images/',
    }),
    NotifyAppModule,
    AuthShareModule,
    InitModule,
    FriendsModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
