import { Module } from '@nestjs/common';
import { UserCoService } from './user-co.service';
import { UserCoController } from './user-co.controller';

@Module({
  controllers: [UserCoController],
  providers: [UserCoService]
})
export class UserCoModule {}
