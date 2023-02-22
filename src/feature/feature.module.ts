import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FeatureController } from './controller/feature.controller';
import { FeatureEntity } from './entities/feature.entity';
import { FeatureService } from './services.ts/feature.service';

@Module({
  controllers: [FeatureController],
  providers: [FeatureService , FeatureEntity] ,
  imports: [TypeOrmModule.forFeature([FeatureEntity])],
  exports : [FeatureService]
})
export class FeatureModule {}
