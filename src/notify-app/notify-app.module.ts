import { Module } from '@nestjs/common';
import { NotifyAppService } from './services/notify-app.service';
import { NotifyAppController } from './controllers/notify-app.controller';

@Module({
  controllers: [NotifyAppController],
  providers: [NotifyAppService]
})
export class NotifyAppModule {}
