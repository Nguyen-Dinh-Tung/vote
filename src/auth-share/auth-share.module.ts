import { Module } from '@nestjs/common';
import { AuthShareService } from './auth-share.service';
import { AuthShareController } from './auth-share.controller';

@Module({
  controllers: [AuthShareController],
  providers: [AuthShareService]
})
export class AuthShareModule {}
