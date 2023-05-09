import { Module } from '@nestjs/common';
import { NotifyAppService } from './services/notify-app.service';
import { NotifyAppController } from './controllers/notify-app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailNotifyEntity } from './entities/notify-detail.entity';
import { NotifyAppEntity } from './entities/notify-app.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [NotifyAppController],
  providers: [NotifyAppService, JwtService],
  imports: [
    TypeOrmModule.forFeature([NotifyAppEntity, DetailNotifyEntity, UserEntity]),
  ],
})
export class NotifyAppModule {}
